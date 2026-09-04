const WORKLOAD_IDS = new Set([
  "optical-quality",
  "wildfire-change",
  "sar-vessel-detection",
]);

const METRIC_KEYS = [
  "elapsedTime",
  "inputBytes",
  "outputBytes",
  "energy",
  "temperature",
  "taskScore",
];

const METRIC_UNITS = Object.freeze({
  elapsedTime: "ms",
  inputBytes: "byte",
  outputBytes: "byte",
  energy: "J",
  temperature: "degC",
  taskScore: "ratio",
});

const SHA256 = /^[a-f0-9]{64}$/;
const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const MANIFEST_VERSION = /^[0-9]+\.[0-9]+\.[0-9]+(?:-template)?$/;
const STABLE_ID = /^[a-z0-9][a-z0-9.-]+$/;

function invalid(path, message) {
  throw new TypeError(`${path}: ${message}`);
}

function plainObject(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    invalid(path, "must be an object");
  }
  return value;
}

function exactKeys(value, keys, path) {
  plainObject(value, path);
  const expected = new Set(keys);
  for (const key of Object.keys(value)) {
    if (!expected.has(key)) invalid(path, `unknown field ${key}`);
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) invalid(path, `missing field ${key}`);
  }
}

function string(value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    invalid(path, "must be a non-empty string");
  }
}

function nullableString(value, path) {
  if (value !== null) string(value, path);
}

function array(value, path) {
  if (!Array.isArray(value)) invalid(path, "must be an array");
}

function finite(value, path) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    invalid(path, "must be a finite number");
  }
}

function nonNegative(value, path) {
  finite(value, path);
  if (value < 0) invalid(path, "must be non-negative");
}

function nullableUri(value, path) {
  if (value === null) return;
  string(value, path);
  try {
    new URL(value);
  } catch {
    invalid(path, "must be an absolute URI");
  }
}

function uri(value, path) {
  string(value, path);
  try {
    new URL(value);
  } catch {
    invalid(path, "must be an absolute URI");
  }
}

function nullableDateTime(value, path) {
  if (value === null) return;
  string(value, path);
  if (Number.isNaN(Date.parse(value))) invalid(path, "must be an ISO date-time");
}

function dateTime(value, path) {
  string(value, path);
  if (Number.isNaN(Date.parse(value))) invalid(path, "must be an ISO date-time");
}

function nullableSha256(value, path) {
  if (value !== null && (typeof value !== "string" || !SHA256.test(value))) {
    invalid(path, "must be a lowercase SHA-256 digest or null");
  }
}

function validatePendingDependency(value, path, expectedTemplate) {
  exactKeys(value, ["manifestTemplate", "selectionStatus"], path);
  if (value.manifestTemplate !== expectedTemplate) {
    invalid(`${path}.manifestTemplate`, `must equal ${expectedTemplate}`);
  }
  if (value.selectionStatus !== "PENDING_INPUT") {
    invalid(`${path}.selectionStatus`, "must remain PENDING_INPUT before selection");
  }
}

function validateMetricDefinition(value, key, path) {
  exactKeys(value, ["label", "unit", "evidenceState"], path);
  string(value.label, `${path}.label`);
  if (value.unit !== METRIC_UNITS[key]) {
    invalid(`${path}.unit`, `must equal ${METRIC_UNITS[key]}`);
  }
  if (value.evidenceState !== "PENDING_MEASUREMENT") {
    invalid(`${path}.evidenceState`, "must remain PENDING_MEASUREMENT before a real run");
  }
}

