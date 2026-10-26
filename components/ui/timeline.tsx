"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Radio,
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  Mountain,
  Terminal,
  ArrowRight,
  Sliders,
  Eye,
  Activity,
  Award,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/soundEffects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type HackathonMilestone = {
  id: string;
  day: 1 | 2;
  dayBadge: string;
  time: string;
  isoTime: string;
  category: string;
  categoryIcon: "research" | "identity" | "code" | "math" | "ui" | "3d" | "ai" | "map" | "lab" | "resilience" | "a11y" | "launch";
  title: string;
  summary: string;
  deliverables: string[];
  status: "completed" | "verified" | "submitted";
  order: number;
};

export const HACKATHON_SPRINT_DATA: HackathonMilestone[] = [
  // DAY 1 (Started at 12:00 PM, wrapped at 08:00 PM)
  {
    id: "d1-1200",
    day: 1,
    dayBadge: "DAY 1",
    time: "12:00 PM",
    isoTime: "12:00",
    category: "RESEARCH & INTAKE",
    categoryIcon: "research",
    title: "Check-in, Research & Domain Intake",
    summary:
      "Joined the hackathon at noon. Deep-dived into alpine search and rescue telemetry, radio occlusion physics in 3,000m granite couloirs, and studied SerenX & F1 high-stress command design patterns.",
    deliverables: ["Team Intake", "Alpine RF Physics", "SerenX Telemetry Study", "Problem Scope"],
    status: "completed",
    order: 1,
  },
  {
    id: "d1-1300",
    day: 1,
    dayBadge: "DAY 1",
    time: "01:00 PM",
    isoTime: "13:00",
    category: "IDENTITY & ETHICS",
    categoryIcon: "identity",
    title: "Project Name (CAIRN) & Problem Statement",
    summary:
      "Locked project identity: CAIRN. Scoped the mission purely around backcountry team coordination and mountain rescue. Formulated strict ethical boundaries: 100% peaceful offline mesh, strictly zero weapons or targeting scope.",
    deliverables: ["Name Locked: CAIRN", "3 Operational Promises", "Non-Weapons Guarantee", "Synthetic Scenario Spec"],
    status: "completed",
    order: 2,
  },
  {
    id: "d1-1400",
    day: 1,
    dayBadge: "DAY 1",
    time: "02:00 PM",
    isoTime: "14:00",
    category: "ARCHITECTURE & STACK",
    categoryIcon: "code",
    title: "Full-Stack Setup & Website Foundation",
    summary:
      "Bootstrapped Next.js 15 App router with TypeScript strict mode, Tailwind CSS tactical tokens, Zustand reactive store with IndexedDB persistence (Dexie), and Vitest test harness for deterministic verification.",
    deliverables: ["Next.js 15 App Router", "Zustand + Dexie Store", "TypeScript Strict Config", "Vitest Setup"],
    status: "completed",
    order: 3,
  },
  {
    id: "d1-1600",
    day: 1,
    dayBadge: "DAY 1",
    time: "04:00 PM",
    isoTime: "16:00",
    category: "VECTOR LANDSCAPE & DEM",
    categoryIcon: "math",
    title: "Vector Landscape & Elevation Raycasting Math",
    summary:
      "Engineered mathematical procedural alpine DEM elevation function and 40-step ray clearance algorithm. Calculated Fresnel zone obstructions across ridges to model line-of-sight propagation between mountain stations.",
    deliverables: ["Procedural Alpine DEM", "40-Step LOS Raycaster", "Fresnel Occlusion Math", "SVG Profile Generator"],
    status: "completed",
    order: 4,
  },
  {
    id: "d1-1700",
    day: 1,
    dayBadge: "DAY 1",
    time: "05:00 PM",
    isoTime: "17:00",
    category: "UI & DESIGN SYSTEM",
    categoryIcon: "ui",
    title: "Website UI, HUD Panels & Navigation",
    summary:
      "Finalized responsive UI foundation: Tactical Glass HUD panels, JetBrains Mono telemetry, Space Grotesk labels, high-visibility Signal Lime (#D4F53C) and Caution Orange (#FF8A3D), and top telemetry navbar.",
    deliverables: ["Tactical Glass Panels", "Responsive Layouts", "High-Contrast Palette", "Telemetry Header Bar"],
    status: "completed",
    order: 5,
  },
  {
    id: "d1-1800",
    day: 1,
    dayBadge: "DAY 1",
    time: "06:00 PM",
    isoTime: "18:00",
    category: "3D WEBGL MASSIF",
    categoryIcon: "3d",
    title: "3D Mountain Massif & Terrain Shaders",
    summary:
      "Scupltured a faceted 3D mountain relief mesh using Three.js and custom shaders. Added glowing topographic wireframe crests, summit beacons, and animated parabolic packet delivery curves across the ridgeline.",
    deliverables: ["Three.js Sculpted Massif", "Glowing Ridge Wireframe", "Beacon Pulses", "Parabolic Packet Arcs"],
    status: "completed",
    order: 6,
  },
  {
    id: "d1-2000",
    day: 1,
    dayBadge: "DAY 1",
    time: "08:00 PM",
    isoTime: "20:00",
    category: "DAY 1 CODE FREEZE",
    categoryIcon: "launch",
    title: "Day 1 Wrap, Code Freeze & Test Validation",
    summary:
      "Concluded Day 1 sprint at 08:00 PM (end of day hackathon window). Validated all 5 core model tests in Vitest, confirmed offline store-and-forward caching, and scheduled Day 2 standup for 10:00 AM.",
    deliverables: ["Vitest 5/5 Passing", "Offline Caching Verified", "Topology Log Sealed", "Day 2 Sprint Backlog"],
    status: "verified",
    order: 7,
  },

  // DAY 2 (Started at 10:00 AM, final submission at 08:00 PM)
  {
    id: "d2-1000",
    day: 2,
    dayBadge: "DAY 2",
    time: "10:00 AM",
    isoTime: "10:00",
    category: "DAY 2 KICKOFF",
    categoryIcon: "launch",
    title: "Day 2 Standup & Roadmap Alignment",
    summary:
      "Reconvened at 10:00 AM for Day 2 standup. Set the 10-hour sprint roadmap leading to the 08:00 PM submission deadline: AI situational digest, live Mapbox 3D integration, 9-route lab matrix, and judge walkthrough.",
    deliverables: ["Day 2 Standup", "10H Countdown Locked", "AI Prompt Spec", "Mapbox Integration Plan"],
    status: "completed",
    order: 8,
  },
  {
    id: "d2-1200",
    day: 2,
    dayBadge: "DAY 2",
    time: "12:00 PM",
    isoTime: "12:00",
    category: "AI ENGINE & GUARDRAILS",
    categoryIcon: "ai",
    title: "Verifiable AI Situational Digest Engine",
    summary:
      "Constructed AI situational reasoning layer with XML prompt delimiters and strict numeric whitelist guardrails. Automatically rejects ungrounded metric hallucinations and falls back safely to deterministic rules.",
    deliverables: ["XML Delimited Prompts", "Numeric Whitelist Regex", "Deterministic Fallback", "Provenance Tags"],
    status: "completed",
    order: 9,
  },
  {
    id: "d2-1400",
    day: 2,
    dayBadge: "DAY 2",
    time: "02:00 PM",
    isoTime: "14:00",
    category: "MAPBOX 3D TERRAIN",
    categoryIcon: "map",
    title: "Live Mapbox 3D Terrain & Satellite Flight",
    summary:
      "Integrated real-world Valais Alps digital elevation tiles via Mapbox GL v8. Implemented cinematic 360° terrain orbit camera, interactive node markers, dynamic active route lines, and offline vector fallback.",
    deliverables: ["Mapbox GL v8 Terrain", "360° Cinematic Orbit", "Live Station Markers", "Offline Vector Fallback"],
    status: "completed",
    order: 10,
  },
  {
    id: "d2-1600",
    day: 2,
    dayBadge: "DAY 2",
    time: "04:00 PM",
    isoTime: "16:00",
    category: "DEFENSE DESIGN LABS",
    categoryIcon: "lab",
    title: "9-Route Design Lab & Telemetry Matrix",
    summary:
      "Created 9 exploratory lab routes across Cinematic Tactical, Cartographic Scientific, and Minimalist Editorial paradigms. Documented trade-offs for mountain search & rescue ergonomics.",
    deliverables: ["9 Exploratory Lab Routes", "3 Design Paradigms", "Telemetry Benchmarks", "Operator Ergonomics"],
    status: "completed",
    order: 11,
  },
  {
    id: "d2-1800",
    day: 2,
    dayBadge: "DAY 2",
    time: "06:00 PM",
    isoTime: "18:00",
    category: "RESILIENCE TESTING",
    categoryIcon: "resilience",
    title: "Dynamic Healing & Fault Simulation",
    summary:
      "Simulated severe mountain storm dropouts and relay station power losses. Demonstrated automatic store-and-forward message buffer queueing and dynamic multi-hop rerouting with zero packet loss.",
    deliverables: ["Node Severance Sim", "Store-and-Forward Queue", "Auto-Rerouting", "Zero Packet Drops"],
    status: "verified",
    order: 12,
  },
  {
    id: "d2-1930",
    day: 2,
    dayBadge: "DAY 2",
    time: "07:30 PM",
    isoTime: "19:30",
    category: "ACCESSIBILITY & POLISH",
    categoryIcon: "a11y",
    title: "WCAG AA Audit & Keyboard Shortcut Suite",
    summary:
      "Completed comprehensive accessibility and performance pass. Wired [?] shortcut cheat-sheet modal, [C] console jump, high-contrast focus rings, ARIA-live event log announcements, and sub-100ms interaction speed.",
    deliverables: ["WCAG 2.1 AA Pass", "Keyboard [?] Modal", "ARIA-Live Event Log", "Sub-100ms Responsiveness"],
    status: "completed",
    order: 13,
  },
  {
    id: "d2-2000",
    day: 2,
    dayBadge: "DAY 2",
    time: "08:00 PM",
    isoTime: "20:00",
    category: "FINAL SUBMISSION",
    categoryIcon: "launch",
    title: "Final Submission & Production Deployment",
    summary:
      "Cut final production build at exactly 08:00 PM. Deployed 19 static routes with zero errors, published 3D terrain designer brief, and delivered live interactive demonstration to hackathon evaluators.",
    deliverables: ["Production Release", "0 Build Errors", "3D Terrain Brief Ready", "Live Demo Completed"],
    status: "submitted",
    order: 14,
  },
];

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  showDayFilters?: boolean;
  initialDayFilter?: "all" | 1 | 2;
  className?: string;
}

