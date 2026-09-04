# SAR D0 smoke benchmark

This directory freezes the smallest honest execution plan for SAR maritime
vessel detection. It is a smoke-test plan, not a benchmark result and not a
claim that the workload is ready for flight or accepted by a customer.

## Primary score

The primary `taskScore` is localization F1 for maritime-object detections. A
prediction may match a reference object only when it is within a frozen 200 m
geodesic-distance tolerance. The ground-truth confidence set is frozen to
`HIGH` and `MEDIUM` for this D0 plan. Precision, recall, near-shore behavior,
classification, length estimation, latency, energy, and data reduction remain
separate supporting measurements.

The 200 m tolerance is a protocol setting. It is not a measured accuracy claim.

## What is runnable now

From the repository root, `npm test` validates the public workload contract,
pending manifests, D0 protocol, and evidence-state rules. The existing pending
result generator can create a deterministic result whose numeric measurements
are all `null`. The read-only NVIDIA diagnostic can report an attached GPU, but
it does not run inference and does not measure whole-system energy.

## What is not runnable yet

No SAR inference can run from this repository yet. The D0 configuration is
deliberately `PENDING_INPUT` because all of the following are still absent:

- accepted xView3 access terms and a recorded terms snapshot;
- selected scene IDs, local artifacts, byte sizes, and SHA-256 digests;
- a selected model implementation, exact weights, license, and SHA-256 digest;
- a SAR adapter for ingest, tiling, inference, geolocation, and postprocessing;
- a pinned Python and CUDA environment that has passed a local GPU smoke test;
- an executable scorer and a measured-result writer;
- time-series telemetry and an external instrument for payload-boundary energy.

The pending files contain no placeholder digest and no fabricated hardware or
performance value. They must be replaced by verified manifests before a
measured run is accepted.

## Planned first execution

The plan reserves three analysis-ready SAR scenes for a pipeline smoke test:
one offshore positive case, one near-shore positive case, and one low-density
or negative case. No scene has been selected yet. The selection must be written
to a manifest before anyone looks at benchmark output. Three scenes can prove
that the pipeline executes and scores; they cannot establish generalization or
customer utility.

The intended local baseline is an unverified NVIDIA GPU target. The conservative
execution shape is streamed, tiled inference with a measured batch size. A full
xView3 scene must not be loaded as one tensor. The exact accelerator, memory,
framework build, batch size, speed, temperature, and energy remain pending until
the machine is observed and a real run is captured.

## Unblock order

1. Record data access terms, select the three scene IDs, download the exact
   artifacts, and calculate their SHA-256 digests.
2. Pin one reference model, its source revision, exact weights, and license.
3. Capture the local hardware and software environment with read-only tools.
4. Implement and test the SAR workload adapter and frozen 200 m scorer.
5. Run the same smoke configuration twice and retain predictions, detailed
   metrics, telemetry, logs, and checksums.
6. Promote a result from `PENDING_MEASUREMENT` to `MEASURED` only when every
   required input and provenance field is verified.
