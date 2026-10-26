'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export interface AccordionSection {
  id: string;
  number: string;
  title: string;
  summary: string;
  content: React.ReactNode;
}

interface IOSAccordionProps {
  sections: AccordionSection[];
  defaultValue?: string;
  className?: string;
}

export function IOSAccordion({ sections, defaultValue, className = '' }: IOSAccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultValue || sections[0]?.id}
      className={`space-y-4 ${className}`}
      onValueChange={(val) => {
        if (val) sound.playClick();
      }}
    >
      {sections.map((section) => (
        <AccordionPrimitive.Item
          key={section.id}
          value={section.id}
          className="group rounded-3xl bg-surface/40 border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-all data-[state=open]:border-signal/30 data-[state=open]:bg-surface/60 data-[state=open]:shadow-glass"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between p-6 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-signal">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-signal/15 text-signal border border-signal/20 shrink-0">
                  {section.number}
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-ink group-hover:text-signal transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-mute font-sans mt-1 max-w-xl">
                    {section.summary}
                  </p>
                </div>
              </div>

              <ChevronDown className="w-5 h-5 text-mute transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-signal shrink-0 ml-4" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.04]">
              {section.content}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
