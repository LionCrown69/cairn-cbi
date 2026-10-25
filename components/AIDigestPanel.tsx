'use client';

import React, { useState } from 'react';
import { useMeshStore } from '@/lib/store';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, AlertCircle, ShieldAlert } from 'lucide-react';
import { DigestOutput } from '@/lib/aiProvider';

export default function AIDigestPanel() {
  const { nodes, links, messages } = useMeshStore();
  const [digest, setDigest] = useState<DigestOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);

  const onlineNodes = nodes.filter(n => n.status === 'online');
  const offlineNodes = nodes.filter(n => n.status === 'offline');
  const activeLinks = links.filter(l => l.status === 'online');
  const deliveredMsgs = messages.filter(m => m.status === 'delivered');
  const queuedMsgs = messages.filter(m => m.status === 'queued');

  async function handleGenerateDigest() {
    setLoading(true);
    try {
      const payload = {
        onlineNodesCount: onlineNodes.length,
        offlineNodesCount: offlineNodes.length,
        deliveredMessagesCount: deliveredMsgs.length,
        queuedMessagesCount: queuedMsgs.length,
        activeLinksCount: activeLinks.length,
        recentMessages: messages.slice(0, 3).map(m => {
          const from = nodes.find(n => n.id === m.fromId);
          return {
            callsign: from?.callsign || m.fromId,
            content: m.content,
            priority: m.priority,
          };
        }),
      };

      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setDigest(data);
    } catch (e) {
      console.error('Failed to generate digest', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cairn-glass rounded-lg border border-line p-4 sm:p-5 text-ink font-mono text-xs space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-signal" />
          <span className="font-bold tracking-wider uppercase text-signal">
            AI SITUATIONAL DIGEST & SUMMARIZER
          </span>
        </div>

        <button
          onClick={handleGenerateDigest}
          disabled={loading}
          className="px-3 py-1.5 rounded bg-surface border border-line hover:border-signal text-signal flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synthesizing...' : 'Generate Digest'}</span>
        </button>
      </div>

      {/* Main Digest Display */}
      {digest ? (
        <div className="space-y-3 animate-fadeIn">
          {/* Disclaimer Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded bg-surface/70 border border-caution/40 text-[11px]">
            <span className="text-caution font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {digest.disclaimer}
            </span>
            <span className="text-mute text-[10px]">
              TIMESTAMP: {new Date(digest.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Headline & Summary */}
          <div className="p-3 rounded bg-surface/40 border border-line space-y-2">
            <h4 className="font-bold text-sm text-ink">{digest.headline}</h4>
            <p className="text-xs text-ink/90 leading-relaxed font-sans">{digest.summary}</p>
          </div>

          {/* Recommended Action */}
          <div className="p-2.5 rounded bg-deep-ground border border-signal/40 text-xs">
            <span className="text-signal font-bold uppercase block text-[10px] mb-1">
              RECOMMENDED PATROL ACTION:
            </span>
            <p className="text-ink font-sans">{digest.recommendedAction}</p>
          </div>

          {/* Show Inputs Drawer */}
          <div className="pt-1">
            <button
              onClick={() => setShowInputs(!showInputs)}
              className="text-[11px] text-mute hover:text-ink flex items-center gap-1"
            >
              <span>{showInputs ? 'Hide Raw Input Metrics' : 'Show Inputs (Verifiability)'}</span>
              {showInputs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showInputs && (
              <pre className="mt-2 p-3 rounded bg-deep-ground border border-line text-[10px] text-mute overflow-x-auto">
                {JSON.stringify(digest.rawInput, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded bg-surface/30 border border-dashed border-line text-center text-mute space-y-1">
          <p>No situational digest generated yet.</p>
          <p className="text-[10px]">
            Click &ldquo;Generate Digest&rdquo; to summarize mesh status, queue backlog, and field reports.
          </p>
        </div>
      )}

      {/* Safety Guardrail Note */}
      <div className="pt-2 border-t border-line text-[10px] text-mute flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-signal" />
        <span>
          Strict Safety Boundary: Prompt excludes kinetic/weapons scopes. Hallucinated numbers trigger instant fallback.
        </span>
      </div>
    </div>
  );
}
