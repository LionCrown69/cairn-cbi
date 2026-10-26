'use client';

import React from 'react';
import { Radio, Activity, FileText, Clock, HelpCircle } from 'lucide-react';

export type CapabilityType = 'live' | 'estimate' | 'template' | 'coming-soon';

interface CapabilityBadgeProps {
  type: CapabilityType;
  label?: string;
  tooltip?: string;
  className?: string;
}

export function CapabilityBadge({ type, label, tooltip, className = '' }: CapabilityBadgeProps) {
  switch (type) {
    case 'live':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-signal/15 text-signal border border-signal/30 shadow-sm ${className}`}
          title={tooltip || 'Works now — running on live simulated DEM alpine telemetry'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          <span>{label || 'Live'}</span>
        </span>
      );

    case 'estimate':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30 ${className}`}
          title={tooltip || 'Model output — calculated from synthetic 10m DEM elevation geometry'}
        >
          <Activity className="w-3 h-3 text-blue-400" />
          <span>{label || 'Estimate'}</span>
        </span>
      );

    case 'template':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}
          title={tooltip || 'Offline fallback — deterministic emergency rule template'}
        >
          <FileText className="w-3 h-3 text-amber-400" />
          <span>{label || 'Template'}</span>
        </span>
      );

    case 'coming-soon':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-white/[0.05] text-mute border border-white/[0.08] cursor-not-allowed select-none ${className}`}
          title={tooltip || 'Not built yet — Planned for future satellite & hardware integration'}
          aria-disabled="true"
        >
          <Clock className="w-3 h-3 text-mute/60" />
          <span>{label || 'Coming soon'}</span>
        </span>
      );
  }
}