export function validateWorkloadConfig(value) {
  exactKeys(
    value,
    [
      "schemaVersion",
      "configVersion",
      "workloadId",
      "title",
      "programRole",
      "inputModality",
      "task",
      "decisionOutput",
      "evidenceState",
      "firstFlightCandidate",
      "dataset",
      "model",
      "adapter",
      "metrics",
      "prohibitedClaims",
    ],
    "config",
  );

  if (value.schemaVersion !== "1.0.0") invalid("config.schemaVersion", "unsupported version");
  if (typeof value.configVersion !== "string" || !SEMVER.test(value.configVersion)) {
    invalid("config.configVersion", "must be semantic version text");
  }
  if (!WORKLOAD_IDS.has(value.workloadId)) invalid("config.workloadId", "unknown workload ID");
  string(value.title, "config.title");
  if (!["PRIMARY_BENCHMARK_CANDIDATE", "SECONDARY_BENCHMARK_CANDIDATE", "CONTROL_WORKLOAD"].includes(value.programRole)) {
    invalid("config.programRole", "unsupported program role");
  }
  if (!["OPTICAL_IMAGERY", "SAR_IMAGERY"].includes(value.inputModality)) {
    invalid("config.inputModality", "unsupported modality");
  }
  if (!["QUALITY_SCREENING", "WILDFIRE_AND_CHANGE_DETECTION", "VESSEL_DETECTION"].includes(value.task)) {
    invalid("config.task", "unsupported task");
  }
  string(value.decisionOutput, "config.decisionOutput");
  if (value.evidenceState !== "PENDING_MEASUREMENT") {
    invalid("config.evidenceState", "must remain PENDING_MEASUREMENT before a real run");
  }
  if (typeof value.firstFlightCandidate !== "boolean") {
    invalid("config.firstFlightCandidate", "must be boolean");
  }
  if (value.programRole === "CONTROL_WORKLOAD" && value.firstFlightCandidate) {
    invalid("config.firstFlightCandidate", "must be false for a control workload");
  }
  if (value.programRole !== "CONTROL_WORKLOAD" && !value.firstFlightCandidate) {
    invalid("config.firstFlightCandidate", "must be true for a flight candidate");
  }

  validatePendingDependency(
    value.dataset,
    "config.dataset",
    "../templates/dataset-manifest.template.json",
  );
  validatePendingDependency(
    value.model,
    "config.model",
    "../templates/model-manifest.template.json",
  );
  exactKeys(value.adapter, ["contract", "implementationStatus"], "config.adapter");
  if (value.adapter.contract !== "../lib/workload-adapter.mjs") {
    invalid("config.adapter.contract", "must reference the public adapter contract");
  }
  if (value.adapter.implementationStatus !== "PENDING_INPUT") {
    invalid("config.adapter.implementationStatus", "must remain PENDING_INPUT");
  }

  exactKeys(value.metrics, METRIC_KEYS, "config.metrics");
  for (const key of METRIC_KEYS) {
    validateMetricDefinition(value.metrics[key], key, `config.metrics.${key}`);
  }

  array(value.prohibitedClaims, "config.prohibitedClaims");
  if (value.prohibitedClaims.length === 0) invalid("config.prohibitedClaims", "must not be empty");
  for (const [index, claim] of value.prohibitedClaims.entries()) {
    string(claim, `config.prohibitedClaims[${index}]`);
  }
  return true;
}

