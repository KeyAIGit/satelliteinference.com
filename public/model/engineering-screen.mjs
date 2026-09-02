export function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function positive(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number`);
  }
}

function efficiency(value, label) {
  if (!Number.isFinite(value) || value <= 0 || value > 1) {
    throw new RangeError(`${label} must be greater than zero and no greater than one`);
  }
}

export function computeOrbitScreen(referenceOrbit) {
  const earthRadiusKm = referenceOrbit.earthEquatorialRadiusKm;
  const altitudeKm = referenceOrbit.altitudeKm;
  const gravitationalParameter = referenceOrbit.earthGravitationalParameterKm3s2;
  const betaDeg = referenceOrbit.betaDeg ?? 0;

  positive(earthRadiusKm, "earth radius");
  positive(altitudeKm, "altitude");
  positive(gravitationalParameter, "gravitational parameter");
  if (!Number.isFinite(betaDeg) || Math.abs(betaDeg) > 90) {
    throw new RangeError("beta angle must be between -90 and 90 degrees");
  }

  const orbitRadiusKm = earthRadiusKm + altitudeKm;
  const periodS =
    2 * Math.PI * Math.sqrt(orbitRadiusKm ** 3 / gravitationalParameter);
  const criticalBetaRad = Math.asin(earthRadiusKm / orbitRadiusKm);
  const betaRad = Math.abs(betaDeg) * Math.PI / 180;
  let eclipseS = 0;

  if (betaRad < criticalBetaRad) {
    const argument =
      Math.sqrt(orbitRadiusKm ** 2 - earthRadiusKm ** 2) /
      (orbitRadiusKm * Math.cos(betaRad));
    const eclipseHalfAngleRad = Math.acos(Math.min(1, Math.max(-1, argument)));
    eclipseS = periodS * eclipseHalfAngleRad / Math.PI;
  }

  return {
    orbitRadiusKm,
    periodS,
    eclipseS,
    sunlitFraction: 1 - eclipseS / periodS,
    criticalBetaDeg: criticalBetaRad * 180 / Math.PI,
  };
}

export function computeAtLoad(totalSpacecraftLoadKw, assumptions) {
  positive(totalSpacecraftLoadKw, "total spacecraft load");
  const orbit = computeOrbitScreen(assumptions.referenceOrbit);
  const { solar, battery, thermal } = assumptions.powerThermalScreen;

  positive(solar.designMargin, "solar design margin");
  efficiency(solar.arrayToLoadEfficiency, "array-to-load efficiency");
  efficiency(solar.eolPowerRetention, "solar EOL retention");
  positive(solar.activePvBolArealPowerWm2, "active-PV BOL areal power");
  efficiency(solar.activeToGrossPackingFactor, "active-to-gross packing factor");
  efficiency(battery.maximumDepthOfDischarge, "maximum depth of discharge");
  efficiency(battery.dischargeEfficiency, "battery discharge efficiency");
  efficiency(battery.eolCapacityRetention, "battery EOL retention");
  positive(battery.energyReserveFactor, "battery energy reserve factor");
  efficiency(thermal.heatLoadFraction, "heat-load fraction");
  positive(thermal.radiatorNetRejectionWm2, "radiator net rejection");

  const requiredBolSolarKw =
    totalSpacecraftLoadKw * solar.designMargin /
    (orbit.sunlitFraction * solar.arrayToLoadEfficiency * solar.eolPowerRetention);
  const activePvEquivalentAreaM2 =
    requiredBolSolarKw * 1000 / solar.activePvBolArealPowerWm2;
  const grossSolarPlanformM2 =
    activePvEquivalentAreaM2 / solar.activeToGrossPackingFactor;
  const batteryEnergyKwh =
    totalSpacecraftLoadKw * (orbit.eclipseS / 3600) * battery.energyReserveFactor /
    (battery.maximumDepthOfDischarge * battery.dischargeEfficiency * battery.eolCapacityRetention);
  const rejectedHeatKw = totalSpacecraftLoadKw * thermal.heatLoadFraction;
  const radiatorEffectiveAreaM2 =
    rejectedHeatKw * 1000 / thermal.radiatorNetRejectionWm2;

  return {
    ...orbit,
    totalSpacecraftLoadKw,
    requiredBolSolarKw,
    selectedBolPowerKw: requiredBolSolarKw,
    activePvEquivalentAreaM2,
    grossSolarPlanformM2,
    batteryEnergyKwh,
    rejectedHeatKw,
    radiatorEffectiveAreaM2,
  };
}

export function computeMissionScreen(missionInput, assumptions) {
  const load = missionInput.totalSpacecraftLoadKw;
  return computeAtLoad(
    typeof load === "number" ? load : load.nominal,
    assumptions,
  );
}

export function computeMissionEnvelope(missionInput, assumptions) {
  const load = missionInput.totalSpacecraftLoadKw;
  if (typeof load === "number") {
    const result = computeAtLoad(load, assumptions);
    return { min: result, nominal: result, max: result };
  }
  if (!(load.min <= load.nominal && load.nominal <= load.max)) {
    throw new RangeError("mission load range must satisfy min <= nominal <= max");
  }
  return {
    min: computeAtLoad(load.min, assumptions),
    nominal: computeAtLoad(load.nominal, assumptions),
    max: computeAtLoad(load.max, assumptions),
  };
}
