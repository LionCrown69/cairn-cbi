'use client';

import React from 'react';
import LabNavigation from '@/components/LabNavigation';
import { Database, ShieldCheck } from 'lucide-react';

export default function LabMethodBPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      <LabNavigation />

      <div className="p-4 bg-surface/80 border-b border-line flex items-center justify-between text-xs font-mono max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-400 text-deep-ground font-bold">METHOD VARIANT B</span>
          <span className="text-ink font-bold">CARTOGRAPHIC: Strict tabular offline matrix & mathematical formulas</span>
        </div>
        <div className="text-mute">Rubric Score: 4.5 / 5.0 (Truthfulness Winner)</div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 sm:p-12 space-y-6 font-mono text-xs">
        <div className="cairn-glass p-6 rounded-lg border border-line space-y-4">
          <h2 className="font-bold text-signal text-sm uppercase">RF Friis Free-Space Equation:</h2>
          <div className="p-3 rounded bg-deep-ground border border-line text-ink">
            FSPL(dB) = 20·log10(d_km) + 20·log10(f_MHz) + 32.44
          </div>
          <p className="text-mute font-sans">
            At 915 MHz with 10 km distance, theoretical FSPL equals ~111.7 dB. A receiver sensitivity of -124 dBm with 27 dBm EIRP leaves a healthy link margin of 39 dB over line of sight.
          </p>
        </div>
      </div>
    </div>
  );
}
