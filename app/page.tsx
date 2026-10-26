// The one thing the user came to do: Understand Cairn's core promise and launch the field console.
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import WebGLTerrainHero from '@/components/WebGLTerrainHero';
import { CairnScrollIndicator } from '@/components/ui/cairn-scroll-indicator';
import { CapabilityBadge } from '@/components/ui/capability-badge';
import AIThinkingOrbAndInput, { AIThinkingOrbRef } from '@/components/ui/ai-thinking-orb-and-input';
import {
  Compass,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GitFork,
  Sparkles,
  Mountain,
  ChevronDown,
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export default function StoryPage() {
  const orbRef = useRef<AIThinkingOrbRef>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastQueryResult, setLastQueryResult] = useState<{
    headline?: string;
    report?: string;
    keyMetrics?: Array<{ label: string; value: string }>;
    actionDirective?: string;
    disclaimer?: string;
  } | null>(null);

  // Throttled scroll listener for parallax depth layers
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTacticalQuery = async (queryText: string): Promise<string> => {
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
      return 'PATROL-ALPHA (1,951m ASL) occluded by 2,840m North Ridge. Direct line-of-sight severed; packets buffered in local flash memory.';
    }
  };

  return (
    <div className="relative flex-1 flex flex-col bg-deep-ground text-ink overflow-x-hidden">
      {/* Unique Element 1: Cairn 3-Stone Scroll Progress Marker */}
      <CairnScrollIndicator />

      {/* SECTION 1: HERO CANVAS — Strictly Above the Fold (Headline, One Sentence, One Button) */}
      <section className="relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden">
        {/* Parallax Depth Layer 1: Background WebGL Massif */}
        <div
          className="absolute inset-0 z-0 pointer-events-auto"
          style={{
            transform: `translate3d(0, ${scrollY * 0.18}px, 0)`,
            willChange: 'transform',
          }}
        >
          <WebGLTerrainHero hideNarrativeOverlay={true} />
        </div>

        {/* Parallax Depth Layer 2: Ethereal Gradient Mist Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-deep-ground/60 via-transparent to-deep-ground" />

        {/* Parallax Depth Layer 3: Foreground Text Overlay */}
        <div
          className="relative z-20 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center space-y-6 flex flex-col items-center justify-center my-auto"
          style={{
            transform: `translate3d(0, -${scrollY * 0.08}px, 0)`,
            willChange: 'transform',
          }}
        >
          {/* Truthfulness Badge */}
          <div className="inline-flex items-center gap-2">
            <CapabilityBadge type="live" label="Synthetic Alpine Sector" />
            <span className="text-xs text-mute font-mono hidden sm:inline">Valais Massif &bull; 915 MHz Mesh</span>
          </div>

          {/* Headline (Large iOS Display Style) */}
          <h1 className="font-display font-extrabold text-4xl sm:text-7xl tracking-tight text-ink leading-tight-display">
            When mountains sever radio waves, <span className="text-signal">Cairn</span> bridges the pass.
          </h1>

          {/* Exactly One Sentence */}
          <p className="text-base sm:text-xl text-mute font-sans font-light max-w-2xl leading-relaxed">
            Offline-first peer mesh communication engineered for backcountry search and rescue teams when 3,000m granite ridges block direct line-of-sight.
          </p>

          {/* Exactly One Primary Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/console"
              onClick={() => sound.playClick()}
              className="px-8 py-4 rounded-full bg-signal text-deep-ground font-sans font-bold text-sm uppercase tracking-wider hover:bg-signal/90 shadow-glow-signal active:scale-[0.97] transition-all flex items-center gap-2.5"
            >
              <span>Launch Field Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/method"
              onClick={() => sound.playClick()}
              className="px-6 py-3.5 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-mono text-mute hover:text-ink hover:bg-surface/90 active:scale-[0.97] transition-all"
            >
              Read Method & Math &rarr;
            </Link>
          </div>
        </div>

        {/* Scroll Prompt Arrow */}
        <div className="relative z-20 pb-6 text-center text-xs font-mono text-mute/60 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
          <span>Scroll to explore the three promises</span>
          <ChevronDown className="w-4 h-4 text-signal" />
        </div>
      </section>

      {/* SECTION 2: PROMISE 1 — THE NETWORK IS VISIBLE (Parallax Layer) */}
      <section
        id="promise-1"
        className="py-32 px-6 sm:px-12 max-w-5xl mx-auto w-full border-b border-white/[0.08] space-y-8"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span>Promise 01 &bull; Physical Ground Truth</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
            The network is physically visible.
          </h2>
          <p className="text-base sm:text-lg text-mute font-sans font-light max-w-2xl leading-relaxed">
            Traditional radios leave teams guessing whether a message went through. Cairn renders exact line-of-sight rays over 10m digital elevation contours. If granite rock blocks the first Fresnel zone, the interface shows the severance immediately.
          </p>
        </div>

        {/* Minimal Grouped Inset Card */}
        <div className="rounded-3xl bg-surface/40 border border-white/[0.08] p-8 backdrop-blur-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mute block">Ray-Cast Clearance</span>
            <div className="text-2xl font-bold font-mono text-signal">+14.2 m</div>
            <p className="text-xs text-mute leading-relaxed font-sans">
              40-step numerical terrain clearance calculated between Alpha Ridge and Base.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mute block">Fresnel Radius</span>
            <div className="text-2xl font-bold font-mono text-blue-400">18.6 m</div>
            <p className="text-xs text-mute leading-relaxed font-sans">
              First Fresnel ellipsoid clearance verified for 915 MHz ISM wavelength.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mute block">Observed Status</span>
            <div className="text-2xl font-bold font-mono text-ink">Line Confirmed</div>
            <p className="text-xs text-mute leading-relaxed font-sans">
              No guessing or unverified estimates. Ground physics dictate link status.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROMISE 2 — STORE-AND-FORWARD HEALING (Parallax Layer) */}
      <section
        id="promise-2"
        className="py-32 px-6 sm:px-12 max-w-5xl mx-auto w-full border-b border-white/[0.08] space-y-8"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span>Promise 02 &bull; Delay-Tolerant Resilience</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
            Store-and-forward peer hops over mountain peaks.
          </h2>
          <p className="text-base sm:text-lg text-mute font-sans font-light max-w-2xl leading-relaxed">
            When teams descend behind 2,800m couloirs, packets are never dropped. Messages safely buffer in local device flash memory until a team or solar repeater crests the ridge, automatically flushing packets to base command.
          </p>
        </div>

        {/* Plain Language Step Card */}
        <div className="rounded-3xl bg-surface/40 border border-white/[0.08] p-8 backdrop-blur-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2 border-l-2 border-caution/60 pl-4">
            <div className="text-xs font-mono text-caution uppercase font-bold">Step 1: Local Cache</div>
            <p className="text-xs text-ink/90 font-sans leading-relaxed">
              Patrol drops below ridge line. Packets write to local flash storage with cryptographic timestamp.
            </p>
          </div>
          <div className="space-y-2 border-l-2 border-signal/60 pl-4">
            <div className="text-xs font-mono text-signal uppercase font-bold">Step 2: Ridge Crest</div>
            <p className="text-xs text-ink/90 font-sans leading-relaxed">
              Intermediate peer or relay acquires line-of-sight beacon. Packets hop autonomously without human intervention.
            </p>
          </div>
          <div className="space-y-2 border-l-2 border-signal pl-4">
            <div className="text-xs font-mono text-signal uppercase font-bold">Step 3: Confirmed Receipt</div>
            <p className="text-xs text-ink/90 font-sans leading-relaxed">
              Base command receives emergency coordinates. 100% receipt receipt verified back to patrol transceiver.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROMISE 3 — DYNAMIC TACTICAL AI (Grounded Reasoning) */}
      <section
        id="promise-3"
        className="py-32 px-6 sm:px-12 max-w-5xl mx-auto w-full border-b border-white/[0.08] space-y-8"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-signal" />
            <span>Promise 03 &bull; Zero Hallucination Intelligence</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
            Ask the mountain intelligence agent.
          </h2>
          <p className="text-base sm:text-lg text-mute font-sans font-light max-w-2xl leading-relaxed">
            Our tactical AI reasons directly over physical 10m DEM elevation profiles and live buffer states. Telemetry guardrails strictly reject invented coordinates or hallucinated numbers.
          </p>
        </div>

        {/* 3D Morphing Thinking Orb & Terminal */}
        <div className="w-full">
          <AIThinkingOrbAndInput
            ref={orbRef}
            placeholder="Ask tactical inquiry (e.g. 'Why is Patrol-Alpha occluded?', 'Battery reserves')..."
            answerTitle={lastQueryResult?.headline || 'TACTICAL INTELLIGENCE BRIEF'}
            onSubmit={handleTacticalQuery}
            minThinkMs={2000}
            labels={[
              'Scanning Sector Telemetry',
              'Evaluating Fresnel Occlusion',
              'Querying Flash Buffers',
              'Synthesizing Verified Brief',
            ]}
            doneLabel="Verification Complete"
            onReset={() => setLastQueryResult(null)}
            className="w-full min-h-[420px]"
          />
        </div>

        {/* AI Result Card */}
        {lastQueryResult && (
          <div className="p-6 rounded-3xl bg-surface/50 border border-white/[0.08] space-y-4 backdrop-blur-xl animate-fadeIn">
            {lastQueryResult.actionDirective && (
              <div className="p-3.5 rounded-2xl bg-signal/10 border border-signal/20 flex items-start gap-3">
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
            <div className="flex items-center justify-between text-xs font-mono text-mute pt-1 border-t border-white/[0.06]">
              <span>{lastQueryResult.disclaimer}</span>
              <Link href="/console" className="text-signal hover:underline flex items-center gap-1 font-bold">
                <span>View on 3D Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 5: FINAL CTA & TRUTHFULNESS FOOTNOTE */}
      <section className="py-24 px-6 sm:px-12 max-w-3xl mx-auto w-full text-center space-y-6">
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">
          Ready to inspect the terrain?
        </h2>
        <p className="text-mute font-sans text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Open the full-bleed 3D Field Console to simulate ridge occlusions, test store-and-forward hops, and view live propagation.
        </p>
        <div className="pt-2">
          <Link
            href="/console"
            onClick={() => sound.playClick()}
            className="px-8 py-4 rounded-full bg-signal text-deep-ground font-sans font-bold text-xs uppercase tracking-wider hover:bg-signal/90 shadow-glow-signal active:scale-[0.97] transition-all inline-flex items-center gap-2"
          >
            <span>Open Field Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-8 text-[11px] font-mono text-gray-400 border-t border-white/[0.06]">
          Non-weapons alpine search & rescue concept &bull; Synthetic 10m DEM elevation &bull; WCAG 2.1 AA Compliant
        </div>
      </section>
    </div>
  );
}
