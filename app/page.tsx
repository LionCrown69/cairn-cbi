'use client';

import React from 'react';
import Link from 'next/link';
import WebGLTerrainHero from '@/components/WebGLTerrainHero';
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
} from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink">
      {/* SECTION 1: HERO CANVAS (WebGL 3D Dot-Wave & 5-Scene Narrative) */}
      <WebGLTerrainHero />

      {/* SECTION 2: THE PROBLEM IN THREE LINES */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-line">
        <div className="text-xs font-mono uppercase tracking-widest text-signal mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal shadow-glow-signal" />
          <span>Operational Reality in Alpine Environments</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-tight-display text-ink mb-12">
          The Problem in Three Lines.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="cairn-glass p-6 rounded-lg border border-line space-y-3">
            <span className="font-mono text-xs text-signal font-bold">01 · TERRAIN SHADOWS</span>
            <h3 className="font-bold text-lg text-ink font-sans">
              Intervening granite ridges occlude direct line of sight.
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              At 915 MHz or VHF/UHF frequencies, radio waves do not bend around 3,000-meter peaks. Once a patrol steps into a glacial valley, all direct signals are severed.
            </p>
          </div>

          <div className="cairn-glass p-6 rounded-lg border border-line space-y-3">
            <span className="font-mono text-xs text-caution font-bold">02 · ISOLATION AND FEAR</span>
            <h3 className="font-bold text-lg text-ink font-sans">
              Centralized towers and satellites cannot be assumed.
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Cellular base stations do not exist in high couloirs. Satellite uplinks require unobstructed clear sky and heavy power, failing under storm fronts and deep gorge walls.
            </p>
          </div>

          <div className="cairn-glass p-6 rounded-lg border border-line space-y-3">
            <span className="font-mono text-xs text-signal font-bold">03 · SILENT PACKET LOSS</span>
            <h3 className="font-bold text-lg text-ink font-sans">
              Conventional apps discard packets when disconnected.
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Standard communication protocols drop messages if a direct route does not exist. Critical medical or environmental reports vanish into thin air.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THREE ARCHITECTURAL PROMISES */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-line">
        <div className="text-xs font-mono uppercase tracking-widest text-signal mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal shadow-glow-signal" />
          <span>Engineering Guarantees</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-tight-display text-ink mb-12">
          Three Promises.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 rounded-lg bg-surface/60 border border-line space-y-3">
            <div className="w-10 h-10 rounded bg-signal/10 border border-signal/40 flex items-center justify-center text-signal">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ink font-sans">
              1. The Network is Visible
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Every link is honestly labelled as an algorithmic estimate or an observed confirmation. Operators immediately see which ridges block line of sight.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface/60 border border-line space-y-3">
            <div className="w-10 h-10 rounded bg-caution/10 border border-caution/40 flex items-center justify-center text-caution">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ink font-sans">
              2. Store-and-Forward Healing
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              When a patrol is isolated, reports are cached in tamper-proof flash memory. As soon as another peer or drone relay crests a saddle, messages hop to destination.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface/60 border border-line space-y-3">
            <div className="w-10 h-10 rounded bg-signal/10 border border-signal/40 flex items-center justify-center text-signal">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-ink font-sans">
              3. Verifiable AI Summarization
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              The AI summarizer works from strictly structured input matrices. Any response containing numbers not present in the input is rejected in favor of a deterministic template.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: 2-DAY HACKATHON SPRINT TIMELINE */}
      <Timeline
        title="2-Day Hackathon Sprint Timeline"
        subtitle="Natural engineering log from Day 1 kickoff at 12:00 PM to Day 2 final submission at 08:00 PM. Daily sprint window: 08:00 AM – 08:00 PM."
        showDayFilters={true}
        initialDayFilter="all"
      />

      {/* SECTION 5: WHAT THIS IS AND IS NOT */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full border-b border-line">
        <div className="text-xs font-mono uppercase tracking-widest text-caution mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-caution" />
          <span>Ethics, Scope & Truth in Advertising</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-tight-display text-ink mb-10">
          What This Is and Is Not.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What CAIRN IS */}
          <div className="cairn-glass p-6 sm:p-8 rounded-lg border border-signal/40 space-y-4">
            <div className="flex items-center gap-2 text-signal font-mono font-bold text-sm tracking-wider uppercase">
              <CheckCircle2 className="w-5 h-5" />
              <span>What CAIRN Is:</span>
            </div>
            <ul className="space-y-3 text-xs font-sans text-ink/90">
              <li className="flex items-start gap-2.5">
                <span className="text-signal font-mono font-bold">✓</span>
                <span>An offline-first platform concept for search and rescue, scientific field expeditions, and backcountry team coordination.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-signal font-mono font-bold">✓</span>
                <span>A mathematical line-of-sight simulator based on synthetic alpine digital elevation models (DEM).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-signal font-mono font-bold">✓</span>
                <span>A delay-tolerant store-and-forward mesh routing protocol using local device buffers and peer relays.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-signal font-mono font-bold">✓</span>
                <span>A transparent multi-layered interface (Plate 03) that never confuses an estimate with physical reality.</span>
              </li>
            </ul>
          </div>

          {/* What CAIRN IS NOT */}
          <div className="cairn-glass p-6 sm:p-8 rounded-lg border border-line space-y-4">
            <div className="flex items-center gap-2 text-mute font-mono font-bold text-sm tracking-wider uppercase">
              <XCircle className="w-5 h-5 text-severed" />
              <span>What CAIRN Is Not:</span>
            </div>
            <ul className="space-y-3 text-xs font-sans text-mute">
              <li className="flex items-start gap-2.5">
                <span className="text-severed font-mono font-bold">✕</span>
                <span>NOT a weapons system, targeting solution, or kinetic engagement platform. Ever.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-severed font-mono font-bold">✕</span>
                <span>NOT a claim of military-grade, operational, or certified defense capability.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-severed font-mono font-bold">✕</span>
                <span>NOT a decorative sci-fi HUD filled with fake crosshairs, fictional classified labels, or random coordinates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-severed font-mono font-bold">✕</span>
                <span>NOT an ungrounded LLM wrapper that hallucinates casualty numbers or critical equipment telemetry.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION — LAUNCH FIELD CONSOLE */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto w-full text-center space-y-6">
        <span className="px-3 py-1 rounded bg-surface border border-line text-signal font-mono text-xs uppercase tracking-wider inline-block">
          Interactive Operational Canvas Ready
        </span>

        <h2 className="font-display font-extrabold text-5xl sm:text-7xl uppercase tracking-tight leading-tight-display text-ink">
          Take Command of the Mesh.
        </h2>

        <p className="text-mute font-mono text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Simulate ridge occlusion, toggle relay stations offline, observe automatic store-and-forward queueing, and trigger AI propagation analysis in the live Field Console.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/console"
            className="px-6 py-3 rounded bg-signal text-deep-ground font-mono font-bold text-sm uppercase tracking-wider hover:bg-signal/90 shadow-glow-signal transition-all flex items-center gap-2"
          >
            <span>Open Field Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/method"
            className="px-6 py-3 rounded bg-surface border border-line text-ink font-mono text-sm uppercase tracking-wider hover:border-signal/50 transition-all flex items-center gap-2"
          >
            <span>Read Method & Math</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
