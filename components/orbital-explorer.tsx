"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  BatteryCharging,
  Clock3,
  Gauge,
  Radio,
  Sun,
  ThermometerSun,
} from "lucide-react";
import siteModel from "@/public/data/site-model.json";
import { PHYSICS, geoAltitudeKm, latencyMetrics, orbitMetrics } from "@/lib/orbital-physics";

const MIN_ALTITUDE_KM = 200;
const MAX_ALTITUDE_KM = geoAltitudeKm();
const ANIMATION_SECONDS = 16;

function sliderToAltitude(value: number) {
  const ratio = value / 1000;
  return MIN_ALTITUDE_KM * Math.pow(MAX_ALTITUDE_KM / MIN_ALTITUDE_KM, ratio);
}

function altitudeToSlider(altitudeKm: number) {
  return 1000 * Math.log(altitudeKm / MIN_ALTITUDE_KM) / Math.log(MAX_ALTITUDE_KM / MIN_ALTITUDE_KM);
}

function calculateOrbit(altitudeKm: number) {
  const orbit = orbitMetrics(altitudeKm);
  const latency = latencyMetrics(altitudeKm);
  return {
    ...orbit,
    oneWayMs: latency.oneWayMs,
    responseFloorMs: latency.requestResultMs,
    periodMinutes: orbit.periodS / 60,
    eclipseMinutes: orbit.eclipseS / 60,
    sunlitPercent: orbit.sunlitFraction * 100,
    earthRadii: orbit.orbitRadiusKm / PHYSICS.earthRadiusKm,
    timeCompression: orbit.periodS / ANIMATION_SECONDS,
  };
}

function formatPeriod(minutes: number) {
  return minutes < 180 ? `${minutes.toFixed(2)} min` : `${(minutes / 60).toFixed(2)} h`;
}

function formatLatency(milliseconds: number) {
  return milliseconds < 10 ? `${milliseconds.toFixed(2)} ms` : `${milliseconds.toFixed(0)} ms`;
}

function formatAltitude(altitudeKm: number) {
  return `${Math.round(altitudeKm).toLocaleString()} km`;
}

