'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Sun, Trophy, Radio, Shield, Cpu, Clock, Layers, Presentation, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/soundEffects';

export type HackathonMilestone = {
  id: string;
  day: 1 | 2;
  dayBadge: string;
  time: string;
  isoTime: string;
  category: string;
  title: string;
  summary: string;
  deliverables: string[];
  status: 'completed' | 'verified' | 'submitted' | 'upcoming';
  order: number;
  highlight?: boolean;
  isPitch?: boolean;
};

export const HACKATHON_SPRINT_DATA: HackathonMilestone[] = [
  // DAY 1 (25 October)
  {
    id: 'd1-1200',
    day: 1,
    dayBadge: 'DAY 1 · 25 OCT',
    time: '12:00 PM',
    isoTime: '12:00',
    category: 'RESEARCH & INTAKE',
    title: 'Sprint Check-in, Problem Research & Domain Scoping',
    summary:
      'Team CBI joined the sprint at 12:00 PM on 25 October. Deep-dived into alpine search and rescue telemetry, radio occlusion physics in 3,000m granite couloirs, and high-stress command design patterns.',
    deliverables: ['Alpine RF Physics', 'Telemetry Study', 'Problem Scope', 'Team CBI Kickoff'],
    status: 'completed',
    order: 1,
  },
  {
    id: 'd1-1800',
    day: 1,
    dayBadge: 'DAY 1 · 25 OCT',
    time: '06:00 PM',
    isoTime: '18:00',
    category: 'SPRINT KICKOFF & ARCHITECTURE',
    title: 'Deep Engineering Session & Offline Store-and-Forward Core',
    summary:
      'Commenced intensive development at 6:00 PM. Bootstrapped Next.js 15 App router with TypeScript strict mode, Zustand reactive store with Dexie IndexedDB persistence, and the delay-tolerant packet buffering protocol.',
    deliverables: ['Next.js 15 App Router', 'Zustand + Dexie Persistence', 'Store-and-Forward Protocol'],
    status: 'completed',
    order: 2,
  },
  {
    id: 'd1-2000',
    day: 1,
    dayBadge: 'DAY 1 · 25 OCT',
    time: '08:00 PM',
    isoTime: '20:00',
    category: '3D TERRAIN & FRESNEL MATH',
    title: 'Procedural DEM Raycasting & Fresnel Clearance Algorithms',
    summary:
      'Engineered procedural alpine DEM elevation model and 40-step ray clearance algorithm. Calculated knife-edge diffraction and 60% Fresnel zone clearance margins across mountain ridges.',
    deliverables: ['40-Step DEM Raycasting', 'Fresnel Clearance Math', 'Topological Wireframe'],
    status: 'completed',
    order: 3,
  },
  {
    id: 'd1-2200',
    day: 1,
    dayBadge: 'DAY 1 · 25 OCT',
    time: '10:00 PM',
    isoTime: '22:00',
    category: 'DAY 1 WRAP & NIGHT STAND-DOWN',
    title: 'Day 1 Code Wrap & Overnight Stand-Down',
    summary:
      'Wrapped Day 1 engineering session at 10:00 PM with core mesh routing and DEM raycasting math verified. Nighttime stand-down in preparation for the Day 2 morning push.',
    deliverables: ['Day 1 Code Freeze', 'Routing Core Verified', 'Night Stand-down'],
    status: 'verified',
    order: 4,
  },

  // DAY 2 (26 October)
  {
    id: 'd2-1100',
    day: 2,
    dayBadge: 'DAY 2 · 26 OCT',
    time: '11:00 AM',
    isoTime: '11:00',
    category: 'DAY 2 KICKOFF & BLENDER 3D',
    title: 'Day 2 Sprint Resumption & Blender 3D Terrains',
    summary:
      'Team CBI resumed engineering at 11:00 AM on 26 October. Integrated 4 hyper-detailed Blender GLB terrains with Draco geometry compression (Knife Edge Ridge, Cirque Amphitheater, Stepped Plateau, Multi-Ridge Network).',
    deliverables: ['4 Blender GLB Models', 'Draco 3D Compression', 'WebGL Orbit Camera'],
    status: 'completed',
    order: 5,
  },
  {
    id: 'd2-1230',
    day: 2,
    dayBadge: 'DAY 2 · 26 OCT',
    time: '12:30 PM',
    isoTime: '12:30',
    category: 'GEMINI 2.5 FLASH AI',
    title: 'Live Google Gemini 2.5 Flash Neural Integration',
    summary:
      'Connected live Google Gemini 2.5 Flash inference API. Engineered prompt architecture with JSON structured outputs, multi-tier directives (general knowledge, tactical RF physics), and strict non-lethal SAR guardrails.',
    deliverables: ['Gemini 2.5 Flash Core', 'Structured JSON Outputs', 'SAR Ethical Guardrails'],
    status: 'verified',
    order: 6,
  },
  {
    id: 'd2-1400',
    day: 2,
    dayBadge: 'DAY 2 · 26 OCT',
    time: '02:00 PM',
    isoTime: '14:00',
    category: 'VERIFICATION PIPELINE & AUDIO',
    title: '4-Stage Animated Telemetry Pipeline & Web Audio Engine',
    summary:
      'Built the animated 4-stage verification tracker, full-depth SITREP Reader card, and synthesized tactile Web Audio API feedback (54Hz sub-bass radio drone, beacon chirps, and mechanical click feedback).',
    deliverables: ['4-Stage Verification Pipeline', 'Full SITREP Reader Card', 'Web Audio API Synthesizer'],
    status: 'completed',
    order: 7,
  },
  {
    id: 'd2-1530',
    day: 2,
    dayBadge: 'DAY 2 · 26 OCT',
    time: '03:30 PM',
    isoTime: '15:30',
    category: 'PERFORMANCE & CODE FREEZE',
    title: '60 FPS WebGL Throttling & Secret Scrubbing',
    summary:
      'Integrated IntersectionObserver pausing for Three.js render loops to eliminate UI lag. Scrubbed exposed secrets from commit history, passing GitHub Push Protection with 100% build pass rate across 26 pages.',
    deliverables: ['60 FPS WebGL Throttling', 'Git Push Protection Pass', 'Clean TypeScript Build'],
    status: 'verified',
    order: 8,
  },
  {
    id: 'd2-1600',
    day: 2,
    dayBadge: 'DAY 2 · 16:00',
    time: '04:00 PM',
    isoTime: '16:00',
    category: 'FINAL SUBMISSION',
    title: 'Official Final Submission & Production Release by Team CBI',
    summary:
      'Final submission cut at 04:00 PM sharp on 26 October by Team CBI! Deployed to production on Vercel (https://cairn-cbi.vercel.app/) with 100% build pass rate, live Gemini 2.5 Flash neural intelligence, and interactive 3D terrain viewer.',
    deliverables: ['Production Vercel Release', 'Team CBI Final Cut', 'Live Gemini 2.5 Flash', 'Zero Build Errors'],
    status: 'submitted',
    highlight: true,
    order: 9,
  },
  {
    id: 'd2-1700',
    day: 2,
    dayBadge: 'DAY 2 · 17:00',
    time: '05:00 PM',
    isoTime: '17:00',
    category: 'PITCHING & DEMO ROUND',
    title: 'Official Pitching & Live Demonstration Round',
    summary:
      'Team CBI delivers the live operational pitch to the evaluation panel at 05:00 PM. Demonstrates live delay-tolerant mesh severance, automatic store-and-forward queue healing, 3D Blender terrain inspection, and Gemini 2.5 Flash reasoning.',
    deliverables: ['Live Tactical Demonstration', 'Judge & Evaluator Q&A', 'Mission Architecture Handover'],
    status: 'upcoming',
    isPitch: true,
    order: 10,
  },
];

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  showDayFilters?: boolean;
  initialDayFilter?: 'all' | 1 | 2 | 'final';
  className?: string;
}

