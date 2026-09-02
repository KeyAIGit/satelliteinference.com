export function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function computeOrbitScreen(referenceOrbit) {
  const earthRadiusKm = referenceOrbit.earthEquatorialRadiusKm;
  const orbitRadiusKm = earthRadiusKm + referenceOrbit.altitudeKm;
  const periodS =
    2 *
    Math.PI *
    Math.sqrt(
      orbitRadiusKm ** 3 /
        referenceOrbit.earthGravitationalParameterKm3s2,
    );
  const eclipseS =
    (periodS * Math.asin(earthRadiusKm / orbitRadiusKm)) / Math.PI;

  return {
    orbitRadiusKm,
    periodS,
    eclipseS,
    sunlitFraction: 1 - eclipseS / periodS,
  };
}

export function computeMissionScreen(missionInput, assumptions) {
  const orbit = computeOrbitScreen(assumptions.referenceOrbit);
  const screen = assumptions.powerThermalScreen;
  const requiredBolSolarKw =
    (missionInput.totalSpacecraftLoadKw * screen.solarLossAndMarginFactor) /
    orbit.sunlitFraction;
  const selectedBolPowerKw =
    missionInput.installedBolTargetKw ?? requiredBolSolarKw;
  const activePvEquivalentAreaM2 =
    (selectedBolPowerKw * 1000) / screen.solarBolArealPowerWm2;
  const batteryEnergyKwh =
    missionInput.totalSpacecraftLoadKw *
    (orbit.eclipseS / 3600) *
    screen.batterySizingFactor;
  const radiatorEffectiveAreaM2 =
    (missionInput.totalSpacecraftLoadKw *
      1000 *
      screen.radiatorHeatLoadFraction) /
    screen.radiatorNetRejectionWm2;
  const radiatorFullLoadEquivalentM2 =
    (missionInput.totalSpacecraftLoadKw * 1000) /
    screen.radiatorNetRejectionWm2;

  return {
    ...orbit,
    requiredBolSolarKw,
    selectedBolPowerKw,
    activePvEquivalentAreaM2,
    batteryEnergyKwh,
    radiatorEffectiveAreaM2,
    radiatorFullLoadEquivalentM2,
  };
}
