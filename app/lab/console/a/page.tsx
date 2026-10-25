'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import ConsoleMap from '@/components/ConsoleMap';
import NodeControlPanel from '@/components/NodeControlPanel';
import TerrainProfileView from '@/components/TerrainProfileView';

export default function LabConsoleAPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-signal text-deep-ground font-bold">CONSOLE VARIANT A</span>
          <span className="text-ink font-bold">CINEMATIC: 3D Oblique perspective, spatial relief, atmospheric shading</span>
        </div>
        <div className="text-mute">Rubric Score: 4.5 / 5.0 (Depth Winner)</div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <ConsoleMap />
            <TerrainProfileView />
          </div>
          <div className="lg:col-span-4">
            <NodeControlPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