export function OrbitalExplorer() {
  const [altitudeKm, setAltitudeKm] = useState(550);
  const metrics = useMemo(() => calculateOrbit(altitudeKm), [altitudeKm]);
  const isLeoPreset = Math.abs(altitudeKm - 550) < 1;
  const isGeoPreset = Math.abs(altitudeKm - MAX_ALTITUDE_KM) < 2;
  const regime = altitudeKm < 2000 ? "LEO" : isGeoPreset ? "GEO" : "MEO";
  const earthRadiusPx = 38;
  const orbitRadiusPx = earthRadiusPx * metrics.earthRadii;
  const centerX = 360;
  const centerY = 280;
  const animationStyle = { "--orbit-seconds": `${ANIMATION_SECONDS}s` } as CSSProperties;

  return (
    <div className="orbit-lab orbit-lab-v2">
      <div className="orbit-control-panel">
        <div className="orbit-control-head orbit-control-head-v2">
          <div>
            <span>LOG ALTITUDE CONTROL / PHYSICAL RADIAL VIEW</span>
            <strong>{regime} / {formatAltitude(altitudeKm)}</strong>
          </div>
          <div className="orbit-presets" aria-label="Orbit presets">
            <button type="button" aria-pressed={isLeoPreset} className={isLeoPreset ? "active" : ""} onClick={() => setAltitudeKm(550)}>550 KM LEO</button>
            <button type="button" aria-pressed={isGeoPreset} className={isGeoPreset ? "active" : ""} onClick={() => setAltitudeKm(MAX_ALTITUDE_KM)}>GEO</button>
          </div>
        </div>

        <div className="altitude-slider-wrap">
          <label htmlFor="altitude-slider"><span>200 km</span><strong>Drag altitude</strong><span>35,786 km</span></label>
          <input
            id="altitude-slider"
            type="range"
            min="0"
            max="1000"
            step="1"
            value={Math.round(altitudeToSlider(altitudeKm))}
            onChange={(event) => setAltitudeKm(sliderToAltitude(Number(event.target.value)))}
            aria-valuetext={`${formatAltitude(altitudeKm)} altitude`}
          />
        </div>

        <figure className="orbit-canvas-wrap">
          <svg
            className="orbit-canvas"
            viewBox="0 0 720 560"
            role="img"
            aria-labelledby="orbit-title orbit-description"
          >
            <title id="orbit-title">Physical radial scale from Earth to the selected circular orbit</title>
            <desc id="orbit-description">Earth radius and orbital radius share one linear scale. At low Earth orbit, the orbital ring sits close to Earth. At geostationary altitude, it expands to 6.61 Earth radii.</desc>
            <defs>
              <radialGradient id="earthFillV2" cx="32%" cy="28%">
                <stop offset="0%" stopColor="#73d9ee" />
                <stop offset="38%" stopColor="#187db3" />
                <stop offset="100%" stopColor="#061c38" />
              </radialGradient>
              <filter id="nodeGlowV2" x="-250%" y="-250%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <g className="orbit-stars" aria-hidden="true">
              {Array.from({ length: 42 }, (_, index) => (
                <circle key={index} cx={(index * 137) % 700 + 10} cy={(index * 83) % 530 + 12} r={index % 6 === 0 ? 1.35 : 0.7} />
              ))}
            </g>
            <line x1="54" y1={centerY} x2="666" y2={centerY} className="orbit-axis" />
            {[2, 4, 6].map((ratio) => (
              <circle key={ratio} cx={centerX} cy={centerY} r={earthRadiusPx * ratio} className="earth-radii-guide" />
            ))}
            <circle cx={centerX} cy={centerY} r={orbitRadiusPx} className="selected-orbit" />
            <circle cx={centerX} cy={centerY} r={earthRadiusPx} fill="url(#earthFillV2)" className="earth-disc" />
            <path d="M334 273 C345 263 354 277 366 267 C375 258 387 270 392 278" className="earth-land" />

            <g className="orbiting-node" style={animationStyle}>
              <g transform={`translate(${centerX + orbitRadiusPx} ${centerY})`}>
                <circle r="11" className="node-halo" filter="url(#nodeGlowV2)" />
                <circle r="4.5" className="node-point" />
              </g>
            </g>

            <line x1={centerX} y1={centerY + 18} x2={centerX + orbitRadiusPx} y2={centerY + 18} className="radius-measure" />
            <text x={centerX + orbitRadiusPx / 2} y={centerY + 34} textAnchor="middle" className="svg-measure-label">
              {metrics.earthRadii.toFixed(3)} EARTH RADII
            </text>

            <g className="scale-key" transform="translate(35 494)">
              <line x1="0" y1="0" x2={earthRadiusPx} y2="0" />
              <line x1="0" y1="-5" x2="0" y2="5" />
              <line x1={earthRadiusPx} y1="-5" x2={earthRadiusPx} y2="5" />
              <text x="0" y="20">1 EARTH RADIUS = 6,378 KM</text>
            </g>
            <text x="35" y="44" className="svg-kicker">LINEAR PHYSICAL RADIAL SCALE</text>
            <text x="35" y="69" className="svg-title">{regime} / {formatAltitude(altitudeKm)}</text>
            <text x="35" y="91" className="svg-subtitle">ANIMATION: 1 ORBIT / {ANIMATION_SECONDS} S, {Math.round(metrics.timeCompression).toLocaleString()}x REAL TIME</text>
          </svg>
          <figcaption>
            <span className="live-dot" /> Geometry is linear, not illustrative. The altitude control is logarithmic so LEO and GEO remain selectable.
          </figcaption>
        </figure>
      </div>

      <aside className="orbit-readout-panel" aria-live="polite">
        <div className="orbit-readout-title">
          <span>{regime} / CALCULATED</span>
          <h3>{isLeoPreset ? "Reference LEO" : isGeoPreset ? "Geostationary orbit" : "Circular orbit screen"}</h3>
          <p>{isLeoPreset ? "Program baseline for the first 10 kW orbital node." : isGeoPreset ? "Comparison case only, not the baseline mission." : "Explore geometry between the first LEO mission and GEO."}</p>
        </div>
        <div className="metric-stack">
          <div className="metric-row"><Clock3 aria-hidden="true" /><span><small>Orbital period</small><strong>{formatPeriod(metrics.periodMinutes)}</strong></span></div>
          <div className="metric-row"><Radio aria-hidden="true" /><span><small>Zenith vacuum one-way</small><strong>{formatLatency(metrics.oneWayMs)}</strong></span></div>
          <div className="metric-row"><Gauge aria-hidden="true" /><span><small>Zenith vacuum RTT</small><strong>{formatLatency(metrics.responseFloorMs)}</strong></span></div>
          <div className="metric-row"><Sun aria-hidden="true" /><span><small>Worst-case shadow, beta 0</small><strong>{metrics.eclipseMinutes.toFixed(2)} min</strong></span></div>
          <div className="metric-row"><BatteryCharging aria-hidden="true" /><span><small>Sunlit fraction, beta 0</small><strong>{metrics.sunlitPercent.toFixed(1)}%</strong></span></div>
        </div>
        <div className="orbit-interpretation">
          <strong>{altitudeKm < 2000 ? "Propagation screen: favorable" : "Propagation screen: workload-dependent"}</strong>
          <p>
            {altitudeKm < 2000
              ? "Vacuum propagation is small versus many network and processing delays. Workload fitness still depends on the radio, compute, thermal, operations and model-quality evidence."
              : "The number shown is propagation through vacuum only. End-to-end inference also includes radio, routing, queue and compute time."}
          </p>
        </div>
      </aside>

      <p className="model-footnote">
        Circular two-body screen, WGS-84 equatorial radius, beta angle 0, cylindrical shadow and zenith ground geometry. RTT excludes atmosphere, routing, protocol, queues and compute. GEO eclipse is seasonal.
      </p>
      <details className="model-method">
        <summary>Open equations, constants, status and sources</summary>
        <div className="model-method-grid">
          <div><span>ORBITAL PERIOD / CALCULATED</span><strong>T = 2pi sqrt(r³ / μ)</strong><p>Two-body circular-orbit screen from disclosed constants.</p></div>
          <div><span>PROPAGATION / CALCULATED</span><strong>t = ρ / c</strong><p>Vacuum space-leg delay only. It is not application response time.</p></div>
          <div><span>MAX SHADOW / CALCULATED</span><strong>te = T asin(RE / r) / pi</strong><p>Worst-case beta 0 cylindrical-shadow estimate.</p></div>
        </div>
        <div className="model-sources">
          <span>EXTERNAL REFERENCES</span>
          <a href="https://gwg.nga.mil/gwg/focus-groups/World_Geodetic_System_%26_Geomatics_%28WGSG%29_Focus_Gro.html">NGA WGS-84</a>
          <a href="https://ssd.jpl.nasa.gov/astro_par.html">NASA JPL parameters</a>
          <a href="https://www.nist.gov/pml/owm/si-units-length">NIST speed of light</a>
          <a href="https://www.ospo.noaa.gov/operations/goes/eclipse.html">NOAA GEO eclipse</a>
          <a href="./data/model-assumptions.json">Rev C assumptions</a>
          <a href="./model/engineering-screen.mjs">Rev C equations</a>
        </div>
      </details>
    </div>
  );
}

