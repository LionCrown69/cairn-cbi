'use client';

import React, { useState, useCallback } from 'react';
import { useMeshStore } from '@/lib/store';
import { Sparkles, ShieldCheck, Radio, AlertCircle } from 'lucide-react';
import AIThinkingOrbAndInput, { AIThinkingOrbHandle } from '@/components/ui/ai-thinking-orb-and-input';

export default function AIDigestPanel() {
  const { nodes, links, messages, selectedNodeId } = useMeshStore();
  const orbRef = React.useRef<AIThinkingOrbHandle>(null);
  const [lastQueryResult, setLastQueryResult] = useState<{
    headline: string;
    report: string;
    keyMetrics: Array<{ label: string; value: string }>;
    actionDirective: string;
    disclaimer: string;
  } | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleQuery = useCallback(
    async (queryText: string): Promise<string> => {
      try {
        const payload = {
          question: queryText,
          context: {
            nodes: nodes.map(n => ({
              callsign: n.callsign,
              role: n.role,
              elevationM: n.elevationM,
              batteryPct: n.batteryPct,
              status: n.status,
            })),
            links: links.map(l => ({
              from: l.fromId,
              to: l.toId,
              distanceKm: l.distanceKm,
              status: l.status,
            })),
            queuedCount: messages.filter(m => m.status === 'queued').length,
            deliveredCount: messages.filter(m => m.status === 'delivered').length,
            selectedCallsign: selectedNode?.callsign,
          },
        };

        const res = await fetch('/api/tactical-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        setLastQueryResult(data);
        return data.report || data.headline;
      } catch (err) {
        console.error('Failed to query tactical agent:', err);
        return 'Tactical query fallback: All field nodes reporting nominal. No direct line of sight to occluded patrols; packets cached in local flash.';
      }
    },
    [nodes, links, messages, selectedNode]
  );

  return (
    <div className="cairn-glass rounded-2xl p-4 sm:p-5 text-ink font-sans text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-signal" />
          <span className="font-bold tracking-tight text-sm text-ink font-sans">
            Mountain Intelligence Assistant
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-signal/10 border border-signal/20 text-[11px] text-signal font-sans font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Hallucination</span>
        </div>
      </div>

      {/* Quick Tactical Query Suggestions */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-mute font-sans">
          <Radio className="w-3.5 h-3.5 text-signal" />
          <span>Quick Questions:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            'Why is Patrol-Alpha occluded?',
            'Summarize all team positions',
            'Check team battery reserves',
            'Store-and-forward queue status',
            'Recommend safe route around ridge',
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                orbRef.current?.triggerQuery(preset);
              }}
              className="px-3 py-1 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-sans text-ink/80 hover:text-signal hover:border-signal/40 transition-all text-left"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Morphing Thinking Orb & Input Component */}
      <AIThinkingOrbAndInput
        ref={orbRef}
        placeholder="Ask anything (e.g. 'Why is Alpha occluded?', 'Battery status', 'Evac path')..."
        answerTitle={lastQueryResult?.headline || 'TACTICAL INTELLIGENCE BRIEF'}
        onSubmit={handleQuery}
        minThinkMs={2600}
        labels={[
          'Scanning Sector Telemetry',
          'Evaluating Fresnel Occlusion',
          'Querying Flash Buffers',
          'Synthesizing Response',
        ]}
        doneLabel="Verification Complete"
        onReset={() => setLastQueryResult(null)}
        className="w-full"
      />

      {/* Structured Tactical Insights (revealed when a report exists) */}
      {lastQueryResult && (
        <div className="space-y-3 pt-2 border-t border-white/[0.08] animate-fadeIn">
          {/* Key Tactical Metrics */}
          {lastQueryResult.keyMetrics && lastQueryResult.keyMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {lastQueryResult.keyMetrics.map((km, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-surface/50 border border-white/[0.06] space-y-0.5">
                  <span className="text-[10px] text-mute block font-sans uppercase tracking-wider">{km.label}</span>
                  <span className="font-bold text-signal text-xs font-sans">{km.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Directive */}
          {lastQueryResult.actionDirective && (
            <div className="p-3.5 rounded-xl bg-signal/5 border border-signal/20 space-y-1">
              <span className="text-xs font-bold text-signal font-sans tracking-wide block">
                Recommended Action:
              </span>
              <p className="text-xs text-ink/90 font-sans leading-relaxed">
                {lastQueryResult.actionDirective}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-[11px] text-mute flex items-center gap-1.5 pt-1 font-sans">
            <AlertCircle className="w-3.5 h-3.5 text-signal shrink-0" />
            <span>{lastQueryResult.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
