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
  return `${Math.round(altitudeKm).toLocaleString("en-US")} km`;
}

export function OrbitalExplorer() {
  const [altitudeKm, setAltitudeKm] = useState(550);
  const metrics = useMemo(() => calculateOrbit(altitudeKm), [altitudeKm]);
  const isLeoPreset = Math.abs(altitudeKm - 550) < 1;
  const isGeoPreset = Math.abs(altitudeKm - MAX_ALTITUDE_KM) < 2;
  const isBaselineOrbit = altitudeKm >= 500 && altitudeKm <= 600;
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
            <span>ALTITUDE COMPARISON / DISTANCES TO SCALE</span>
            <strong>{regime} / {formatAltitude(altitudeKm)}</strong>
          </div>
          <div className="orbit-presets" aria-label="Orbit presets">
            <button type="button" aria-pressed={isLeoPreset} className={isLeoPreset ? "active" : ""} onClick={() => setAltitudeKm(550)}>550 KM / BASELINE MIDPOINT</button>
            <button type="button" aria-pressed={isGeoPreset} className={isGeoPreset ? "active" : ""} onClick={() => setAltitudeKm(MAX_ALTITUDE_KM)}>GEO / COMPARE</button>
          </div>
        </div>

        <div className="altitude-slider-wrap">
          <label htmlFor="altitude-slider"><span>200 km</span><strong>Compare altitude</strong><span>35,786 km</span></label>
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
            <text x="35" y="44" className="svg-kicker">DISTANCE TO SCALE FROM EARTH&apos;S CENTER</text>
            <text x="35" y="69" className="svg-title">{regime} / {formatAltitude(altitudeKm)}</text>
            <text x="35" y="91" className="svg-subtitle">ANIMATION: 1 ORBIT / {ANIMATION_SECONDS} S, {Math.round(metrics.timeCompression).toLocaleString("en-US")}x REAL TIME</text>
          </svg>
          <figcaption>
            <span className="live-dot" /> Earth and orbit distances use the same linear scale. Only 500-600 km low Earth orbit (LEO) is the program baseline; every other altitude is comparison-only.
          </figcaption>
        </figure>
      </div>

      <aside className="orbit-readout-panel" aria-live="polite">
        <div className="orbit-readout-title">
          <span>{isBaselineOrbit ? "PROGRAM BASELINE" : "COMPARISON ONLY"} / CALCULATED</span>
          <h3>{isBaselineOrbit ? "500-600 km low Earth orbit" : `${regime} altitude comparison`}</h3>
          <p>{isBaselineOrbit ? "Baseline band for the first 10 kW orbital node." : "This selected altitude is not a proposed mission orbit or program baseline."}</p>
        </div>
        <div className="metric-stack">
          <div className="metric-row"><Clock3 aria-hidden="true" /><span><small>Time for one orbit</small><strong>{formatPeriod(metrics.periodMinutes)}</strong></span></div>
          <div className="metric-row"><Radio aria-hidden="true" /><span><small>Vacuum one-way, ground directly below</small><strong>{formatLatency(metrics.oneWayMs)}</strong></span></div>
          <div className="metric-row"><Gauge aria-hidden="true" /><span><small>Vacuum round trip, ground directly below</small><strong>{formatLatency(metrics.responseFloorMs)}</strong></span></div>
          <div className="metric-row"><Sun aria-hidden="true" /><span><small>Maximum shadow, Sun in orbit plane</small><strong>{metrics.eclipseMinutes.toFixed(2)} min</strong></span></div>
          <div className="metric-row"><BatteryCharging aria-hidden="true" /><span><small>Time in sunlight, Sun in orbit plane</small><strong>{metrics.sunlitPercent.toFixed(1)}%</strong></span></div>
        </div>
        <div className="orbit-interpretation">
          <strong>Vacuum signal-time comparison</strong>
          <p>The values isolate travel through space. They do not predict end-to-end service, workload fitness, or a preferred orbit; those also depend on radios, routing, queues, computing, thermal design, operations, and model quality.</p>
        </div>
      </aside>

      <p className="model-footnote">
        Comparison calculations assume a circular two-body orbit, WGS-84 equatorial Earth radius, the Sun in the orbit plane (beta angle 0), a simple cylindrical shadow, and a ground point directly below the spacecraft. Round-trip time excludes atmosphere, routing, protocols, queues, and compute. Geostationary eclipses are seasonal.
      </p>
      <details className="model-method">
        <summary>Open equations, assumptions, comparison status, and sources</summary>
        <div className="model-method-grid">
          <div><span>TIME FOR ONE ORBIT / CALCULATED</span><strong>T = 2pi sqrt(r³ / μ)</strong><p>Two-body circular-orbit comparison from disclosed constants.</p></div>
          <div><span>SIGNAL TRAVEL TIME / CALCULATED</span><strong>t = ρ / c</strong><p>Vacuum space-leg delay only. It is not application response time.</p></div>
          <div><span>MAXIMUM SHADOW / CALCULATED</span><strong>te = T asin(RE / r) / pi</strong><p>Simple shadow estimate with the Sun in the orbit plane.</p></div>
        </div>
        <div className="model-sources">
          <span>EXTERNAL REFERENCES</span>
          <a href="https://gwg.nga.mil/gwg/focus-groups/World_Geodetic_System_%26_Geomatics_%28WGSG%29_Focus_Gro.html">NGA WGS-84</a>
          <a href="https://ssd.jpl.nasa.gov/astro_par.html">NASA JPL parameters</a>
          <a href="https://www.nist.gov/pml/owm/si-units-length">NIST speed of light</a>
          <a href="https://www.ospo.noaa.gov/operations/goes/eclipse.html">NOAA GEO eclipse</a>
          <a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/public/data/model-assumptions.json">Rev C assumptions</a>
          <a href="https://github.com/KeyAIGit/satelliteinference.com/blob/main/public/model/engineering-screen.mjs">Rev C equations</a>
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
  "ground-engineering-tile": "One reusable 1 kW unit is intended to test compute, power, cooling, runtime recovery and telemetry on the ground.",
  "orbital-node-10kw": "The first owned flight system will be required to demonstrate continuous 10 kW payload operation, deployables, eclipse continuity and customer data flow.",
  "industrial-orbital-module": "100 kW scale is considered only after measured performance, demand and launch architecture are validated.",
  "megawatt-orbital-network": "The 1 MW reference is a future ten-module architecture, conditional on validating each 100 kW module; it is not a claim for one monolithic spacecraft.",
};

