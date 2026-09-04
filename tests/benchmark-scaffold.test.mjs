import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildNvidiaSmiReadOnlyInvocation, runNvidiaSmiReadOnlyDiagnostic } from "../benchmarks/diagnostics/nvidia-smi-readonly.mjs";
import { generatePendingResult } from "../benchmarks/lib/pending-result.mjs";
import { createTelemetryRecord } from "../benchmarks/lib/telemetry.mjs";
import {
  validateD0SmokeConfig,
  validateDatasetManifest,
  validateHardwareManifest,
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

function verifiedInputProperties(schema) {
  const verifiedInputRule = schema.allOf.find(
    (rule) => rule.if?.properties?.status?.const === "VERIFIED_INPUT",
  );
  assert.ok(verifiedInputRule, `${schema.title} must define VERIFIED_INPUT constraints`);
  return verifiedInputRule.then.properties;
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
    "d0-smoke-config.schema.json",
    "hardware-manifest.schema.json",
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

test("encodes runtime VERIFIED_INPUT completeness rules in the public manifest schemas", async () => {
  const datasetSchema = await loadJson("../public/benchmarks/schemas/dataset-manifest.schema.json");
  const modelSchema = await loadJson("../public/benchmarks/schemas/model-manifest.schema.json");
  const dataset = verifiedInputProperties(datasetSchema);
  const model = verifiedInputProperties(modelSchema);

  assert.equal(dataset.modality.type, "string");
  for (const key of ["uri", "license", "acquiredAt", "sha256"]) {
    assert.equal(dataset.source.properties[key].type, "string");
  }
  assert.equal(dataset.artifacts.minItems, 1);
  assert.equal(dataset.labels.properties.reviewStatus.const, "VERIFIED_INPUT");

  assert.equal(model.framework.type, "string");
  assert.equal(model.architecture.type, "string");
  for (const key of ["uri", "sha256", "license"]) {
    assert.equal(model.weights.properties[key].type, "string");
  }
});

test("rejects incomplete VERIFIED_INPUT dataset and model manifests", async () => {
  const dataset = await loadJson("../benchmarks/templates/dataset-manifest.template.json");
  Object.assign(dataset, {
    datasetManifestId: "verified-dataset.test",
    version: "1.0.0",
    status: "VERIFIED_INPUT",
    modality: "SAR_IMAGERY",
    source: {
      uri: "https://example.com/datasets/test",
      license: "CC-BY-4.0",
      acquiredAt: "2026-09-04T00:00:00.000Z",
      sha256: "a".repeat(64),
    },
    artifacts: [{
      id: "scene-1",
      uri: "https://example.com/datasets/test/scene-1.tif",
      sha256: "b".repeat(64),
      sampleCount: 1,
    }],
    labels: {
      taxonomyUri: null,
      annotationProtocol: null,
      reviewStatus: "VERIFIED_INPUT",
    },
  });
  assert.equal(validateDatasetManifest(dataset), true);

  const incompleteDatasets = [
    ["missing modality", (value) => { value.modality = null; }, /modality.*must be set/],
    ["missing source URI", (value) => { value.source.uri = null; }, /source\.uri.*must be set/],
    ["missing source license", (value) => { value.source.license = null; }, /source\.license.*must be set/],
    ["missing acquisition time", (value) => { value.source.acquiredAt = null; }, /source\.acquiredAt.*must be set/],
    ["missing source hash", (value) => { value.source.sha256 = null; }, /source\.sha256.*must be set/],
    ["missing artifacts", (value) => { value.artifacts = []; }, /must contain hashed artifacts/],
    ["unverified labels", (value) => { value.labels.reviewStatus = "PENDING_INPUT"; }, /reviewStatus.*must be verified/],
  ];
  for (const [description, mutate, expected] of incompleteDatasets) {
    const incomplete = clone(dataset);
    mutate(incomplete);
    assert.throws(() => validateDatasetManifest(incomplete), expected, description);
  }

  const model = await loadJson("../benchmarks/templates/model-manifest.template.json");
  Object.assign(model, {
    modelManifestId: "verified-model.test",
    version: "1.0.0",
    status: "VERIFIED_INPUT",
    framework: "ONNX Runtime",
    architecture: "Reference detector",
    weights: {
      uri: "https://example.com/models/test.onnx",
      sha256: "c".repeat(64),
      license: "Apache-2.0",
    },
  });
  assert.equal(validateModelManifest(model), true);

  const incompleteModels = [
    ["missing framework", (value) => { value.framework = null; }, /framework.*must be set/],
    ["missing architecture", (value) => { value.architecture = null; }, /architecture.*must be set/],
    ["missing weights URI", (value) => { value.weights.uri = null; }, /weights\.uri.*must be set/],
    ["missing weights hash", (value) => { value.weights.sha256 = null; }, /weights\.sha256.*must be set/],
    ["missing weights license", (value) => { value.weights.license = null; }, /weights\.license.*must be set/],
  ];
  for (const [description, mutate, expected] of incompleteModels) {
    const incomplete = clone(model);
    mutate(incomplete);
    assert.throws(() => validateModelManifest(incomplete), expected, description);
  }
});

test("freezes an honest pending SAR D0 smoke protocol", async () => {
  const config = await loadJson("../benchmarks/sar/configs/d0-smoke.v1.json");
  const dataset = await loadJson("../benchmarks/sar/manifests/xview3-d0-smoke.dataset.pending.json");
  const model = await loadJson("../benchmarks/sar/manifests/xview3-reference.model.pending.json");
  const hardware = await loadJson("../benchmarks/sar/manifests/local-nvidia-gpu.hardware.pending.json");
  const workload = await loadJson("../benchmarks/workloads/sar-vessel-detection.v1.json");
  const configSchema = await loadJson("../public/benchmarks/schemas/d0-smoke-config.schema.json");
  const hardwareSchema = await loadJson("../public/benchmarks/schemas/hardware-manifest.schema.json");

  assert.equal(validateD0SmokeConfig(config), true);
  assert.equal(validateDatasetManifest(dataset), true);
  assert.equal(validateModelManifest(model), true);
  assert.equal(validateHardwareManifest(hardware), true);

  assert.equal(config.status, "PENDING_INPUT");
  assert.equal(config.measurementState, "PENDING_MEASUREMENT");
  assert.equal(config.scoring.primaryMetric, "localizationF1");
  assert.deepEqual(config.scoring.matching, {
    method: "GEODESIC_DISTANCE",
    tolerance: 200,
    unit: "m",
  });
  assert.deepEqual(config.scoring.groundTruthConfidence, ["HIGH", "MEDIUM"]);
  assert.equal(
    workload.metrics.taskScore.label,
    "Localization F1 for maritime-object detections using a frozen 200 m matching tolerance",
  );

  assert.equal(dataset.status, "PENDING_INPUT");
  assert.ok(Object.values(dataset.source).every((value) => value === null));
  assert.deepEqual(dataset.artifacts, []);
  assert.equal(model.status, "PENDING_INPUT");
  assert.equal(model.framework, null);
  assert.equal(model.architecture, null);
  assert.ok(Object.values(model.weights).every((value) => value === null));
  assert.equal(hardware.status, "PENDING_INPUT");
  assert.ok(Object.values(hardware.observed).every((value) => value === null));
  assert.ok(Object.values(hardware.source).every((value) => value === null));

  assert.equal(configSchema.properties.scoring.properties.primaryMetric.const, "localizationF1");
  assert.equal(configSchema.properties.scoring.properties.matching.properties.tolerance.const, 200);
  assert.deepEqual(hardwareSchema.properties.status.enum, ["PENDING_INPUT", "VERIFIED_INPUT"]);
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

  const d0 = await loadJson("../benchmarks/sar/configs/d0-smoke.v1.json");
  d0.scoring.matching.tolerance = 100;
  assert.throws(() => validateD0SmokeConfig(d0), /must remain 200/);

  const pendingHardware = await loadJson("../benchmarks/sar/manifests/local-nvidia-gpu.hardware.pending.json");
  pendingHardware.observed.acceleratorModel = "Unverified accelerator";
  assert.throws(() => validateHardwareManifest(pendingHardware), /must be null while pending/);

  const pendingDataset = await loadJson("../benchmarks/sar/manifests/xview3-d0-smoke.dataset.pending.json");
  pendingDataset.source.sha256 = "0".repeat(64);
  assert.throws(() => validateDatasetManifest(pendingDataset), /must be null while pending/);
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
