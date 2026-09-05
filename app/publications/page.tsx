import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import manifest from "@/public/documents/manifest.json";
import styles from "../content.module.css";

export const metadata:Metadata={title:"Resources",description:"A short reading path for customers, partners and investors, with technical models and source files available separately.",alternates:{canonical:"/publications"}};
const glossary=[
 ["SAR","Synthetic-aperture radar: satellite imaging using radio waves, able to work day or night and through clouds."],
 ["LEO","Low Earth orbit. The proposed mission studies altitudes of 500–600 km."],
 ["Compute payload","The computing equipment carried by a spacecraft, separate from the systems that power and operate it."],
 ["Downlink","The connection that transmits data from a spacecraft to the ground."],
 ["BOL","Beginning of life: a component’s expected performance when new."],
 ["Pre-SRR","Before System Requirements Review. The design and its requirements are still preliminary."],
];
export default function PublicationsPage(){return <main className={styles.page}>
  <a className="skip-link" href="#publication-list">Skip to resources</a><SiteNavigation/>
  <header className={styles.intro}><p className={styles.eyebrow}>RESOURCES</p><h1>Start with the idea.<br />Go deeper when you need to.</h1><p>The whitepaper explains the program. The mission definition describes its proposed engineering direction. Both are concept documents, not completed hardware or a service commitment.</p></header>
  <section className={styles.section} id="publication-list" tabIndex={-1}>
    <h2>The public reading list.</h2>
    {manifest.documents.map((document,index)=><article className={styles.document} key={document.id}>
      <div><p className={styles.eyebrow}>{index===0?"FOR CUSTOMERS, PARTNERS AND INVESTORS":"FOR MISSION AND ENGINEERING PARTNERS"}</p><h3>{document.title}</h3><p>{index===0?"The problem, proposed product and path from ground validation to orbital computing.":"The proposed 10 kW mission, preliminary requirements and engineering questions still to resolve."}</p><small>Version {document.version} · {document.pageCount} pages · Published {document.publishedOn} · Concept document</small>
      <details><summary>Version details and file verification</summary><p>{document.disclaimer}</p><span>SHA-256 file fingerprint</span><code>{document.sha256}</code><p>{document.byteSize.toLocaleString("en-US")} bytes. Compare this fingerprint with your downloaded file to verify the exact release.</p></details></div>
      <a href={document.url} aria-label={`Open ${document.title} PDF`}>Read PDF <ArrowUpRight aria-hidden="true" size={16}/></a>
    </article>)}
    <div className={styles.linkRow}><a href="/progress">Latest measured research progress</a><a href="/contact">Ask about the program by email</a></div>
  </section>
  <section className={styles.section}>
    <h2>For a closer look.</h2>
    <div className={styles.grid}>
      <article><span>MISSION</span><h3>Explore the engineering.</h3><p>Concept configuration, orbit comparison and the planned development stages.</p><div className={styles.linkRow}><a href="/mission">Open mission models</a></div></article>
      <article><span>WORKLOADS</span><h3>Try the volume calculator.</h3><p>Explore illustrative data-volume estimates for radar, wildfire and optical-image workloads.</p><div className={styles.linkRow}><a href="/demo">Open the calculator</a></div></article>
      <article><span>SOURCE</span><h3>Inspect the method.</h3><p>Read the model explanation, versioned assumptions and calculation source on GitHub.</p><div className={styles.linkRow}><a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/docs/technical-method.md">Read on GitHub</a></div></article>
    </div>
    <details className={styles.details}><summary>Common terms, in plain language</summary><div><dl>{glossary.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></div></details>
    <details className={styles.details}><summary>Previous versions and publication record</summary><div><p>Earlier documents remain available so existing references still work. They have been superseded by the versions above.</p><ul>{manifest.archivedDocuments.map(document=><li key={document.id}><a href={document.url}>{document.title}, version {document.version}</a> · Superseded</li>)}</ul><a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/public/documents/manifest.json">View the version record on GitHub</a></div></details>
    <div className={styles.note}>Detailed financing, supplier correspondence and investor diligence materials are shared privately where appropriate. <a href="/contact">Contact us by email.</a></div>
  </section><SiteFooter/>
</main>;}
