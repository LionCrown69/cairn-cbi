'use client';

import React from 'react';
import Link from 'next/link';
import { Sliders, ShieldCheck, ArrowRight, Eye, Radio, GitFork, AlertTriangle } from 'lucide-react';

export default function DesignSystemPage() {
  const colorTokens = [
    { name: 'Ground', hex: '#1B1F16', cssVar: '--cairn-ground', usage: 'Primary container backgrounds' },
    { name: 'Deep Ground', hex: '#0E120A', cssVar: '--cairn-deep-ground', usage: 'Page canvas and deepest backdrop' },
    { name: 'Surface', hex: '#252A1E', cssVar: '--cairn-surface', usage: 'Elevated cards, popovers, headers' },
    { name: 'Line / Border', hex: '#3A4030', cssVar: '--cairn-line', usage: 'Single-pixel high-contrast dividers' },
    { name: 'Ink (Text)', hex: '#F1F0EA', cssVar: '--cairn-ink', usage: 'High-contrast headlines and reading text' },
    { name: 'Mute', hex: '#A4A99A', cssVar: '--cairn-mute', usage: 'Subordinate metadata, coordinates' },
    { name: 'Signal (Active)', hex: '#D4F53C', cssVar: '--cairn-signal', usage: 'Online nodes, clear LOS, verified packets' },
    { name: 'Caution (Transit)', hex: '#FF8A3D', cssVar: '--cairn-caution', usage: 'Relay hops, queued buffer, warnings' },
    { name: 'Severed / Blocked', hex: '#525946', cssVar: '--cairn-severed', usage: 'Obstructed ridges, offline stations' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink p-6 sm:p-12 max-w-6xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="border-b border-line pb-6 space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-signal uppercase tracking-widest">
            <Sliders className="w-4 h-4" />
            <span>Design Tokens, Typography & Component Standards</span>
          </div>
          <Link
            href="/design/metrics"
            className="px-3 py-1 rounded bg-surface border border-line hover:border-signal text-signal text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>View Data Metrics Dictionary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-tight-display text-ink">
          The Design System.
        </h1>
        <p className="text-sm text-mute max-w-2xl font-sans leading-relaxed">
          The visual identity of CAIRN combines scientific visualization, rugged alpine hardware UX, and high-fashion condensed typography (inspired by SerenX, F1 telemetry, and Norris/Leclerc editorial design).
        </p>
      </div>

      {/* SECTION 1: COLOR PALETTE & TOKENS */}
      <section className="space-y-6">
        <h2 className="font-mono font-bold text-sm text-signal uppercase tracking-wider">
          01 · Semantic Color Tokens
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorTokens.map(c => (
            <div key={c.hex} className="cairn-glass p-4 rounded-lg border border-line flex items-center gap-4">
              <div
                className="w-12 h-12 rounded border border-line shrink-0 shadow-md"
                style={{ backgroundColor: c.hex }}
              />
              <div className="font-mono text-xs">
                <div className="font-bold text-ink">{c.name}</div>
                <div className="text-signal">{c.hex}</div>
                <div className="text-mute text-[10px] mt-0.5">{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: TYPOGRAPHY HIERARCHY */}
      <section className="space-y-6">
        <h2 className="font-mono font-bold text-sm text-signal uppercase tracking-wider">
          02 · Typography Stack
        </h2>

        <div className="cairn-glass p-6 sm:p-8 rounded-lg border border-line space-y-8">
          <div>
            <span className="font-mono text-xs text-mute block mb-1">
              BIG SHOULDERS DISPLAY (UPPERCASE, LEADING ~0.86)
            </span>
            <h3 className="font-display font-extrabold text-5xl sm:text-7xl uppercase text-ink tracking-tight leading-tight-display">
              NO SIGNAL. STILL CONNECTED.
            </h3>
          </div>

          <div>
            <span className="font-mono text-xs text-mute block mb-1">
              SPACE GROTESK (EDITORIAL & BODY COPY)
            </span>
            <p className="text-sm sm:text-base text-ink/90 max-w-2xl leading-relaxed">
              When extreme mountain weather occludes direct visual and line-of-sight communication, our mesh network stores, hops, and routes vital coordination packets over peaks without single points of failure.
            </p>
          </div>

          <div>
            <span className="font-mono text-xs text-mute block mb-1">
              JETBRAINS MONO (DATA TABLES & TELEMETRY READOUTS)
            </span>
            <div className="font-mono text-xs text-signal bg-deep-ground p-3 rounded border border-line">
              FREQ: 915.000 MHz | RSSI: -94 dBm | SNR: +7.2 dB | HOP: 2/4 | QUEUE: 0 PKTS
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MULTI-MODAL STATUS BADGES */}
      <section className="space-y-6">
        <h2 className="font-mono font-bold text-sm text-signal uppercase tracking-wider">
          03 · Status is Never Color Alone (Multi-Modal Matrix)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded bg-surface/60 border border-signal text-signal space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Radio className="w-4 h-4" />
              <span>ONLINE (DIRECT)</span>
            </div>
            <p className="text-[11px] text-mute font-sans">
              Solid stroke + green tint + icon. Line of sight confirmed.
            </p>
          </div>

          <div className="p-4 rounded bg-surface/60 border border-caution text-caution space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <GitFork className="w-4 h-4" />
              <span>RELAY (2 HOPS)</span>
            </div>
            <p className="text-[11px] text-mute font-sans">
              Dashed stroke + orange tint + icon. Mesh store & forward route.
            </p>
          </div>

          <div className="p-4 rounded bg-surface/60 border border-severed text-mute space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-severed" />
              <span>SEVERED (LOS BLOCKED)</span>
            </div>
            <p className="text-[11px] text-mute font-sans">
              Dotted stroke + muted gray + warning badge. Intervening ridge breach.
            </p>
          </div>

          <div className="p-4 rounded bg-surface/60 border border-caution/60 text-caution space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Eye className="w-4 h-4" />
              <span>AI-GENERATED (UNVERIFIED)</span>
            </div>
            <p className="text-[11px] text-mute font-sans">
              Explicit warning badge + timestamp + inspected inputs.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: 1PX ENGINEERED GLASS SURFACES */}
      <section className="space-y-6">
        <h2 className="font-mono font-bold text-sm text-signal uppercase tracking-wider">
          04 · 1px Engineered Glass Panels
        </h2>

        <div className="cairn-glass p-6 rounded-lg border border-line text-xs font-mono space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-bold text-ink">GLASS CONTAINER SYSTEM</span>
            <span className="text-signal">BORDER: 1PX SOLID #3A4030</span>
          </div>
          <p className="text-mute font-sans leading-relaxed">
            Unlike excessive blurred glassmorphism that destroys outdoor readability, CAIRN uses subtle 12px blur with high-opacity dark gradients (85% to 95% opacity) to preserve 4.5:1 contrast ratios in bright sunlight or snow glare.
          </p>
        </div>
      </section>
    </div>
  );
}
