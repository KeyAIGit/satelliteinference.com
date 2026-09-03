import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildNvidiaSmiReadOnlyInvocation, runNvidiaSmiReadOnlyDiagnostic } from "../benchmarks/diagnostics/nvidia-smi-readonly.mjs";
import { generatePendingResult } from "../benchmarks/lib/pending-result.mjs";
import { createTelemetryRecord } from "../benchmarks/lib/telemetry.mjs";
import {
  validateDatasetManifest,
  validateModelManifest,
  validateRunResult,
  validateWorkloadConfig,
} from "../benchmarks/lib/validate.mjs";
import {
  WORKLOAD_ADAPTER_CONTRACT_VERSION,
  assertWorkloadAdapter,
  executeWorkloadAdapter,
} from "../benchmarks/lib/workload-adapter.mjs";

const benchmarkRoot = fileURLToPath(new URL("../benchmarks/", import.meta.url));
const workloadRoot = fileURLToPath(new URL("../benchmarks/workloads/", import.meta.url));

async function loadJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));
}

async function loadWorkloads() {
  const filenames = (await readdir(workloadRoot)).filter((name) => name.endsWith(".json")).sort();
  return Promise.all(
    filenames.map(async (filename) => ({
      filename,
      value: JSON.parse(await readFile(new URL(`../benchmarks/workloads/${filename}`, import.meta.url), "utf8")),
    })),
  );
}

function clone(value) {
  return structuredClone(value);
}

test("publishes one primary, one secondary, and one control workload", async () => {
  const workloads = await loadWorkloads();
  assert.deepEqual(
    workloads.map(({ filename }) => filename),
    ["optical-quality.v1.json", "sar-vessel-detection.v1.json", "wildfire-change.v1.json"],
  );
  assert.deepEqual(
    workloads.map(({ value }) => value.workloadId).sort(),
    ["optical-quality", "sar-vessel-detection", "wildfire-change"],
  );
  assert.deepEqual(
    Object.fromEntries(workloads.map(({ value }) => [value.workloadId, value.programRole])),
    {
      "optical-quality": "CONTROL_WORKLOAD",
      "sar-vessel-detection": "PRIMARY_BENCHMARK_CANDIDATE",
      "wildfire-change": "SECONDARY_BENCHMARK_CANDIDATE",
    },
  );
  for (const { value } of workloads) {
    assert.equal(validateWorkloadConfig(value), true);
    assert.equal(value.evidenceState, "PENDING_MEASUREMENT");
    assert.equal(value.firstFlightCandidate, value.programRole !== "CONTROL_WORKLOAD");
    assert.equal(value.configVersion, "1.0.0");
  }
});

test("keeps schemas strict and pending manifest templates valid", async () => {
  for (const filename of [
    "workload-config.schema.json",
    "dataset-manifest.schema.json",
    "model-manifest.schema.json",
    "run-result.schema.json",
  ]) {
    const schema = await loadJson(`../public/benchmarks/schemas/${filename}`);
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.equal(schema.additionalProperties, false);
  }
  const dataset = await loadJson("../benchmarks/templates/dataset-manifest.template.json");
  const model = await loadJson("../benchmarks/templates/model-manifest.template.json");
  const result = await loadJson("../benchmarks/templates/run-result.template.json");
  assert.equal(validateDatasetManifest(dataset), true);
  assert.equal(validateModelManifest(model), true);
  assert.equal(validateRunResult(result), true);
});

test("generates deterministic pending records without numeric benchmark claims", async () => {
  const [{ value: config }] = await loadWorkloads();
  const first = generatePendingResult(config);
  const second = generatePendingResult(clone(config));
  assert.deepEqual(first, second);
  assert.match(first.runId, new RegExp(`^pending-${config.workloadId}-[a-f0-9]{16}$`));
  assert.equal(first.status, "PENDING_MEASUREMENT");
  assert.equal(first.provenance, null);
  assert.equal(first.error, null);
  assert.ok(!Object.hasOwn(first, "generatedAt"));
  for (const measurement of Object.values(first.measurements)) {
    assert.equal(measurement.value, null);
    assert.equal(measurement.evidenceState, "PENDING_MEASUREMENT");
  }
  assert.equal(validateRunResult(first), true);
});

