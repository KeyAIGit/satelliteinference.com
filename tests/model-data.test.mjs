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
const { computeMissionScreen, roundTo } = await import(
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

test("publishes a versioned preliminary model contract", () => {
  assert.equal(model.schemaVersion, "1.0.0");
  assert.equal(model.dataVersion, "2026-09-02.rev-b.1");
  assert.equal(model.model.revision, "Rev B");
  assert.equal(model.model.deterministic, true);
  assert.match(model.model.disclaimer, /Supplier and launch-provider validation required/);
  assert.equal(assumptions.dataVersion, model.dataVersion);
  assert.equal(assumptions.modelRevision, model.model.revision);
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

test("preserves the canonical five-step mission ladder", () => {
  assert.deepEqual(
    model.missions.map(({ id }) => id),
    [
      "hosted-pathfinder",
      "flight-demonstrator",
      "commercial-orbital-node",
      "industrial-orbital-module",
      "megawatt-orbital-network",
    ],
  );

  const hosted = mission("hosted-pathfinder");
  assert.deepEqual(
    {
      min: hosted.metrics.continuousCompute.min,
      nominal: hosted.metrics.continuousCompute.nominal,
      max: hosted.metrics.continuousCompute.max,
      unit: hosted.metrics.continuousCompute.unit,
    },
    { min: 0.2, nominal: 0.5, max: 1, unit: "kW" },
  );

  const demo = mission("flight-demonstrator");
  assert.equal(demo.metrics.continuousCompute.value, 1);
  assert.equal(demo.metrics.solarBolPower.value, 10);
  assert.deepEqual(
    [demo.metrics.batteryPlanningRange.min, demo.metrics.batteryPlanningRange.max],
    [4, 8],
  );
  assert.equal(demo.metrics.radiatorNotionalGross.value, 6);

  for (const input of assumptions.missionInputs) {
    const published = mission(input.id);
    const calculated = computeMissionScreen(input, assumptions);
    const solarMetric =
      input.id === "flight-demonstrator"
        ? published.metrics.solarBolRequiredScreen
        : published.metrics.solarBolPower;

    assert.equal(
      solarMetric.value,
      roundTo(calculated.requiredBolSolarKw, solarMetric.displayPrecision),
      `${input.id} required BOL solar does not match the public equations`,
    );
    assert.equal(
      published.metrics.activePvEquivalentArea.value,
      roundTo(
        calculated.activePvEquivalentAreaM2,
        published.metrics.activePvEquivalentArea.displayPrecision,
      ),
      `${input.id} active-PV equivalent area does not match the public equations`,
    );
    assert.equal(
      published.metrics.batteryRevABase.value,
      roundTo(
        calculated.batteryEnergyKwh,
        published.metrics.batteryRevABase.displayPrecision,
      ),
      `${input.id} battery screen does not match the public equations`,
    );
    assert.equal(
      published.metrics.radiatorEffectiveAreaScreen.value,
      roundTo(
        calculated.radiatorEffectiveAreaM2,
        published.metrics.radiatorEffectiveAreaScreen.displayPrecision,
      ),
      `${input.id} radiator effective-area screen does not match the public equations`,
    );
  }

  const demoInput = assumptions.missionInputs.find(
    ({ id }) => id === "flight-demonstrator",
  );
  const demoScreen = computeMissionScreen(demoInput, assumptions);
  assert.equal(
    demo.metrics.radiatorFullLoadEquivalent.value,
    roundTo(
      demoScreen.radiatorFullLoadEquivalentM2,
      demo.metrics.radiatorFullLoadEquivalent.displayPrecision,
    ),
  );

  const network = mission("megawatt-orbital-network");
  assert.equal(network.moduleArchitecture.moduleCount, 10);
  assert.equal(network.metrics.continuousCompute.value, 1000);
  assert.equal(network.metrics.solarBolPower.display.value, 2.884);
  assert.equal(network.metrics.batteryRevABase.display.value, 2.593);
  assert.equal(network.metrics.screeningMass.display.min, 83.38);
  assert.equal(network.metrics.screeningMass.display.max, 326.02);
});

test("keeps the 1 MW case as ten repeated 100 kW modules", () => {
  const industrial = mission("industrial-orbital-module");
  const network = mission("megawatt-orbital-network");
  const repeatedMetricNames = [
    "continuousCompute",
    "solarBolPower",
    "activePvEquivalentArea",
    "batteryRevABase",
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