export function validateDatasetManifest(value) {
  exactKeys(
    value,
    ["schemaVersion", "datasetManifestId", "version", "status", "title", "description", "modality", "source", "artifacts", "labels", "notes"],
    "dataset",
  );
  if (value.schemaVersion !== "1.0.0") invalid("dataset.schemaVersion", "unsupported version");
  if (typeof value.datasetManifestId !== "string" || !STABLE_ID.test(value.datasetManifestId)) {
    invalid("dataset.datasetManifestId", "must be a stable lowercase ID");
  }
  if (typeof value.version !== "string" || !MANIFEST_VERSION.test(value.version)) invalid("dataset.version", "must be semantic version text");
  if (!["PENDING_INPUT", "VERIFIED_INPUT"].includes(value.status)) invalid("dataset.status", "unknown state");
  string(value.title, "dataset.title");
  string(value.description, "dataset.description");
  if (value.modality !== null && !["OPTICAL_IMAGERY", "SAR_IMAGERY"].includes(value.modality)) {
    invalid("dataset.modality", "unsupported modality");
  }

  exactKeys(value.source, ["uri", "license", "acquiredAt", "sha256"], "dataset.source");
  nullableUri(value.source.uri, "dataset.source.uri");
  nullableString(value.source.license, "dataset.source.license");
  nullableDateTime(value.source.acquiredAt, "dataset.source.acquiredAt");
  nullableSha256(value.source.sha256, "dataset.source.sha256");

  array(value.artifacts, "dataset.artifacts");
  for (const [index, artifact] of value.artifacts.entries()) {
    const path = `dataset.artifacts[${index}]`;
    exactKeys(artifact, ["id", "uri", "sha256", "sampleCount"], path);
    string(artifact.id, `${path}.id`);
    nullableUri(artifact.uri, `${path}.uri`);
    nullableSha256(artifact.sha256, `${path}.sha256`);
    if (!Number.isInteger(artifact.sampleCount) || artifact.sampleCount < 0) {
      invalid(`${path}.sampleCount`, "must be a non-negative integer");
    }
  }

  exactKeys(value.labels, ["taxonomyUri", "annotationProtocol", "reviewStatus"], "dataset.labels");
  nullableUri(value.labels.taxonomyUri, "dataset.labels.taxonomyUri");
  nullableString(value.labels.annotationProtocol, "dataset.labels.annotationProtocol");
  if (!["PENDING_INPUT", "VERIFIED_INPUT"].includes(value.labels.reviewStatus)) {
    invalid("dataset.labels.reviewStatus", "unknown state");
  }
  array(value.notes, "dataset.notes");
  value.notes.forEach((note, index) => string(note, `dataset.notes[${index}]`));

  if (value.status === "PENDING_INPUT") {
    for (const [key, entry] of Object.entries(value.source)) {
      if (entry !== null) invalid(`dataset.source.${key}`, "must be null while pending");
    }
    if (value.artifacts.length !== 0) invalid("dataset.artifacts", "must be empty while pending");
    if (value.labels.reviewStatus !== "PENDING_INPUT") {
      invalid("dataset.labels.reviewStatus", "must remain pending");
    }
  } else {
    if (value.modality === null) invalid("dataset.modality", "must be set for verified input");
    for (const [key, entry] of Object.entries(value.source)) {
      if (entry === null) invalid(`dataset.source.${key}`, "must be set for verified input");
    }
    if (value.artifacts.length === 0) invalid("dataset.artifacts", "must contain hashed artifacts");
    for (const [index, artifact] of value.artifacts.entries()) {
      uri(artifact.uri, `dataset.artifacts[${index}].uri`);
      if (!SHA256.test(artifact.sha256)) {
        invalid(`dataset.artifacts[${index}].sha256`, "must be a lowercase SHA-256 digest");
      }
    }
    if (value.labels.reviewStatus !== "VERIFIED_INPUT") invalid("dataset.labels.reviewStatus", "must be verified");
  }
  return true;
}

