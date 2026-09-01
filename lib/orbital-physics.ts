export const PHYSICS = {
  earthRadiusKm: 6378.137,
  earthMuKm3s2: 398600.4418,
  lightKmS: 299792.458,
  siderealDayS: 86164.09054,
} as const;

const DEG = Math.PI / 180;

export function geoAltitudeKm(): number {
  const radiusKm = Math.cbrt(
    PHYSICS.earthMuKm3s2 *
      Math.pow(PHYSICS.siderealDayS / (2 * Math.PI), 2),
  );
  return radiusKm - PHYSICS.earthRadiusKm;
}

export function orbitMetrics(altitudeKm: number, betaDeg = 0) {
  if (!Number.isFinite(altitudeKm) || altitudeKm <= 0) {
    throw new RangeError("altitudeKm must be a positive finite number");
  }

  const orbitRadiusKm = PHYSICS.earthRadiusKm + altitudeKm;
  const periodS =
    2 *
    Math.PI *
    Math.sqrt(Math.pow(orbitRadiusKm, 3) / PHYSICS.earthMuKm3s2);
  const speedKmS = Math.sqrt(PHYSICS.earthMuKm3s2 / orbitRadiusKm);
  const earthRatio = PHYSICS.earthRadiusKm / orbitRadiusKm;
  const betaRad = Math.abs(betaDeg) * DEG;
  const betaCriticalRad = Math.asin(earthRatio);

  const eclipseHalfAngleRad =
    betaRad >= betaCriticalRad - 1e-12
      ? 0
      : Math.acos(
          Math.min(
            1,
            Math.sqrt(1 - earthRatio * earthRatio) / Math.cos(betaRad),
          ),
        );
  const eclipseS = (periodS * eclipseHalfAngleRad) / Math.PI;

  return {
    orbitRadiusKm,
    periodS,
    speedKmS,
    eclipseS,
    sunlightS: periodS - eclipseS,
    sunlitFraction: 1 - eclipseS / periodS,
    betaCriticalDeg: betaCriticalRad / DEG,
  };
}

export function slantRangeKm(altitudeKm: number, elevationDeg = 90): number {
  if (elevationDeg < 0 || elevationDeg > 90) {
    throw new RangeError("elevationDeg must be between 0 and 90 degrees");
  }
  const radiusKm = PHYSICS.earthRadiusKm + altitudeKm;
  const elevationRad = elevationDeg * DEG;
  return (
    Math.sqrt(
      radiusKm * radiusKm -
        PHYSICS.earthRadiusKm *
          PHYSICS.earthRadiusKm *
          Math.cos(elevationRad) ** 2,
    ) -
    PHYSICS.earthRadiusKm * Math.sin(elevationRad)
  );
}

export function latencyMetrics(altitudeKm: number, elevationDeg = 90) {
  const rangeKm = slantRangeKm(altitudeKm, elevationDeg);
  const oneWayMs = (1000 * rangeKm) / PHYSICS.lightKmS;
  return {
    rangeKm,
    oneWayMs,
    requestResultMs: 2 * oneWayMs,
    symmetricRelayRttMs: 4 * oneWayMs,
  };
}
