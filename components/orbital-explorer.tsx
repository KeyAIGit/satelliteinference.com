"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BatteryCharging, Clock3, Gauge, Radio, Sun, ThermometerSun } from "lucide-react";
import { geoAltitudeKm, latencyMetrics, orbitMetrics } from "@/lib/orbital-physics";

type OrbitKey = "LEO" | "GEO";

const orbitDefinitions: Record<OrbitKey, {
  label: string;
  altitudeKm: number;
  positioning: string;
  note: string;
}> = {
  LEO: {
    label: "Reference LEO",
    altitudeKm: 550,
    positioning: "Program baseline",
    note: "Fast access to space-originated data, lower link loss, and a credible early deorbit path.",
  },
  GEO: {
    label: "Geostationary orbit",
    altitudeKm: geoAltitudeKm(),
    positioning: "Comparison only",
    note: "Persistent regional geometry, but higher launch energy, radiation exposure, and propagation delay.",
  },
};

function calculateOrbit(altitudeKm: number) {
  const orbit = orbitMetrics(altitudeKm);
  const latency = latencyMetrics(altitudeKm);
  return {
    periodMinutes: orbit.periodS / 60,
    eclipseMinutes: orbit.eclipseS / 60,
    oneWayMs: latency.oneWayMs,
    responseFloorMs: latency.requestResultMs,
    sunlitPercent: orbit.sunlitFraction * 100,
  };
}

function formatPeriod(minutes: number) {
  if (minutes < 180) return `${minutes.toFixed(2)} min`;
  return `${(minutes / 60).toFixed(2)} h`;
}

function formatLatency(milliseconds: number) {
  if (milliseconds < 10) return `${milliseconds.toFixed(2)} ms`;
  return `${milliseconds.toFixed(0)} ms`;
}

