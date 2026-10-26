'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Moon, Sun, Sparkles, Trophy, Radio, Shield, Cpu, Clock, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/soundEffects';

export type HackathonMilestone = {
  id: string;
  day: 1 | 'night' | 2;
  dayBadge: string;
  time: string;
  isoTime: string;
  category: string;
  title: string;
  summary: string;
  deliverables: string[];
  status: 'completed' | 'verified' | 'submitted';
  order: number;
  highlight?: boolean;
};

export const HACKATHON_SPRINT_DATA: HackathonMilestone[] = [
  // DAY 1 (Oct 25)
  {
    id: 'd1-1200',
    day: 1,
    dayBadge: 'DAY 1',
    time: '12:00 PM',
    isoTime: '12:00',
    category: 'RESEARCH & INTAKE',
    title: 'Sprint Kickoff, Telemetry Research & Domain Intake',
    summary:
      'Team CBI joined the sprint at noon. Deep-dived into alpine search and rescue telemetry, radio occlusion physics in 3,000m granite couloirs, and high-stress command design patterns.',
    deliverables: ['Alpine RF Physics', 'Telemetry Study', 'Problem Scope', 'Team CBI Kickoff'],
    status: 'completed',
    order: 1,
  },
  {
    id: 'd1-1330',
    day: 1,
    dayBadge: 'DAY 1',
    time: '01:30 PM',
    isoTime: '13:30',
    category: 'IDENTITY & ETHICS',
    title: 'Project CAIRN & Ethical SAR Architecture',
    summary:
      'Scoped mission purely around backcountry team coordination and mountain rescue. Formulated strict ethical boundaries: 100% peaceful offline mesh, strictly zero weapons scope.',
    deliverables: ['Mission Architecture', '3 Operational Promises', 'Synthetic Scenario Spec'],
    status: 'completed',
    order: 2,
  },
  {
    id: 'd1-1500',
    day: 1,
    dayBadge: 'DAY 1',
    time: '03:00 PM',
    isoTime: '15:00',
    category: 'ARCHITECTURE & STACK',
    title: 'Full-Stack Foundation & Offline Persistence',
    summary:
      'Bootstrapped Next.js 15 App router with TypeScript strict mode, Tailwind CSS tactical tokens, Zustand reactive store with Dexie IndexedDB persistence, and Vitest test suite.',
    deliverables: ['Next.js 15 App Router', 'Zustand + Dexie Store', 'TypeScript Strict Config'],
    status: 'completed',
    order: 3,
  },
  {
    id: 'd1-1800',
    day: 1,
    dayBadge: 'DAY 1',
    time: '06:00 PM',
    isoTime: '18:00',
    category: 'STORE-AND-FORWARD MESH',
    title: 'Delay-Tolerant Routing & Packet Buffers',
    summary:
      'Engineered offline-first packet relaying protocols. Implemented FIFO message queues with hop limits and dynamic node discovery to ensure zero packet drop across intermittent links.',
    deliverables: ['Delay-Tolerant Protocol', 'FIFO Message Queues', 'Dynamic Hop Discovery'],
    status: 'completed',
    order: 4,
  },

  // NIGHT OPS (Overnight Oct 25-26 - The CBI Midnight Sprint)
  {
    id: 'dn-2230',
    day: 'night',
    dayBadge: 'NIGHT OPS',
    time: '10:30 PM',
    isoTime: '22:30',
    category: 'BLENDER 3D MODELING',
    title: 'Photogrammetric Massifs & Draco GLB Compression',
    summary:
      'Team CBI overnight modeling session. Sculpted 4 hyper-realistic alpine massifs (Knife Edge Ridge, Cirque Amphitheater, Stepped Plateau, Multi-Ridge Network) with Draco 3D geometry compression for instant loading.',
    deliverables: ['4 Custom Blender GLBs', 'Draco Mesh Compression', 'Interactive 3D Inspector'],
    status: 'verified',
    order: 5,
  },
  {
    id: 'dn-0115',
    day: 'night',
    dayBadge: 'NIGHT OPS',
    time: '01:15 AM',
    isoTime: '01:15',
    category: 'TACTILE AUDIO SYNTHESIS',
    title: 'Web Audio API Spatial Sound Engine',
    summary:
      'Synthesized military-grade tactical audio feedback directly in the browser via Web Audio API: 54Hz sub-bass radio hums, transmitter beacon chirps, relay clicks, and packet receipt alarms.',
    deliverables: ['Web Audio Synthesizer', 'Sub-Bass Ambient Drone', 'Tactile Interaction Clicks'],
    status: 'completed',
    order: 6,
  },
  {
    id: 'dn-0345',
    day: 'night',
    dayBadge: 'NIGHT OPS',
    time: '03:45 AM',
    isoTime: '03:45',
    category: 'RADIO PROPAGATION PHYSICS',
    title: '40-Step DEM Raycasting & Fresnel Clearance Math',
    summary:
      'Engineered procedural alpine DEM elevation model and 40-step ray clearance algorithm. Calculated knife-edge diffraction and 60% Fresnel zone clearance margins across mountain ridges.',
    deliverables: ['Procedural Alpine DEM', '40-Step LOS Raycaster', 'Knife-Edge Fresnel Math'],
    status: 'verified',
    order: 7,
  },
  {
    id: 'dn-0530',
    day: 'night',
    dayBadge: 'NIGHT OPS',
    time: '05:30 AM',
    isoTime: '05:30',
    category: '21ST.DEV DESIGN OVERHAUL',
    title: 'Minimalist iOS-Grade Spatial HUD Architecture',
    summary:
      'Executed a pre-dawn design overhaul powered by 21st.dev components. Replaced cluttered tables with minimalist glass HUD cards, dark atmospheric gradients, and streamlined touch navigation.',
    deliverables: ['21st.dev Glass Components', 'Atmospheric Gradients', 'Minimalist Spatial HUD'],
    status: 'completed',
    order: 8,
  },

  // DAY 2 (Oct 26 - Gemini AI & Final Submission)
  {
    id: 'd2-0830',
    day: 2,
    dayBadge: 'DAY 2',
    time: '08:30 AM',
    isoTime: '08:30',
    category: 'DAY 2 STANDUP',
    title: 'Day 2 Standup & Multi-Paradigmatic Lab Review',
    summary:
      'Team CBI reconvened at 08:30 AM. Benchmarked operator cognitive load across Cinematic Tactical, Cartographic Scientific, and Minimalist Editorial design paradigms.',
    deliverables: ['Team CBI Standup', 'Cognitive Load Benchmarks', 'Final Sprint Roadmap'],
    status: 'completed',
    order: 9,
  },
  {
    id: 'd2-1100',
    day: 2,
    dayBadge: 'DAY 2',
    time: '11:00 AM',
    isoTime: '11:00',
    category: 'GEMINI 2.5 FLASH AI',
    title: 'Live Google Gemini 2.5 Flash Neural Integration',
    summary:
      'Connected live Google Gemini 2.5 Flash inference API. Engineered prompt architecture with JSON structured outputs, low temperature deterministic reasoning, and dynamic key failover.',
    deliverables: ['Gemini 2.5 Flash Core', 'Structured JSON Outputs', 'Dynamic API Key Engine'],
    status: 'verified',
    order: 10,
  },
  {
    id: 'd2-0115',
    day: 2,
    dayBadge: 'DAY 2',
    time: '01:15 PM',
    isoTime: '13:15',
    category: 'ETHICAL GUARDRAILS',
    title: 'Multi-Tier Reasoning & Non-Lethal Guardrails',
    summary:
      'Equipped the AI to understand general knowledge and military radio physics with depth, while strictly enforcing peaceful search-and-rescue guardrails against kinetic weapons and lethal targeting.',
    deliverables: ['Multi-Tier Reasoning', 'Lethal Targeting Guardrails', 'Unclassified RF Physics'],
    status: 'completed',
    order: 11,
  },
  {
    id: 'd2-0245',
    day: 2,
    dayBadge: 'DAY 2',
    time: '02:45 PM',
    isoTime: '14:45',
    category: 'VERIFICATION PIPELINE',
    title: '4-Stage Animated Verification & SITREP Reader',
    summary:
      'Designed an animated 4-stage pipeline (Telemetry Ingestion → DEM Raycast → Operational Guardrail → Neural Synthesis) and an unclamped, full-depth SITREP Reader with preset inquiry chips.',
    deliverables: ['4-Stage Verification Bar', 'Full SITREP Reader Card', 'Interactive Query Presets'],
    status: 'completed',
    order: 12,
  },
  {
    id: 'd2-0330',
    day: 2,
    dayBadge: 'DAY 2',
    time: '03:30 PM',
    isoTime: '15:30',
    category: 'OPTIMIZATION & AUDIT',
    title: '60 FPS WebGL Optimization & Secret Scrubbing',
    summary:
      'Integrated IntersectionObserver pausing for Three.js render loops to eliminate UI lag. Scrubbed exposed secrets from commit history and validated zero TypeScript errors across 26 pages.',
    deliverables: ['60 FPS WebGL Throttling', 'Git Push Protection Pass', 'Clean TypeScript Build'],
    status: 'verified',
    order: 13,
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
      'Final submission cut at 04:00 PM sharp on Day 2 by Team CBI! Deployed to production with 100% build pass rate, live Gemini 2.5 Flash neural intelligence, offline store-and-forward mesh, and interactive 3D terrain viewer.',
    deliverables: ['Production Vercel Release', 'Team CBI Final Cut', 'Live Gemini 2.5 Flash', 'Zero Build Errors'],
    status: 'submitted',
    highlight: true,
    order: 14,
  },
];

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  showDayFilters?: boolean;
  initialDayFilter?: 'all' | 1 | 'night' | 2;
  className?: string;
}

