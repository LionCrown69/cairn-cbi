'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import NodeControlPanel from '@/components/NodeControlPanel';
import MessageQueuePanel from '@/components/MessageQueuePanel';
import AIDigestPanel from '@/components/AIDigestPanel';

export default function LabConsoleCPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-caution text-deep-ground font-bold">CONSOLE VARIANT C</span>
          <span className="text-ink font-bold">EDITORIAL: Large typographic status callouts, card-driven telemetry</span>
        </div>
        <div className="text-mute">Rubric Score: 4.1 / 5.0 (Clarity Winner)</div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        <div className="p-6 rounded-lg bg-surface border border-line">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-ink mb-2">
            STATION TELEMETRY FEED
          </h2>
          <p className="text-xs text-mute font-mono">
            Direct card-driven log layout for small screens and field hand-held terminals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NodeControlPanel />
          <AIDigestPanel />
        </div>
        <MessageQueuePanel />
      </div>
    </div>
  );
}
