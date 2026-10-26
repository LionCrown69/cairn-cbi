'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, Wifi } from 'lucide-react';

interface LinkStrengthRingProps {
  canReachCommand: boolean;
  hopCount: number;
  qualityPct: number; // 0 - 100
  callsign: string;
  className?: string;
}

export function LinkStrengthRing({
  canReachCommand,
  hopCount,
  qualityPct,
  callsign,
  className = '',
}: LinkStrengthRingProps) {
  // SVG circle circumference
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = canReachCommand
    ? circumference - (qualityPct / 100) * circumference
    : circumference;

  return (
    <div
      className={`relative inline-flex items-center gap-3 p-3 rounded-2xl bg-surface/60 border border-white/[0.08] backdrop-blur-xl ${className}`}
      aria-label={`Link status for ${callsign}: ${
        canReachCommand
          ? `Can reach Command in ${hopCount} ${hopCount === 1 ? 'hop' : 'hops'}`
          : 'Direct link occluded. Holding in store-and-forward queue.'
      }`}
    >
      {/* Clean SVG Arc Gauge */}
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          {/* Background Track */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          {/* Active Status Arc */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="transparent"
            stroke={canReachCommand ? '#D4F53C' : '#FF8A3D'}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          {canReachCommand ? (
            <Wifi className="w-4 h-4 text-signal" />
          ) : (
            <AlertCircle className="w-4 h-4 text-caution" />
          )}
        </div>
      </div>

      {/* Plain Language Label (No Gauge Clutter) */}
      <div className="space-y-0.5">
        <div className="text-[10px] font-mono uppercase text-mute tracking-wider flex items-center gap-1.5">
          <span>{callsign}</span>
          <span className="text-white/20">&bull;</span>
          <span className={canReachCommand ? 'text-signal font-bold' : 'text-caution font-bold'}>
            {canReachCommand ? 'CONNECTED' : 'SEVERED'}
          </span>
        </div>

        <div className="text-xs font-sans font-bold text-ink">
          {canReachCommand
            ? hopCount === 0
              ? 'At Command Station'
              : `${callsign} reaches Command in ${hopCount} ${hopCount === 1 ? 'hop' : 'hops'}`
            : 'Occluded by Ridge — Waiting for Saddle Crest'}
        </div>

        <p className="text-[11px] text-mute font-sans">
          {canReachCommand
            ? 'Nominal line-of-sight propagation verified.'
            : 'Packets buffered locally in node flash cache.'}
        </p>
      </div>

      {/* Screen reader text equivalent */}
      <span className="sr-only">
        {canReachCommand
          ? `${callsign} link strength ${qualityPct} percent, reachable in ${hopCount} hops.`
          : `${callsign} link is occluded. Store-and-forward queue active.`}
      </span>
    </div>
  );
}