export default function Timeline({
  title = 'Engineering Sprint Log',
  subtitle = 'Chronological engineering timeline tracking architecture, overnight Blender modeling, audio synthesis, and final submission at 04:00 PM.',
  showDayFilters = true,
  initialDayFilter = 'all',
  className,
}: TimelineProps) {
  const [dayFilter, setDayFilter] = useState<'all' | 1 | 'night' | 2>(initialDayFilter);

  const filteredMilestones = useMemo(() => {
    if (dayFilter === 'all') return HACKATHON_SPRINT_DATA;
    return HACKATHON_SPRINT_DATA.filter((m) => m.day === dayFilter);
  }, [dayFilter]);

  const handleFilterChange = useCallback((filter: 'all' | 1 | 'night' | 2) => {
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
            <span className="font-bold">Team CBI · Sprint Chronicle</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-ink">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-mute font-sans mt-2 max-w-xl">{subtitle}</p>}
        </div>

        {/* Day & Night Filters */}
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
              <span>All (14)</span>
            </button>
            <button
              onClick={() => handleFilterChange(1)}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 1 ? 'bg-signal text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Sun className="w-3 h-3" />
              <span>Day 1 (4)</span>
            </button>
            <button
              onClick={() => handleFilterChange('night')}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 'night' ? 'bg-cyan-400 text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Moon className="w-3 h-3 text-cyan-300" />
              <span>Night Ops (4)</span>
            </button>
            <button
              onClick={() => handleFilterChange(2)}
              className={cn(
                'px-3 py-1 rounded-full transition-all flex items-center gap-1.5',
                dayFilter === 2 ? 'bg-amber-400 text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
              )}
            >
              <Trophy className="w-3 h-3 text-amber-950" />
              <span>Day 2 & Final (6)</span>
            </button>
          </div>
        )}
      </div>

      {/* Streamlined Clean Timeline */}
      <div className="relative pt-10 pl-4 sm:pl-8 space-y-12 before:absolute before:left-0 sm:before:left-2 before:top-12 before:bottom-6 before:w-px before:bg-white/[0.1]">
        {filteredMilestones.map((item) => {
          const isDay1 = item.day === 1;
          const isNight = item.day === 'night';
          const isHighlight = item.highlight;

          return (
            <div
              key={item.id}
              className={cn(
                'relative group transition-all duration-300 rounded-2xl p-5',
                isHighlight
                  ? 'bg-gradient-to-r from-signal/10 via-amber-500/10 to-surface/40 border-2 border-signal/50 shadow-lg shadow-signal/10'
                  : 'hover:bg-white/[0.02] border border-transparent hover:border-white/[0.06]'
              )}
            >
              {/* Minimal Timeline Dot */}
              <div
                className={cn(
                  'absolute -left-4 sm:-left-8 top-6 w-3 h-3 rounded-full -translate-x-1/2 ring-4 ring-deep-ground transition-all',
                  isHighlight
                    ? 'bg-signal ring-signal/30 animate-pulse w-4 h-4'
                    : isNight
                    ? 'bg-cyan-400 ring-cyan-500/20'
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
                      'font-bold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1.5',
                      isHighlight
                        ? 'bg-signal text-deep-ground font-extrabold shadow-sm'
                        : isNight
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                        : isDay1
                        ? 'bg-signal/15 text-signal border border-signal/30'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    )}
                  >
                    {isNight && <Moon className="w-3 h-3 text-cyan-300" />}
                    {isHighlight && <Trophy className="w-3 h-3 text-deep-ground" />}
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
