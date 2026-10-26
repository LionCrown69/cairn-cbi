'use client';

import React from 'react';
import { sound } from '@/lib/soundEffects';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  badge?: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  const handleSelect = (val: T) => {
    if (val === value) return;
    sound.playClick();
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      handleSelect(options[nextIndex].value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      handleSelect(options[prevIndex].value);
    }
  };

  const sizeClasses = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs',
    lg: 'p-1.5 text-sm',
  };

  const itemSizeClasses = {
    sm: 'px-2.5 py-1',
    md: 'px-3.5 py-1.5',
    lg: 'px-4 py-2',
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`inline-flex items-center rounded-2xl bg-surface/80 border border-white/[0.08] backdrop-blur-xl shadow-inner ${sizeClasses[size]} ${className}`}
    >
      {options.map((opt, i) => {
        const isSelected = opt.value === value;
        const Icon = opt.icon;

        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleSelect(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`relative flex items-center justify-center gap-2 rounded-xl font-sans font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] outline-none ${itemSizeClasses[size]} ${
              isSelected
                ? 'bg-deep-ground text-ink shadow-md border border-white/[0.1] font-bold'
                : 'text-mute hover:text-ink/90 hover:bg-white/[0.03]'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-signal' : 'text-mute'}`} />}
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected
                    ? 'bg-signal/20 text-signal font-bold'
                    : 'bg-white/[0.06] text-mute'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
