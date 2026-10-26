'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import SVGRidgeHeroFallback from './SVGRidgeHeroFallback';
import MapboxTerrainView from './MapboxTerrainView';
import { getTerrainElevation } from '@/lib/terrainModel';
import {
  Radio,
  ChevronRight,
  Activity,
  Eye,
  Layers,
  Globe,
  Mountain,
  Play,
  Pause,
  Compass,
  Crosshair,
  Sparkles,
  ArrowRight,
  GitFork,
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

interface Props {
  onExploreConsole?: () => void;
  hideNarrativeOverlay?: boolean;
}

export default function WebGLTerrainHero({ onExploreConsole, hideNarrativeOverlay = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [activeScene, setActiveScene] = useState<number>(0);
  const [heroMode, setHeroMode] = useState<'3d-mesh' | 'mapbox-3d' | 'svg-plate01'>('3d-mesh');
  const [fps, setFps] = useState<number>(60);
  const [isRotating, setIsRotating] = useState(true);
  const [perspective, setPerspective] = useState<'oblique' | 'topdown' | 'horizon'>('oblique');

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
      cameraTarget: { x: -8, y: 8, z: 17, lookY: 1.5 },
    },
    {
      id: 2,
      title: '03 · SEVERANCE',
      badge: 'LOS BREACH DETECTED',
      headline: 'THE MOUNTAIN INTERVENES.',
      subtext: 'Direct transmission fails. Packets are cached safely in local non-volatile flash buffers (Queued).',
      cameraTarget: { x: -5, y: 6.5, z: 13, lookY: 2 },
    },
    {
      id: 3,
      title: '04 · HEALING',
      badge: 'RELAY HOP ESTABLISHED',
      headline: 'THE NETWORK IS VISIBLE.',
      subtext: 'An alpine saddle relay crests the col. Stored packets arc across the peaks via 2-hop store-and-forward mesh.',
      cameraTarget: { x: 4, y: 11, z: 18, lookY: 0 },
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

  // Perspective presets for camera
  const getCameraTargetForPerspective = (sceneIdx: number, p: 'oblique' | 'topdown' | 'horizon') => {
    if (p === 'topdown') {
      return { x: 0, y: 28, z: 0.2, lookY: 0 };
    }
    if (p === 'horizon') {
      return { x: -9, y: 4.5, z: 12, lookY: 3 };
    }
    return scenes[sceneIdx].cameraTarget;
  };

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

      // --- SCULPTED 3D SOLID MOUNTAIN RELIEF MESH ---
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

        const rawElev = getTerrainElevation(x * 0.38, -z * 0.38);
        const y = (rawElev - 1920) * 0.0042;
        posAttr.setY(i, y);

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

      // Glowing Dot-Wave Points
      const pointsMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      });
      const dotPoints = new THREE.Points(terrainGeo, pointsMat);
      dotPoints.position.y += 0.03;
      scene.add(dotPoints);

      // --- TACTICAL PACKET DELIVERY BEAM ---
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
        const isRelay = idx === 1 || idx === 2;
        const beaconMat = new THREE.MeshBasicMaterial({
          color: isRelay ? 0xd4f53c : 0xff8a3d,
        });
        const beaconSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), beaconMat);
        beaconSphere.position.copy(pos);
        scene.add(beaconSphere);

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

      // Drag to orbit interaction handlers
      let isDragging = false;
      let prevMouseX = 0;
      let userRotation = 0;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        userRotation += deltaX * 0.005;
        prevMouseX = e.clientX;
      };

      const onPointerUp = () => {
        isDragging = false;
      };

      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      // Animation Loop
      let lastTime = performance.now();
      let frameCount = 0;
      let packetProgress = 0;
      let rotationAngle = 0;
      const targetLookAt = new THREE.Vector3(0, 1, 0);

      const animate = (currentTime: number) => {
        animationFrameId = requestAnimationFrame(animate);

        frameCount++;
        if (currentTime - lastTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastTime = currentTime;
        }

        // Automatic gentle rotation
        if (isRotating && !isDragging) {
          rotationAngle += 0.0015;
        }

        const totalRotation = rotationAngle + userRotation;
        mountainMesh.rotation.y = totalRotation;
        wireframeMesh.rotation.y = totalRotation;
        dotPoints.rotation.y = totalRotation;

        // Smooth camera lerp to scene target position
        const target = getCameraTargetForPerspective(activeScene, perspective);
        const desiredPos = new THREE.Vector3(target.x, target.y, target.z);
        camera.position.lerp(desiredPos, 0.04);

        targetLookAt.lerp(new THREE.Vector3(0, target.lookY, 0), 0.04);
        camera.lookAt(targetLookAt);

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
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL fallback triggered:', err);
      setWebglSupported(false);
    }
  }, [heroMode, isRotating, activeScene, perspective]);

  const curScene = scenes[activeScene];

  const handleSceneClick = (index: number) => {
    sound.playClick();
    setActiveScene(index);
  };

  return (
    <div className="relative w-full h-[90vh] min-h-[660px] max-h-[920px] overflow-hidden bg-deep-ground flex flex-col justify-between border-b border-white/[0.08] select-none">
      {/* Top Visual Engine & Perspective Controls Bar */}
      <div className="relative z-20 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-surface/80 backdrop-blur-md p-1 rounded-full border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => {
              sound.playClick();
              setHeroMode('3d-mesh');
            }}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              heroMode === '3d-mesh'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>3D Massif</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setHeroMode('mapbox-3d');
            }}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              heroMode === 'mapbox-3d'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Mapbox 3D</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setHeroMode('svg-plate01');
            }}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              heroMode === 'svg-plate01'
                ? 'bg-signal text-deep-ground font-bold shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Contours</span>
          </button>
        </div>

        {heroMode === '3d-mesh' && (
          <div className="flex items-center gap-2 font-mono text-xs text-mute bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08] pointer-events-auto">
            <span className="text-[10px] text-mute uppercase mr-1 hidden sm:inline">Camera:</span>
            <button
              onClick={() => {
                sound.playClick();
                setPerspective('oblique');
              }}
              className={`px-2 py-0.5 rounded-full ${perspective === 'oblique' ? 'bg-signal text-deep-ground font-bold' : 'text-mute hover:text-ink'}`}
            >
              Oblique
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setPerspective('topdown');
              }}
              className={`px-2 py-0.5 rounded-full ${perspective === 'topdown' ? 'bg-signal text-deep-ground font-bold' : 'text-mute hover:text-ink'}`}
            >
              Top-Down
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setPerspective('horizon');
              }}
              className={`px-2 py-0.5 rounded-full ${perspective === 'horizon' ? 'bg-signal text-deep-ground font-bold' : 'text-mute hover:text-ink'}`}
            >
              Col Horizon
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setIsRotating(!isRotating);
              }}
              className="text-signal flex items-center gap-1 hover:text-ink transition-colors px-1 border-l border-white/10 ml-1"
              title="Toggle automatic rotation"
            >
              {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* Main Visual 3D Canvas */}
      <div className="absolute inset-0 z-0">
        {heroMode === '3d-mesh' && (
          webglSupported ? (
            <div
              ref={containerRef}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
              title="Click and drag to rotate terrain in 3D"
            />
          ) : (
            <SVGRidgeHeroFallback />
          )
        )}
        {heroMode === 'mapbox-3d' && <MapboxTerrainView />}
        {heroMode === 'svg-plate01' && <SVGRidgeHeroFallback />}
      </div>

      {/* Subtle Bottom Scrim for effortless readability */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-deep-ground via-deep-ground/60 to-transparent pointer-events-none z-0" />

      {/* FLOATING TACTICAL PINS ON 3D TERRAIN */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        {/* Node A1 (Online - Peak) */}
        <div className="absolute right-[24%] top-[24%] flex items-center gap-3 animate-fadeIn">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-signal/20 animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-signal shadow-glow-signal flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-deep-ground" />
            </div>
          </div>
          <div className="p-2 rounded-xl bg-surface/85 border border-signal/40 backdrop-blur-md font-mono text-[11px] shadow-xl">
            <div className="flex items-center gap-1.5 text-signal font-bold">
              <span>NODE A1</span>
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            </div>
            <span className="text-[10px] text-mute uppercase block">ONLINE · ELEV 3,420 m</span>
          </div>
        </div>

        {/* Node B2 (Queued - Saddle) */}
        <div className="absolute right-[52%] top-[40%] flex items-center gap-2.5 animate-fadeIn">
          <div className="w-3.5 h-3.5 rounded-full bg-caution shadow-glow-caution flex items-center justify-center">
            <div className="w-1 rounded-full bg-deep-ground" />
          </div>
          <div className="p-2 rounded-xl bg-surface/85 border border-caution/40 backdrop-blur-md font-mono text-[11px] shadow-xl">
            <div className="flex items-center gap-1.5 text-caution font-bold">
              <span>NODE B2</span>
              <span className="text-[9px] uppercase px-1 rounded bg-caution/20">QUEUED</span>
            </div>
            <span className="text-[10px] text-mute uppercase block">ELEV 2,980 m</span>
          </div>
        </div>

        {/* Node C3 (Blocked - Cirque Shadow) */}
        <div className="absolute right-[14%] top-[45%] flex items-center gap-2.5 animate-fadeIn">
          <div className="w-3.5 h-3.5 rounded-full bg-severed flex items-center justify-center">
            <div className="w-1 rounded-full bg-deep-ground" />
          </div>
          <div className="p-2 rounded-xl bg-surface/85 border border-severed/40 backdrop-blur-md font-mono text-[11px] shadow-xl">
            <div className="flex items-center gap-1.5 text-severed font-bold">
              <span>NODE C3</span>
              <span className="text-[9px] uppercase px-1 rounded bg-severed/20">BLOCKED</span>
            </div>
            <span className="text-[10px] text-mute uppercase block">ELEV 3,112 m · RF SHADOW</span>
          </div>
        </div>

        {/* Top Right Tactical Altitude & Compass HUD */}
        <div className="absolute right-8 top-16 text-right font-mono text-xs space-y-1">
          <div className="w-12 h-12 rounded-full border border-white/20 ml-auto flex items-center justify-center relative mb-2">
            <span className="text-[9px] text-signal font-bold absolute top-0.5">N</span>
            <div className="w-2 h-2 rounded-full bg-signal/60" />
            <div className="w-px h-6 bg-signal/40 rotate-45 absolute" />
          </div>

          <div className="text-xl font-black text-ink">3,420 m</div>
          <div className="text-[10px] uppercase text-mute tracking-widest">ALTITUDE</div>
          <div className="text-[11px] text-signal font-semibold pt-1">32.4871° N, 76.3095° E</div>
        </div>
      </div>

      {/* Hero Narrative Overlay & Scene Controls */}
      {!hideNarrativeOverlay && (
        <div className="relative z-10 px-6 sm:px-12 pb-12 sm:pb-16 max-w-4xl mt-auto pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/60 border border-white/[0.08] text-signal font-mono text-[11px] tracking-wider uppercase mb-4 pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span>{curScene.badge}</span>
          </div>

          <h1 className="font-sans font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-ink leading-[1.08]">
            No signal.
            <br />
            <span className="text-signal font-light">Still connected.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-mute font-sans font-normal max-w-xl leading-relaxed">
            {curScene.subtext}
          </p>

          {/* Action Buttons & Scene Stepper */}
          <div className="mt-8 flex flex-wrap items-center gap-3 pointer-events-auto">
            <a
              href="/console"
              onClick={() => sound.playClick()}
              className="px-6 py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider bg-signal text-deep-ground hover:bg-signal/90 transition-all flex items-center gap-2 shadow-glow-signal group"
            >
              <span>Explore The Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              onClick={() => {
                sound.playClick();
                const el = document.getElementById('mesh-lab');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-full font-sans text-xs font-medium uppercase tracking-wider bg-surface/60 border border-white/[0.1] text-ink hover:text-signal hover:border-signal/40 transition-all flex items-center gap-2.5 backdrop-blur-md"
            >
              <div className="w-5 h-5 rounded-full bg-signal/20 text-signal flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current" />
              </div>
              <span>Watch Simulation</span>
            </button>

            {/* Scene Stepper Buttons */}
            <div className="flex items-center gap-1.5 bg-surface/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/[0.08] sm:ml-auto">
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => handleSceneClick(i)}
                  className={`px-2.5 py-0.5 rounded-full font-mono text-xs transition-all ${
                    activeScene === i
                      ? 'bg-signal text-deep-ground font-bold shadow-sm'
                      : 'text-mute hover:text-ink'
                  }`}
                  title={s.title}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Core Value Pillars */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] pointer-events-auto">
            <div className="flex items-start gap-2.5">
              <Radio className="w-4 h-4 text-signal shrink-0 mt-0.5" />
              <div>
                <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-ink">
                  Offline-First
                </span>
                <span className="text-xs text-mute font-sans font-light leading-snug">
                  Messages stay safe in device memory until a relay is in reach.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mountain className="w-4 h-4 text-signal shrink-0 mt-0.5" />
              <div>
                <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-ink">
                  Terrain Awareness
                </span>
                <span className="text-xs text-mute font-sans font-light leading-snug">
                  Simulates 3,000m ridge shadows to reveal occluded valleys.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <GitFork className="w-4 h-4 text-signal shrink-0 mt-0.5" />
              <div>
                <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-ink">
                  Intelligent Routing
                </span>
                <span className="text-xs text-mute font-sans font-light leading-snug">
                  Autonomous multi-hop mesh hops over granite peaks to base camp.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
