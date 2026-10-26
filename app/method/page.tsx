// The one thing the user came to do: Understand the RF line-of-sight math and delay-tolerant routing.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IOSAccordion, AccordionSection } from '@/components/ui/ios-accordion';
import { CapabilityBadge } from '@/components/ui/capability-badge';
import {
  Layers,
  Radio,
  GitFork,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Wifi,
  WifiOff,
  CloudSun,
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export default function MethodPage() {
  // Interactive Link Propagation Simulator State (Visual for Section 1)
  const [distanceKm, setDistanceKm] = useState(6.5);
  const [antennaHeightM, setAntennaHeightM] = useState(5.0);
  const [ridgeInterventionM, setRidgeInterventionM] = useState(2400);

  // Geometry
  const stationAElev = 2100;
  const stationBElev = 2600;
  const rayMidElevation = (stationAElev + stationBElev) / 2 + antennaHeightM;
  const clearanceM = Math.round((rayMidElevation - ridgeInterventionM) * 10) / 10;
  const isClear = clearanceM > 0;
  const fresnelRadiusM = Math.round(8.657 * Math.sqrt(distanceKm / (4 * 0.915)) * 10) / 10;

  const handleSliderChange = (setter: (v: number) => void, val: number) => {
    setter(val);
    sound.playBeep(440 + val * 8, 0.03, 0.02);
  };

  const sections: AccordionSection[] = [
    {
      id: 'physics-rf',
      number: '01',
      title: 'Physical RF Line-of-Sight & 1st Fresnel Clearance',
      summary:
        'How radio waves travel over 3,000m alpine peaks and why intervening granite ridgelines sever VHF/UHF signals.',
      content: (
        <div className="space-y-6 pt-2">
          {/* Exactly 2-4 sentences */}
          <p className="text-xs sm:text-sm text-ink/90 font-sans leading-relaxed">
            At 915 MHz, radio waves propagate in straight lines between transceivers. A link is only operational if the direct ray clears intervening topography and retains at least 60% of its first Fresnel zone ellipsoid. When granite breaches this zone, transmission drops to zero.
          </p>

          {/* Interactive Visual */}
          <div className="p-5 rounded-2xl bg-surface/50 border border-white/[0.08] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-mute uppercase tracking-wider">Interactive 1st Fresnel Zone Cross-Section:</span>
              <CapabilityBadge
                type={isClear ? 'live' : 'estimate'}
                label={isClear ? `Clear (+${clearanceM}m)` : `Severed (${clearanceM}m)`}
              />
            </div>

            {/* SVG Visual */}
            <div className="relative w-full h-44 bg-deep-ground rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center p-2">
              <svg viewBox="0 0 600 160" className="w-full h-full">
                {/* Ground Massif Curve */}
                <path
                  d="M 0 160 Q 150 140, 240 100 Q 300 65, 360 110 Q 480 150, 600 160 Z"
                  fill="#1C2216"
                  stroke="#3A4030"
                  strokeWidth="1.5"
                />
                {/* Station A (Left) */}
                <circle cx="80" cy="115" r="5" fill="#D4F53C" />
                <line x1="80" y1="115" x2="80" y2="95" stroke="#D4F53C" strokeWidth="2" />
                <text x="60" y="85" fill="#F1F0EA" fontSize="9" fontFamily="JetBrains Mono">Station A (2,100m)</text>

                {/* Station B (Right) */}
                <circle cx="520" cy="95" r="5" fill="#D4F53C" />
                <line x1="520" y1="95" x2="520" y2="75" stroke="#D4F53C" strokeWidth="2" />
                <text x="470" y="65" fill="#F1F0EA" fontSize="9" fontFamily="JetBrains Mono">Station B (2,600m)</text>

                {/* Direct RF Ray Line */}
                <line
                  x1="80"
                  y1="95"
                  x2="520"
                  y2="75"
                  stroke={isClear ? '#D4F53C' : '#FF8A3D'}
                  strokeWidth="2"
                  strokeDasharray={isClear ? 'none' : '4 4'}
                />

                {/* Fresnel Zone Ellipse */}
                <ellipse
                  cx="300"
                  cy="85"
                  rx="210"
                  ry="24"
                  fill={isClear ? 'rgba(212, 245, 60, 0.08)' : 'rgba(255, 138, 61, 0.08)'}
                  stroke={isClear ? '#D4F53C' : '#FF8A3D'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-mute">
                  <span>Antenna Mast Height:</span>
                  <span className="font-bold text-ink">{antennaHeightM} m</span>
                </div>
                <input
                  type="range"
                  aria-label="Antenna Mast Height"
                  min="2.0"
                  max="12.0"
                  step="0.5"
                  value={antennaHeightM}
                  onChange={(e) => handleSliderChange(setAntennaHeightM, parseFloat(e.target.value))}
                  className="w-full accent-signal cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mute">
                  <span>Intervening Ridge Height:</span>
                  <span className="font-bold text-ink">{ridgeInterventionM} m</span>
                </div>
                <input
                  type="range"
                  aria-label="Intervening Ridge Height"
                  min="2200"
                  max="2600"
                  step="20"
                  value={ridgeInterventionM}
                  onChange={(e) => handleSliderChange(setRidgeInterventionM, parseFloat(e.target.value))}
                  className="w-full accent-signal cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'store-and-forward',
      number: '02',
      title: 'Store-and-Forward Delay-Tolerant Routing',
      summary:
        'Why isolated patrols never drop emergency packets when traversing deep glacial couloirs.',
      content: (
        <div className="space-y-6 pt-2">
          {/* Exactly 2-4 sentences */}
          <p className="text-xs sm:text-sm text-ink/90 font-sans leading-relaxed">
            Standard internet protocols drop packets if an immediate destination is unreachable. Cairn uses delay-tolerant store-and-forward routing: packets are encrypted and held in local flash memory. As soon as a peer or solar saddle relay crests the ridge, the cached packet hops forward to Base Command.
          </p>

          {/* Simple Visual Protocol Diagram */}
          <div className="p-5 rounded-2xl bg-surface/50 border border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
            <div className="p-3 rounded-xl bg-surface/60 border border-white/[0.06] space-y-1">
              <span className="text-caution font-bold block">1. Ridge Occlusion</span>
              <p className="text-[11px] text-mute font-sans">Direct line severed. Message stored in local device flash.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface/60 border border-white/[0.06] space-y-1">
              <span className="text-signal font-bold block">2. Peer Discovery</span>
              <p className="text-[11px] text-mute font-sans">Relay sweeps 915 MHz beacon; establishes ad-hoc peer hop.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface/60 border border-white/[0.06] space-y-1">
              <span className="text-signal font-bold block">3. Cryptographic Ack</span>
              <p className="text-[11px] text-mute font-sans">Packet arrives at Base. Signed receipt returned to patrol.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-guardrails',
      number: '03',
      title: 'Zero-Hallucination AI Guardrails',
      summary:
        'How Google Gemini 2.5 Flash operates strictly over verified telemetry with numeric whitelists.',
      content: (
        <div className="space-y-6 pt-2">
          {/* Exactly 2-4 sentences */}
          <p className="text-xs sm:text-sm text-ink/90 font-sans leading-relaxed">
            In search and rescue operations, hallucinated numbers can cost lives. Cairn feeds the AI engine an exact telemetry matrix of active nodes, clearances, and queue states. Before displaying any response, a client-side validator inspects every extracted number against an input whitelist, falling back to deterministic templates if ungrounded metrics appear.
          </p>

          {/* Clean Visual */}
          <div className="p-5 rounded-2xl bg-surface/50 border border-white/[0.08] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-mute uppercase tracking-wider text-[11px]">Guardrail Enforcement Pipeline:</span>
              <CapabilityBadge type="live" label="Deterministic Safe" />
            </div>
            <div className="p-3 rounded-xl bg-deep-ground/80 border border-white/[0.06] flex items-center justify-between text-[11px] text-mute">
              <span>Telemetry Matrix &rarr;</span>
              <span>Gemini 2.5 Flash &rarr;</span>
              <span className="text-signal font-bold">Numeric Whitelist Regex &rarr;</span>
              <span className="text-ink">Verified SITREP</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink p-6 sm:p-12 max-w-4xl mx-auto w-full space-y-12">
      {/* Page Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest">
          <Layers className="w-4 h-4 text-signal" />
          <span>Physical RF Modeling & Routing Architecture</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ink">
          Method & Mathematical Model.
        </h1>
        <p className="text-xs sm:text-sm text-mute font-sans max-w-xl leading-relaxed">
          One open section at a time. Physical line-of-sight calculations, store-and-forward protocols, and verified offline capabilities.
        </p>
      </div>

      {/* Accordion Sections (One Open at a Time) */}
      <IOSAccordion sections={sections} defaultValue="physics-rf" />

      {/* OFFLINE BEHAVIOUR — SIMPLE 3-COLUMN LIST (Step 7 Requirement) */}
      <section className="space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-signal">
            System Capability Matrix
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
            Offline Behaviour & Operational Boundaries
          </h2>
        </div>

        {/* 3-Column List: Works Offline / Needs a Connection / Not Built Yet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          {/* Column 1: Works Offline */}
          <div className="p-5 rounded-2xl bg-surface/40 border border-signal/30 space-y-3">
            <div className="flex items-center gap-2 text-signal font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Works Offline (Today)</span>
            </div>
            <ul className="space-y-2.5 text-mute leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-signal">&bull;</span>
                <span>40-step numerical ray-casting over synthetic 10m alpine DEM.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-signal">&bull;</span>
                <span>Local IndexedDB store-and-forward packet queuing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-signal">&bull;</span>
                <span>Web Audio tactile synthesizer sound effects.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Needs a Connection */}
          <div className="p-5 rounded-2xl bg-surface/40 border border-blue-500/30 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold font-mono">
              <Wifi className="w-4 h-4" />
              <span>Needs a Connection</span>
            </div>
            <ul className="space-y-2.5 text-mute leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">&bull;</span>
                <span>Live Google Gemini 2.5 Flash inference (falls back to deterministic templates if offline).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">&bull;</span>
                <span>Dynamic Mapbox satellite raster basemap tiles.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Not Built Yet */}
          <div className="p-5 rounded-2xl bg-surface/30 border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-gray-300 font-bold font-mono">
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span>Not Built Yet</span>
            </div>
            <ul className="space-y-2.5 text-gray-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span>&bull;</span>
                <span>Physical USB/BLE Semtech SX1262 LoRa hardware transceiver bridge.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>&bull;</span>
                <span>Iridium SBD satellite constellation automated failover.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Back to Console Button */}
      <div className="pt-4 flex items-center justify-between text-xs font-mono text-mute">
        <Link href="/" className="hover:text-ink transition-colors">
          &larr; Back to Story
        </Link>
        <Link
          href="/console"
          className="px-5 py-2.5 rounded-full bg-signal text-deep-ground font-sans font-bold hover:bg-signal/90 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Test in Field Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
