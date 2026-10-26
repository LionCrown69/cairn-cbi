'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  status: 'completed' | 'verified' | 'submitted';
  order: number;
};

export const HACKATHON_SPRINT_DATA: HackathonMilestone[] = [
  {
    id: 'd1-1200',
    day: 1,
    dayBadge: 'DAY 1',
    time: '12:00 PM',
    isoTime: '12:00',
    category: 'RESEARCH & INTAKE',
    title: 'Check-in, Research & Domain Intake',
    summary:
      'Joined the sprint at noon. Deep-dived into alpine search and rescue telemetry, radio occlusion physics in 3,000m granite couloirs, and high-stress command design patterns.',
    deliverables: ['Alpine RF Physics', 'Telemetry Study', 'Problem Scope'],
    status: 'completed',
    order: 1,
  },
  {
    id: 'd1-1300',
    day: 1,
    dayBadge: 'DAY 1',
    time: '01:00 PM',
    isoTime: '13:00',
    category: 'IDENTITY & ETHICS',
    title: 'Project Name (CAIRN) & Mission Architecture',
    summary:
      'Scoped mission purely around backcountry team coordination and mountain rescue. Formulated strict ethical boundaries: 100% peaceful offline mesh, strictly zero weapons scope.',
    deliverables: ['Mission Architecture', '3 Operational Promises', 'Synthetic Scenario Spec'],
    status: 'completed',
    order: 2,
  },
  {
    id: 'd1-1400',
    day: 1,
    dayBadge: 'DAY 1',
    time: '02:00 PM',
    isoTime: '14:00',
    category: 'ARCHITECTURE & STACK',
    title: 'Full-Stack Setup & Architecture Foundation',
    summary:
      'Bootstrapped Next.js 15 App router with TypeScript strict mode, Tailwind CSS tactical tokens, Zustand reactive store with Dexie IndexedDB persistence, and Vitest test suite.',
    deliverables: ['Next.js 15 App Router', 'Zustand + Dexie Store', 'TypeScript Strict Config'],
    status: 'completed',
    order: 3,
  },
  {
    id: 'd1-1600',
    day: 1,
    dayBadge: 'DAY 1',
    time: '04:00 PM',
    isoTime: '16:00',
    category: 'VECTOR LANDSCAPE & DEM',
    title: 'Vector Landscape & Elevation Raycasting Math',
    summary:
      'Engineered procedural alpine DEM elevation model and 40-step ray clearance algorithm. Calculated Fresnel zone obstructions across ridges to model line-of-sight propagation.',
    deliverables: ['Procedural Alpine DEM', '40-Step LOS Raycaster', 'Fresnel Occlusion Math'],
    status: 'completed',
    order: 4,
  },
  {
    id: 'd1-1700',
    day: 1,
    dayBadge: 'DAY 1',
    time: '05:00 PM',
    isoTime: '17:00',
    category: 'UI & DESIGN SYSTEM',
    title: 'Design System & Spatial HUD Panels',
    summary:
      'Engineered responsive UI foundation: minimal glass panels, JetBrains Mono telemetry, Space Grotesk labels, high-visibility signal lime, and sleek top navigation.',
    deliverables: ['Tactile Glass Panels', 'Responsive Layout', 'Telemetry Header Bar'],
    status: 'completed',
    order: 5,
  },
  {
    id: 'd1-1800',
    day: 1,
    dayBadge: 'DAY 1',
    time: '06:00 PM',
    isoTime: '18:00',
    category: '3D WEBGL MASSIF',
    title: '3D Mountain Massif & Terrain Shaders',
    summary:
      'Sculpted 3D mountain relief mesh using Three.js and custom shaders. Added glowing topographic wireframe crests, summit beacons, and animated parabolic packet delivery curves.',
    deliverables: ['Three.js Sculpted Massif', 'Glowing Wireframe', 'Parabolic Packet Arcs'],
    status: 'completed',
    order: 6,
  },
  {
    id: 'd1-2000',
    day: 1,
    dayBadge: 'DAY 1',
    time: '08:00 PM',
    isoTime: '20:00',
    category: 'DAY 1 CODE FREEZE',
    title: 'Day 1 Wrap, Code Freeze & Validation',
    summary:
      'Concluded Day 1 sprint. Validated all core model tests in Vitest, confirmed offline store-and-forward caching, and locked Day 2 roadmap.',
    deliverables: ['Vitest 5/5 Passing', 'Offline Caching Verified', 'Day 2 Sprint Backlog'],
    status: 'verified',
    order: 7,
  },
  {
    id: 'd2-1000',
    day: 2,
    dayBadge: 'DAY 2',
    time: '10:00 AM',
    isoTime: '10:00',
    category: 'DAY 2 KICKOFF',
    title: 'Day 2 Standup & Sprint Alignment',
    summary:
      'Reconvened at 10:00 AM for Day 2 standup. Set the 10-hour sprint roadmap: verifiable AI situational digest, live Mapbox 3D integration, and field console completion.',
    deliverables: ['Day 2 Standup', 'AI Prompt Spec', 'Mapbox Integration Plan'],
    status: 'completed',
    order: 8,
  },
  {
    id: 'd2-1200',
    day: 2,
    dayBadge: 'DAY 2',
    time: '12:00 PM',
    isoTime: '12:00',
    category: 'AI ENGINE & GUARDRAILS',
    title: 'Verifiable AI Situational Digest Engine',
    summary:
      'Constructed AI situational reasoning layer with XML prompt delimiters and strict numeric whitelist guardrails. Automatically rejects ungrounded metric hallucinations.',
    deliverables: ['XML Delimited Prompts', 'Numeric Whitelist Regex', 'Deterministic Fallback'],
    status: 'completed',
    order: 9,
  },
  {
    id: 'd2-1400',
    day: 2,
    dayBadge: 'DAY 2',
    time: '02:00 PM',
    isoTime: '14:00',
    category: 'MAPBOX 3D TERRAIN',
    title: 'Live Mapbox 3D Terrain & Flight Camera',
    summary:
      'Integrated real-world Valais Alps digital elevation tiles via Mapbox GL. Implemented 360° terrain orbit camera, interactive node markers, dynamic active route lines, and vector fallback.',
    deliverables: ['Mapbox GL 3D Terrain', 'Cinematic Orbit Camera', 'Live Station Markers'],
    status: 'completed',
    order: 10,
  },
  {
    id: 'd2-1600',
    day: 2,
    dayBadge: 'DAY 2',
    time: '04:00 PM',
    isoTime: '16:00',
    category: 'DESIGN LABS',
    title: 'Multi-Paradigmatic Design Lab Matrix',
    summary:
      'Created exploratory lab routes across Cinematic Tactical, Cartographic Scientific, and Minimalist Editorial paradigms to test operator ergonomics.',
    deliverables: ['Exploratory Lab Routes', 'Ergonomic Benchmarks', 'Telemetry Evaluation'],
    status: 'completed',
    order: 11,
  },
  {
    id: 'd2-1800',
    day: 2,
    dayBadge: 'DAY 2',
    time: '06:00 PM',
    isoTime: '18:00',
    category: 'RESILIENCE TESTING',
    title: 'Dynamic Healing & Fault Simulation',
    summary:
      'Simulated severe mountain storm dropouts and relay station power losses. Demonstrated automatic store-and-forward message buffer queueing and dynamic multi-hop rerouting.',
    deliverables: ['Node Severance Sim', 'Store-and-Forward Queue', 'Zero Packet Drops'],
    status: 'verified',
    order: 12,
  },
  {
    id: 'd2-1930',
    day: 2,
    dayBadge: 'DAY 2',
    time: '07:30 PM',
    isoTime: '19:30',
    category: 'ACCESSIBILITY & POLISH',
    title: 'Accessibility Audit & Interaction Polish',
    summary:
      'Completed comprehensive accessibility and performance pass. Configured keyboard shortcut modal, focus indicators, and smooth 60fps responsiveness.',
    deliverables: ['WCAG AA Pass', 'Keyboard Shortcut Modal', 'Performance Tuning'],
    status: 'completed',
    order: 13,
  },
  {
    id: 'd2-2000',
    day: 2,
    dayBadge: 'DAY 2',
    time: '08:00 PM',
    isoTime: '20:00',
    category: 'FINAL SUBMISSION',
    title: 'Final Submission & Production Deployment',
    summary:
      'Cut final production release. Validated all routes with zero build errors, verified responsive layout, and deployed operational demonstration.',
    deliverables: ['Production Release', 'Zero Build Errors', 'Operational Demo Ready'],
    status: 'submitted',
    order: 14,
  },
];

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  showDayFilters?: boolean;
  initialDayFilter?: 'all' | 1 | 2;
  className?: string;
}

