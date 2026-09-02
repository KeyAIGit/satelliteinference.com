import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dataPath = fileURLToPath(
  new URL("../public/data/site-model.json", import.meta.url),
);
const assumptionsPath = fileURLToPath(
  new URL("../public/data/model-assumptions.json", import.meta.url),
);
const model = JSON.parse(await readFile(dataPath, "utf8"));
const assumptions = JSON.parse(await readFile(assumptionsPath, "utf8"));
const {
  computeAtLoad,
  computeMissionEnvelope,
  computeMissionScreen,
  computeOrbitScreen,
  roundTo,
} = await import(
  new URL("../public/model/engineering-screen.mjs", import.meta.url)
);

const mission = (id) => {
  const result = model.missions.find((item) => item.id === id);
  assert.ok(result, `missing mission: ${id}`);
  return result;
};

const orbit = (id) => {
  const result = model.orbitPresets.find((item) => item.id === id);
  assert.ok(result, `missing orbit preset: ${id}`);
  return result;
};

test("publishes the Rev C preliminary model and program contract", () => {
  assert.equal(model.schemaVersion, "2.0.0");
  assert.equal(model.dataVersion, "2026-09-02.rev-c.2");
  assert.equal(model.model.revision, "Rev C");
  assert.equal(model.model.deterministic, true);
  assert.match(model.model.disclaimer, /Supplier and launch-provider validation required/);
  assert.equal(assumptions.dataVersion, model.dataVersion);
  assert.equal(assumptions.modelRevision, model.model.revision);
  assert.equal(model.program.currentFinancingTargetUsd, 7_000_000);
  assert.equal(model.program.groundTileContinuousComputeKw, 1);
  assert.equal(model.program.firstOrbitalSystemContinuousComputeKw, 10);
  assert.equal(model.program.baselineOrbitId, "leo-550");
  assert.equal(model.program.geoRole, "COMPARISON_ONLY");
  assert.equal(model.program.genericCloudStage, "LATER");
  assert.deepEqual(model.program.initialMarkets, [
    "Defense and sovereign missions",
    "Earth observation",
    "Maritime domain awareness",
    "Disaster response",
  ]);
});