export function validateModelManifest(value) {
  exactKeys(
    value,
    ["schemaVersion", "modelManifestId", "version", "status", "title", "framework", "architecture", "weights", "preprocessing", "postprocessing", "notes"],
    "model",
  );
  if (value.schemaVersion !== "1.0.0") invalid("model.schemaVersion", "unsupported version");
  if (typeof value.modelManifestId !== "string" || !STABLE_ID.test(value.modelManifestId)) {
    invalid("model.modelManifestId", "must be a stable lowercase ID");
  }
  if (typeof value.version !== "string" || !MANIFEST_VERSION.test(value.version)) invalid("model.version", "must be semantic version text");
  if (!["PENDING_INPUT", "VERIFIED_INPUT"].includes(value.status)) invalid("model.status", "unknown state");
  string(value.title, "model.title");
  nullableString(value.framework, "model.framework");
  nullableString(value.architecture, "model.architecture");
  exactKeys(value.weights, ["uri", "sha256", "license"], "model.weights");
  nullableUri(value.weights.uri, "model.weights.uri");
  nullableSha256(value.weights.sha256, "model.weights.sha256");
  nullableString(value.weights.license, "model.weights.license");
  for (const key of ["preprocessing", "postprocessing", "notes"]) {
    array(value[key], `model.${key}`);
    value[key].forEach((entry, index) => string(entry, `model.${key}[${index}]`));
  }

  if (value.status === "PENDING_INPUT") {
    for (const key of ["framework", "architecture"]) {
      if (value[key] !== null) invalid(`model.${key}`, "must be null while pending");
    }
    for (const [key, entry] of Object.entries(value.weights)) {
      if (entry !== null) invalid(`model.weights.${key}`, "must be null while pending");
    }
    if (value.preprocessing.length || value.postprocessing.length) {
      invalid("model", "processing steps must be empty while pending");
    }
  } else {
    for (const key of ["framework", "architecture"]) {
      if (value[key] === null) invalid(`model.${key}`, "must be set for verified input");
    }
    for (const [key, entry] of Object.entries(value.weights)) {
      if (entry === null) invalid(`model.weights.${key}`, "must be set for verified input");
    }
  }
  return true;
}

export function validateHardwareManifest(value) {
  exactKeys(
    value,
    ["schemaVersion", "hardwareManifestId", "version", "status", "title", "intendedTarget", "observed", "source", "notes"],
    "hardware",
  );
  if (value.schemaVersion !== "1.0.0") invalid("hardware.schemaVersion", "unsupported version");
  if (typeof value.hardwareManifestId !== "string" || !STABLE_ID.test(value.hardwareManifestId)) {
    invalid("hardware.hardwareManifestId", "must be a stable lowercase ID");
  }
  if (typeof value.version !== "string" || !SEMVER.test(value.version)) {
    invalid("hardware.version", "must be semantic version text");
  }
  if (!["PENDING_INPUT", "VERIFIED_INPUT"].includes(value.status)) {
    invalid("hardware.status", "unknown state");
  }
  string(value.title, "hardware.title");
  string(value.intendedTarget, "hardware.intendedTarget");

  const observedKeys = [
    "hostOperatingSystem",
    "cpu",
    "systemMemoryBytes",
    "acceleratorVendor",
    "acceleratorModel",
    "acceleratorMemoryBytes",
    "driverVersion",
    "cudaRuntime",
    "computeCapability",
  ];
  exactKeys(value.observed, observedKeys, "hardware.observed");
  for (const key of observedKeys) {
    const entry = value.observed[key];
    if (["systemMemoryBytes", "acceleratorMemoryBytes"].includes(key)) {
      if (entry !== null && (!Number.isInteger(entry) || entry < 1)) {
        invalid(`hardware.observed.${key}`, "must be a positive integer or null");
      }
    } else {
      nullableString(entry, `hardware.observed.${key}`);
    }
  }

  exactKeys(value.source, ["diagnostic", "capturedAt", "sha256"], "hardware.source");
  nullableString(value.source.diagnostic, "hardware.source.diagnostic");
  nullableDateTime(value.source.capturedAt, "hardware.source.capturedAt");
  nullableSha256(value.source.sha256, "hardware.source.sha256");
  array(value.notes, "hardware.notes");
  value.notes.forEach((note, index) => string(note, `hardware.notes[${index}]`));

  if (value.status === "PENDING_INPUT") {
    for (const [key, entry] of Object.entries(value.observed)) {
      if (entry !== null) invalid(`hardware.observed.${key}`, "must be null while pending");
    }
    for (const [key, entry] of Object.entries(value.source)) {
      if (entry !== null) invalid(`hardware.source.${key}`, "must be null while pending");
    }
  } else {
    for (const [key, entry] of Object.entries(value.observed)) {
      if (entry === null) invalid(`hardware.observed.${key}`, "must be set for verified input");
    }
    for (const [key, entry] of Object.entries(value.source)) {
      if (entry === null) invalid(`hardware.source.${key}`, "must be set for verified input");
    }
  }
  return true;
}

