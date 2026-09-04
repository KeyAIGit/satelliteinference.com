import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Braces,
  CircuitBoard,
  FileText,
  Gauge,
  Orbit,
  Radio,
  Satellite,
  ShieldCheck,
  ThermometerSun,
} from "lucide-react";
import Image from "next/image";
import { OrbitalExplorer, ScaleJourney } from "@/components/orbital-explorer";
import { FlightNodeConcept } from "@/components/flight-node-concept";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";

const capabilities = [
  {
    icon: CircuitBoard,
    label: "On-orbit inference",
    text: "Run filtering, detection, classification, compression, and autonomy close to the sensor.",
  },
  {
    icon: Radio,
    label: "Downlink reduction",
    text: "Transmit prioritized results and selected evidence before bulk raw data that still matters.",
  },
  {
    icon: ThermometerSun,
    label: "Power-thermal scheduling",
    text: "Schedule useful workloads against sunlight, battery state, radiator capacity, and contact windows.",
  },
  {
    icon: ShieldCheck,
    label: "Radiation-aware runtime",
    text: "Detect faults, checkpoint state, recover safely, and create a traceable flight evidence record.",
  },
];

const markets = [
  "Defense and sovereign missions",
  "Earth observation",
  "Maritime domain awareness",
  "Disaster response",
];

const workloadPriorities = [
  {
    role: "PRIMARY BENCHMARK CANDIDATE",
    label: "SAR maritime vessel detection — first priority",
    text: "Locate vessels in synthetic-aperture radar imagery and prioritize scenes for review before the full image reaches Earth.",
  },
  {
    role: "SECONDARY BENCHMARK CANDIDATE",
    label: "Wildfire and rapid change",
    text: "Use optical imagery to flag new fires and meaningful changes, then send coordinates and priority regions first.",
  },
  {
    role: "CONTROL BENCHMARK",
    label: "Optical image quality",
    text: "Identify cloud-covered, blurred, or otherwise unusable imagery. This tests the complete data path without pretending it needs 10 kW by itself.",
  },
];

