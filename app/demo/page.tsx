import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, CircleDashed } from "lucide-react";
import { EvidenceLab, type EvidenceLabProps } from "@/components/evidence-lab";
import { SiteNavigation } from "@/components/site-navigation";
import workloadData from "@/public/data/inference-workloads.v1.json";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Inference Evidence Lab",
  description:
    "Explore a primary candidate, a secondary candidate, and a control benchmark for the proposed 10 kW Satellite Inference node.",
  alternates: { canonical: "/demo" },
  openGraph: {
    url: "/demo",
    title: "Inference Evidence Lab | Satellite Inference",
    description: "SAR maritime is the primary benchmark candidate, wildfire and change is secondary, and optical quality is the control workload.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Satellite Inference evidence lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inference Evidence Lab | Satellite Inference",
    description: "SAR maritime is the primary benchmark candidate, wildfire and change is secondary, and optical quality is the control workload.",
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
          <p className={styles.eyebrow}><CircleDashed size={14} /> PUBLIC EVIDENCE LAB / V1</p>
          <h1 id="demo-title">Test the workload<br />assumptions.</h1>
          <p className={styles.lead}>
            Adjust a transparent data-volume scenario for three ground benchmarks.
            Performance remains unclaimed until measured on traceable hardware and data.
          </p>
          <div className={styles.heroActions}>
            <a href="#demo-content" className={styles.primaryAction}>Open the scenario <ArrowDown size={16} /></a>
            <a href="/publications" className={styles.secondaryAction}>Read the evidence basis <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className={styles.heroPanel} aria-label="Evidence boundary summary">
          <div><strong>SAR</strong><span>primary candidate</span></div>
          <div><strong>FIRE</strong><span>secondary candidate</span></div>
          <div><strong>OPTICAL</strong><span>control benchmark</span></div>
          <p><span /> STATUS / PRE-MEASUREMENT</p>
        </div>
      </section>

      <section className={styles.labSection} id="demo-content">
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>01 / WORKLOAD SCREEN</p>
            <h2>Change the scenario.<br />See only what the arithmetic supports.</h2>
          </div>
          <p>
            The calculator performs dimensional arithmetic only. It does not predict model accuracy,
            accelerator throughput, energy per scene, contact access, or customer value.
          </p>
        </header>
        <EvidenceLab
          workloads={evidenceData.workloads}
          scenarioInputs={evidenceData.scenarioInputs}
          measurementFields={evidenceData.measurementFields}
        />
      </section>

      <section className={styles.releaseGate} aria-labelledby="release-title">
        <div>
          <p className={styles.kicker}>02 / MEASUREMENT RULE</p>
          <h2 id="release-title">A number becomes evidence only with provenance.</h2>
        </div>
        <div className={styles.gateGrid}>
          <article><span>INPUT</span><strong>Dataset + license</strong><p>Exact files, rights, split, preprocessing, and hashes.</p></article>
          <article><span>MODEL</span><strong>Artifact + version</strong><p>Weights, runtime, precision, parameters, and task metric.</p></article>
          <article><span>RUN</span><strong>Hardware + telemetry</strong><p>Configuration, elapsed time, energy when measured, temperatures, and errors.</p></article>
          <article><span>RESULT</span><strong>Reviewable record</strong><p>Machine-readable output that fails closed when provenance is incomplete.</p></article>
        </div>
        <div className={styles.bottomCta}>
          <p>Have a live mission data path or a workload that belongs in the ground screen?</p>
          <a href="mailto:procurement@satelliteinference.com">Contact procurement <ArrowUpRight size={16} /></a>
        </div>
      </section>
    </main>
  );
}
