'use client';

import React from 'react';
import { useMeshStore } from '@/lib/store';
import { Layers, Maximize2, RotateCcw, Radio, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ConsoleMap() {
  const {
    nodes,
    links,
    selectedNodeId,
    comparisonNodeId,
    selectNode,
    setComparisonNode,
    is3dView,
    toggle3dView,
    activeLayer,
    activeExplodedView,
    toggleExplodedView,
    getSelectedRoute,
    resetMesh,
  } = useMeshStore();

  const [mapPreset, setMapPreset] = React.useState<'topographic' | '3d' | 'heatmap' | 'links' | 'weather'>('topographic');
  const [showRiskArea, setShowRiskArea] = React.useState(true);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  const selectedRoute = getSelectedRoute();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Map coordinate conversion: grid range (-6 to +8 km) -> SVG (800 x 560 px)
  const mapWidth = 800;
  const mapHeight = 560;

  function toSvgX(kmX: number): number {
    return ((kmX + 6) / 14) * (mapWidth - 120) + 60;
  }

  function toSvgY(kmY: number): number {
    return ((-kmY + 6) / 13) * (mapHeight - 120) + 60;
  }

  // Generate synthetic contour rings
  const contourCenters = [
    { x: -1.8, y: 0.5, r1: 90, r2: 60, r3: 35, label: 'SADDLE MASSIF 2620M' },
    { x: 2.1, y: 2.4, r1: 105, r2: 70, r3: 40, label: 'NORTH RIDGE 2840M' },
    { x: 0.2, y: -3.5, r1: 95, r2: 65, r3: 30, label: 'COL BLANC 3050M' },
    { x: -4.5, y: -2.8, r1: 75, r2: 45, r3: 20, label: 'CIRQUE VAL 2110M' },
  ];

  return (
    <div className="relative w-full h-[620px] bg-deep-ground rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col justify-between">
      {/* Top Map Toolbar */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between border-b border-white/[0.08] bg-surface/80 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span className="text-ink font-bold tracking-wider uppercase">
            Valais Alps Tactical Mesh
          </span>
          <span className="hidden md:inline text-mute text-[11px]">
            (14x13 km Cartographic · 10m DEM)
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRiskArea(!showRiskArea)}
            className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
              showRiskArea
                ? 'bg-severed/20 text-severed border-severed/40 font-bold'
                : 'bg-surface/80 text-mute border-white/10 hover:text-ink'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-severed" />
            <span>Risk Shadow {showRiskArea ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={toggle3dView}
            className={`px-3 py-1 rounded-full border transition-all ${
              is3dView || mapPreset === '3d'
                ? 'bg-signal text-deep-ground font-bold border-signal'
                : 'bg-surface/80 text-mute border-white/10 hover:text-ink'
            }`}
          >
            <span>{is3dView ? '3D Perspective' : '2D Map'}</span>
          </button>

          <button
            onClick={resetMesh}
            title="Reset mesh"
            className="p-1 rounded-full bg-surface/80 border border-white/10 text-mute hover:text-ink transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Left Tactical Toolbox */}
      <div className="absolute left-4 top-16 z-30 flex flex-col gap-1.5 p-1 rounded-xl bg-surface/90 border border-white/[0.08] backdrop-blur-md shadow-xl text-ink font-mono text-xs">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.5))}
          title="Zoom in"
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
          title="Zoom out"
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          -
        </button>
        <div className="w-full h-px bg-white/10 my-0.5" />
        <button
          onClick={() => setZoomLevel(1)}
          title="Reset zoom"
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-[10px] text-mute hover:text-ink transition-colors"
        >
          1x
        </button>
        <button
          onClick={() => setShowRiskArea(prev => !prev)}
          title="Toggle RF shadow hazard"
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            showRiskArea ? 'text-severed' : 'text-mute hover:text-ink'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas with dynamic perspective */}
      <div
        className={`relative w-full flex-1 overflow-hidden transition-transform duration-700 ease-out flex items-center justify-center ${
          is3dView || mapPreset === '3d'
            ? '[transform:perspective(1200px)_rotateX(24deg)_scale(0.95)]'
            : ''
        }`}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#252A1E" strokeWidth="0.8" />
            </pattern>

            {/* Red Hazard Stripe Pattern */}
            <pattern id="hazard-stripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#EF4444" strokeWidth="2.5" opacity="0.35" />
            </pattern>

            {/* Red Occlusion Glow */}
            <radialGradient id="occlusion-red-glow" cx="45%" cy="55%" r="65%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#B91C1C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#450A0A" stopOpacity="0.08" />
            </radialGradient>

            {/* Coverage Heatmap Gradient */}
            <radialGradient id="coverage-lime-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4F53C" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#D4F53C" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#D4F53C" stopOpacity="0" />
            </radialGradient>

            <filter id="glow-packet" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER: BACKGROUND BASE GRID & TOPOGRAPHY */}
          <rect width={mapWidth} height={mapHeight} fill="#0E120A" />
          <rect width={mapWidth} height={mapHeight} fill="url(#grid-pattern)" />

          {/* LAYER: HEATMAP COVERAGE BUFFERS (When Heatmap Preset Active) */}
          {(mapPreset === 'heatmap' || mapPreset === 'topographic') && (
            <g id="layer-coverage-heatmap">
              {nodes.filter(n => n.status === 'online').map(n => (
                <circle
                  key={`heat-${n.id}`}
                  cx={toSvgX(n.x)}
                  cy={toSvgY(n.y)}
                  r="110"
                  fill="url(#coverage-lime-glow)"
                />
              ))}
            </g>
          )}

          {/* CRITICAL FEATURE: RED SIGNAL LOST / TERRAIN SHADOW HAZARD ZONE */}
          {showRiskArea && (
            <g id="layer-risk-shadow" className="animate-fadeIn">
              {/* Occlusion Shaded Polygon behind North Ridge crest */}
              <polygon
                points="80,310 200,280 310,315 285,450 215,490 70,470"
                fill="url(#occlusion-red-glow)"
                stroke="#EF4444"
                strokeWidth="1.8"
                strokeDasharray="6 3"
              />
              {/* Diagonal hazard hatching overlay */}
              <polygon
                points="80,310 200,280 310,315 285,450 215,490 70,470"
                fill="url(#hazard-stripes)"
              />

              {/* Tactical Warning Badge in Red Dead Zone */}
              <g transform="translate(145, 345)">
                <rect
                  x="-75"
                  y="-14"
                  width="150"
                  height="28"
                  rx="6"
                  fill="#1C0808"
                  fillOpacity="0.95"
                  stroke="#EF4444"
                  strokeWidth="1.2"
                />
                <circle cx="-60" cy="0" r="3.5" fill="#EF4444" className="animate-ping" />
                <circle cx="-60" cy="0" r="2.5" fill="#EF4444" />
                <text
                  x="2"
                  y="-2"
                  fill="#F87171"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  SIGNAL LOST // RF SHADOW
                </text>
                <text
                  x="2"
                  y="8"
                  fill="#EF4444"
                  fontSize="7.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  -925.7m RIDGE OCCLUSION
                </text>
              </g>
            </g>
          )}

          {/* LAYER 1: TERRAIN CONTOURS */}
          {(activeLayer === 'all' || activeLayer === 'l1') && (
            <g id="layer-terrain" opacity={activeExplodedView && activeLayer !== 'l1' ? 0.35 : 0.85}>
              {/* Topographic Elevation Contours */}
              {contourCenters.map((c, idx) => {
                const cx = toSvgX(c.x);
                const cy = toSvgY(c.y);
                return (
                  <g key={idx} className="stroke-line/50 fill-none" strokeWidth="1">
                    <ellipse cx={cx} cy={cy} rx={c.r1} ry={c.r1 * 0.75} strokeDasharray="3 3" />
                    <ellipse cx={cx} cy={cy} rx={c.r2} ry={c.r2 * 0.72} />
                    <ellipse cx={cx} cy={cy} rx={c.r3} ry={c.r3 * 0.68} strokeWidth="1.5" stroke="#485338" />
                  </g>
                );
              })}

              {/* Shaded Ridge Crest Line */}
              <path
                d="M 120 420 Q 320 280 440 220 T 720 180"
                fill="none"
                stroke="#55642D"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                opacity="0.8"
              />
            </g>
          )}

          {/* LAYER 2: NETWORK LINKS (ESTIMATED LINE OF SIGHT) */}
          {(activeLayer === 'all' || activeLayer === 'l2') && (
            <g id="layer-links">
              {links.map(link => {
                const from = nodes.find(n => n.id === link.fromId);
                const to = nodes.find(n => n.id === link.toId);
                if (!from || !to) return null;

                const x1 = toSvgX(from.x);
                const y1 = toSvgY(from.y);
                const x2 = toSvgX(to.x);
                const y2 = toSvgY(to.y);

                const isOnline = link.status === 'online';
                const isPartOfActiveRoute =
                  selectedRoute.reachable &&
                  selectedRoute.path.includes(link.fromId) &&
                  selectedRoute.path.includes(link.toId) &&
                  Math.abs(selectedRoute.path.indexOf(link.fromId) - selectedRoute.path.indexOf(link.toId)) === 1;

                const isSelectedLink =
                  (link.fromId === selectedNodeId && link.toId === comparisonNodeId) ||
                  (link.toId === selectedNodeId && link.fromId === comparisonNodeId);

                return (
                  <g key={link.id}>
                    {/* Link Base Stroke */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={
                        isPartOfActiveRoute
                          ? '#FF8A3D'
                          : isOnline
                          ? '#D4F53C'
                          : '#525946'
                      }
                      strokeWidth={isPartOfActiveRoute ? 3 : isOnline ? 2 : 1.5}
                      strokeDasharray={
                        isPartOfActiveRoute ? '6 4' : isOnline ? 'none' : '4 4'
                      }
                      opacity={isOnline ? 0.9 : 0.4}
                      className={isPartOfActiveRoute ? 'animate-pulse' : ''}
                    />

                    {/* Only show distance badge if part of active route or selected link */}
                    {(isPartOfActiveRoute || isSelectedLink) && (
                      <g
                        transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}
                        className="cursor-pointer"
                        onClick={() => {
                          selectNode(from.id);
                          setComparisonNode(to.id);
                        }}
                      >
                        <rect
                          x="-18"
                          y="-7"
                          width="36"
                          height="14"
                          rx="4"
                          fill="#0E120A"
                          fillOpacity="0.8"
                          stroke={isPartOfActiveRoute ? '#FF8A3D' : '#3A4030'}
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y="3"
                          fill={isPartOfActiveRoute ? '#FF8A3D' : '#A4A99A'}
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {link.distanceKm}k
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* LAYER 3: MESSAGES & NODES (OBSERVED SIMULATION) */}
          {(activeLayer === 'all' || activeLayer === 'l3') && (
            <g id="layer-nodes">
              {nodes.map(node => {
                const cx = toSvgX(node.x);
                const cy = toSvgY(node.y);
                const isSelected = node.id === selectedNodeId;
                const isComparison = node.id === comparisonNodeId;
                const isOnline = node.status === 'online';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${cx}, ${cy})`}
                    className="cursor-pointer group"
                    onClick={() => selectNode(node.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={e => {
                      if (e.key === 'Enter') selectNode(node.id);
                    }}
                  >
                    {/* Selected Highlight Aura */}
                    {isSelected && (
                      <circle
                        r="18"
                        fill="#D4F53C"
                        opacity="0.15"
                      />
                    )}

                    {/* Outer Beacon Ring */}
                    <circle
                      r="10"
                      fill="#1B1F16"
                      stroke={
                        isSelected
                          ? '#D4F53C'
                          : isComparison
                          ? '#FF8A3D'
                          : isOnline
                          ? '#3A4030'
                          : '#525946'
                      }
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Core Status Dot */}
                    <circle
                      r="4"
                      fill={isOnline ? '#D4F53C' : '#525946'}
                    />

                    {/* Clean Callsign (no giant black box) */}
                    <text
                      x="0"
                      y="20"
                      fill={isSelected ? '#D4F53C' : '#F1F0EA'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="monospace"
                      textAnchor="middle"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                    >
                      {node.callsign}
                    </text>

                    {/* Elevation Subtitle */}
                    <text
                      x="0"
                      y="32"
                      fill="#8E9482"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95)' }}
                    >
                      {node.elevationM}m
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Preset View Thumbnails Carousel (Matching Reference Mockup) */}
      <div className="relative z-20 px-3 py-2 bg-deep-ground/90 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-[10px] text-mute uppercase tracking-widest pl-1 shrink-0">VIEW:</span>
        {[
          { id: 'topographic', label: 'TOPOGRAPHIC', icon: '◬', desc: '10m Contours' },
          { id: '3d', label: '3D TERRAIN', icon: '▲', desc: 'Oblique Relief' },
          { id: 'heatmap', label: 'HEATMAP', icon: '◎', desc: 'Coverage Field' },
          { id: 'links', label: 'LINK QUALITY', icon: '⇄', desc: 'SNR & LOS' },
          { id: 'weather', label: 'WEATHER', icon: '☁', desc: 'Simulated Isobars' },
        ].map(preset => {
          const isActive = mapPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setMapPreset(preset.id as any);
                if (preset.id === '3d' && !is3dView) toggle3dView();
                if (preset.id !== '3d' && is3dView) toggle3dView();
              }}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-signal text-deep-ground font-bold border-signal shadow-sm'
                  : 'bg-surface/60 border-white/[0.08] text-ink/75 hover:text-ink hover:border-white/20'
              }`}
            >
              <span className="text-xs opacity-80">{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Map Status Bar */}
      <div className="relative z-20 px-4 py-2.5 border-t border-white/[0.08] bg-surface/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-mute">SELECTED:</span>
            <span className="text-signal font-bold">{selectedNode?.callsign}</span>
            <span className="px-1.5 py-0.2 rounded bg-surface border border-line text-[10px] text-mute uppercase">
              {selectedNode?.role}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-mute">ROUTE TO BASE:</span>
            {selectedRoute.reachable ? (
              <span className="text-signal flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedRoute.hops} Hop(s) ({selectedRoute.distanceKm} km)
              </span>
            ) : (
              <span className="text-caution flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                NO DIRECT PATH (STORE & FWD QUEUE)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-mute">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-signal" /> Direct LOS
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-caution" /> Relay Hop
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-severed" /> Severed
          </span>
        </div>
      </div>
    </div>
  );
}
