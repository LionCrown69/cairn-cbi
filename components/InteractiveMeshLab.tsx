'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  Mountain,
  GitFork,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  Zap,
  Activity,
  RefreshCw,
} from 'lucide-react';

export default function InteractiveMeshLab() {
  const [activeTab, setActiveTab] = useState<'occlusion' | 'store-fwd' | 'fleet'>('occlusion');
  const [detourActive, setDetourActive] = useState(false);
  const [fresnelVisible, setFresnelVisible] = useState(true);

  // Store-and-Forward simulation state
  const [packetState, setPacketState] = useState<'idle' | 'buffering' | 'relaying' | 'delivered'>('idle');
  const [simMessage, setSimMessage] = useState('PATROL-ALPHA // Avalanche debris across Glacier Couloir; holding at 1,951m.');
  const [packetLog, setPacketLog] = useState<string[]>([
    'Station ready: Flash memory buffer nominal (512 KB non-volatile).',
  ]);

  const runSimulation = () => {
    if (packetState !== 'idle') return;
    setPacketState('buffering');
    setPacketLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Direct LOS to Base blocked (-925.7m). Enqueueing payload in local flash memory...`,
    ]);

    setTimeout(() => {
      setPacketState('relaying');
      setPacketLog(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Peer detected: RELAY-SADDLE-WEST (2,680m). Autonomous opportunistic burst transfer over 915 MHz...`,
      ]);

      setTimeout(() => {
        setPacketState('delivered');
        setPacketLog(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] BASE-COMMAND (2,823m) ACK received. 0 packets dropped. End-to-end delivery verified.`,
        ]);
      }, 1800);
    }, 1800);
  };

  const resetSimulation = () => {
    setPacketState('idle');
    setPacketLog(['Station ready: Flash memory buffer nominal (512 KB non-volatile).']);
  };

  return (
    <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]" id="mesh-lab">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs font-sans font-semibold uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span>Interactive Mountain Sandbox</span>
          </div>
          <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink">
            See how mountain signals travel.
          </h2>
          <p className="text-sm sm:text-base text-mute font-sans font-light max-w-xl mt-2 leading-relaxed">
            Cellular and direct radio waves travel in straight lines, but alpine terrain doesn&apos;t. Test how a 3,000m ridge blocks direct signals, and how Cairn&apos;s autonomous relays route around obstacles in real time.
          </p>
        </div>

        {/* Tab Controls (21st.dev style segmented pill) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface/80 border border-white/[0.08] backdrop-blur-md self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('occlusion')}
            className={`px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-2 ${
              activeTab === 'occlusion'
                ? 'bg-signal text-deep-ground font-semibold shadow-sm'
                : 'text-mute hover:text-ink hover:bg-white/[0.04]'
            }`}
          >
            <Mountain className="w-4 h-4" />
            <span>Terrain Raycast</span>
          </button>

          <button
            onClick={() => setActiveTab('store-fwd')}
            className={`px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-2 ${
              activeTab === 'store-fwd'
                ? 'bg-signal text-deep-ground font-semibold shadow-sm'
                : 'text-mute hover:text-ink hover:bg-white/[0.04]'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Store & Forward</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-2 ${
              activeTab === 'fleet'
                ? 'bg-signal text-deep-ground font-semibold shadow-sm'
                : 'text-mute hover:text-ink hover:bg-white/[0.04]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Team Status</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TERRAIN RAYCAST & OCCLUSION LAB */}
      {activeTab === 'occlusion' && (
        <div className="space-y-6">
          {/* Main Raycast Visualizer Glass Card */}
          <div className="cairn-glass rounded-2xl border border-white/[0.08] p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-caution animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Path Profile: PATROL-ALPHA (1,951m) ↔ BASE-COMMAND (2,823m)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFresnelVisible(!fresnelVisible)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                    fresnelVisible
                      ? 'bg-signal/10 border-signal/30 text-signal font-bold'
                      : 'border-white/10 text-mute hover:text-ink'
                  }`}
                >
                  60% Fresnel Zone: {fresnelVisible ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setDetourActive(!detourActive)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    detourActive
                      ? 'bg-signal text-deep-ground font-bold shadow-sm'
                      : 'bg-surface/80 border border-white/10 text-ink hover:border-signal/40'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>{detourActive ? 'Detour Active (via Saddle)' : 'Enable Saddle Detour'}</span>
                </button>
              </div>
            </div>

            {/* SVG Terrain Elevation Cross-Section */}
            <div className="relative w-full h-64 sm:h-72 bg-deep-ground/80 rounded-xl overflow-hidden border border-white/[0.04]">
              {/* Background Elevation Reference Grid */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20 font-mono text-[9px] text-mute">
                <div className="border-b border-white/20 pb-1">3,200m Peak Horizon</div>
                <div className="border-b border-white/20 pb-1">2,800m Ridge Line</div>
                <div className="border-b border-white/20 pb-1">2,400m Pass</div>
                <div className="border-b border-white/20 pb-1">2,000m Valley Floor</div>
              </div>

              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                <defs>
                  {/* Granite Mountain Gradient */}
                  <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3A4030" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#1B1F16" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0E120A" stopOpacity="1" />
                  </linearGradient>

                  {/* Fresnel Ellipsoid Gradient */}
                  <radialGradient id="fresnelGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Terrain Solid Fill */}
                <path
                  d="M 0 300 L 0 250 Q 80 240 140 250 Q 240 260 300 200 Q 360 140 430 80 Q 480 35 520 85 Q 580 160 650 170 Q 720 180 800 130 L 800 300 Z"
                  fill="url(#terrainGrad)"
                />

                {/* Terrain Ridge Outline */}
                <path
                  d="M 0 250 Q 80 240 140 250 Q 240 260 300 200 Q 360 140 430 80 Q 480 35 520 85 Q 580 160 650 170 Q 720 180 800 130"
                  fill="none"
                  stroke="#8E9B70"
                  strokeWidth="2.5"
                />

                {/* 60% Fresnel Zone Ellipsoid (Occluded by Ridge) */}
                {fresnelVisible && !detourActive && (
                  <ellipse
                    cx="440"
                    cy="185"
                    rx="320"
                    ry="45"
                    transform="rotate(-10 440 185)"
                    fill="url(#fresnelGrad)"
                    stroke="#FF8A3D"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                )}

                {/* DIRECT RAY (Base to Patrol) - SEVERED */}
                {!detourActive && (
                  <>
                    {/* Critical Red RF Signal Lost Filling Zone behind Mountain Crest */}
                    <path
                      d="M 120 248 L 480 35 L 430 80 Q 360 140 300 200 Q 240 260 140 250 Z"
                      fill="rgba(239, 68, 68, 0.25)"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />

                    <g transform="translate(240, 235)">
                      <rect x="-70" y="-13" width="140" height="26" rx="5" fill="#1F0707" stroke="#EF4444" strokeWidth="1" />
                      <circle cx="-55" cy="0" r="3" fill="#EF4444" className="animate-ping" />
                      <text x="4" y="3" textAnchor="middle" fill="#FCA5A5" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                        SIGNAL LOST // RF SHADOW
                      </text>
                    </g>

                    <line
                      x1="120"
                      y1="248"
                      x2="760"
                      y2="132"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />

                    {/* Occlusion Warning Callout */}
                    <g transform="translate(480, 45)">
                      <circle cx="0" cy="0" r="14" fill="#EF4444" fillOpacity="0.25" />
                      <circle cx="0" cy="0" r="5" fill="#EF4444" />
                      <rect x="-85" y="-38" width="170" height="26" rx="6" fill="#1B1F16" stroke="#EF4444" strokeWidth="1.2" />
                      <text x="0" y="-22" textAnchor="middle" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        RIDGE OCCLUSION (-925.7m)
                      </text>
                    </g>
                  </>
                )}

                {/* DETOUR VIA SADDLE RELAY - ACTIVE (2 HOPS) */}
                {detourActive && (
                  <>
                    {/* Hop 1: Patrol-Alpha to Saddle Relay */}
                    <line
                      x1="120"
                      y1="248"
                      x2="350"
                      y2="75"
                      stroke="#D4F53C"
                      strokeWidth="3"
                    />

                    {/* Hop 2: Saddle Relay to Base-Command */}
                    <line
                      x1="350"
                      y1="75"
                      x2="760"
                      y2="132"
                      stroke="#D4F53C"
                      strokeWidth="3"
                    />

                    {/* Saddle Relay Node Pin */}
                    <g transform="translate(350, 75)">
                      <circle cx="0" cy="0" r="16" fill="#D4F53C" fillOpacity="0.25" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#D4F53C" />
                      <rect x="-70" y="-34" width="140" height="24" rx="5" fill="#1B1F16" stroke="#D4F53C" strokeWidth="1" />
                      <text x="0" y="-18" textAnchor="middle" fill="#D4F53C" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        RELAY-SADDLE-WEST
                      </text>
                    </g>
                  </>
                )}

                {/* Node Pin 1: PATROL-ALPHA */}
                <g transform="translate(120, 248)">
                  <circle cx="0" cy="0" r="6" fill={detourActive ? '#D4F53C' : '#FF8A3D'} />
                  <rect x="-55" y="14" width="110" height="22" rx="4" fill="#0E120A" stroke="#ffffff" strokeOpacity="0.15" />
                  <text x="0" y="29" textAnchor="middle" fill="#F1F0EA" fontSize="9" fontFamily="monospace">
                    PATROL-ALPHA (1,951m)
                  </text>
                </g>

                {/* Node Pin 2: BASE-COMMAND */}
                <g transform="translate(760, 132)">
                  <circle cx="0" cy="0" r="7" fill="#D4F53C" />
                  <rect x="-60" y="14" width="120" height="22" rx="4" fill="#0E120A" stroke="#ffffff" strokeOpacity="0.15" />
                  <text x="0" y="29" textAnchor="middle" fill="#F1F0EA" fontSize="9" fontFamily="monospace">
                    BASE-COMMAND (2,823m)
                  </text>
                </g>
              </svg>
            </div>

            {/* Simple, Digestible Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-surface/40 border border-white/[0.06] space-y-1">
                <span className="text-[11px] text-mute font-sans block">Distance</span>
                <span className="text-sm font-sans font-bold text-ink">12.3 km valley span</span>
                <span className="text-[10px] text-mute/70 block">Between Patrol and Base</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/40 border border-white/[0.06] space-y-1">
                <span className="text-[11px] text-mute font-sans block">Mountain Clearance</span>
                <span className={`text-sm font-sans font-bold ${detourActive ? 'text-signal' : 'text-caution'}`}>
                  {detourActive ? '+180m clear sky line' : 'Blocked by 925m ridge'}
                </span>
                <span className="text-[10px] text-mute/70 block">{detourActive ? 'Line-of-sight confirmed' : 'No line of sight'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/40 border border-white/[0.06] space-y-1">
                <span className="text-[11px] text-mute font-sans block">Signal Path</span>
                <span className="text-sm font-sans font-bold text-ink">
                  {detourActive ? '2 Hops (via Saddle Relay)' : 'Direct Ray (Blocked)'}
                </span>
                <span className="text-[10px] text-mute/70 block">{detourActive ? 'Autonomous peer routing' : 'Straight line hits rock'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/40 border border-white/[0.06] space-y-1">
                <span className="text-[11px] text-mute font-sans block">Message Outcome</span>
                <span className={`text-sm font-sans font-bold flex items-center gap-1.5 ${detourActive ? 'text-signal' : 'text-caution'}`}>
                  {detourActive ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered to Base</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Saved in Device Memory</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] text-mute/70 block">{detourActive ? '0 dropped packets' : 'Waiting for relay beacon'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORE-AND-FORWARD DISPATCHER SANDBOX */}
      {activeTab === 'store-fwd' && (
        <div className="cairn-glass rounded-2xl border border-white/[0.08] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <span className="font-sans text-sm font-bold text-ink block">
                Test Sending a Message (Store-and-Forward)
              </span>
              <span className="text-xs text-mute font-sans font-light">
                When you have zero cell service behind a mountain, your message is never lost. It stays safely saved in local memory until a peer relay comes within range.
              </span>
            </div>

            <button
              onClick={resetSimulation}
              className="px-3 py-1.5 rounded-lg text-xs font-sans border border-white/10 text-mute hover:text-ink hover:bg-white/[0.04] flex items-center gap-1.5 self-start transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Test</span>
            </button>
          </div>

          {/* Interactive Message Dispatch Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-medium text-mute block">
                  Your Test Message:
                </label>
                <textarea
                  value={simMessage}
                  onChange={e => setSimMessage(e.target.value)}
                  disabled={packetState !== 'idle'}
                  rows={3}
                  className="w-full bg-deep-ground/90 border border-white/[0.1] rounded-xl p-3 text-xs font-sans text-ink focus:outline-none focus:border-signal/50 resize-none"
                />
              </div>

              <button
                onClick={runSimulation}
                disabled={packetState !== 'idle' || !simMessage.trim()}
                className={`w-full py-3 rounded-xl font-sans text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
                  packetState === 'idle'
                    ? 'bg-signal text-deep-ground hover:bg-signal/90 shadow-glow-signal'
                    : 'bg-surface border border-white/10 text-mute cursor-not-allowed'
                }`}
              >
                {packetState === 'idle' && (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Alpine Dispatch</span>
                  </>
                )}
                {packetState === 'buffering' && (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-caution" />
                    <span>Saving to Local Memory...</span>
                  </>
                )}
                {packetState === 'relaying' && (
                  <>
                    <Zap className="w-4 h-4 animate-pulse text-signal" />
                    <span>Hopping Across Ridge Relay...</span>
                  </>
                )}
                {packetState === 'delivered' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-signal" />
                    <span>Delivered to Base (0 Dropped)</span>
                  </>
                )}
              </button>

              {/* Physical Memory Spec */}
              <div className="p-3.5 rounded-xl bg-surface/30 border border-white/[0.06] space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-mute">
                  <span>Local Storage:</span>
                  <span className="text-ink font-medium">Non-volatile Flash</span>
                </div>
                <div className="flex justify-between text-mute">
                  <span>Retention:</span>
                  <span className="text-ink font-medium">72 Hours without power</span>
                </div>
                <div className="flex justify-between text-mute">
                  <span>Verification:</span>
                  <span className="text-signal font-semibold">100% Cryptographic ACK</span>
                </div>
              </div>
            </div>

            {/* Live Packet Transit Terminal */}
            <div className="md:col-span-2 bg-deep-ground/95 border border-white/[0.08] rounded-xl p-4 font-mono text-xs space-y-3 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[10px] text-mute uppercase">
                  <span>Mesh Hop Execution Stream</span>
                  <span className="text-signal font-bold">DTN PROTOCOL V2</span>
                </div>

                <div className="space-y-2">
                  {packetLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-ink/90 animate-fadeIn">
                      <span className="text-signal">›</span>
                      <span className="leading-relaxed">{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Transit Progress Bar */}
              <div className="pt-4 border-t border-white/[0.06] space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-mute uppercase">
                  <span>Patrol Flash</span>
                  <span>Saddle Relay</span>
                  <span>Base Command</span>
                </div>

                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-signal transition-all duration-700 ease-out"
                    style={{
                      width:
                        packetState === 'idle'
                          ? '0%'
                          : packetState === 'buffering'
                          ? '33%'
                          : packetState === 'relaying'
                          ? '66%'
                          : '100%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLEET TELEMETRY MATRIX */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              callsign: 'BASE-COMMAND',
              role: 'Central Command Station',
              elev: '2,823m ASL',
              battery: 98,
              power: '27 dBm (500mW)',
              status: 'online',
              note: 'High-gain omni array. Monitoring all 5 field outposts.',
            },
            {
              callsign: 'PATROL-ALPHA',
              role: 'Valley Reconnaissance Team',
              elev: '1,951m ASL',
              battery: 68,
              power: '20 dBm (100mW)',
              status: 'online',
              note: 'Occluded by North Ridge. Flash buffer actively caching telemetry.',
            },
            {
              callsign: 'PATROL-BRAVO',
              role: 'Eastern Ridge Survey',
              elev: '2,104m ASL',
              battery: 88,
              power: '20 dBm (100mW)',
              status: 'online',
              note: 'Direct line of sight to Base. Link margin +14.2 dB nominal.',
            },
            {
              callsign: 'RELAY-RIDGE-NORTH',
              role: 'Solar Autonomous Relay',
              elev: '2,840m ASL',
              battery: 84,
              power: '24 dBm (250mW)',
              status: 'online',
              note: 'Solar trickle charging nominal (+0.8W). Cresting northern cirque.',
            },
            {
              callsign: 'RELAY-SADDLE-WEST',
              role: 'Col Mobile Beacon Relay',
              elev: '2,680m ASL',
              battery: 79,
              power: '24 dBm (250mW)',
              status: 'online',
              note: 'Primary detour node bridging valley patrol to central command.',
            },
            {
              callsign: 'SENSOR-COL',
              role: 'Automated Weather & Seismic',
              elev: '3,040m ASL',
              battery: 91,
              power: '14 dBm (25mW)',
              status: 'online',
              note: 'Transmitting barometric pressure & wind gusts every 90 seconds.',
            },
          ].map((node, i) => (
            <div
              key={i}
              className="cairn-glass rounded-2xl border border-white/[0.08] p-5 space-y-3.5 hover:border-signal/30 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <span className="font-sans text-sm font-bold text-ink block">{node.callsign}</span>
                  <span className="text-xs text-mute font-sans">{node.role}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-signal/10 border border-signal/20 text-xs text-signal font-sans font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                  <span>Online</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div>
                  <span className="text-[11px] text-mute block">Elevation</span>
                  <span className="font-semibold text-ink">{node.elev}</span>
                </div>
                <div>
                  <span className="text-[11px] text-mute block">Battery</span>
                  <span className={`font-semibold ${node.battery < 70 ? 'text-caution' : 'text-signal'}`}>
                    {node.battery}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-mute font-sans leading-relaxed pt-2 border-t border-white/[0.04]">
                {node.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Direct Transition to Field Console */}
      <div className="mt-8 flex items-center justify-between p-5 rounded-2xl bg-surface/30 border border-white/[0.06] flex-wrap gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-signal shrink-0" />
          <span className="text-xs sm:text-sm text-ink/90 font-sans">
            Need live 3D terrain slicing, real-time message feeds, and interactive radio links?
          </span>
        </div>

        <Link
          href="/console"
          className="px-5 py-2.5 rounded-full bg-signal text-deep-ground font-sans font-semibold text-xs tracking-wide hover:bg-signal/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Open Field Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
