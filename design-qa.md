# Product Design QA

Reviewed: 2026-09-03

## Rev C visual target

- Preserve the established dark engineering/editorial design system.
- Show the first orbital system as a 10 kW continuous-compute node in 500-600 km LEO.
- Use the new concept render only as a notional configuration, never as flight CAD.
- Keep the 1 kW engineering tile clearly ground-only.
- Present GEO only as an interactive comparison case.
- State the current development-capital target as exactly $7 million.
- Keep later $100 million-plus financing conditional on engineering and commercial gates.

## Required checks

- [x] Four-stage ladder begins with a ground engineering tile, then the 10 kW orbital node.
- [x] Initial markets are defense and sovereign missions, Earth observation, maritime domain awareness and disaster response.
- [x] Generic cloud inference is positioned later, not as the first market.
- [x] The 10 kW node separates payload input, total spacecraft load, BOL solar, battery and thermal quantities.
- [x] Public planning envelopes are labeled pre-SRR and supplier validation remains explicit.
- [x] Financing copy distinguishes the current $7 million target from later conditional program capital.
- [x] Investor copy includes an information-only, no-offer disclaimer.
- [x] Navigation, cards and concept presentation retain mobile layouts and touch-sized controls.
- [x] Open Graph generation uses the Rev C 10 kW concept image and copy.
- [x] The Evidence Lab exposes exactly three ground candidates and labels every unmeasured result `PENDING_MEASUREMENT`.
- [x] The Publications route derives the release set from an integrity manifest with exact hashes, sizes, and page counts.
- [x] Public benchmark schema identifiers resolve to files included in the static export.

## Automated acceptance

- `npm test`: 33/33 passed
- `npm run lint`: passed
- `npm run build`: passed; `/`, `/demo`, `/publications`, `/privacy`, and `/disclaimer` statically exported
- Rev C stale-language and U+2014 scan: passed
- Public PDF render review: 36/36 pages inspected
- Public document manifest: all three exact PDF hashes, sizes, page counts, and routes passed
- Generated internal paths and fragments: 174 references checked with no unresolved target
- Privacy and secret scan: no private correspondence, supplier pricing, personal address, phone number, or credential found
- Responsive source review: mobile breakpoints, overflow controls, touch targets, and navigation state checked for the new routes

## Remaining deployment check

The new routes are present only on the working branch until review and merge. Capture desktop and mobile browser screenshots after a preview or production deployment and verify the live `/demo`, `/publications`, and `/benchmarks/schemas/` responses before announcing them externally.

Final status: passed for pull-request review; production announcement remains gated on deployment and live browser QA.
