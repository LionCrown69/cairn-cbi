'use client';

import React from 'react';
import { BottomSheet } from './bottom-sheet';
import { CapabilityBadge } from './capability-badge';
import { CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Radio, Sparkles } from 'lucide-react';

interface WhatWorksSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatWorksSheet({ open, onOpenChange }: WhatWorksSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="What Works Today"
      description="Truth in Engineering: Exact breakdown of live simulated capabilities vs. roadmap."
    >
      <div className="space-y-6 text-sm font-sans">
        {/* Category 1: Live Today */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <CapabilityBadge type="live" label="Live (Simulated Alpine Sector)" />
            <span className="text-xs text-mute font-mono">Real execution on client</span>
          </div>
          <div className="rounded-2xl bg-surface/50 border border-white/[0.06] p-4 space-y-2">
            <ul className="space-y-2 text-xs text-ink/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                <span><strong className="text-white">Ray-Cast Line-of-Sight:</strong> Real-time 40-step numerical terrain clearance calculated over synthetic 10m alpine DEM contours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                <span><strong className="text-white">Store-and-Forward Routing:</strong> When an alpine ridge severs direct RF, packets hold in local IndexedDB flash memory until topology heals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                <span><strong className="text-white">Live AI SITREP Reasoning:</strong> Google Gemini 2.5 Flash analyzes sector telemetry with numeric guardrails and deterministic fallback.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                <span><strong className="text-white">Web Audio Synthesizer:</strong> Tactile micro-clicks and priority chime feedback synthesized via browser Web Audio API.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Category 2: Estimates */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <CapabilityBadge type="estimate" label="Estimate (Model Output)" />
            <span className="text-xs text-mute font-mono">Mathematical projections</span>
          </div>
          <div className="rounded-2xl bg-surface/50 border border-white/[0.06] p-4 space-y-2">
            <ul className="space-y-2 text-xs text-ink/90">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">~</span>
                <span><strong className="text-white">1st Fresnel Zone Clearance:</strong> Ellipsoid radius computed for 915 MHz ISM band using distance fractions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">~</span>
                <span><strong className="text-white">Link Margin & RSSI:</strong> Free-space path loss and knife-edge diffraction estimates based on synthetic elevation peaks.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Category 3: Coming Soon */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <CapabilityBadge type="coming-soon" label="Coming Soon (Not Built)" />
            <span className="text-xs text-mute font-mono">Hardware & Satellite Roadmap</span>
          </div>
          <div className="rounded-2xl bg-surface/30 border border-white/[0.04] p-4 space-y-2 opacity-80">
            <ul className="space-y-2 text-xs text-mute">
              <li className="flex items-start gap-2">
                <span className="text-mute/60 font-bold shrink-0">○</span>
                <span><strong className="text-ink/80">Hardware Transceiver Bridge:</strong> Direct USB/BLE serial connection to physical Semtech SX1262 LoRa hardware.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-mute/60 font-bold shrink-0">○</span>
                <span><strong className="text-ink/80">Iridium SBD Satellite Gateway:</strong> Automated failover to commercial L-band satellite when all peer hops are severed.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Integrity Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-signal/5 border border-signal/20 text-xs text-ink/90 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-signal shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-signal">Strict Non-Weapons Policy:</strong> Cairn is strictly an offline-first backcountry search & rescue and environmental science prototype. No operational military claims or kinetic capabilities exist.
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
