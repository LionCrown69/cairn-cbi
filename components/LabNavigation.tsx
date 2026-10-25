'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, Award, ArrowRight } from 'lucide-react';

export default function LabNavigation() {
  const pathname = usePathname();

  const explorations = [
    { page: 'story', label: 'Story', variants: ['a', 'b', 'c'] },
    { page: 'console', label: 'Console', variants: ['a', 'b', 'c'] },
    { page: 'method', label: 'Method', variants: ['a', 'b', 'c'] },
  ];

  const variantLabels: Record<string, string> = {
    a: 'A · Cinematic',
    b: 'B · Cartographic',
    c: 'C · Editorial',
  };

  return (
    <div className="w-full bg-surface border-b border-line px-4 sm:px-8 py-3 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-caution font-bold">
          <FlaskConical className="w-4 h-4" />
          <span>LAB EXPLORATIONS (SECTION 3 EVALUATION)</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {explorations.map(exp => (
            <div key={exp.page} className="flex items-center gap-1.5">
              <span className="text-mute uppercase text-[11px]">{exp.label}:</span>
              {exp.variants.map(v => {
                const href = `/lab/${exp.page}/${v}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={v}
                    href={href}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all border ${
                      isActive
                        ? 'bg-signal text-deep-ground font-bold border-signal'
                        : 'bg-deep-ground text-mute border-line hover:text-ink'
                    }`}
                  >
                    {v.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          ))}

          <Link
            href="/console"
            className="px-2.5 py-1 rounded bg-deep-ground border border-signal/60 text-signal hover:bg-signal hover:text-deep-ground text-[11px] transition-colors flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Final Chosen Winners</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
