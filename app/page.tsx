import Image from "next/image";
import { ArrowRight, ArrowUpRight, Layers3, MapPin, ScanLine } from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import styles from "./home.module.css";
import { LegacySectionRedirect } from "@/components/legacy-section-redirect";

export default function Home() {
  return <main className={styles.page}>
    <a className="skip-link" href="#approach">Skip to main content</a>
    <SiteNavigation />
    <LegacySectionRedirect />
    <section className={styles.hero} aria-labelledby="hero-title" id="top">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>GROUND RESEARCH. ORBITAL AMBITION.</p>
        <h1 id="hero-title">Satellite data.<br /><span>Useful answers.</span></h1>
        <p className={styles.heroLead}>We are developing software that turns large satellite images into object candidates, coordinates and evidence. Our long-term goal is to bring that computing into orbit.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#approach">Explore the program <ArrowRight aria-hidden="true" size={18} /></a>
          <a className={styles.secondary} href="/contact">Get in touch <ArrowUpRight aria-hidden="true" size={18} /></a>
        </div>
        <p className={styles.stage}>Current stage <span>Ground software prototype</span></p>
      </div>
      <figure className={styles.heroVisual}>
        <Image src="/assets/concepts/orbital-node-10kw-concept-v01.png" alt="Illustrated concept of a computing spacecraft with deployed solar panels above Earth" fill priority sizes="(max-width: 760px) 100vw, 55vw" />
        <figcaption>ORBITAL NODE CONCEPT <span>Illustration, not flight hardware or validated CAD</span></figcaption>
      </figure>
    </section>
    <section className={styles.approach} id="approach" tabIndex={-1}>
      <div className={styles.sectionHead}>
        <p className={styles.eyebrow}>WHAT WE ARE BUILDING</p>
        <h2>From a large image<br />to a result you can inspect.</h2>
        <p>Our first focus is vessel detection in radar imagery. We begin on the ground, where we can test the complete data path before designing a flight service around it.</p>
      </div>
      <div className={styles.workflow}>
        <article><Layers3 aria-hidden="true" /><span>01 / PROCESS</span><h3>Read the full scene.</h3><p>Process large images in smaller pieces while preserving their location on Earth.</p></article>
        <article><ScanLine aria-hidden="true" /><span>02 / DETECT</span><h3>Find what matters.</h3><p>Identify candidate objects, then test how reliably the model distinguishes vessels from other reflections.</p></article>
        <article><MapPin aria-hidden="true" /><span>03 / DELIVER</span><h3>Return usable evidence.</h3><p>Provide coordinates, image excerpts and a traceable record for further analysis.</p></article>
      </div>
    </section>
    <section className={styles.progress} aria-labelledby="progress-title">
      <div className={styles.progressCopy}>
        <p className={styles.eyebrow}>A REAL FIRST STEP</p>
        <h2 id="progress-title">One full scene.<br />Two repeatable runs.</h2>
        <p>Our ground prototype processed a complete Sentinel-1 radar scene. Both runs produced identical saved candidates and coordinates.</p>
        <dl className={styles.metrics}><div><dt>Scene size</dt><dd>421<span>million pixels</span></dd></div><div><dt>Processing time</dt><dd>94–99<span>seconds on CPU</span></dd></div></dl>
        <p className={styles.limit}>This proves the processing pipeline. Vessel-detection quality and geographic alignment still need improvement.</p>
        <a className={styles.textLink} href="/progress">Read the results and limitations <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
      <figure className={styles.scene}>
        <Image src="/assets/research/full-scene-research-overview.png" alt="Full radar scene near Iceland with all 1,757 unverified object candidates marked, including candidates on land. Approximate geolocation." width={1600} height={1000} sizes="(max-width: 760px) 100vw, 55vw" />
        <figcaption>Actual research output · 3 August 2020 imagery · Candidate marks are not confirmed vessels.</figcaption>
      </figure>
    </section>
    <section className={styles.path} id="mission">
      <div className={styles.sectionHead}>
        <p className={styles.eyebrow}>WHY THIS LEADS TO SPACE</p>
        <h2>Prove the workload.<br />Then move the computing.</h2>
        <p>Processing near a sensor could deliver selected results before a full image reaches the ground. The advantage must be measured against an operator’s existing workflow.</p>
      </div>
      <ol className={styles.stages}>
        <li><span>NOW</span><h3>Ground software</h3><p>Build reliable image processing and measure detection quality.</p></li>
        <li><span>NEXT</span><h3>Customer validation</h3><p>Compare quality, delivery time and computing cost on a defined workload.</p></li>
        <li><span>MISSION CONCEPT</span><h3>Computing in orbit</h3><p>Study a 10 kW compute payload with a viable data link, power and cooling.</p></li>
      </ol>
      <a className={styles.textLink} href="/mission">Explore the mission and engineering models <ArrowRight aria-hidden="true" size={18} /></a>
    </section>
    <section className={styles.join}>
      <div><p className={styles.eyebrow}>BUILD WITH US</p><h2>Bring a real workload.<br />Help shape the mission.</h2><p>We welcome satellite operators, analytics teams, spacecraft partners and investors interested in this early-stage program.</p></div>
      <div className={styles.joinActions}><a className={styles.primary} href="/contact">Contact the team <ArrowUpRight aria-hidden="true" size={18} /></a><a className={styles.secondary} href="/publications">Read the public brief <ArrowRight aria-hidden="true" size={18} /></a><span>Conversations start by email. No call required.</span></div>
    </section>
    <SiteFooter />
  </main>;
}
