'use client';

import React, { useState } from 'react';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';
import { Power, Send, Battery, Radio, Compass, Wifi, WifiOff, GitFork, AlertTriangle } from 'lucide-react';
import { getNeighbors } from '@/lib/routing';

export default function NodeControlPanel() {
  const {
    nodes,
    links,
    selectedNodeId,
    toggleNodeStatus,
    sendMessage,
    getSelectedNode,
    getSelectedRoute,
  } = useMeshStore();

  const [messageText, setMessageText] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'alert'>('routine');

  const selectedNode = getSelectedNode();
  const route = getSelectedRoute();

  if (!selectedNode) {
    return (
      <div className="cairn-glass p-6 rounded-lg border border-line text-xs font-mono text-mute">
        Select a node on the map to inspect telemetry and send field reports.
      </div>
    );
  }

  const isOnline = selectedNode.status === 'online';
  const neighbors = getNeighbors(selectedNode.id, links);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim()) return;
    sound.playBeaconPing();
    sendMessage(selectedNode!.id, 'node-cmd', messageText.trim(), priority);
    setMessageText('');
  }

  function handleToggle() {
    if (isOnline) {
      sound.playAlert();
    } else {
      sound.playSuccess();
    }
    toggleNodeStatus(selectedNode!.id);
  }

  return (
    <div className="cairn-glass rounded-lg border border-line p-4 sm:p-5 text-ink font-mono text-xs space-y-5">
      {/* Node Header & Online/Offline Control */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-xl tracking-wider uppercase text-ink">
              {selectedNode.callsign}
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                isOnline
                  ? 'border-signal text-signal bg-signal/10'
                  : 'border-severed text-mute bg-surface'
              }`}
            >
              {isOnline ? 'Online (Sim)' : 'Offline (Sim)'}
            </span>
          </div>
          <p className="text-[11px] text-mute uppercase tracking-wide">
            ROLE: {selectedNode.role.replace('_', ' ')} · ELEVATION: {selectedNode.elevationM}M ASL
          </p>
        </div>

        {/* Toggle Online/Offline Button */}
        <button
          onClick={handleToggle}
          className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center gap-1.5 border ${
            isOnline
              ? 'bg-surface border-line text-mute hover:border-caution hover:text-caution'
              : 'bg-signal border-signal text-deep-ground hover:bg-signal/90 shadow-glow-signal'
          }`}
          title="Toggle station offline/online to test topology healing"
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isOnline ? 'Take Offline' : 'Bring Online'}</span>
        </button>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="p-2.5 rounded bg-surface/60 border border-line/60">
          <span className="text-[10px] text-mute block">BATTERY CHARGE</span>
          <div className="flex items-center gap-2 mt-1">
            <Battery className="w-4 h-4 text-signal" />
            <span className="font-bold text-sm text-ink">{selectedNode.batteryPct}%</span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-surface/60 border border-line/60">
          <span className="text-[10px] text-mute block">ANTENNA MAST</span>
          <div className="flex items-center gap-2 mt-1">
            <Radio className="w-4 h-4 text-signal" />
            <span className="font-bold text-sm text-ink">{selectedNode.antennaHeightM} m</span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-surface/60 border border-line/60">
          <span className="text-[10px] text-mute block">TX POWER (EIRP)</span>
          <span className="font-bold text-sm text-ink block mt-1">
            {selectedNode.txPowerDbm} dBm (500mW)
          </span>
        </div>

        <div className="p-2.5 rounded bg-surface/60 border border-line/60">
          <span className="text-[10px] text-mute block">COORDINATES</span>
          <span className="font-bold text-[11px] text-ink block mt-1">
            {selectedNode.lat.toFixed(4)}°N, {selectedNode.lon.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Active Routing Path to Command */}
      <div className="p-3 rounded bg-surface/40 border border-line space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-mute flex items-center gap-1.5 font-bold uppercase">
            <GitFork className="w-3.5 h-3.5 text-signal" />
            Route to Base Command:
          </span>
          <span className={route.reachable ? 'text-signal font-bold' : 'text-caution font-bold'}>
            {route.reachable ? `${route.hops} Hops (${route.distanceKm} km)` : 'No Viable Path'}
          </span>
        </div>

        {route.reachable ? (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] pt-1">
            {route.path.map((nodeId, idx) => {
              const node = nodes.find(n => n.id === nodeId);
              return (
                <React.Fragment key={nodeId}>
                  <span className="px-2 py-0.5 rounded bg-deep-ground border border-line text-ink">
                    {node?.callsign}
                  </span>
                  {idx < route.path.length - 1 && <span className="text-signal">→</span>}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="text-[11px] text-caution flex items-center gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Transmissions will be held in local flash cache until a relay route opens.</span>
          </div>
        )}
      </div>

      {/* Immediate Neighbors */}
      <div>
        <span className="text-[11px] text-mute font-bold uppercase block mb-2">
          Direct Neighbors ({neighbors.length})
        </span>
        <div className="space-y-1.5">
          {neighbors.map(({ neighborId, link }) => {
            const neighbor = nodes.find(n => n.id === neighborId);
            const isLinkOnline = link.status === 'online';
            return (
              <div
                key={neighborId}
                className="flex items-center justify-between p-2 rounded bg-surface/50 border border-line text-xs"
              >
                <span className="font-bold text-ink">{neighbor?.callsign}</span>
                <div className="flex items-center gap-2">
                  <span className="text-mute">{link.distanceKm} km</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      isLinkOnline
                        ? 'border-signal text-signal bg-signal/10'
                        : 'border-severed text-mute'
                    }`}
                  >
                    {isLinkOnline ? 'LOS Clear' : 'Occluded'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Report Transmission Form */}
      <form onSubmit={handleSend} className="space-y-2.5 pt-3 border-t border-line">
        <div className="flex items-center justify-between">
          <label htmlFor="msg-input" className="text-[11px] font-bold text-signal uppercase flex items-center gap-1">
            <Send className="w-3.5 h-3.5" />
            Transmit Field Report
          </label>
          <div className="flex items-center gap-1 text-[10px]">
            {(['routine', 'urgent', 'alert'] as const).map(p => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`px-1.5 py-0.5 rounded uppercase border transition-all ${
                  priority === p
                    ? p === 'alert'
                      ? 'bg-caution text-deep-ground font-bold border-caution'
                      : 'bg-signal text-deep-ground font-bold border-signal'
                    : 'bg-surface text-mute border-line'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            id="msg-input"
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type situation update or GPS waypoint..."
            className="flex-1 bg-deep-ground border border-line rounded px-3 py-2 text-xs text-ink placeholder:text-mute/60 focus:border-signal outline-none"
          />
          <button
            type="submit"
            disabled={!isOnline}
            className={`px-4 py-2 rounded font-bold uppercase text-xs flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-signal text-deep-ground hover:bg-signal/90 shadow-glow-signal'
                : 'bg-surface text-mute border border-line cursor-not-allowed'
            }`}
          >
            <span>Send</span>
          </button>
        </div>
        {!isOnline && (
          <span className="text-[10px] text-caution block">
            Station is powered off. Turn station online to originate transmissions.
          </span>
        )}
      </form>
    </div>
  );
}
