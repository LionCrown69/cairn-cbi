'use client';

import React, { useEffect } from 'react';
import { X, Keyboard, ShieldAlert } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ onClose }: Props) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shortcuts = [
    { key: 'Arrow Keys', description: 'Navigate to nearest neighbor node in mesh' },
    { key: 'Enter', description: 'Select focused node for telemetry inspection' },
    { key: 'O', description: 'Toggle selected node status (Online ↔ Offline)' },
    { key: 'S', description: 'Send emergency check-in message from selected node' },
    { key: 'T', description: 'Toggle between 2D Tactical Plan and 3D Oblique Tilt' },
    { key: 'L', description: 'Cycle Exploded Data Layers (All → L1 → L2 → L3)' },
    { key: '?', description: 'Toggle this keyboard shortcut reference sheet' },
    { key: 'Esc', description: 'Close modals or deselect active dialog' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="cairn-glass w-full max-w-md rounded-lg p-6 shadow-glass border border-line text-ink relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mute hover:text-ink p-1 rounded hover:bg-surface transition-colors"
          aria-label="Close keyboard shortcuts dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-5 h-5 text-signal" />
          <h2 id="shortcuts-title" className="font-mono font-bold text-sm tracking-wider uppercase text-signal">
            Keyboard Shortcuts & Field Navigation
          </h2>
        </div>

        <p className="text-xs text-mute mb-5 leading-relaxed">
          The CAIRN interface is fully navigable without a mouse or pointer device, optimized for cold-weather gloves and ruggedized terminals.
        </p>

        <div className="space-y-2.5">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-line/40">
              <span className="text-mute">{description}</span>
              <kbd className="px-2 py-0.5 rounded bg-surface border border-line font-bold text-ink shadow-sm">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-line flex items-center gap-2 text-[11px] font-mono text-mute">
          <ShieldAlert className="w-3.5 h-3.5 text-signal" />
          <span>Compliant with WCAG 2.1 AA keyboard operability standards.</span>
        </div>
      </div>
    </div>
  );
}
