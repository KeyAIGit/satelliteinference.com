# Product Design QA

Reviewed: 2026-09-04

## Rev C visual target

- Preserve the established dark engineering/editorial design system.
- Show the first orbital system as a node delivering 10 kW of continuous electrical input to the compute payload in 500-600 km LEO.
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
- [x] Desktop navigation, cards and concept presentation show no page-level clipping or horizontal overflow in the supported preview browser.
- [ ] Mobile layout and touch behavior require a true mobile-viewport browser check; source breakpoints alone are not accepted as visual evidence.
- [x] Open Graph generation uses the Rev C 10 kW concept image and copy.
- [x] The Evidence Lab exposes one primary, one secondary, and one control ground workload and labels every unmeasured result `PENDING_MEASUREMENT`.
- [x] The Publications route derives the release set from an integrity manifest with exact hashes, sizes, and page counts.
- [x] Public benchmark schema identifiers resolve to files included in the static export.

## Automated acceptance

- `npm test`: 42/42 passed
- `npm run lint`: passed
- `npm run build:pages`: passed; `/`, `/demo`, `/publications`, `/privacy`, and `/disclaimer` statically exported
- Rev C stale-language and U+2014 scan: passed
- Public document manifest: both exact PDF hashes, sizes, page counts, and routes passed
- Generated internal paths and fragments: checked with no unresolved target
- Privacy and secret scan: no private correspondence, supplier pricing, personal address, phone number, or credential found
- Desktop visual review: `/`, `/demo`, and `/publications` checked at 1363 x 936 with no new clipping or document-level horizontal overflow
- Interactive preview review: passed in the supported desktop browser; client hydration completed, workload selection changed state, the downlink scenario recalculated after an input edit, and the LEO/GEO controls changed the orbit model

## Remaining deployment check

The new routes are present only on the working branch until review and merge. Before release, capture a true mobile-viewport review and verify the deployed `/demo`, `/publications`, and `/benchmarks/schemas/` responses.

Final status: automated checks, desktop visual layout, hydration, and core desktop interactions pass for pull-request review. Merge and production announcement remain gated on mobile QA and post-deploy route checks.
