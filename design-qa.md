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
- [x] Separate 4-8 kWh planning range from the 3.70 kWh Rev A battery base.
- [x] Separate the 4.57 m2 radiator model minimum from 6.0 m2 notional gross planform.
- [x] Add a 44 x 44 px mobile navigation control and no-hover mission selection.
- [x] Raise meaningful technical labels to readable sizes and add a skip link.
- [x] Replace the oversized generic social image with a branded 1200 x 630 image under 300 KB.

## Browser checks

- Desktop visual comparison completed against the supplied reference.
- Desktop horizontal overflow: none (`scrollWidth 1348`, `innerWidth 1363`).
- All visible image assets loaded at their expected natural width.
- Primary anchor navigation moved to `#model` correctly.
- Local client-side button verification is pending because the cloud preview client blocks direct Next.js JavaScript chunk delivery from `terminal.local` with `ERR_BLOCKED_BY_CLIENT`. This is a preview-surface limitation, not a production-console error.
- Site console contains no application error from `terminal.local`; browser-extension metadata errors were excluded as unrelated.
- Mobile behavior was reviewed in source at 1100, 820, 560 and 360 px breakpoints. Production interaction and responsive smoke tests remain required after GitHub Pages deploy.

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

final result: pending live verification
