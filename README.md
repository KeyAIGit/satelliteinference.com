# Satellite Inference

Public website and publication layer for Satellite Inference, an RFID INC program developing orbital computing infrastructure.

> Compute where space data begins.

The site explains a staged path from a hosted compute flight test to independently operated orbital nodes. Its interactive Orbit Lab compares a 550 km reference LEO with GEO using deterministic, client-side calculations for orbital period, idealized maximum eclipse, and vacuum propagation delay.

## Public mission names

| Name | Identifier | Continuous compute |
|---|---|---:|
| Hosted Pathfinder | SI-HP | 0.2-1.0 kW allocation |
| Node 1 kW | SI-N1 | 1 kW |
| Node 10 kW | SI-N10 | 10 kW |
| Node 100 kW | SI-N100 | 100 kW |
| Grid 1 MW | SI-G1MW | 1 MW aggregate |

The number in each Node or Grid name always means continuous compute power. Solar generation is stated separately.

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
