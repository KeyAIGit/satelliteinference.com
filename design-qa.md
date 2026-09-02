# Product Design QA

## Visual target

- Source reference: `qa/reference-scale-v01.png`
- Existing live design system: Satellite Inference public site at `https://satelliteinference.com`
- Implementation hero: `qa/hero-v02.jpg`
- Implementation scale section: `qa/implementation-scale-v02.jpg`
- Side-by-side comparison: `qa/scale-comparison.jpg`
- Browser viewport: 1363 x 936 CSS pixels

## Required corrections

- [x] Preserve the existing dark engineering/editorial visual language.
- [x] Replace the generic hero spacecraft with a real CAD Rev B concept render.
- [x] Rename the five public stages by mission purpose.
- [x] Make 1 MW exactly ten repeated 100 kW modules.
- [x] Replace arbitrary LEO/GEO orbit sizing with one linear physical radial scale.
- [x] Disclose the logarithmic altitude control and animation time compression.
- [x] Separate 4-8 kWh planning range from the 3.70 kWh Rev B battery base.
- [x] Label 4.57 m2 as an idealized effective-area screen, disclose the 0.97 heat-load factor and 4.71 m2 full-load equivalent, and separate both from 6.0 m2 notional gross planform.
- [x] Add a 44 x 44 px mobile navigation control and no-hover mission selection.
- [x] Raise meaningful technical labels to readable sizes and add a skip link.
- [x] Replace the oversized generic social image with a branded 1200 x 630 image under 300 KB.

## Browser checks

- Desktop visual comparison completed against the supplied reference.
- GitHub Pages production deployment completed successfully for commit `0cdab161996d4d0da3f7b56c5604e022a183e3c5`.
- Production desktop horizontal overflow: none (`scrollWidth 1348`, `innerWidth 1363`).
- All production image assets loaded at their expected natural width after lazy-load activation.
- Production metadata includes the canonical URL, description and absolute Open Graph image URL.
- CAD tabs switched through Deployed, Stowed and Deployment states with the correct pressed state and image alternative text.
- LEO and GEO presets hydrated correctly. GEO displayed the modeled 23.93 h period, 119 ms one-way vacuum propagation and 239 ms vacuum RTT.
- Megawatt Orbital Network displayed exactly ten module cells and the formula `10 x 100 kW = 1 MW aggregate`.
- Whitepaper, mission definition, robots, sitemap, Open Graph image and canonical public model returned HTTP 200 with the expected content types.
- Production console contained no application errors; browser-extension metadata errors were excluded as unrelated.
- Mobile behavior was reviewed in source at 1100, 820, 560 and 360 px breakpoints, including the 44 x 44 px navigation control, stacked content, tap-sized selectors and overflow guards.

## Automated checks

- ESLint: passed.
- Node model and physics tests: 9/9 passed.
- Python model tests: 5/5 passed.
- CAD Rev B regression tests: 6/6 passed.
- Deterministic public JSON check: passed.
- Next.js static export: passed.
- Public PDFs: 36/36 pages visually inspected by the document build workflow.

## Iteration history

1. Audited the supplied scale screenshot and current source.
2. Removed the misleading smaller 1 MW spacecraft graphic.
3. Introduced canonical public model data and evidence statuses.
4. Integrated CAD Rev B deployed, stowed, deployment and GA assets.
5. Rebuilt Orbit Lab around physical radial scale and continuous altitude control.
6. Added responsive navigation, keyboard-visible focus and tap-sized controls.
7. Compared the updated scale section side by side with the reference.

final result: passed
