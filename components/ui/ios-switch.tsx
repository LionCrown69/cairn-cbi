'use client';

import React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { sound } from '@/lib/soundEffects';

interface IOSSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  ariaLabel?: string;
}

export function IOSSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  className = '',
  ariaLabel,
}: IOSSwitchProps) {
  const handleChange = (nextChecked: boolean) => {
    sound.playClick();
    onCheckedChange(nextChecked);
  };

  return (
    <SwitchPrimitives.Root
      id={id}
      checked={checked}
      onCheckedChange={handleChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-deep-ground disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.96] ${
        checked ? 'bg-signal shadow-glow-signal/40' : 'bg-surface'
      } ${className}`}
    >
      <SwitchPrimitives.Thumb
        className={`pointer-events-none block h-5 w-5 rounded-full bg-deep-ground shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0 bg-mute/80'
        }`}
      />
    </SwitchPrimitives.Root>
  );
}