export default function Timeline({
  title = 'Engineering Sprint Log',
  subtitle = 'Chronological engineering timeline tracking architecture, physics modeling, and deployment.',
  showDayFilters = true,
  initialDayFilter = 'all',
  className,
}: TimelineProps) {
  const [dayFilter, setDayFilter] = useState<'all' | 1 | 2>(initialDayFilter);

  const filteredMilestones = useMemo(() => {
    if (dayFilter === 'all') return HACKATHON_SPRINT_DATA;
    return HACKATHON_SPRINT_DATA.filter((m) => m.day === dayFilter);
  }, [dayFilter]);

  const handleFilterChange = useCallback((filter: 'all' | 1 | 2) => {
    setDayFilter(filter);
  }, []);

  return (
    <section className={cn('py-20 px-6 sm:px-12 max-w-5xl mx-auto w-full border-b border-white/[0.08]', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-signal mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span>Sprint Chronicle</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-ink">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-mute font-sans mt-2 max-w-xl">{subtitle}</p>}
        </div>

        {/* Day Filters */}
        {showDayFilters && (
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-mono shrink-0">
            <button
              onClick={() => handleFilterChange('all')}
              className={cn(
                'px-3 py-1 rounded-full transition-all',
                dayFilter === 'all' ? 'bg-signal text-deep-ground font-bold' : 'text-mute hover:text-ink'
              )}
            >
              All (14)
            </button>
            <button
              onClick={() => handleFilterChange(1)}
              className={cn(
                'px-3 py-1 rounded-full transition-all',
                dayFilter === 1 ? 'bg-signal text-deep-ground font-bold' : 'text-mute hover:text-ink'
              )}
            >
              Day 1 (7)
            </button>
            <button
              onClick={() => handleFilterChange(2)}
              className={cn(
                'px-3 py-1 rounded-full transition-all',
                dayFilter === 2 ? 'bg-signal text-deep-ground font-bold' : 'text-mute hover:text-ink'
              )}
            >
              Day 2 (7)
            </button>
          </div>
        )}
      </div>

      {/* Streamlined Clean Timeline */}
      <div className="relative pt-10 pl-4 sm:pl-8 space-y-10 before:absolute before:left-0 sm:before:left-2 before:top-12 before:bottom-6 before:w-px before:bg-white/[0.1]">
        {filteredMilestones.map((item) => {
          const isDay1 = item.day === 1;

          return (
            <div key={item.id} className="relative group">
              {/* Minimal Timeline Dot */}
              <div
                className={cn(
                  'absolute -left-4 sm:-left-8 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-1/2 ring-4 ring-deep-ground transition-all',
                  isDay1 ? 'bg-signal' : 'bg-caution'
                )}
              />

              <div className="space-y-2">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className={cn('font-bold', isDay1 ? 'text-signal' : 'text-caution')}>
                    {item.dayBadge} · {item.time}
                  </span>
                  <span className="text-white/20">/</span>
                  <span className="text-mute uppercase tracking-wider text-[11px]">{item.category}</span>
                  <span className="ml-auto text-mute/60 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-signal" />
                    <span className="capitalize">{item.status}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-sans font-bold text-lg text-ink group-hover:text-signal transition-colors">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="font-sans text-xs sm:text-sm text-mute leading-relaxed max-w-2xl">
                  {item.summary}
                </p>

                {/* Deliverable tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.deliverables.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface/50 border border-white/[0.06] text-ink/80"
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
