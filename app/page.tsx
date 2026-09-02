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

const capabilities = [
  {
    icon: CircuitBoard,
    label: "On-orbit inference",
    text: "Run filtering, detection, classification, compression, and autonomy close to the sensor.",
  },
  {
    icon: Radio,
    label: "Downlink reduction",
    text: "Transmit prioritized results and evidence instead of every raw byte generated on orbit.",
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

const marketWedges = [
  {
    label: "Defense and sovereign",
    text: "Time-sensitive detection and decision support when data sovereignty, resilience and controlled tasking matter.",
  },
  {
    label: "Earth observation",
    text: "Filter, classify and prioritize optical, radar or RF-derived data before scarce downlink capacity is consumed.",
  },
  {
    label: "Maritime domain awareness",
    text: "Fuse detections and behavioral signals close to collection for faster vessel-level alerts and smaller result packages.",
  },
  {
    label: "Disaster response",
    text: "Turn new imagery into priority maps and machine-readable alerts while the response window is still open.",
  },
];

const seedAllocation = [
  ["Core team and specialist engineering", "$3.40M"],
  ["Ground tile and integrated hardware", "$1.35M"],
  ["Environmental and radiation testing", "$0.75M"],
  ["Supplier studies and interfaces", "$0.45M"],
  ["Regulatory, legal, security and export", "$0.35M"],
  ["Software, data, facilities and operations", "$0.25M"],
  ["Program reserve", "$0.45M"],
];

const contactChannels = [
  {
    label: "General",
    email: "contact@satelliteinference.com",
    description: "General inquiries and the right starting point when you are not sure which team to contact.",
  },
  {
    label: "Procurement",
    email: "procurement@satelliteinference.com",
    description: "Components, quotations, lead times, supplier qualification, and technical interface data.",
  },
  {
    label: "Partnerships",
    email: "partnerships@satelliteinference.com",
    description: "Spacecraft operators, sensor owners, compute, thermal, launch, and mission integration partners.",
  },
  {
    label: "Investors",
    email: "investors@satelliteinference.com",
    description: "Investor relations, financing conversations, and company information requests.",
  },
  {
    label: "Billing",
    email: "billing@satelliteinference.com",
    description: "Invoices, payments, vendor onboarding, tax forms, and remittance questions.",
  },
  {
    label: "Legal",
    email: "legal@satelliteinference.com",
    description: "Contracts, corporate matters, intellectual property, and formal legal notices.",
  },
  {
    label: "Security",
    email: "security@satelliteinference.com",
    description: "Responsible disclosure, suspected abuse, privacy, and information security matters.",
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
            A 10 kW continuous-compute node in low Earth orbit for defense,
            Earth-observation, maritime and disaster-response data, built from
            a ground-validated 1 kW modular tile.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#model">
              Explore the orbital model <ArrowDown aria-hidden="true" size={17} />
            </a>
            <a className="button button-ghost" href="./documents/Satellite_Inference_Whitepaper_v0.2.pdf">
              Read Whitepaper v0.2 <FileText aria-hidden="true" size={16} />
            </a>
          </div>
          <div className="hero-proof" aria-label="Program baseline">
            <div><strong>10 kW</strong><span>continuous payload input</span></div>
            <div><strong>500-600 km</strong><span>LEO baseline</span></div>
            <div><strong>$7M</strong><span>development capital target</span></div>
          </div>
        </div>
        <figure className="hero-visual hero-node-figure reveal-up delay-one">
          <div className="hero-node-frame">
            <Image
              src="./assets/concepts/orbital-node-10kw-concept-v01.png"
              alt="Notional 10 kilowatt orbital compute node with large solar wings and radiator panels above Earth"
              fill
              sizes="(max-width: 820px) 100vw, 48vw"
              className="hero-node-image"
              priority
            />
            <div className="hero-node-reticle" aria-hidden="true" />
          </div>
          <figcaption className="visual-caption"><span>10 KW NODE / REV C</span> Notional configuration, not flight CAD</figcaption>
        </figure>
        <a href="#why" className="scroll-cue" aria-label="Continue to the next section">
          <span>Scroll to enter orbit</span><ArrowDown size={15} aria-hidden="true" />
        </a>
      </section>

      <section className="signal-strip" aria-label="Target markets">
        <span className="signal-strip-label">BUILT FOR</span>
        <span className="sr-only">{markets.join(", ")}</span>
        <div className="signal-strip-track" aria-hidden="true">
          {[...markets, ...markets].map((market, index) => (
            <span key={`${market}-${index}`}>{market}<i /></span>
          ))}
        </div>
      </section>

      <div id="content">
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
            <span>01</span><Satellite aria-hidden="true" /><strong>Sense</strong><small>Raw orbital data</small>
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
        <div className="market-wedge-grid" aria-label="Initial customer markets">
          {marketWedges.map((market, index) => (
            <article key={market.label}>
              <span>0{index + 1}</span>
              <h3>{market.label}</h3>
              <p>{market.text}</p>
            </article>
          ))}
        </div>
        <p className="market-later-note"><strong>LATER MARKET</strong> Generic cloud inference follows after flight economics, network utilization and service reliability are measured.</p>
      </section>

      <section className="section section-concept" id="concept">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">02 / FIRST ORBITAL SYSTEM</p>
            <h2>10 kW continuous.<br />One honest baseline.</h2>
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
            <p className="kicker">03 / ORBIT LAB</p>
            <h2>Place the node.<br />See the physics.</h2>
          </div>
          <p>
            Move continuously from 200 km to GEO. Orbital radius shares one physical
            scale with Earth; period, propagation and worst-case eclipse are calculated
            locally from disclosed constants.
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
            <p>Compute module, storage, PMAD, battery, deployable solar, thermal transport, communications, ADCS, propulsion, and disposal.</p>
            <div className="stack-diagram" aria-label="Simplified orbital compute architecture">
              <span>Sensor</span><i />
              <span>Runtime</span><i />
              <span>Compute</span><i />
              <span>Result</span>
            </div>
          </article>
          <article className="stack-card">
            <div className="stack-card-top"><span>SOFTWARE</span><Braces aria-hidden="true" /></div>
            <h3>Radiation-aware runtime</h3>
            <p>Signed workloads, monitoring, checkpoint, rollback, fault isolation, and reproducible telemetry.</p>
          </article>
          <article className="stack-card">
            <div className="stack-card-top"><span>CONTROL</span><Gauge aria-hidden="true" /></div>
            <h3>Power-thermal scheduler</h3>
            <p>Workload admission based on energy, temperature, communications, pointing, and mission priority.</p>
          </article>
          <article className="stack-card stack-card-wide">
            <div className="stack-card-top"><span>COMMERCIAL OUTPUT</span><BookOpen aria-hidden="true" /></div>
            <h3>Evidence, not abstract FLOPS</h3>
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
          <article><span>TBD BY SUPPLIER</span><h3>Evidence still required</h3><p>Interface data, mass, loads, deployment dynamics, thermal performance and launch compatibility.</p></article>
        </div>
        <div className="evidence-gates">
          <span>PRE-SRR</span><i />
          <span>SUPPLIER ICD</span><i />
          <span>COUPLED ANALYSIS</span><i />
          <span>HARDWARE TEST</span><i />
          <span>FLIGHT EVIDENCE</span>
        </div>
        <div className="evidence-model-links" aria-label="Public model files">
          <span>REPRODUCE THE SCREEN</span>
          <a href="./data/model-assumptions.json">Assumptions JSON <ArrowUpRight aria-hidden="true" /></a>
          <a href="./model/engineering-screen.mjs">Equation source <ArrowUpRight aria-hidden="true" /></a>
          <a href="./data/site-model.json">Published outputs <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="section section-financing" id="financing">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">07 / DEVELOPMENT CAPITAL</p>
            <h2>$7M to turn a thesis<br />into an investable program.</h2>
          </div>
          <p>
            The current target funds the engineering team, 1 kW ground tile, 10 kW ground
            breadboard, supplier-backed mission baseline, SRR/PDR package and customer pilots.
            It is not presented as sufficient capital to manufacture and launch the full node.
          </p>
        </div>
        <div className="financing-layout">
          <article className="financing-target-card">
            <span>CURRENT DEVELOPMENT CAPITAL TARGET</span>
            <strong>$7,000,000</strong>
            <p>Planning target, subject to legal structuring, technical diligence and commercial validation.</p>
          </article>
          <div className="financing-allocation" aria-label="Illustrative use of funds">
            {seedAllocation.map(([label, amount]) => (
              <div key={label}><span>{label}</span><strong>{amount}</strong></div>
            ))}
          </div>
        </div>
        <div className="capital-gates" aria-label="Illustrative staged financing path">
          <div><span>NOW</span><strong>$7M</strong><p>Team, ground proof, SRR/PDR and customer evidence</p></div>
          <div><span>AFTER PDR</span><strong>$25-40M</strong><p>Flight development, qualification and long-lead hardware</p></div>
          <div><span>AFTER CONTRACTS + CDR</span><strong>$100-150M</strong><p>First-node manufacturing, launch and operations program</p></div>
          <div><span>AFTER FLIGHT PROOF</span><strong>$200M+</strong><p>Fleet replication and industrial capacity</p></div>
        </div>
        <p className="financing-disclaimer">Information only. These planning ranges are not an offer to sell or a solicitation to purchase securities.</p>
      </section>

      <section className="section section-documents" id="documents">
        <div className="document-intro">
          <p className="kicker">08 / PUBLIC BASELINE</p>
          <h2>Read the engineering case.</h2>
          <p>
            Version 0.2 Rev C is a transparent, pre-SRR working baseline. It exposes assumptions,
            separates known facts from model outputs, and states which supplier and customer
            evidence must replace early estimates.
          </p>
        </div>
        <div className="document-grid">
          <a className="document-card document-card-primary" href="./documents/Satellite_Inference_Whitepaper_v0.2.pdf">
            <span className="document-type">WHITEPAPER / ENGLISH / PDF</span>
            <h3>Orbital Computing Infrastructure</h3>
            <p>10 kW LEO thesis, initial markets, development architecture, parametric model, capital gates and public risk register.</p>
            <div><span>Version 0.2 / Rev C</span><ArrowUpRight aria-hidden="true" /></div>
          </a>
          <a className="document-card" href="./documents/Node_10kW_Public_Mission_Definition_v0.2.pdf">
            <span className="document-type">MISSION SUMMARY / ENGLISH / PDF</span>
            <h3>10 kW Orbital Node Mission Definition</h3>
            <p>Mission purpose, success criteria, preliminary architecture, public requirement categories, risks and review gates.</p>
            <div><span>Pre-SRR baseline</span><ArrowUpRight aria-hidden="true" /></div>
          </a>
          <a className="document-card" href="./documents/Satellite_Inference_Fundraising_Roadmap_v0.1.pdf">
            <span className="document-type">CAPITAL ROADMAP / ENGLISH / PDF</span>
            <h3>From $7M Development Capital to First Node</h3>
            <p>Illustrative use of funds, milestone gates and the conditional path to flight-development and first-node financing.</p>
            <div><span>Planning baseline</span><ArrowUpRight aria-hidden="true" /></div>
          </a>
        </div>
        <div className="method-note">
          <strong>What v0.2 is not</strong>
          <p>Not flight-release data, not manufacturing CAD, not a launch reservation, not a supplier quotation, and not an offer to sell securities.</p>
        </div>
      </section>

      <section className="closing-section">
        <div>
          <p className="kicker">SATELLITE INFERENCE</p>
          <h2>Build the first node<br />at useful scale.</h2>
        </div>
        <div className="closing-actions">
          <p>We are looking for mission-data customers, spacecraft and subsystem suppliers, compute and thermal partners, and U.S. mission integrators.</p>
          <a className="button button-primary" href="mailto:partnerships@satelliteinference.com">Start a technical conversation <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="section section-contact" id="contact">
        <div className="section-heading split-heading inverse contact-heading">
          <div>
            <p className="kicker">09 / CONTACT DIRECTORY</p>
            <h2>Reach the right channel<br />on the first transmission.</h2>
          </div>
          <p>
            These role addresses define the intended routing for supplier, partner, investor,
            financial, legal and security conversations. Alias availability is verified as each
            channel enters active use; procurement is the current supplier channel.
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

      <footer>
        <div className="footer-brand">
          <Image src="./logo-mark.svg" alt="" width={34} height={34} />
          <div><strong>Satellite Inference</strong><span>Orbital Computing Infrastructure</span></div>
        </div>
        <div className="footer-links">
          <a href="mailto:contact@satelliteinference.com">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="/.well-known/security.txt">Security</a>
        </div>
        <p className="footer-legal">
          Satellite Inference™ is currently operated by RFID INC, a Delaware corporation. © 2026 RFID INC. All rights reserved.<br />
          Public working concept, 2 September 2026. Preliminary assumptions require supplier, regulatory and customer validation.
        </p>
      </footer>
      </div>
    </main>
  );
}
