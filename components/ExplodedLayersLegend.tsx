'use client';

import React from 'react';
import { useMeshStore } from '@/lib/store';
import { Layers, Eye, EyeOff } from 'lucide-react';

export default function ExplodedLayersLegend() {
  const { activeLayer, setActiveLayer, activeExplodedView, toggleExplodedView } = useMeshStore();

  const layers = [
    {
      id: 'l3' as const,
      code: 'L3',
      name: 'MESSAGES & EVENTS',
      provenance: 'OBSERVED (SIM)',
      color: '#FF8A3D',
      desc: 'Packet store-and-forward transmissions, check-ins, and delivery timestamps.',
    },
    {
      id: 'l2' as const,
      code: 'L2',
      name: 'LINKS & PROPAGATION',
      provenance: 'ESTIMATED (LINE OF SIGHT)',
      color: '#D4F53C',
      desc: 'RF propagation rays calculated over digital elevation model with Fresnel clearance.',
    },
    {
      id: 'l1' as const,
      code: 'L1',
      name: 'TERRAIN TOPOGRAPHY',
      provenance: 'SIMULATED MODEL',
      color: '#A4A99A',
      desc: 'Synthetic alpine elevation contours, saddle passes, and ridge crests.',
    },
  ];

  return (
    <div className="cairn-glass rounded-lg border border-line p-4 sm:p-5 text-ink font-mono text-xs space-y-4">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-signal" />
          <h3 className="font-bold tracking-wider uppercase text-signal">
            PLATE 03 · EXPLODED DATA LAYERS
          </h3>
        </div>

        <button
          onClick={toggleExplodedView}
          className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
            activeExplodedView
              ? 'bg-caution text-deep-ground font-bold border-caution'
              : 'bg-surface text-mute border-line hover:text-ink'
          }`}
        >
          {activeExplodedView ? '3D Exploded Active' : 'Explode Layers'}
        </button>
      </div>

      <p className="text-xs text-mute leading-relaxed font-sans">
        To prevent false claims of capability, every visual element strictly belongs to one of three transparent layers. An estimate is never displayed as an observed physical fact.
      </p>

      {/* Layer Cards */}
      <div className="space-y-2">
        {layers.map(layer => {
          const isSelected = activeLayer === layer.id;
          const isAll = activeLayer === 'all';

          return (
            <div
              key={layer.id}
              onClick={() => setActiveLayer(isSelected ? 'all' : layer.id)}
              className={`p-3 rounded border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-surface border-signal shadow-sm'
                  : isAll
                  ? 'bg-surface/40 border-line hover:border-line/80'
                  : 'bg-deep-ground/50 border-line/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="font-bold text-ink">{layer.code} · {layer.name}</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                  style={{
                    borderColor: layer.color,
                    color: layer.color,
                    backgroundColor: `${layer.color}15`,
                  }}
                >
                  {layer.provenance}
                </span>
              </div>
              <p className="text-[11px] text-mute mt-1.5 font-sans leading-relaxed">
                {layer.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Show All Reset */}
      {activeLayer !== 'all' && (
        <button
          onClick={() => setActiveLayer('all')}
          className="w-full py-1.5 rounded bg-surface border border-line text-xs text-mute hover:text-ink transition-colors"
        >
          Reset View: Show All Layers
        </button>
      )}
    </div>
  );
}
