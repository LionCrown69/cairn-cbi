'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Radio,
  Send,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCheck,
  AlertTriangle,
  RefreshCw,
  Filter,
  Layers,
  Compass,
  ArrowUpRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';

const QUICK_DISPATCH_TEMPLATES = [
  {
    title: 'Glacier Transit Nominal',
    notes: 'Crossing glacier basin couloir. Ice bridge holding well. Team 4 members moving steady.',
    priority: 'routine' as const,
  },
  {
    title: 'High Wind / Spindrift',
    notes: 'Severe wind gusts 35kt over north crest. Visibility under 20m. Team seeking temporary bivy shelter.',
    priority: 'urgent' as const,
  },
  {
    title: 'Victim Located / Evac Req',
    notes: 'Located 2 stranded mountaineers near North Col saddle. Mild hypothermia. Requesting thermal wrap and evac team.',
    priority: 'urgent' as const,
  },
  {
    title: 'Battery Sag Warning',
    notes: 'Sub-zero temp dropped transceiver battery to 15%. Switching to low-duty beacon cycle.',
    priority: 'routine' as const,
  },
];

export default function TeamDispatchFeed() {
  const { nodes, messages, sendMessage, links, simulateSeverance, healTopology } = useMeshStore();

  const [activeChannel, setActiveChannel] = useState<'all' | 'patrol' | 'command' | 'urgent'>('all');
  const [senderId, setSenderId] = useState<string>('node-alpha');
  const [recipientId, setRecipientId] = useState<string>('node-cmd');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'alert'>('routine');
  const [messageText, setMessageText] = useState<string>('');
  const [isPolishingAI, setIsPolishingAI] = useState<boolean>(false);
  const [aiPolishFeedback, setAiPolishFeedback] = useState<string | null>(null);

  const senderNode = nodes.find((n) => n.id === senderId);
  const recipientNode = nodes.find((n) => n.id === recipientId);

  // Filter messages based on active channel
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (activeChannel === 'urgent') return m.priority === 'urgent' || m.priority === 'alert';
      if (activeChannel === 'patrol') return m.fromId === 'node-alpha' || m.fromId === 'node-bravo';
      if (activeChannel === 'command') return m.fromId === 'node-cmd' || m.toId === 'node-cmd';
      return true;
    });
  }, [messages, activeChannel]);

  // Handle Quick Template Select
  const handleApplyTemplate = (tpl: typeof QUICK_DISPATCH_TEMPLATES[0]) => {
    sound.playClick();
    setMessageText(tpl.notes);
    setPriority(tpl.priority);
    setAiPolishFeedback(null);
  };

  // Call Gemini 2.5 Flash to polish raw notes into ICS-209 SAR Protocol
  const handleAIPolish = useCallback(async () => {
    if (!messageText.trim()) return;
    sound.playClick();
    setIsPolishingAI(true);
    setAiPolishFeedback(null);

    try {
      const res = await fetch('/api/dispatch-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes: messageText,
          callsign: senderNode?.callsign || 'PATROL-ALPHA',
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      if (data.formattedText) {
        setMessageText(data.formattedText);
        if (data.suggestedPriority) setPriority(data.suggestedPriority);
        setAiPolishFeedback(data.protocolSummary || 'Refined to Alpine SAR radio standard.');
        sound.playSuccess();
      }
    } catch (err) {
      console.warn('AI Polish failed:', err);
      setAiPolishFeedback('AI service temporarily offline; sending raw draft.');
    } finally {
      setIsPolishingAI(false);
    }
  }, [messageText, senderNode]);

  // Send message through mesh store
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sound.playClick();
    sendMessage(senderId, recipientId, messageText.trim(), priority);

    setMessageText('');
    setAiPolishFeedback(null);
    sound.playSuccess();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner / Channel Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-surface/40 border border-white/[0.08] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest mb-1">
            <Radio className="w-3.5 h-3.5 text-signal" />
            <span>Tactical Dispatch Hub &bull; Store-and-Forward Comms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink tracking-tight">
            Alpine Team Dispatch & Message Broadcast
          </h1>
          <p className="text-xs sm:text-sm text-mute font-sans mt-1">
            Send situational updates across occluded mountain passes. Powered by local flash buffers and AI radio refinement.
          </p>
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface/80 border border-white/[0.08] text-xs font-mono self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setActiveChannel('all');
            }}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChannel === 'all'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            All Broadcasts ({messages.length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveChannel('urgent');
            }}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChannel === 'urgent'
                ? 'bg-caution text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            Urgent / SOS
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveChannel('patrol');
            }}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChannel === 'patrol'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            Patrol Teams
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveChannel('command');
            }}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChannel === 'command'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            Base Command
          </button>
        </div>
      </div>

      {/* Main Grid: Stream on Left, Composer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Field Dispatch Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-mute uppercase tracking-wider">
            <span>Verified Transmission Log:</span>
            <span>{filteredMessages.length} Messages Logged</span>
          </div>

          <div className="space-y-3.5">
            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-surface/20 border border-white/[0.06] space-y-2">
                <Radio className="w-8 h-8 mx-auto text-mute/50" />
                <p className="text-sm font-sans text-mute">No transmissions recorded in this channel.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const sender = nodes.find((n) => n.id === msg.fromId);
                const recipient = nodes.find((n) => n.id === msg.toId);
                const isDelivered = msg.status === 'delivered';
                const isUrgent = msg.priority === 'urgent' || msg.priority === 'alert';

                return (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isUrgent
                        ? 'bg-caution/[0.06] border-caution/30 shadow-glow-caution/10'
                        : isDelivered
                        ? 'bg-surface/30 border-white/[0.06] hover:border-white/[0.12]'
                        : 'bg-caution/[0.04] border-caution/20 animate-pulse'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.05] text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink">{sender?.callsign || msg.fromId}</span>
                        <span className="text-white/20">&rarr;</span>
                        <span className="text-mute">{recipient?.callsign || msg.toId}</span>
                        {sender?.elevationM && (
                          <span className="text-[10px] text-mute/70 px-1.5 py-0.5 rounded bg-surface border border-white/[0.04]">
                            {Math.round(sender.elevationM)}m ASL
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            isUrgent
                              ? 'bg-caution/20 text-caution'
                              : 'bg-signal/15 text-signal'
                          }`}
                        >
                          {msg.priority}
                        </span>

                        <span className="text-mute flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {msg.queuedAtIso
                              ? new Date(msg.queuedAtIso).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Just now'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed pt-3">
                      {msg.content}
                    </p>

                    {/* Transmission Provenance / Hops Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[10px] font-mono text-mute">
                      <div className="flex items-center gap-1.5">
                        <span className="text-mute/60">Multi-Hop Route:</span>
                        <span className="text-ink/80">
                          {msg.hops && msg.hops.length > 0
                            ? msg.hops
                                .map((h) => nodes.find((n) => n.id === h)?.callsign || h)
                                .join(' ➔ ')
                            : 'Direct Peer Link'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-semibold">
                        {isDelivered ? (
                          <span className="text-signal flex items-center gap-1">
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Confirmed Delivered</span>
                          </span>
                        ) : (
                          <span className="text-caution flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Buffered in Local Node Flash</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Post New SITREP / Broadcast Composer (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          <div className="p-6 rounded-3xl bg-surface/50 border border-white/[0.08] backdrop-blur-xl shadow-glass space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-signal uppercase tracking-wider">
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Field Dispatch</span>
              </div>
              <h2 className="text-lg font-display font-bold text-ink">Broadcast SITREP to Mesh</h2>
              <p className="text-xs text-mute font-sans">
                Transmitted over 915 MHz store-and-forward repeaters. AI automatically polishes notes into ICS standard.
              </p>
            </div>

            {/* Quick Template Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-mute uppercase tracking-wider block">
                Quick Scenario Drafts:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_DISPATCH_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-2 rounded-xl text-left bg-surface/60 border border-white/[0.06] hover:border-signal/40 text-[11px] font-sans text-ink/90 transition-all truncate"
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Form */}
            <form onSubmit={handleSendMessage} className="space-y-4 pt-1">
              {/* Sender & Recipient Selectors */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase">Transmitting Node</label>
                  <select
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="w-full p-2 rounded-xl bg-surface border border-white/[0.08] text-ink text-xs font-mono outline-none focus:border-signal/50"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.callsign} ({Math.round(n.elevationM)}m)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase">Destination</label>
                  <select
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full p-2 rounded-xl bg-surface border border-white/[0.08] text-ink text-xs font-mono outline-none focus:border-signal/50"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.callsign} ({n.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-mute uppercase font-mono">Transmission Priority</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {(['routine', 'urgent', 'alert'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setPriority(p);
                      }}
                      className={`py-1.5 rounded-lg border text-center uppercase tracking-wider text-[11px] font-bold transition-all ${
                        priority === p
                          ? p === 'routine'
                            ? 'bg-signal/20 border-signal text-signal'
                            : 'bg-caution/20 border-caution text-caution'
                          : 'bg-surface border-white/[0.06] text-mute hover:text-ink'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-mute uppercase font-mono">
                    Field Notes / SITREP Content
                  </label>
                  {/* Gemini AI Polish Trigger */}
                  <button
                    type="button"
                    onClick={handleAIPolish}
                    disabled={isPolishingAI || !messageText.trim()}
                    className="text-[11px] font-mono text-signal hover:underline flex items-center gap-1 disabled:opacity-40"
                    title="Format rough notes into standardized SAR radio protocol using Google Gemini 2.5 Flash"
                  >
                    <Sparkles className={`w-3 h-3 ${isPolishingAI ? 'animate-spin' : ''}`} />
                    <span>{isPolishingAI ? 'Gemini Formatting...' : 'Gemini AI Polish'}</span>
                  </button>
                </div>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type raw observations (e.g. 'found 2 cold hikers near north col need winch and tea')..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl bg-surface/70 border border-white/[0.08] text-xs font-sans text-ink placeholder:text-mute/40 focus:border-signal/50 focus:ring-1 focus:ring-signal/40 outline-none leading-relaxed transition-all"
                />

                {aiPolishFeedback && (
                  <div className="p-2 rounded-lg bg-signal/10 border border-signal/20 text-[11px] font-mono text-signal flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{aiPolishFeedback}</span>
                  </div>
                )}
              </div>

              {/* Send Submit Button */}
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="w-full py-3 rounded-xl bg-signal hover:bg-signal/90 text-deep-ground font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-signal/30 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to Mesh</span>
              </button>
            </form>
          </div>

          {/* Topology Simulation Actions */}
          <div className="p-4 rounded-2xl bg-surface/30 border border-white/[0.06] space-y-2 text-xs font-mono">
            <span className="text-mute uppercase text-[10px] block">Test Multi-Hop Store-and-Forward:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playAlert();
                  simulateSeverance();
                }}
                className="p-2 rounded-xl bg-caution/10 border border-caution/30 text-caution text-left hover:bg-caution/15 transition-all"
              >
                <div className="font-bold">Drop Ridge Relay</div>
                <div className="text-[10px] text-mute font-sans">Forces messages into local queue</div>
              </button>
              <button
                onClick={() => {
                  sound.playSuccess();
                  healTopology();
                }}
                className="p-2 rounded-xl bg-signal/10 border border-signal/30 text-signal text-left hover:bg-signal/15 transition-all"
              >
                <div className="font-bold">Heal Saddle Link</div>
                <div className="text-[10px] text-mute font-sans">Flushes all queued packets</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