function metricValue(metric: Metric | undefined, fallback = "TBD") {
  if (!metric) return fallback;
  if (metric.display?.value !== undefined) return `${metric.display.value.toFixed(metric.display.precision)} ${metric.display.unit}`;
  if (metric.value !== undefined) return `${metric.value.toLocaleString("en-US", { maximumFractionDigits: 3 })} ${metric.unit}`;
  if (metric.min !== undefined && metric.max !== undefined) return `${metric.min}-${metric.max} ${metric.unit}`;
  return fallback;
}

function MissionGraphic({ mission }: { mission: PublicMission }) {
  if (mission.id === "ground-engineering-tile") {
    return (
      <div className="ground-tile-graphic" aria-label="Ground engineering tile architecture">
        <div><span>GROUND COMPUTE LOAD</span><strong>1 kW tile</strong></div>
        <i aria-hidden="true" />
        <div><span>FACILITY SUPPORT</span><strong>power + cooling</strong></div>
        <p>GROUND ONLY / REUSABLE ENGINEERING BUILDING BLOCK</p>
      </div>
    );
  }

  if (mission.id === "orbital-node-10kw") {
    return (
      <div className="cad-mission-graphic">
        <Image src="/assets/concepts/orbital-node-10kw-concept-v01.png" alt="10 kW Orbital Node notional deployed concept" fill sizes="(max-width: 860px) 100vw, 45vw" />
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
      <div><span>COMPUTE-POWER ENVELOPE</span><strong>{metricValue(mission.metrics.continuousCompute)}</strong></div>
      <div><span>ACTIVE SOLAR-CELL AREA</span><strong>{metricValue(mission.metrics.activePvEquivalentArea)}</strong></div>
      <p>PHYSICAL GEOMETRY / SUPPLIER DATA NEEDED</p>
    </div>
  );
}

function missionMetrics(mission: PublicMission) {
  if (mission.id === "ground-engineering-tile") {
    return {
      compute: metricValue(mission.metrics.continuousCompute),
      computeLabel: "ground compute-load target",
      power: "External facility supply",
      powerLabel: "Facility power",
      continuity: "Simulated eclipse",
      continuityLabel: "Power interruption test",
      thermal: "Facility cooling loop",
      thermalLabel: "Heat removal",
      architectureLabel: "Ground test setup",
      statusNote: "STAGE STATUS / Ground-validation assumptions only. No solar array, flight battery, or flight radiator is claimed for this tile; it uses facility power and cooling.",
    };
  }
  if (mission.id === "orbital-node-10kw") {
    return {
      compute: metricValue(mission.metrics.continuousCompute),
      computeLabel: "flight compute-payload electrical input",
      power: `${metricValue(mission.metrics.solarBolPlanningRange)} planning`,
      powerLabel: "Solar power when new",
      continuity: `${metricValue(mission.metrics.batteryPlanningRange)} planning`,
      continuityLabel: "Flight battery energy",
      thermal: `${metricValue(mission.metrics.radiatorPlanningRange)} planning`,
      thermalLabel: "Flight radiator area",
      architectureLabel: "Flight architecture",
      statusNote: "STAGE STATUS / First-flight planning ranges. Solar power means output when new; battery and radiator values remain preliminary, and the visual is not flight CAD.",
    };
  }
  return {
    compute: metricValue(mission.metrics.continuousCompute),
    computeLabel: "future compute-payload electrical input",
    power: metricValue(mission.metrics.solarBolPower),
    powerLabel: "Modeled solar power when new",
    continuity: metricValue(mission.metrics.batteryEnergyScreen),
    continuityLabel: "Modeled battery energy",
    thermal: `${metricValue(mission.metrics.radiatorEffectiveAreaScreen)} effective`,
    thermalLabel: "Modeled effective radiator area",
    architectureLabel: "Future architecture",
    statusNote: "STAGE STATUS / Future-scale calculation only, conditional on validated flight evidence. Solar area means active solar-cell equivalent and radiator area is idealized; visuals are not to a shared physical scale.",
  };
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
          <span>{metrics.compute}<small>{metrics.computeLabel}</small></span>
        </div>
        <div className="scale-metrics">
          <span><Sun aria-hidden="true" /><small>{metrics.powerLabel}</small><strong>{metrics.power}</strong></span>
          <span><BatteryCharging aria-hidden="true" /><small>{metrics.continuityLabel}</small><strong>{metrics.continuity}</strong></span>
          <span><ThermometerSun aria-hidden="true" /><small>{metrics.thermalLabel}</small><strong>{metrics.thermal}</strong></span>
          <span><Gauge aria-hidden="true" /><small>{metrics.architectureLabel}</small><strong>{mission.architecture}</strong></span>
        </div>
        <p className="scale-status-note">{metrics.statusNote}</p>
      </div>
    </div>
  );
}
