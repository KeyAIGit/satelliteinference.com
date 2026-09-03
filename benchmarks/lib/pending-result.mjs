import { canonicalSha256 } from "./canonical-json.mjs";
import { benchmarkContract, validateRunResult, validateWorkloadConfig } from "./validate.mjs";

function optionalId(value, label) {
  if (value !== null && (typeof value !== "string" || value.trim() === "")) {
    throw new TypeError(`${label} must be a non-empty string or null`);
  }
  return value;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

export function generatePendingResult(
  config,
  { datasetManifestId = null, modelManifestId = null, adapterId = null } = {},
) {
  validateWorkloadConfig(config);
  const inputs = {
    datasetManifestId: optionalId(datasetManifestId, "datasetManifestId"),
    modelManifestId: optionalId(modelManifestId, "modelManifestId"),
    adapterId: optionalId(adapterId, "adapterId"),
  };
  const seed = {
    contractVersion: benchmarkContract.schemaVersion,
    workloadId: config.workloadId,
    workloadConfigVersion: config.configVersion,
    inputs,
    metricUnits: Object.fromEntries(
      benchmarkContract.metricKeys.map((key) => [key, config.metrics[key].unit]),
    ),
  };
  const runId = `pending-${config.workloadId}-${canonicalSha256(seed).slice(0, 16)}`;
  const measurements = Object.fromEntries(
    benchmarkContract.metricKeys.map((key) => [
      key,
      {
        value: null,
        unit: config.metrics[key].unit,
        evidenceState: "PENDING_MEASUREMENT",
      },
    ]),
  );
  const result = {
    schemaVersion: "1.0.0",
    resultVersion: "1.0.0",
    runId,
    workloadId: config.workloadId,
    workloadConfigVersion: config.configVersion,
    status: "PENDING_MEASUREMENT",
    inputs,
    measurements,
    provenance: null,
    error: null,
  };
  validateRunResult(result);
  return deepFreeze(result);
}
