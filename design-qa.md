# Product Design QA

Reviewed: 2026-09-03

## Rev C visual target

- Preserve the established dark engineering/editorial design system.
- Show the first orbital system as a 10 kW continuous-compute node in 500-600 km LEO.
- Use the new concept render only as a notional configuration, never as flight CAD.
- Keep the 1 kW engineering tile clearly ground-only.
- Present GEO only as an interactive comparison case.
- Keep detailed financing, investor diligence, supplier correspondence, and customer correspondence outside the public site.
- Give the whitepaper and mission definition distinct reading purposes.

## Required checks

- [x] Four-stage ladder begins with a ground engineering tile, then the 10 kW orbital node.
- [x] SAR maritime is the primary benchmark candidate, wildfire and change is secondary, and optical quality is the control workload.
- [x] Public SAR wording is limited to vessel detection and scene prioritization; identity, intent, and illegal activity require corroborating context.
- [x] Generic cloud inference is positioned later, not as the first market.
- [x] The 10 kW node separates payload input, total spacecraft load, BOL solar, battery and thermal quantities.
- [x] Public planning envelopes are labeled pre-SRR and supplier validation remains explicit.
- [x] Public pages contain no detailed fundraising ask, use-of-funds table, or financing ladder.
- [x] Navigation, cards and concept presentation retain mobile layouts and touch-sized controls.
- [x] Open Graph generation uses the Rev C 10 kW concept image and copy.
- [x] The Evidence Lab exposes one primary, one secondary, and one control ground workload and labels every unmeasured result `PENDING_MEASUREMENT`.
- [x] The Publications route derives the release set from an integrity manifest with exact hashes, sizes, and page counts.
- [x] Public benchmark schema identifiers resolve to files included in the static export.

## Automated acceptance

- `npm test`: 34/34 passed
- `npm run lint`: passed
- `npm run build:pages`: passed; `/`, `/demo`, `/publications`, `/privacy`, and `/disclaimer` statically exported
- Rev C stale-language and U+2014 scan: passed
- Public document manifest: both exact PDF hashes, sizes, page counts, and routes passed
- Generated internal paths and fragments: 174 references checked with no unresolved target
- Privacy and secret scan: no private correspondence, supplier pricing, personal address, phone number, or credential found
- Responsive source review: mobile breakpoints, overflow controls, touch targets, and navigation state checked for the new routes

## Remaining deployment check

The new routes are present only on the working branch until review and merge. Capture desktop and mobile browser screenshots after a preview or production deployment and verify the live `/demo`, `/publications`, and `/benchmarks/schemas/` responses before announcing them externally.

Final status: passed for pull-request review; production announcement remains gated on deployment and live browser QA.
