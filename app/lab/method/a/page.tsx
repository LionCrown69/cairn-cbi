'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import TerrainProfileView from '@/components/TerrainProfileView';

export default function LabMethodAPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-signal text-deep-ground font-bold">METHOD VARIANT A</span>
          <span className="text-ink font-bold">CINEMATIC: Interactive Line-of-Sight Cross Section Simulator</span>
        </div>
        <div className="text-mute">Rubric Score: 4.6 / 5.0 (Interaction Winner)</div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 sm:p-12 space-y-6">
        <TerrainProfileView />
      </div>
    </div>
  );
}
