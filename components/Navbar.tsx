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
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useMeshStore } from '@/lib/store';
import { sound } from '@/lib/soundEffects';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export default function Navbar() {
  const pathname = usePathname();
  const { nodes, messages, systemAnnouncements, setNodeStatus, simulateSeverance, healTopology } = useMeshStore();
  const [showHelp, setShowHelp] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
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
    { href: '/timeline', label: 'Hackathon Timeline', icon: Layers },
    { href: '/method', label: 'Method', icon: Sliders },
    { href: '/design', label: 'Design System', icon: ShieldAlert },
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
      nodes.forEach(n => setNodeStatus(n.id, 'online'));
      sound.playClick();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-line bg-deep-ground/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand & Concept Tag */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group" onClick={() => sound.playClick()}>
              <div className="w-7 h-7 rounded border border-signal/60 bg-surface flex items-center justify-center text-signal font-mono font-bold text-sm group-hover:border-signal transition-colors">
                ▲
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-ink">
                CAIRN
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border border-line bg-surface text-mute">
              Alpine Mesh Telemetry
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
                  onClick={() => sound.playClick()}
                  className={`px-3 py-1.5 rounded text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'border-signal text-signal bg-signal/10 shadow-glow-signal'
                      : 'border-transparent text-mute hover:text-ink hover:border-line hover:bg-surface/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Real-time Telemetry, Scenarios & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live UTC Clock */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded border border-line bg-surface text-xs font-mono text-mute">
              <Clock className="w-3 h-3 text-signal" />
              <span className="text-ink font-semibold">{utcTime || '00:00:00 UTC'}</span>
            </div>

            {/* Quick Simulation Scenarios Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="px-2.5 py-1 rounded border border-line bg-surface hover:border-signal/50 text-xs font-mono text-ink flex items-center gap-1.5 transition-all"
                title="Trigger simulated terrain conditions"
              >
                <Zap className="w-3.5 h-3.5 text-signal" />
                <span className="hidden sm:inline">Scenarios</span>
              </button>

              {showScenarios && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface border border-line p-2 shadow-2xl z-50 font-mono text-xs space-y-1 animate-fadeIn">
                  <div className="px-2 py-1 text-[10px] text-mute uppercase font-bold tracking-wider border-b border-line/60">
                    Simulation Injections
                  </div>
                  <button
                    onClick={() => runScenario('storm')}
                    className="w-full text-left p-2 rounded hover:bg-ground/70 flex items-start gap-2 text-caution transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-ink">Alpine Tempest Severance</div>
                      <div className="text-[10px] text-mute font-sans">Drops Ridge Relay 1; buffers packets in local queue</div>
                    </div>
                  </button>
                  <button
                    onClick={() => runScenario('heal')}
                    className="w-full text-left p-2 rounded hover:bg-ground/70 flex items-start gap-2 text-signal transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-ink">Deploy Saddle Col Relay</div>
                      <div className="text-[10px] text-mute font-sans">Heals topology; flushes store-and-forward messages</div>
                    </div>
                  </button>
                  <button
                    onClick={() => runScenario('nominal')}
                    className="w-full text-left p-2 rounded hover:bg-ground/70 flex items-start gap-2 text-ink transition-colors"
                  >
                    <Radio className="w-4 h-4 mt-0.5 shrink-0 text-mute" />
                    <div>
                      <div className="font-bold text-ink">Reset Nominal Mesh</div>
                      <div className="text-[10px] text-mute font-sans">Restore all 6 alpine stations online</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Tactical Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? "Mute tactical audio" : "Enable tactile console audio feedback"}
              className={`p-1.5 rounded border transition-all text-xs font-mono flex items-center justify-center ${
                soundActive
                  ? 'border-signal bg-signal/15 text-signal shadow-glow-signal'
                  : 'border-line bg-surface text-mute hover:text-ink hover:border-line/80'
              }`}
              aria-label="Toggle tactical audio"
            >
              {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Node / Queue Telemetry Badges */}
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

            {/* Help [?] Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowHelp(true);
              }}
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
            Store-and-Forward Daemon Active &bull; Valais Massif
          </span>
        </div>
      </header>

      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
