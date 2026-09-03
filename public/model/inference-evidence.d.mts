export type ScenarioInputRecord = {
  id: string;
  unit: string;
  evidenceStatus: "USER_INPUT";
  value: number;
};

export type ScenarioResult = {
  rawVolumeMb: number;
  prioritySceneCount: number;
  resultVolumeMb: number;
  avoidedVolumeMb: number;
  scenarioReductionRatio: number;
  unit: "MB/window";
  evidenceStatus: "PENDING_MEASUREMENT";
  calculationKind: "DETERMINISTIC_SCENARIO";
  disclaimer: string;
};

export function calculateDownlinkScenario(inputRecords: ScenarioInputRecord[]): ScenarioResult;
export function formatDataVolume(megabytes: number): string;
