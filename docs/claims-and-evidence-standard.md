# Claims and evidence standard

Version: 1.0
Effective: 2026-09-03

## Core rule

Every material technical or commercial statement must identify what kind of statement it is and what evidence would advance it.

## Evidence states

| State | Meaning | Public use |
|---|---|---|
| `EXTERNAL_REFERENCE` | A claim attributable to a named public source | Cite the source and access date |
| `CALCULATED` | A reproducible result derived from disclosed inputs and equations | Publish units, inputs, model revision, and limitations |
| `WORKING_ASSUMPTION` | A planning input not yet validated | Label it and state the replacement evidence |
| `PENDING_MEASUREMENT` | A benchmark or operational result that has not been measured | Leave result fields empty or null |
| `TBD_BY_SUPPLIER` | A value requiring selected supplier data or acceptance | Do not substitute an uncited estimate |
| `NOTIONAL_GEOMETRY` | A communication model, not manufacturing geometry | State that it is not flight CAD |

## Benchmark release rule

A benchmark result may move beyond `PENDING_MEASUREMENT` only when its record includes:

1. dataset identity, license, files, hashes, split, and preprocessing;
2. model identity, version, artifact hash, runtime, and numeric precision;
3. hardware and software configuration;
4. start and end timestamps, elapsed time, errors, and telemetry provenance;
5. task metric definition and result artifact;
6. reviewer identity and release decision.

Estimated throughput, latency, accuracy, energy, and downlink reduction are not published as measured values.

## Commercial claims

No public material may imply a customer contract, paid pilot, capacity reservation, supplier selection, launch booking, regulatory determination, or flight heritage unless a reviewable record supports the exact wording.

## Review questions

Before release, ask:

- Is the number measured, calculated, referenced, targeted, or unknown?
- Are its unit, scope, date, source, and limitations visible?
- Could a reader mistake a ground result for flight performance?
- Could a reader mistake a candidate workload for a selected mission?
- Does the statement expose private correspondence, pricing, export-controlled data, or personal information?