const contactChannels = [
  {
    label: "Procurement",
    email: "procurement@satelliteinference.com",
    description: "The currently verified public channel for supplier, technical, partner, and general program inquiries.",
  },
];

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#content">Skip to main content</a>
      <SiteNavigation />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span /> Operated by RFID INC</p>
          <h1 id="hero-title">Compute where<br />space data begins.</h1>
          <p className="hero-lead">
            We plan a computing spacecraft (node) in low Earth orbit (LEO), with 10 kW
            continuously available to its onboard computing equipment (payload). The first
            ground benchmark is maritime vessel detection and scene prioritization in
            synthetic-aperture radar (SAR) imagery, starting with a 1 kW ground test unit.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/demo">
              Explore the evidence lab <ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <a className="button button-ghost" href="/documents/Satellite_Inference_Public_Whitepaper_v0.4.pdf">
              Read Whitepaper v0.4 <FileText aria-hidden="true" size={16} />
            </a>
          </div>
          <div className="hero-proof" aria-label="Program baseline">
            <div><strong>10 kW</strong><span>continuous power for computing</span></div>
            <div><strong>500-600 km</strong><span>low Earth orbit baseline</span></div>
            <div><strong>SAR first</strong><span>radar vessel-detection benchmark</span></div>
          </div>
        </div>
        <figure className="hero-visual hero-node-figure reveal-up delay-one">
          <div className="hero-node-frame">
            <Image
              src="/assets/concepts/orbital-node-10kw-concept-v01.png"
              alt="Notional 10 kilowatt orbital compute node with large solar wings and radiator panels above Earth"
              fill
              sizes="(max-width: 820px) 100vw, 48vw"
              className="hero-node-image"
              priority
            />
            <div className="hero-node-reticle" aria-hidden="true" />
          </div>
          <figcaption className="visual-caption"><span>10 kW NODE / REV C</span> Notional configuration, not flight CAD</figcaption>
        </figure>
        <a href="#why" className="scroll-cue" aria-label="Continue to the next section">
          <span>Scroll to enter orbit</span><ArrowDown size={15} aria-hidden="true" />
        </a>
      </section>

      <section className="signal-strip" aria-label="Potential user sectors">
        <span className="signal-strip-label">POTENTIAL USERS</span>
        <span className="sr-only">{markets.join(", ")}</span>
        <div className="signal-strip-track" aria-hidden="true">
          {[...markets, ...markets].map((market, index) => (
            <span key={`${market}-${index}`}>{market}<i /></span>
          ))}
        </div>
      </section>

      <div id="content" tabIndex={-1}>
      <section className="section section-light" id="why">
        <div className="section-heading split-heading">
          <div>
            <p className="kicker">01 / THE THESIS</p>
            <h2>Do not downlink a problem<br />you can solve in orbit.</h2>
          </div>
          <p>
            Space sensors create more data than constrained links can always move.
            Satellite Inference turns raw streams into prioritized, verifiable results
            before transmission to Earth. The first customer wedge is mission data that
            is valuable because it is timely, controlled and actionable.
          </p>
        </div>
        <ol className="flow-line" aria-label="Data reduction flow">
          <li className="flow-node">
            <span>01</span><Satellite aria-hidden="true" /><strong>Candidate data source</strong><small>Raw orbital data</small>
          </li>
          <li className="flow-arrow" aria-hidden="true"><span>HIGH VOLUME</span></li>
          <li className="flow-node flow-node-accent">
            <span>02</span><CircuitBoard aria-hidden="true" /><strong>Infer</strong><small>Filter and classify</small>
          </li>
          <li className="flow-arrow flow-arrow-short" aria-hidden="true"><span>REDUCED</span></li>
          <li className="flow-node">
            <span>03</span><Radio aria-hidden="true" /><strong>Deliver</strong><small>Useful result</small>
          </li>
        </ol>
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, label, text }, index) => (
            <article className="capability-card" key={label}>
              <div className="capability-number">0{index + 1}</div>
              <Icon aria-hidden="true" />
              <h3>{label}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="market-wedge-grid" aria-label="Ground benchmark priorities, led by SAR maritime vessel detection">
          {workloadPriorities.map((workload, index) => (
            <article key={workload.label}>
              <span>0{index + 1}</span>
              <small>{workload.role}</small>
              <h3>{workload.label}</h3>
              <p>{workload.text}</p>
            </article>
          ))}
        </div>
        <p className="market-later-note"><strong>CURRENT STATUS</strong> These are benchmark priorities, not customer commitments. The first flight workload still requires measured performance, lawful data access, and a paying mission partner. A single image does not establish a vessel&apos;s identity, intent, or illegal activity; any activity cue requires location history, ship-identification broadcasts, radio signals, or other corroborating context.</p>
        <p className="market-later-note"><strong>LATER MARKET</strong> Broader cloud-style computing services in orbit come later, after flight economics, network use, and service reliability are measured.</p>
      </section>

      <section className="section section-concept" id="concept">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">02 / FIRST ORBITAL SYSTEM</p>
            <h2>10 kW electrical input.<br />One honest baseline.</h2>
          </div>
          <p>
            Rev C defines the first flight objective as 10 kW continuous electrical input
            to the compute payload in LEO. The 1 kW module remains on the ground as a testable
            building block. The render communicates architecture, not manufacturing geometry.
          </p>
        </div>
        <FlightNodeConcept />
      </section>

      <section className="section section-space" id="model">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">03 / ORBIT COMPARISON</p>
            <h2>Compare altitude.<br />See the physics.</h2>
          </div>
          <p>
            The 500-600 km low Earth orbit (LEO) band is the program baseline. Use other
            altitudes through geostationary orbit (GEO) only as comparisons. Distance shares
            one scale with Earth; orbit time, signal travel time, and maximum shadow time are calculated.
          </p>
        </div>
        <OrbitalExplorer />
      </section>

      <section className="section section-roadmap" id="roadmap">
        <div className="section-heading split-heading">
          <div>
            <p className="kicker">04 / GATED SCALE</p>
            <h2>Flight evidence before<br />industrial scale.</h2>
          </div>
          <p>
            The program does not need a smaller orbital product to start. A 1 kW ground tile
            rolls into a 10 kW ground breadboard and then the first 10 kW LEO node. Later scale
            is conditional on measured performance, customer evidence and launch architecture.
          </p>
        </div>
        <ScaleJourney />
      </section>

      <section className="section section-light" id="architecture">
        <div className="section-heading split-heading">
          <div>
            <p className="kicker">05 / THE STACK</p>
            <h2>Hardware, runtime,<br />and flight evidence.</h2>
          </div>
          <p>
            The product is not an accelerator placed in a box. Useful orbital compute
            is a coupled power, thermal, data, reliability, communications, and operations system.
          </p>
        </div>
        <div className="stack-grid">
          <article className="stack-card stack-card-large">
            <div className="stack-card-top"><span>FLIGHT NODE</span><Orbit aria-hidden="true" /></div>
            <h3>Integrated orbital compute</h3>
            <p>Computing, storage, power management, battery, deployable solar panels, heat removal, communications, pointing control, propulsion, and disposal.</p>
            <div className="stack-diagram" aria-label="Simplified orbital compute architecture">
              <span>Candidate data path</span><i />
              <span>Runtime</span><i />
              <span>Compute</span><i />
              <span>Result</span>
            </div>
          </article>
          <article className="stack-card">
            <div className="stack-card-top"><span>SOFTWARE</span><Braces aria-hidden="true" /></div>
            <h3>Radiation-aware runtime</h3>
            <p>Signed software, fault monitoring, saved recovery points, automatic rollback, isolation, and traceable operating data.</p>
          </article>
          <article className="stack-card">
            <div className="stack-card-top"><span>CONTROL</span><Gauge aria-hidden="true" /></div>
            <h3>Power-thermal scheduler</h3>
            <p>Workload admission based on energy, temperature, communications, pointing, and mission priority.</p>
          </article>
          <article className="stack-card stack-card-wide">
            <div className="stack-card-top"><span>COMMERCIAL OUTPUT</span><BookOpen aria-hidden="true" /></div>
            <h3>Evidence, not processor speed alone</h3>
            <p>Customer value is measured through reduced downlink, time to decision, verified model quality, available processing windows, and a traceable result package.</p>
          </article>
        </div>
      </section>

      <section className="section section-evidence" id="evidence">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">06 / ENGINEERING EVIDENCE</p>
            <h2>A claim is only as strong<br />as its status.</h2>
          </div>
          <p>
            The public model carries units, provenance and status with every important value.
            Supplier data, coupled analyses and test evidence replace preliminary screens at formal gates.
          </p>
        </div>
        <div className="evidence-grid">
          <article><span>CALCULATED</span><h3>Reproducible model output</h3><p>Derived by published Rev C equations from versioned assumptions and checked by equation-based deterministic tests.</p></article>
          <article><span>WORKING ASSUMPTION</span><h3>Planning input</h3><p>A target or early input that remains subject to trade studies, mission definition and validation.</p></article>
          <article><span>NOTIONAL GEOMETRY</span><h3>Packaging communication</h3><p>Concept geometry for scale, deployment and interface conversations. It is not flight CAD.</p></article>
          <article><span>SUPPLIER DATA NEEDED</span><h3>Evidence still required</h3><p>Interface data, mass, loads, deployment dynamics, thermal performance and launch compatibility.</p></article>
        </div>
        <div className="evidence-gates">
          <span>BEFORE REQUIREMENTS REVIEW</span><i />
          <span>SUPPLIER INTERFACE DATA</span><i />
          <span>COUPLED ANALYSIS</span><i />
          <span>HARDWARE TEST</span><i />
          <span>FLIGHT EVIDENCE</span>
        </div>
        <div className="evidence-model-links" aria-label="Public model files">
          <span>REPRODUCE THE SCREEN</span>
          <a href="/data/model-assumptions.json">Assumptions JSON <ArrowUpRight aria-hidden="true" /></a>
          <a href="/model/engineering-screen.mjs">Equation source <ArrowUpRight aria-hidden="true" /></a>
          <a href="/data/site-model.json">Published outputs <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="section section-documents" id="documents">
        <div className="document-intro">
          <p className="kicker">07 / PUBLIC BASELINE</p>
          <h2>Choose the document<br />for your question.</h2>
          <p>
            The whitepaper explains why the company should exist. The mission definition states
            what the proposed 10 kW Orbital Node must prove. Detailed financing and diligence materials are
            shared privately with approved counterparties.
          </p>
        </div>
        <div className="document-action-stack">
          <a className="button button-primary" href="/publications">Open the public document library <ArrowUpRight aria-hidden="true" size={16} /></a>
          <div className="method-note">
            <strong>Public and controlled material stay separate</strong>
            <p>Supplier responses, customer correspondence, detailed budgets, security-sensitive engineering, and investor diligence do not belong in the public library.</p>
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div>
          <p className="kicker">SATELLITE INFERENCE</p>
          <h2>Build the first node<br />at useful scale.</h2>
        </div>
        <div className="closing-actions">
          <p>We are looking for mission-data customers, spacecraft and subsystem suppliers, compute and thermal partners, and U.S. mission integrators.</p>
          <a className="button button-primary" href="mailto:procurement@satelliteinference.com">Start a technical conversation <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="section section-contact" id="contact">
        <div className="section-heading split-heading inverse contact-heading">
          <div>
            <p className="kicker">08 / CONTACT DIRECTORY</p>
            <h2>Reach the right channel<br />on the first transmission.</h2>
          </div>
          <p>
            Procurement is the currently verified public channel for supplier, partner,
            technical, and general program conversations. Additional role addresses will be
            published only after they are configured and tested.
          </p>
        </div>
        <div className="contact-grid">
          {contactChannels.map((channel, index) => (
            <a className="contact-card" href={`mailto:${channel.email}`} key={channel.email}>
              <div className="contact-card-top">
                <span>{String(index + 1).padStart(2, "0")} / {channel.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </div>
              <strong>{channel.email}</strong>
              <p>{channel.description}</p>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
      </div>
    </main>
  );
}
