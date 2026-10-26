'use client';

import React, { useState } from 'react';
import { useMeshStore } from '@/lib/store';
import { Mountain, Radio, AlertTriangle, CheckCircle2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { LinkExplainerOutput } from '@/lib/aiProvider';
import { sound } from '@/lib/soundEffects';

export default function TerrainProfileView() {
  const {
    nodes,
    selectedNodeId,
    comparisonNodeId,
    setComparisonNode,
    getSelectedProfile,
    links,
  } = useMeshStore();

  const [aiExplanation, setAiExplanation] = useState<LinkExplainerOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showRawInputs, setShowRawInputs] = useState(false);

  const profile = getSelectedProfile();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const comparisonNode = nodes.find(n => n.id === comparisonNodeId);

  if (!profile || !selectedNode || !comparisonNode) {
    return (
      <div className="cairn-glass p-6 rounded-lg border border-line text-xs font-mono text-mute text-center">
        Select a node and target station to render the line-of-sight terrain elevation cross-section.
      </div>
    );
  }

  // Find link between them if exists
  const activeLink = links.find(
    l =>
      (l.fromId === selectedNode.id && l.toId === comparisonNode.id) ||
      (l.toId === selectedNode.id && l.fromId === comparisonNode.id)
  );

  // SVG dimensions for the cross-section
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minElev = 1800;
  const maxElev = 3200;

  function toSvgX(distKm: number): number {
    return paddingX + (distKm / (profile!.distanceKm || 1)) * (svgWidth - 2 * paddingX);
  }

  function toSvgY(elevM: number): number {
    const norm = (elevM - minElev) / (maxElev - minElev);
    return (svgHeight - paddingY) - norm * (svgHeight - 2 * paddingY);
  }

  // Build ground polygon path
  const groundPoints = profile.samples.map(s => `${toSvgX(s.distKm)},${toSvgY(s.groundElevationM)}`);
  const groundPath = `M ${toSvgX(0)},${svgHeight - paddingY} L ${groundPoints.join(' L ')} L ${toSvgX(profile.distanceKm)},${svgHeight - paddingY} Z`;

  // Antennas & LOS Ray
  const rayStart = {
    x: toSvgX(0),
    y: toSvgY(selectedNode.elevationM + selectedNode.antennaHeightM),
  };
  const rayEnd = {
    x: toSvgX(profile.distanceKm),
    y: toSvgY(comparisonNode.elevationM + comparisonNode.antennaHeightM),
  };

  async function handleExplainWithAi() {
    sound.playClick();
    setIsLoadingAi(true);
    try {
      const payload = {
        fromCallsign: selectedNode!.callsign,
        toCallsign: comparisonNode!.callsign,
        distanceKm: profile!.distanceKm,
        status: profile!.isObstructed ? ('severed' as const) : ('online' as const),
        clearanceM: profile!.minClearanceM,
        lossMarginDb: activeLink ? activeLink.lossMarginDb : 0,
        fromElevM: selectedNode!.elevationM,
        toElevM: comparisonNode!.elevationM,
        fromAntennaM: selectedNode!.antennaHeightM,
        toAntennaM: comparisonNode!.antennaHeightM,
      };

      const res = await fetch('/api/explain-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAiExplanation(data);
      sound.playSuccess();
    } catch (e) {
      console.error('Failed to explain link', e);
      sound.playAlert();
    } finally {
      setIsLoadingAi(false);
    }
  }

  return (
    <div className="cairn-glass rounded-2xl p-5 text-ink font-mono text-xs space-y-4">
      {/* Header and Station Pair Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-signal" />
          <span className="font-bold tracking-wider uppercase text-ink">
            Terrain Elevation Profile
          </span>
          <span className="text-[11px] text-mute">· Line of Sight Ray</span>
        </div>

        {/* Comparison Station Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-mute text-[11px]">TARGET:</span>
          <select
            value={comparisonNodeId}
            onChange={e => {
              sound.playClick();
              setComparisonNode(e.target.value);
            }}
            className="bg-surface/80 border border-white/10 text-ink rounded-full px-3 py-1 text-xs focus:border-signal outline-none cursor-pointer"
          >
            {nodes
              .filter(n => n.id !== selectedNodeId)
              .map(n => (
                <option key={n.id} value={n.id}>
                  {n.callsign} ({n.elevationM}m)
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* SVG Cross-Section Elevation Graphic */}
      <div className="relative w-full overflow-hidden bg-deep-ground/80 rounded-xl border border-white/[0.06] p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="profile-ground-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A3320" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0E120A" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Elevation Horizontal Grid Guidelines */}
          {[2000, 2400, 2800, 3200].map(elev => {
            const y = toSvgY(elev);
            return (
              <g key={elev}>
                <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#252A1E" strokeWidth="1" />
                <text x={paddingX - 6} y={y + 3} fill="#A4A99A" fontSize="8" textAnchor="end">
                  {elev}m
                </text>
              </g>
            );
          })}

          {/* Ground Silhouette */}
          <path d={groundPath} fill="url(#profile-ground-fill)" stroke="#55642D" strokeWidth="1.5" />

          {/* Line of Sight Ray */}
          <line
            x1={rayStart.x}
            y1={rayStart.y}
            x2={rayEnd.x}
            y2={rayEnd.y}
            stroke={profile.isObstructed ? '#FF8A3D' : '#D4F53C'}
            strokeWidth="2"
            strokeDasharray={profile.isObstructed ? '4 3' : 'none'}
          />

          {/* Station A Mast */}
          <line
            x1={rayStart.x}
            y1={toSvgY(selectedNode.elevationM)}
            x2={rayStart.x}
            y2={rayStart.y}
            stroke="#D4F53C"
            strokeWidth="2.5"
          />
          <circle cx={rayStart.x} cy={rayStart.y} r="4" fill="#D4F53C" />
          <text x={rayStart.x} y={rayStart.y - 8} fill="#D4F53C" fontSize="9" fontWeight="bold" textAnchor="middle">
            {selectedNode.callsign}
          </text>

          {/* Station B Mast */}
          <line
            x1={rayEnd.x}
            y1={toSvgY(comparisonNode.elevationM)}
            x2={rayEnd.x}
            y2={rayEnd.y}
            stroke="#FF8A3D"
            strokeWidth="2.5"
          />
          <circle cx={rayEnd.x} cy={rayEnd.y} r="4" fill="#FF8A3D" />
          <text x={rayEnd.x} y={rayEnd.y - 8} fill="#FF8A3D" fontSize="9" fontWeight="bold" textAnchor="middle">
            {comparisonNode.callsign}
          </text>

          {/* Minimum Clearance Indicator */}
          {profile.isObstructed && (
            <g transform={`translate(${svgWidth / 2}, ${toSvgY(2550)})`}>
              <circle r="12" fill="#FF8A3D" opacity="0.25" className="animate-ping" />
              <circle r="6" fill="#FF8A3D" />
              <text x="0" y="-12" fill="#FF8A3D" fontSize="9" fontWeight="bold" textAnchor="middle">
                INTERVENING RIDGE BREACH ({profile.minClearanceM}m)
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Metrics Strip & AI Link Explainer Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-mute block text-[10px]">SPAN DISTANCE</span>
            <span className="font-bold text-ink">{profile.distanceKm} km</span>
          </div>
          <div>
            <span className="text-mute block text-[10px]">CLEARANCE MARGIN</span>
            <span
              className={`font-bold ${
                profile.isObstructed ? 'text-caution' : 'text-signal'
              }`}
            >
              {profile.minClearanceM > 0 ? `+${profile.minClearanceM} m` : `${profile.minClearanceM} m`}
            </span>
          </div>
          <div>
            <span className="text-mute block text-[10px]">STATUS</span>
            <span
              className={`font-bold flex items-center gap-1 ${
                profile.isObstructed ? 'text-caution' : 'text-signal'
              }`}
            >
              {profile.isObstructed ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SEVERED (BLOCKED)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CLEAR LINE OF SIGHT
                </>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={handleExplainWithAi}
          disabled={isLoadingAi}
          className="px-3 py-1.5 rounded bg-surface border border-line hover:border-signal text-signal flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isLoadingAi ? 'Analyzing Propagation...' : 'Explain Link with AI'}</span>
        </button>
      </div>

      {/* AI Link Explanation Drawer */}
      {aiExplanation && (
        <div className="cairn-glass-subtle rounded-xl p-4 border border-white/[0.08] space-y-2.5 mt-3 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] text-mute border-b border-white/[0.06] pb-2">
            <span className="text-caution font-medium">{aiExplanation.disclaimer}</span>
            <button
              onClick={() => setShowRawInputs(!showRawInputs)}
              className="text-mute hover:text-ink flex items-center gap-1 text-[11px] font-mono transition-colors"
            >
              <span>{showRawInputs ? 'Hide Inputs' : 'Show Inputs'}</span>
              {showRawInputs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <p className="text-xs text-ink leading-relaxed">{aiExplanation.explanation}</p>
          <p className="text-xs text-mute leading-relaxed">{aiExplanation.propagationDiagnosis}</p>
          <div className="text-xs text-signal font-semibold pt-1 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-signal/10 border border-signal/20 text-[10px] tracking-wider uppercase">Mitigation</span>
            <span>{aiExplanation.mitigationSuggestion}</span>
          </div>

          {showRawInputs && (
            <pre className="p-3 rounded-lg bg-surface/80 border border-white/[0.06] text-[10px] text-mute overflow-x-auto mt-2">
              {JSON.stringify(aiExplanation.rawInput, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