export default function Timeline({
  title = "2-Day Hackathon Sprint Timeline",
  subtitle = "Chronological engineering log of CAIRN from Day 1 intake (12:00 PM) to Day 2 final submission (08:00 PM). Daily sprint window: 08:00 AM – 08:00 PM.",
  showDayFilters = true,
  initialDayFilter = "all",
  className = "",
}: TimelineProps) {
  const [dayFilter, setDayFilter] = useState<"all" | 1 | 2>(initialDayFilter);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("d1-1200");
  const [viewMode, setViewMode] = useState<"track" | "stream">("track");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredMilestones = useMemo(() => {
    if (dayFilter === "all") return HACKATHON_SPRINT_DATA;
    return HACKATHON_SPRINT_DATA.filter((m) => m.day === dayFilter);
  }, [dayFilter]);

  // Sync active milestone when filter changes
  useEffect(() => {
    if (filteredMilestones.length > 0) {
      const exists = filteredMilestones.some((m) => m.id === activeMilestoneId);
      if (!exists) {
        setActiveMilestoneId(filteredMilestones[0].id);
      }
    }
  }, [dayFilter, filteredMilestones, activeMilestoneId]);

  const activeMilestone = useMemo(() => {
    return (
      HACKATHON_SPRINT_DATA.find((m) => m.id === activeMilestoneId) ||
      HACKATHON_SPRINT_DATA[0]
    );
  }, [activeMilestoneId]);

  const activeIndex = useMemo(() => {
    return filteredMilestones.findIndex((m) => m.id === activeMilestone.id);
  }, [filteredMilestones, activeMilestone]);

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= filteredMilestones.length) return;
    sound.playClick();
    const target = filteredMilestones[index];
    setActiveMilestoneId(target.id);

    if (scrollContainerRef.current) {
      const cardEl = scrollContainerRef.current.querySelector(
        `[data-milestone-id="${target.id}"]`
      ) as HTMLElement | null;
      if (cardEl) {
        cardEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, activeIndex - 1);
    scrollToIndex(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(filteredMilestones.length - 1, activeIndex + 1);
    scrollToIndex(nextIdx);
  };

  // Keyboard navigation when user interacts with timeline
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const getCategoryIcon = (iconName: HackathonMilestone["categoryIcon"]) => {
    switch (iconName) {
      case "research":
        return <Eye className="w-4 h-4" />;
      case "identity":
        return <Radio className="w-4 h-4" />;
      case "code":
        return <Terminal className="w-4 h-4" />;
      case "math":
        return <Activity className="w-4 h-4" />;
      case "ui":
        return <Layers className="w-4 h-4" />;
      case "3d":
        return <Mountain className="w-4 h-4" />;
      case "ai":
        return <Cpu className="w-4 h-4" />;
      case "map":
        return <Sparkles className="w-4 h-4" />;
      case "lab":
        return <Sliders className="w-4 h-4" />;
      case "resilience":
        return <ShieldCheck className="w-4 h-4" />;
      case "a11y":
        return <CheckCircle2 className="w-4 h-4" />;
      case "launch":
        return <Award className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="hackathon-timeline"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full bg-deep-ground text-ink py-16 px-4 sm:px-8 border-b border-line focus:outline-none focus:ring-1 focus:ring-signal/40",
        className
      )}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-signal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-caution/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-surface border border-line text-signal font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                Live Build Log
              </span>
              <span className="text-xs font-mono text-mute uppercase tracking-widest">
                2-Day Event · 8:00 AM – 8:00 PM Window
              </span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-tight-display text-ink">
              {title}
            </h2>

            <p className="font-sans text-xs sm:text-sm text-mute max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* VIEW CONTROLS & FILTER TABS */}
          <div className="flex flex-wrap items-center gap-3">
            {showDayFilters && (
              <div className="flex items-center rounded-lg bg-surface border border-line p-1">
                <button
                  type="button"
                  onClick={() => setDayFilter("all")}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all",
                    dayFilter === "all"
                      ? "bg-signal text-deep-ground shadow-glow-signal"
                      : "text-mute hover:text-ink"
                  )}
                >
                  All (14)
                </button>
                <button
                  type="button"
                  onClick={() => setDayFilter(1)}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5",
                    dayFilter === 1
                      ? "bg-signal text-deep-ground shadow-glow-signal"
                      : "text-mute hover:text-ink"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-signal inline-block" />
                  Day 1 (7)
                </button>
                <button
                  type="button"
                  onClick={() => setDayFilter(2)}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5",
                    dayFilter === 2
                      ? "bg-caution text-deep-ground shadow-glow-caution"
                      : "text-mute hover:text-ink"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-caution inline-block" />
                  Day 2 (7)
                </button>
              </div>
            )}

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg bg-surface border border-line p-1">
              <button
                type="button"
                onClick={() => setViewMode("track")}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-mono uppercase transition-all",
                  viewMode === "track"
                    ? "bg-ground text-signal font-bold border border-line"
                    : "text-mute hover:text-ink"
                )}
                title="Horizontal mission track view"
              >
                Track View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("stream")}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-mono uppercase transition-all",
                  viewMode === "stream"
                    ? "bg-ground text-signal font-bold border border-line"
                    : "text-mute hover:text-ink"
                )}
                title="Vertical stream feed view"
              >
                Stream View
              </button>
            </div>

            {/* Arrow Nav (for Track mode) */}
            {viewMode === "track" && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeIndex <= 0}
                  aria-label="Previous milestone"
                  className="w-8 h-8 rounded bg-surface border border-line flex items-center justify-center text-ink hover:text-signal hover:border-signal/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={activeIndex >= filteredMilestones.length - 1}
                  aria-label="Next milestone"
                  className="w-8 h-8 rounded bg-surface border border-line flex items-center justify-center text-ink hover:text-signal hover:border-signal/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS SCRUBBER BAR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-mute">
            <div className="flex items-center gap-2">
              <span className="text-signal font-bold">
                {activeMilestone.dayBadge} · {activeMilestone.time}
              </span>
              <span>—</span>
              <span className="text-ink font-bold truncate max-w-xs sm:max-w-md">
                {activeMilestone.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                SPRINT {activeIndex + 1} OF {filteredMilestones.length}
              </span>
              <span className="text-signal font-bold">
                {Math.round(((activeIndex + 1) / filteredMilestones.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-ground rounded-full overflow-hidden border border-line/60 relative">
            <div
              className="h-full bg-gradient-to-r from-signal via-signal to-caution transition-all duration-300 rounded-full"
              style={{
                width: `${((activeIndex + 1) / filteredMilestones.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* VIEW MODE 1: HORIZONTAL MISSION TRACK */}
        {viewMode === "track" && (
          <div className="relative">
            {/* Scrollable horizontal ribbon */}
            <div
              ref={scrollContainerRef}
              className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {filteredMilestones.map((item, idx) => {
                const isActive = item.id === activeMilestone.id;
                const isDay1 = item.day === 1;

                return (
                  <div
                    key={item.id}
                    data-milestone-id={item.id}
                    onClick={() => setActiveMilestoneId(item.id)}
                    className={cn(
                      "group relative w-[320px] sm:w-[380px] shrink-0 snap-center rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between",
                      "border backdrop-blur-md",
                      isActive
                        ? isDay1
                          ? "bg-surface/90 border-signal shadow-glow-signal ring-1 ring-signal/50"
                          : "bg-surface/90 border-caution shadow-glow-caution ring-1 ring-caution/50"
                        : "bg-surface/50 border-line hover:border-line/90 hover:bg-surface/70"
                    )}
                  >
                    {/* Corner tactical HUD notches */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-mute/50" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-mute/50" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-mute/50" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-mute/50" />

                    {/* Top Row: Day Badge, Time, and Category Icon */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border",
                              isDay1
                                ? "bg-signal/15 text-signal border-signal/40"
                                : "bg-caution/15 text-caution border-caution/40"
                            )}
                          >
                            {item.dayBadge}
                          </span>
                          <span className="font-mono text-xs font-bold text-ink">
                            {item.time}
                          </span>
                        </div>

                        <div
                          className={cn(
                            "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                            isDay1
                              ? "bg-signal/10 border-signal/30 text-signal"
                              : "bg-caution/10 border-caution/30 text-caution"
                          )}
                        >
                          {getCategoryIcon(item.categoryIcon)}
                        </div>
                      </div>

                      {/* Category Label */}
                      <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-mute">
                        {item.category}
                      </div>

                      {/* Milestone Title */}
                      <h3 className="font-sans font-bold text-base sm:text-lg text-ink leading-snug group-hover:text-signal transition-colors">
                        {item.title}
                      </h3>

                      {/* Milestone Description */}
                      <p className="font-sans text-xs text-mute leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {/* Deliverable Tags & Status Footer */}
                    <div className="mt-6 pt-4 border-t border-line/60 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {item.deliverables.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-ground/80 border border-line text-[10px] font-mono text-ink/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                        <span className="text-mute flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>SPRINT #{item.order}</span>
                        </span>
                        <span
                          className={cn(
                            "font-bold uppercase tracking-wider flex items-center gap-1",
                            item.status === "submitted"
                              ? "text-signal"
                              : item.status === "verified"
                              ? "text-signal"
                              : "text-mute"
                          )}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick-jump thumbnail ribbon */}
            <div className="pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-t border-line/40">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
                {filteredMilestones.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => scrollToIndex(filteredMilestones.findIndex((x) => x.id === m.id))}
                    className={cn(
                      "px-2.5 py-1 rounded text-[11px] font-mono transition-all border shrink-0",
                      m.id === activeMilestone.id
                        ? m.day === 1
                          ? "bg-signal text-deep-ground font-bold border-signal shadow-glow-signal"
                          : "bg-caution text-deep-ground font-bold border-caution shadow-glow-caution"
                        : "bg-surface text-mute border-line hover:text-ink hover:border-mute"
                    )}
                  >
                    {m.dayBadge.replace("DAY ", "D")}:{m.time}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-mono text-mute shrink-0 hidden lg:block">
                Use <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-ink">←</kbd>{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-ink">→</kbd> keys to navigate
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: VERTICAL STREAM FEED */}
        {viewMode === "stream" && (
          <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-px before:bg-gradient-to-b before:from-signal via-line to-caution">
            {filteredMilestones.map((item) => {
              const isDay1 = item.day === 1;

              return (
                <div key={item.id} className="relative group">
                  {/* Glowing Node Dot */}
                  <div
                    className={cn(
                      "absolute -left-6 sm:-left-10 top-5 w-4 h-4 rounded-full -translate-x-1/2 flex items-center justify-center transition-all",
                      isDay1
                        ? "bg-signal text-deep-ground shadow-glow-signal ring-4 ring-deep-ground"
                        : "bg-caution text-deep-ground shadow-glow-caution ring-4 ring-deep-ground"
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-deep-ground" />
                  </div>

                  {/* Card Content */}
                  <div className="cairn-glass p-6 rounded-xl border border-line hover:border-signal/50 transition-all space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase tracking-wider border",
                            isDay1
                              ? "bg-signal/15 text-signal border-signal/40"
                              : "bg-caution/15 text-caution border-caution/40"
                          )}
                        >
                          {item.dayBadge}
                        </span>
                        <span className="font-mono text-sm font-bold text-ink">
                          {item.time}
                        </span>
                        <span className="text-mute text-xs font-mono uppercase tracking-widest hidden sm:inline">
                          · {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-mute">
                        <span className="uppercase text-[10px] tracking-wider text-signal font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-sans font-bold text-lg text-ink">
                        {item.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-mute leading-relaxed mt-1">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-line/60">
                      {item.deliverables.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded bg-ground border border-line text-xs font-mono text-ink/80"
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
        )}

        {/* FOOTER CALLOUT / HACKATHON CONTEXT NOTE */}
        <div className="p-5 rounded-xl bg-surface/60 border border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-signal/10 border border-signal/30 flex items-center justify-center text-signal shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-ink font-bold block">
                2-Day Rapid Sprints · Natural Schedule
              </span>
              <span className="text-mute">
                Day 1 (12:00 PM kickoff → 08:00 PM wrap) &bull; Day 2 (10:00 AM start → 08:00 PM final delivery). Zero dropped packets.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded bg-signal/20 text-signal border border-signal/40 font-bold uppercase">
              100% Sprints Completed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