test("fails closed on unknown fields, malformed inputs, and fabricated pending values", async () => {
  const [{ value: config }] = await loadWorkloads();
  const unknownConfig = { ...clone(config), claimedThroughput: 99 };
  assert.throws(() => validateWorkloadConfig(unknownConfig), /unknown field/);

  const numericConfigMetric = clone(config);
  numericConfigMetric.metrics.elapsedTime.value = 1;
  assert.throws(() => validateWorkloadConfig(numericConfigMetric), /unknown field value/);

  const pending = clone(generatePendingResult(config));
  pending.measurements.elapsedTime.value = 1;
  assert.throws(() => validateRunResult(pending), /pending results must contain null/);

  const falseMeasured = clone(generatePendingResult(config));
  falseMeasured.status = "MEASURED";
  falseMeasured.runId = `run-${config.workloadId}-unproven`;
  assert.throws(() => validateRunResult(falseMeasured), /must be set for a measured run|provenance/);

  const nonFinite = clone(generatePendingResult(config));
  nonFinite.status = "MEASURED";
  nonFinite.runId = `run-${config.workloadId}-nonfinite`;
  nonFinite.measurements.elapsedTime = { value: Number.NaN, unit: "ms", evidenceState: "MEASURED" };
  assert.throws(() => validateRunResult(nonFinite), /finite number/);
});

test("enforces the hardware-neutral WorkloadAdapter contract", async () => {
  assert.throws(
    () => assertWorkloadAdapter({ id: "incomplete", contractVersion: WORKLOAD_ADAPTER_CONTRACT_VERSION }),
    /describe must be a function/,
  );
  const calls = [];
  const adapter = {
    id: "contract-test-adapter",
    contractVersion: WORKLOAD_ADAPTER_CONTRACT_VERSION,
    describe: () => ({ modality: "TEST" }),
    prepare: (input) => {
      calls.push("prepare");
      return { prepared: input.sample };
    },
    run: (prepared) => {
      calls.push("run");
      return { raw: prepared.prepared };
    },
    postprocess: (raw) => {
      calls.push("postprocess");
      return { output: raw.raw };
    },
  };
  const result = await executeWorkloadAdapter(adapter, { sample: "content-addressed-input" }, { runId: "test" });
  assert.deepEqual(calls, ["prepare", "run", "postprocess"]);
  assert.deepEqual(result, { output: "content-addressed-input" });
  await assert.rejects(
    executeWorkloadAdapter({ ...adapter, run: async () => null }, { sample: "x" }, {}),
    /adapter.run result must be an object/,
  );
});

test("captures telemetry only with explicit instruments and provenance", () => {
  const telemetry = createTelemetryRecord({
    elapsedTimeMs: 12.5,
    inputBytes: 1024,
    outputBytes: 128,
    energyJ: null,
    temperatureC: null,
    source: {
      collectorId: "test-clock-v1",
      capturedAt: "2026-09-03T00:00:00.000Z",
      clock: "monotonic-test-clock",
      energyInstrument: null,
      temperatureInstrument: null,
    },
  });
  assert.equal(telemetry.measurements.elapsedTime.evidenceState, "MEASURED");
  assert.equal(telemetry.measurements.energy.evidenceState, "NOT_COLLECTED");
  assert.equal(telemetry.measurements.energy.value, null);
  assert.equal(telemetry.error, null);
  assert.throws(
    () => createTelemetryRecord({
      elapsedTimeMs: 1,
      inputBytes: 1,
      outputBytes: 1,
      energyJ: 2,
      source: {
        collectorId: "test",
        capturedAt: "2026-09-03T00:00:00.000Z",
        clock: "test",
        energyInstrument: null,
        temperatureInstrument: null,
      },
    }),
    /energyInstrument is required/,
  );
});

test("uses a fixed read-only nvidia-smi diagnostic invocation", async () => {
  const invocation = buildNvidiaSmiReadOnlyInvocation();
  assert.equal(invocation.file, "nvidia-smi");
  assert.deepEqual(invocation.args, [
    "--query-gpu=uuid,name,driver_version,pstate,power.draw,temperature.gpu,memory.total,memory.used,utilization.gpu",
    "--format=csv,noheader,nounits",
  ]);
  assert.ok(invocation.args.every((argument) => !/(^|,)(-pl|-lgc|-pm|--reset|--power-limit)(,|$)/.test(argument)));

  let observed;
  const diagnostic = await runNvidiaSmiReadOnlyDiagnostic({
    executor: async (file, args, options) => {
      observed = { file, args, options };
      return { stdout: "GPU-abc, NVIDIA H100 PCIe, 555.1, P0, 55.2, 42, 81559, 1024, 75\n" };
    },
  });
  assert.deepEqual(observed.args, invocation.args);
  assert.equal(diagnostic.mutationAllowed, false);
  assert.equal(diagnostic.devices[0].uuid, "GPU-abc");
  assert.equal(diagnostic.devices[0]["power.draw"], 55.2);
});

test("contains no em dash in the public benchmark scaffold", async () => {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const fullPath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await walk(fullPath);
      else files.push(fullPath);
    }
  }
  await walk(benchmarkRoot);
  for (const filename of files) {
    assert.ok(!(await readFile(filename, "utf8")).includes("\u2014"), `${filename} contains U+2014`);
  }
});
