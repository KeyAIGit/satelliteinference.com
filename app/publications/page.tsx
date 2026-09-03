import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, FileCheck2, FileText, Fingerprint, ShieldCheck } from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import manifest from "@/public/documents/manifest.json";
import styles from "./publications.module.css";

export const metadata: Metadata = {
  title: "Publications",
  description: "Versioned Satellite Inference concept documents with page counts, file hashes, and explicit evidence boundaries.",
  alternates: { canonical: "/publications" },
  openGraph: {
    url: "/publications",
    title: "Publications | Satellite Inference",
    description: "Versioned concept documents with file integrity and explicit evidence boundaries.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Satellite Inference publications" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications | Satellite Inference",
    description: "Versioned concept documents with file integrity and explicit evidence boundaries.",
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
          <h1 id="publications-title">Documents you can<br />inspect, hash, and challenge.</h1>
          <p>
            Current public materials are concept documents. Each file is listed with its version,
            page count, byte size, SHA-256 digest, and the claims it does not make.
          </p>
          <a href="#publication-list">View the current set <ArrowDown size={16} /></a>
        </div>
        <aside className={styles.boundaryCard}>
          <span>EVIDENCE BOUNDARY</span>
          <strong>Concept<br />documents only.</strong>
          <p>{manifest.evidenceBoundary}</p>
          <div><ShieldCheck aria-hidden="true" /> {manifest.documents.length} files integrity-checked by manifest</div>
        </aside>
      </section>

      <section className={styles.library} id="publication-list" aria-labelledby="library-title">
        <header>
          <div>
            <p className={styles.kicker}>01 / CURRENT RELEASE SET</p>
            <h2 id="library-title">Rev C public package.</h2>
          </div>
          <p>Published files remain stable. A future revision receives a new version and a new integrity record.</p>
        </header>

        <div className={styles.documentList}>
          {manifest.documents.map((document, index) => (
            <article key={document.id} className={styles.documentCard}>
              <div className={styles.cardIndex}>0{index + 1}</div>
              <div className={styles.cardIcon}><FileText aria-hidden="true" /></div>
              <div className={styles.cardCopy}>
                <span>{document.subtitle} / {document.status.replaceAll("_", " ")}</span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <dl>
                  <div><dt>VERSION</dt><dd>{document.version}</dd></div>
                  <div><dt>PAGES</dt><dd>{document.pageCount}</dd></div>
                  <div><dt>SIZE</dt><dd>{(document.byteSize / 1024).toFixed(1)} KiB</dd></div>
                  <div><dt>PUBLISHED</dt><dd>{document.publishedOn}</dd></div>
                </dl>
              </div>
              <div className={styles.cardProof}>
                <div><Fingerprint aria-hidden="true" /><span>SHA-256</span></div>
                <code>{document.sha256}</code>
                <p>{document.disclaimer}</p>
                <a href={document.url}>Open PDF <ArrowUpRight size={16} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.method} aria-labelledby="method-title">
        <div>
          <p className={styles.kicker}>02 / PUBLICATION METHOD</p>
          <h2 id="method-title">A visible line between<br />a screen and a specification.</h2>
        </div>
        <div className={styles.methodGrid}>
          <article><span>STATUS</span><strong>Concept document</strong><p>Planning logic and requirements that still need customer, supplier, test, and regulatory evidence.</p></article>
          <article><span>INTEGRITY</span><strong>File-level hash</strong><p>The manifest detects an unexpected change in bytes, pages, path, or release metadata.</p></article>
          <article><span>NEXT GATE</span><strong>Evidence replaces assumptions</strong><p>Benchmarks, selected interfaces, and formal reviews advance claims one controlled step at a time.</p></article>
        </div>
        <div className={styles.methodLinks}>
          <a href="/documents/manifest.json">Download manifest <ArrowUpRight size={15} /></a>
          <a href="/demo">Open evidence lab <ArrowUpRight size={15} /></a>
          <a href="mailto:procurement@satelliteinference.com">Contact procurement <ArrowUpRight size={15} /></a>
        </div>
      </section>
    </main>
  );
}