export function validateD0SmokeConfig(value) {
  exactKeys(
    value,
    [
      "schemaVersion",
      "configVersion",
      "protocolId",
      "status",
      "workloadId",
      "scope",
      "inputState",
      "measurementState",
      "manifests",
      "adapter",
      "scoring",
      "execution",
      "prohibitedClaims",
    ],
    "d0",
  );
  if (value.schemaVersion !== "1.0.0") invalid("d0.schemaVersion", "unsupported version");
  if (typeof value.configVersion !== "string" || !SEMVER.test(value.configVersion)) {
    invalid("d0.configVersion", "must be semantic version text");
  }
  if (value.protocolId !== "sar-d0-smoke") invalid("d0.protocolId", "must remain sar-d0-smoke");
  if (value.status !== "PENDING_INPUT") invalid("d0.status", "must remain PENDING_INPUT");
  if (value.workloadId !== "sar-vessel-detection") {
    invalid("d0.workloadId", "must remain sar-vessel-detection");
  }
  string(value.scope, "d0.scope");
  if (value.inputState !== "PENDING_INPUT") invalid("d0.inputState", "must remain PENDING_INPUT");
  if (value.measurementState !== "PENDING_MEASUREMENT") {
    invalid("d0.measurementState", "must remain PENDING_MEASUREMENT");
  }

  exactKeys(value.manifests, ["dataset", "model", "hardware"], "d0.manifests");
  const manifestPaths = {
    dataset: "../manifests/xview3-d0-smoke.dataset.pending.json",
    model: "../manifests/xview3-reference.model.pending.json",
    hardware: "../manifests/local-nvidia-gpu.hardware.pending.json",
  };
  for (const [key, expected] of Object.entries(manifestPaths)) {
    if (value.manifests[key] !== expected) invalid(`d0.manifests.${key}`, `must equal ${expected}`);
  }

  exactKeys(value.adapter, ["id", "implementationState"], "d0.adapter");
  if (value.adapter.id !== null) invalid("d0.adapter.id", "must be null while pending");
  if (value.adapter.implementationState !== "PENDING_INPUT") {
    invalid("d0.adapter.implementationState", "must remain PENDING_INPUT");
  }

  exactKeys(
    value.scoring,
    ["primaryMetric", "matching", "groundTruthConfidence", "scorerState", "evidenceState"],
    "d0.scoring",
  );
  if (value.scoring.primaryMetric !== "localizationF1") {
    invalid("d0.scoring.primaryMetric", "must remain localizationF1");
  }
  exactKeys(value.scoring.matching, ["method", "tolerance", "unit"], "d0.scoring.matching");
  if (value.scoring.matching.method !== "GEODESIC_DISTANCE") {
    invalid("d0.scoring.matching.method", "must remain GEODESIC_DISTANCE");
  }
  if (value.scoring.matching.tolerance !== 200) {
    invalid("d0.scoring.matching.tolerance", "must remain 200");
  }
  if (value.scoring.matching.unit !== "m") invalid("d0.scoring.matching.unit", "must remain m");
  if (
    !Array.isArray(value.scoring.groundTruthConfidence)
    || value.scoring.groundTruthConfidence.length !== 2
    || value.scoring.groundTruthConfidence[0] !== "HIGH"
    || value.scoring.groundTruthConfidence[1] !== "MEDIUM"
  ) {
    invalid("d0.scoring.groundTruthConfidence", "must remain [HIGH, MEDIUM]");
  }
  if (value.scoring.scorerState !== "PENDING_INPUT") {
    invalid("d0.scoring.scorerState", "must remain PENDING_INPUT");
  }
  if (value.scoring.evidenceState !== "PENDING_MEASUREMENT") {
    invalid("d0.scoring.evidenceState", "must remain PENDING_MEASUREMENT");
  }

  exactKeys(
    value.execution,
    ["plannedSceneCount", "sceneSelectionState", "resultState"],
    "d0.execution",
  );
  if (value.execution.plannedSceneCount !== 3) {
    invalid("d0.execution.plannedSceneCount", "must remain 3");
  }
  if (value.execution.sceneSelectionState !== "PENDING_INPUT") {
    invalid("d0.execution.sceneSelectionState", "must remain PENDING_INPUT");
  }
  if (value.execution.resultState !== "PENDING_MEASUREMENT") {
    invalid("d0.execution.resultState", "must remain PENDING_MEASUREMENT");
  }

  array(value.prohibitedClaims, "d0.prohibitedClaims");
  if (value.prohibitedClaims.length === 0) invalid("d0.prohibitedClaims", "must not be empty");
  value.prohibitedClaims.forEach((claim, index) => string(claim, `d0.prohibitedClaims[${index}]`));
  return true;
}

