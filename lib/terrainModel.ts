import { MeshNode, MeshLink, ElevationProfile, TerrainSample } from './types';

/**
 * Deterministic synthetic DEM elevation function.
 * Produces alpine terrain with distinct ridgelines, saddle passes, and deep valleys.
 * Units: meters above sea level (ASL).
 */
export function getTerrainElevation(x: number, y: number): number {
  // Alpine base elevation
  const base = 1950;
  
  // Primary mountain ridge trending northwest-southeast
  const primaryRidge = 1100 * Math.pow(Math.cos(0.32 * x + 0.18 * y), 2);
  
  // Secondary cross-ridges creating rugged spurs and valleys
  const spurRidge = 550 * Math.sin(0.48 * y - 0.28 * x) * Math.cos(0.25 * x);
  
  // High-frequency crags and couloirs
  const crags = 180 * Math.sin(1.15 * x + 0.65 * y) * Math.cos(1.05 * y - 0.75 * x);
  
  // Micro-undulation
  const detail = 45 * Math.sin(2.4 * x) * Math.sin(2.4 * y);

  return Math.round(base + primaryRidge + spurRidge + crags + detail);
}

/**
 * Calculates line-of-sight elevation profile between two nodes.
 * Discretizes the straight path into N sample steps, evaluating:
 * 1. Ground elevation H(x, y)
 * 2. RF ray height = lerp(antennaA, antennaB)
 * 3. Clearance = rayHeight - groundElevation
 */
export function computeElevationProfile(
  nodeA: MeshNode,
  nodeB: MeshNode,
  sampleSteps = 40
): ElevationProfile {
  const dx = nodeB.x - nodeA.x;
  const dy = nodeB.y - nodeA.y;
  const distanceKm = Math.sqrt(dx * dx + dy * dy);

  const antA = nodeA.elevationM + nodeA.antennaHeightM;
  const antB = nodeB.elevationM + nodeB.antennaHeightM;

  const samples: TerrainSample[] = [];
  let minClearanceM = Infinity;
  let isObstructed = false;

  for (let i = 0; i <= sampleSteps; i++) {
    const t = i / sampleSteps;
    const currentDist = t * distanceKm;
    const curX = nodeA.x + t * dx;
    const curY = nodeA.y + t * dy;

    const groundElevationM = getTerrainElevation(curX, curY);
    // Linear line-of-sight propagation ray
    const rayElevationM = antA + t * (antB - antA);
    const clearanceM = Math.round((rayElevationM - groundElevationM) * 10) / 10;

    // First and last step are the antennas themselves, where clearance is the antenna height
    const effectiveClearance = (i === 0 || i === sampleSteps) ? clearanceM : clearanceM;

    if (i > 0 && i < sampleSteps && clearanceM < 0) {
      isObstructed = true;
    }

    if (i > 0 && i < sampleSteps && clearanceM < minClearanceM) {
      minClearanceM = clearanceM;
    }

    samples.push({
      distKm: Math.round(currentDist * 100) / 100,
      groundElevationM,
      rayElevationM: Math.round(rayElevationM * 10) / 10,
      clearanceM: effectiveClearance,
    });
  }

  return {
    fromNode: nodeA,
    toNode: nodeB,
    distanceKm: Math.round(distanceKm * 100) / 100,
    minClearanceM: isFinite(minClearanceM) ? minClearanceM : 0,
    isObstructed,
    samples,
  };
}

/**
 * Computes all pairwise links across nodes within radio range (default 8.5 km).
 * Link is 'online' if both nodes are 'online', within RF range, and line-of-sight is unobstructed.
 */
export function evaluateMeshLinks(
  nodes: MeshNode[],
  maxRadioRangeKm = 9.0
): MeshLink[] {
  const links: MeshLink[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= maxRadioRangeKm) {
        const profile = computeElevationProfile(a, b, 30);
        const bothOnline = a.status === 'online' && b.status === 'online';
        const status = (bothOnline && !profile.isObstructed) ? 'online' : 'severed';

        // Free Space Path Loss (FSPL) estimate at 915 MHz ISM band: 20*log10(d) + 20*log10(f) + 32.44
        const fsplDb = 20 * Math.log10(Math.max(0.1, dist)) + 20 * Math.log10(915) + 32.44;
        const lossMarginDb = Math.round(Math.max(0, 115 - fsplDb));

        links.push({
          id: `link-${a.id}-${b.id}`,
          fromId: a.id,
          toId: b.id,
          distanceKm: Math.round(dist * 100) / 100,
          status,
          clearanceM: profile.minClearanceM,
          lossMarginDb,
          provenance: 'estimated',
          lastCalculatedIso: new Date().toISOString(),
        });
      }
    }
  }

  return links;
}
