'use client';

import React, { useState } from 'react';
import {
  Layers,
  Radio,
  Sliders,
  ShieldCheck,
  Cpu,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export default function MethodPage() {
  // Interactive Link Propagation Simulator State
  const [distanceKm, setDistanceKm] = useState(6.5);
  const [antennaHeightM, setAntennaHeightM] = useState(5.0);
  const [ridgeInterventionM, setRidgeInterventionM] = useState(2400);

  // Theoretical station heights
  const stationAElev = 2100;
  const stationBElev = 2600;

  // Calculation
  const rayMidElevation = (stationAElev + stationBElev) / 2 + antennaHeightM;
  const clearanceM = Math.round((rayMidElevation - ridgeInterventionM) * 10) / 10;
  const isClear = clearanceM > 0;

  // Fresnel 1st Zone Radius at Midpoint for 915 MHz: R1 = 8.657 * sqrt(d_km / (4 * f_GHz))
  const fresnelRadiusM = Math.round(8.657 * Math.sqrt(distanceKm / (4 * 0.915)) * 10) / 10;
  const fresnelClearancePct = Math.min(100, Math.max(-100, Math.round((clearanceM / fresnelRadiusM) * 100)));

  // FSPL estimation: 20*log10(d) + 20*log10(f) + 32.44 (f = 915 MHz)
  const fsplDb = Math.round(20 * Math.log10(Math.max(0.1, distanceKm)) + 20 * Math.log10(915) + 32.44);
  const linkMarginDb = isClear ? Math.max(0, 115 - fsplDb) : 0;

  const handleSliderChange = (setter: (v: number) => void, val: number) => {
    setter(val);
    sound.playBeep(440 + val * 10, 0.03, 0.02);
  };

  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink p-6 sm:p-12 max-w-6xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="border-b border-line pb-6 space-y-3 font-sans">
        <div className="flex items-center gap-2 text-xs text-signal font-semibold uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          <span>Physical RF Modeling & Routing Architecture</span>
        </div>
        <h1 className="font-sans font-bold text-4xl sm:text-6xl tracking-tight text-ink">
          How Cairn Works.
        </h1>
        <p className="text-sm sm:text-base text-mute max-w-2xl font-sans font-light leading-relaxed">
          A clear breakdown of how Cairn calculates mountain line-of-sight obstruction, routes delay-tolerant packets across high peaks, and prevents AI hallucinations in the field.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE LINK PROPAGATION SIMULATOR */}
      <section className="cairn-glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 font-sans">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-signal" />
            <h2 className="font-bold text-lg text-ink">
              1. How Links are Judged (Interactive RF Propagation Model)
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-signal/15 border border-signal/30 text-xs text-signal font-mono font-semibold">
            Line of Sight + 1st Fresnel
          </span>
        </div>

        <p className="text-xs text-mute font-sans leading-relaxed">
          A physical radio link between two alpine stations is judged as <code className="text-signal font-mono">online</code> if and only if two criteria are met: the physical distance is within maximum radio transceiver range (&le; 9 km), and the calculated line-of-sight ray between antenna tips clears the intervening mountain ridge crest. For optimal signal integrity, &ge; 60% of the 1st Fresnel zone must remain unobstructed.
        </p>

        {/* Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-4 rounded-xl bg-surface/40 border border-white/[0.06] space-y-2">
            <div className="flex justify-between">
              <span className="text-mute">SPAN DISTANCE:</span>
              <span className="font-bold text-ink">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="12.0"
              step="0.5"
              value={distanceKm}
              onChange={e => handleSliderChange(setDistanceKm, parseFloat(e.target.value))}
              className="w-full accent-signal cursor-pointer"
            />
            <span className="text-[10px] text-mute block">Max 915MHz LoRa/FSK range: 9.0 km</span>
          </div>

          <div className="p-4 rounded-xl bg-surface/40 border border-white/[0.06] space-y-2">
            <div className="flex justify-between">
              <span className="text-mute">ANTENNA MAST HEIGHT:</span>
              <span className="font-bold text-ink">{antennaHeightM} m</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.5"
              value={antennaHeightM}
              onChange={e => handleSliderChange(setAntennaHeightM, parseFloat(e.target.value))}
              className="w-full accent-signal cursor-pointer"
            />
            <span className="text-[10px] text-mute block">Elevates line above ridge crest</span>
          </div>

          <div className="p-4 rounded-xl bg-surface/40 border border-white/[0.06] space-y-2">
            <div className="flex justify-between">
              <span className="text-mute">INTERVENING RIDGE CREST:</span>
              <span className="font-bold text-ink">{ridgeInterventionM} m</span>
            </div>
            <input
              type="range"
              min="2000"
              max="2700"
              step="10"
              value={ridgeInterventionM}
              onChange={e => handleSliderChange(setRidgeInterventionM, parseInt(e.target.value))}
              className="w-full accent-signal cursor-pointer"
            />
            <span className="text-[10px] text-mute block">Peak height in line of propagation</span>
          </div>
        </div>

        {/* Live Interactive SVG Cross-Section Visualizer */}
        <div className="p-4 rounded bg-deep-ground/90 border border-line space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-mute border-b border-line/50 pb-2">
            <span className="text-signal font-bold uppercase tracking-wider">
              RF PROPAGATION CROSS-SECTION · VALAIS PROFILE
            </span>
            <span>915 MHz ISM · 1ST FRESNEL RADIUS: {fresnelRadiusM}m</span>
          </div>

          <svg viewBox="0 0 700 200" className="w-full h-auto select-none font-mono">
            <defs>
              <linearGradient id="method-ground-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A3320" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0E120A" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <line x1="50" y1="50" x2="650" y2="50" stroke="#252A1E" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="100" x2="650" y2="100" stroke="#252A1E" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="150" x2="650" y2="150" stroke="#252A1E" strokeWidth="1" strokeDasharray="3 3" />

            {/* Station A (Left Peak) */}
            {/* Station B (Right Peak) */}
            {/* Intervening Ridge (Center Peak) */}
            {(() => {
              // Map heights to SVG Y: 2800m -> 30, 2000m -> 170
              const mapY = (h: number) => 170 - ((h - 2000) / 800) * 140;
              const yA = mapY(stationAElev);
              const yB = mapY(stationBElev);
              const yRidge = mapY(ridgeInterventionM);

              const mastPixel = (antennaHeightM / 15) * 20;
              const rayY_A = yA - mastPixel;
              const rayY_B = yB - mastPixel;
              const rayMidY = (rayY_A + rayY_B) / 2;

              const fresnelPixelR = (fresnelRadiusM / 25) * 25;

              return (
                <g>
                  {/* Ground Profile Polygon */}
                  <path
                    d={`M 50,180 L 50,${yA} L 120,${yA} L 220,160 L 350,${yRidge} L 480,150 L 580,${yB} L 650,${yB} L 650,180 Z`}
                    fill="url(#method-ground-grad)"
                    stroke="#55642D"
                    strokeWidth="1.5"
                  />

                  {/* 1st Fresnel Zone Ellipse */}
                  <ellipse
                    cx="350"
                    cy={rayMidY}
                    rx="180"
                    ry={fresnelPixelR}
                    fill={isClear ? '#D4F53C' : '#FF8A3D'}
                    fillOpacity="0.12"
                    stroke={isClear ? '#D4F53C' : '#FF8A3D'}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />

                  {/* Direct Line-of-Sight Ray */}
                  <line
                    x1="120"
                    y1={rayY_A}
                    x2="580"
                    y2={rayY_B}
                    stroke={isClear && distanceKm <= 9.0 ? '#D4F53C' : '#FF8A3D'}
                    strokeWidth="2"
                    strokeDasharray={isClear ? 'none' : '4 3'}
                  />

                  {/* Station A Mast */}
                  <line x1="120" y1={yA} x2="120" y2={rayY_A} stroke="#D4F53C" strokeWidth="2.5" />
                  <circle cx="120" cy={rayY_A} r="4" fill="#D4F53C" />
                  <text x="120" y={rayY_A - 8} fill="#D4F53C" fontSize="9" fontWeight="bold" textAnchor="middle">
                    ALPHA ({stationAElev}m)
                  </text>

                  {/* Station B Mast */}
                  <line x1="580" y1={yB} x2="580" y2={rayY_B} stroke="#D4F53C" strokeWidth="2.5" />
                  <circle cx="580" cy={rayY_B} r="4" fill="#D4F53C" />
                  <text x="580" y={rayY_B - 8} fill="#D4F53C" fontSize="9" fontWeight="bold" textAnchor="middle">
                    BRAVO ({stationBElev}m)
                  </text>

                  {/* Ridge Peak Marker */}
                  <circle cx="350" cy={yRidge} r="3.5" fill={isClear ? '#55642D' : '#FF8A3D'} />
                  <text
                    x="350"
                    y={yRidge + 22}
                    fill={isClear ? '#A4A99A' : '#FF8A3D'}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    RIDGE CREST ({ridgeInterventionM}m)
                  </text>

                  {/* Clearance Indicator Bar & Pill */}
                  <line
                    x1="350"
                    y1={rayMidY}
                    x2="350"
                    y2={yRidge}
                    stroke={isClear ? '#D4F53C' : '#FF8A3D'}
                    strokeWidth="1.5"
                  />
                  <rect
                    x="356"
                    y={(rayMidY + yRidge) / 2 - 7}
                    width="46"
                    height="14"
                    rx="3"
                    fill="#0E120A"
                    stroke={isClear ? '#D4F53C' : '#FF8A3D'}
                    strokeWidth="0.8"
                  />
                  <text
                    x="379"
                    y={(rayMidY + yRidge) / 2 + 3}
                    fill={isClear ? '#D4F53C' : '#FF8A3D'}
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {clearanceM > 0 ? `+${clearanceM}m` : `${clearanceM}m`}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Live Calculation Readout Card */}
        <div
          className={`p-4 rounded-xl border font-mono text-xs transition-all flex flex-wrap items-center justify-between gap-4 ${
            isClear && distanceKm <= 9.0
              ? 'bg-signal/10 border-signal/40 text-signal'
              : 'bg-caution/10 border-caution/40 text-caution'
          }`}
        >
          <div className="flex items-center gap-3">
            {isClear && distanceKm <= 9.0 ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <div>
              <span className="font-bold text-sm block">
                {isClear && distanceKm <= 9.0
                  ? 'LINE OF SIGHT CLEAR · 915 MHz LINK ONLINE'
                  : distanceKm > 9.0
                  ? 'DISTANCE EXCEEDS MAXIMUM TRANSCEIVER RANGE'
                  : 'RIDGE BREACHES LINE OF SIGHT · LINK SEVERED'}
              </span>
              <span className="text-[11px] opacity-80">
                Clearance: {clearanceM > 0 ? `+${clearanceM} m` : `${clearanceM} m`} | 1st Fresnel: {fresnelRadiusM} m ({fresnelClearancePct}%) | FSPL: {fsplDb} dB | Margin: {linkMarginDb} dB
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-deep-ground border border-current text-xs font-bold uppercase">
            STATUS: {isClear && distanceKm <= 9.0 ? 'CONNECTED' : 'DISCONNECTED'}
          </div>
        </div>
      </section>

      {/* SECTION 2: STORE-AND-FORWARD MECHANICS */}
      <section className="cairn-glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 font-sans">
          <Archive className="w-5 h-5 text-signal" />
          <h2 className="font-bold text-lg text-ink">
            2. Store-and-Forward Mesh Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          <div className="p-4 rounded-xl bg-surface/30 border border-white/[0.06] space-y-2">
            <span className="text-signal font-semibold text-[11px] uppercase tracking-wider block">Phase 1: Local Ingest</span>
            <h4 className="font-bold text-ink text-sm">Zero Packet Drops</h4>
            <p className="text-mute font-sans text-xs leading-relaxed">
              When a patrol sends a report with no route to base, the packet is stored in local non-volatile storage (IndexedDB) with status <code className="text-caution">queued</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface/30 border border-white/[0.06] space-y-2">
            <span className="text-caution font-semibold text-[11px] uppercase tracking-wider block">Phase 2: Relay Discovery</span>
            <h4 className="font-bold text-ink text-sm">Opportunistic Peering</h4>
            <p className="text-mute font-sans text-xs leading-relaxed">
              Nodes constantly ping neighbors at 915 MHz. When a peer or ridge relay appears within line of sight, the BFS routing table automatically updates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface/30 border border-white/[0.06] space-y-2">
            <span className="text-signal font-semibold text-[11px] uppercase tracking-wider block">Phase 3: Delivery ACK</span>
            <h4 className="font-bold text-ink text-sm">Cryptographic Receipt</h4>
            <p className="text-mute font-sans text-xs leading-relaxed">
              Once an unbroken path of hops to Base Command exists, the queued packets flush across the mesh and status updates to <code className="text-signal">delivered</code>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI LIMITS & INPUT SANITIZATION */}
      <section className="cairn-glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 font-sans">
          <Cpu className="w-5 h-5 text-signal" />
          <h2 className="font-bold text-lg text-ink">
            3. AI Guardrails & Anti-Hallucination Boundaries
          </h2>
        </div>

        <div className="space-y-4 font-sans text-xs text-ink/90 leading-relaxed">
          <p>
            CAIRN enforces strict isolation between untrusted field messages and AI reasoning prompts:
          </p>
          <ul className="space-y-2.5 font-sans text-xs text-mute list-disc pl-5">
            <li>
              <strong className="text-ink">Delimited Message Blocks:</strong> Operator messages are treated strictly as passive data inside explicit XML delimiters (<code>&lt;untrusted_report&gt;</code>) and never executed as prompt instructions.
            </li>
            <li>
              <strong className="text-ink">Numeric Whitelist Enforcement:</strong> The AI response is parsed for all numbers. If a number appears that was not present in the verified input matrix, the response is rejected and replaced with the deterministic template.
            </li>
            <li>
              <strong className="text-ink">Explicit Provenance:</strong> Every AI summary displays <code className="text-caution">AI-generated, unverified</code> with the exact timestamp and an inspection drawer.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 4: OFFLINE RESILIENCE TABLE */}
      <section className="cairn-glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 font-sans">
          <ShieldCheck className="w-5 h-5 text-signal" />
          <h2 className="font-bold text-lg text-ink">
            4. Offline Resilience Architecture
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border border-white/[0.08] rounded-xl overflow-hidden">
            <thead className="bg-surface/60 text-mute border-b border-white/[0.08]">
              <tr>
                <th className="p-3.5 font-semibold">Feature</th>
                <th className="p-3.5 font-semibold">Connected Mode</th>
                <th className="p-3.5 font-semibold">Zero-Connectivity Offline Mode</th>
                <th className="p-3.5 font-semibold">Fallback Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-ink">
              <tr>
                <td className="p-3.5 font-semibold">Mesh Routing & BFS</td>
                <td className="p-3.5 text-signal">Local Engine</td>
                <td className="p-3.5 text-signal">100% Operational</td>
                <td className="p-3.5 text-mute">Client-side graph traversal</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Message Buffering</td>
                <td className="p-3.5 text-signal">IndexedDB + Network</td>
                <td className="p-3.5 text-signal">100% Operational (Queued)</td>
                <td className="p-3.5 text-mute">IndexedDB persistence</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Elevation Profile</td>
                <td className="p-3.5 text-signal">Synthetic DEM Engine</td>
                <td className="p-3.5 text-signal">100% Operational</td>
                <td className="p-3.5 text-mute">Trigonometric alpine DEM</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">AI Situational Digest</td>
                <td className="p-3.5 text-signal">LLM Route Handler</td>
                <td className="p-3.5 text-caution">Deterministic Template</td>
                <td className="p-3.5 text-mute">Rule-based template (instant zero-delay)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: LIMITATIONS & ROADMAP */}
      <section className="cairn-glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 font-sans">
          <Lock className="w-5 h-5 text-caution" />
          <h2 className="font-bold text-lg text-ink">
            5. Known Limitations & Roadmap
          </h2>
        </div>

        <div className="space-y-3 font-sans text-xs text-mute">
          <div className="p-3.5 rounded-xl bg-surface/30 border border-white/[0.06] flex items-center justify-between">
            <span>Hardware RF physical transceiver binding (SDR / ESP32 LoRa)</span>
            <span className="px-2.5 py-1 rounded-full bg-surface text-caution text-[11px] font-medium">
              Synthetic Model Only
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface/30 border border-white/[0.06] flex items-center justify-between">
            <span>Real-time weather radar overlay</span>
            <span className="px-2.5 py-1 rounded-full bg-surface text-caution text-[11px] font-medium">
              Simulated Telemetry
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface/30 border border-white/[0.06] flex items-center justify-between">
            <span>End-to-End ChaCha20-Poly1305 hardware enclave encryption</span>
            <span className="px-2.5 py-1 rounded-full bg-signal/15 text-signal text-[11px] font-semibold">
              Roadmap v2.0
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
