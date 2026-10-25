'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Wifi, WifiOff, Layers, Compass, Sliders, ShieldAlert, HelpCircle } from 'lucide-react';
import { useMeshStore } from '@/lib/store';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export default function Navbar() {
  const pathname = usePathname();
  const { nodes, messages, systemAnnouncements } = useMeshStore();
  const [showHelp, setShowHelp] = useState(false);

  const onlineCount = nodes.filter(n => n.status === 'online').length;
  const queuedCount = messages.filter(m => m.status === 'queued').length;
  const latestAnnouncement = systemAnnouncements[0] || 'Mesh running in synthetic alpine sector.';

  const navLinks = [
    { href: '/', label: 'Story', icon: Radio },
    { href: '/console', label: 'Field Console', icon: Compass },
    { href: '/timeline', label: 'Hackathon Journey', icon: Layers },
    { href: '/method', label: 'Method', icon: Sliders },
    { href: '/design', label: 'Design System', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-line bg-deep-ground/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand & Concept Tag */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded border border-signal/60 bg-surface flex items-center justify-center text-signal font-mono font-bold text-sm group-hover:border-signal transition-colors">
                ▲
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-ink">
                CAIRN
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border border-line bg-surface text-mute">
              Synthetic Concept · Alpine Mesh
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'border-signal text-signal bg-signal/10'
                      : 'border-transparent text-mute hover:text-ink hover:border-line hover:bg-surface/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Real-time Telemetry & Help Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-line bg-surface text-xs font-mono">
              <span className="flex items-center gap-1 text-signal">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                {onlineCount}/{nodes.length} Nodes
              </span>
              <span className="text-line">|</span>
              <span className={`flex items-center gap-1 ${queuedCount > 0 ? 'text-caution font-bold' : 'text-mute'}`}>
                {queuedCount > 0 ? <WifiOff className="w-3.5 h-3.5" /> : null}
                {queuedCount} Queued
              </span>
            </div>

            <button
              onClick={() => setShowHelp(true)}
              title="Keyboard shortcuts (?)"
              className="p-1.5 rounded border border-line text-mute hover:text-ink hover:border-signal/50 bg-surface text-xs font-mono flex items-center gap-1"
              aria-label="Open keyboard shortcuts modal"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">[?]</span>
            </button>
          </div>
        </div>

        {/* Live Accessibility Announcer Ticker */}
        <div className="bg-surface/60 border-t border-line/40 px-4 py-0.5 text-[11px] font-mono text-mute flex items-center justify-between overflow-hidden">
          <div className="truncate flex items-center gap-2" aria-live="polite">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping" />
            <span className="text-signal font-semibold">EVENT LOG:</span>
            <span className="text-ink/80">{latestAnnouncement}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-mute shrink-0 hidden md:inline">
            Store-and-Forward Daemon Active
          </span>
        </div>
      </header>

      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
