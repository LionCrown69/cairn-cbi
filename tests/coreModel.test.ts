import { describe, it, expect } from 'vitest';
import { getTerrainElevation, computeElevationProfile, evaluateMeshLinks } from '../lib/terrainModel';
import { findShortestRoute, processMessageQueue } from '../lib/routing';
import { MeshNode, MeshMessage } from '../lib/types';
import { MockProvider } from '../lib/aiProvider';

describe('1. Terrain Model & Link Line-of-Sight Determination', () => {
  it('produces deterministic elevation values for given coordinates', () => {
    const elev1 = getTerrainElevation(5.2, 4.8);
    const elev2 = getTerrainElevation(5.2, 4.8);
    expect(elev1).toBe(elev2);
    expect(elev1).toBeGreaterThan(1800);
    expect(elev1).toBeLessThan(3500);
  });

  it('correctly calculates line-of-sight obstruction between two nodes', () => {
    const nodeA: MeshNode = {
      id: 'node-a',
      callsign: 'VALLEY-1',
      role: 'field_team',
      x: -4.5,
      y: -2.8,
      lat: 46.46,
      lon: 8.43,
      elevationM: getTerrainElevation(-4.5, -2.8),
      antennaHeightM: 2.5,
      batteryPct: 80,
      status: 'online',
      lastHeardIso: new Date().toISOString(),
      txPowerDbm: 20,
      provenance: 'observed',
    };

    const nodeB: MeshNode = {
      id: 'node-b',
      callsign: 'COMMAND',
      role: 'command',
      x: 5.2,
      y: 4.8,
      lat: 46.52,
      lon: 8.54,
      elevationM: getTerrainElevation(5.2, 4.8),
      antennaHeightM: 10,
      batteryPct: 100,
      status: 'online',
      lastHeardIso: new Date().toISOString(),
      txPowerDbm: 27,
      provenance: 'observed',
    };

    const profile = computeElevationProfile(nodeA, nodeB, 40);
    expect(profile.distanceKm).toBeGreaterThan(0);
    expect(profile.samples.length).toBe(41);
    expect(typeof profile.isObstructed).toBe('boolean');
  });
});

describe('2. BFS Routing & Store-and-Forward Topology Healing', () => {
  const nodes: MeshNode[] = [
    {
      id: 'cmd',
      callsign: 'COMMAND',
      role: 'command',
      x: 0,
      y: 0,
      lat: 0,
      lon: 0,
      elevationM: 2000,
      antennaHeightM: 10,
      batteryPct: 100,
      status: 'online',
      lastHeardIso: new Date().toISOString(),
      txPowerDbm: 27,
      provenance: 'observed',
    },
    {
      id: 'relay',
      callsign: 'RELAY',
      role: 'relay',
      x: 2,
      y: 0,
      lat: 0,
      lon: 0,
      elevationM: 2500,
      antennaHeightM: 5,
      batteryPct: 90,
      status: 'online',
      lastHeardIso: new Date().toISOString(),
      txPowerDbm: 24,
      provenance: 'observed',
    },
    {
      id: 'patrol',
      callsign: 'PATROL',
      role: 'field_team',
      x: 4,
      y: 0,
      lat: 0,
      lon: 0,
      elevationM: 2100,
      antennaHeightM: 2.5,
      batteryPct: 75,
      status: 'online',
      lastHeardIso: new Date().toISOString(),
      txPowerDbm: 20,
      provenance: 'observed',
    },
  ];

  it('finds the 2-hop route over active relay', () => {
    const links = [
      {
        id: 'l1',
        fromId: 'patrol',
        toId: 'relay',
        distanceKm: 2.0,
        status: 'online' as const,
        clearanceM: 50,
        lossMarginDb: 25,
        provenance: 'estimated' as const,
        lastCalculatedIso: new Date().toISOString(),
      },
      {
        id: 'l2',
        fromId: 'relay',
        toId: 'cmd',
        distanceKm: 2.0,
        status: 'online' as const,
        clearanceM: 60,
        lossMarginDb: 25,
        provenance: 'estimated' as const,
        lastCalculatedIso: new Date().toISOString(),
      },
    ];

    const route = findShortestRoute('patrol', 'cmd', nodes, links);
    expect(route.reachable).toBe(true);
    expect(route.hops).toBe(2);
    expect(route.path).toEqual(['patrol', 'relay', 'cmd']);
  });

  it('handles severance and queues messages, then flushes upon relay restoration', () => {
    // When relay link is severed
    const severedLinks = [
      {
        id: 'l1',
        fromId: 'patrol',
        toId: 'relay',
        distanceKm: 2.0,
        status: 'severed' as const,
        clearanceM: -20,
        lossMarginDb: 0,
        provenance: 'estimated' as const,
        lastCalculatedIso: new Date().toISOString(),
      },
      {
        id: 'l2',
        fromId: 'relay',
        toId: 'cmd',
        distanceKm: 2.0,
        status: 'online' as const,
        clearanceM: 60,
        lossMarginDb: 25,
        provenance: 'estimated' as const,
        lastCalculatedIso: new Date().toISOString(),
      },
    ];

    const routeSevered = findShortestRoute('patrol', 'cmd', nodes, severedLinks);
    expect(routeSevered.reachable).toBe(false);

    // Initial queued message
    const initialMessages: MeshMessage[] = [
      {
        id: 'msg-test-1',
        fromId: 'patrol',
        toId: 'cmd',
        content: 'Storm moving over pass',
        status: 'queued',
        hops: [],
        queuedAtIso: new Date().toISOString(),
        priority: 'urgent',
        payloadBytes: 21,
        provenance: 'observed',
      },
    ];

    // Processing with severed links retains 'queued' status
    const resultSevered = processMessageQueue(initialMessages, nodes, severedLinks);
    expect(resultSevered.updatedMessages[0].status).toBe('queued');
    expect(resultSevered.newlyDeliveredCount).toBe(0);

    // Now restore the link online
    const restoredLinks = [
      { ...severedLinks[0], status: 'online' as const, clearanceM: 50 },
      severedLinks[1],
    ];

    const resultRestored = processMessageQueue(initialMessages, nodes, restoredLinks);
    expect(resultRestored.updatedMessages[0].status).toBe('delivered');
    expect(resultRestored.newlyDeliveredCount).toBe(1);
    expect(resultRestored.updatedMessages[0].hops).toEqual(['patrol', 'relay', 'cmd']);
  });
});

describe('3. AI Layer Boundaries & Hallucination Guardrails', () => {
  it('generates a verified digest without hallucinating numbers', async () => {
    const provider = new MockProvider();
    const digest = await provider.generateDigest({
      onlineNodesCount: 5,
      offlineNodesCount: 1,
      deliveredMessagesCount: 12,
      queuedMessagesCount: 2,
      activeLinksCount: 7,
      recentMessages: [
        { callsign: 'PATROL-ALPHA', content: 'Crest reached', priority: 'routine' },
      ],
    });

    expect(digest.source).toBe('deterministic_template');
    expect(digest.disclaimer).toContain('AI-generated, unverified');
    expect(digest.rawInput.onlineNodesCount).toBe(5);
  });
});
