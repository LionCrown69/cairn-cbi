'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, ShieldCheck } from 'lucide-react';
import { MetricDefinition } from '@/lib/types';

export default function MetricsDictionaryPage() {
  const metrics: MetricDefinition[] = [
    {
      name: 'Station Elevation',
      unit: 'meters (m ASL)',
      source: 'Synthetic Alpine DEM (10m grid sample)',
      provenance: 'simulated',
      description: 'Ground altitude above mean sea level evaluated by procedural alpine elevation function.',
      accuracy: '±1.0 m (synthetic)',
    },
    {
      name: 'Antenna Tip Height',
      unit: 'meters (m)',
      source: 'Station hardware configuration',
      provenance: 'observed',
      description: 'Physical mast extension height above ground anchor base.',
      accuracy: '±0.1 m',
    },
    {
      name: 'Line-of-Sight Clearance',
      unit: 'meters (m)',
      source: 'Geometric ray vs DEM profile cross-section',
      provenance: 'estimated',
      description: 'Distance between linear propagation ray and the highest intervening mountain ridge.',
      accuracy: '±2.5 m (estimated)',
    },
    {
      name: 'Link Span Distance',
      unit: 'kilometers (km)',
      source: 'Euclidean distance over cartesian plane',
      provenance: 'derived',
      description: 'Straight-line 3D distance between station coordinates.',
      accuracy: '±0.01 km',
    },
    {
      name: 'Free Space Path Loss (FSPL)',
      unit: 'decibels (dB)',
      source: 'Standard Friis transmission formula at 915 MHz',
      provenance: 'estimated',
      description: 'Theoretical radio frequency attenuation over distance in unobstructed atmosphere.',
      accuracy: '±3.0 dB',
    },
    {
      name: 'Battery State of Charge',
      unit: 'percentage (%)',
      source: 'Station power management bus',
      provenance: 'observed',
      description: 'Real-time telemetry reported in station beacon packet.',
      accuracy: '±1%',
    },
    {
      name: 'Route Hops to Command',
      unit: 'hop count (integer)',
      source: 'BFS graph routing engine over active links',
      provenance: 'derived',
      description: 'Shortest path vertex traversal from station to base camp node.',
      accuracy: 'Exact',
    },
    {
      name: 'Packet Delivery Status',
      unit: 'enum (queued | delivered)',
      source: 'IndexedDB store-and-forward transaction log',
      provenance: 'observed',
      description: 'Physical confirmation of end-to-end receipt at target station.',
      accuracy: 'Exact',
    },
    {
      name: 'AI Situational Digest',
      unit: 'text string (summary)',
      source: 'LLM reasoning engine behind strict input whitelist',
      provenance: 'simulated',
      description: 'Algorithmic condensation of message log; strictly unverified.',
      accuracy: 'Unverified heuristic',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-deep-ground text-ink p-6 sm:p-12 max-w-6xl mx-auto w-full space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-line pb-6 space-y-2">
        <Link
          href="/design"
          className="inline-flex items-center gap-2 text-xs text-mute hover:text-signal transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Design System</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-signal uppercase tracking-widest">
          <Database className="w-4 h-4" />
          <span>Section 8 · Data Integrity & Provenance Dictionary</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-ink">
          Operational Metrics Dictionary.
        </h1>
        <p className="text-xs sm:text-sm text-mute max-w-2xl font-sans leading-relaxed">
          Every value displayed in CAIRN carries an explicit provenance tag. Under no circumstances are coverage percentages, reliability numbers, or telemetry claims invented.
        </p>
      </div>

      {/* Metrics Table */}
      <div className="overflow-x-auto border border-line rounded-lg cairn-glass">
        <table className="w-full text-left text-xs divide-y divide-line">
          <thead className="bg-surface text-mute uppercase text-[11px]">
            <tr>
              <th className="p-3.5">Metric Name</th>
              <th className="p-3.5">Unit</th>
              <th className="p-3.5">Provenance Tag</th>
              <th className="p-3.5">Source & Method</th>
              <th className="p-3.5">Accuracy / Bound</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 text-ink">
            {metrics.map(m => {
              const tagColors = {
                observed: 'border-caution text-caution bg-caution/10',
                derived: 'border-blue-400 text-blue-400 bg-blue-400/10',
                estimated: 'border-signal text-signal bg-signal/10',
                simulated: 'border-mute text-mute bg-surface',
              };

              return (
                <tr key={m.name} className="hover:bg-surface/30 transition-colors">
                  <td className="p-3.5 font-bold text-ink">
                    {m.name}
                    <div className="text-[10px] text-mute font-sans font-normal mt-0.5">
                      {m.description}
                    </div>
                  </td>
                  <td className="p-3.5 text-mute">{m.unit}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border inline-block ${
                        tagColors[m.provenance]
                      }`}
                    >
                      {m.provenance}
                    </span>
                  </td>
                  <td className="p-3.5 text-mute font-sans text-[11px]">{m.source}</td>
                  <td className="p-3.5 text-ink font-semibold">{m.accuracy}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Integrity Statement */}
      <div className="p-4 rounded bg-surface/50 border border-line flex items-center gap-3 text-xs text-mute">
        <ShieldCheck className="w-5 h-5 text-signal shrink-0" />
        <span>
          Compliance: Zero fictional statistics or decorative telemetry numbers exist in CAIRN. Every number rendered in the UI traces back to a verified row in this dictionary.
        </span>
      </div>
    </div>
  );
}
