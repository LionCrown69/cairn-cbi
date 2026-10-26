"use client";

import React from "react";
import Link from "next/link";
import Timeline from "@/components/ui/timeline";
import { ArrowRight, Radio, Sparkles, Trophy, Cpu, Mountain, ShieldCheck, Clock, Award, Presentation } from "lucide-react";

export default function TimelineDemo() {
  return (
    <main className="bg-deep-ground text-ink min-h-screen flex flex-col">
      {/* Lead-in Hero section */}
      <section className="pt-24 pb-16 px-6 sm:px-12 max-w-5xl mx-auto w-full text-center space-y-6 border-b border-white/[0.08]">
        {/* Team CBI Official Submission & Pitch Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-surface/80 border border-signal/40 text-xs font-mono uppercase tracking-wider mx-auto shadow-sm">
          <span className="text-signal font-extrabold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>SUBMISSION: 26 OCT · 04:00 PM</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-cyan-300 font-extrabold flex items-center gap-1.5">
            <Presentation className="w-3.5 h-3.5" />
            <span>PITCHING: 26 OCT · 05:00 PM</span>
          </span>
        </div>

        <h1 className="max-w-4xl mx-auto text-4xl sm:text-6xl font-display font-extrabold uppercase tracking-tight text-ink">
          The Engineering Chronicle.
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-mute font-sans">
          Engineered by <strong className="text-ink">Team CBI</strong> from initial intake at 12:00 PM and deep work kickoff at 06:00 PM on 25 October, through Day 2 morning resumption at 11:00 AM on 26 October, to official submission at 04:00 PM and pitching round at 05:00 PM.
        </p>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-surface/50 border border-white/[0.08] text-left">
            <span className="text-[10px] font-mono text-mute uppercase block">Engineering Squad</span>
            <span className="text-sm font-mono font-extrabold text-signal flex items-center gap-1.5 mt-0.5">
              <span>TEAM CBI</span>
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-surface/50 border border-white/[0.08] text-left">
            <span className="text-[10px] font-mono text-mute uppercase block">25 Oct Kickoff</span>
            <span className="text-sm font-mono font-bold text-ink mt-0.5 block">12:00 PM Intake</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface/50 border border-signal/40 text-left bg-signal/[0.04]">
            <span className="text-[10px] font-mono text-signal uppercase block font-bold">Final Submission</span>
            <span className="text-sm font-mono font-extrabold text-signal mt-0.5 block">26 Oct · 04:00 PM</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface/50 border border-cyan-400/40 text-left bg-cyan-500/[0.04]">
            <span className="text-[10px] font-mono text-cyan-300 uppercase block font-bold">Pitching Round</span>
            <span className="text-sm font-mono font-extrabold text-cyan-300 mt-0.5 block">26 Oct · 05:00 PM</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Timeline */}
      <Timeline
        title="Team CBI Sprint Timeline"
        subtitle="Chronological engineering milestones tracking research, 3D terrain modeling, Gemini 2.5 Flash AI, final submission at 04:00 PM, and pitching round at 05:00 PM."
        showDayFilters={true}
        initialDayFilter="all"
      />

      {/* Summary / Delivery Showcase Section */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-signal/15 border border-signal/30 text-xs font-mono text-signal uppercase tracking-wider inline-flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Mission Handover · Team CBI</span>
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl uppercase text-ink">
            Mission Accomplished.
          </h2>
          <p className="text-mute font-sans text-xs sm:text-sm max-w-2xl mx-auto">
            10 key engineering milestones delivered across 25–26 October by Team CBI. Submitted at 04:00 PM with 100% build pass rate, zero errors, and live demonstration ready for the 05:00 PM pitch!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface/40 border border-white/[0.08] space-y-3 hover:border-signal/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-signal/15 flex items-center justify-center text-signal">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-bold text-base text-ink">
              Blender 3D Terrains & Draco Compression
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              4 custom Blender GLB relief models (Knife Edge Ridge, Cirque Amphitheater, Stepped Plateau, Multi-Ridge) with Draco 3D geometry compression and WebGL orbit cameras.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/40 border border-white/[0.08] space-y-3 hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-bold text-base text-ink">
              Live Gemini 2.5 Flash & Strict Guardrails
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Live Google Gemini 2.5 Flash neural synthesis answering general inquiries with depth and military RF physics, while strictly enforcing peaceful search-and-rescue guardrails.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface/40 border border-white/[0.08] space-y-3 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-bold text-base text-ink">
              Store-and-Forward Delay-Tolerant Mesh
            </h3>
            <p className="text-xs text-mute leading-relaxed font-sans">
              Dynamic multi-hop mesh routing with FIFO store-and-forward packet buffers, ensuring zero dropped messages during severe mountain ridge dropouts.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Link
            href="/console"
            className="px-6 py-2.5 rounded-full bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 shadow-glow-signal transition-all flex items-center gap-2"
          >
            <span>Launch Live Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-surface/60 border border-white/[0.08] text-ink font-mono text-xs uppercase tracking-wider hover:bg-white/[0.05] transition-all"
          >
            Explore Mission Story
          </Link>
        </div>
      </section>
    </main>
  );
}
