# How to read the public engineering models

Satellite Inference is a ground-stage research program operated by RFID INC. The orbital spacecraft remains a proposed mission.

The website presents the program first. These files let a technical reviewer inspect the calculations behind the mission concept:

| File | Purpose |
| --- | --- |
| [model-assumptions.json](../public/data/model-assumptions.json) | Versioned input values, units, provenance and planning status. |
| [engineering-screen.mjs](../public/model/engineering-screen.mjs) | JavaScript equations that calculate preliminary power, battery, solar and thermal estimates. |
| [site-model.json](../public/data/site-model.json) | Published outputs used by the mission diagrams. These are calculated estimates, not measurements of flight hardware. |
| [Publication manifest](../public/documents/manifest.json) | Versions, file sizes and SHA-256 fingerprints for current and archived PDFs. |

JSON is a structured data format. It is useful for software and reproducibility; it is not a document a customer needs to read to understand the business.

The orbit explorer compares circular orbits with a common distance scale. Its vacuum propagation time does not estimate a complete customer service latency. The workload calculator illustrates data-volume arithmetic only; it does not predict model quality, throughput, energy or customer value.

Run the source checks from the repository root with `npm ci`, `npm test`, `npm run lint` and `npm run build:pages`. The build is a static Next.js export hosted on GitHub Pages.

See [the separate research record](research-results.md) for actual ground measurements. The assumptions in the orbital model have not been retroactively converted into measured hardware values.

## Image provenance

The orbital-node image is a notional concept illustration. It is not validated CAD, a manufacturing model or evidence of completed hardware.

The [full-scene research figure](../public/assets/research/full-scene-research-overview.png) is generated from an actual historical Sentinel-1B scene and every candidate in the frozen CPU baseline. Its [provenance](../public/assets/research/full-scene-research-overview.provenance.json) records hashes, transformations and limitations.

Contains modified Copernicus Sentinel data (2020). SARFish dataset: Tri-Tan Cao, Connor Luckett, Jerome Williams, Tristrom Cooke, Ben Yip, Arvind Rajagopalan, Sebastien Wong; DSTG. The research figure is a derivative of SARFish data and is provided under CC BY-SA 3.0 IGO; see the [SARFish terms, section 5.1](https://github.com/DIUx-xView/SARFish/blob/main/SARFish_Terms_and_Conditions.md). Other website code and materials retain their respective terms.