export default function Timeline({
  title = 'Engineering Sprint Log',
  subtitle = 'Chronological engineering timeline from 25 Oct 12:00 PM intake to 26 Oct 04:00 PM submission and 05:00 PM pitching round.',
  showDayFilters = true,
  initialDayFilter = 'all',
  className,
}: TimelineProps) {
  const [dayFilter, setDayFilter] = useState<'all' | 1 | 2 | 'final'>(initialDayFilter);

  const filteredMilestones = useMemo(() => {
    if (dayFilter === 'all') return HACKATHON_SPRINT_DATA;
    if (dayFilter === 'final') return HACKATHON_SPRINT_DATA.filter((m) => m.highlight || m.isPitch);
    return HACKATHON_SPRINT_DATA.filter((m) => m.day === dayFilter && !m.isPitch && !m.highlight);
  }, [dayFilter]);

  const handleFilterChange = useCallback((filter: 'all' | 1 | 2 | 'final') => {
    sound.playClick();
    setDayFilter(filter);
  }, []);

  return (
    <section className={cn('py-16 px-6 sm:px-12 max-w-5xl mx-auto w-full border-b border-white/[0.08]', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="font-bold">Team CBI · Sprint Chronicle (25–26 Oct)</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-ink">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-mute font-sans mt-2 max-w-xl">{subtitle}</p>}
        </div>

        {/* Day & Final Filters */}
        {showDayFilters && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-mono shrink-0">
            <button
              onClick={() => handleFilterChange('all')}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 'all' ? 'bg-signal text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Layers className="w-3 h-3" />
              <span>All (10)</span>
            </button>
            <button
              onClick={() => handleFilterChange(1)}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 1 ? 'bg-signal text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Sun className="w-3 h-3" />
              <span>25 Oct (4)</span>
            </button>
            <button
              onClick={() => handleFilterChange(2)}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 2 ? 'bg-amber-400 text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Clock className="w-3 h-3 text-amber-950" />
              <span>26 Oct (4)</span>
            </button>
            <button
              onClick={() => handleFilterChange('final')}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 'final' ? 'bg-cyan-400 text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Trophy className="w-3 h-3 text-cyan-950" />
              <span>16:00 & 17:00 (2)</span>
            </button>
          </div>
        )}
      </div>

      {/* Streamlined Clean Timeline */}
      <div className="relative pt-10 pl-4 sm:pl-8 space-y-12 before:absolute before:left-0 sm:before:left-2 before:top-12 before:bottom-6 before:w-px before:bg-white/[0.1]">
        {filteredMilestones.map((item) => {
          const isDay1 = item.day === 1;
          const isHighlight = item.highlight;
          const isPitch = item.isPitch;

          return (
            <div
              key={item.id}
              className={cn(
                'relative group transition-all duration-300 rounded-2xl p-5',
                isHighlight
                  ? 'bg-gradient-to-r from-signal/15 via-amber-500/10 to-surface/50 border-2 border-signal/60 shadow-lg shadow-signal/10'
                  : isPitch
                  ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-surface/50 border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                  : 'hover:bg-white/[0.02] border border-transparent hover:border-white/[0.06]'
              )}
            >
              {/* Minimal Timeline Dot */}
              <div
                className={cn(
                  'absolute -left-4 sm:-left-8 top-6 w-3 h-3 rounded-full -translate-x-1/2 ring-4 ring-deep-ground transition-all',
                  isHighlight
                    ? 'bg-signal ring-signal/30 animate-pulse w-4 h-4'
                    : isPitch
                    ? 'bg-cyan-400 ring-cyan-500/30 animate-pulse w-4 h-4'
                    : isDay1
                    ? 'bg-signal ring-signal/20'
                    : 'bg-amber-400 ring-amber-500/20'
                )}
              />

              <div className="space-y-2.5">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span
                    className={cn(
                      'font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1.5',
                      isHighlight
                        ? 'bg-signal text-deep-ground font-extrabold shadow-sm'
                        : isPitch
                        ? 'bg-cyan-400 text-deep-ground font-extrabold shadow-sm'
                        : isDay1
                        ? 'bg-signal/15 text-signal border border-signal/30'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    )}
                  >
                    {isHighlight && <Trophy className="w-3 h-3 text-deep-ground" />}
                    {isPitch && <Presentation className="w-3 h-3 text-deep-ground" />}
                    <span>{item.dayBadge} · {item.time}</span>
                  </span>

                  <span className="text-white/20">/</span>
                  <span className="text-mute uppercase tracking-wider text-[11px] font-mono">{item.category}</span>

                  <span className="ml-auto text-mute/70 text-[11px] font-mono flex items-center gap-1.5">
                    {isHighlight ? (
                      <span className="px-2 py-0.5 rounded bg-signal/20 text-signal font-bold uppercase tracking-wider border border-signal/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        SUBMITTED BY TEAM CBI
                      </span>
                    ) : isPitch ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider border border-cyan-400/40 flex items-center gap-1">
                        <Presentation className="w-3 h-3" />
                        PITCHING ROUND · 05:00 PM
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-signal" />
                        <span className="capitalize">{item.status}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    'font-sans font-bold transition-colors',
                    isHighlight
                      ? 'text-xl sm:text-2xl text-signal flex items-center gap-2'
                      : isPitch
                      ? 'text-xl sm:text-2xl text-cyan-300 flex items-center gap-2'
                      : 'text-lg text-ink group-hover:text-signal'
                  )}
                >
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="font-sans text-xs sm:text-sm text-mute leading-relaxed max-w-3xl">
                  {item.summary}
                </p>

                {/* Deliverable tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.deliverables.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors',
                        isHighlight
                          ? 'bg-signal/20 border border-signal/40 text-signal font-bold'
                          : isPitch
                          ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold'
                          : 'bg-surface/60 border border-white/[0.08] text-ink/80 hover:text-ink hover:border-white/20'
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
