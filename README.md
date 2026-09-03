# Satellite Inference

Public website and publication layer for Satellite Inference™, currently operated by RFID INC, a Delaware corporation.

> Compute where space data begins.

The site explains a staged path from a 1 kW ground engineering tile to a first 10 kW continuous-compute node in low Earth orbit. Its interactive Orbit Lab moves from 200 km to GEO using deterministic, client-side calculations for orbital period, worst-case beta-0 eclipse, and vacuum propagation delay. LEO is the mission baseline; GEO remains a comparison case. The public Inference Evidence Lab screens three ground workload candidates without inventing benchmark results.

## Public mission names

| Name | Identifier | Continuous compute |
|---|---|---:|
| Ground Engineering Tile | Ground / 1 kW | 1 kW, ground only |
| 10 kW Orbital Node | LEO / 10 kW | 10 kW |
| 100 kW Orbital Module | Scale / 100 kW | 100 kW |
| Megawatt Orbital Network | Network / 1 MW | 1 MW aggregate |

Continuous compute, solar generation and aggregate network capacity are stated separately. The Megawatt Orbital Network is exactly a ten-module reference architecture: 10 x 100 kW continuous compute = 1 MW aggregate.

## Public model contract

`public/data/site-model.json` publishes the Rev C screening outputs. The inputs and generic equations needed to reproduce the power and thermal screens are also public:

- `public/data/model-assumptions.json`
- `public/model/engineering-screen.mjs`

Equation-based tests recompute the published values from those files. Important public values include unit, status and source identifiers. The status vocabulary is:

- `CALCULATED`
- `WORKING_ASSUMPTION`
- `NOTIONAL_GEOMETRY`
- `EXTERNAL_REFERENCE`
- `TBD_BY_SUPPLIER`
- `PENDING_MEASUREMENT`

## Publications

- `public/documents/Satellite_Inference_Public_Whitepaper_v0.3.pdf`
- `public/documents/Node_10kW_Public_Mission_Definition_v0.2.pdf`
- `public/documents/manifest.json`

These two PDFs have distinct jobs. The whitepaper is the starting point for the product and program thesis. The mission definition is the technical companion for first-flight requirements and success criteria. They are public concept documents, not flight-release data, manufacturing CAD, supplier quotations, launch reservations, regulatory determinations, or financing material.

The `/publications` route renders this release set from the manifest and exposes exact page counts, byte sizes, SHA-256 digests, and document-level disclaimers.

## Inference evidence lab

The `/demo` route presents three ground workloads in a deliberate order:

- primary: SAR maritime vessel detection and scene prioritization;
- secondary: wildfire, burn-scar, and change detection;
- control: optical cloud and quality screening.

Its data-volume calculator is deterministic scenario arithmetic, not measured downlink reduction. Throughput, latency, task quality, energy, and operational reduction remain `PENDING_MEASUREMENT` until a reproducible ground run captures complete provenance.

The `benchmarks/` scaffold defines strict dataset, model, workload, telemetry, and result contracts. Pending result generation is deterministic and leaves all numeric measurement fields null.

## Physics model

The orbit model is implemented as pure functions in `lib/orbital-physics.ts`. The public power-thermal screen is implemented in `public/model/engineering-screen.mjs`. Both are tested independently of the visual layer.

- WGS-84 equatorial Earth radius: 6,378.137 km
- WGS-84 Earth gravitational parameter: 398,600.4418 km^3/s^2
- Speed of light: 299,792.458 km/s
- Mean sidereal day: 86,164.09054 s

The screen assumes a circular two-body orbit, spherical Earth, beta angle 0 for maximum eclipse, cylindrical shadow, and zenith ground geometry. It excludes J2, atmospheric drag, real ephemerides, routing, queues, gateway delay, and protocol overhead.

## Development

Requires Node.js 22.13 or later.

```bash
npm ci
npm run generate:og
npm run build:pages
npm test
```

- `npm run build:pages` creates the static GitHub Pages output in `out/`.
- `npm run lint` checks the source.
- `npm test` runs orbital-physics checks, recomputes published power-thermal values, validates the publication manifest, and enforces the benchmark evidence boundary.

## Deployment

GitHub Actions publishes the `out/` directory to GitHub Pages. The canonical domain is `satelliteinference.com`, declared in `public/CNAME`.

## Public and private boundary

This repository is intentionally a clean public publication layer. Detailed financing, investor diligence, engineering data, CAD, supplier work, facility planning, export-control analysis, security architecture, procurement material, customer correspondence, and internal decision logs do not belong here.

The only currently verified public email route is `procurement@satelliteinference.com`. Additional role addresses must not be advertised before configuration and delivery testing.

## Rights and notices

See [LICENSE-CODE](LICENSE-CODE), [NOTICE.md](NOTICE.md), [DISCLAIMER.md](DISCLAIMER.md), [PRIVACY.md](PRIVACY.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Copyright 2026 RFID INC. All rights reserved except for code expressly covered by LICENSE-CODE.
