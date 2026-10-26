"use client";

import React from "react";
import Link from "next/link";
import Timeline from "@/components/ui/timeline";
import { ArrowRight, Radio, Sparkles, Trophy, Cpu, Mountain, ShieldCheck } from "lucide-react";

export default function TimelineDemo() {
  return (
    <main className="bg-deep-ground text-ink min-h-screen flex flex-col">
      {/* Lead-in Hero section */}
      <section className="pt-24 pb-16 px-6 sm:px-12 max-w-5xl mx-auto w-full text-center space-y-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
          <span>Sprint Chronicle · 48 Hours</span>
        </div>

        <h1 className="max-w-4xl mx-auto text-4xl sm:text-6xl font-display font-extrabold uppercase tracking-tight text-ink">
          The 2-Day Timeline.
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm leading-relaxed text-mute font-sans">
          From intake at 12:00 PM through 3D terrain modeling, delay-tolerant mesh routing, verifiable AI reasoning, to final submission.
        </p>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-surface/40 border border-white/[0.06] text-left">
            <span className="text-[10px] font-mono text-mute uppercase block">Daily Window</span>
            <span className="text-xs font-mono font-bold text-ink">08:00 AM – 08:00 PM</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface/40 border border-white/[0.06] text-left">
            <span className="text-[10px] font-mono text-mute uppercase block">Day 1 Kickoff</span>
            <span className="text-xs font-mono font-bold text-signal">12:00 PM Intake</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface/40 border border-white/[0.06] text-left">
            <span className="text-[10px] font-mono text-mute uppercase block">Day 2 Kickoff</span>
            <span className="text-xs font-mono font-bold text-caution">10:00 AM Standup</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface/40 border border-white/[0.06] text-left">
            <span className="text-[10px] font-mono text-mute uppercase block">Final Cut</span>
            <span className="text-xs font-mono font-bold text-signal">08:00 PM Release</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Timeline */}
      <Timeline
        title="Engineering Sprint Log"
        subtitle="Full 14-sprint chronological breakdown across Day 1 and Day 2. Filter by Day or toggle between Track and Stream views."
        showDayFilters={true}
        initialDayFilter="all"
      />

      {/* Summary / Delivery Showcase Section */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded bg-surface border border-line text-xs font-mono text-signal uppercase tracking-wider inline-block">
            Production Readiness Review
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl uppercase text-ink">
            Mission Accomplished.
          </h2>
          <p className="text-mute font-sans text-xs sm:text-sm max-w-xl mx-auto">
            14 technical milestones delivered across the 2-day hackathon window with full test coverage and live operational console.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface/30 border border-white/[0.06] space-y-3">
            <div className="w-9 h-9 rounded-full bg-signal/10 flex items-center justify-center text-signal">
              <Mountain className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-base text-ink">
              Real & Procedural 3D Terrain
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Seamlessly switch between sculpted Three.js WebGL mountain relief and live Mapbox 3D satellite elevation over the Valais Alps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/30 border border-white/[0.06] space-y-3">
            <div className="w-9 h-9 rounded-full bg-caution/10 flex items-center justify-center text-caution">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-base text-ink">
              Verifiable AI Reasoning
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Strict numeric whitelist guardrails eliminate hallucinations. Zero ungrounded casualty numbers or fabricated elevation metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/30 border border-white/[0.06] space-y-3">
            <div className="w-9 h-9 rounded-full bg-signal/10 flex items-center justify-center text-signal">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-base text-ink">
              Store-and-Forward Resilience
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Delay-tolerant message queueing ensures zero dropped packets even during severe mountain ridge occlusions.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Link
            href="/console"
            className="px-6 py-2.5 rounded-full bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 shadow-glow-signal transition-all flex items-center gap-2"
          >
            <span>Launch Field Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-surface/50 border border-white/[0.08] text-ink font-mono text-xs uppercase tracking-wider hover:bg-white/[0.04] transition-all"
          >
            Back to Mission Overview
          </Link>
        </div>
      </section>
    </main>
  );
}
