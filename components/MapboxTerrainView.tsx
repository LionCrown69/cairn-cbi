'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMeshStore } from '@/lib/store';
import { Compass, RotateCw, Eye, ShieldAlert, Maximize2, Radio, Play, Pause } from 'lucide-react';

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiYWxva3htYXBib3giLCJhIjoiY21kbzh3cWE4MXZmOTJrcmJra3ZpdTV5dSJ9.LiEsKfpg8rzwIg-bDsJzxQ';

const MAPBOX_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
  'mapbox://styles/alokxmapbox/cmvnp68an00sz01s592ws09cp';

export default function MapboxTerrainView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const isOrbitingRef = useRef<boolean>(false);

  const {
    nodes,
    links,
    selectedNodeId,
    selectNode,
    getSelectedRoute,
  } = useMeshStore();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [fps, setFps] = useState(60);

  const selectedRoute = getSelectedRoute();

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: [8.4912, 46.4900], // Valais Massif
      zoom: 12.2,
      pitch: 58,
      bearing: -20,
      antialias: true,
      maxPitch: 85,
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);

      // Add 3D Terrain source if not already present in the style
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
      }

      // Enable 3D terrain exaggeration
      try {
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      } catch (err) {
        console.warn('Could not set terrain:', err);
      }

      // Add atmospheric sky/fog layer for cinematic depth
      try {
        map.setFog({
          range: [0.8, 8.0],
          color: '#0E120A',
          'horizon-blend': 0.18,
          'high-color': '#2A3320',
          'space-color': '#0C0F08',
          'star-intensity': 0.3,
        });
      } catch (err) {
        console.warn('Could not set fog:', err);
      }

      // Add dynamic mesh links GeoJSON source
      const linkFeatures = links.map(l => {
        const from = nodes.find(n => n.id === l.fromId);
        const to = nodes.find(n => n.id === l.toId);
        if (!from || !to) return null;

        const isOnline = l.status === 'online';
        return {
          type: 'Feature' as const,
          properties: {
            id: l.id,
            status: l.status,
            distanceKm: l.distanceKm,
            color: isOnline ? '#D4F53C' : '#525946',
            width: isOnline ? 2.5 : 1.5,
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: [
              [from.lon, from.lat],
              [to.lon, to.lat],
            ],
          },
        };
      }).filter(Boolean);

      map.addSource('cairn-live-links', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: linkFeatures as any,
        },
      });

      // Render link lines
      map.addLayer({
        id: 'cairn-links-glow',
        type: 'line',
        source: 'cairn-live-links',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': 0.75,
        },
      });

      // Active Route Layer (Plate 02 Tactical Orange Path)
      map.addSource('cairn-active-route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'cairn-active-route-line',
        type: 'line',
        source: 'cairn-active-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#FF8A3D',
          'line-width': 4.5,
          'line-dasharray': [4, 2],
          'line-opacity': 0.95,
        },
      });
    });

    // Clean up
    return () => {
      map.remove();
    };
  }, []);

  // Update Active Route Line when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const routeSource = map.getSource('cairn-active-route') as mapboxgl.GeoJSONSource;
    if (!routeSource) return;

    if (selectedRoute.reachable && selectedRoute.path.length > 1) {
      const coords = selectedRoute.path.map(id => {
        const n = nodes.find(node => node.id === id);
        return n ? [n.lon, n.lat] : null;
      }).filter(Boolean) as [number, number][];

      routeSource.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { hops: selectedRoute.hops },
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      });
    } else {
      routeSource.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [selectedRoute, mapLoaded, nodes]);

  // Update 3D Markers on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    nodes.forEach(node => {
      const isSelected = node.id === selectedNodeId;
      const isOnline = node.status === 'online';

      // Custom high-tech DOM Marker element
      const el = document.createElement('div');
      el.className = 'group cursor-pointer select-none';
      el.style.transform = 'translate(-50%, -50%)';

      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          ${
            isSelected
              ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(212, 245, 60, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #1B1F16; border: 2px solid ${
            isSelected ? '#D4F53C' : isOnline ? '#3A4030' : '#525946'
          }; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(0,0,0,0.8);">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${
              isOnline ? '#D4F53C' : '#525946'
            }; ${isOnline ? 'box-shadow: 0 0 8px #D4F53C;' : ''}"></div>
          </div>
          <div style="margin-top: 5px; padding: 2px 6px; background: rgba(14, 18, 10, 0.92); border: 1px solid ${
            isSelected ? '#D4F53C' : '#3A4030'
          }; border-radius: 4px; font-family: monospace; font-size: 9px; font-weight: bold; color: ${
        isSelected ? '#D4F53C' : '#F1F0EA'
      }; white-space: nowrap; pointer-events: none; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
            ${node.callsign} <span style="color: #A4A99A; font-weight: normal;">${node.elevationM}m</span>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        selectNode(node.id);
        map.flyTo({
          center: [node.lon, node.lat],
          zoom: 13.5,
          pitch: 65,
          bearing: (map.getBearing() + 25) % 360,
          duration: 1800,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([node.lon, node.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [nodes, selectedNodeId, selectNode]);

  // Cinematic 360 Orbit Animation
  useEffect(() => {
    isOrbitingRef.current = isOrbiting;
    if (!isOrbiting) return;

    let animId: number;
    function orbitStep() {
      if (!isOrbitingRef.current || !mapRef.current) return;
      const curBearing = mapRef.current.getBearing();
      mapRef.current.setBearing((curBearing + 0.15) % 360);
      animId = requestAnimationFrame(orbitStep);
    }

    animId = requestAnimationFrame(orbitStep);
    return () => cancelAnimationFrame(animId);
  }, [isOrbiting]);

  function handleToggleTilt() {
    const map = mapRef.current;
    if (!map) return;
    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
      setIs3D(false);
    } else {
      map.easeTo({ pitch: 62, bearing: -22, duration: 1000 });
      setIs3D(true);
    }
  }

  function handleResetSectorView() {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [8.4912, 46.4900],
      zoom: 12.2,
      pitch: 58,
      bearing: -18,
      duration: 1600,
    });
  }

  return (
    <div className="relative w-full h-[620px] bg-deep-ground rounded-lg border border-line overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Top Mapbox HUD Strip */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between border-b border-line bg-surface/80 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
          <span className="text-ink font-bold tracking-wider uppercase">
            LIVE MAPBOX 3D TERRAIN · VALAIS ALPS
          </span>
          <span className="hidden md:inline px-1.5 py-0.5 rounded bg-deep-ground border border-line text-signal text-[10px]">
            STYLE: alokxmapbox/cmvnp68an00sz01s592ws09cp
          </span>
        </div>

        {/* Cinematic Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOrbiting(!isOrbiting)}
            className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
              isOrbiting
                ? 'bg-signal text-deep-ground font-bold border-signal shadow-glow-signal'
                : 'bg-surface text-mute border-line hover:text-ink'
            }`}
            title="Toggle cinematic 360° terrain orbit"
          >
            {isOrbiting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isOrbiting ? 'Orbiting' : 'Orbit'}</span>
          </button>

          <button
            onClick={handleToggleTilt}
            className="px-2.5 py-1 rounded bg-surface border border-line text-mute hover:text-ink hover:border-signal/50 transition-colors"
          >
            {is3D ? '2D Topo' : '3D Oblique'}
          </button>

          <button
            onClick={handleResetSectorView}
            title="Reset Sector Camera"
            className="p-1 rounded bg-surface border border-line text-mute hover:text-ink hover:border-signal/50 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mapbox Canvas Container */}
      <div ref={mapContainerRef} className="relative w-full flex-1" />

      {/* Bottom Live Flight Telemetry */}
      <div className="relative z-20 p-3 sm:p-4 border-t border-line bg-surface/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-mute">CAMERA:</span>
            <span className="text-signal font-bold">{is3D ? '60° OBLIQUE RELIEF' : '0° ORTHOGRAPHIC'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-mute">ACTIVE ROUTE:</span>
            <span className="text-caution font-bold">
              {selectedRoute.reachable ? `${selectedRoute.hops} HOPS (ORANGE BEAM)` : 'DISCONNECTED'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-mute">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-signal animate-pulse" /> Drag right-click to tilt & rotate 3D peaks
          </span>
        </div>
      </div>
    </div>
  );
}
