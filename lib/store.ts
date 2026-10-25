import { create } from 'zustand';
import { MeshNode, MeshLink, MeshMessage, ElevationProfile } from './types';
import { getTerrainElevation, computeElevationProfile, evaluateMeshLinks } from './terrainModel';
import { findShortestRoute, processMessageQueue, RouteResult } from './routing';

const INITIAL_NODES: MeshNode[] = [
  {
    id: 'node-cmd',
    callsign: 'BASE-COMMAND',
    role: 'command',
    x: 5.2,
    y: 4.8,
    lat: 46.5218,
    lon: 8.5432,
    elevationM: getTerrainElevation(5.2, 4.8),
    antennaHeightM: 10,
    batteryPct: 98,
    status: 'online',
    lastHeardIso: new Date().toISOString(),
    txPowerDbm: 27,
    provenance: 'observed',
  },
  {
    id: 'node-relay-1',
    callsign: 'RELAY-RIDGE-NORTH',
    role: 'relay',
    x: 2.1,
    y: 2.4,
    lat: 46.5054,
    lon: 8.5120,
    elevationM: getTerrainElevation(2.1, 2.4),
    antennaHeightM: 6,
    batteryPct: 84,
    status: 'online',
    lastHeardIso: new Date().toISOString(),
    txPowerDbm: 24,
    provenance: 'observed',
  },
  {
    id: 'node-relay-2',
    callsign: 'RELAY-SADDLE-WEST',
    role: 'relay',
    x: -1.8,
    y: 0.5,
    lat: 46.4882,
    lon: 8.4751,
    elevationM: getTerrainElevation(-1.8, 0.5),
    antennaHeightM: 5,
    batteryPct: 79,
    status: 'online',
    lastHeardIso: new Date().toISOString(),
    txPowerDbm: 24,
    provenance: 'observed',
  },
  {
    id: 'node-alpha',
    callsign: 'PATROL-ALPHA',
    role: 'field_team',
    x: -4.5,
    y: -2.8,
    lat: 46.4621,
    lon: 8.4380,
    elevationM: getTerrainElevation(-4.5, -2.8),
    antennaHeightM: 2.5,
    batteryPct: 68,
    status: 'online',
    lastHeardIso: new Date().toISOString(),
    txPowerDbm: 20,
    provenance: 'observed',
  },
  {
    id: 'node-bravo',
    callsign: 'PATROL-BRAVO',
    role: 'field_team',
    x: 3.5,
    y: -1.2,
    lat: 46.4795,
    lon: 8.5298,
    elevationM: getTerrainElevation(3.5, -1.2),
    antennaHeightM: 2.5,
    batteryPct: 91,
    status: 'online',
    lastHeardIso: new Date().toISOString(),
    txPowerDbm: 20,
    provenance: 'observed',
  },
  {
    id: 'node-weather-1',
    callsign: 'SENSOR-COL',
    role: 'sensor',
    x: 0.2,
    y: -3.5,
    lat: 46.4588,
    lon: 8.4912,
    elevationM: getTerrainElevation(0.2, -3.5),
    antennaHeightM: 3.5,
    batteryPct: 88,
    status: 'online',
    lastHeardIso: new Date().toISOString(),
    txPowerDbm: 14,
    provenance: 'observed',
  },
];

const INITIAL_MESSAGES: MeshMessage[] = [
  {
    id: 'msg-01',
    fromId: 'node-alpha',
    toId: 'node-cmd',
    content: 'Cirque ascent underway. Wind 22kt NW, light spindrift. All 4 members green.',
    status: 'delivered',
    hops: ['node-alpha', 'node-relay-2', 'node-relay-1', 'node-cmd'],
    queuedAtIso: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    deliveredAtIso: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    priority: 'routine',
    payloadBytes: 74,
    provenance: 'observed',
  },
  {
    id: 'msg-02',
    fromId: 'node-weather-1',
    toId: 'node-cmd',
    content: 'Col anemometer telemetry: Baro 704hPa (-2.4hPa/3h), Temp -9.4C. Snowpack stable.',
    status: 'delivered',
    hops: ['node-weather-1', 'node-bravo', 'node-cmd'],
    queuedAtIso: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    deliveredAtIso: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    priority: 'routine',
    payloadBytes: 86,
    provenance: 'observed',
  },
];

export interface MeshStore {
  nodes: MeshNode[];
  links: MeshLink[];
  messages: MeshMessage[];
  selectedNodeId: string;
  comparisonNodeId: string;
  is3dView: boolean;
  activeLayer: 'all' | 'l1' | 'l2' | 'l3';
  activeExplodedView: boolean;
  systemAnnouncements: string[];

  // Actions
  selectNode: (id: string) => void;
  setComparisonNode: (id: string) => void;
  toggleNodeStatus: (id: string) => void;
  sendMessage: (fromId: string, toId: string, content: string, priority?: 'routine' | 'urgent' | 'alert') => void;
  toggle3dView: () => void;
  setActiveLayer: (layer: 'all' | 'l1' | 'l2' | 'l3') => void;
  toggleExplodedView: () => void;
  resetMesh: () => void;
  
  // Derived helpers
  getSelectedNode: () => MeshNode | undefined;
  getSelectedRoute: () => RouteResult;
  getSelectedProfile: () => ElevationProfile | null;
}

