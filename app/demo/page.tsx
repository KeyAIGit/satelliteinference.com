import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, CircleDashed } from "lucide-react";
import { EvidenceLab, type EvidenceLabProps } from "@/components/evidence-lab";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import workloadData from "@/public/data/inference-workloads.v1.json";
import styles from "./demo.module.css";

const demoDescription =
  "Synthetic-aperture radar (SAR) vessel detection leads three workload descriptions beside one shared illustrative volume calculator; no hardware performance is predicted.";

export const metadata: Metadata = {
  title: "Workload calculator",
  description: demoDescription,
  alternates: { canonical: "/demo" },
  openGraph: {
    url: "/demo",
    title: "Workload calculator | Satellite Inference",
    description: demoDescription,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Satellite Inference evidence lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workload calculator | Satellite Inference",
    description: demoDescription,
    images: ["/og.png"],
  },
};

const evidenceData = workloadData as unknown as EvidenceLabProps;

export default function DemoPage() {
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#demo-content">Skip to evidence lab</a>
      <SiteNavigation />

      <section className={styles.hero} id="top" aria-labelledby="demo-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><CircleDashed size={14} /> WORKLOAD EXPLORER</p>
          <h1 id="demo-title">How much data<br />would you need to send?</h1>
          <p className={styles.lead}>
            The tabs describe three ground benchmark workloads, led by SAR maritime.
            One shared, illustrative calculator shows data-volume arithmetic only; it does
            not measure or predict hardware performance.
          </p>
          <div className={styles.heroActions}>
            <a href="#demo-content" className={styles.primaryAction}>Try the calculator <ArrowDown size={16} /></a>
            <a href="/publications" className={styles.secondaryAction}>Read the background <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className={styles.heroPanel} aria-label="Evidence boundary summary">
          <div><strong>SAR FIRST</strong><span>primary candidate</span></div>
          <div><strong>FIRE</strong><span>secondary candidate</span></div>
          <div><strong>OPTICAL</strong><span>control benchmark</span></div>
          <p><span /> ILLUSTRATIVE CALCULATOR</p>
        </div>
      </section>

      <section className={styles.labSection} id="demo-content" tabIndex={-1}>
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>01 / SAR-FIRST WORKLOAD SCREEN</p>
            <h2>Explore the data-volume tradeoff.</h2>
          </div>
          <p>
            The tabs change only the workload description. They share one illustrative
            data-volume calculator; it does not compare workloads or predict hardware throughput,
            runtime, energy, model accuracy, contact access, or customer value.
          </p>
        </header>
        <p className="calculator-progress-note">This calculator is illustrative. <a href="/progress">Read our separately measured research results.</a></p>
        <EvidenceLab
          workloads={evidenceData.workloads}
          scenarioInputs={evidenceData.scenarioInputs}
          measurementFields={evidenceData.measurementFields}
        />
      </section>

      <section className={styles.releaseGate} aria-labelledby="release-title">
        <div>
          <p className={styles.kicker}>02 / MEASUREMENT RULE</p>
          <h2 id="release-title">A number becomes evidence only when its source is traceable.</h2>
        </div>
        <div className={styles.gateGrid}>
          <article><span>INPUT</span><strong>Dataset + license</strong><p>Exact files, rights, split, preparation steps, and file fingerprints.</p></article>
          <article><span>MODEL</span><strong>Artifact + version</strong><p>Weights, runtime, precision, parameters, and task metric.</p></article>
          <article><span>RUN</span><strong>Hardware + telemetry</strong><p>Configuration, elapsed time, energy when measured, temperatures, and errors.</p></article>
          <article><span>RESULT</span><strong>Reviewable record</strong><p>Machine-readable output that is withheld when its source record is incomplete.</p></article>
        </div>
        <div className={styles.bottomCta}>
          <p>Have a live mission data path or a workload that belongs in the ground screen?</p>
          <a href="/contact">Contact the team <ArrowUpRight size={16} /></a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
