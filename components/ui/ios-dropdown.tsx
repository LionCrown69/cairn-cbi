'use client';

import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export interface DropdownItem<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  disabled?: boolean;
}

interface IOSDropdownProps<T extends string> {
  triggerLabel: string;
  triggerIcon?: React.ComponentType<{ className?: string }>;
  items: DropdownItem<T>[];
  selectedValue?: T;
  onSelect: (value: T) => void;
  className?: string;
}

export function IOSDropdown<T extends string>({
  triggerLabel,
  triggerIcon: TriggerIcon,
  items,
  selectedValue,
  onSelect,
  className = '',
}: IOSDropdownProps<T>) {
  const handleItemClick = (val: T) => {
    sound.playClick();
    onSelect(val);
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 hover:bg-surface border border-white/[0.08] text-xs font-mono text-ink transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${className}`}
          aria-label={triggerLabel}
        >
          {TriggerIcon && <TriggerIcon className="w-3.5 h-3.5 text-signal" />}
          <span>{triggerLabel}</span>
          <ChevronDown className="w-3 h-3 text-mute" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[200px] rounded-2xl bg-surface/95 border border-white/[0.12] p-1.5 shadow-2xl backdrop-blur-2xl text-xs font-sans text-ink focus:outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
        >
          {items.map((item) => {
            const isSelected = selectedValue === item.value;
            const ItemIcon = item.icon;

            return (
              <DropdownMenuPrimitive.Item
                key={item.value}
                disabled={item.disabled}
                onSelect={() => handleItemClick(item.value)}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer select-none outline-none transition-colors ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-signal/15 text-signal font-semibold'
                    : 'text-ink/90 hover:bg-white/[0.06] hover:text-ink focus:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {ItemIcon && (
                    <ItemIcon
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-signal' : 'text-mute'}`}
                    />
                  )}
                  <div>
                    <div className="text-xs">{item.label}</div>
                    {item.description && (
                      <div className="text-[10px] text-mute font-sans">{item.description}</div>
                    )}
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-signal shrink-0 ml-2" />}
              </DropdownMenuPrimitive.Item>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
