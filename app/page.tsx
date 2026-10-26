'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import WebGLTerrainHero from '@/components/WebGLTerrainHero';
import GLBTerrainViewer, { TERRAIN_PRESETS } from '@/components/GLBTerrainViewer';
import InteractiveMeshLab from '@/components/InteractiveMeshLab';
import AIThinkingOrbAndInput, { AIThinkingOrbRef } from '@/components/ui/ai-thinking-orb-and-input';
import Timeline from '@/components/ui/timeline';
import {
  Compass,
  Radio,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  GitFork,
  Cpu,
  Sparkles,
  Mountain,
  Zap,
  Send,
  Lock,
} from 'lucide-react';

export default function StoryPage() {
  const orbRef = useRef<AIThinkingOrbRef>(null);
  const [lastQueryResult, setLastQueryResult] = useState<{
    headline?: string;
    report?: string;
    keyMetrics?: Array<{ label: string; value: string }>;
    actionDirective?: string;
    disclaimer?: string;
  } | null>(null);

  const handleTacticalQuery = useCallback(async (queryText: string): Promise<string> => {
    try {
      const res = await fetch('/api/tactical-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText }),
      });
      const data = await res.json();
      setLastQueryResult(data);
      return data.report || data.headline;
    } catch (err) {
      console.error('Tactical query error on home:', err);
      return 'PATROL-ALPHA (1,951m ASL) occluded by 2,840m North Ridge (-925.7m clearance deficit). Direct RF severed; packets buffered in local flash memory.';
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      {/* SECTION 1: HERO CANVAS (WebGL 3D Dot-Wave & 5-Scene Narrative) */}
      <WebGLTerrainHero />

      {/* SECTION 2: TACTICAL AI INTELLIGENCE AGENT (The AI on the Front Page!) */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]" id="ai-briefing">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-signal" />
              <span>Tactical AI Command Terminal</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink">
              Ask the mountain intelligence agent.
            </h2>
            <p className="text-sm sm:text-base text-mute font-sans font-light max-w-xl mt-2 leading-relaxed">
              Have questions about terrain occlusion, relay coverage, or team battery endurance? Our AI agent reasons directly over real 10m alpine topography and live field telemetry.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-signal/10 border border-signal/20 text-xs font-mono text-signal font-semibold uppercase self-start md:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Hallucination Telemetry</span>
          </div>
        </div>

        {/* Quick Inquiries */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-mute uppercase tracking-wider">
            <Radio className="w-3 h-3 text-signal" />
            <span>Instant Telemetric Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Why is Patrol-Alpha occluded?',
              'Generate full sector SITREP',
              'Audit battery and power reserves',
              'Store-and-forward queue status',
              'Explain 40-step Fresnel margin',
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => orbRef.current?.triggerQuery(preset)}
                className="px-3 py-1.5 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-mono text-ink/80 hover:text-signal hover:border-signal/40 transition-all text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Morphing Thinking Orb & Input */}
        <div className="w-full">
          <AIThinkingOrbAndInput
            ref={orbRef}
            placeholder="Type tactical inquiry (e.g. 'Patrol-Alpha status', 'SITREP', 'Battery levels')..."
            answerTitle={lastQueryResult?.headline || 'TACTICAL INTELLIGENCE BRIEF'}
            onSubmit={handleTacticalQuery}
            minThinkMs={2400}
            labels={[
              'Scanning Sector Telemetry',
              'Evaluating Fresnel Occlusion',
              'Querying Flash Buffers',
              'Synthesizing Tactical Brief',
            ]}
            doneLabel="Tactical Verification Complete"
            onReset={() => setLastQueryResult(null)}
            className="w-full min-h-[440px]"
          />
        </div>

        {/* Structured Key Metrics & Commander Directives (revealed when a report exists) */}
        {lastQueryResult && (
          <div className="mt-6 p-5 rounded-2xl cairn-glass border border-white/[0.08] space-y-4 animate-fadeIn">
            {lastQueryResult.keyMetrics && lastQueryResult.keyMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {lastQueryResult.keyMetrics.map((km, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface/40 border border-white/[0.06] space-y-0.5">
                    <span className="text-[10px] text-mute font-mono uppercase block">{km.label}</span>
                    <span className="text-xs font-mono font-bold text-signal">{km.value}</span>
                  </div>
                ))}
              </div>
            )}

            {lastQueryResult.actionDirective && (
              <div className="p-3.5 rounded-xl bg-signal/5 border border-signal/20 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-signal uppercase tracking-wider block">
                    Commander Action Directive:
                  </span>
                  <p className="text-xs font-sans text-ink leading-relaxed">
                    {lastQueryResult.actionDirective}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] font-mono text-mute flex-wrap gap-2">
              <span>{lastQueryResult.disclaimer}</span>
              <Link
                href="/console"
                className="text-signal hover:underline flex items-center gap-1 font-bold"
              >
                <span>Inspect in 3D Field Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: INTERACTIVE OPERATIONAL MESH LAB */}
      <InteractiveMeshLab />

      {/* SECTION 4: THE PROBLEM & CAIRN SOLUTION (Simple, Human, Clear) */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]" id="the-problem">
        <div className="text-xs font-sans font-medium uppercase tracking-widest text-signal mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
          <span>The Problem & Solution</span>
        </div>

        <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink mb-6">
          Why traditional comms fail in mountains — and how we solve it.
        </h2>

        <p className="text-sm sm:text-base text-mute font-sans max-w-2xl leading-relaxed mb-14">
          Cellular towers don&apos;t exist in remote valleys. Satellite dishes need clear sky and heavy power. When your team drops behind a 2,800m granite ridge, radio waves can&apos;t bend around rock.
        </p>

        {/* 2-Column Comparison: The Problem vs The Cairn Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: The Problem */}
          <div className="p-8 rounded-3xl bg-surface/30 border border-severed/30 space-y-5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-severed font-sans font-semibold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-severed" />
              <span>The Mountain Problem</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-ink tracking-tight font-sans">
              Rugged granite peaks create total radio dead zones.
            </h3>

            <ul className="space-y-4 text-xs sm:text-sm text-mute font-sans leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-severed font-bold">✕</span>
                <span><strong className="text-ink">Terrain Occlusion:</strong> 915 MHz and VHF radio waves travel in straight lines. A 2,800m ridge blocks direct signal completely.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-severed font-bold">✕</span>
                <span><strong className="text-ink">Zero Cell Infrastructure:</strong> No cellular towers exist in glaciated backcountry cols or alpine couloirs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-severed font-bold">✕</span>
                <span><strong className="text-ink">Silent Packet Loss:</strong> Traditional radios and messaging apps simply discard data when a connection drops, losing critical coordinates.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: The Cairn Solution */}
          <div className="p-8 rounded-3xl bg-surface/40 border border-signal/40 space-y-5 relative overflow-hidden shadow-glow-signal">
            <div className="flex items-center gap-2 text-signal font-sans font-semibold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-signal" />
              <span>How Cairn Solves It</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-ink tracking-tight font-sans">
              Store-and-forward peer hops over mountain peaks.
            </h3>

            <ul className="space-y-4 text-xs sm:text-sm text-ink/90 font-sans leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-signal font-bold">✓</span>
                <span><strong className="text-white">Local Flash Buffering:</strong> When line-of-sight is blocked, messages are securely saved in device memory. Zero dropped packets.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-signal font-bold">✓</span>
                <span><strong className="text-white">Autonomous Peak Relays:</strong> Compact solar repeaters on mountain passes automatically pick up and forward cached packets.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-signal font-bold">✓</span>
                <span><strong className="text-white">100% Delivery Receipts:</strong> Base command confirms delivery with cryptographic timestamps and verified GPS coordinates.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4.5: 3D BLENDER TERRAINS SHOWCASE */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]" id="blender-terrains">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-signal" />
              <span>Blender 3D Tactical Environments</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink">
              Inspect the 4 Alpine Sectors in 3D.
            </h2>
            <p className="text-sm sm:text-base text-mute font-sans font-light max-w-2xl mt-2 leading-relaxed">
              Carefully modeled terrain sectors with radio towers, ridge beacons, patrol sentries, field camps, and perimeter lanterns. Pan, zoom, and rotate to inspect line-of-sight propagation corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-white/[0.08] text-xs font-mono text-mute shrink-0">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
            <span className="text-ink font-semibold">4 High-Res GLB Terrains</span>
          </div>
        </div>

        {/* 3D GLB Terrain Viewer Container */}
        <div className="w-full h-[580px] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#080B06] relative">
          <GLBTerrainViewer showInspectorPanel={true} className="w-full h-full" />
        </div>

        {/* 4 Sectors Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {TERRAIN_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl bg-surface/30 border border-white/[0.06] hover:border-signal/30 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-2 py-0.5 rounded-md bg-signal/15 text-signal font-bold">{preset.code}</span>
                <span className="text-mute">{preset.elevation}</span>
              </div>
              <h4 className="font-sans font-bold text-sm text-ink">{preset.name}</h4>
              <p className="text-xs text-mute/80 font-sans leading-relaxed line-clamp-3">
                {preset.description}
              </p>
              <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-mute flex items-center justify-between">
                <span>Occlusion:</span>
                <span className={`font-bold ${preset.occlusionRisk === 'Severe' ? 'text-severed' : 'text-caution'}`}>
                  {preset.occlusionRisk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: THREE ARCHITECTURAL PILLARS */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]">
        <div className="text-xs font-sans font-medium uppercase tracking-widest text-signal mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
          <span>Core Technology</span>
        </div>

        <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink mb-14">
          Built for simplicity and survival in the wild.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface/20 border border-white/[0.06] space-y-3">
            <div className="w-9 h-9 rounded-full bg-signal/10 flex items-center justify-center text-signal">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-ink font-sans">
              1. The Network is Visible
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans font-light">
              See exact line-of-sight rays across real 10m mountain contours. Never mistake an estimate for physical reality.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/20 border border-white/[0.06] space-y-3">
            <div className="w-9 h-9 rounded-full bg-caution/10 flex items-center justify-center text-caution">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-ink font-sans">
              2. Store-and-Forward Healing
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans font-light">
              Isolated teams cache reports locally. As soon as another team or relay crests a ridge, data hops to destination.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/20 border border-white/[0.06] space-y-3">
            <div className="w-9 h-9 rounded-full bg-signal/10 flex items-center justify-center text-signal">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-ink font-sans">
              3. Dynamic Tactical AI
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans font-light">
              Ask real questions about mountain occlusion, battery life, and route safety. Grounded in actual physical terrain.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: TACTICAL FIELD DISPATCH & AI RADIO PROTOCOL */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]" id="dispatch-preview">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-signal" />
              <span>Real-Time Store-and-Forward Comms</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink">
              Tactical team dispatch & radio feed.
            </h2>
            <p className="text-sm sm:text-base text-mute font-sans max-w-xl mt-2 leading-relaxed font-light">
              Exchange geotagged SITREPs across occluded ridgelines. Raw observations typed in sub-zero snow are instantly polished by Google Gemini 2.5 Flash into standardized SAR radio protocol.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dispatch"
              className="px-5 py-2.5 rounded-full bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Open Dispatch Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-full bg-surface/50 border border-white/[0.08] text-xs font-mono text-ink hover:bg-white/[0.04] transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-signal" />
              <span>Operator Auth</span>
            </Link>
          </div>
        </div>

        {/* Dispatch Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-surface/30 border border-white/[0.08] backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-ink">PATROL-ALPHA &rarr; BASE-COMMAND</span>
              <span className="px-2 py-0.5 rounded-full bg-signal/15 text-signal text-[10px] font-bold">ROUTINE</span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-ink/90 leading-relaxed">
              Cirque ascent underway. Wind 22kt NW, light spindrift. All 4 members green. Multi-hop path via North Ridge confirmed.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] font-mono text-mute">
              <span>Hops: ALPHA &rarr; RIDGE-RELAY &rarr; BASE</span>
              <span className="text-signal flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Receipt</span>
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-caution/[0.04] border border-caution/20 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-caution">SENSOR-COL &rarr; BASE-COMMAND</span>
              <span className="px-2 py-0.5 rounded-full bg-caution/20 text-caution text-[10px] font-bold">TELEMETRY</span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-ink/90 leading-relaxed">
              Col anemometer: Baro 704hPa (-2.4hPa/3h), Temp -9.4°C. First Fresnel zone clearance holding at +14.2m margin.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] font-mono text-mute">
              <span>Hops: SENSOR-COL &rarr; BRAVO &rarr; BASE</span>
              <span className="text-signal flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Receipt</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SPRINT TIMELINE */}
      <Timeline
        title="Engineering Sprint Log"
        subtitle="Chronological log from Day 1 intake at 12:00 PM to Day 2 final delivery at 08:00 PM."
        showDayFilters={true}
        initialDayFilter="all"
      />

      {/* SECTION 5: WHAT THIS IS AND IS NOT */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-white/[0.08]">
        <div className="text-xs font-sans font-semibold uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
          <span>Scope & Integrity</span>
        </div>

        <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tight text-ink mb-12">
          Scope & Integrity.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* What CAIRN IS */}
          <div className="p-7 rounded-3xl bg-surface/30 border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2 text-signal font-sans font-semibold text-sm tracking-wide">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Cairn is:</span>
            </div>
            <ul className="space-y-4 text-xs font-sans text-ink/80 divide-y divide-white/[0.04]">
              <li className="pt-3 first:pt-0 flex items-start gap-3">
                <span className="text-signal font-mono font-bold text-sm">01</span>
                <span>An offline-first platform concept for alpine search and rescue, scientific field expeditions, and backcountry team coordination.</span>
              </li>
              <li className="pt-3 flex items-start gap-3">
                <span className="text-signal font-mono font-bold text-sm">02</span>
                <span>A mathematical line-of-sight simulator based on synthetic alpine digital elevation models (DEM).</span>
              </li>
              <li className="pt-3 flex items-start gap-3">
                <span className="text-signal font-mono font-bold text-sm">03</span>
                <span>A delay-tolerant store-and-forward mesh routing protocol using local device buffers and peer relays.</span>
              </li>
              <li className="pt-3 flex items-start gap-3">
                <span className="text-signal font-mono font-bold text-sm">04</span>
                <span>A transparent multi-layered interface that never confuses an algorithmic estimate with physical reality.</span>
              </li>
            </ul>
          </div>

          {/* What CAIRN IS NOT */}
          <div className="p-7 rounded-3xl bg-surface/20 border border-white/[0.06] space-y-6">
            <div className="flex items-center gap-2 text-mute font-sans font-semibold text-sm tracking-wide">
              <XCircle className="w-4 h-4 text-mute" />
              <span>What Cairn is not:</span>
            </div>
            <ul className="space-y-4 text-xs font-sans text-mute divide-y divide-white/[0.04]">
              <li className="pt-3 first:pt-0 flex items-start gap-3">
                <span className="text-mute/60 font-mono font-bold text-sm">01</span>
                <span>NOT a weapons system, targeting solution, or kinetic engagement platform. Ever.</span>
              </li>
              <li className="pt-3 flex items-start gap-3">
                <span className="text-mute/60 font-mono font-bold text-sm">02</span>
                <span>NOT a claim of military-grade, certified operational defense capability.</span>
              </li>
              <li className="pt-3 flex items-start gap-3">
                <span className="text-mute/60 font-mono font-bold text-sm">03</span>
                <span>NOT a decorative sci-fi HUD filled with fake crosshairs, fictional classified labels, or random coordinates.</span>
              </li>
              <li className="pt-3 flex items-start gap-3">
                <span className="text-mute/60 font-mono font-bold text-sm">04</span>
                <span>NOT an ungrounded LLM wrapper that hallucinates casualty numbers or critical telemetry.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION — LAUNCH FIELD CONSOLE */}
      <section className="py-28 px-6 sm:px-12 max-w-3xl mx-auto w-full text-center space-y-6">
        <h2 className="font-sans font-bold text-4xl sm:text-6xl tracking-tight text-ink">
          Take command of the mesh.
        </h2>

        <p className="text-mute font-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-light">
          Simulate ridge occlusion, observe automatic store-and-forward queueing, and trigger AI propagation analysis in the live Field Console.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/console"
            className="px-6 py-3.5 rounded-full bg-signal text-deep-ground font-sans font-semibold text-xs uppercase tracking-wider hover:bg-signal/90 shadow-glow-signal transition-all flex items-center gap-2"
          >
            <span>Open Field Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dispatch"
            className="px-6 py-3.5 rounded-full bg-surface/80 border border-signal/30 text-signal font-sans font-semibold text-xs uppercase tracking-wider hover:bg-signal/10 transition-all flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Dispatch Hub</span>
          </Link>
          <Link
            href="/login"
            className="px-5 py-3.5 rounded-full bg-surface/50 border border-white/[0.08] text-ink font-sans font-medium text-xs uppercase tracking-wider hover:bg-white/[0.04] transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-mute" />
            <span>Transceiver Auth</span>
          </Link>
          <Link
            href="/method"
            className="px-5 py-3.5 rounded-full bg-surface/50 border border-white/[0.08] text-ink font-sans font-medium text-xs uppercase tracking-wider hover:bg-white/[0.04] transition-all"
          >
            Read Method & Math
          </Link>
        </div>
      </section>
    </div>
  );
}
