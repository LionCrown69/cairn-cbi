'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Wifi, WifiOff, Layers, Compass, Sliders, ShieldAlert, HelpCircle, Menu, X } from 'lucide-react';
import { useMeshStore } from '@/lib/store';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export default function Navbar() {
  const pathname = usePathname();
  const { nodes, messages, systemAnnouncements } = useMeshStore();
  const [showHelp, setShowHelp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-deep-ground/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand Lockup matching Design System */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Cairn 3-stone antenna lockup */}
              <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                  {/* Radio waves */}
                  <path d="M10 5a9 9 0 0 1 12 0" stroke="#D4F53C" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M13 8a5 5 0 0 1 6 0" stroke="#D4F53C" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Top stone with signal eye */}
                  <ellipse cx="16" cy="13.5" rx="4" ry="2.2" fill="#D4F53C" />
                  <circle cx="16" cy="13.5" r="1" fill="#0E120A" />
                  {/* Middle stone */}
                  <ellipse cx="16" cy="19.5" rx="6.5" ry="3.2" fill="#8E9B70" />
                  {/* Bottom stone */}
                  <ellipse cx="16" cy="25.5" rx="9" ry="3.8" fill="#3A4030" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-wider leading-none text-ink group-hover:text-signal transition-colors">
                  CAIRN
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-signal leading-tight">
                  Offline Mesh
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                    isActive
                      ? 'text-signal bg-signal/10 font-bold'
                      : 'text-mute hover:text-ink hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status Badge & Launch Console CTA */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-mono text-mute">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              <span className="text-ink font-semibold uppercase text-[11px]">Offline-First</span>
              <span className="text-white/20">·</span>
              <span className="text-signal/90 text-[11px] font-semibold">{onlineCount}/{nodes.length} Online</span>
              {queuedCount > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-caution text-[11px]">{queuedCount} Q</span>
                </>
              )}
            </div>

            <Link
              href="/console"
              className="px-3.5 py-1.5 rounded-full bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Launch Console</span>
              <span className="text-xs">→</span>
            </Link>

            <button
              onClick={() => setShowHelp(true)}
              title="Keyboard shortcuts (?)"
              className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-white/[0.04] text-xs font-mono transition-colors"
              aria-label="Open keyboard shortcuts modal"
            >
              [?]
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg text-mute hover:text-ink hover:bg-white/[0.04] transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-signal" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-deep-ground/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-fadeIn">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-signal/15 text-signal font-bold border border-signal/30'
                      : 'text-ink/80 hover:text-ink hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-signal/80" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
