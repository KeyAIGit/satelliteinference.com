import Image from "next/image";
import {
  ArrowUpRight,
  BatteryCharging,
  Box,
  Cpu,
  Maximize2,
  Sun,
  ThermometerSun,
} from "lucide-react";

const metricCards = [
  { icon: Cpu, label: "Payload electrical input", value: "10 kW", status: "PROGRAM TARGET" },
  { icon: Sun, label: "BOL solar, nominal", value: "~34 kW", status: "CALCULATED" },
  { icon: Maximize2, label: "Gross solar planform, nominal", value: "~140 m²", status: "CALCULATED" },
  { icon: BatteryCharging, label: "Eclipse battery, nominal", value: "~28 kWh", status: "CALCULATED" },
  { icon: ThermometerSun, label: "Equivalent radiator, nominal", value: "~37 m²", status: "CALCULATED" },
];

export function FlightNodeConcept() {
  return (
    <div className="flight-concept-shell flight-concept-rev-c">
      <div className="flight-concept-visual">
        <div className="concept-toolbar">
          <div><span>CONCEPT RENDER / REV C</span><strong>NOT FLIGHT CAD</strong></div>
          <span className="concept-orbit-tag">500-600 KM LEO</span>
        </div>
        <figure className="concept-image-frame concept-image-frame-rev-c">
          <Image
            src="/assets/concepts/orbital-node-10kw-concept-v01.png"
            alt="Notional 10 kilowatt orbital compute node with large deployed solar wings and radiator panels above Earth"
            fill
            sizes="(max-width: 860px) 100vw, 65vw"
            className="concept-image"
            priority={false}
          />
          <figcaption>
            <span>NOTIONAL CONFIGURATION</span>
            The image communicates functional scale and subsystem separation. Structure, mechanisms, interfaces and final geometry remain open trades.
          </figcaption>
        </figure>
      </div>

      <aside className="flight-concept-data" aria-label="10 kilowatt orbital node working baseline">
        <div className="concept-data-title">
          <span>FIRST ORBITAL SYSTEM / OWNED NODE</span>
          <h3>10 kW Orbital Node</h3>
          <p>Continuous payload electrical input in a 500-600 km LEO baseline, with a 12-15 kW total-load range and 13.5 kW nominal screen.</p>
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
            <span>PUBLIC PLANNING ENVELOPE</span>
            <strong>3-7 t / 25-40 m span</strong>
            <p>30-38 kW BOL solar, 125-156 m² gross solar planform, 25-32 kWh battery and 35-60 m² physical radiator planning range.</p>
          </div>
        </div>
        <p className="concept-clarifier">
          <strong>10 kW</strong> is the target continuous electrical input available to the compute payload, not GPU nameplate power and not delivered customer FLOPS.
          The model calculates approximately <strong>34 kW</strong> required BOL solar at the <strong>13.5 kW</strong> nominal total spacecraft-load screen.
          Every range is pre-SRR and must be replaced by supplier data, coupled analysis and test evidence.
        </p>
        <a className="concept-ga-link" href="/data/model-assumptions.json">
          Open the Rev C assumptions <ArrowUpRight aria-hidden="true" />
        </a>
      </aside>
    </div>
  );
}
