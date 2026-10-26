'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Mountain,
  Radio,
  Eye,
  RotateCw,
  Compass,
  Layers,
  Sparkles,
  Maximize2,
  Activity,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';

export interface TerrainPreset {
  id: string;
  name: string;
  code: string;
  file: string;
  elevation: string;
  description: string;
  nodesFound: string[];
  occlusionRisk: 'High' | 'Severe' | 'Moderate';
}

export const TERRAIN_PRESETS: TerrainPreset[] = [
  {
    id: 'terrain_01',
    name: 'Knife-Edge Ridge',
    code: 'T-01',
    file: '/models/terrain_01_knife_edge_loc.glb',
    elevation: '3,420 m',
    description: '294m razorback granite ridge with high-altitude relay tower and valley sentry stations.',
    nodesFound: ['Lattice Tower 01', 'Dish Beacon', 'Sentry 00', 'Sentry 01', 'Perimeter Lanterns'],
    occlusionRisk: 'Severe',
  },
  {
    id: 'terrain_02',
    name: 'Cirque Amphitheater',
    code: 'T-02',
    file: '/models/terrain_02_cirque_amphitheater.glb',
    elevation: '2,980 m',
    description: '164m glacial bowl where sheer granite walls block direct RF line-of-sight to base camp.',
    nodesFound: ['Relay Col Tower', 'Cirque Beacon', 'Sentry 01', 'Sentry 02', 'Camp Tents'],
    occlusionRisk: 'High',
  },
  {
    id: 'terrain_03',
    name: 'Stepped Plateau',
    code: 'T-03',
    file: '/models/terrain_03_stepped_plateau.glb',
    elevation: '3,110 m',
    description: '165m multi-tier alpine plateau supporting forward expedition camps and communications masts.',
    nodesFound: ['Plateau Mast', 'Field Ops Dish', 'Sentry 00', 'Patrol Bravo', 'Signal Flag'],
    occlusionRisk: 'Moderate',
  },
  {
    id: 'terrain_04',
    name: 'Multi-Ridge Network',
    code: 'T-04',
    file: '/models/terrain_04_multiridge_network.glb',
    elevation: '3,650 m',
    description: '295m complex multi-crest mountain network requiring 3-hop store-and-forward routing.',
    nodesFound: ['Central Hub Mast', 'North Beacon', 'South Saddle', 'Patrol Alpha', 'Base Array'],
    occlusionRisk: 'Severe',
  },
];

interface GLBTerrainViewerProps {
  initialTerrainId?: string;
  className?: string;
  showInspectorPanel?: boolean;
  showTerrainSelector?: boolean;
  onTerrainChange?: (terrain: TerrainPreset) => void;
}

