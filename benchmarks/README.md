# Satellite Inference benchmark scaffold

This directory defines the public, reproducible contract for evaluating three
candidate first-flight inference workloads:

1. Optical cloud and quality screening
2. Optical wildfire, burn-scar, and change detection
3. SAR vessel detection

The scaffold is not a benchmark claim. No throughput, latency, accuracy,
energy, temperature, or data-reduction number is published until a real run is
executed and its data, model, software, hardware, and timing provenance are
captured. Generated pre-run records use `PENDING_MEASUREMENT`, and every numeric
measurement value is `null`.

Only one live sensor or data-path family will be selected for the first flight
after customer evidence, dataset rights, integration feasibility, and measured
ground results support the choice.

## Directory contract

- `workloads/` contains three stable workload IDs with versioned configurations.
- `templates/` contains pending dataset, model, and run-result manifests.
- `../public/benchmarks/schemas/` contains the canonical, publicly resolvable JSON Schema 2020-12 contracts.
- `lib/validate.mjs` applies fail-closed runtime validation without assuming a
  particular accelerator or inference framework.
- `lib/pending-result.mjs` creates deterministic pending run records.
- `lib/workload-adapter.mjs` defines the hardware-neutral adapter contract.
- `lib/telemetry.mjs` defines measurement capture for elapsed time, input and
  output bytes, energy when instrumented, temperature when instrumented, and
  error state.
- `diagnostics/nvidia-smi-readonly.mjs` exposes one fixed, read-only diagnostic
  query. It never changes clocks, power limits, persistence mode, drivers, or
  system configuration.

## Evidence states

| State | Meaning |
|---|---|
| `PENDING_MEASUREMENT` | No real benchmark measurement is attached. Numeric values must be `null`. |
| `MEASURED` | A real run and the required provenance are attached. |
| `NOT_COLLECTED` | An optional instrument, such as board-energy or temperature telemetry, was not available for a measured run. |

Planning assumptions and synthetic estimates belong in engineering models, not
in benchmark result fields.

## Generate a pending record

```bash
node benchmarks/scripts/generate-pending-result.mjs \
  benchmarks/workloads/optical-quality.v1.json
```

The command writes deterministic JSON to standard output. An optional second
argument writes that same JSON to a chosen path. Re-running it with identical
inputs produces the same `runId` and content.

## Run the contract tests

```bash
npm test
```

The tests reject unknown fields, malformed manifests, unsupported evidence
states, numeric values in pending results, incomplete adapters, nondeterministic
pending output, and any mutation-capable `nvidia-smi` invocation.
