'use client';

import React, { useState } from 'react';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';
import {
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldAlert,
  Send,
  HelpCircle,
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { DigestOutput } from '@/lib/aiProvider';

export default function AIDigestPanel() {
  const { nodes, links, messages } = useMeshStore();
  const [digest, setDigest] = useState<DigestOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  const onlineNodes = nodes.filter(n => n.status === 'online');
  const offlineNodes = nodes.filter(n => n.status === 'offline');
  const activeLinks = links.filter(l => l.status === 'online');
  const deliveredMsgs = messages.filter(m => m.status === 'delivered');
  const queuedMsgs = messages.filter(m => m.status === 'queued');

  const presetQuestions = [
    'Will weather sever the Saddle Relay?',
    'Assess packet loss risk with current queue',
    'Recommend optimal mast height for isolated patrols',
    'Which station should be prioritized for patrol inspection?',
  ];

  async function handleGenerateDigest(questionOverride?: string) {
    const q = questionOverride !== undefined ? questionOverride : customQuestion;
    sound.playClick();
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
        question: q.trim() || undefined,
      };

      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setDigest(data);
      sound.playSuccess();
      if (questionOverride !== undefined) {
        setCustomQuestion('');
      }
    } catch (e) {
      console.error('Failed to generate digest', e);
      sound.playAlert();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cairn-glass rounded-xl border border-line p-4 sm:p-5 text-ink font-mono text-xs space-y-4 shadow-glass">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-signal/15 border border-signal/40 flex items-center justify-center text-signal">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold tracking-wider uppercase text-signal block text-xs">
              AI SITUATIONAL REASONING
            </span>
            <span className="text-[10px] text-mute font-sans">
              Powered by Google Gemini 2.5 Flash with telemetry guardrails
            </span>
          </div>
        </div>

        <button
          onClick={() => handleGenerateDigest()}
          disabled={loading}
          className="px-3 py-1.5 rounded bg-surface border border-line hover:border-signal text-signal flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Reasoning...' : 'Synthesize Digest'}</span>
        </button>
      </div>

      {/* Interactive Operator Q&A Box */}
      <div className="p-3 rounded-lg bg-surface/40 border border-line space-y-2">
        <label className="text-[10px] uppercase font-bold text-mute flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-signal" />
          <span>Direct Operator Query (Grounded in Live Telemetry)</span>
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleGenerateDigest();
              }
            }}
            placeholder="e.g. Will storm front occlude Saddle Relay 2?"
            className="flex-1 bg-deep-ground border border-line rounded px-3 py-1.5 text-xs text-ink placeholder-mute focus:outline-none focus:border-signal font-sans"
          />
          <button
            onClick={() => handleGenerateDigest()}
            disabled={loading || !customQuestion.trim()}
            className="px-3 py-1.5 rounded bg-signal text-deep-ground font-bold uppercase text-[11px] hover:bg-signal/90 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <span>Ask</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleGenerateDigest(q)}
              disabled={loading}
              className="text-[10px] px-2 py-0.5 rounded bg-ground border border-line text-mute hover:text-signal hover:border-signal/40 transition-all text-left truncate max-w-xs"
            >
              + {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Digest Display */}
      {digest ? (
        <div className="space-y-3 animate-fadeIn">
          {/* Provenance & Disclaimer Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-surface/70 border border-line text-[11px]">
            <span className={`font-bold flex items-center gap-1.5 ${digest.source === 'ai' ? 'text-signal' : 'text-caution'}`}>
              {digest.source === 'ai' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified AI Synthesis (0 hallucinated numbers)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Deterministic Rule Fallback</span>
                </>
              )}
            </span>
            <span className="text-mute text-[10px]">
              {new Date(digest.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Headline & Summary */}
          <div className="p-3.5 rounded bg-surface/50 border border-line space-y-2">
            <h4 className="font-bold text-sm text-ink">{digest.headline}</h4>
            <p className="text-xs text-ink/90 leading-relaxed font-sans">{digest.summary}</p>
          </div>

          {/* Recommended Action */}
          <div className="p-3 rounded bg-deep-ground border border-signal/40 text-xs">
            <span className="text-signal font-bold uppercase block text-[10px] mb-1 tracking-wider">
              TACTICAL DIRECTIVE / RECOMMENDATION:
            </span>
            <p className="text-ink font-sans leading-relaxed">{digest.recommendedAction}</p>
          </div>

          {/* Verifiability Inputs Drawer */}
          <div className="pt-1">
            <button
              onClick={() => {
                sound.playClick();
                setShowInputs(!showInputs);
              }}
              className="text-[11px] text-mute hover:text-ink flex items-center gap-1 transition-colors"
            >
              <span>{showInputs ? 'Hide Raw Telemetry Matrix' : 'Audit Ground Truth Matrix (Verifiability)'}</span>
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
        <div className="p-5 rounded bg-surface/20 border border-dashed border-line text-center text-mute space-y-1.5">
          <p className="text-ink font-semibold">Gemini Alpine Intelligence Standby</p>
          <p className="text-[10px] max-w-sm mx-auto">
            Click &ldquo;Synthesize Digest&rdquo; or pick a tactical query above to analyze the current mesh state.
          </p>
        </div>
      )}

      {/* Safety Guardrail Note */}
      <div className="pt-2 border-t border-line text-[10px] text-mute flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-signal shrink-0" />
        <span>
          Strict Safety Boundary: Prompt excludes kinetic/weapons scopes. Whitelist regex validates all numbers against input matrix.
        </span>
      </div>
    </div>
  );
}