type Metric = {
  value?: number;
  min?: number;
  max?: number;
  nominal?: number;
  unit: string;
  display?: { value?: number; min?: number; max?: number; unit: string; precision: number };
};

type PublicMission = {
  id: string;
  publicName: string;
  legacyCode: string;
  stage: string;
  architecture: string;
  description: string;
  metrics: Record<string, Metric>;
  moduleArchitecture?: { moduleCount: number; modulePublicName: string };
};

const missions = siteModel.missions as unknown as PublicMission[];

const missionProof: Record<string, string> = {
  "ground-engineering-tile": "One reusable 1 kW unit proves compute, power, cooling, runtime recovery and telemetry on the ground.",
  "orbital-node-10kw": "First owned flight system proves continuous 10 kW payload operation, deployables, eclipse continuity and customer data flow.",
  "industrial-orbital-module": "100 kW scale follows only after measured performance, demand and launch architecture are validated.",
  "megawatt-orbital-network": "Ten measured 100 kW modules create a 1 MW network without claiming one monolithic spacecraft.",
};

function metricValue(metric: Metric | undefined, fallback = "TBD") {
  if (!metric) return fallback;
  if (metric.display?.value !== undefined) return `${metric.display.value.toFixed(metric.display.precision)} ${metric.display.unit}`;
  if (metric.value !== undefined) return `${metric.value.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${metric.unit}`;
  if (metric.min !== undefined && metric.max !== undefined) return `${metric.min}-${metric.max} ${metric.unit}`;
  return fallback;
}