test("publishes every declared internal model source", async () => {
  const internalSources = model.sources.filter(({ type }) => type === "internal");
  await Promise.all(
    internalSources.map(async ({ locator }) => {
      assert.match(locator, /^\//, `${locator} must be a site-root path`);
      const sourcePath = fileURLToPath(
        new URL(`../public${locator}`, import.meta.url),
      );
      const contents = await readFile(sourcePath, "utf8");
      assert.ok(contents.length > 0, `${locator} is empty`);
    }),
  );
});

test("publishes the four-stage ladder with a ground-only 1 kW tile", () => {
  assert.deepEqual(
    model.missions.map(({ id }) => id),
    [
      "ground-engineering-tile",
      "orbital-node-10kw",
      "industrial-orbital-module",
      "megawatt-orbital-network",
    ],
  );

  const ground = mission("ground-engineering-tile");
  assert.equal(ground.metrics.continuousCompute.value, 1);
  assert.equal(ground.orbitId, null);
  assert.match(ground.architecture, /ground/i);
  assert.ok(!assumptions.missionInputs.some(({ id }) => id === ground.id));

  const firstFlight = mission("orbital-node-10kw");
  assert.equal(firstFlight.order, 2);
  assert.equal(firstFlight.orbitId, "leo-550");
  assert.equal(firstFlight.metrics.continuousCompute.value, 10);
  assert.deepEqual(
    {
      min: firstFlight.metrics.totalSpacecraftLoad.min,
      nominal: firstFlight.metrics.totalSpacecraftLoad.nominal,
      max: firstFlight.metrics.totalSpacecraftLoad.max,
    },
    { min: 12, nominal: 13.5, max: 15 },
  );
  assert.equal(firstFlight.metrics.totalSpacecraftLoad.status, "WORKING_ASSUMPTION");
  assert.deepEqual(
    [firstFlight.metrics.solarBolPlanningRange.min, firstFlight.metrics.solarBolPlanningRange.max],
    [30, 38],
  );
  assert.deepEqual(
    [firstFlight.metrics.screeningMassPlanningRange.min, firstFlight.metrics.screeningMassPlanningRange.max],
    [3, 7],
  );
  assert.equal(firstFlight.metrics.screeningMass, undefined);

  assert.ok(model.missions.every(({ orbitId }) => orbitId !== "geo"));
  const publicMissionText = JSON.stringify(model.missions).toLowerCase();
  for (const stale of ["hosted-pathfinder", "hosted pathfinder", "flight demonstrator", "solar-10", "0.2-1.0", "0.2 kw", "0.5 kw"]) {
    assert.ok(!publicMissionText.includes(stale), `stale mission concept remains: ${stale}`);
  }
});

test("recomputes every orbital power and thermal screen", () => {
  const metricMap = {
    solarBolPower: "requiredBolSolarKw",
    activePvEquivalentArea: "activePvEquivalentAreaM2",
    grossSolarPlanformScreen: "grossSolarPlanformM2",
    batteryEnergyScreen: "batteryEnergyKwh",
    rejectedHeatScreen: "rejectedHeatKw",
    radiatorEffectiveAreaScreen: "radiatorEffectiveAreaM2",
  };

  for (const input of assumptions.missionInputs) {
    const published = mission(input.id);
    const calculated = computeMissionScreen(input, assumptions);
    const envelope = computeMissionEnvelope(input, assumptions);

    for (const [metricName, calculatedName] of Object.entries(metricMap)) {
      const publicMetric = published.metrics[metricName];
      if (typeof input.totalSpacecraftLoadKw === "number") {
        assert.equal(
          publicMetric.value,
          roundTo(calculated[calculatedName], publicMetric.displayPrecision),
          `${input.id} ${metricName} does not match the public equations`,
        );
      } else {
        for (const point of ["min", "nominal", "max"]) {
          assert.equal(
            publicMetric[point],
            roundTo(envelope[point][calculatedName], publicMetric.displayPrecision),
            `${input.id} ${metricName}.${point} does not match the public equations`,
          );
        }
      }
    }
  }
});

test("reproduces the 550 km nominal 10 kW-node screen", () => {
  const firstInput = assumptions.missionInputs.find(({ id }) => id === "orbital-node-10kw");
  const orbitScreen = computeOrbitScreen(assumptions.referenceOrbit);
  const envelope = computeMissionEnvelope(firstInput, assumptions);

  assert.equal(roundTo(orbitScreen.periodS / 60, 6), 95.64988);
  assert.equal(roundTo(orbitScreen.eclipseS / 60, 6), 35.611486);
  assert.equal(roundTo(orbitScreen.sunlitFraction, 9), 0.627689175);
  assert.equal(roundTo(orbitScreen.criticalBetaDeg, 6), 67.015948);
  assert.equal(roundTo(envelope.nominal.requiredBolSolarKw, 2), 33.61);
  assert.equal(roundTo(envelope.nominal.activePvEquivalentAreaM2, 2), 112.02);
  assert.equal(roundTo(envelope.nominal.grossSolarPlanformM2, 2), 140.02);
  assert.equal(roundTo(envelope.nominal.batteryEnergyKwh, 2), 28.31);
  assert.equal(roundTo(envelope.nominal.rejectedHeatKw, 2), 13.1);
  assert.equal(roundTo(envelope.nominal.radiatorEffectiveAreaM2, 2), 37.41);
  assert.ok(envelope.nominal.activePvEquivalentAreaM2 < envelope.nominal.grossSolarPlanformM2);
});

test("treats high-beta eclipse relief as conditional geometry", () => {
  const beta66 = computeOrbitScreen({ ...assumptions.referenceOrbit, betaDeg: 66 });
  const beta68 = computeOrbitScreen({ ...assumptions.referenceOrbit, betaDeg: 68 });
  assert.ok(beta66.eclipseS > 0);
  assert.equal(beta68.eclipseS, 0);
  assert.equal(computeAtLoad(13.5, { ...assumptions, referenceOrbit: { ...assumptions.referenceOrbit, betaDeg: 68 } }).batteryEnergyKwh, 0);
});

test("keeps the 1 MW case as ten repeated 100 kW modules", () => {
  const industrial = mission("industrial-orbital-module");
  const network = mission("megawatt-orbital-network");
  const repeatedMetricNames = [
    "continuousCompute",
    "solarBolPower",
    "activePvEquivalentArea",
    "grossSolarPlanformScreen",
    "batteryEnergyScreen",
    "rejectedHeatScreen",
    "radiatorEffectiveAreaScreen",
  ];

  for (const name of repeatedMetricNames) {
    const expected = industrial.metrics[name].value * 10;
    const actual = network.metrics[name].value;
    assert.ok(
      Math.abs(actual - expected) <= 0.1,
      `${name} is not a ten-module aggregate`,
    );
  }

  assert.equal(network.moduleArchitecture.moduleCount, 10);
  assert.equal(network.metrics.continuousCompute.value, 1000);
  assert.equal(network.metrics.solarBolPower.display.value, 2.875);
});

test("rejects invalid public power-screen inputs", () => {
  assert.throws(() => computeAtLoad(0, assumptions), /positive finite/);
  assert.throws(
    () => computeAtLoad(13.5, {
      ...assumptions,
      powerThermalScreen: {
        ...assumptions.powerThermalScreen,
        solar: { ...assumptions.powerThermalScreen.solar, arrayToLoadEfficiency: 1.1 },
      },
    }),
    /no greater than one/,
  );
  assert.throws(
    () => computeMissionEnvelope({ totalSpacecraftLoadKw: { min: 15, nominal: 13.5, max: 12 } }, assumptions),
    /min <= nominal <= max/,
  );
  assert.throws(
    () => computeOrbitScreen({ ...assumptions.referenceOrbit, betaDeg: 91 }),
    /between -90 and 90/,
  );
});

test("provides scale-correct LEO and GEO presets with latency caveats", () => {
  const leo = orbit("leo-550");
  const geo = orbit("geo");

  assert.equal(leo.metrics.altitude.value, 550);
  assert.equal(geo.metrics.altitude.value, 35786.033);
  assert.equal(leo.metrics.orbitalRadiusEarthRadii.value, 1.08623);
  assert.equal(geo.metrics.orbitalRadiusEarthRadii.value, 6.61073);
  assert.equal(leo.metrics.zenithVacuumOneWayLatency.value, 1.835);
  assert.equal(geo.metrics.zenithVacuumOneWayLatency.value, 119.369);
  assert.ok(
    geo.limitations.some((item) => item.includes("not end-to-end service latency")),
  );
});

test("every public metric declares unit, status and resolvable sources", () => {
  const statuses = new Set(model.statusDefinitions.map(({ code }) => code));
  const sources = new Set(model.sources.map(({ id }) => id));

  const inspect = (value, path = "model") => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => inspect(item, `${path}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;

    if (Object.hasOwn(value, "displayPrecision")) {
      assert.equal(typeof value.unit, "string", `${path} has no unit`);
      assert.ok(statuses.has(value.status), `${path} has unknown status`);
      assert.ok(Array.isArray(value.sourceIds), `${path} has no sourceIds`);
      assert.ok(value.sourceIds.length > 0, `${path} has no provenance`);
      value.sourceIds.forEach((id) => {
        assert.ok(sources.has(id), `${path} refers to unknown source ${id}`);
      });
    }

    Object.entries(value).forEach(([key, child]) => inspect(child, `${path}.${key}`));
  };

  inspect(model.constants, "constants");
  inspect(model.orbitPresets, "orbitPresets");
  inspect(model.missions, "missions");
  inspect(model.launchReferences, "launchReferences");
});
