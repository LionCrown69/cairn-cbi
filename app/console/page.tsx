'use client';

import React, { useState, useEffect } from 'react';
import ConsoleMap from '@/components/ConsoleMap';
import MapboxTerrainView from '@/components/MapboxTerrainView';
import NodeControlPanel from '@/components/NodeControlPanel';
import TerrainProfileView from '@/components/TerrainProfileView';
import MessageQueuePanel from '@/components/MessageQueuePanel';
import AIDigestPanel from '@/components/AIDigestPanel';
import ExplodedLayersLegend from '@/components/ExplodedLayersLegend';
import { useMeshStore } from '@/lib/store';
import {
  Map as MapIcon,
  MessageSquare,
  Users,
  Sparkles,
  GitFork,
  Layers,
  Settings,
  Search,
  Crosshair,
  Clock,
  CloudSun,
  ShieldAlert,
  ArrowRight,
  Send,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function ConsolePage() {
  const { nodes, messages, selectedNodeId, selectNode, links } = useMeshStore();

  // Navigation & Views
  const [activeRailTab, setActiveRailTab] = useState<'map' | 'messages' | 'team' | 'ai' | 'routes' | 'layers' | 'settings'>('map');
  const [mapEngine, setMapEngine] = useState<'mapbox' | 'vector'>('vector');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState<'messages' | 'team' | 'route' | 'notes'>('messages');

  // Layer filter states
  const [layerFilters, setLayerFilters] = useState({
    terrain: true,
    satellite: false,
    routes: true,
    weather: false,
    risk: true,
  });

  // Dynamic Live Clock
  const [timeStr, setTimeStr] = useState('12:46:32');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = nodes.filter(n => n.status === 'online').length;
  const queuedCount = messages.filter(m => m.status === 'queued').length;
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Filter nodes based on search query
  const filteredNodes = nodes.filter(n =>
    n.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#080B06] text-ink min-h-[calc(100vh-3.5rem)] font-sans antialiased overflow-hidden">
      {/* 1. LEFT NAVIGATION RAIL (Matching Reference Mockup) */}
      <aside className="w-full lg:w-56 bg-[#0B0F08] border-r border-white/[0.06] flex flex-col justify-between shrink-0 font-mono text-xs z-30">
        <div>
          {/* Rail Brand */}
          <div className="p-4 border-b border-white/[0.06] flex items-center gap-2.5">
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                <path d="M10 5a9 9 0 0 1 12 0" stroke="#D4F53C" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M13 8a5 5 0 0 1 6 0" stroke="#D4F53C" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="16" cy="13.5" rx="4" ry="2.2" fill="#D4F53C" />
                <circle cx="16" cy="13.5" r="1" fill="#0E120A" />
                <ellipse cx="16" cy="19.5" rx="6.5" ry="3.2" fill="#8E9B70" />
                <ellipse cx="16" cy="25.5" rx="9" ry="3.8" fill="#3A4030" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wider text-ink leading-tight">CAIRN</span>
              <span className="text-[9px] uppercase tracking-widest text-signal/80 leading-none">Console OS</span>
            </div>
          </div>

          {/* Nav Rail Menu Items */}
          <nav className="p-2 space-y-1">
            {[
              { id: 'map', label: 'Map', icon: MapIcon },
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: queuedCount > 0 ? queuedCount : undefined },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'ai', label: 'Intelligence', icon: Sparkles, highlight: true },
              { id: 'routes', label: 'Routes', icon: GitFork },
              { id: 'layers', label: 'Data Layers', icon: Layers },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeRailTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveRailTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-[#1C2415] text-signal font-bold border border-signal/30'
                      : 'text-ink/70 hover:text-ink hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-signal' : 'text-mute'}`} />
                    <span className="text-xs tracking-wide">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full bg-caution text-deep-ground font-mono text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Rail: MESH STATUS & RF Waveform Spectrum */}
        <div className="p-4 border-t border-white/[0.06] bg-black/20 space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-mute">
            <span className="font-bold">Mesh Status</span>
            <span className="text-signal">{onlineCount}/{nodes.length} Nodes</span>
          </div>

          {/* Animated RF Audio Waveform Spectrum */}
          <div className="flex items-center gap-1 h-5 pt-1">
            {[40, 75, 55, 90, 60, 85, 45, 100, 70, 50, 80, 65, 95, 40].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-signal/60 transition-all duration-300"
                style={{
                  height: `${Math.max(20, (h * (onlineCount / nodes.length)))}%`,
                  animation: `pulse 1.4s ease-in-out infinite ${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="text-[9px] text-mute/60 block pt-0.5">915 MHz · 250 kbps nominal</span>
        </div>
      </aside>

      {/* 2. MAIN CONSOLE WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Control Bar: Search + Layer Filters + Live Clock + Profile */}
        <header className="px-4 py-3 bg-[#0B0F08]/90 border-b border-white/[0.06] backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0 z-20">
          {/* Search Location, Node or Message */}
          <div className="flex items-center gap-2 bg-surface/50 border border-white/[0.08] rounded-full px-3 py-1.5 w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-mute" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search location, node or message..."
              className="bg-transparent border-none outline-none text-xs text-ink placeholder:text-mute/60 w-full"
            />
          </div>

          {/* Tactical Layer Filters (Matching Reference Image) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setLayerFilters(p => ({ ...p, terrain: !p.terrain }))}
              className={`px-3 py-1 rounded-full border transition-all ${
                layerFilters.terrain
                  ? 'bg-signal/15 text-signal border-signal/40 font-bold'
                  : 'bg-surface/40 text-mute border-white/10 hover:text-ink'
              }`}
            >
              + Terrain
            </button>
            <button
              onClick={() => setMapEngine(mapEngine === 'mapbox' ? 'vector' : 'mapbox')}
              className={`px-3 py-1 rounded-full border transition-all ${
                mapEngine === 'mapbox'
                  ? 'bg-signal/15 text-signal border-signal/40 font-bold'
                  : 'bg-surface/40 text-mute border-white/10 hover:text-ink'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setLayerFilters(p => ({ ...p, routes: !p.routes }))}
              className={`px-3 py-1 rounded-full border transition-all ${
                layerFilters.routes
                  ? 'bg-signal/15 text-signal border-signal/40 font-bold'
                  : 'bg-surface/40 text-mute border-white/10 hover:text-ink'
              }`}
            >
              Routes
            </button>
            <button
              onClick={() => setLayerFilters(p => ({ ...p, weather: !p.weather }))}
              className={`px-3 py-1 rounded-full border transition-all ${
                layerFilters.weather
                  ? 'bg-signal/15 text-signal border-signal/40 font-bold'
                  : 'bg-surface/40 text-mute border-white/10 hover:text-ink'
              }`}
            >
              Weather
            </button>
            <button
              onClick={() => setLayerFilters(p => ({ ...p, risk: !p.risk }))}
              className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                layerFilters.risk
                  ? 'bg-severed/20 text-severed border-severed/50 font-bold'
                  : 'bg-surface/40 text-mute border-white/10 hover:text-ink'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-severed" />
              <span>Risk Shadow</span>
            </button>
          </div>

          {/* Clock & Profile Badge */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <div className="flex items-center gap-1.5 text-mute font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-signal/80" />
              <span className="font-bold text-ink">{timeStr}</span>
              <span className="text-[10px] text-mute uppercase">LOCAL TIME</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="text-xs font-bold text-ink">Field Team Alpha</span>
            </div>
          </div>
        </header>

        {/* Console Body: Main Canvas (Left 8-col) + Detail Panels (Right 4-col) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Visual Display (8 Cols) */}
          <div className="xl:col-span-8 space-y-6">
            {activeRailTab === 'ai' ? (
              <AIDigestPanel />
            ) : activeRailTab === 'messages' ? (
              <MessageQueuePanel />
            ) : activeRailTab === 'routes' ? (
              <TerrainProfileView />
            ) : activeRailTab === 'layers' ? (
              <ExplodedLayersLegend />
            ) : activeRailTab === 'settings' ? (
              <div className="cairn-glass rounded-2xl p-6 space-y-4 font-mono text-xs">
                <h3 className="font-bold text-lg text-ink uppercase flex items-center gap-2">
                  <Settings className="w-5 h-5 text-signal" />
                  Tactical AI Engine & Station Settings
                </h3>
                <p className="text-mute font-sans leading-relaxed">
                  Configure live cloud Google Gemini API keys or utilize the local onboard tactical reasoning neural model.
                </p>
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] text-mute uppercase tracking-wider block">Google Gemini API Key (Optional Cloud LLM)</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    className="w-full p-2.5 rounded-xl bg-surface/50 border border-white/10 text-ink focus:border-signal outline-none"
                    onChange={e => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('cairn_gemini_key', e.target.value);
                      }
                    }}
                  />
                  <span className="text-[10px] text-mute block">Key is cached securely in your local browser storage for client-side API requests.</span>
                </div>
              </div>
            ) : (
              <>
                {/* 3D Mapbox or Vector Tactical Map */}
                {mapEngine === 'mapbox' ? <MapboxTerrainView /> : <ConsoleMap />}

                {/* Sub-Panel: Terrain Elevation Profile */}
                <TerrainProfileView />
              </>
            )}
          </div>

          {/* Right Inspector & Auxiliary Tactical Panels (4 Cols) */}
          <div className="xl:col-span-4 space-y-5">
            {/* 1. NODE DETAIL CARD (Exact Match to Mockup) */}
            <div className="cairn-glass rounded-2xl p-5 border border-white/[0.08] space-y-4 font-mono text-xs">
              {/* Header with Cairn Icon & Status */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2.5">
                  {/* Cairn mini icon */}
                  <div className="w-5 h-5 rounded bg-signal/20 border border-signal/40 flex items-center justify-center text-signal text-xs">
                    ▲
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wider uppercase text-ink">
                      {selectedNode.callsign}
                    </h3>
                    <span className="text-[10px] text-mute uppercase">{selectedNode.role}</span>
                  </div>
                </div>

                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedNode.status === 'online'
                    ? 'bg-signal/20 text-signal border border-signal/30'
                    : 'bg-severed/20 text-severed border border-severed/40'
                }`}>
                  {selectedNode.status === 'online' ? 'ONLINE' : 'BLOCKED'}
                </div>
              </div>

              {/* 5-Metric Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-mute block uppercase tracking-wider">Elevation</span>
                  <span className="font-bold text-ink mt-0.5 block">{selectedNode.elevationM} m</span>
                </div>
                <div>
                  <span className="text-[10px] text-mute block uppercase tracking-wider">Link Strength</span>
                  <span className="font-bold text-signal mt-0.5 block">Good (-67 dBm)</span>
                </div>
                <div>
                  <span className="text-[10px] text-mute block uppercase tracking-wider">Battery</span>
                  <span className="font-bold text-ink mt-0.5 block">{selectedNode.batteryPct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-mute block uppercase tracking-wider">Last Seen</span>
                  <span className="font-bold text-ink mt-0.5 block">2 min ago</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-white/[0.04]">
                  <span className="text-[10px] text-mute block uppercase tracking-wider">Location</span>
                  <span className="font-bold text-ink mt-0.5 block">{selectedNode.lat.toFixed(4)}° N, {selectedNode.lon.toFixed(4)}° E</span>
                </div>
              </div>

              {/* Inspector Sub-Tabs: Messages (4) | Team (3) | Route | Notes */}
              <div className="flex items-center gap-1 border-b border-white/[0.06] pt-1">
                {[
                  { id: 'messages', label: `Messages (${messages.length})` },
                  { id: 'team', label: `Team (${nodes.length})` },
                  { id: 'route', label: 'Route' },
                  { id: 'notes', label: 'Notes' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSubTab(tab.id as any)}
                    className={`pb-2 px-2 text-[11px] uppercase tracking-wider transition-all border-b-2 ${
                      selectedSubTab === tab.id
                        ? 'border-signal text-signal font-bold'
                        : 'border-transparent text-mute hover:text-ink'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Live Messages List */}
              {selectedSubTab === 'messages' && (
                <div className="space-y-2 pt-1">
                  {[
                    { from: 'A1 → B2', text: 'Route update. New path suggested.', status: 'Delivered', color: 'text-signal' },
                    { from: 'A1 → C3', text: 'Terrain looks unstable across couloir.', status: 'Queued', color: 'text-caution' },
                    { from: 'A1 → Team', text: 'Advancing in 5. ETA 18 min.', status: 'Delivered', color: 'text-signal' },
                  ].map((msg, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-surface/30 border border-white/[0.04] space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-ink">{msg.from}</span>
                        <span className={`flex items-center gap-1 ${msg.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs text-mute font-sans">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* AI TACTICAL SUGGESTION CARD (Matching Reference Image) */}
              <div className="p-3.5 rounded-xl bg-signal/5 border border-signal/20 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-signal font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-signal" />
                    AI-generated, unverified
                  </span>
                  <button
                    onClick={() => setActiveRailTab('ai')}
                    className="p-1 rounded bg-signal/20 text-signal hover:bg-signal/30 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-ink/90 font-sans leading-relaxed">
                  Suggests alternate route via eastern ridge due to possible landslide risk.
                </p>
              </div>
            </div>

            {/* 2. WEATHER (SIMULATED) CARD */}
            <div className="cairn-glass rounded-2xl p-4 border border-white/[0.08] font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-mute border-b border-white/[0.06] pb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider">WEATHER (SIMULATED)</span>
                <CloudSun className="w-3.5 h-3.5 text-signal" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-ink block">-2°C</span>
                  <span className="text-[11px] text-mute">Partly Cloudy</span>
                </div>
                <div className="text-right space-y-0.5 text-[11px]">
                  <div><span className="text-mute">Wind:</span> <span className="text-ink font-semibold">12 km/h NW</span></div>
                  <div><span className="text-mute">Visibility:</span> <span className="text-signal font-semibold">Good</span></div>
                </div>
              </div>
            </div>

            {/* 3. RECENT ACTIVITY CARD */}
            <div className="cairn-glass rounded-2xl p-4 border border-white/[0.08] font-mono text-xs space-y-2.5">
              <span className="text-[10px] text-mute uppercase font-bold tracking-wider block border-b border-white/[0.06] pb-2">
                RECENT ACTIVITY
              </span>

              <div className="space-y-2">
                {[
                  { tag: 'B2', label: 'Queued', time: '4 min ago', dot: 'bg-caution' },
                  { tag: 'A1', label: 'Online', time: '6 min ago', dot: 'bg-signal' },
                  { tag: 'C3', label: 'Blocked', time: '12 min ago', dot: 'bg-severed' },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${act.dot}`} />
                      <span className="font-bold text-ink">{act.tag}</span>
                      <span className="text-mute">{act.label}</span>
                    </div>
                    <span className="text-[10px] text-mute/70">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
