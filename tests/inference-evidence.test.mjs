import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { calculateDownlinkScenario } from "../public/model/inference-evidence.mjs";

const dataPath = fileURLToPath(new URL("../public/data/inference-workloads.v1.json", import.meta.url));
const data = JSON.parse(await readFile(dataPath, "utf8"));

test("publishes the three workloads in program-priority order", () => {
  assert.deepEqual(data.workloads.map(({ id }) => id), [
    "sar-vessel-detection",
    "wildfire-change",
    "optical-quality",
  ]);
  assert.deepEqual(data.workloads.map(({ programRole }) => programRole), [
    "PRIMARY_BENCHMARK_CANDIDATE",
    "SECONDARY_BENCHMARK_CANDIDATE",
    "CONTROL_WORKLOAD",
  ]);
  assert.deepEqual(data.workloads.map(({ firstFlightCandidate }) => firstFlightCandidate), [true, true, false]);
});

test("keeps the primary SAR claim within a defensible public boundary", () => {
  const primary = data.workloads[0];
  assert.equal(primary.name, "SAR maritime vessel detection and scene prioritization");
  assert.match(primary.roleExplanation, /does not establish identity, intent, or illegal activity/i);
  assert.match(primary.roleExplanation, /temporal, AIS, RF/i);
});

test("uses the same workload IDs in the evidence lab and benchmark configs", async () => {
  const benchmarkIds = await Promise.all([
    "optical-quality.v1.json",
    "wildfire-change.v1.json",
    "sar-vessel-detection.v1.json",
  ].map(async (filename) => {
    const path = new URL(`../benchmarks/workloads/${filename}`, import.meta.url);
    return JSON.parse(await readFile(path, "utf8")).workloadId;
  }));
  assert.deepEqual(benchmarkIds.sort(), data.workloads.map(({ id }) => id).sort());
});

test("every displayed numeric input declares a unit and evidence status", () => {
  assert.ok(data.scenarioInputs.length > 0);
  for (const input of data.scenarioInputs) {
    assert.equal(typeof input.value, "number");
    assert.ok(input.unit.length > 0, `${input.id} has no unit`);
    assert.equal(input.evidenceStatus, "USER_INPUT");
    assert.ok(Number.isFinite(input.min) && Number.isFinite(input.max));
  }
});

test("calculates a deterministic reference scenario without calling it measured", () => {
  const first = calculateDownlinkScenario(data.scenarioInputs);
  const second = calculateDownlinkScenario(structuredClone(data.scenarioInputs));
  assert.deepEqual(first, second);
  assert.equal(first.rawVolumeMb, 38_400);
  assert.equal(first.resultVolumeMb, 86.4);
  assert.equal(first.scenarioReductionRatio, 444.4444444444444);
  assert.equal(first.evidenceStatus, "PENDING_MEASUREMENT");
});

test("fails closed for non-finite, non-positive, zero-denominator, and dimensionally invalid inputs", () => {
  const withChange = (id, change) => data.scenarioInputs.map((input) => input.id === id ? { ...input, ...change } : input);
  assert.throws(() => calculateDownlinkScenario(withChange("sceneCount", { value: Number.NaN })), /positive finite/);
  assert.throws(() => calculateDownlinkScenario(withChange("rawBytesPerSceneMb", { value: -1 })), /positive finite/);
  assert.throws(() => calculateDownlinkScenario(withChange("resultBytesPerPrioritySceneMb", { value: 0 })), /positive finite/);
  assert.throws(() => calculateDownlinkScenario(withChange("priorityFraction", { value: 1.01 })), /no greater than one/);
  assert.throws(() => calculateDownlinkScenario(withChange("rawBytesPerSceneMb", { unit: "GB/scene" })), /invalid identifier or unit/);
  assert.throws(() => calculateDownlinkScenario([...data.scenarioInputs, { ...data.scenarioInputs[0] }]), /exactly once/);
  assert.throws(() => calculateDownlinkScenario(data.scenarioInputs.map((input, index) => index === 1 ? { ...input, id: "sceneCount" } : input)), /duplicate/);
});

test("keeps all unmeasured fields and candidate workloads pending measurement", () => {
  const records = [...data.workloads, ...data.measurementFields];
  assert.ok(records.every(({ evidenceStatus }) => evidenceStatus === "PENDING_MEASUREMENT"));
  assert.ok(data.measurementFields.every(({ value }) => value === null));
  const forbidden = new Set(["MEASURED", "VERIFIED", "FLIGHT_PROVEN"]);
  assert.ok(records.every(({ evidenceStatus }) => !forbidden.has(evidenceStatus)));
});
