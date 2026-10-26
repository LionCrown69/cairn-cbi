'use client';

import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { X } from 'lucide-react';
import { sound } from '@/lib/soundEffects';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  activeSnapPoint?: string | number | null;
  setActiveSnapPoint?: (snap: string | number | null) => void;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  snapPoints = [0.35, 0.7, 0.94],
  activeSnapPoint,
  setActiveSnapPoint,
}: BottomSheetProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) sound.playClick();
    onOpenChange(nextOpen);
  };

  return (
    <VaulDrawer.Root
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      fadeFromIndex={0}
      shouldScaleBackground
      dismissible={true}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
        <VaulDrawer.Content
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              onOpenChange(false);
            }
          }}
          className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto flex flex-col rounded-t-[32px] bg-ground/95 border-t border-white/[0.12] backdrop-blur-2xl shadow-2xl focus:outline-none"
          style={{
            maxHeight: '94vh',
          }}
        >
          {/* iOS Drag Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mt-3 mb-2" />

          {/* Header */}
          <div className="px-6 py-2 flex items-center justify-between border-b border-white/[0.06]">
            <div>
              <VaulDrawer.Title className="text-lg font-display font-bold text-ink">
                {title}
              </VaulDrawer.Title>
              {description && (
                <VaulDrawer.Description className="text-xs text-mute font-sans mt-0.5">
                  {description}
                </VaulDrawer.Description>
              )}
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-full bg-surface/80 hover:bg-surface text-mute hover:text-ink transition-colors"
              aria-label="Close sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-5 focus:outline-none flex-1">
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