function validateInputIds(inputs) {
  exactKeys(inputs, ["datasetManifestId", "modelManifestId", "adapterId"], "result.inputs");
  for (const [key, value] of Object.entries(inputs)) nullableString(value, `result.inputs.${key}`);
}

function validateMeasurement(value, key) {
  const path = `result.measurements.${key}`;
  exactKeys(value, ["value", "unit", "evidenceState"], path);
  if (value.value !== null) finite(value.value, `${path}.value`);
  if (value.unit !== METRIC_UNITS[key]) invalid(`${path}.unit`, `must equal ${METRIC_UNITS[key]}`);
  if (!["PENDING_MEASUREMENT", "MEASURED", "NOT_COLLECTED"].includes(value.evidenceState)) {
    invalid(`${path}.evidenceState`, "unknown state");
  }
}

function validateProvenance(value) {
  exactKeys(
    value,
    ["datasetSha256", "modelSha256", "softwareCommit", "hardwareDescriptorSha256", "startedAt", "completedAt"],
    "result.provenance",
  );
  for (const key of ["datasetSha256", "modelSha256", "hardwareDescriptorSha256"]) {
    if (typeof value[key] !== "string" || !SHA256.test(value[key])) {
      invalid(`result.provenance.${key}`, "must be a lowercase SHA-256 digest");
    }
  }
  if (typeof value.softwareCommit !== "string" || !/^[a-f0-9]{7,64}$/.test(value.softwareCommit)) {
    invalid("result.provenance.softwareCommit", "must be a source commit hash");
  }
  for (const key of ["startedAt", "completedAt"]) dateTime(value[key], `result.provenance.${key}`);
  if (Date.parse(value.completedAt) < Date.parse(value.startedAt)) {
    invalid("result.provenance.completedAt", "must not precede startedAt");
  }
}

function validateError(value) {
  if (value === null) return;
  exactKeys(value, ["code", "message"], "result.error");
  string(value.code, "result.error.code");
  string(value.message, "result.error.message");
}

