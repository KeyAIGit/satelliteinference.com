"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BatteryCharging, Box, Maximize2, Sun, ThermometerSun } from "lucide-react";

type ViewKey = "deployed" | "stowed" | "deployment";

const views: Record<ViewKey, { label: string; image: string; alt: string; note: string }> = {
  deployed: {
    label: "Deployed",
    image: "./assets/cad/flight-demonstrator-deployed.png",
    alt: "Notional Flight Demonstrator in its deployed solar-array configuration",
    note: "Operational concept view. Array geometry communicates area and packaging intent, not a released mechanism.",
  },
  stowed: {
    label: "Stowed",
    image: "./assets/cad/flight-demonstrator-stowed.png",
    alt: "Notional Flight Demonstrator in its stowed launch configuration",
    note: "Packaging screen against a 2.8 x 2.8 x 3.2 m working envelope. Launch interface remains supplier TBD.",
  },
  deployment: {
    label: "Deployment",
    image: "./assets/cad/flight-demonstrator-deployment.png",
    alt: "Notional sequence showing the Flight Demonstrator solar-array deployment states",
    note: "Kinematic communication sequence only. Hinges, latches, drives, clearances and modal response are not yet selected.",
  },
};

const metricCards = [
  { icon: Sun, label: "Installed BOL target", value: "10.0 kW", status: "WORKING ASSUMPTION" },
  { icon: Sun, label: "Required BOL screen", value: "4.12 kW", status: "CALCULATED" },
  { icon: Maximize2, label: "Active-PV equivalent", value: "33.333 m²", status: "CALCULATED" },
  { icon: BatteryCharging, label: "Battery planning", value: "4-8 kWh", status: "WORKING ASSUMPTION" },
  { icon: ThermometerSun, label: "Radiator effective-area screen", value: "4.57 m²", status: "CALCULATED" },
];

export function FlightNodeConcept() {
  const [view, setView] = useState<ViewKey>("deployed");
  const activeView = views[view];

  return (
    <div className="flight-concept-shell">
      <div className="flight-concept-visual">
        <div className="concept-toolbar">
          <div><span>CONCEPT CAD / REV B</span><strong>NOT FOR MANUFACTURING</strong></div>
          <div className="concept-tabs" aria-label="Select concept view">
            {(Object.keys(views) as ViewKey[]).map((key) => (
              <button
                type="button"
                className={view === key ? "active" : ""}
                aria-pressed={view === key}
                onClick={() => setView(key)}
                key={key}
              >
                {views[key].label}
              </button>
            ))}
          </div>
        </div>
        <figure className="concept-image-frame">
          <Image
            src={activeView.image}
            alt={activeView.alt}
            fill
            sizes="(max-width: 860px) 100vw, 65vw"
            className="concept-image"
            priority={false}
          />
          <figcaption><span>ACTIVE VIEW / {activeView.label.toUpperCase()}</span>{activeView.note}</figcaption>
        </figure>
      </div>

      <aside className="flight-concept-data" aria-label="Flight Demonstrator working baseline">
        <div className="concept-data-title">
          <span>MISSION 1 / OWNED FREE-FLYER</span>
          <h3>Flight Demonstrator</h3>
          <p>First owned spacecraft targeting 1 kW continuous compute in a 550 km reference LEO.</p>
        </div>
        <div className="concept-metrics">
          {metricCards.map(({ icon: Icon, label, value, status }) => (
            <div key={label}>
              <Icon aria-hidden="true" />
              <span><small>{label}</small><strong>{value}</strong><em>{status}</em></span>
            </div>
          ))}
        </div>
        <div className="concept-envelope">
          <Box aria-hidden="true" />
          <div>
            <span>LAUNCH ENVELOPE SCREEN</span>
            <strong>2.8 x 2.8 x 3.2 m</strong>
            <p>Notional geometry. Interface, loads and compatibility are TBD by launch and spacecraft suppliers.</p>
          </div>
        </div>
        <p className="concept-clarifier">
          The <strong>10 kW</strong> installed BOL target is intentionally above the <strong>4.12 kW</strong> required-power screen.
          The <strong>33.333 m²</strong> value is active-PV equivalent area, not gross array planform.
          Rev B analytical battery base: <strong>3.70 kWh</strong>; planning range: <strong>4-8 kWh</strong>.
          Radiator: <strong>4.57 m² idealized effective area</strong> at a 0.97 heat-load factor,
          <strong> 4.71 m²</strong> at full electrical load, and <strong>6.0 m² notional gross planform</strong>.
        </p>
        <a className="concept-ga-link" href="./assets/cad/flight-demonstrator-general-arrangement.png">
          Open dimensioned general arrangement <ArrowUpRight aria-hidden="true" />
        </a>
      </aside>
    </div>
  );
}
