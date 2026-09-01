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
  Sparkles,
  ThermometerSun,
} from "lucide-react";
import Image from "next/image";
import { OrbitalExplorer, ScaleJourney } from "@/components/orbital-explorer";

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
  "Earth observation",
  "Synthetic aperture radar",
  "Hyperspectral sensing",
  "Civil RF analytics",
  "Weather and science",
  "Autonomous spacecraft",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Satellite Inference home">
          <Image src="/logo-mark.svg" alt="" className="brand-mark" width={37} height={37} priority />
          <span>
            <strong>Satellite Inference</strong>
            <small>Orbital Computing Infrastructure</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#model">Orbit model</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#architecture">Architecture</a>
          <a href="#documents">Documents</a>
        </nav>
        <a className="header-cta" href="#documents">
          Whitepaper <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span /> A program of RFID INC</p>
          <h1>Compute where<br />space data begins.</h1>
          <p className="hero-lead">
            Orbital computing infrastructure for spacecraft, constellations,
            and autonomous systems, scaling from hosted flight tests to
            megawatt-class networks.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#model">
              Explore the orbital model <ArrowDown aria-hidden="true" size={17} />
            </a>
            <a className="button button-ghost" href="/documents/Satellite_Inference_Whitepaper_v0.1.pdf">
              Read Whitepaper v0.1 <FileText aria-hidden="true" size={16} />
            </a>
          </div>
          <div className="hero-proof" aria-label="Program baseline">
            <div><strong>500-600 km</strong><span>LEO baseline</span></div>
            <div><strong>1 kW</strong><span>first owned node</span></div>
            <div><strong>10 kW</strong><span>solar at launch</span></div>
          </div>
        </div>
        <div className="hero-visual reveal-up delay-one" aria-label="Animated orbital compute concept">
          <div className="hero-orbit-shell">
            <div className="orbit-label orbit-label-top">DATA ORIGIN</div>
            <div className="orbit-label orbit-label-bottom">USEFUL RESULT</div>
            <div className="hero-earth">
              <span className="earth-grid" />
              <span className="earth-light" />
            </div>
            <div className="hero-orbit-ring orbit-ring-a"><span /></div>
            <div className="hero-orbit-ring orbit-ring-b"><span /></div>
            <div className="signal-trace trace-one" />
            <div className="signal-trace trace-two" />
            <div className="compute-card compute-card-one">
              <Braces size={15} aria-hidden="true" />
              <span>FILTER</span>
            </div>
            <div className="compute-card compute-card-two">
              <Sparkles size={15} aria-hidden="true" />
              <span>INFER</span>
            </div>
            <div className="compute-card compute-card-three">
              <Radio size={15} aria-hidden="true" />
              <span>PRIORITIZE</span>
            </div>
          </div>
          <p className="visual-caption"><span>SIMULATION 01</span> Processing moves closer to the sensor</p>
        </div>
        <a href="#why" className="scroll-cue" aria-label="Continue to the next section">
          <span>Scroll to enter orbit</span><ArrowDown size={15} aria-hidden="true" />
        </a>
      </section>

      <section className="signal-strip" aria-label="Target markets">
        <span className="signal-strip-label">BUILT FOR</span>
        <div className="signal-strip-track">
          {[...markets, ...markets].map((market, index) => (
            <span key={`${market}-${index}`}>{market}<i /></span>
          ))}
        </div>
      </section>

      <section className="section section-light" id="why">
        <div className="section-heading split-heading">
          <div>
            <p className="kicker">01 / THE THESIS</p>
            <h2>Do not downlink a problem<br />you can solve in orbit.</h2>
          </div>
          <p>
            Space sensors create more data than constrained links can always move.
            Satellite Inference turns raw streams into prioritized, verifiable results
            before transmission to Earth.
          </p>
        </div>
        <div className="flow-line" aria-label="Data reduction flow">
          <div className="flow-node">
            <span>01</span><Satellite aria-hidden="true" /><strong>Sense</strong><small>Raw orbital data</small>
          </div>
          <div className="flow-arrow"><span>HIGH VOLUME</span></div>
          <div className="flow-node flow-node-accent">
            <span>02</span><CircuitBoard aria-hidden="true" /><strong>Infer</strong><small>Filter and classify</small>
          </div>
          <div className="flow-arrow flow-arrow-short"><span>REDUCED</span></div>
          <div className="flow-node">
            <span>03</span><Radio aria-hidden="true" /><strong>Deliver</strong><small>Useful result</small>
          </div>
        </div>
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
      </section>

      <section className="section section-space" id="model">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">02 / ORBIT LAB</p>
            <h2>Place the node.<br />See the physics.</h2>
          </div>
          <p>
            Compare a 550 km reference LEO with geostationary orbit. Geometry,
            propagation delay, orbital period, and idealized maximum eclipse are
            calculated in the browser from published physical constants.
          </p>
        </div>
        <OrbitalExplorer />
      </section>

      <section className="section section-roadmap" id="roadmap">
        <div className="section-heading split-heading">
          <div>
            <p className="kicker">03 / GATED SCALE</p>
            <h2>Flight evidence before<br />industrial scale.</h2>
          </div>
          <p>
            Every step is a separate mission, budget, and review gate. The number
            in each Node name always means continuous compute power. Solar generation
            is stated separately.
          </p>
        </div>
        <ScaleJourney />
      </section>

      <section className="section section-light" id="architecture">
        <div className="section-heading split-heading">
          <div>
            <p className="kicker">04 / THE STACK</p>
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

      <section className="section section-documents" id="documents">
        <div className="document-intro">
          <p className="kicker">05 / PUBLIC BASELINE</p>
          <h2>Read the engineering case.</h2>
          <p>
            Version 0.1 is a transparent, pre-SRR working baseline. It exposes assumptions,
            separates known facts from model outputs, and states which supplier and customer
            evidence must replace early estimates.
          </p>
        </div>
        <div className="document-grid">
          <a className="document-card document-card-primary" href="/documents/Satellite_Inference_Whitepaper_v0.1.pdf">
            <span className="document-type">WHITEPAPER / ENGLISH / PDF</span>
            <h3>Orbital Computing Infrastructure</h3>
            <p>Program thesis, market entry, proposed mission ladder, parametric model, evidence gates, and public risk register.</p>
            <div><span>Version 0.1</span><ArrowUpRight aria-hidden="true" /></div>
          </a>
          <a className="document-card" href="/documents/Node_1kW_Public_Mission_Definition_v0.1.pdf">
            <span className="document-type">MISSION SUMMARY / ENGLISH / PDF</span>
            <h3>Node 1 kW Public Mission Definition</h3>
            <p>Mission purpose, success criteria, preliminary architecture, public requirement categories, risks, and review gates.</p>
            <div><span>Pre-SRR baseline</span><ArrowUpRight aria-hidden="true" /></div>
          </a>
        </div>
        <div className="method-note">
          <strong>What v0.1 is not</strong>
          <p>Not flight-release data, not manufacturing CAD, not a launch reservation, not a supplier quotation, and not an offer to sell securities.</p>
        </div>
      </section>

      <section className="closing-section">
        <div>
          <p className="kicker">SATELLITE INFERENCE</p>
          <h2>The next data center<br />may begin as a payload.</h2>
        </div>
        <div className="closing-actions">
          <p>We are looking for spacecraft operators, sensor owners, compute and thermal partners, and U.S. mission integrators.</p>
          <a className="button button-primary" href="mailto:ceo@keyai.org">Start a technical conversation <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <Image src="/logo-mark.svg" alt="" width={34} height={34} />
          <div><strong>Satellite Inference</strong><span>A program of RFID INC</span></div>
        </div>
        <div className="footer-links">
          <a href="https://keyai.org">KeyAI Research</a>
          <a href="https://www.spacex.com/rideshare/">Launch reference</a>
          <a href="https://science.nasa.gov/resource/what-is-a-lagrange-point/">NASA reference</a>
        </div>
        <p className="footer-legal">Public working concept, 1 September 2026. Preliminary assumptions require supplier, regulatory, and customer validation.</p>
      </footer>
    </main>
  );
}
