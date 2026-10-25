'use client';

import React, { useState } from 'react';
import { useMeshStore } from '@/lib/store';
import { Archive, CheckCircle2, Clock, GitCommit, ShieldCheck } from 'lucide-react';

export default function MessageQueuePanel() {
  const { messages, nodes } = useMeshStore();
  const [filter, setFilter] = useState<'all' | 'delivered' | 'queued'>('all');

  const filteredMessages = messages.filter(m => {
    if (filter === 'delivered') return m.status === 'delivered';
    if (filter === 'queued') return m.status === 'queued';
    return true;
  });

  return (
    <div className="cairn-glass rounded-lg border border-line p-4 sm:p-5 text-ink font-mono text-xs space-y-4">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-signal" />
          <span className="font-bold tracking-wider uppercase text-signal">
            STORE-AND-FORWARD MESSAGE LOG & TIMELINE
          </span>
          <span className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px] text-mute">
            L3 · OBSERVED (SIM)
          </span>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5">
          {(['all', 'delivered', 'queued'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded uppercase text-[11px] border transition-all ${
                filter === f
                  ? 'bg-signal text-deep-ground font-bold border-signal'
                  : 'bg-surface text-mute border-line hover:text-ink'
              }`}
            >
              {f} ({messages.filter(m => (f === 'all' ? true : m.status === f)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scrollable List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-6 text-mute">No packets in current filter.</div>
        ) : (
          filteredMessages.map(msg => {
            const fromNode = nodes.find(n => n.id === msg.fromId);
            const toNode = nodes.find(n => n.id === msg.toId);
            const isDelivered = msg.status === 'delivered';

            return (
              <div
                key={msg.id}
                className={`p-3 rounded border transition-all ${
                  isDelivered
                    ? 'bg-surface/50 border-line hover:border-line/80'
                    : 'bg-caution/10 border-caution/50 animate-pulse'
                }`}
              >
                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{fromNode?.callsign || msg.fromId}</span>
                    <span className="text-mute">→</span>
                    <span className="font-bold text-ink">{toNode?.callsign || msg.toId}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold border ${
                        msg.priority === 'alert'
                          ? 'border-caution text-caution bg-caution/10'
                          : 'border-line text-mute bg-surface'
                      }`}
                    >
                      {msg.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-mute text-[10px]">
                      {new Date(msg.queuedAtIso).toLocaleTimeString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border ${
                        isDelivered
                          ? 'border-signal text-signal bg-signal/10'
                          : 'border-caution text-caution bg-caution/20'
                      }`}
                    >
                      {isDelivered ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Delivered
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 animate-spin" />
                          Queued in Cache
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Packet Message Body */}
                <p className="text-xs text-ink/90 leading-relaxed font-sans">{msg.content}</p>

                {/* Hop Trace Path */}
                {isDelivered && msg.hops.length > 0 && (
                  <div className="mt-2 pt-1.5 border-t border-line/40 flex items-center gap-1.5 text-[10px] text-mute flex-wrap">
                    <GitCommit className="w-3 h-3 text-signal" />
                    <span>DELIVERY ROUTE ({msg.hops.length - 1} HOPS):</span>
                    {msg.hops.map((hopId, i) => {
                      const hopNode = nodes.find(n => n.id === hopId);
                      return (
                        <React.Fragment key={hopId}>
                          <span className="text-ink font-semibold">
                            {hopNode?.callsign || hopId}
                          </span>
                          {i < msg.hops.length - 1 && <span className="text-signal">→</span>}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Resilience Indicator */}
      <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] text-mute">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-signal" />
          <span>Local IndexedDB cache verified · Packet state survives page reload & offline mode.</span>
        </div>
        <span className="text-[10px]">PROTOCOL: EPIDEMIC DELAY-TOLERANT MESH</span>
      </div>
    </div>
  );
}