const STORAGE_KEY_NODES = 'cairn_nodes_v1';
const STORAGE_KEY_MSGS = 'cairn_messages_v1';

function loadPersistedState() {
  if (typeof window === 'undefined') {
    return { nodes: INITIAL_NODES, messages: INITIAL_MESSAGES };
  }
  try {
    const savedNodes = localStorage.getItem(STORAGE_KEY_NODES);
    const savedMsgs = localStorage.getItem(STORAGE_KEY_MSGS);
    return {
      nodes: savedNodes ? JSON.parse(savedNodes) : INITIAL_NODES,
      messages: savedMsgs ? JSON.parse(savedMsgs) : INITIAL_MESSAGES,
    };
  } catch {
    return { nodes: INITIAL_NODES, messages: INITIAL_MESSAGES };
  }
}

const persisted = loadPersistedState();
const initialCalculatedLinks = evaluateMeshLinks(persisted.nodes);

export const useMeshStore = create<MeshStore>((set, get) => ({
  nodes: persisted.nodes,
  links: initialCalculatedLinks,
  messages: persisted.messages,
  selectedNodeId: 'node-alpha',
  comparisonNodeId: 'node-cmd',
  is3dView: false,
  activeLayer: 'all',
  activeExplodedView: false,
  systemAnnouncements: ['System initialized in alpine synthetic sector.'],

  selectNode: (id: string) => {
    set({ selectedNodeId: id });
  },

  setComparisonNode: (id: string) => {
    set({ comparisonNodeId: id });
  },

  toggleNodeStatus: (id: string) => {
    const state = get();
    const updatedNodes: MeshNode[] = state.nodes.map(n => {
      if (n.id === id) {
        const nextStatus: MeshNode['status'] = n.status === 'online' ? 'offline' : 'online';
        return { ...n, status: nextStatus, lastHeardIso: new Date().toISOString() };
      }
      return n;
    });

    const targetNode = updatedNodes.find(n => n.id === id);
    const newLinks = evaluateMeshLinks(updatedNodes);
    const { updatedMessages, newlyDeliveredCount } = processMessageQueue(state.messages, updatedNodes, newLinks);

    const announcement = targetNode
      ? `${targetNode.callsign} transitioned to ${targetNode.status.toUpperCase()}. Topology recomputed.${newlyDeliveredCount > 0 ? ` ${newlyDeliveredCount} queued packet(s) delivered.` : ''}`
      : 'Topology updated.';

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(updatedNodes));
        localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updatedMessages));
      } catch (e) {
        console.error('Storage write error', e);
      }
    }

    set({
      nodes: updatedNodes,
      links: newLinks,
      messages: updatedMessages,
      systemAnnouncements: [announcement, ...state.systemAnnouncements.slice(0, 8)],
    });
  },

  sendMessage: (fromId: string, toId: string, content: string, priority = 'routine') => {
    const state = get();
    const route = findShortestRoute(fromId, toId, state.nodes, state.links);
    const isDeliverable = route.reachable;

    const newMessage: MeshMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fromId,
      toId,
      content,
      status: isDeliverable ? 'delivered' : 'queued',
      hops: isDeliverable ? route.path : [],
      queuedAtIso: new Date().toISOString(),
      deliveredAtIso: isDeliverable ? new Date().toISOString() : undefined,
      priority,
      payloadBytes: new TextEncoder().encode(content).length,
      provenance: 'observed',
    };

    const updatedMessages = [newMessage, ...state.messages];
    const fromNode = state.nodes.find(n => n.id === fromId);
    const announcement = isDeliverable
      ? `Message delivered via ${route.hops} hop(s): "${content.slice(0, 30)}..."`
      : `No direct or relay path. Message stored in ${fromNode?.callsign || 'node'} local cache (Queued).`;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updatedMessages));
      } catch (e) {
        console.error('Storage write error', e);
      }
    }

    set({
      messages: updatedMessages,
      systemAnnouncements: [announcement, ...state.systemAnnouncements.slice(0, 8)],
    });
  },

  toggle3dView: () => {
    set(s => ({ is3dView: !s.is3dView }));
  },

  setActiveLayer: (layer) => {
    set({ activeLayer: layer });
  },

  toggleExplodedView: () => {
    set(s => ({ activeExplodedView: !s.activeExplodedView }));
  },

  resetMesh: () => {
    const freshLinks = evaluateMeshLinks(INITIAL_NODES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_NODES);
      localStorage.removeItem(STORAGE_KEY_MSGS);
    }
    set({
      nodes: INITIAL_NODES,
      links: freshLinks,
      messages: INITIAL_MESSAGES,
      selectedNodeId: 'node-alpha',
      comparisonNodeId: 'node-cmd',
      systemAnnouncements: ['Mesh reset to baseline alpine configuration.'],
    });
  },

  getSelectedNode: () => {
    const state = get();
    return state.nodes.find(n => n.id === state.selectedNodeId);
  },

  getSelectedRoute: () => {
    const state = get();
    return findShortestRoute(state.selectedNodeId, 'node-cmd', state.nodes, state.links);
  },

  getSelectedProfile: () => {
    const state = get();
    const a = state.nodes.find(n => n.id === state.selectedNodeId);
    const b = state.nodes.find(n => n.id === state.comparisonNodeId);
    if (!a || !b || a.id === b.id) return null;
    return computeElevationProfile(a, b, 40);
  },
}));
