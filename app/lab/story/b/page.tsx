'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import ConsoleMap from '@/components/ConsoleMap';
import { MapPin, Compass } from 'lucide-react';

export default function LabStoryBPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-400 text-deep-ground font-bold">VARIANT B</span>
          <span className="text-ink font-bold">CARTOGRAPHIC: Map-first, trekking-product clarity, zero decorative distraction</span>
        </div>
        <div className="text-mute">Rubric Score: 4.3 / 5.0 (Task Speed Winner)</div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 sm:p-12 space-y-8 font-mono">
        <div className="space-y-3">
          <span className="text-xs text-signal uppercase tracking-widest">
            VALAIS ALPINE SECTOR MESH
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-ink">
            Topographic Network Surface.
          </h1>
          <p className="text-sm text-mute font-sans max-w-2xl leading-relaxed">
            Prioritizes instant spatial comprehension. Immediately loads the full 14x13 km sector grid with contour intervals and direct RF link clearances without scroll barriers.
          </p>
        </div>

        {/* 2D Vector Map Canvas */}
        <ConsoleMap />

        <div className="p-4 rounded bg-surface/50 border border-line text-xs text-mute space-y-2">
          <span className="font-bold text-signal uppercase">Variant B Trade-off Analysis:</span>
          <p className="font-sans text-ink/90 leading-relaxed">
            While Variant B offers unmatched task speed for an experienced SAR dispatcher, it lacks the dramatic emotional resonance needed for a high-impact narrative introduction. Its vector map component is harvested for Page 2 Field Console.
          </p>
        </div>
      </div>
    </div>
  );
}
