import type { Metadata } from "next";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { FlightNodeConcept } from "@/components/flight-node-concept";
import { OrbitalExplorer, ScaleJourney } from "@/components/orbital-explorer";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Mission concept",
  description: "The proposed 10 kW orbital computing mission, its assumptions and interactive engineering models.",
  alternates: { canonical: "/mission" },
};

export default function MissionPage() {
  return <main className={styles.page}>
    <a className="skip-link" href="#mission-content">Skip to mission details</a>
    <SiteNavigation />
    <header className={styles.intro}>
      <p className={styles.eyebrow}>THE LONG-TERM MISSION</p>
      <h1>Move useful computing<br />closer to the sensor.</h1>
      <p>We are exploring a dedicated computing spacecraft in low Earth orbit. Its value will depend on a real data connection, reliable operation and an advantage over processing on Earth.</p>
      <div className={styles.linkRow}><a href="/progress">See what exists today</a><a href="/publications">Read the mission definition</a></div>
    </header>
    <div id="mission-content" tabIndex={-1}>
      <section className="section section-concept" id="concept">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">02 / FIRST ORBITAL SYSTEM</p>
            <h2>A 10 kW computing target.</h2>
          </div>
          <p>
            Rev C defines the first flight objective as 10 kW continuous electrical input
            to the compute payload in LEO. A proposed 1 kW module is the first ground-hardware
            target. The render communicates architecture, not manufacturing geometry.
          </p>
        </div>
        <FlightNodeConcept />
      </section>

      <section className="section section-space" id="model">
        <div className="section-heading split-heading inverse">
          <div>
            <p className="kicker">03 / ORBIT COMPARISON</p>
            <h2>Explore the orbit.</h2>
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
            <h2>The path from ground to orbit.</h2>
          </div>
          <p>
            The proposed hardware path begins with a 1 kW ground module, followed by a 10 kW
            ground system and a first orbital mission. These hardware stages are planned.
            Moving between stages requires measured performance, a customer use case and a viable mission.
          </p>
        </div>
        <ScaleJourney />
      </section>


      <section className={styles.section} id="architecture">
        <p className={styles.eyebrow}>PLANNED SYSTEM</p><h2>The computer is one part of the mission.</h2>
        <div className={styles.grid}>
          <article><span>DATA CONNECTION</span><h3>A path from sensor to compute.</h3><p>A hosted or separate computing payload needs a defined sensor interface or inter-satellite link. Bandwidth, availability and routing must support the intended workload.</p></article>
          <article><span>POWER AND COOLING</span><h3>Continuous operation.</h3><p>Solar arrays, batteries, radiators and scheduling must support the load through sunlight and eclipse. Current values are planning estimates.</p></article>
          <article><span>RELIABILITY</span><h3>Recover and verify.</h3><p>Fault monitoring, saved recovery points, rollback and telemetry are planned runtime requirements. They have not been qualified for flight.</p></article>
        </div>
      </section>
      <section className={styles.section} id="sources">
        <p className={styles.eyebrow}>FOR TECHNICAL REVIEWERS</p>
        <h2>Inspect the calculations.</h2>
        <p>These are preliminary engineering models. Assumptions are the inputs, equations describe the calculation, and outputs are the resulting estimates. All three are readable on GitHub.</p>
        <div className={styles.linkRow}>
          <a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/docs/technical-method.md">Method and limitations on GitHub</a>
          <a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/public/data/model-assumptions.json">Model inputs</a>
          <a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/public/model/engineering-screen.mjs">Equations</a>
          <a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/public/data/site-model.json">Calculated outputs</a>
        </div>
      </section>
    </div>
    <SiteFooter />
  </main>;
}
