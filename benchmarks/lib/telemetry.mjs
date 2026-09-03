const SOURCE_KEYS = [
  "collectorId",
  "capturedAt",
  "clock",
  "energyInstrument",
  "temperatureInstrument",
];

function exactKeys(value, keys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  const expected = new Set(keys);
  for (const key of Object.keys(value)) {
    if (!expected.has(key)) throw new TypeError(`${label} contains unknown field ${key}`);
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) throw new TypeError(`${label} is missing ${key}`);
  }
}

function finite(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
}

function measured(value, unit) {
  return Object.freeze({ value, unit, evidenceState: "MEASURED" });
}

function optionalMeasurement(value, unit) {
  return value === null
    ? Object.freeze({ value: null, unit, evidenceState: "NOT_COLLECTED" })
    : measured(value, unit);
}

export function createTelemetryRecord({
  elapsedTimeMs,
  inputBytes,
  outputBytes,
  energyJ = null,
  temperatureC = null,
  error = null,
  source,
}) {
  finite(elapsedTimeMs, "elapsedTimeMs");
  if (elapsedTimeMs <= 0) throw new RangeError("elapsedTimeMs must be positive");
  for (const [label, value] of Object.entries({ inputBytes, outputBytes })) {
    if (!Number.isInteger(value) || value < 0) throw new RangeError(`${label} must be a non-negative integer`);
  }
  if (energyJ !== null) {
    finite(energyJ, "energyJ");
    if (energyJ < 0) throw new RangeError("energyJ must be non-negative");
  }
  if (temperatureC !== null) finite(temperatureC, "temperatureC");

  exactKeys(source, SOURCE_KEYS, "source");
  for (const key of ["collectorId", "capturedAt", "clock"]) {
    if (typeof source[key] !== "string" || source[key].trim() === "") {
      throw new TypeError(`source.${key} must be a non-empty string`);
    }
  }
  if (Number.isNaN(Date.parse(source.capturedAt))) throw new TypeError("source.capturedAt must be an ISO date-time");
  for (const key of ["energyInstrument", "temperatureInstrument"]) {
    if (source[key] !== null && (typeof source[key] !== "string" || source[key].trim() === "")) {
      throw new TypeError(`source.${key} must be a non-empty string or null`);
    }
  }
  if (energyJ !== null && source.energyInstrument === null) {
    throw new TypeError("source.energyInstrument is required when energy is measured");
  }
  if (temperatureC !== null && source.temperatureInstrument === null) {
    throw new TypeError("source.temperatureInstrument is required when temperature is measured");
  }

  if (error !== null) {
    exactKeys(error, ["code", "message"], "error");
    for (const key of ["code", "message"]) {
      if (typeof error[key] !== "string" || error[key].trim() === "") {
        throw new TypeError(`error.${key} must be a non-empty string`);
      }
    }
  }

  return Object.freeze({
    source: Object.freeze({ ...source }),
    measurements: Object.freeze({
      elapsedTime: measured(elapsedTimeMs, "ms"),
      inputBytes: measured(inputBytes, "byte"),
      outputBytes: measured(outputBytes, "byte"),
      energy: optionalMeasurement(energyJ, "J"),
      temperature: optionalMeasurement(temperatureC, "degC"),
    }),
    error: error === null ? null : Object.freeze({ ...error }),
  });
}