export function validateRunResult(value) {
  exactKeys(
    value,
    ["schemaVersion", "resultVersion", "runId", "workloadId", "workloadConfigVersion", "status", "inputs", "measurements", "provenance", "error"],
    "result",
  );
  if (value.schemaVersion !== "1.0.0" || value.resultVersion !== "1.0.0") {
    invalid("result", "unsupported schema or result version");
  }
  if (typeof value.runId !== "string" || !/^(pending|run)-[a-z0-9-]+$/.test(value.runId)) {
    invalid("result.runId", "invalid run ID");
  }
  if (!WORKLOAD_IDS.has(value.workloadId)) invalid("result.workloadId", "unknown workload ID");
  if (typeof value.workloadConfigVersion !== "string" || !SEMVER.test(value.workloadConfigVersion)) {
    invalid("result.workloadConfigVersion", "must be semantic version text");
  }
  if (!["PENDING_MEASUREMENT", "MEASURED", "FAILED"].includes(value.status)) {
    invalid("result.status", "unknown state");
  }
  validateInputIds(value.inputs);
  exactKeys(value.measurements, METRIC_KEYS, "result.measurements");
  for (const key of METRIC_KEYS) validateMeasurement(value.measurements[key], key);
  if (value.provenance !== null) validateProvenance(value.provenance);
  validateError(value.error);

  if (value.status === "PENDING_MEASUREMENT") {
    if (!value.runId.startsWith("pending-")) invalid("result.runId", "must use the pending prefix");
    for (const key of METRIC_KEYS) {
      const metric = value.measurements[key];
      if (metric.value !== null || metric.evidenceState !== "PENDING_MEASUREMENT") {
        invalid(`result.measurements.${key}`, "pending results must contain null and PENDING_MEASUREMENT");
      }
    }
    if (value.provenance !== null) invalid("result.provenance", "must be null while pending");
    if (value.error !== null) invalid("result.error", "must be null while pending");
  }

  if (value.status === "MEASURED") {
    if (!value.runId.startsWith("run-")) invalid("result.runId", "must use the run prefix");
    for (const [key, inputId] of Object.entries(value.inputs)) {
      if (inputId === null) invalid(`result.inputs.${key}`, "must be set for a measured run");
    }
    if (value.provenance === null) invalid("result.provenance", "is required for a measured run");
    if (value.error !== null) invalid("result.error", "must be null for a measured run");
    for (const key of ["elapsedTime", "inputBytes", "outputBytes", "taskScore"]) {
      const metric = value.measurements[key];
      if (metric.evidenceState !== "MEASURED" || metric.value === null) {
        invalid(`result.measurements.${key}`, "must contain a measured value");
      }
    }
    if (value.measurements.elapsedTime.value <= 0) invalid("result.measurements.elapsedTime.value", "must be positive");
    for (const key of ["inputBytes", "outputBytes"]) {
      const measurement = value.measurements[key];
      if (!Number.isInteger(measurement.value) || measurement.value < 0) {
        invalid(`result.measurements.${key}.value`, "must be a non-negative integer");
      }
    }
    const taskScore = value.measurements.taskScore.value;
    if (taskScore < 0 || taskScore > 1) invalid("result.measurements.taskScore.value", "must be in [0, 1]");
    for (const key of ["energy", "temperature"]) {
      const metric = value.measurements[key];
      const notCollected = metric.value === null && metric.evidenceState === "NOT_COLLECTED";
      const measured = metric.value !== null && metric.evidenceState === "MEASURED";
      if (!notCollected && !measured) invalid(`result.measurements.${key}`, "must be measured or NOT_COLLECTED");
      if (measured && key === "energy") nonNegative(metric.value, `result.measurements.${key}.value`);
    }
  }

  if (value.status === "FAILED") {
    if (!value.runId.startsWith("run-")) invalid("result.runId", "must use the run prefix");
    if (value.error === null) invalid("result.error", "is required for a failed run");
    for (const key of METRIC_KEYS) {
      const metric = value.measurements[key];
      if (metric.value !== null || metric.evidenceState !== "NOT_COLLECTED") {
        invalid(`result.measurements.${key}`, "failed records must not publish benchmark measurements");
      }
    }
  }
  return true;
}

export const benchmarkContract = Object.freeze({
  schemaVersion: "1.0.0",
  workloadIds: Object.freeze([...WORKLOAD_IDS]),
  metricKeys: Object.freeze([...METRIC_KEYS]),
  metricUnits: METRIC_UNITS,
});
