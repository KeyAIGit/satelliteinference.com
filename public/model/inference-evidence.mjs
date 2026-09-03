const EXPECTED_UNITS = Object.freeze({
  sceneCount: "scene/window",
  rawBytesPerSceneMb: "MB/scene",
  priorityFraction: "fraction",
  resultBytesPerPrioritySceneMb: "MB/priority-scene",
});

function assertRecord(input, id) {
  if (!input || typeof input !== "object") {
    throw new TypeError(`${id} must be an input record`);
  }
  if (input.id !== id || input.unit !== EXPECTED_UNITS[id]) {
    throw new RangeError(`${id} has an invalid identifier or unit`);
  }
  if (input.evidenceStatus !== "USER_INPUT") {
    throw new RangeError(`${id} must be labeled USER_INPUT`);
  }
  if (!Number.isFinite(input.value) || input.value <= 0) {
    throw new RangeError(`${id} must be a positive finite number`);
  }
}

export function calculateDownlinkScenario(inputRecords) {
  if (!Array.isArray(inputRecords)) {
    throw new TypeError("scenario inputs must be an array");
  }
  if (inputRecords.length !== Object.keys(EXPECTED_UNITS).length) {
    throw new RangeError("scenario inputs must contain each required record exactly once");
  }

  const inputs = new Map(inputRecords.map((input) => [input.id, input]));
  if (inputs.size !== inputRecords.length) {
    throw new RangeError("scenario inputs contain a duplicate identifier");
  }
  for (const id of Object.keys(EXPECTED_UNITS)) {
    assertRecord(inputs.get(id), id);
  }

  const sceneCount = inputs.get("sceneCount").value;
  const rawBytesPerSceneMb = inputs.get("rawBytesPerSceneMb").value;
  const priorityFraction = inputs.get("priorityFraction").value;
  const resultBytesPerPrioritySceneMb = inputs.get("resultBytesPerPrioritySceneMb").value;

  if (!Number.isInteger(sceneCount)) {
    throw new RangeError("sceneCount must be a positive integer");
  }
  if (priorityFraction > 1) {
    throw new RangeError("priorityFraction must be no greater than one");
  }

  const rawVolumeMb = sceneCount * rawBytesPerSceneMb;
  const prioritySceneCount = sceneCount * priorityFraction;
  const resultVolumeMb = prioritySceneCount * resultBytesPerPrioritySceneMb;
  if (!Number.isFinite(resultVolumeMb) || resultVolumeMb <= 0) {
    throw new RangeError("result volume must be a positive finite number");
  }

  const avoidedVolumeMb = rawVolumeMb - resultVolumeMb;
  const scenarioReductionRatio = rawVolumeMb / resultVolumeMb;
  if (![rawVolumeMb, prioritySceneCount, avoidedVolumeMb, scenarioReductionRatio].every(Number.isFinite)) {
    throw new RangeError("scenario output is not finite");
  }

  return Object.freeze({
    rawVolumeMb,
    prioritySceneCount,
    resultVolumeMb,
    avoidedVolumeMb,
    scenarioReductionRatio,
    unit: "MB/window",
    evidenceStatus: "PENDING_MEASUREMENT",
    calculationKind: "DETERMINISTIC_SCENARIO",
    disclaimer: "Arithmetic scenario only. No workload, hardware, customer, link, or flight performance has been measured.",
  });
}

export function formatDataVolume(megabytes) {
  if (!Number.isFinite(megabytes) || megabytes < 0) {
    throw new RangeError("megabytes must be a non-negative finite number");
  }
  if (megabytes >= 1000) return `${(megabytes / 1000).toFixed(2)} GB`;
  return `${megabytes.toFixed(1)} MB`;
}
