'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import SVGRidgeHeroFallback from './SVGRidgeHeroFallback';
import MapboxTerrainView from './MapboxTerrainView';
import { getTerrainElevation } from '@/lib/terrainModel';
import { Radio, ChevronRight, Activity, Eye, Layers, Globe, Mountain, Play, Pause } from 'lucide-react';

interface Props {
  onExploreConsole?: () => void;
}

export default function WebGLTerrainHero({ onExploreConsole }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [activeScene, setActiveScene] = useState<number>(0);
  const [heroMode, setHeroMode] = useState<'3d-mesh' | 'mapbox-3d' | 'svg-plate01'>('3d-mesh');
  const [fps, setFps] = useState<number>(60);
  const [isRotating, setIsRotating] = useState(true);

  const scenes = [
    {
      id: 0,
      title: '01 · ALTITUDE',
      badge: 'SYNTHETIC ALPINE SECTOR',
      headline: 'NO SIGNAL. STILL CONNECTED.',
      subtext: 'High-altitude 3D mountain relief. Physical granite ridges form impenetrable barriers to conventional radio signals.',
      cameraTarget: { x: 0, y: 15, z: 23, lookY: 1 },
    },
    {
      id: 1,
      title: '02 · DESCENT',
      badge: 'VALLEY ISOLATION',
      headline: 'SHADOWED IN THE CIRQUE.',
      subtext: 'Field teams drop behind a 2,800m granite wall. Direct line-of-sight to base camp is severed completely.',
      cameraTarget: { x: -7, y: 9, z: 17, lookY: 2 },
    },
    {
      id: 2,
      title: '03 · SEVERANCE',
      badge: 'LOS BREACH DETECTED',
      headline: 'THE MOUNTAIN INTERVENES.',
      subtext: 'Direct transmission fails. Packets are cached safely in local non-volatile flash buffers (Queued).',
      cameraTarget: { x: -4, y: 7, z: 14, lookY: 2 },
    },
    {
      id: 3,
      title: '04 · HEALING',
      badge: 'RELAY HOP ESTABLISHED',
      headline: 'THE NETWORK IS VISIBLE.',
      subtext: 'An alpine saddle relay crests the col. Stored packets arc across the peaks via 2-hop store-and-forward mesh.',
      cameraTarget: { x: 3, y: 11, z: 18, lookY: 0 },
    },
    {
      id: 4,
      title: '05 · HAND-OFF',
      badge: 'TACTICAL MESH SYNC',
      headline: 'GROUND TRUTH SITUATION.',
      subtext: 'Spatial mesh coordinates transition directly into the operational Field Console interface.',
      cameraTarget: { x: 0, y: 17, z: 22, lookY: -1 },
    },
  ];

  useEffect(() => {
    if (heroMode !== '3d-mesh') return;
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0e120a);
      scene.fog = new THREE.FogExp2(0x0e120a, 0.032);

      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        200
      );
      camera.position.set(0, 15, 23);
      camera.lookAt(0, 1, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      // --- LIGHTING (Tactical Alpine Sun & Haze) ---
      const ambientLight = new THREE.AmbientLight(0x252a1e, 1.2);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xd4f53c, 1.4);
      directionalLight.position.set(18, 30, 15);
      scene.add(directionalLight);

      const rimLight = new THREE.DirectionalLight(0xff8a3d, 0.6);
      rimLight.position.set(-20, 15, -15);
      scene.add(rimLight);

      // --- SCULPTED 3D SOLID MOUNTAIN RELIEF MESH (NOT JUST DOTS!) ---
      const meshSize = 36;
      const meshSegments = 90;
      const terrainGeo = new THREE.PlaneGeometry(meshSize, meshSize, meshSegments, meshSegments);
      terrainGeo.rotateX(-Math.PI / 2);

      const posAttr = terrainGeo.attributes.position;
      const count = posAttr.count;
      const colors = new Float32Array(count * 3);

      const colorDeepValley = new THREE.Color(0x10140c);
      const colorMidSlope = new THREE.Color(0x28321a);
      const colorHighRidge = new THREE.Color(0x4d5d28);
      const colorPeak = new THREE.Color(0xd4f53c); // Signal Lime

      for (let i = 0; i < count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);

        // Height displacement based on procedural alpine DEM
        const rawElev = getTerrainElevation(x * 0.38, -z * 0.38);
        const y = (rawElev - 1920) * 0.0042;
        posAttr.setY(i, y);

        // Calculate elevation normalized color gradient
        const t = Math.min(Math.max((rawElev - 1950) / 1150, 0), 1);
        const vertexColor = new THREE.Color();
        if (t < 0.35) {
          vertexColor.lerpColors(colorDeepValley, colorMidSlope, t / 0.35);
        } else if (t < 0.8) {
          vertexColor.lerpColors(colorMidSlope, colorHighRidge, (t - 0.35) / 0.45);
        } else {
          vertexColor.lerpColors(colorHighRidge, colorPeak, (t - 0.8) / 0.2);
        }

        colors[i * 3] = vertexColor.r;
        colors[i * 3 + 1] = vertexColor.g;
        colors[i * 3 + 2] = vertexColor.b;
      }

      terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      terrainGeo.computeVertexNormals();

      // Solid Shaded Mountain Surface
      const mountainMaterial = new THREE.MeshLambertMaterial({
        vertexColors: true,
        roughness: 0.85,
        flatShading: true,
      } as any);

      const mountainMesh = new THREE.Mesh(terrainGeo, mountainMaterial);
      scene.add(mountainMesh);

      // Illuminated Topographic Wireframe Overlay
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x3a4030,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const wireframeMesh = new THREE.Mesh(terrainGeo, wireframeMat);
      scene.add(wireframeMesh);

      // --- GLOWING DOT-WAVE OVERLAY ON TOP OF PEAKS (PLATE 02) ---
      const pointsMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      });
      const dotPoints = new THREE.Points(terrainGeo, pointsMat);
      dotPoints.position.y += 0.03; // slight offset above mountain mesh
      scene.add(dotPoints);

      // --- TACTICAL PACKET DELIVERY BEAM (TACTICAL ORANGE ARC) ---
      const routePoints = [
        new THREE.Vector3(-7.5, 1.4, 5.5),  // Node Alpha in Valley
        new THREE.Vector3(-2.2, 4.3, 1.8),  // Saddle Relay 2 on Col
        new THREE.Vector3(2.8, 4.8, -1.2),  // Ridge Relay 1 on Peak
        new THREE.Vector3(7.8, 1.6, -5.0),  // Base Command in Basecamp
      ];

      const curve = new THREE.CatmullRomCurve3(routePoints);
      const tubeGeom = new THREE.TubeGeometry(curve, 72, 0.08, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xff8a3d,
        transparent: true,
        opacity: 0.95,
      });
      const packetTube = new THREE.Mesh(tubeGeom, tubeMat);
      scene.add(packetTube);

      // Vertical Locator Stems and Summit Beacons
      routePoints.forEach((pos, idx) => {
        // Beacon Sphere
        const isRelay = idx === 1 || idx === 2;
        const beaconMat = new THREE.MeshBasicMaterial({
          color: isRelay ? 0xd4f53c : 0xff8a3d,
        });
        const beaconSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), beaconMat);
        beaconSphere.position.copy(pos);
        scene.add(beaconSphere);

        // Ground anchor line
        const stemMat = new THREE.LineBasicMaterial({ color: 0x55642d });
        const stemGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pos.x, 0, pos.z),
          pos,
        ]);
        const stem = new THREE.Line(stemGeom, stemMat);
        scene.add(stem);
      });

      // Animated traveling packet pulse
      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      scene.add(pulseMesh);

      // Animation Loop
      let lastTime = performance.now();
      let frameCount = 0;
      let packetProgress = 0;
      let rotationAngle = 0;

      const animate = (currentTime: number) => {
        animationFrameId = requestAnimationFrame(animate);

        frameCount++;
        if (currentTime - lastTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastTime = currentTime;
        }

        // Slow smooth cinematic rotation
        if (isRotating) {
          rotationAngle += 0.0015;
          mountainMesh.rotation.y = rotationAngle;
          wireframeMesh.rotation.y = rotationAngle;
          dotPoints.rotation.y = rotationAngle;
        }

        // Animate packet along tactical orange curve
        packetProgress = (packetProgress + 0.005) % 1;
        const currentPos = curve.getPoint(packetProgress);
        pulseMesh.position.copy(currentPos);

        renderer.render(scene, camera);
      };

      animate(performance.now());

      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL fallback triggered:', err);
      setWebglSupported(false);
    }
  }, [heroMode, isRotating]);

  const curScene = scenes[activeScene];

  return (
    <div className="relative w-full h-[94vh] min-h-[720px] overflow-hidden bg-deep-ground flex flex-col justify-between border-b border-line select-none">
      {/* Visual Engine Mode Switcher Bar */}
      <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-deep-ground/90 backdrop-blur-md p-1 rounded-lg border border-line text-xs font-mono">
          <button
            onClick={() => setHeroMode('3d-mesh')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              heroMode === '3d-mesh'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Sculpted 3D Massif</span>
          </button>

          <button
            onClick={() => setHeroMode('mapbox-3d')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              heroMode === 'mapbox-3d'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Mapbox 3D Style</span>
          </button>

          <button
            onClick={() => setHeroMode('svg-plate01')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
              heroMode === 'svg-plate01'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Plate 01 Ridges</span>
          </button>
        </div>

        {heroMode === '3d-mesh' && (
          <div className="hidden md:flex items-center gap-3 font-mono text-xs text-mute bg-deep-ground/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-line pointer-events-auto">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="text-signal flex items-center gap-1 hover:text-ink transition-colors"
              title="Toggle continuous terrain rotation"
            >
              {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isRotating ? 'Rotating' : 'Paused'}</span>
            </button>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1 text-ink">
              <Activity className="w-3.5 h-3.5 text-signal" />
              {fps} FPS
            </span>
          </div>
        )}
      </div>

      {/* Main Visual Canvas Container */}
      <div className="absolute inset-0 z-0">
        {heroMode === '3d-mesh' && (
          webglSupported ? (
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          ) : (
            <SVGRidgeHeroFallback />
          )
        )}
        {heroMode === 'mapbox-3d' && <MapboxTerrainView />}
        {heroMode === 'svg-plate01' && <SVGRidgeHeroFallback />}
      </div>

      {/* Hero Narrative Overlay & Scene Stepper */}
      <div className="relative z-10 px-6 sm:px-12 pb-8 sm:pb-12 max-w-4xl mt-auto pointer-events-none">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface/90 border border-signal/40 text-signal font-mono text-xs tracking-wider uppercase mb-3 pointer-events-auto">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{curScene.badge}</span>
        </div>

        <h1 className="font-display font-extrabold uppercase text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-tight-display text-ink drop-shadow-2xl">
          {curScene.headline.split('. ')[0]}.
          <br />
          <span className="text-signal">{curScene.headline.split('. ')[1] || 'STILL CONNECTED.'}</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-mute font-mono max-w-xl leading-relaxed bg-deep-ground/85 backdrop-blur-md p-3.5 rounded border border-line/70 pointer-events-auto">
          {curScene.subtext}
        </p>

        {/* Scene Navigation Stepper */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pointer-events-auto">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveScene(i)}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-all flex items-center gap-1.5 border ${
                activeScene === i
                  ? 'bg-signal text-deep-ground font-bold border-signal shadow-glow-signal'
                  : 'bg-surface/85 text-mute border-line hover:text-ink hover:border-signal/50'
              }`}
            >
              <span>{s.title}</span>
            </button>
          ))}

          {onExploreConsole ? (
            <button
              onClick={onExploreConsole}
              className="ml-auto px-4 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider bg-surface border border-signal text-signal hover:bg-signal hover:text-deep-ground transition-all flex items-center gap-1.5"
            >
              <span>Launch Field Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <a
              href="/console"
              className="ml-auto px-4 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider bg-surface border border-signal text-signal hover:bg-signal hover:text-deep-ground transition-all flex items-center gap-1.5"
            >
              <span>Launch Field Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Exploded Layers Quick Legend */}
      <div className="absolute right-6 bottom-24 hidden xl:block z-10 pointer-events-auto">
        <div className="cairn-glass p-3.5 rounded-lg border border-line text-xs font-mono w-64 space-y-2">
          <div className="flex items-center gap-2 text-ink font-bold border-b border-line pb-1.5">
            <Eye className="w-3.5 h-3.5 text-signal" />
            <span>ACTIVE 3D PROJECTION</span>
          </div>
          <div className="flex items-center justify-between text-caution">
            <span>L3 · MESSAGES</span>
            <span className="text-[10px] uppercase">Observed (Sim)</span>
          </div>
          <div className="flex items-center justify-between text-signal">
            <span>L2 · LINKS</span>
            <span className="text-[10px] uppercase">Estimated LOS</span>
          </div>
          <div className="flex items-center justify-between text-mute">
            <span>L1 · TERRAIN</span>
            <span className="text-[10px] uppercase">3D Solid Massif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
