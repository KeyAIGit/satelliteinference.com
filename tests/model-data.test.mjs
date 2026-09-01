import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dataPath = fileURLToPath(
  new URL("../public/data/site-model.json", import.meta.url),
);
const model = JSON.parse(await readFile(dataPath, "utf8"));

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
  assert.equal(model.dataVersion, "2026-09-01.rev-a.1");
  assert.equal(model.model.revision, "Rev A");
  assert.equal(model.model.deterministic, true);
  assert.match(model.model.disclaimer, /Supplier and launch-provider validation required/);
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
  assert.equal(demo.metrics.deployedSolarArea.value, 33.333);
  assert.deepEqual(
    [demo.metrics.batteryPlanningRange.min, demo.metrics.batteryPlanningRange.max],
    [4, 8],
  );
  assert.equal(demo.metrics.batteryRevABase.value, 3.7);
  assert.equal(demo.metrics.batteryRevABase.displayPrecision, 2);
  assert.equal(demo.metrics.radiatorModeledMinimum.value, 4.57);
  assert.equal(demo.metrics.radiatorNotionalGross.value, 6);

  const commercial = mission("commercial-orbital-node");
  assert.equal(commercial.metrics.solarBolPower.value, 29.97);
  assert.equal(commercial.metrics.deployedSolarArea.value, 99.89);
  assert.equal(commercial.metrics.batteryRevABase.value, 26.94);
  assert.equal(commercial.metrics.radiatorModeledMinimum.value, 33.26);

  const industrial = mission("industrial-orbital-module");
  assert.equal(industrial.metrics.solarBolPower.value, 288.44);
  assert.equal(industrial.metrics.deployedSolarArea.value, 961.47);
  assert.equal(industrial.metrics.batteryRevABase.value, 259.33);
  assert.equal(industrial.metrics.radiatorModeledMinimum.value, 320.1);

  const network = mission("megawatt-orbital-network");
  assert.equal(network.moduleArchitecture.moduleCount, 10);
  assert.equal(network.metrics.continuousCompute.value, 1000);
  assert.equal(network.metrics.solarBolPower.display.value, 2.884);
  assert.equal(network.metrics.deployedSolarArea.value, 9614.66);
  assert.equal(network.metrics.batteryRevABase.display.value, 2.593);
  assert.equal(network.metrics.radiatorModeledMinimum.value, 3201);
  assert.equal(network.metrics.screeningMass.display.min, 83.38);
  assert.equal(network.metrics.screeningMass.display.max, 326.02);
});

test("keeps the 1 MW case as ten repeated 100 kW modules", () => {
  const industrial = mission("industrial-orbital-module");
  const network = mission("megawatt-orbital-network");
  const repeatedMetricNames = [
    "continuousCompute",
    "solarBolPower",
    "deployedSolarArea",
    "batteryRevABase",
    "radiatorModeledMinimum",
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
