'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Radio,
  Wifi,
  WifiOff,
  Layers,
  Compass,
  Sliders,
  ShieldAlert,
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
  UserCheck,
} from 'lucide-react';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { WhatWorksSheet } from '@/components/ui/what-works-sheet';
import { IOSDropdown, DropdownItem } from '@/components/ui/ios-dropdown';

export default function Navbar() {
  const pathname = usePathname();
  const { nodes, messages, systemAnnouncements, setNodeStatus, simulateSeverance, healTopology } = useMeshStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showWhatWorks, setShowWhatWorks] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(
        now.toISOString().substring(11, 19) + ' UTC'
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = nodes.filter(n => n.status === 'online').length;
  const queuedCount = messages.filter(m => m.status === 'queued').length;
  const latestAnnouncement = systemAnnouncements[0] || 'Mesh running in synthetic alpine sector.';

  const navLinks = [
    { href: '/', label: 'Story', icon: Radio },
    { href: '/console', label: 'Field Console', icon: Compass },
    { href: '/dispatch', label: 'Dispatch', icon: Send },
    { href: '/method', label: 'Method', icon: Sliders },
    { href: '/timeline', label: 'Timeline', icon: Layers },
    { href: '/login', label: 'Auth', icon: UserCheck },
  ];

  const toggleSound = () => {
    const nextState = !soundActive;
    sound.enabled = nextState;
    setSoundActive(nextState);
    if (nextState) {
      sound.playSuccess();
    }
  };

  const handleScenarioSelect = (scenario: 'storm' | 'heal' | 'nominal') => {
    if (scenario === 'storm') {
      simulateSeverance();
      sound.playAlert();
    } else if (scenario === 'heal') {
      healTopology();
      sound.playSuccess();
    } else if (scenario === 'nominal') {
      nodes.forEach(n => setNodeStatus(n.id, 'online'));
      sound.playClick();
    }
  };

  const scenarioItems: DropdownItem<'storm' | 'heal' | 'nominal'>[] = [
    {
      value: 'storm',
      label: 'Tempest Severance',
      description: 'Drops North Ridge relay; buffers packets in queue',
      icon: AlertTriangle,
    },
    {
      value: 'heal',
      label: 'Deploy Saddle Col Relay',
      description: 'Heals topology; flushes queued packets',
      icon: CheckCircle2,
    },
    {
      value: 'nominal',
      label: 'Reset Nominal Mesh',
      description: 'Restores all 6 stations online',
      icon: Radio,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-deep-ground/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand Lockup matching Design System with Cairn 3-stone icon */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
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
                <span className="font-display font-black text-xl tracking-wider leading-none text-ink group-hover:text-signal transition-colors">
                  CAIRN
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-signal leading-tight">
                  Offline Mesh
                </span>
              </div>
            </Link>
            <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border border-white/[0.08] bg-surface text-mute">
              Alpine Telemetry
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => sound.playClick()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-signal bg-signal/10 font-bold border border-signal/30'
                      : 'text-mute hover:text-ink hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status Badge, Live UTC, Controls & Launch Console */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live UTC Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-surface/60 text-xs font-mono text-mute">
              <Clock className="w-3 h-3 text-signal" />
              <span className="text-ink font-semibold">{utcTime || '00:00:00 UTC'}</span>
            </div>

            {/* What Works Today Sheet Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowWhatWorks(true);
              }}
              className="px-2.5 py-1 rounded-full border border-signal/30 bg-signal/10 hover:bg-signal/20 text-xs font-mono text-signal flex items-center gap-1.5 transition-all active:scale-[0.97]"
              title="Open verified capabilities sheet"
              aria-label="Open What Works Today status sheet"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              <span className="hidden sm:inline">What works today</span>
              <span className="sm:hidden">Status</span>
            </button>

            {/* Quick Simulation Scenarios Dropdown */}
            <IOSDropdown
              triggerLabel="Scenarios"
              triggerIcon={Zap}
              items={scenarioItems}
              onSelect={handleScenarioSelect}
            />

            {/* Tactical Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? "Mute tactical audio" : "Enable tactile console audio feedback"}
              className={`p-1.5 rounded-full border transition-all text-xs font-mono flex items-center justify-center ${
                soundActive
                  ? 'border-signal bg-signal/15 text-signal shadow-glow-signal'
                  : 'border-white/[0.08] bg-surface text-mute hover:text-ink'
              }`}
              aria-label="Toggle tactical audio"
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Node Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface/60 border border-white/[0.08] text-xs font-mono text-mute">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              <span className="text-signal/90 font-semibold">{onlineCount}/{nodes.length} Online</span>
              {queuedCount > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-caution font-bold">{queuedCount} Q</span>
                </>
              )}
            </div>

            {/* Launch Console CTA */}
            <Link
              href="/console"
              onClick={() => sound.playClick()}
              className="px-3.5 py-1.5 rounded-full bg-signal text-deep-ground font-mono font-bold text-xs uppercase tracking-wider hover:bg-signal/90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Console</span>
              <span className="text-xs">→</span>
            </Link>

            {/* Help [?] Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowHelp(true);
              }}
              title="Keyboard shortcuts (?)"
              className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-white/[0.04] text-xs font-mono transition-colors"
              aria-label="Open keyboard shortcuts modal"
            >
              <HelpCircle className="w-4 h-4" />
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
                  onClick={() => {
                    sound.playClick();
                    setMobileMenuOpen(false);
                  }}
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

        {/* Live Accessibility Announcer Ticker */}
        <div className="bg-surface/60 border-t border-white/[0.06] px-4 py-0.5 text-[11px] font-mono text-mute flex items-center justify-between overflow-hidden">
          <div className="truncate flex items-center gap-2" aria-live="polite">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping" />
            <span className="text-signal font-semibold">EVENT LOG:</span>
            <span className="text-ink/80">{latestAnnouncement}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-mute shrink-0 hidden md:inline">
            Store-and-Forward Daemon Active &bull; Valais Massif
          </span>
        </div>
      </header>

      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
      <WhatWorksSheet open={showWhatWorks} onOpenChange={setShowWhatWorks} />
    </>
  );
}