function MissionGraphic({ mission }: { mission: PublicMission }) {
  if (mission.id === "ground-engineering-tile") {
    return (
      <div className="ground-tile-graphic" aria-label="Ground engineering tile architecture">
        <div><span>COMPUTE</span><strong>1 kW tile</strong></div>
        <i aria-hidden="true" />
        <div><span>FACILITY LOOP</span><strong>power + cooling</strong></div>
        <p>GROUND ONLY / REUSABLE ENGINEERING BUILDING BLOCK</p>
      </div>
    );
  }

  if (mission.id === "orbital-node-10kw") {
    return (
      <div className="cad-mission-graphic">
        <Image src="./assets/concepts/orbital-node-10kw-concept-v01.png" alt="10 kW Orbital Node notional deployed concept" fill sizes="(max-width: 860px) 100vw, 45vw" />
        <span>REV C / NOTIONAL CONFIGURATION</span>
      </div>
    );
  }

  if (mission.id === "megawatt-orbital-network") {
    return (
      <div className="network-graphic" aria-label="Ten modules of 100 kilowatts equal one megawatt aggregate">
        {Array.from({ length: 10 }, (_, index) => <span key={index}><i>{String(index + 1).padStart(2, "0")}</i><strong>100 kW</strong></span>)}
        <p>10 x 100 kW = 1 MW aggregate</p>
      </div>
    );
  }

  const isIndustrial = mission.id === "industrial-orbital-module";
  return (
    <div className={isIndustrial ? "capacity-graphic industrial" : "capacity-graphic"} aria-label={`${mission.publicName} capacity diagram, physical geometry not selected`}>
      <div><span>COMPUTE ENVELOPE</span><strong>{metricValue(mission.metrics.continuousCompute)}</strong></div>
      <div><span>ACTIVE-PV EQUIVALENT</span><strong>{metricValue(mission.metrics.activePvEquivalentArea)}</strong></div>
      <p>PHYSICAL GEOMETRY / TBD BY SUPPLIER</p>
    </div>
  );
}

function missionMetrics(mission: PublicMission) {
  if (mission.id === "ground-engineering-tile") {
    return {
      compute: metricValue(mission.metrics.continuousCompute),
      solar: "Facility supply",
      battery: "Eclipse emulator",
      radiator: "Facility cooling loop",
    };
  }
  if (mission.id === "orbital-node-10kw") {
    return {
      compute: metricValue(mission.metrics.continuousCompute),
      solar: `${metricValue(mission.metrics.solarBolPlanningRange)} planning`,
      battery: `${metricValue(mission.metrics.batteryPlanningRange)} planning`,
      radiator: `${metricValue(mission.metrics.radiatorPlanningRange)} planning`,
    };
  }
  return { compute: metricValue(mission.metrics.continuousCompute), solar: metricValue(mission.metrics.solarBolPower), battery: metricValue(mission.metrics.batteryEnergyScreen), radiator: `${metricValue(mission.metrics.radiatorEffectiveAreaScreen)} effective` };
}

export function ScaleJourney() {
  const [active, setActive] = useState(1);
  const mission = missions[active];
  const metrics = missionMetrics(mission);

  return (
    <div className="scale-journey scale-journey-v2">
      <div className="mission-selector" aria-label="Select a program stage">
        {missions.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={active === index ? "active" : ""}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")} / {item.stage}</span>
            <strong>{item.publicName}</strong>
            <small>{missionProof[item.id]}</small>
          </button>
        ))}
      </div>

      <div className="scale-display" aria-live="polite">
        <div className="scale-display-head"><span>{mission.stage} STAGE</span><strong>{mission.legacyCode}</strong></div>
        <div className="scale-visual scale-visual-v2"><MissionGraphic mission={mission} /></div>
        <div className="scale-title-row">
          <div><h3>{mission.publicName}</h3><p>{mission.description}</p></div>
          <span>{metrics.compute}<small>continuous compute</small></span>
        </div>
        <div className="scale-metrics">
          <span><Sun aria-hidden="true" /><small>Solar BOL</small><strong>{metrics.solar}</strong></span>
          <span><BatteryCharging aria-hidden="true" /><small>Battery</small><strong>{metrics.battery}</strong></span>
          <span><ThermometerSun aria-hidden="true" /><small>Radiator</small><strong>{metrics.radiator}</strong></span>
          <span><Gauge aria-hidden="true" /><small>Architecture</small><strong>{mission.architecture}</strong></span>
        </div>
        <p className="scale-status-note">MODEL STATUS / Working assumptions plus calculated Rev C screening values. The 1 kW tile is ground-only. Solar area is active-PV equivalent, radiator area is idealized effective area, and visuals do not share a physical scale.</p>
      </div>
    </div>
  );
}
