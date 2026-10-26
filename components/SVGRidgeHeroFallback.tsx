'use client';

import React from 'react';
import { ArrowDown, Radio, Activity, ShieldCheck } from 'lucide-react';

interface Props {
  headline?: string;
  tagline?: string;
}

export default function SVGRidgeHeroFallback({
  headline = 'NO SIGNAL. STILL CONNECTED.',
  tagline = 'PLATE 01 · ATMOSPHERIC DEPTH · 4 RIDGE LAYERS + HAZE · SYNTHETIC',
}: Props) {
  return (
    <div className="relative w-full h-[88vh] min-h-[640px] overflow-hidden bg-deep-ground flex flex-col justify-between p-6 sm:p-12 select-none border-b border-line">
      {/* Background Atmospheric Sky Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0C0F08 0%, #1A2214 30%, #3B4725 65%, #7D8E3E 100%)',
          opacity: 0.9,
        }}
      />

      {/* Top Header Plate Marker */}
      <div className="relative z-20 flex items-center justify-between font-mono text-[11px] sm:text-xs text-mute tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal shadow-glow-signal animate-pulse" />
          <span>{tagline}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-ink/70">
          <span>FREQ: 915 MHz ISM</span>
          <span>·</span>
          <span>TX: 27 dBm</span>
          <span>·</span>
          <span>MESH: STORE & FWD</span>
        </div>
      </div>

      {/* Plate 01 SVG Layered Ridges with Volumetric Atmospheric Depth */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
        <svg
          viewBox="0 0 1440 700"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Volumetric Haze Gradients */}
            <linearGradient id="haze-grad-4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#829441" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0E120A" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="ridge-grad-4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#55642D" />
              <stop offset="100%" stopColor="#1E2514" />
            </linearGradient>

            <linearGradient id="ridge-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3C4820" />
              <stop offset="100%" stopColor="#151A0E" />
            </linearGradient>

            <linearGradient id="ridge-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A3317" />
              <stop offset="100%" stopColor="#10140A" />
            </linearGradient>

            <linearGradient id="ridge-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C2210" />
              <stop offset="100%" stopColor="#0A0C06" />
            </linearGradient>

            {/* Glowing Beacon Filters */}
            <filter id="glow-lime" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* RIDGE LAYER 4 (Distant Background + Sunburst Crest) */}
          <path
            d="M0 440 L280 290 L460 380 L740 220 L980 340 L1220 200 L1440 310 L1440 700 L0 700 Z"
            fill="url(#ridge-grad-4)"
          />
          {/* Haze between 4 and 3 */}
          <rect y="220" width="1440" height="480" fill="url(#haze-grad-4)" opacity="0.3" />

          {/* RIDGE LAYER 3 (Mid-distance Range) */}
          <path
            d="M0 480 L180 380 L380 470 L600 310 L820 440 L1080 320 L1340 430 L1440 390 L1440 700 L0 700 Z"
            fill="url(#ridge-grad-3)"
          />

          {/* RIDGE LAYER 2 (Mid-ground Peaks with Active Beacons) */}
          <path
            d="M0 520 L320 370 L540 480 L760 360 L1020 490 L1260 380 L1440 460 L1440 700 L0 700 Z"
            fill="url(#ridge-grad-2)"
          />

          {/* Luminous Mesh Beacons & Transmission Rays (Plate 01 Motif) */}
          <line
            x1="320"
            y1="370"
            x2="760"
            y2="360"
            stroke="#D4F53C"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          <line
            x1="760"
            y1="360"
            x2="1080"
            y2="320"
            stroke="#D4F53C"
            strokeWidth="2"
            opacity="0.85"
          />

          {/* Node Beacon A (Alpha Ridge) */}
          <circle cx="320" cy="370" r="14" fill="#D4F53C" opacity="0.25" filter="url(#glow-lime)" />
          <circle cx="320" cy="370" r="7" fill="#D4F53C" filter="url(#glow-lime)" />
          <circle cx="320" cy="370" r="3" fill="#FFFFFF" />

          {/* Node Beacon B (Saddle Relay) */}
          <circle cx="760" cy="360" r="18" fill="#D4F53C" opacity="0.3" filter="url(#glow-lime)" />
          <circle cx="760" cy="360" r="8" fill="#D4F53C" filter="url(#glow-lime)" />
          <circle cx="760" cy="360" r="3" fill="#FFFFFF" />

          {/* Node Beacon C (Command Spire) */}
          <circle cx="1080" cy="320" r="14" fill="#D4F53C" opacity="0.25" filter="url(#glow-lime)" />
          <circle cx="1080" cy="320" r="6" fill="#D4F53C" filter="url(#glow-lime)" />
          <circle cx="1080" cy="320" r="2.5" fill="#FFFFFF" />

          {/* RIDGE LAYER 1 (Immediate Foreground Silhouette) */}
          <path
            d="M0 580 L220 490 L480 610 L780 470 L1040 590 L1320 480 L1440 560 L1440 700 L0 700 Z"
            fill="url(#ridge-grad-1)"
          />
        </svg>
      </div>
    </div>
  );
}
