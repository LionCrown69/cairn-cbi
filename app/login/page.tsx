'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Radio,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Wifi,
  WifiOff,
  Compass,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

interface OperatorProfile {
  id: string;
  name: string;
  callsign: string;
  role: string;
  station: string;
  elevation: string;
  clearanceLevel: 'Commander' | 'Field Ranger' | 'RF Tech' | 'Observer';
  color: string;
}

const PRESET_OPERATORS: OperatorProfile[] = [
  {
    id: 'base-cmd',
    name: 'Cmdr. Elena Rossi',
    callsign: 'BASE-COMMAND',
    role: 'Incident Commander',
    station: 'Alpine Central (Valais)',
    elevation: '2,823m ASL',
    clearanceLevel: 'Commander',
    color: 'signal',
  },
  {
    id: 'patrol-alpha',
    name: 'Capt. Marcus Thorne',
    callsign: 'PATROL-ALPHA',
    role: 'Search & Rescue Lead',
    station: 'Glacier Basin Couloir',
    elevation: '1,951m ASL',
    clearanceLevel: 'Field Ranger',
    color: 'caution',
  },
  {
    id: 'relay-tech',
    name: 'Dr. Sarah Lin',
    callsign: 'RELAY-RIDGE-NORTH',
    role: 'RF Mesh Specialist',
    station: 'North Peak Mast #1',
    elevation: '2,840m ASL',
    clearanceLevel: 'RF Tech',
    color: 'signal',
  },
  {
    id: 'guest-obs',
    name: 'Guest Observer',
    callsign: 'OBSERVER-DEMO',
    role: 'Public Safety Monitor',
    station: 'Civil Defense Link',
    elevation: '1,420m ASL',
    clearanceLevel: 'Observer',
    color: 'mute',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<OperatorProfile>(PRESET_OPERATORS[0]);
  const [callsign, setCallsign] = useState(PRESET_OPERATORS[0].callsign);
  const [passphrase, setPassphrase] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSelectPreset = (profile: OperatorProfile) => {
    sound.playClick();
    setSelectedProfile(profile);
    setCallsign(profile.callsign);
    setPassphrase(profile.clearanceLevel === 'Observer' ? 'GUEST-PUBLIC-ACCESS' : '915-MHZ-AES256-TOKEN');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      sound.playSuccess();
      setIsSubmitting(false);
      setAuthSuccess(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'cairn_current_user',
          JSON.stringify({
            callsign: selectedProfile.callsign,
            name: selectedProfile.name,
            role: selectedProfile.role,
            station: selectedProfile.station,
            elevation: selectedProfile.elevation,
            loginTime: new Date().toISOString(),
          })
        );
      }
      setTimeout(() => {
        router.push('/dispatch');
      }, 700);
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-8 bg-alpine-mesh overflow-hidden">
      {/* 21st.dev Animated Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-signal/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-caution/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-xl mx-auto z-10">
        {/* Top Minimal Pill Header */}
        <div className="flex items-center justify-between mb-4 px-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-signal">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
            </span>
            <span className="tracking-wider uppercase text-[11px] font-semibold">Offline Transceiver Auth</span>
          </div>

          <div className="flex items-center gap-1.5 text-mute text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-signal" />
            <span>FIPS 140-3 Node Hash</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="rounded-3xl p-6 sm:p-8 bg-surface/50 border border-white/[0.08] backdrop-blur-2xl shadow-glass space-y-6">
          {/* Header Title & Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5" />
              <span>Cairn Alpine Mesh Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink tracking-tight">
              Sign into Field Transceiver
            </h1>
            <p className="text-xs sm:text-sm text-mute font-sans leading-relaxed">
              Verify local cryptographic credentials to connect with high-altitude store-and-forward repeaters and tactical telemetry.
            </p>
          </div>

          {/* Quick-Select Operator Presets (21st Minimal Cards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-mute uppercase tracking-wider">
              <span>Quick Field Role Presets:</span>
              <span className="text-signal/80 text-[10px]">Select to Autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_OPERATORS.map((profile) => {
                const isSelected = selectedProfile.id === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleSelectPreset(profile)}
                    className={`p-3 rounded-2xl text-left transition-all border font-sans relative overflow-hidden ${
                      isSelected
                        ? 'bg-signal/10 border-signal/40 shadow-glow-signal/20'
                        : 'bg-surface/30 border-white/[0.05] hover:bg-surface/50 hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-ink truncate">{profile.name}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          profile.clearanceLevel === 'Commander'
                            ? 'bg-signal/20 text-signal font-bold'
                            : profile.clearanceLevel === 'Field Ranger'
                            ? 'bg-caution/20 text-caution font-bold'
                            : 'bg-white/[0.06] text-mute'
                        }`}
                      >
                        {profile.clearanceLevel}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-mute truncate">{profile.callsign}</div>
                    <div className="text-[10px] text-mute/80 truncate mt-0.5">{profile.station}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Station Callsign Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-mute">
                Station Callsign
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mute">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. BASE-COMMAND"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface/70 border border-white/[0.08] focus:border-signal/50 focus:ring-1 focus:ring-signal/40 text-xs font-mono text-ink placeholder:text-mute/40 transition-all outline-none"
                />
              </div>
            </div>

            {/* Cryptographic Radio Token / Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-mute">
                  Radio Auth Token / Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-mono text-signal hover:underline"
                >
                  {showPassword ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mute">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  required
                  placeholder="Enter token"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface/70 border border-white/[0.08] focus:border-signal/50 focus:ring-1 focus:ring-signal/40 text-xs font-mono text-ink placeholder:text-mute/40 transition-all outline-none"
                />
              </div>
            </div>

            {/* Resilience Offline Note */}
            <div className="p-3 rounded-xl bg-surface/40 border border-white/[0.06] flex items-start gap-2.5 text-xs text-mute font-sans">
              <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-ink">Offline-First Validation:</strong> Passkey validates locally via device flash cache if 915 MHz RF link to Valais central command is occluded.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                authSuccess
                  ? 'bg-signal text-deep-ground shadow-glow-signal'
                  : 'bg-signal hover:bg-signal/90 text-deep-ground shadow-glow-signal/40'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-deep-ground border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Station...</span>
                </>
              ) : authSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Session Established &mdash; Entering Dispatch</span>
                </>
              ) : (
                <>
                  <span>Connect to Alpine Mesh</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Links Footer */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-mute">
            <Link href="/" className="hover:text-ink transition-colors flex items-center gap-1">
              <span>&larr; Back to Story</span>
            </Link>
            <Link href="/console" className="text-signal hover:underline flex items-center gap-1">
              <span>Open Field Console Directly &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
