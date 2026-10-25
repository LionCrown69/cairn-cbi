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

  const selectedRoute = getSelectedRoute();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Map coordinate conversion: grid range (-6 to +8 km) -> SVG (800 x 600 px)
  const mapWidth = 800;
  const mapHeight = 560;

  function toSvgX(kmX: number): number {
    return ((kmX + 6) / 14) * (mapWidth - 120) + 60;
  }

  function toSvgY(kmY: number): number {
    // Invert Y so positive is North
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
    <div className="relative w-full h-[580px] bg-deep-ground rounded-lg border border-line overflow-hidden flex flex-col justify-between">
      {/* Top Map Toolbar */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between border-b border-line bg-surface/75 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span className="text-ink font-bold tracking-wider uppercase">
            SECTOR: VALAIS ALPS (SYNTHETIC GRID 14x13 KM)
          </span>
          <span className="hidden md:inline px-1.5 py-0.5 rounded bg-surface border border-line text-mute text-[10px]">
            WGS84 / LOCAL CARTESIAN
          </span>
        </div>

        {/* View Mode Controls: 2D/3D & Exploded Layers */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle3dView}
            className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
              is3dView
                ? 'bg-signal text-deep-ground font-bold border-signal'
                : 'bg-surface text-mute border-line hover:text-ink'
            }`}
          >
            <span>{is3dView ? '3D Oblique' : '2D Tactical'}</span>
          </button>

          <button
            onClick={toggleExplodedView}
            className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
              activeExplodedView
                ? 'bg-caution text-deep-ground font-bold border-caution'
                : 'bg-surface text-mute border-line hover:text-ink'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Plate 03 Layers</span>
          </button>

          <button
            onClick={resetMesh}
            title="Reset mesh to default"
            className="p-1 rounded bg-surface border border-line text-mute hover:text-ink hover:border-signal/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Vector Canvas with 3D Tilt CSS Transform if active */}
      <div
        className={`relative w-full flex-1 overflow-hidden transition-transform duration-700 ease-out flex items-center justify-center ${
          is3dView
            ? '[transform:perspective(900px)_rotateX(36deg)_scale(0.92)] shadow-2xl'
            : ''
        }`}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#252A1E" strokeWidth="1" />
            </pattern>

            <filter id="glow-packet" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER 1: TERRAIN CONTOURS (SIMULATED MODEL) */}
          {(activeLayer === 'all' || activeLayer === 'l1') && (
            <g id="layer-terrain" opacity={activeExplodedView && activeLayer !== 'l1' ? 0.35 : 0.85}>
              <rect width={mapWidth} height={mapHeight} fill="url(#grid-pattern)" />

              {/* Topographic Elevation Contours */}
              {contourCenters.map((c, idx) => {
                const cx = toSvgX(c.x);
                const cy = toSvgY(c.y);
                return (
                  <g key={idx} className="stroke-line/60 fill-none" strokeWidth="1">
                    <ellipse cx={cx} cy={cy} rx={c.r1} ry={c.r1 * 0.75} strokeDasharray="3 3" />
                    <ellipse cx={cx} cy={cy} rx={c.r2} ry={c.r2 * 0.72} />
                    <ellipse cx={cx} cy={cy} rx={c.r3} ry={c.r3 * 0.68} strokeWidth="1.5" />
                    <text
                      x={cx}
                      y={cy + c.r1 * 0.8}
                      fill="#A4A99A"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      opacity="0.6"
                    >
                      {c.label}
                    </text>
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
                opacity="0.7"
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

                    {/* Midpoint Distance Badge */}
                    <g
                      transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 8})`}
                      className="cursor-pointer"
                      onClick={() => {
                        selectNode(from.id);
                        setComparisonNode(to.id);
                      }}
                    >
                      <rect
                        x="-24"
                        y="-8"
                        width="48"
                        height="16"
                        rx="3"
                        fill="#0E120A"
                        stroke={isOnline ? '#3A4030' : '#525946'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        fill={isOnline ? '#F1F0EA' : '#A4A99A'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {link.distanceKm}km
                      </text>
                    </g>
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
                    aria-label={`Node ${node.callsign}, status ${node.status}, elevation ${node.elevationM}m`}
                    onKeyDown={e => {
                      if (e.key === 'Enter') selectNode(node.id);
                    }}
                  >
                    {/* Selected Highlight Aura */}
                    {isSelected && (
                      <circle
                        r="24"
                        fill="#D4F53C"
                        opacity="0.18"
                        className="animate-ping"
                      />
                    )}

                    {isComparison && !isSelected && (
                      <circle
                        r="20"
                        fill="#FF8A3D"
                        opacity="0.2"
                      />
                    )}

                    {/* Outer Target Ring */}
                    <circle
                      r="14"
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
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Core Status Beacon */}
                    <circle
                      r="6"
                      fill={isOnline ? '#D4F53C' : '#525946'}
                      filter={isOnline ? 'url(#glow-packet)' : undefined}
                    />

                    {/* Callsign Label Tag */}
                    <g transform="translate(0, 24)">
                      <rect
                        x="-45"
                        y="-7"
                        width="90"
                        height="18"
                        rx="3"
                        fill="#0E120A"
                        stroke={isSelected ? '#D4F53C' : '#3A4030'}
                        strokeWidth={isSelected ? 1.5 : 1}
                      />
                      <text
                        x="0"
                        y="5"
                        fill={isSelected ? '#D4F53C' : '#F1F0EA'}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {node.callsign}
                      </text>
                    </g>

                    {/* Elevation Subtitle */}
                    <text
                      x="0"
                      y="32"
                      fill="#A4A99A"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.elevationM}m · {node.role.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Map Status Bar */}
      <div className="relative z-20 p-3 sm:p-4 border-t border-line bg-surface/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
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
