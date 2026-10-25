'use client';

import React, { useState } from 'react';
import ConsoleMap from '@/components/ConsoleMap';
import MapboxTerrainView from '@/components/MapboxTerrainView';
import NodeControlPanel from '@/components/NodeControlPanel';
import TerrainProfileView from '@/components/TerrainProfileView';
import MessageQueuePanel from '@/components/MessageQueuePanel';
import AIDigestPanel from '@/components/AIDigestPanel';
import ExplodedLayersLegend from '@/components/ExplodedLayersLegend';
import { useMeshStore } from '@/lib/store';
import { Compass, Layers, ShieldCheck, Activity, Mountain, Archive, Sparkles, Globe, Map } from 'lucide-react';

export default function ConsolePage() {
  const { nodes, messages } = useMeshStore();
  const [activeTab, setActiveTab] = useState<'control' | 'profile' | 'queue' | 'ai' | 'layers'>('control');
  const [mapEngine, setMapEngine] = useState<'mapbox' | 'vector'>('mapbox');

  const onlineCount = nodes.filter(n => n.status === 'online').length;
  const queuedCount = messages.filter(m => m.status === 'queued').length;

  return (
    <div className="flex-1 flex flex-col bg-deep-ground p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Console Top Breadcrumb & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface border border-signal flex items-center justify-center text-signal">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl uppercase tracking-wider text-ink">
              CAIRN FIELD CONSOLE
            </h1>
            <p className="text-[11px] text-mute uppercase">
              SECTOR 04 · VALAIS MASSIF (DEM RESOLUTION 10M) · MAPBOX 3D TERRAIN ACTIVE
            </p>
          </div>
        </div>

        {/* Global Operational Metrics Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Engine Selector */}
          <div className="flex items-center p-1 rounded bg-surface border border-line">
            <button
              onClick={() => setMapEngine('mapbox')}
              className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-all ${
                mapEngine === 'mapbox'
                  ? 'bg-signal text-deep-ground font-bold shadow-sm'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Mapbox 3D</span>
            </button>
            <button
              onClick={() => setMapEngine('vector')}
              className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-all ${
                mapEngine === 'vector'
                  ? 'bg-signal text-deep-ground font-bold shadow-sm'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Offline Vector</span>
            </button>
          </div>

          <div className="px-3 py-1.5 rounded bg-surface border border-line flex items-center gap-2">
            <span className="text-mute text-[10px]">NETWORK NODES:</span>
            <span className="text-signal font-bold">{onlineCount}/{nodes.length} ONLINE</span>
          </div>

          <div className="px-3 py-1.5 rounded bg-surface border border-line flex items-center gap-2">
            <span className="text-mute text-[10px]">QUEUED PACKETS:</span>
            <span className={`font-bold ${queuedCount > 0 ? 'text-caution' : 'text-signal'}`}>
              {queuedCount} IN BUFFER
            </span>
          </div>

          <div className="px-3 py-1.5 rounded bg-surface border border-line flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-signal" />
            <span className="text-[10px] text-mute">WCAG 2.1 AA</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Central Map (Desktop 8-col) + Side Panels (Desktop 4-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 2D/3D Map + Lower Profile */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Main Spatial Map (Mapbox 3D or Offline Vector) */}
          {mapEngine === 'mapbox' ? <MapboxTerrainView /> : <ConsoleMap />}

          {/* Interactive Line-of-Sight Terrain Profile (Plate 01/02 Cross Section) */}
          <TerrainProfileView />
        </div>

        {/* Right Column: Node Control, Message Queue, AI Digest, Exploded Layers */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Tab Navigation for smaller screens / organized workflow */}
          <div className="flex items-center gap-1 p-1 bg-surface rounded-lg border border-line text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setActiveTab('control')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                activeTab === 'control'
                  ? 'bg-signal text-deep-ground font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Node</span>
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                activeTab === 'queue'
                  ? 'bg-signal text-deep-ground font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Queue ({queuedCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                activeTab === 'ai'
                  ? 'bg-signal text-deep-ground font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Digest</span>
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                activeTab === 'layers'
                  ? 'bg-signal text-deep-ground font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'control' && <NodeControlPanel />}
          {activeTab === 'queue' && <MessageQueuePanel />}
          {activeTab === 'ai' && <AIDigestPanel />}
          {activeTab === 'layers' && <ExplodedLayersLegend />}

          {/* Persistent Message Queue Quick Preview (if not already on queue tab) */}
          {activeTab !== 'queue' && <MessageQueuePanel />}
        </div>
      </div>
    </div>
  );
}
