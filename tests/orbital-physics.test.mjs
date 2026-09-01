import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
});

after(async () => vite.close());

const physics = await vite.ssrLoadModule("/lib/orbital-physics.ts");

test("matches the 550 km circular-orbit reference values", () => {
  const orbit = physics.orbitMetrics(550);
  const latency = physics.latencyMetrics(550, 90);

  assert.ok(Math.abs(orbit.periodS / 60 - 95.64988) < 0.0001);
  assert.ok(Math.abs(orbit.eclipseS / 60 - 35.61149) < 0.0001);
  assert.ok(Math.abs(latency.oneWayMs - 1.83460) < 0.0001);
});

test("derives GEO from a sidereal day", () => {
  const altitude = physics.geoAltitudeKm();
  const orbit = physics.orbitMetrics(altitude);
  const latency = physics.latencyMetrics(altitude, 90);

  assert.ok(Math.abs(altitude - 35786.033) < 0.001);
  assert.ok(Math.abs(orbit.periodS - 86164.09054) < 0.01);
  assert.ok(Math.abs(latency.oneWayMs - 119.36936) < 0.0001);
});

test("obeys basic orbital and link monotonicity", () => {
  const low = physics.orbitMetrics(550);
  const high = physics.orbitMetrics(2000);

  assert.ok(high.periodS > low.periodS);
  assert.ok(high.speedKmS < low.speedKmS);
  assert.ok(physics.slantRangeKm(550, 10) > physics.slantRangeKm(550, 90));
  assert.equal(physics.orbitMetrics(550, low.betaCriticalDeg).eclipseS, 0);
});

test("rejects impossible inputs", () => {
  assert.throws(() => physics.orbitMetrics(0), RangeError);
  assert.throws(() => physics.slantRangeKm(550, 91), RangeError);
});
