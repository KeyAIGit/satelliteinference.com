import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, FileCheck2, FileText, Fingerprint, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import manifest from "@/public/documents/manifest.json";
import styles from "./publications.module.css";

const glossary = [
  ["SAR", "Synthetic-aperture radar: an active imaging technique that sends radio waves and can form images day or night and through clouds."],
  ["LEO", "Low Earth orbit: the region of space relatively close to Earth. This program's first-mission baseline is 500-600 km."],
  ["Node", "The proposed computing spacecraft: computing, storage, power, cooling, communications, and control systems working together."],
  ["Payload", "The mission equipment carried by a spacecraft. Here, it includes the computing hardware and may receive data from a separate sensor."],
  ["Downlink", "Data transmitted from a spacecraft to a ground station."],
  ["BOL", "Beginning of life: expected performance when new, before radiation and aging reduce output."],
  ["PV", "Photovoltaic: the solar cells that convert sunlight into electrical power."],
  ["PMAD", "Power management and distribution: hardware that conditions, switches, protects, and routes spacecraft power."],
  ["ADCS", "Attitude determination and control: hardware and software that know and control where the spacecraft is pointing."],
  ["Pre-SRR", "Work performed before the formal System Requirements Review. Values are preliminary until that gate is passed."],
  ["ICD", "Interface Control Document: the agreed electrical, mechanical, thermal, data, and operational boundary between systems."],
  ["ROM", "Rough order of magnitude: an early cost or schedule range, not a binding quote."],
  ["FLOPS", "Floating-point operations per second: a compute-rate measure that does not by itself establish useful customer performance."],
] as const;

export const metadata: Metadata = {
  title: "Publications",
  description: "Two versioned Satellite Inference concept documents covering the company thesis and preliminary pre-SRR mission requirements.",
  alternates: { canonical: "/publications" },
  openGraph: {
    url: "/publications",
    title: "Publications | Satellite Inference",
    description: "Start with the company thesis, then inspect the preliminary pre-SRR first-flight requirements.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Satellite Inference publications" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications | Satellite Inference",
    description: "Start with the company thesis, then inspect the preliminary pre-SRR first-flight requirements.",
    images: ["/og.png"],
  },
};

export default function PublicationsPage() {
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#publication-list">Skip to publications</a>
      <SiteNavigation />

      <section className={styles.hero} id="top" aria-labelledby="publications-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><FileCheck2 size={14} /> PUBLIC BASELINE / VERSIONED</p>
          <h1 id="publications-title">Two documents.<br />Two different jobs.</h1>
          <p>
            Read the whitepaper first for the company thesis. Open the mission definition next
            for preliminary pre-SRR first-flight requirements, success criteria, and unresolved engineering decisions.
          </p>
          <a href="#publication-list">View the current set <ArrowDown size={16} /></a>
        </div>
        <aside className={styles.boundaryCard}>
          <span>EVIDENCE BOUNDARY</span>
          <strong>Concept<br />documents only.</strong>
          <p>{manifest.evidenceBoundary}</p>
          <div><ShieldCheck aria-hidden="true" /> {manifest.documents.length} current files with SHA-256 fingerprints recorded in the manifest</div>
        </aside>
      </section>

      <section className={styles.library} id="publication-list" aria-labelledby="library-title" tabIndex={-1}>
        <header>
          <div>
            <p className={styles.kicker}>01 / CURRENT RELEASE SET</p>
          <h2 id="library-title">Current public reading path.</h2>
          </div>
          <p>
            Only the two files below are current. Public Whitepaper v0.3 and Mission Definition v0.2
            remain at their original URLs as superseded archives so existing citations do not silently change.
          </p>
        </header>

        <div className={styles.documentList}>
          {manifest.documents.map((document, index) => (
            <article key={document.id} className={styles.documentCard}>
              <div className={styles.cardIndex}>0{index + 1}</div>
              <div className={styles.cardIcon}><FileText aria-hidden="true" /></div>
              <div className={styles.cardCopy}>
                <span>{index === 0 ? "START HERE" : "TECHNICAL COMPANION"} / {document.subtitle} / {document.status.replaceAll("_", " ")}</span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <dl>
                  <div><dt>VERSION</dt><dd>{document.version}</dd></div>
                  <div><dt>PAGES</dt><dd>{document.pageCount}</dd></div>
                  <div><dt>SIZE</dt><dd>{document.byteSize.toLocaleString("en-US")} bytes</dd></div>
                  <div><dt>PUBLISHED</dt><dd>{document.publishedOn}</dd></div>
                </dl>
              </div>
              <div className={styles.cardProof}>
                <div><Fingerprint aria-hidden="true" /><span>SHA-256 FILE FINGERPRINT</span></div>
                <code>{document.sha256}</code>
                <p>SHA-256 turns the file&apos;s bytes into this fingerprint. Compute it after downloading and compare the values: a mismatch means the file is not byte-for-byte the listed release. {document.disclaimer}</p>
                <a href={document.url}>Open PDF <ArrowUpRight size={16} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.glossary} aria-labelledby="glossary-title">
        <header>
          <p className={styles.kicker}>02 / PLAIN LANGUAGE</p>
          <h2 id="glossary-title">Common terms,<br />explained once.</h2>
        </header>
        <dl>
          {glossary.map(([term, meaning]) => (
            <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
          ))}
        </dl>
      </section>

      <section className={styles.method} aria-labelledby="method-title">
        <div>
          <p className={styles.kicker}>03 / WHAT STAYS PRIVATE</p>
          <h2 id="method-title">A public library,<br />not an open data room.</h2>
        </div>
        <div className={styles.methodGrid}>
          <article><span>PUBLIC</span><strong>Thesis and mission boundary</strong><p>Enough information to understand the proposed product, calculations, first-flight requirements, and important unknowns.</p></article>
          <article><span>CONTROLLED</span><strong>Financing and diligence</strong><p>Investor materials, detailed budgets, supplier responses, customer correspondence, and decision records are shared privately.</p></article>
          <article><span>RESTRICTED</span><strong>Sensitive engineering</strong><p>Detailed CAD, interfaces, security material, and export-controlled technical data require a separate release decision.</p></article>
        </div>
        <div className={styles.methodLinks}>
          <a href="/documents/manifest.json">Download manifest <ArrowUpRight size={15} /></a>
          <a href="/demo">Open evidence lab <ArrowUpRight size={15} /></a>
          <a href="mailto:procurement@satelliteinference.com">Contact procurement <ArrowUpRight size={15} /></a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
