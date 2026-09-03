"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Database, Gauge, Satellite, ScanSearch } from "lucide-react";
import { calculateDownlinkScenario, formatDataVolume } from "@/public/model/inference-evidence.mjs";
import styles from "@/app/demo/demo.module.css";

type Workload = {
  id: string;
  shortLabel: string;
  name: string;
  signal: string;
  decision: string;
  customerQuestion: string;
  evidenceStatus: "PENDING_MEASUREMENT";
  candidateOnly: boolean;
};

type ScenarioInput = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  evidenceStatus: "USER_INPUT";
};

type MeasurementField = {
  id: string;
  label: string;
  unit: string;
  value: null;
  evidenceStatus: "PENDING_MEASUREMENT";
};

export type EvidenceLabProps = {
  workloads: Workload[];
  scenarioInputs: ScenarioInput[];
  measurementFields: MeasurementField[];
};

export function EvidenceLab({ workloads, scenarioInputs, measurementFields }: EvidenceLabProps) {
  const [activeId, setActiveId] = useState(workloads[0]?.id ?? "");
  const [inputs, setInputs] = useState(scenarioInputs);
  const active = workloads.find(({ id }) => id === activeId) ?? workloads[0];

  const outcome = useMemo(() => {
    try {
      return { result: calculateDownlinkScenario(inputs), error: null };
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : "Invalid scenario" };
    }
  }, [inputs]);

  const updateInput = (id: string, rawValue: string) => {
    const value = rawValue.trim() === "" ? Number.NaN : Number(rawValue);
    setInputs((current) => current.map((input) => input.id === id ? { ...input, value } : input));
  };

  return (
    <div className={styles.labShell}>
      <div className={styles.workloadRail}>
        <p className={styles.railLabel}>CANDIDATE WORKLOAD</p>
        <div className={styles.tabs} role="group" aria-label="Candidate workload selector">
          {workloads.map((workload, index) => (
            <button
              key={workload.id}
              type="button"
              aria-pressed={activeId === workload.id}
              className={activeId === workload.id ? styles.activeTab : undefined}
              onClick={() => setActiveId(workload.id)}
            >
              <span>0{index + 1}</span>{workload.shortLabel}
            </button>
          ))}
        </div>
        {active && (
          <article
            className={styles.workloadCard}
          >
            <div className={styles.statusLine}><span /> {active.evidenceStatus}</div>
            <h3>{active.name}</h3>
            <dl>
              <div><dt>LIVE SIGNAL</dt><dd>{active.signal}</dd></div>
              <div><dt>DECISION</dt><dd>{active.decision}</dd></div>
              <div><dt>CUSTOMER QUESTION</dt><dd>{active.customerQuestion}</dd></div>
            </dl>
            <p className={styles.candidateNote}><AlertTriangle size={15} /> Candidate only. No flight workload has been selected.</p>
          </article>
        )}
      </div>

      <div className={styles.scenarioPanel}>
        <div className={styles.scenarioHead}>
          <div><span>EDITABLE / LOCAL</span><h3>Data-volume scenario</h3></div>
          <Database aria-hidden="true" />
        </div>
        <div className={styles.inputGrid}>
          {inputs.map((input) => (
            <label key={input.id}>
              <span>{input.label}</span>
              <div>
                <input
                  type="number"
                  value={Number.isFinite(input.value) ? input.value : ""}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  onChange={(event) => updateInput(input.id, event.target.value)}
                  aria-describedby={`${input.id}-meta`}
                />
                <strong>{input.unit}</strong>
              </div>
              <small id={`${input.id}-meta`}>{input.evidenceStatus} / range {input.min}-{input.max}</small>
            </label>
          ))}
        </div>

        {outcome.error ? (
          <div className={styles.scenarioError} role="alert"><AlertTriangle /> <div><strong>Scenario rejected</strong><span>{outcome.error}</span></div></div>
        ) : outcome.result ? (
          <div className={styles.resultFlow} aria-label="Calculated data-volume scenario">
            <div><Satellite aria-hidden="true" /><span>Raw collection</span><strong>{formatDataVolume(outcome.result.rawVolumeMb)}</strong></div>
            <ArrowRight aria-hidden="true" className={styles.flowArrow} />
            <div><ScanSearch aria-hidden="true" /><span>Priority result</span><strong>{formatDataVolume(outcome.result.resultVolumeMb)}</strong></div>
            <ArrowRight aria-hidden="true" className={styles.flowArrow} />
            <div><Gauge aria-hidden="true" /><span>Scenario ratio</span><strong>{outcome.result.scenarioReductionRatio.toFixed(1)}x</strong></div>
            <p><span /> {outcome.result.evidenceStatus} / {outcome.result.calculationKind.replaceAll("_", " ")}</p>
          </div>
        ) : null}

        <div className={styles.pendingGrid} aria-label="Fields requiring measurement">
          {measurementFields.map((field) => (
            <div key={field.id}>
              <span>{field.label}</span>
              <strong>Not measured</strong>
              <small>{field.unit} / {field.evidenceStatus}</small>
            </div>
          ))}
        </div>
        <p className={styles.scenarioDisclaimer}>
          The displayed volume ratio follows only from your inputs. It is not a measured downlink reduction,
          operational promise, link budget, or proxy for model quality.
        </p>
      </div>
    </div>
  );
}
