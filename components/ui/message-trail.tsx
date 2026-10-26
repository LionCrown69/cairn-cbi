'use client';

import React from 'react';
import { Clock, CheckCheck, Radio } from 'lucide-react';

interface MessageTrailProps {
  status: 'delivered' | 'queued';
  senderCallsign: string;
  hops: string[];
  recipientCallsign: string;
  className?: string;
}

export function MessageTrail({
  status,
  senderCallsign,
  hops,
  recipientCallsign,
  className = '',
}: MessageTrailProps) {
  const isDelivered = status === 'delivered';
  const displayNodes = [senderCallsign, ...hops, recipientCallsign];

  return (
    <div
      className={`p-3.5 rounded-2xl bg-surface/50 border border-white/[0.08] backdrop-blur-xl space-y-2.5 ${className}`}
      aria-label={`Transmission trail from ${senderCallsign} to ${recipientCallsign}: ${
        isDelivered ? 'Delivered via multi-hop path' : 'Waiting in store-and-forward queue'
      }`}
    >
      {/* Header Status */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-mute">
          <Radio className="w-3.5 h-3.5 text-signal" />
          <span className="uppercase text-[10px] tracking-wider">Multi-Hop Path Verification:</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          {isDelivered ? (
            <span className="text-signal flex items-center gap-1">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Packet Delivered</span>
            </span>
          ) : (
            <span className="text-caution flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Holding in Flash (Store-and-Forward)</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG Animated Message Trail Line */}
      <div className="relative py-2 px-1">
        <div className="flex items-center justify-between relative z-10">
          {displayNodes.map((nodeName, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === displayNodes.length - 1;

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                {/* Node Dot */}
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                    isFirst || isLast
                      ? 'border-signal bg-deep-ground ring-2 ring-signal/30'
                      : isDelivered
                      ? 'border-signal bg-signal/30'
                      : 'border-caution bg-caution/20 animate-pulse'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isDelivered ? 'bg-signal' : 'bg-caution'
                    }`}
                  />
                </div>
                {/* Node Label */}
                <span className="text-[10px] font-mono text-ink/80 truncate max-w-[80px]">
                  {nodeName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Trail Line Connecting Nodes */}
        <div className="absolute top-[15px] left-4 right-4 h-0.5 pointer-events-none">
          <div
            className={`w-full h-full transition-all duration-700 ${
              isDelivered
                ? 'bg-signal shadow-[0_0_8px_rgba(212,245,60,0.6)]'
                : 'border-t-2 border-dashed border-caution animate-pulse'
            }`}
          />
        </div>
      </div>

      {/* Plain Language Interpretation */}
      <p className="text-[11px] text-mute font-sans pt-1 border-t border-white/[0.04]">
        {isDelivered
          ? `Path verified: 100% cryptographic packet delivery confirmed at ${recipientCallsign}.`
          : `Direct line occluded: Packet saved in ${senderCallsign} flash memory. Automatic transfer upon saddle crest.`}
      </p>

      {/* Screen reader text equivalent */}
      <span className="sr-only">
        Message route: {displayNodes.join(' to ')}. Status: {status}.
      </span>
    </div>
  );
}
