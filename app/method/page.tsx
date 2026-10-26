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

  // FSPL estimation: 20*log10(d) + 20*log10(f) + 32.44 (f = 915 MHz)
  const fsplDb = Math.round(20 * Math.log10(Math.max(0.1, distanceKm)) + 20 * Math.log10(915) + 32.44);
  const linkMarginDb = isClear ? Math.max(0, 115 - fsplDb) : 0;

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
              1. How Radio Links are Calculated (Interactive Model)
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-signal/15 text-xs text-signal font-semibold">
            Line of Sight Simulation
          </span>
        </div>

        <p className="text-xs text-mute font-sans leading-relaxed">
          A physical radio link between two alpine stations is judged as <code className="text-signal font-mono">online</code> if and only if two criteria are met: the physical distance is within maximum radio transceiver range (&le; 9 km), and the calculated line-of-sight ray between antenna tips exceeds the intervening mountain ridge height.
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
              onChange={e => setDistanceKm(parseFloat(e.target.value))}
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
              onChange={e => setAntennaHeightM(parseFloat(e.target.value))}
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
              onChange={e => setRidgeInterventionM(parseInt(e.target.value))}
              className="w-full accent-signal cursor-pointer"
            />
            <span className="text-[10px] text-mute block">Peak height in line of propagation</span>
          </div>
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
                  ? 'LINE OF SIGHT CLEAR · LINK ONLINE'
                  : distanceKm > 9.0
                  ? 'DISTANCE EXCEEDS MAXIMUM TRANSCEIVER RANGE'
                  : 'RIDGE BREACHES LINE OF SIGHT · LINK SEVERED'}
              </span>
              <span className="text-[11px] opacity-80">
                Clearance: {clearanceM > 0 ? `+${clearanceM} m` : `${clearanceM} m`} | Estimated FSPL: {fsplDb} dB | Margin: {linkMarginDb} dB
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