export default function GLBTerrainViewer({
  initialTerrainId = 'terrain_01',
  className = 'w-full h-full min-h-[500px]',
  showInspectorPanel = true,
  showTerrainSelector = true,
  onTerrainChange,
}: GLBTerrainViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTerrainId, setSelectedTerrainId] = useState<string>(initialTerrainId);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showLosBeams, setShowLosBeams] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'oblique' | 'horizon' | 'topdown'>('oblique');
  const [stats, setStats] = useState<{ meshCount: number; vertexCount: number; towerCount: number; sentryCount: number }>({
    meshCount: 74,
    vertexCount: 14200,
    towerCount: 2,
    sentryCount: 2,
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelRef = useRef<THREE.Group | null>(null);
  const losBeamsGroupRef = useRef<THREE.Group | null>(null);
  const beaconPulsesRef = useRef<THREE.Mesh[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const dracoLoaderRef = useRef<DRACOLoader | null>(null);
  const modelRadiusRef = useRef<number>(150);

  const curTerrain = TERRAIN_PRESETS.find((t) => t.id === selectedTerrainId) || TERRAIN_PRESETS[0];

  // Set camera view angles relative to model size
  const applyCameraView = useCallback((view: 'oblique' | 'horizon' | 'topdown') => {
    setCameraView(view);
    sound.playClick();
    if (!controlsRef.current || !cameraRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const r = modelRadiusRef.current;

    if (view === 'oblique') {
      camera.position.set(r * 0.7, r * 0.55, r * 0.95);
      controls.target.set(0, r * 0.1, 0);
    } else if (view === 'horizon') {
      camera.position.set(-r * 0.9, r * 0.2, r * 0.4);
      controls.target.set(0, r * 0.12, 0);
    } else if (view === 'topdown') {
      camera.position.set(0, r * 1.5, 0.1);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  }, []);

  // Update OrbitControls autoRotate when state changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 0.6;
    }
  }, [autoRotate]);

  // 1. Initialize Three.js Scene ONCE on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080b06);
    scene.fog = new THREE.FogExp2(0x080b06, 0.0022);

    // B. Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 3000);
    camera.position.set(110, 85, 145);
    cameraRef.current = camera;

    // C. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // D. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Do not go below ground
    controls.minDistance = 20;
    controls.maxDistance = 1200;
    controls.target.set(0, 10, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;

    // E. Lighting
    const ambientLight = new THREE.AmbientLight(0x223020, 2.0);
    scene.add(ambientLight);

    // Sunlight
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    sunLight.position.set(160, 220, 120);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 800;
    const d = 220;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Cairn Signal Lime Rim Light (Emphasizes granite crests)
    const rimLight = new THREE.DirectionalLight(0xd4f53c, 1.8);
    rimLight.position.set(-180, 80, -120);
    scene.add(rimLight);

    // Subtle Cyan Fill
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(0, -50, 140);
    scene.add(fillLight);

    // LOS Beams Group
    const losGroup = new THREE.Group();
    losBeamsGroupRef.current = losGroup;
    scene.add(losGroup);

    // Initialize DRACOLoader with local decoder in public/draco/
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    dracoLoaderRef.current = draco;

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Pulse beacon rings
      beaconPulsesRef.current.forEach((mesh, idx) => {
        const s = 1 + 0.3 * Math.sin(elapsedTime * 4 + idx * 0.8);
        mesh.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      draco.dispose();
      renderer.dispose();
      controls.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Run once on mount

  // 2. Load Model whenever selectedTerrainId changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const draco = dracoLoaderRef.current;
    if (!scene || !draco) return;

    setLoading(true);
    setLoadProgress(0);

    // Remove previous model
    if (currentModelRef.current) {
      scene.remove(currentModelRef.current);
      currentModelRef.current = null;
    }

    // Clear LOS Beams & Beacons
    if (losBeamsGroupRef.current) {
      losBeamsGroupRef.current.clear();
    }
    beaconPulsesRef.current = [];

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(
      curTerrain.file,
      (gltf) => {
        const model = gltf.scene;
        currentModelRef.current = model;

        // Compute Bounding Box to Center and Ground Model
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Center Model in Scene at Y = 0
        model.position.x = -center.x;
        model.position.y = -box.min.y;
        model.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        modelRadiusRef.current = maxDim;

        // Position camera to frame the new model comfortably
        if (camera && controls) {
          camera.position.set(maxDim * 0.7, maxDim * 0.55, maxDim * 0.95);
          camera.lookAt(0, size.y * 0.25, 0);
          controls.target.set(0, size.y * 0.25, 0);
          controls.maxDistance = maxDim * 3.5;
          controls.minDistance = 20;
          controls.update();
        }

        let meshes = 0;
        let vertices = 0;
        const towers: THREE.Vector3[] = [];
        const sentries: THREE.Vector3[] = [];

        // Traverse scene to enhance materials & locate tactical objects
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            meshes++;
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.geometry && mesh.geometry.attributes.position) {
              vertices += mesh.geometry.attributes.position.count;
            }

            // Material Enhancements for Cairn Palette
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;

              // Enhance Lanterns / Lime Emissive Objects
              if (
                mat.name?.includes('CAIRN_Lantern') ||
                mat.name?.includes('CAIRN_P_lime') ||
                child.name?.toLowerCase().includes('lantern') ||
                child.name?.toLowerCase().includes('beacon')
              ) {
                mat.emissive = new THREE.Color(0xd4f53c);
                mat.emissiveIntensity = 2.4;
                mat.roughness = 0.2;
              }

              // Enhance Radio Towers & Lattice Steel
              if (mat.name?.includes('CAIRN_Tower') || child.name?.toLowerCase().includes('tower')) {
                mat.metalness = 0.85;
                mat.roughness = 0.25;
                mat.color = new THREE.Color(0x283020);
              }

              // Mountain Terrain Surface (Rock & Grass)
              if (mat.name?.includes('Rock') || mat.name?.includes('Grass')) {
                mat.roughness = 0.95;
                mat.metalness = 0.05;
              }
            }

            // Identify tactical tower locations in world space
            const worldPos = new THREE.Vector3();
            mesh.getWorldPosition(worldPos);

            if (
              child.name?.toLowerCase().includes('tower') ||
              child.name?.toLowerCase().includes('dish') ||
              child.name?.toLowerCase().includes('beacon')
            ) {
              towers.push(worldPos);
            }

            if (child.name?.toLowerCase().includes('sentry')) {
              sentries.push(worldPos);
            }
          }
        });

        // Add 3D Glowing Tactical Rings above Towers & Sentries
        const allKeypoints = [...towers.slice(0, 3), ...sentries.slice(0, 3)];
        allKeypoints.forEach((pos, idx) => {
          const ringGeo = new THREE.RingGeometry(1.5, 2.2, 28);
          ringGeo.rotateX(-Math.PI / 2);
          const ringMat = new THREE.MeshBasicMaterial({
            color: idx === 0 ? 0xd4f53c : 0xff8a3d,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.position.copy(pos);
          ringMesh.position.y += 3.0;
          scene.add(ringMesh);
          beaconPulsesRef.current.push(ringMesh);
        });

        // Create Tactical Line-of-Sight Laser Beams between towers
        if (losBeamsGroupRef.current && towers.length >= 2) {
          const p1 = towers[0].clone();
          const p2 = towers[1].clone();
          p1.y += 6;
          p2.y += 6;

          const points = [p1, p2];
          const beamGeo = new THREE.BufferGeometry().setFromPoints(points);
          const beamMat = new THREE.LineBasicMaterial({
            color: 0xd4f53c,
            linewidth: 3,
            transparent: true,
            opacity: 0.9,
          });
          const beamLine = new THREE.Line(beamGeo, beamMat);
          losBeamsGroupRef.current.add(beamLine);
        }

        scene.add(model);
        setStats({
          meshCount: meshes || 74,
          vertexCount: vertices || 14200,
          towerCount: Math.max(towers.length, 2),
          sentryCount: Math.max(sentries.length, 2),
        });

        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error('Failed to load terrain GLB:', error);
        setLoading(false);
      }
    );
  }, [curTerrain]);

  // Handle Terrain Preset Change
  const handleSelectTerrain = (t: TerrainPreset) => {
    sound.playClick();
    setSelectedTerrainId(t.id);
    onTerrainChange?.(t);
  };

  return (
    <div className={`relative bg-[#080B06] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#080B06]/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 font-mono">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-signal animate-spin" />
            <Mountain className="w-5 h-5 text-signal absolute" />
          </div>
          <div className="text-center space-y-1">
            <span className="text-xs text-ink font-bold tracking-wider uppercase block">
              Rendering {curTerrain.name}
            </span>
            <span className="text-[10px] text-mute">
              Decompressing Blender 3D terrain assets ({loadProgress > 0 ? `${loadProgress}%` : 'DRACO'})...
            </span>
          </div>
        </div>
      )}

      {/* Top Left: Sector Badge & Tactical Info (when Inspector is active) */}
      {showInspectorPanel && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none space-y-2 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-surface/90 border border-white/[0.08] backdrop-blur-md text-xs font-mono flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="text-ink font-bold">{curTerrain.code}</span>
              <span className="text-mute">·</span>
              <span className="text-signal">{curTerrain.name}</span>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-surface/80 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-mute flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-signal" />
              <span>{curTerrain.elevation} ASL</span>
            </div>
          </div>

          <div className="bg-surface/85 border border-white/[0.06] p-3 rounded-2xl backdrop-blur-md font-mono text-[11px] text-mute space-y-2 shadow-xl">
            <p className="text-[11px] text-mute/90 font-sans leading-relaxed">
              {curTerrain.description}
            </p>
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
              <span className="text-signal font-semibold">{stats.towerCount} Relays</span>
              <span className="text-white/20">·</span>
              <span className="text-ink font-semibold">{stats.sentryCount} Sentries</span>
              <span className="text-white/20">·</span>
              <span className="text-signal/90 font-semibold">{stats.meshCount} Nodes</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Right: Camera Presets & Auto Rotate Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Camera Angle Presets */}
        <div className="flex items-center p-1 rounded-full bg-surface/85 border border-white/[0.08] backdrop-blur-md text-xs font-mono shadow-lg">
          <button
            onClick={() => applyCameraView('oblique')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'oblique' ? 'bg-signal text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
            }`}
          >
            Oblique 45°
          </button>
          <button
            onClick={() => applyCameraView('horizon')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'horizon' ? 'bg-signal text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
            }`}
          >
            Horizon
          </button>
          <button
            onClick={() => applyCameraView('topdown')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'topdown' ? 'bg-signal text-deep-ground font-bold shadow-sm' : 'text-mute hover:text-ink'
            }`}
          >
            Top-Down
          </button>
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            setAutoRotate(!autoRotate);
          }}
          className={`p-2 rounded-full border backdrop-blur-md transition-all shadow-lg ${
            autoRotate
              ? 'bg-signal/20 border-signal/40 text-signal'
              : 'bg-surface/80 border-white/[0.08] text-mute hover:text-ink'
          }`}
          title={autoRotate ? 'Pause 3D rotation' : 'Start 3D rotation'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Bottom Floating Bar: 4 Blender Terrain Selector (Only shown if showTerrainSelector is true) */}
      {showTerrainSelector && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto w-[92%] sm:w-auto">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-surface/85 border border-white/[0.1] backdrop-blur-xl shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mute px-3 hidden sm:inline">
              Blender Terrains:
            </span>

            {TERRAIN_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedTerrainId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectTerrain(preset)}
                  className={`px-3.5 py-1.5 rounded-xl sm:rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-signal text-deep-ground font-bold shadow-glow-signal'
                      : 'text-mute hover:text-ink hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-deep-ground' : 'text-signal'}`}>
                    {preset.code}
                  </span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
