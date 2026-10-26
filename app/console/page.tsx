// The one thing the user came to do: Monitor active alpine radio links and send a check-in packet across the mesh.
'use client';

import React, { useState } from 'react';
import ConsoleMap from '@/components/ConsoleMap';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { CapabilityBadge } from '@/components/ui/capability-badge';
import { LinkStrengthRing } from '@/components/ui/link-strength-ring';
import { MessageTrail } from '@/components/ui/message-trail';
import { IOSDropdown, DropdownItem } from '@/components/ui/ios-dropdown';
import { IOSSwitch } from '@/components/ui/ios-switch';
import {
  Map as MapIcon,
  Radio,
  Send,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Battery,
  Mountain,
  Wifi,
  Clock,
  ChevronDown,
} from 'lucide-react';

export default function ConsolePage() {
  const {
    nodes,
    messages,
    links,
    selectedNodeId,
    selectNode,
    toggleNodeStatus,
    sendMessage,
    getSelectedRoute,
  } = useMeshStore();

  // Floating Bar Navigation (Map / Nodes / Messages)
  const [activeTab, setActiveTab] = useState<'map' | 'nodes' | 'messages'>('map');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showLevel3Details, setShowLevel3Details] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'terrain' | 'rf'>('all');
  const [sendSuccessToast, setSendSuccessToast] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const selectedRoute = getSelectedRoute();
  const onlineCount = nodes.filter((n) => n.status === 'online').length;
  const queuedCount = messages.filter((m) => m.status === 'queued').length;
  const latestMessage = messages[messages.length - 1];

  // Primary Action: Send Check-in Packet from Field Team to Base
  const handleSendCheckin = () => {
    sound.playClick();
    sendMessage(
      selectedNode.id !== 'node-cmd' ? selectedNode.id : 'node-alpha',
      'node-cmd',
      `Routine check-in from ${selectedNode.callsign}. Team green. Telemetry nominal.`,
      'routine'
    );
    sound.playSuccess();
    setSendSuccessToast(true);
    setTimeout(() => setSendSuccessToast(false), 3500);
  };

  const handleTabChange = (val: 'map' | 'nodes' | 'messages') => {
    setActiveTab(val);
    if (val === 'nodes' || val === 'messages') {
      setSheetOpen(true);
    } else {
      setSheetOpen(false);
    }
  };

  const layerItems: DropdownItem<'all' | 'terrain' | 'rf'>[] = [
    { value: 'all', label: 'All Layers', description: 'Topography, radio rays, and contour bands' },
    { value: 'terrain', label: 'Terrain Contours', description: 'Digital elevation model lines only' },
    { value: 'rf', label: 'Line-of-Sight Rays', description: 'Active links and Fresnel clearances' },
  ];

  return (
    <div className="relative flex-1 w-full h-[calc(100vh-3.5rem)] bg-deep-ground overflow-hidden select-none">
      {/* 1. FULL-BLEED INTERACTIVE ALPINE MAP */}
      <div className="absolute inset-0 z-0">
        <ConsoleMap />
      </div>

      {/* 2. TOP FLOATING STATUS BAR & LAYER DROPDOWN (Minimal, Breathable) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Top-Left: AI SITREP Summary Card (Single Card with Tag) */}
        <div className="pointer-events-auto max-w-sm rounded-2xl bg-deep-ground/85 border border-white/[0.08] backdrop-blur-xl p-3 shadow-glass space-y-1.5 transition-all hover:border-white/[0.15]">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-signal">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-wider text-[11px]">Tactical SITREP</span>
            </div>
            <CapabilityBadge type="live" label="Live Gemini 2.5" />
          </div>
          <p className="text-xs font-sans text-ink/90 leading-relaxed">
            {onlineCount === nodes.length
              ? `All ${nodes.length} stations active. Full line-of-sight propagation confirmed across Valais ridges.`
              : `${onlineCount}/${nodes.length} stations online. Packets caching locally in store-and-forward buffers.`}
          </p>
        </div>

        {/* Top-Right: Accessible Layer Filter in ONE Dropdown */}
        <div className="pointer-events-auto flex items-center gap-2">
          <IOSDropdown
            triggerLabel={layerItems.find((l) => l.value === activeLayer)?.label || 'Layers'}
            triggerIcon={Layers}
            items={layerItems}
            selectedValue={activeLayer}
            onSelect={setActiveLayer}
          />
        </div>
      </div>

      {/* 3. SEND CHECK-IN CONFIRMATION TOAST */}
      {sendSuccessToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-full bg-surface/90 border border-signal/40 backdrop-blur-xl shadow-glow-signal text-xs font-mono text-signal flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-signal" />
          <span>Check-in transmitted across mesh &bull; Receipt confirmed</span>
        </div>
      )}

      {/* 4. FLOATING BOTTOM CONTROL BAR (iOS-Style: Segmented Control + 1 Primary Action) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4 pointer-events-auto">
        <div className="p-2 rounded-3xl bg-deep-ground/90 border border-white/[0.12] backdrop-blur-2xl shadow-2xl flex items-center justify-between gap-3">
          {/* Segmented Control for Views */}
          <SegmentedControl
            value={activeTab}
            onChange={handleTabChange}
            options={[
              { value: 'map', label: 'Map', icon: MapIcon },
              { value: 'nodes', label: 'Stations', icon: Radio, badge: onlineCount },
              {
                value: 'messages',
                label: 'Queue',
                icon: Send,
                badge: queuedCount > 0 ? `${queuedCount} Q` : undefined,
              },
            ]}
          />

          {/* Exactly ONE Primary Action Button */}
          <button
            onClick={handleSendCheckin}
            className="px-5 py-2.5 rounded-2xl bg-signal hover:bg-signal/90 text-deep-ground font-sans font-bold text-xs uppercase tracking-wider shadow-glow-signal active:scale-[0.97] transition-all flex items-center gap-2 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Check-in</span>
          </button>
        </div>
      </div>

      {/* 5. BOTTOM SHEET: iOS Progressive Disclosure (Level 1, 2, and 3 Details) */}
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={activeTab === 'nodes' ? 'Alpine Station Fleet' : 'Store-and-Forward Queue'}
        description={
          activeTab === 'nodes'
            ? 'Select a transceiver station to verify line-of-sight clearance and peer hops.'
            : 'Packets waiting for ridge crest relays to establish line-of-sight.'
        }
      >
        {activeTab === 'nodes' ? (
          <div className="space-y-6">
            {/* Level 1: Unique Element 2 — Link-Strength Ring for Focused Station */}
            <LinkStrengthRing
              canReachCommand={selectedRoute.reachable}
              hopCount={selectedRoute.hops}
              qualityPct={selectedNode.status === 'online' ? 94 : 0}
              callsign={selectedNode.callsign}
            />

            {/* Level 2: Grouped Inset List of Alpine Stations */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-mute uppercase tracking-wider block">
                Active Stations (Tap to Focus):
              </span>

              <div className="rounded-2xl bg-surface/50 border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
                {nodes.map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  const isOnline = node.status === 'online';

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        sound.playClick();
                        selectNode(node.id);
                      }}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-signal/10 border-l-4 border-signal'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-ink">{node.callsign}</span>
                          <CapabilityBadge
                            type={isOnline ? 'live' : 'estimate'}
                            label={isOnline ? 'Online' : 'Severed'}
                          />
                        </div>
                        <p className="text-[11px] text-mute font-sans">
                          {Math.round(node.elevationM)}m ASL &bull; Battery {node.batteryPct}% &bull; Role: {node.role}
                        </p>
                      </div>

                      {/* Station Switch Toggle (iOS style) */}
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IOSSwitch
                          checked={isOnline}
                          onCheckedChange={() => {
                            toggleNodeStatus(node.id);
                            if (isOnline) sound.playAlert();
                            else sound.playSuccess();
                          }}
                          ariaLabel={`Toggle ${node.callsign} status`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level 3: "Details" Disclosure (Raw Numbers & Physics) */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowLevel3Details(!showLevel3Details);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface/40 hover:bg-surface/70 text-xs font-mono text-mute transition-colors"
              >
                <span>Level 3: Technical Telemetry & Model Details</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showLevel3Details ? 'rotate-180 text-signal' : ''
                  }`}
                />
              </button>

              {showLevel3Details && (
                <div className="mt-3 p-4 rounded-2xl bg-surface/30 border border-white/[0.06] space-y-3 text-xs font-mono animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3 text-mute">
                    <div>Transmitter Power: <strong className="text-ink">{selectedNode.txPowerDbm} dBm</strong></div>
                    <div>Antenna Mast: <strong className="text-ink">{selectedNode.antennaHeightM} m</strong></div>
                    <div>Latitude: <strong className="text-ink">{selectedNode.lat.toFixed(4)}° N</strong></div>
                    <div>Longitude: <strong className="text-ink">{selectedNode.lon.toFixed(4)}° E</strong></div>
                    <div>Route Length: <strong className="text-ink">{selectedRoute.hops} hops</strong></div>
                    <div>Data Provenance: <strong className="text-signal">Observed Field Node</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Level 1: Unique Element 3 — Message Trail Line */}
            {latestMessage && (
              <MessageTrail
                status={latestMessage.status}
                senderCallsign={
                  nodes.find((n) => n.id === latestMessage.fromId)?.callsign || latestMessage.fromId
                }
                hops={latestMessage.hops || []}
                recipientCallsign={
                  nodes.find((n) => n.id === latestMessage.toId)?.callsign || latestMessage.toId
                }
              />
            )}

            {/* Grouped Inset List of Transmissions */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-mute uppercase tracking-wider block">
                Queued & Delivered Packets:
              </span>

              <div className="rounded-2xl bg-surface/50 border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
                {messages.map((msg) => {
                  const isDelivered = msg.status === 'delivered';
                  const sender = nodes.find((n) => n.id === msg.fromId);
                  const recipient = nodes.find((n) => n.id === msg.toId);

                  return (
                    <div key={msg.id} className="p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-ink">
                          {sender?.callsign || msg.fromId} &rarr; {recipient?.callsign || msg.toId}
                        </span>
                        <CapabilityBadge
                          type={isDelivered ? 'live' : 'estimate'}
                          label={isDelivered ? 'Delivered' : 'Queued in Flash'}
                        />
                      </div>
                      <p className="text-xs text-mute font-sans leading-relaxed">{msg.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
