'use client';

import React from 'react';
import TeamDispatchFeed from '@/components/TeamDispatchFeed';

export default function DispatchPage() {
  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink min-h-[calc(100vh-3.5rem)]">
      <TeamDispatchFeed />
    </div>
  );
}
