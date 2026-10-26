'use client';

import React from 'react';
import Link from 'next/link';
import LabNavigation from '@/components/LabNavigation';
import { sound } from '@/lib/soundEffects';
import {
  FlaskConical,
  Award,
  ArrowRight,
  Compass,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function LabOverviewPage() {
  const sections = [
    {
      id: 'story',
      title: 'Story Page Explorations',
      desc: 'Hero section typography, 3D dot-wave terrain, and 5-act narrative scroll progression.',
      icon: Radio,
      variants: [
        { key: 'a', name: 'Variant A: Cinematic Dot-Wave', desc: 'WebGL point-cloud terrain with dynamic camera orbit.' },
        { key: 'b', name: 'Variant B: Topographic Wireframe', desc: 'Contour line vector elevation with high-contrast tactical grid.' },
        { key: 'c', name: 'Variant C: Editorial Typography', desc: 'Magazine-scale condensed type with bold color blocks.' },
      ],
      chosen: 'Variant A · WebGL 3D Point-Cloud Massif (Integrated on /)',
    },
    {
      id: 'console',
      title: 'Field Console Explorations',
      desc: 'Tactical spatial map layout, node control panels, and delay-tolerant message queue.',
      icon: Compass,
      variants: [
        { key: 'a', name: 'Variant A: Split Spatial 3D', desc: 'Mapbox 3D terrain alongside telemetry feeds.' },
        { key: 'b', name: 'Variant B: Full-Bleed Map Canvas', desc: 'Floating tactical HUD cards over full-screen topography.' },
        { key: 'c', name: 'Variant C: Modular Multi-Column', desc: 'Dense multi-pane operations layout for large field screens.' },
      ],
      chosen: 'Variant A · Mapbox 3D + Vector Switcher + Cross-Section (Integrated on /console)',
    },
    {
      id: 'method',
      title: 'Method & Math Explorations',
      desc: 'Line-of-sight ray calculation, store-and-forward queueing, and AI verification boundaries.',
      icon: Sliders,
      variants: [
        { key: 'a', name: 'Variant A: Interactive Propagation Lab', desc: 'Real-time sliders for mast height and ridge breach.' },
        { key: 'b', name: 'Variant B: Technical Whitepaper Format', desc: 'Formal academic presentation with LaTeX/KaTeX formulas.' },
        { key: 'c', name: 'Variant C: Visual Flow Diagram', desc: 'Multi-step process diagrams detailing hop traversal.' },
      ],
      chosen: 'Variant A · Interactive RF Propagation Lab with Live Fresnel Zone (Integrated on /method)',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink min-h-screen">
      <LabNavigation />

      <div className="p-6 sm:p-12 max-w-6xl mx-auto w-full space-y-12 font-mono">
        {/* Header */}
        <div className="border-b border-line pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-caution uppercase tracking-widest font-bold">
            <FlaskConical className="w-4 h-4" />
            <span>Design System Lab & Variant Matrix</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-ink">
            The Design Lab.
          </h1>
          <p className="text-sm text-mute max-w-3xl font-sans leading-relaxed">
            Prior to shipping CAIRN, 3 distinct design directions (Cinematic, Cartographic, Editorial) were built and benchmarked for each core view. Review each variant below to see the evolution of the interface.
          </p>
        </div>

        {/* Explorations Matrix */}
        <div className="space-y-8">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="cairn-glass p-6 sm:p-8 rounded-xl border border-line space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-surface border border-line flex items-center justify-center text-signal">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-ink uppercase">{section.title}</h2>
                      <p className="text-xs text-mute font-sans">{section.desc}</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded bg-deep-ground border border-signal/40 text-signal text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span className="font-bold">PROD SELECTION:</span>
                    <span className="text-ink font-sans">{section.chosen.split(' · ')[0]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.variants.map(v => (
                    <Link
                      key={v.key}
                      href={`/lab/${section.id}/${v.key}`}
                      onClick={() => sound.playClick()}
                      className="p-4 rounded-lg bg-surface/50 border border-line hover:border-signal/60 hover:bg-surface transition-all group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-signal group-hover:text-signal">
                            {v.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-mute group-hover:text-signal transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <p className="text-xs text-mute font-sans leading-relaxed">{v.desc}</p>
                      </div>

                      <div className="text-[10px] text-mute uppercase font-mono tracking-wider pt-2 border-t border-line/40 flex items-center justify-between">
                        <span>Inspect Exploration</span>
                        <span className="text-signal">&rarr;</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Return to Core Platform CTA */}
        <div className="p-6 rounded-xl bg-surface/40 border border-line flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-ink uppercase">Ready to inspect production system?</h3>
            <p className="text-xs text-mute font-sans">Return to the live Valais Massif operational canvas.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => sound.playClick()}
              className="px-4 py-2 rounded bg-surface border border-line hover:border-signal text-xs font-mono text-ink transition-colors"
            >
              Story Home
            </Link>
            <Link
              href="/console"
              onClick={() => sound.playClick()}
              className="px-4 py-2 rounded bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 transition-all flex items-center gap-1.5"
            >
              <span>Field Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
