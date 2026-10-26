'use client';

import React, { useEffect, useState } from 'react';
import { sound } from '@/lib/soundEffects';

interface CairnScrollIndicatorProps {
  className?: string;
}

export function CairnScrollIndicator({ className = '' }: CairnScrollIndicatorProps) {
  const [activeStone, setActiveStone] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);

      let current = 0;
      if (progress > 0.65) current = 3;
      else if (progress > 0.35) current = 2;
      else if (progress > 0.1) current = 1;

      setActiveStone((prev) => {
        if (prev !== current && current > 0) {
          // Subtle audio cue on crossing a promise section
          sound.playClick();
        }
        return current;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stoneLabels = [
    'Massif Line-of-Sight',
    'Store-and-Forward Cache',
    'Tactical AI SITREP',
  ];

  return (
    <aside
      aria-label="Cairn three-stone mission scroll progress"
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 p-3 rounded-full bg-deep-ground/80 border border-white/[0.08] backdrop-blur-xl shadow-glass ${className}`}
    >
      {/* Three Stones SVG lockup */}
      <div className="relative flex flex-col items-center gap-2">
        {/* Stone 1: Top Stone (Visible Network) */}
        <button
          onClick={() => {
            const el = document.getElementById('promise-1');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative flex items-center justify-center p-1 focus:outline-none"
          title="Promise 1: The Network is Visible"
          aria-label="Scroll to Promise 1: The Network is Visible"
        >
          <div
            className={`w-4 h-2.5 rounded-full transition-all duration-300 ${
              activeStone >= 1
                ? 'bg-signal shadow-[0_0_12px_rgba(212,245,60,0.8)] scale-110'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
          {/* Tooltip */}
          <span className="absolute right-8 px-2 py-1 rounded bg-surface border border-white/[0.1] text-[10px] font-mono text-ink whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            1. Visible Network
          </span>
        </button>

        {/* Stone 2: Middle Stone (Store-and-Forward) */}
        <button
          onClick={() => {
            const el = document.getElementById('promise-2');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative flex items-center justify-center p-1 focus:outline-none"
          title="Promise 2: Store-and-Forward Healing"
          aria-label="Scroll to Promise 2: Store-and-Forward Healing"
        >
          <div
            className={`w-6 h-3 rounded-full transition-all duration-300 ${
              activeStone >= 2
                ? 'bg-signal shadow-[0_0_12px_rgba(212,245,60,0.8)] scale-110'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
          <span className="absolute right-8 px-2 py-1 rounded bg-surface border border-white/[0.1] text-[10px] font-mono text-ink whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            2. Autonomous Healing
          </span>
        </button>

        {/* Stone 3: Base Foundation Stone (Tactical AI) */}
        <button
          onClick={() => {
            const el = document.getElementById('promise-3');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative flex items-center justify-center p-1 focus:outline-none"
          title="Promise 3: Dynamic Tactical AI"
          aria-label="Scroll to Promise 3: Dynamic Tactical AI"
        >
          <div
            className={`w-8 h-3.5 rounded-full transition-all duration-300 ${
              activeStone >= 3
                ? 'bg-signal shadow-[0_0_12px_rgba(212,245,60,0.8)] scale-110'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
          <span className="absolute right-8 px-2 py-1 rounded bg-surface border border-white/[0.1] text-[10px] font-mono text-ink whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            3. Tactical AI
          </span>
        </button>
      </div>

      {/* Vertical Progress Rule */}
      <div className="w-0.5 h-12 bg-white/10 rounded-full overflow-hidden">
        <div
          className="w-full bg-signal transition-all duration-150"
          style={{ height: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* Screen reader text equivalent */}
      <span className="sr-only">
        Cairn progress: {activeStone} of 3 promises explored. Current: {stoneLabels[Math.max(0, activeStone - 1)]}.
      </span>
    </aside>
  );
}
