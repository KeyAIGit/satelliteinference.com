# Product Design QA

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

## Automated acceptance

- `npm test`: 14/14 passed
- `npm run lint`: passed
- `npm run generate:og`: passed
- `npm run build:pages`: passed
- Rev C stale-language and U+2014 scan: passed
- Public PDF render review: 36/36 pages inspected
- Public document routes: whitepaper v0.2, 10 kW mission definition v0.2 and fundraising roadmap v0.1 present

Final status: passed.