export function OrbitalExplorer() {
  const [orbit, setOrbit] = useState<OrbitKey>("LEO");
  const definition = orbitDefinitions[orbit];
  const metrics = useMemo(() => calculateOrbit(definition.altitudeKm), [definition.altitudeKm]);
  const orbitScale = orbit === "LEO" ? 0.66 : 0.94;

  return (
    <div className="orbit-lab">
      <div className="orbit-control-panel">
        <div className="orbit-control-head">
          <div>
            <span>ORBIT SELECTION</span>
            <strong>{definition.positioning}</strong>
          </div>
          <div className="orbit-tabs" role="tablist" aria-label="Select an orbit">
            {(Object.keys(orbitDefinitions) as OrbitKey[]).map((key) => (
              <button
                type="button"
                role="tab"
                aria-selected={orbit === key}
                className={orbit === key ? "active" : ""}
                onClick={() => setOrbit(key)}
                key={key}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="orbit-canvas-wrap">
          <svg
            className="orbit-canvas"
            viewBox="0 0 720 500"
            role="img"
            aria-label={`${definition.label} schematic with calculated orbital geometry`}
          >
            <defs>
              <radialGradient id="earthFill" cx="32%" cy="28%">
                <stop offset="0%" stopColor="#73d9ee" />
                <stop offset="35%" stopColor="#187db3" />
                <stop offset="100%" stopColor="#061c38" />
              </radialGradient>
              <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4fe5ff" stopOpacity="0.12" />
                <stop offset="45%" stopColor="#4fe5ff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffbd4a" stopOpacity="0.25" />
              </linearGradient>
              <filter id="nodeGlow" x="-200%" y="-200%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g opacity="0.32">
              {Array.from({ length: 34 }, (_, index) => (
                <circle
                  key={index}
                  cx={(index * 137) % 700 + 10}
                  cy={(index * 83) % 470 + 12}
                  r={index % 5 === 0 ? 1.4 : 0.75}
                  fill="#d7f7ff"
                />
              ))}
            </g>
            <line x1="92" y1="250" x2="630" y2="250" stroke="#91a8bc" strokeOpacity="0.12" strokeDasharray="3 8" />
            <ellipse
              cx="360"
              cy="250"
              rx={280 * orbitScale}
              ry={174 * orbitScale}
              fill="none"
              stroke="url(#orbitStroke)"
              strokeWidth="2"
            />
            <ellipse
              cx="360"
              cy="250"
              rx={280 * orbitScale + 10}
              ry={174 * orbitScale + 6}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.07"
              strokeDasharray="4 10"
            />
            <circle cx="360" cy="250" r="86" fill="url(#earthFill)" />
            <path d="M295 230 C330 210 360 228 390 202 C420 180 445 214 446 238" fill="none" stroke="#93d6b0" strokeOpacity="0.45" strokeWidth="8" strokeLinecap="round" />
            <path d="M288 264 C324 248 344 276 384 264 C410 256 420 274 435 280" fill="none" stroke="#82c99e" strokeOpacity="0.34" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="360" cy="250" rx="86" ry="24" fill="none" stroke="#a9eaf7" strokeOpacity="0.18" />
            <g className={`orbiting-node orbiting-node-${orbit.toLowerCase()}`} style={{ transformOrigin: "360px 250px" }}>
              <g transform={`translate(${360 + 280 * orbitScale} 250)`}>
                <circle r="19" fill="#4fe5ff" fillOpacity="0.16" filter="url(#nodeGlow)" />
                <rect x="-9" y="-7" width="18" height="14" rx="3" fill="#effcff" stroke="#4fe5ff" strokeWidth="2" />
                <rect x="-25" y="-5" width="13" height="10" rx="1" fill="#2b8bdd" stroke="#4fe5ff" strokeWidth="1" />
                <rect x="12" y="-5" width="13" height="10" rx="1" fill="#2b8bdd" stroke="#4fe5ff" strokeWidth="1" />
              </g>
            </g>
            <g transform="translate(360 160)">
              <circle r="4" fill="#ffbd4a" />
              <path d="M0 5 L0 21 M-11 21 L11 21 M-6 21 L-12 33 M6 21 L12 33" stroke="#ffbd4a" strokeWidth="2" fill="none" />
            </g>
            <path
              d={`M360 160 Q${470 + 150 * orbitScale} ${115 + 50 * orbitScale} ${360 + 280 * orbitScale} 250`}
              stroke="#ffbd4a"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="none"
            />
            <text x="28" y="38" fill="#8ba5bb" fontSize="11" letterSpacing="2">PHYSICS-BASED SCHEMATIC</text>
            <text x="28" y="58" fill="#eefbff" fontSize="18" fontWeight="700">{definition.label}</text>
            <text x="28" y="78" fill="#5ddff8" fontSize="12">ALTITUDE {Math.round(definition.altitudeKm).toLocaleString()} KM</text>
          </svg>
          <div className="canvas-readout"><span className="live-dot" /> MODEL RUNNING LOCALLY</div>
        </div>
      </div>

      <div className="orbit-readout-panel" role="tabpanel">
        <div className="orbit-readout-title">
          <span>{orbit} / CALCULATED</span>
          <h3>{definition.label}</h3>
          <p>{definition.note}</p>
        </div>
        <div className="metric-stack">
          <div className="metric-row"><Clock3 aria-hidden="true" /><span><small>Orbital period</small><strong>{formatPeriod(metrics.periodMinutes)}</strong></span></div>
          <div className="metric-row"><Radio aria-hidden="true" /><span><small>One-way space leg</small><strong>{formatLatency(metrics.oneWayMs)}</strong></span></div>
          <div className="metric-row"><Gauge aria-hidden="true" /><span><small>Ground-to-node response floor</small><strong>{formatLatency(metrics.responseFloorMs)}</strong></span></div>
          <div className="metric-row"><Sun aria-hidden="true" /><span><small>Idealized maximum eclipse</small><strong>{metrics.eclipseMinutes.toFixed(2)} min</strong></span></div>
          <div className="metric-row"><BatteryCharging aria-hidden="true" /><span><small>Sunlit fraction at beta 0</small><strong>{metrics.sunlitPercent.toFixed(1)}%</strong></span></div>
        </div>
        <div className="orbit-interpretation">
          <strong>{orbit === "LEO" ? "Why LEO first" : "Why GEO stays a comparison"}</strong>
          <p>
            {orbit === "LEO"
              ? "The first market processes data already generated on spacecraft. LEO closes the near-term flight, link, disposal, and customer-learning loop without requiring GEO insertion."
              : "GEO can offer persistent regional geometry, but it does not improve the first space-originated workload enough to offset launch energy, radiation, communications, and serviceability risk."}
          </p>
        </div>
      </div>
      <p className="model-footnote">
        Circular orbit, spherical Earth, beta angle 0, cylindrical shadow, zenith slant range. Real links and eclipses depend on geometry, atmosphere, inclination, season, pointing, and ground location. GEO eclipse is seasonal.
      </p>
      <details className="model-method">
        <summary>Open equations, constants, and sources</summary>
        <div className="model-method-grid">
          <div>
            <span>ORBITAL PERIOD</span>
            <strong>T = 2pi sqrt(r^3 / mu)</strong>
            <p>Two-body circular-orbit screen using WGS-84 Earth radius and gravitational parameter.</p>
          </div>
          <div>
            <span>PROPAGATION FLOOR</span>
            <strong>t = rho / c</strong>
            <p>Vacuum delay only. It excludes compute time, routing, queues, gateway, and protocol overhead.</p>
          </div>
          <div>
            <span>MAXIMUM ECLIPSE</span>
            <strong>te = T asin(RE / r) / pi</strong>
            <p>Beta 0 cylindrical-shadow estimate. GEO eclipse occurs seasonally near the equinoxes.</p>
          </div>
        </div>
        <div className="model-sources">
          <span>CONSTANTS AND CROSS-CHECKS</span>
          <a href="https://www.ngs.noaa.gov/PUBS_LIB/DevelopmentOfTheWorldGeodeticSystem1984.pdf">NOAA WGS-84</a>
          <a href="https://ssd.jpl.nasa.gov/astro_par.html">NASA JPL astrodynamic parameters</a>
          <a href="https://physics.nist.gov/cgi-bin/cuu/Value?c=">NIST speed of light</a>
          <a href="https://www.ospo.noaa.gov/operations/goes/eclipse.html">NOAA GEO eclipse operations</a>
        </div>
      </details>
    </div>
  );
}

type Mission = {
  name: string;
  code: string;
  stage: string;
  descriptor: string;
  compute: string;
  solar: string;
  battery: string;
  radiator: string;
  architecture: string;
  proof: string;
};

const missions: Mission[] = [
  {
    name: "Hosted Pathfinder",
    code: "SI-HP",
    stage: "MISSION 0",
    descriptor: "Hosted compute flight test",
    compute: "0.2-1.0 kW allocation",
    solar: "Provided by host",
    battery: "Provided by host",
    radiator: "Host interface dependent",
    architecture: "Hosted payload",
    proof: "Compute, recovery, memory behavior, workload packaging, and flight telemetry in the real environment.",
  },
  {
    name: "Node 1 kW",
    code: "SI-N1",
    stage: "MISSION 1",
    descriptor: "First owned free-flyer",
    compute: "1 kW continuous",
    solar: "10 kW BOL",
    battery: "3.7 kWh target",
    radiator: "4.6 m² net",
    architecture: "Single node",
    proof: "Deployable power, eclipse continuity, thermal rejection, owned-bus autonomy, customer workload, and disposal.",
  },
  {
    name: "Node 10 kW",
    code: "SI-N10",
    stage: "MISSION 2",
    descriptor: "Dedicated operational node",
    compute: "10 kW continuous",
    solar: "30.0 kW BOL",
    battery: "26.9 kWh target",
    radiator: "33.3 m² net",
    architecture: "Single node",
    proof: "Commercial utilization, high-rate payload data flow, operational scheduling, and repeatable service economics.",
  },
  {
    name: "Node 100 kW",
    code: "SI-N100",
    stage: "SCALE STAGE",
    descriptor: "High-power orbital platform",
    compute: "100 kW continuous",
    solar: "288 kW BOL",
    battery: "259 kWh target",
    radiator: "320 m² net",
    architecture: "Single-node screen",
    proof: "Large deployable dynamics, modular integration, industrial workload demand, and launch architecture at scale.",
  },
  {
    name: "Grid 1 MW",
    code: "SI-G1MW",
    stage: "NETWORK STAGE",
    descriptor: "Distributed orbital compute network",
    compute: "1 MW aggregate",
    solar: "2.88 MW aggregate BOL",
    battery: "2.59 MWh aggregate",
    radiator: "3,201 m² aggregate",
    architecture: "10-node reference",
    proof: "A ten-module reference cluster, not a claim of one spacecraft or one launch. Architecture follows measured node economics.",
  },
];

export function ScaleJourney() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-24% 0px -48% 0px", threshold: [0.15, 0.45, 0.75] },
    );
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const mission = missions[active];

  return (
    <div className="scale-journey">
      <div className="scale-display">
        <div className="scale-display-head"><span>{mission.stage}</span><strong>{mission.code}</strong></div>
        <div className="scale-visual" aria-hidden="true">
          <div className={`node-geometry node-geometry-${active}`}>
            <span className="node-core" />
            <span className="node-wing node-wing-left" />
            <span className="node-wing node-wing-right" />
            {active === 4 && <>
              <i className="cluster-dot d1" /><i className="cluster-dot d2" />
              <i className="cluster-dot d3" /><i className="cluster-dot d4" />
            </>}
          </div>
          <div className="scale-grid-lines" />
          <span className="scale-value">{mission.compute}</span>
        </div>
        <h3>{mission.name}</h3>
        <p>{mission.descriptor}</p>
        <div className="scale-metrics">
          <span><Sun aria-hidden="true" /><small>Solar</small><strong>{mission.solar}</strong></span>
          <span><BatteryCharging aria-hidden="true" /><small>Battery</small><strong>{mission.battery}</strong></span>
          <span><ThermometerSun aria-hidden="true" /><small>Radiator</small><strong>{mission.radiator}</strong></span>
          <span><Gauge aria-hidden="true" /><small>Architecture</small><strong>{mission.architecture}</strong></span>
        </div>
      </div>
      <div className="scale-steps">
        {missions.map((item, index) => (
          <article
            key={item.code}
            data-index={index}
            ref={(node) => { refs.current[index] = node; }}
            className={active === index ? "scale-step active" : "scale-step"}
            onMouseEnter={() => setActive(index)}
          >
            <div className="step-index"><span>{String(index).padStart(2, "0")}</span><i /></div>
            <div>
              <span className="step-stage">{item.stage}</span>
              <h3>{item.name}</h3>
              <p>{item.proof}</p>
              <div className="step-spec"><strong>{item.compute}</strong><span>{item.solar} solar</span></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
