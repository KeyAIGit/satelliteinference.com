export const WORKLOAD_ADAPTER_CONTRACT_VERSION = "1.0.0";
export const WORKLOAD_ADAPTER_METHODS = Object.freeze([
  "describe",
  "prepare",
  "run",
  "postprocess",
]);

/**
 * Hardware-neutral workload adapter contract.
 *
 * An adapter owns workload-specific decoding, preprocessing, inference
 * invocation, and postprocessing. The harness owns manifests, provenance,
 * telemetry, and result validation. No GPU vendor, driver, or framework API is
 * part of this interface.
 *
 * @typedef {object} WorkloadAdapter
 * @property {string} id Stable adapter ID.
 * @property {"1.0.0"} contractVersion Adapter contract version.
 * @property {() => object} describe Returns non-secret capability metadata.
 * @property {(input: object, context: object) => Promise<object>|object} prepare
 * @property {(prepared: object, context: object) => Promise<object>|object} run
 * @property {(raw: object, context: object) => Promise<object>|object} postprocess
 */

function plainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

export function assertWorkloadAdapter(adapter) {
  plainObject(adapter, "adapter");
  if (typeof adapter.id !== "string" || adapter.id.trim() === "") {
    throw new TypeError("adapter.id must be a non-empty string");
  }
  if (adapter.contractVersion !== WORKLOAD_ADAPTER_CONTRACT_VERSION) {
    throw new TypeError(`adapter.contractVersion must equal ${WORKLOAD_ADAPTER_CONTRACT_VERSION}`);
  }
  for (const method of WORKLOAD_ADAPTER_METHODS) {
    if (typeof adapter[method] !== "function") {
      throw new TypeError(`adapter.${method} must be a function`);
    }
  }
  return adapter;
}

export function defineWorkloadAdapter(adapter) {
  assertWorkloadAdapter(adapter);
  return Object.freeze(adapter);
}

export async function executeWorkloadAdapter(adapter, input, context) {
  assertWorkloadAdapter(adapter);
  plainObject(input, "input");
  plainObject(context, "context");
  const prepared = plainObject(await adapter.prepare(input, context), "adapter.prepare result");
  const raw = plainObject(await adapter.run(prepared, context), "adapter.run result");
  return plainObject(await adapter.postprocess(raw, context), "adapter.postprocess result");
}
