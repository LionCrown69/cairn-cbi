'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import ConsoleMap from '@/components/ConsoleMap';
import MessageQueuePanel from '@/components/MessageQueuePanel';
import NodeControlPanel from '@/components/NodeControlPanel';

export default function LabConsoleBPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-400 text-deep-ground font-bold">CONSOLE VARIANT B</span>
          <span className="text-ink font-bold">CARTOGRAPHIC: Strict 2D tactical grid, instant telemetry, high data density</span>
        </div>
        <div className="text-mute">Rubric Score: 4.7 / 5.0 (Task Speed Winner)</div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <ConsoleMap />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <NodeControlPanel />
            <MessageQueuePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
