import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, CheckCircle2, CircleDashed, Layers3, RadioTower } from "lucide-react";
import { EvidenceLab, type EvidenceLabProps } from "@/components/evidence-lab";
import { SiteNavigation } from "@/components/site-navigation";
import workloadData from "@/public/data/inference-workloads.v1.json";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Inference Evidence Lab",
  description:
    "Explore the three ground workload candidates and a deterministic downlink scenario for the first 10 kW Satellite Inference node.",
  alternates: { canonical: "/demo" },
  openGraph: {
    url: "/demo",
    title: "Inference Evidence Lab | Satellite Inference",
    description: "Three ground candidates. One future flight workload. No invented benchmark results.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Satellite Inference evidence lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inference Evidence Lab | Satellite Inference",
    description: "Three ground candidates. One future flight workload. No invented benchmark results.",
    images: ["/og.png"],
  },
};

const evidenceSteps = [
  {
    index: "01",
    label: "Ground tile",
    value: "1 kW",
    text: "One engineering tile is intended to test compute, power, cooling, telemetry, and runtime interfaces on the ground.",
    status: "Test unit only",
  },
  {
    index: "02",
    label: "Integrated breadboard",
    value: "10 kW",
    text: "Ten replicated tiles, or an equivalent integrated configuration, must demonstrate scheduler behavior and shared infrastructure.",
    status: "Ground evidence gate",
  },
  {
    index: "03",
    label: "First LEO node",
    value: "10 kW",
    text: "Only one live sensor or data-path family advances after customer evidence, benchmark provenance, and design review.",
    status: "Future flight objective",
  },
];

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
          <h1 id="demo-title">A demo that refuses<br />to invent data.</h1>
          <p className={styles.lead}>
            Explore three candidate inference workflows and a transparent data-volume scenario.
            Performance stays marked <strong>PENDING_MEASUREMENT</strong> until a reproducible ground run exists.
          </p>
          <div className={styles.heroActions}>
            <a href="#demo-content" className={styles.primaryAction}>Open the scenario <ArrowDown size={16} /></a>
            <a href="/publications" className={styles.secondaryAction}>Read the evidence basis <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className={styles.heroPanel} aria-label="Evidence boundary summary">
          <div><strong>3</strong><span>ground candidates</span></div>
          <div><strong>1</strong><span>future flight family</span></div>
          <div><strong>0</strong><span>invented benchmark values</span></div>
          <p><span /> STATUS / PRE-MEASUREMENT</p>
        </div>
      </section>

      <section className={styles.labSection} id="demo-content">
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>01 / WORKLOAD SCREEN</p>
            <h2>Change the assumptions.<br />Keep the boundary visible.</h2>
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

      <section className={styles.chainSection} aria-labelledby="chain-title">
        <header className={styles.sectionHeaderDark}>
          <div>
            <p className={styles.kicker}>02 / GROUND-TO-FLIGHT CHAIN</p>
            <h2 id="chain-title">One tile tests an interface.<br />Ten kilowatts test a system.</h2>
          </div>
          <p>
            The 1 kW unit is not a smaller orbital product. It is a planned repeatable ground building block
            intended to earn evidence for the first 10 kW flight node.
          </p>
        </header>
        <ol className={styles.chain}>
          {evidenceSteps.map((step) => (
            <li key={step.index}>
              <span className={styles.stepIndex}>{step.index}</span>
              <div className={styles.stepIcon} aria-hidden="true">
                {step.index === "01" ? <Layers3 /> : step.index === "02" ? <CheckCircle2 /> : <RadioTower />}
              </div>
              <p>{step.label}</p>
              <strong>{step.value}</strong>
              <small>{step.text}</small>
              <em>{step.status}</em>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.releaseGate} aria-labelledby="release-title">
        <div>
          <p className={styles.kicker}>03 / RELEASE RULE</p>
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
