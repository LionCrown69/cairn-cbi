'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import WebGLTerrainHero from '@/components/WebGLTerrainHero';
import { Eye, ShieldAlert } from 'lucide-react';

export default function LabStoryAPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-signal text-deep-ground font-bold">VARIANT A</span>
          <span className="text-ink font-bold">CINEMATIC: Deep 3D WebGL, atmospheric depth, scroll-driven storytelling</span>
        </div>
        <div className="text-mute">Rubric Score: 4.8 / 5.0 (Depth Winner)</div>
      </div>

      <WebGLTerrainHero />

      <div className="max-w-4xl mx-auto py-12 px-6 font-mono text-xs text-mute space-y-4">
        <div className="p-4 rounded bg-surface/50 border border-line">
          <h3 className="font-bold text-signal uppercase text-sm mb-2">Variant A Architecture Rationale:</h3>
          <p className="font-sans leading-relaxed text-ink/90">
            Maximizes emotional immersion and physical sense of scale. Uses custom GLSL shaders to project digital elevation onto 8,100 points, simulating alpine isolation before delivering packet telemetry. Selected as the visual foundation for the production landing page.
          </p>
        </div>
      </div>
    </div>
  );
}
