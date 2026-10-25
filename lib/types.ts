export type NodeRole = 'command' | 'relay' | 'sensor' | 'field_team';
export type NodeStatus = 'online' | 'offline';
export type LinkStatus = 'online' | 'severed';
export type MessageStatus = 'queued' | 'delivered';
export type ProvenanceTag = 'observed' | 'derived' | 'estimated' | 'simulated';

export interface MeshNode {
  id: string;
  callsign: string;
  role: NodeRole;
  x: number; // local grid km (-10 to +10)
  y: number; // local grid km (-10 to +10)
  lat: number;
  lon: number;
  elevationM: number;
  antennaHeightM: number;
  batteryPct: number;
  status: NodeStatus;
  lastHeardIso: string;
  txPowerDbm: number;
  provenance: ProvenanceTag;
}

export interface MeshLink {
  id: string;
  fromId: string;
  toId: string;
  distanceKm: number;
  status: LinkStatus;
  clearanceM: number; // positive = line of sight clear, negative = obstructed
  obstructionElevationM?: number;
  obstructionDistKm?: number;
  lossMarginDb: number;
  provenance: ProvenanceTag; // 'estimated'
  lastCalculatedIso: string;
}

export interface MeshMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  status: MessageStatus;
  hops: string[];
  queuedAtIso: string;
  deliveredAtIso?: string;
  priority: 'routine' | 'urgent' | 'alert';
  payloadBytes: number;
  provenance: ProvenanceTag; // 'observed'
}

export interface TerrainSample {
  distKm: number;
  groundElevationM: number;
  rayElevationM: number;
  clearanceM: number;
}

export interface ElevationProfile {
  fromNode: MeshNode;
  toNode: MeshNode;
  distanceKm: number;
  minClearanceM: number;
  isObstructed: boolean;
  samples: TerrainSample[];
}

export interface MetricDefinition {
  name: string;
  unit: string;
  source: string;
  provenance: ProvenanceTag;
  description: string;
  accuracy: string;
}
