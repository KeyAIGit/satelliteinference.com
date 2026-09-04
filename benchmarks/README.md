# Satellite Inference benchmark scaffold

This directory defines the public, reproducible contract for evaluating three
workloads with distinct program roles:

1. Primary flight candidate: SAR maritime vessel detection and scene prioritization
2. Secondary flight candidate: wildfire, burn-scar, and change detection
3. Control workload: optical cloud and quality screening

The scaffold is not a benchmark claim. No throughput, latency, accuracy,
energy, temperature, or data-reduction number is published until a real run is
executed and its data, model, software, hardware, and timing provenance are
captured. Generated pre-run records use `PENDING_MEASUREMENT`, and every numeric
measurement value is `null`.

SAR maritime is the current program priority, not a validated customer selection.
A single SAR image does not establish identity, intent, or illegal activity. Any activity cue requires temporal, AIS, RF, or other corroborating context.
It advances only if customer evidence, dataset rights, integration feasibility,
and measured ground results support it. Wildfire and change remains the secondary
application. Optical quality remains a control for the ingest, preprocessing,
telemetry, and measurement chain.

## Directory contract

- `workloads/` contains three stable workload IDs with versioned configurations.
- `sar/` contains the frozen pending D0 smoke protocol and its input manifests.
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
| `PENDING_INPUT` | A required dataset, model, adapter, or hardware description has not been selected and verified. Input manifests must not contain placeholder hashes or pretend that an intended device was observed. |
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
