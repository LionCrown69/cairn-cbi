'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import SVGRidgeHeroFallback from '@/components/SVGRidgeHeroFallback';
import { Type, Sparkles } from 'lucide-react';

export default function LabStoryCPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-caution text-deep-ground font-bold">VARIANT C</span>
          <span className="text-ink font-bold">EDITORIAL: Bold condensed typography, art-direction focus, high-contrast poster</span>
        </div>
        <div className="text-mute">Rubric Score: 4.4 / 5.0 (Distinctiveness Winner)</div>
      </div>

      {/* High-Impact Plate 01 SVG Fallback Ridge Display */}
      <SVGRidgeHeroFallback
        headline="NO SIGNAL. STILL CONNECTED."
        tagline="EDITORIAL POSTER EXPLORATION · BIG SHOULDERS CLAMP(48PX, 9VW, 160PX)"
      />

      <div className="max-w-4xl mx-auto py-12 px-6 font-mono text-xs text-mute space-y-4">
        <div className="p-4 rounded bg-surface/50 border border-line">
          <h3 className="font-bold text-signal uppercase text-sm mb-2">Variant C Art Direction Rationale:</h3>
          <p className="font-sans leading-relaxed text-ink/90">
            Inspired by the editorial websites of Lando Norris and Charles Leclerc, Variant C relies on aggressive typographic scale contrast, negative letter-spacing, and tight leading (~0.86) to create unforgettable poster hierarchy. Its typography rules were adopted across the entire design system.
          </p>
        </div>
      </div>
    </div>
  );
}
