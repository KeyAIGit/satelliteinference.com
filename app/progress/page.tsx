import type { Metadata } from "next";
import Image from "next/image";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import styles from "../content.module.css";

export const metadata: Metadata = {title:"Research progress",description:"Measured ground-prototype results, limitations and next steps for Satellite Inference.",alternates:{canonical:"/progress"}};

export default function ProgressPage(){return <main className={styles.page}>
  <a className="skip-link" href="#results">Skip to research results</a><SiteNavigation />
  <header className={styles.intro}><p className={styles.eyebrow}>RESEARCH UPDATE / 5 SEPTEMBER 2026</p><h1>What works today.<br />What we still have to prove.</h1><p>We have a repeatable pipeline for a full radar scene and a first neural-model compatibility check. Detection quality, absolute location accuracy and customer value remain open.</p></header>
  <section className={styles.section} id="results" tabIndex={-1}>
    <p className={styles.eyebrow}>01 / FULL-SCENE GROUND PROTOTYPE</p><h2>A complete scene, processed in pieces.</h2>
    <p>Two CPU runs processed the same historical Sentinel-1B scene near northwest Iceland. The current full-scene algorithm finds bright radar reflections. It does not classify them as vessels.</p>
    <figure className={styles.figure}><Image src="/assets/research/full-scene-research-overview.png" alt="Full historical SAR scene and all 1,757 unverified research candidates, including land candidates" width={1600} height={1000} sizes="(max-width:760px) 100vw, 1200px"/><figcaption>Contains modified Copernicus Sentinel data (2020), SARFish. Full scene acquired 3 August 2020. Approximate geolocation; marks are unverified candidates.</figcaption></figure>
    <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th scope="col">Measurement</th><th scope="col">Run 1</th><th scope="col">Run 2</th></tr></thead><tbody>
      <tr><th scope="row">Pixels in the source band</th><td>421,193,064</td><td>421,193,064</td></tr>
      <tr><th scope="row">Time, input verification to saved output</th><td>98.67 seconds</td><td>93.59 seconds</td></tr>
      <tr><th scope="row">Peak process memory</th><td>286.25 MiB</td><td>288.13 MiB</td></tr>
      <tr><th scope="row">Unverified candidates</th><td>1,757</td><td>1,757</td></tr>
    </tbody></table></div>
    <p>Seven saved files matched byte for byte, including candidates, coordinates and configuration. Timings come from a shared CPU environment, exclude later analysis and map rendering, and are not a service-level guarantee. GPU performance and energy use were not measured.</p>
    <div className={styles.note}><strong>How well does it find vessels?</strong><p>Against the 123 published HIGH/MEDIUM vessel labels, candidates were associated with 40 labels within 20 native image pixels and 36 within 200 metres geographically. Most vessel labels were missed. These are proximity associations, not confirmed vessel identities or a validated commercial accuracy score.</p></div>
    <p>The full comparison includes 217 HIGH/MEDIUM object labels, of which 94 are non-vessels. It found 50 image-space associations and 48 geographic associations. The 112 LOW labels were excluded. Unmatched candidates are not automatically proven false alarms because label completeness is unverified.</p>
    <p>For 34 of the 217 HIGH/MEDIUM labels, published geographic coordinates differ from the transformed pixel coordinates by more than 200 metres. We have not corrected this discrepancy or claimed absolute position accuracy.</p>
    <div className={styles.linkRow}><a href="https://huggingface.co/datasets/ConnorLuckettDSTG/SARFishSample/tree/169946c78bd300e33bc6303def3c79dc42cfc814">Source scene and version</a><a href="https://github.com/John-J-Tanner/Extract-SARFish-Data/tree/9a06750051ab61ff0f8f86cf4317788295c8a909">Published reference labels</a><a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/docs/research-results.md">Methods and measurement record</a></div>
  </section>
  <section className={styles.section}>
    <p className={styles.eyebrow}>02 / NEURAL-MODEL COMPATIBILITY</p><h2>The next model now runs.</h2>
    <p>A published B4/CircleNet model loaded all 868 checkpoint entries and processed three fixed 512 × 512 windows from the real scene. Both CPU runs produced finite output maps; 27 saved files matched byte for byte.</p>
    <div className={styles.grid}><article><span>VERIFIED</span><h3>Compatible model</h3><p>The full 19.6-million-parameter architecture runs in our CPU environment.</p></article><article><span>IN PROGRESS</span><h3>Image preparation</h3><p>Calibration and normalization are implemented. Noise correction, geometry and the model’s expected image grid need further validation.</p></article><article><span>NOT YET MEASURED</span><h3>Detection quality</h3><p>This was a compatibility test on small windows. A full-scene neural result and quality improvement have not been demonstrated.</p></article></div>
  </section>
  <section className={styles.section}>
    <p className={styles.eyebrow}>03 / CUSTOMER VALIDATION</p><h2>The comparison that matters.</h2>
    <p>Established providers already automate vessel detection. Our goal is to test whether a specific workload can achieve a useful improvement in quality, delivery time, review effort or computing cost against an existing customer baseline.</p>
    <div className={styles.linkRow}><a href="/contact">Discuss a benchmark by email</a><a href="/mission">Explore the proposed orbital mission</a></div>
  </section><SiteFooter />
</main>;}
