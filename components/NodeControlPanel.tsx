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
    <div className="cairn-glass rounded-2xl p-5 text-ink font-mono text-xs space-y-5">
      {/* Node Header & Online/Offline Control */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-2xl tracking-wider uppercase text-ink">
              {selectedNode.callsign}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isOnline
                  ? 'bg-signal/15 text-signal'
                  : 'bg-white/10 text-mute'
              }`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-[11px] text-mute uppercase tracking-wide mt-0.5">
            {selectedNode.role.replace('_', ' ')} · {selectedNode.elevationM}m ASL
          </p>
        </div>

        {/* Toggle Online/Offline Button */}
        <button
          onClick={handleToggle}
          className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
            isOnline
              ? 'bg-surface/80 border border-white/10 text-mute hover:text-caution hover:border-caution/40'
              : 'bg-signal text-deep-ground font-bold shadow-glow-signal'
          }`}
          title="Toggle station offline/online"
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isOnline ? 'Take Offline' : 'Bring Online'}</span>
        </button>
      </div>

      {/* Clean Telemetry Matrix (borderless pairs) */}
      <div className="grid grid-cols-2 gap-4 py-1">
        <div>
          <span className="text-[10px] text-mute block tracking-wider uppercase">Battery</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Battery className="w-3.5 h-3.5 text-signal" />
            <span className="font-bold text-sm text-ink">{selectedNode.batteryPct}%</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-mute block tracking-wider uppercase">Antenna Mast</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Radio className="w-3.5 h-3.5 text-signal" />
            <span className="font-bold text-sm text-ink">{selectedNode.antennaHeightM}m</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-mute block tracking-wider uppercase">TX Power</span>
          <span className="font-bold text-sm text-ink block mt-0.5">
            {selectedNode.txPowerDbm} dBm
          </span>
        </div>

        <div>
          <span className="text-[10px] text-mute block tracking-wider uppercase">Coordinates</span>
          <span className="font-bold text-xs text-ink block mt-0.5">
            {selectedNode.lat.toFixed(3)}°N, {selectedNode.lon.toFixed(3)}°E
          </span>
        </div>
      </div>

      {/* Active Routing Path to Command */}
      <div className="pt-3 border-t border-white/[0.08] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-mute uppercase flex items-center gap-1.5">
            <GitFork className="w-3 h-3 text-signal" />
            Path to Command:
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
                  <span className="text-ink font-semibold">
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
            <span>Held in flash memory until next hop available.</span>
          </div>
        )}
      </div>

      {/* Immediate Neighbors */}
      <div className="pt-3 border-t border-white/[0.08]">
        <span className="text-[10px] text-mute font-bold tracking-wider uppercase block mb-2">
          Direct Links ({neighbors.length})
        </span>
        <div className="space-y-1">
          {neighbors.map(({ neighborId, link }) => {
            const neighbor = nodes.find(n => n.id === neighborId);
            const isLinkOnline = link.status === 'online';
            return (
              <div
                key={neighborId}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface/30 text-xs"
              >
                <span className="text-ink font-medium">{neighbor?.callsign}</span>
                <div className="flex items-center gap-3">
                  <span className="text-mute text-[11px]">{link.distanceKm} km</span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      isLinkOnline ? 'text-signal' : 'text-mute/60'
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
      <form onSubmit={handleSend} className="space-y-2.5 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <label htmlFor="msg-input" className="text-[11px] font-bold text-ink uppercase flex items-center gap-1.5">
            <Send className="w-3 h-3 text-signal" />
            Transmit Field Report
          </label>
          <div className="flex items-center gap-1">
            {(['routine', 'urgent', 'alert'] as const).map(p => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase transition-all ${
                  priority === p
                    ? p === 'alert'
                      ? 'bg-caution text-deep-ground font-bold'
                      : 'bg-signal text-deep-ground font-bold'
                    : 'text-mute hover:text-ink'
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
            placeholder="Type report..."
            className="flex-1 bg-surface/40 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-ink placeholder:text-mute/50 focus:border-signal outline-none"
          />
          <button
            type="submit"
            disabled={!isOnline}
            className={`px-4 py-1.5 rounded-full font-bold uppercase text-xs transition-all ${
              isOnline
                ? 'bg-signal text-deep-ground hover:bg-signal/90 shadow-glow-signal'
                : 'bg-surface text-mute cursor-not-allowed opacity-50'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
