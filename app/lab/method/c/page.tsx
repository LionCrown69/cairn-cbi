'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';

export default function LabMethodCPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-caution text-deep-ground font-bold">METHOD VARIANT C</span>
          <span className="text-ink font-bold">EDITORIAL: Alpine Communication Manifesto & Anti-War Safety Declaration</span>
        </div>
        <div className="text-mute">Rubric Score: 4.4 / 5.0 (Distinctiveness Winner)</div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 sm:p-12 space-y-6">
        <h1 className="font-display font-extrabold text-5xl uppercase tracking-tight text-ink">
          The Alpine Safety Manifesto.
        </h1>
        <p className="text-sm font-sans text-mute leading-relaxed">
          Technology created for extreme backcountry resilience must serve life, environmental awareness, and search-and-rescue team coordination. CAIRN rejects weaponization and decorative deceit in interface design.
        </p>
      </div>
    </div>
  );
}
