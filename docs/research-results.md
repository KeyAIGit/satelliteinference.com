# Ground research record, 5 September 2026

These are development results, not customer acceptance or flight qualification.

## Full-scene CPU baseline v0.3

- Dataset: SARFishSample, revision `169946c78bd300e33bc6303def3c79dc42cfc814`.
- Product: `S1B_IW_GRDH_1SDV_20200803T075721_20200803T075746_022756_02B2FF_033A`.
- Corresponding scene: `5c3d986db930f848v`. Historic acquisition near northwest Iceland, 3 August 2020.
- VH raster: 25,306 × 16,644, or 421,193,064 pixels. 418,418,526 valid; 2,774,538 nodata.
- Source raster SHA256: `0bacf5b0dd7a4c09a3f77ec2a7b794612bdf8e2635b3baf7c4b38a1b2bc69968`.
- Fixed local power-ratio baseline, threshold >16; background radius 20, guard radius 3; component area 2–256 pixels, maximum dimension 64. No learned weights, radiometric calibration, additional land mask or thermal-noise correction in this full-scene run.
- 425 owned core windows of up to 1024 × 1024 with 84-pixel context. Geolocation uses the source raster's embedded GCPs and GDAL TPS.
- Two runs: 98.6714 and 93.5908 seconds from input verification to saved outputs; peak RSS 286.25 and 288.125 MiB. Times exclude later comparison and figure generation; a shared CPU environment is not an isolated performance benchmark.
- 1,757 unverified candidates in each run. Seven output files are byte-identical between runs.
- GeoJSON SHA256: `065ea5e44efac24f094f652c3777471f958e20b8a90c128b5195fff94b9e3e8a`.
- Final recorded run script SHA256: `d0d6c9d332ab9fcecb2a2c48c9bf3d71d61a239443f126b340a874f90f401591`.
- 68 programming tests passed. Test counts do not measure vessel-detection accuracy.

### Reference-label diagnostic

Labels are from [Extract-SARFish-Data](https://github.com/John-J-Tanner/Extract-SARFish-Data/tree/9a06750051ab61ff0f8f86cf4317788295c8a909). Full validation CSV SHA256: `5808010f68e5206f5e9fee3131d4b4d296fa5c5e3c3ef70cf927d60a18a01a80`.

All 217 HIGH/MEDIUM labels from this scene were included: 123 vessels and 94 non-vessels. The 112 LOW labels were excluded without suppressing candidates near them. Each comparison maximizes the number of one-to-one valid pairs, then minimizes their total distance. Thresholds were fixed before computing matches; no label-based detector tuning or registration fit was performed.

| Diagnostic | All object-label associations | Vessel-label associations | Unmatched candidates |
| --- | ---: | ---: | ---: |
| WGS84 ellipsoidal distance <200 m | 48/217 | 36/123 | 1,709 |
| Native image distance <20 pixels | 50/217 | 40/123 | 1,707 |

These are proximity associations. They do not confirm identities, official xView3 composite performance, commercial precision/recall or physical false-alarm truth. Label completeness over the full scene is unverified.

Published geographic label coordinates differ from their transformed native pixel locations: for HIGH/MEDIUM, median 81.79 m, p95 337.63 m, maximum 458.18 m. 34 of 217 exceed 200 m. Absolute geographic accuracy remains unresolved.

## Neural compatibility slice v0.4

The published [B4/CircleNet model](https://github.com/BloodAxe/xView3-The-First-Place-Solution/tree/9a9600e7dfbaa24ff5a72c81061fbbbfed865847) loaded all 868 checkpoint entries strictly, with 19,557,918 parameters. Three fixed 512 × 512 windows were chosen by scene fractions before reading their contents or labels.

VH/VV amplitude was calibrated through the source calibration LUT to sigma0 dB, then normalized using the model's published sigmoid transform. Two CPU runs produced finite objectness, vessel, fishing, size and offset maps. Inference took 2.38 and 2.43 seconds on these small windows; total recorded passes 6.65 and 5.12 seconds. Peak memory 804 and 811 MiB. Twenty-seven files matched byte for byte. Eight numerical tests passed.

This resolves model/runtime compatibility only. Thermal-noise correction, geometry, the original xView3 10 m UTM preparation and the assumed index reflection require further validation. Training overlap is unknown. There is no full-scene neural result, quality improvement claim, confirmed-vessel list, measured energy or commercial licensing conclusion for these weights.

## Commercial question

Existing providers already automate detection. [Ursa Vessel Watch](https://info.ursaspace.com/vessel-watch) describes automated products with a separate human quality-control stage. Our customer benchmark must test incremental value against an existing workflow, not assume every image is manually searched.

The complete reproducibility packages, raw scene, model assets and run outputs are retained separately from this public website. They are not served as large downloads from GitHub Pages. Public figures retain the SARFish attribution and CC BY-SA 3.0 IGO data terms described in [technical-method.md](technical-method.md).
