# Satellite Inference

Public website and publication layer for Satellite Inference™, currently operated by RFID INC, a Delaware corporation.

> Compute where space data begins.

The site explains a staged path from a hosted compute flight test to independently operated orbital nodes. Its interactive Orbit Lab moves from 200 km to GEO using deterministic, client-side calculations for orbital period, worst-case beta-0 eclipse, and vacuum propagation delay. The orbit visual uses one linear physical radial scale; the altitude control is logarithmic.

## Public mission names

| Name | Identifier | Continuous compute |
|---|---|---:|
| Hosted Pathfinder | Hosted-1 | 0.2-1.0 kW allocation |
| Flight Demonstrator | Solar-10 | 1 kW |
| Commercial Orbital Node | Compute-10 | 10 kW |
| Industrial Orbital Module | C100 | 100 kW |
| Megawatt Orbital Network | C1000 | 1 MW aggregate |

Continuous compute, solar generation and aggregate network capacity are stated separately. The Megawatt Orbital Network is exactly a ten-module reference architecture: 10 x 100 kW continuous compute = 1 MW aggregate.

## Public model contract

`public/data/site-model.json` is generated deterministically from the internal Rev A screening model. Important public values include unit, status and source identifiers. The status vocabulary is:

- `CALCULATED`
- `WORKING_ASSUMPTION`
- `NOTIONAL_GEOMETRY`
- `EXTERNAL_REFERENCE`
- `TBD_BY_SUPPLIER`

## Publications

- `public/documents/Satellite_Inference_Whitepaper_v0.1.pdf`
- `public/documents/Node_1kW_Public_Mission_Definition_v0.1.pdf`

These are public concept documents. They are not flight-release data, manufacturing CAD, supplier quotations, launch reservations, regulatory determinations, or offers to sell securities.

## Physics model

The model is implemented as pure functions in `lib/orbital-physics.ts` and tested independently of the visual layer.

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
- `npm test` runs the orbital-physics checks independently of the visual layer.

## Deployment

GitHub Actions publishes the `out/` directory to GitHub Pages. The canonical domain is `satelliteinference.com`, declared in `public/CNAME`.

## Public and private boundary

This repository is intentionally a clean public publication layer. Detailed engineering data, CAD, supplier work, facility planning, export-control analysis, security architecture, procurement material, and internal decision logs do not belong here.

## Rights and notices

See [LICENSE-CODE](LICENSE-CODE), [NOTICE.md](NOTICE.md), [DISCLAIMER.md](DISCLAIMER.md), [PRIVACY.md](PRIVACY.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Copyright 2026 RFID INC. All rights reserved except for code expressly covered by LICENSE-CODE.
