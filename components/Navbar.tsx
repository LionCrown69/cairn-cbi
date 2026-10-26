'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Radio,
  Layers,
  Compass,
  Sliders,
  HelpCircle,
  Menu,
  X,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
} from 'lucide-react';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export default function Navbar() {
  const pathname = usePathname();
  const { nodes, messages, systemAnnouncements, setNodeStatus, simulateSeverance, healTopology } = useMeshStore();
  const [showHelp, setShowHelp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = nodes.filter((n) => n.status === 'online').length;
  const queuedCount = messages.filter((m) => m.status === 'queued').length;
  const latestAnnouncement = systemAnnouncements[0] || 'Mesh running in synthetic alpine sector.';

  // Streamlined, single-word, non-wrapping navigation items
  const navLinks = [
    { href: '/', label: 'Story', icon: Radio },
    { href: '/console', label: 'Console', icon: Compass },
    { href: '/dispatch', label: 'Dispatch', icon: Send },
    { href: '/timeline', label: 'Timeline', icon: Layers },
    { href: '/method', label: 'Method', icon: Sliders },
  ];

  const toggleSound = () => {
    const nextState = !soundActive;
    sound.enabled = nextState;
    setSoundActive(nextState);
    if (nextState) {
      sound.playSuccess();
    }
  };

  const runScenario = (scenario: 'storm' | 'heal' | 'nominal') => {
    sound.playClick();
    setShowScenarios(false);
    if (scenario === 'storm') {
      simulateSeverance();
      sound.playAlert();
    } else if (scenario === 'heal') {
      healTopology();
      sound.playSuccess();
    } else if (scenario === 'nominal') {
      nodes.forEach((n) => setNodeStatus(n.id, 'online'));
      sound.playClick();
    }
  };

  const isConsoleActive = pathname === '/console';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-deep-ground/90 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand Lockup: Clean, uncrowded */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            onClick={() => sound.playClick()}
          >
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                <path d="M10 5a9 9 0 0 1 12 0" stroke="#D4F53C" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M13 8a5 5 0 0 1 6 0" stroke="#D4F53C" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="16" cy="13.5" rx="4" ry="2.2" fill="#D4F53C" />
                <circle cx="16" cy="13.5" r="1" fill="#0E120A" />
                <ellipse cx="16" cy="19.5" rx="6.5" ry="3.2" fill="#8E9B70" />
                <ellipse cx="16" cy="25.5" rx="9" ry="3.8" fill="#3A4030" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-black text-lg sm:text-xl tracking-wider leading-none text-ink group-hover:text-signal transition-colors">
                CAIRN
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-signal leading-tight">
                Offline Mesh
              </span>
            </div>
          </Link>

          {/* Navigation Items: Center aligned, single-line, zero wrap */}
          <nav className="hidden md:flex items-center gap-1.5 shrink-0">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => sound.playClick()}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-signal bg-signal/15 font-bold border border-signal/40 shadow-sm'
                      : 'text-mute hover:text-ink hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Harmonized, unified height h-8, no redundant duplicate buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live UTC Clock (Desktop only) */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 h-8 rounded-full border border-white/[0.08] bg-surface/60 text-xs font-mono text-mute whitespace-nowrap">
              <Clock className="w-3 h-3 text-signal" />
              <span className="text-ink font-semibold">{utcTime || '00:00:00 UTC'}</span>
            </div>

            {/* Quick Simulation Scenarios Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className={`px-2.5 sm:px-3 h-8 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  showScenarios
                    ? 'border-signal/50 bg-signal/10 text-signal shadow-sm'
                    : 'border-white/[0.08] bg-surface/80 hover:border-signal/40 text-ink'
                }`}
                title="Trigger simulated terrain conditions"
              >
                <Zap className="w-3.5 h-3.5 text-signal" />
                <span className="hidden sm:inline">Scenarios</span>
              </button>

              {showScenarios && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-deep-ground/95 border border-white/[0.12] p-2 shadow-2xl backdrop-blur-2xl z-50 font-mono text-xs space-y-1 animate-fadeIn">
                  <div className="px-2.5 py-1 text-[10px] text-mute uppercase font-bold tracking-wider border-b border-white/[0.06]">
                    Simulation Injections
                  </div>
                  <button
                    onClick={() => runScenario('storm')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-surface/60 flex items-start gap-2.5 text-caution transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-caution" />
                    <div>
                      <div className="font-bold text-ink text-xs">Alpine Tempest Severance</div>
                      <div className="text-[10px] text-mute font-sans">Drops Ridge Relay 1; buffers packets in local queue</div>
                    </div>
                  </button>
                  <button
                    onClick={() => runScenario('heal')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-surface/60 flex items-start gap-2.5 text-signal transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-signal" />
                    <div>
                      <div className="font-bold text-ink text-xs">Deploy Saddle Col Relay</div>
                      <div className="text-[10px] text-mute font-sans">Heals topology; flushes store-and-forward messages</div>
                    </div>
                  </button>
                  <button
                    onClick={() => runScenario('nominal')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-surface/60 flex items-start gap-2.5 text-ink transition-colors"
                  >
                    <Radio className="w-4 h-4 mt-0.5 shrink-0 text-mute" />
                    <div>
                      <div className="font-bold text-ink text-xs">Reset Nominal Mesh</div>
                      <div className="text-[10px] text-mute font-sans">Restore all 6 alpine stations online</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Tactical Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? 'Mute tactical audio' : 'Enable tactile console audio feedback'}
              className={`w-8 h-8 rounded-full border transition-all text-xs font-mono flex items-center justify-center shrink-0 ${
                soundActive
                  ? 'border-signal bg-signal/20 text-signal shadow-glow-signal'
                  : 'border-white/[0.08] bg-surface/80 text-mute hover:text-ink'
              }`}
              aria-label="Toggle tactical audio"
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Node Telemetry Pill */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 rounded-full bg-surface/80 border border-white/[0.08] text-xs font-mono text-mute whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              <span className="text-signal font-semibold">{onlineCount}/{nodes.length}</span>
              <span className="hidden sm:inline text-signal/80">Online</span>
              {queuedCount > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-caution font-bold">{queuedCount} Q</span>
                </>
              )}
            </div>

            {/* Launch Console CTA (Only displayed when not on /console to eliminate redundancy) */}
            {!isConsoleActive && (
              <Link
                href="/console"
                onClick={() => sound.playClick()}
                className="hidden sm:flex px-3.5 h-8 rounded-full bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 transition-all items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Console</span>
                <span className="text-xs font-bold">→</span>
              </Link>
            )}

            {/* Help [?] Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowHelp(true);
              }}
              title="Keyboard shortcuts (?)"
              className="w-8 h-8 rounded-full border border-white/[0.08] bg-surface/80 hover:border-signal/40 text-mute hover:text-signal flex items-center justify-center text-xs font-mono transition-colors shrink-0"
              aria-label="Open keyboard shortcuts modal"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden w-8 h-8 rounded-full border border-white/[0.08] bg-surface/80 text-mute hover:text-ink flex items-center justify-center transition-colors shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-signal" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Global Live Ticker */}
        <div className="w-full bg-[#080B06] border-t border-white/[0.04] px-4 py-1 text-[11px] font-mono flex items-center justify-between text-mute overflow-hidden">
          <div className="flex items-center gap-2 truncate">
            <span className="text-signal font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping inline-block" />
              EVENT LOG:
            </span>
            <span className="text-ink/90 truncate">{latestAnnouncement}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[10px] text-mute shrink-0 uppercase tracking-wider">
            <span>Store-and-forward daemon active</span>
            <span className="text-white/20">•</span>
            <span>Valais Massif</span>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-deep-ground/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fadeIn font-mono">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    sound.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono ${
                    isActive
                      ? 'bg-signal/15 text-signal font-bold border border-signal/30'
                      : 'text-mute hover:text-ink hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <Link
                href="/console"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-xl bg-signal text-deep-ground font-bold text-xs uppercase tracking-wider"
              >
                Launch Field Console →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
