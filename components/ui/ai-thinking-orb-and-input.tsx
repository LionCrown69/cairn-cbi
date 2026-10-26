'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';

export interface MorphOrbProps {
  placeholder?: string;
  labels?: string[];
  doneLabel?: string;
  answerTitle?: string;
  defaultAnswer?: string;
  onSubmit?: (query: string) => Promise<string>;
  minThinkMs?: number;
  speed?: number;
  onReset?: () => void;
  className?: string;
}

export interface AIThinkingOrbRef {
  triggerQuery: (query: string) => void;
  reset: () => void;
}

export type MorphPhase =
  | 'idle'
  | 'launch'
  | 'assemble'
  | 'think'
  | 'resolve'
  | 'condense'
  | 'unfold'
  | 'answered'
  | 'reset';

const DEFAULT_LABELS = [
  'Scanning Sector Telemetry',
  'Evaluating Fresnel Occlusion',
  'Querying Flash Buffers',
  'Synthesizing Tactical Brief',
];

const DEFAULT_DONE = 'Telemetric Verification Complete';
const DEFAULT_TITLE = 'TACTICAL INTELLIGENCE BRIEF';
const DEFAULT_BODY = 'All 6 alpine stations nominal. Patrol-Alpha occluded by 2,840m North Ridge fold; multi-hop store-and-forward routing active via Relay-Saddle-West.';

// Particle Sphere Constants
const SPHERE_RINGS = 16;
const TWO_PI = Math.PI * 2;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pre-calculate fibonacci spherical point cloud
const SPHERE_POINTS = (() => {
  const rand = mulberry32(7);
  const pts: Array<{ x: number; y: number; z: number; u: number; seed: number }> = [];
  for (let r = 0; r < SPHERE_RINGS; r++) {
    const y = 1 - ((r + 0.5) / SPHERE_RINGS) * 2;
    const ringRadius = Math.sqrt(1 - y * y);
    const count = Math.max(4, Math.round(30 * ringRadius));
    for (let c = 0; c < count; c++) {
      const angle = (c / count) * TWO_PI + r * 0.35;
      pts.push({
        x: Math.cos(angle) * ringRadius,
        y,
        z: Math.sin(angle) * ringRadius,
        u: (1 - y) / 2,
        seed: rand() * 6.283,
      });
    }
  }
  return pts;
})();

const POINT_COUNT = SPHERE_POINTS.length;
const POINT_X = Float32Array.from(SPHERE_POINTS, p => p.x);
const POINT_Y = Float32Array.from(SPHERE_POINTS, p => p.y);
const POINT_Z = Float32Array.from(SPHERE_POINTS, p => p.z);
const POINT_U = Float32Array.from(SPHERE_POINTS, p => p.u);
const POINT_SEED = Float32Array.from(SPHERE_POINTS, p => p.seed);

// Tactical Color Palette (Vibrant Alpine Signal Green & Amber & White)
const COLOR_STEPS_Y = 24;
const COLOR_STEPS_D = 48;
const COLOR_PALETTE = (() => {
  const pal: string[] = [];
  for (let y = 0; y <= COLOR_STEPS_Y; y++) {
    const t = y / COLOR_STEPS_Y;
    // Lerp from alpine gold/white (245, 250, 200) to electric signal green (212, 245, 60)
    const r = Math.round(230 + (212 - 230) * t);
    const g = Math.round(245 + (245 - 245) * t);
    const b = Math.round(180 + (60 - 180) * t);
    for (let d = 0; d <= COLOR_STEPS_D; d++) {
      pal.push(`rgba(${r},${g},${b},${(d / COLOR_STEPS_D).toFixed(3)})`);
    }
  }
  return pal;
})();

// Cubic Bezier Easer
function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return t;
      const d = sampleDerivX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let t0 = 0;
    let t1 = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const currentX = sampleX(t);
      if (Math.abs(currentX - x) < 1e-6) break;
      if (x > currentX) t0 = t;
      else t1 = t;
      t = (t1 - t0) / 2 + t0;
    }
    return t;
  };

  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : sampleY(solveT(x)));
}

const EASE = {
  out: cubicBezier(0.22, 1, 0.36, 1),
  io: cubicBezier(0.65, 0, 0.35, 1),
  in: cubicBezier(0.4, 0, 1, 1),
  fly: cubicBezier(0.5, 0, 0.1, 1),
  grow: cubicBezier(0.3, 0, 0.2, 1),
  vortex: cubicBezier(0.6, 0, 0.2, 1),
  spring: cubicBezier(0.34, 1.4, 0.64, 1),
  card: cubicBezier(0.65, 0, 0.2, 1),
  lin: (t: number) => t,
};

interface TrackDef {
  ch: string;
  from: number;
  to: number;
  t0: number;
  t1: number;
  ease?: (t: number) => number;
}

const track = (ch: string, from: number, to: number, t0: number, t1: number, ease = EASE.io): TrackDef => ({
  ch,
  from,
  to,
  t0,
  t1,
  ease,
});

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fmt = (v: number) => String(Math.round(v * 10000) / 10000);
const bezQuad = (t: number, p0: number, p1: number, p2: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

export interface AIThinkingOrbHandle {
  triggerQuery: (q: string) => void;
  reset: () => void;
}

const AIThinkingOrbAndInput = React.forwardRef<AIThinkingOrbHandle, MorphOrbProps>(
  function AIThinkingOrbAndInput(
    {
      placeholder = 'Ask Tactical AI Agent (e.g. "SITREP", "Alpha Occlusion", "Queue Status")...',
      labels = DEFAULT_LABELS,
      doneLabel = DEFAULT_DONE,
      answerTitle = DEFAULT_TITLE,
      defaultAnswer = DEFAULT_BODY,
      onSubmit,
      minThinkMs = 2800,
      speed = 1,
      onReset,
      className = '',
    },
    ref
  ) {
    const [phase, setPhase] = useState<MorphPhase>('idle');
    const [inputValue, setInputValue] = useState('');
    const [activeLabel, setActiveLabel] = useState<{ cur: string; prev: string | null; n: number }>({
      cur: labels[0] || 'Analyzing Sector Telemetry',
      prev: null,
      n: 0,
    });
    const [answerText, setAnswerText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const phaseRef = useRef<MorphPhase>('idle');
    phaseRef.current = phase;

    const updatePhase = useCallback((newPhase: MorphPhase) => {
      phaseRef.current = newPhase;
      setPhase(newPhase);
    }, []);

    const propsRef = useRef({
      labels,
      doneLabel,
      defaultAnswer,
      minThinkMs,
      speed,
      onSubmit,
      onReset,
    });
    propsRef.current = {
      labels,
      doneLabel,
      defaultAnswer,
      minThinkMs,
      speed,
      onSubmit,
      onReset,
    };

  const rootRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const ghostsRef = useRef<Array<HTMLSpanElement | null>>([]);

  const isReducedMotion = useRef(false);
  const runtimeRef = useRef<{
    start: (q: string) => boolean;
    escape: () => void;
    reset: () => void;
    hard: () => void;
  } | null>(null);

  React.useImperativeHandle(ref, () => ({
    triggerQuery: (q: string) => {
      setInputValue(q);
      setIsTyping(true);
      runtimeRef.current?.start(q);
    },
    reset: () => {
      runtimeRef.current?.reset();
    },
  }));

  const words = answerText.split(/\s+/).filter(Boolean);

  // Orb Engine Setup
  const setupOrb = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const orbProps = {
      k: 0,
      alpha: 0,
      spin: 0,
      rot: 0,
      sweep: 0,
      pop: 1,
      vortex: 0,
      gain: 1,
      floor: 0,
      rad: 0,
      prog: 0,
    };

    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    canvas.width = Math.round(220 * dpr);
    canvas.height = Math.round(220 * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const center = 110;
    const cosTilt = Math.cos(0.35);
    const sinTilt = Math.sin(0.35);

    const screenX = new Float32Array(POINT_COUNT);
    const screenY = new Float32Array(POINT_COUNT);
    const radius = new Float32Array(POINT_COUNT);
    const depthVal = new Float32Array(POINT_COUNT);
    const colorIndices = new Int16Array(POINT_COUNT);
    const waveT = [1, 0, 0, 0];
    const energy = new Float32Array(POINT_COUNT);

    let animTime = 0;
    let lastStamp = 0;
    let reqId = 0;
    let isDestroyed = false;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, 220, 220);
      animTime += dt;
      orbProps.rot += orbProps.spin * dt;
      const totalRot = orbProps.rot + orbProps.vortex;
      const cosRot = Math.cos(totalRot);
      const sinRot = Math.sin(totalRot);

      const blendSpeed = dt / 0.35;
      for (let j = 0; j < 4; j++) {
        const target = (j === orbProps.prog ? 1 : 0) - waveT[j];
        waveT[j] += Math.abs(target) <= blendSpeed ? target : target > 0 ? blendSpeed : -blendSpeed;
      }

      const decay = Math.exp(-dt / 0.5);
      const waveIdxA = (animTime * 300) % POINT_COUNT;
      const waveIdxB = (animTime * 480) % POINT_COUNT;
      const vortexBonus = orbProps.vortex * 1.5;

      for (let i = 0; i < POINT_COUNT; i++) {
        const px = POINT_X[i];
        const py = POINT_Y[i];
        const pz = POINT_Z[i];
        const pu = POINT_U[i];

        let pulseStrength = 0;
        if (waveT[0] > 0.001) {
          let dist = Math.abs(i - waveIdxA);
          if (dist > POINT_COUNT - dist) dist = POINT_COUNT - dist;
          const factor = Math.max(0, 1 - dist / 16);
          pulseStrength = Math.max(pulseStrength, factor * factor * waveT[0]);
        }
        if (waveT[3] > 0.001) {
          let dist = Math.abs(i - waveIdxB);
          if (dist > POINT_COUNT - dist) dist = POINT_COUNT - dist;
          const factor = Math.max(0, 1 - dist / 22);
          pulseStrength = Math.max(pulseStrength, factor * factor * waveT[3]);
        }

        const eVal = Math.max(energy[i] * decay, pulseStrength * orbProps.gain);
        energy[i] = eVal;

        const morphT = clamp01(orbProps.k * 1.6 - 0.6 * pu);
        if (morphT <= 0.001) {
          colorIndices[i] = -1;
          continue;
        }

        const easedM = EASE.out(morphT);
        const popScale = easedM * orbProps.pop;

        // 3D Matrix Rotation (Y rot then X tilt)
        const rotX = px * cosRot + pz * sinRot;
        const rotZ = -px * sinRot + pz * cosRot;
        const tiltY = py * cosTilt - rotZ * sinTilt;
        const tiltZ = py * sinTilt + rotZ * cosTilt;

        const pers = 2.8 / (2.8 - tiltZ);
        const normZ = (tiltZ + 1) / 2;

        let projX = rotX * 66 * popScale * pers;
        let projY = -tiltY * 66 * popScale * pers;

        if (vortexBonus > 0.001) {
          const twist = (1 - morphT) * vortexBonus;
          const ct = Math.cos(twist);
          const st = Math.sin(twist);
          const tx = projX * ct - projY * st;
          projY = projX * st + projY * ct;
          projX = tx;
        }

        const sweepProg = clamp01((orbProps.sweep * 1.4 - pu) / 0.4);
        let alpha =
          0.12 +
          0.04 * Math.sin(POINT_SEED[i] + animTime * 1.6) * (1 - sweepProg) +
          0.34 * normZ * normZ +
          0.75 * eVal * (1 - sweepProg) +
          sweepProg * (0.55 + 0.4 * normZ);

        alpha = Math.max(alpha, orbProps.floor * (0.7 + 0.3 * normZ));
        if (alpha > 1) alpha = 1;
        alpha *= easedM * orbProps.alpha;

        screenX[i] = center + projX;
        screenY[i] = center + projY;
        depthVal[i] = normZ;
        radius[i] = (1.15 * (0.45 + 0.75 * normZ) * pers + 0.9 * eVal + sweepProg * 0.25) * (1 + orbProps.rad) * (0.4 + 0.6 * easedM);

        const colorIdxA = Math.round(alpha * COLOR_STEPS_D);
        const colorIdxB = Math.round(sweepProg * COLOR_STEPS_Y);
        colorIndices[i] = colorIdxA <= 0 ? -1 : colorIdxB * (COLOR_STEPS_D + 1) + colorIdxA;
      }

      // Draw depth-sorted points
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < POINT_COUNT; i++) {
          const idx = colorIndices[i];
          if (idx < 0) continue;
          if (depthVal[i] >= 0.5 === (pass === 1)) {
            ctx.fillStyle = COLOR_PALETTE[idx] || '#D4F53C';
            ctx.beginPath();
            ctx.arc(screenX[i], screenY[i], Math.max(0.5, radius[i]), 0, TWO_PI);
            ctx.fill();
          }
        }
      }
    };

    const loop = (stamp: number) => {
      if (isDestroyed) return;
      const dt = Math.max(0, Math.min(0.05, (stamp - (lastStamp || stamp)) / 1000));
      lastStamp = stamp;
      draw(dt);
      if (orbProps.alpha > 0.002) {
        reqId = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, 220, 220);
        reqId = 0;
      }
    };

    return {
      props: orbProps,
      ensure: () => {
        if (!reqId && !isDestroyed && orbProps.alpha > 0.002) {
          lastStamp = performance.now();
          reqId = requestAnimationFrame(loop);
        }
      },
      reset: () => {
        orbProps.k = 0;
        orbProps.alpha = 0;
        orbProps.spin = 0;
        orbProps.rot = 0;
        orbProps.sweep = 0;
        orbProps.pop = 1;
        orbProps.vortex = 0;
        orbProps.gain = 1;
        orbProps.floor = 0;
        orbProps.rad = 0;
        orbProps.prog = 0;
        energy.fill(0);
        waveT[0] = 1;
        waveT[1] = 0;
        waveT[2] = 0;
        waveT[3] = 0;
      },
      destroy: () => {
        isDestroyed = true;
        if (reqId) cancelAnimationFrame(reqId);
        reqId = 0;
      },
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mover = moverRef.current;
    const actor = actorRef.current;
    const form = formRef.current;
    const canvas = canvasRef.current;
    const pulse = pulseRef.current;
    const status = statusRef.current;

    if (!root || !mover || !actor || !form || !canvas || !pulse || !status) return;

    const orb = setupOrb(canvas);
    if (!orb) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion.current = mq.matches;

    // Track channels
    const channels: Record<string, number> = {
      w: 420,
      h: 56,
      r: 999,
      oGlow: 1,
      oHalo: 0,
      oPill: 1,
      oBall: 0,
      oGreen: 0,
      oCard: 0,
      oRing: 1,
      oInput: 1,
      inScale: 1,
      oAur: 1,
      gs: 0.55,
      cs: 1,
      hOp: 0,
      dotS: 0,
      bloom: 1,
      u: 0,
      yOff: 0,
      trail: 0,
      pulse: -1,
      sOp: 0,
      sTy: 6,
      cHalo: 0,
      wp: 0,
      'orb.k': 0,
      'orb.alpha': 0,
      'orb.spin': 0,
      'orb.pop': 1,
      'orb.sweep': 0,
      'orb.vortex': 0,
      'orb.gain': 1,
      'orb.floor': 0,
      'orb.rad': 0,
    };

    const applyChannel = (key: string, val: number) => {
      channels[key] = val;
      if (key === 'w') {
        actor.style.setProperty('--w', `${Math.round(val)}px`);
      } else if (key === 'h') {
        actor.style.setProperty('--h', `${Math.round(val)}px`);
      } else if (key === 'r') {
        actor.style.setProperty('--r', `${Math.round(val)}px`);
      } else if (key === 'inScale') {
        actor.style.setProperty('--inScale', fmt(val));
        form.style.filter = val >= 0.999 ? 'none' : `blur(${fmt((1 - val) * 15)}px)`;
      } else if (key === 'sOp') {
        status.style.setProperty('--sOp', fmt(val));
      } else if (key === 'sTy') {
        status.style.setProperty('--sTy', `${fmt(val)}px`);
      } else if (key === 'cHalo') {
        root.style.setProperty('--oCenter', fmt(val));
      } else if (key === 'pulse') {
        if (val < 0) {
          pulse.style.opacity = '0';
        } else {
          pulse.style.opacity = fmt(0.6 * (1 - val));
          pulse.style.transform = `scale(${fmt(1 + val)})`;
        }
      } else if (key.startsWith('orb.')) {
        const prop = key.slice(4) as keyof typeof orb.props;
        orb.props[prop] = val;
        if (prop === 'alpha') orb.ensure();
      } else if (key === 'u' || key === 'yOff') {
        const uVal = channels.u || 0;
        const yOff = channels.yOff || 0;
        const parentH = root.clientHeight || 420;
        const totalDy = Math.min(100, parentH * 0.25);
        const curY = bezQuad(uVal, totalDy, 0.5 * totalDy, 0) + yOff;
        mover.style.transform = `translate3d(0px, ${curY.toFixed(2)}px, 0)`;
      } else if (key === 'wp') {
        const bodyEl = bodyRef.current;
        if (bodyEl) {
          const spans = bodyEl.querySelectorAll<HTMLSpanElement>('.mo-w');
          const spanCount = spans.length;
          const totalW = spanCount * 30 + 200;
          const progressW = val * totalW;
          spans.forEach((sp, idx) => {
            const wordAlpha = clamp01((progressW - idx * 25) / 180);
            sp.style.opacity = fmt(wordAlpha);
            sp.style.transform = wordAlpha >= 0.999 ? 'none' : `translateY(${fmt((1 - wordAlpha) * 4)}px)`;
          });
        }
      } else {
        actor.style.setProperty(`--${key}`, fmt(val));
      }
    };

    const playTracks = (trackList: TrackDef[], abortSig: AbortSignal): Promise<void> => {
      return new Promise(resolve => {
        if (abortSig.aborted) return resolve();
        const maxDuration = trackList.reduce((acc, t) => Math.max(acc, t.t1), 0);
        let startStamp = 0;
        let reqAnim = 0;
        const finishedTracks = new Set<TrackDef>();

        const onAbort = () => {
          cancelAnimationFrame(reqAnim);
          resolve();
        };

        abortSig.addEventListener('abort', onAbort, { once: true });

        const step = (now: number) => {
          if (!startStamp) startStamp = now;
          const elapsed = (now - startStamp) * propsRef.current.speed;

          for (const tr of trackList) {
            if (finishedTracks.has(tr) || elapsed < tr.t0) continue;
            const normT = Math.min(1, (elapsed - tr.t0) / Math.max(1, tr.t1 - tr.t0));
            const easeFn = tr.ease || EASE.io;
            const currentVal = tr.from + (tr.to - tr.from) * easeFn(normT);
            applyChannel(tr.ch, currentVal);

            if (normT >= 1) {
              finishedTracks.add(tr);
            }
          }

          if (elapsed >= maxDuration) {
            abortSig.removeEventListener('abort', onAbort);
            resolve();
          } else {
            reqAnim = requestAnimationFrame(step);
          }
        };

        reqAnim = requestAnimationFrame(step);
      });
    };

    // Calculate container-aware dimensions
    const getPillWidth = () => Math.min(520, Math.max(280, (root.clientWidth || 400) - 24));
    const getCardWidth = () => Math.min(460, Math.max(280, (root.clientWidth || 400) - 24));

    applyChannel('w', getPillWidth());
    applyChannel('h', 56);
    applyChannel('r', 999);
    applyChannel('u', 0);

    let activeAbortController: AbortController | null = null;

    const startMorph = async (query: string) => {
      if (activeAbortController) activeAbortController.abort();
      const ctrl = new AbortController();
      activeAbortController = ctrl;
      const sig = ctrl.signal;

      try {
        const pw = getPillWidth();
        const cw = getCardWidth();

        const fromAnswered = phaseRef.current === 'answered';
        orb.reset();
        setAnswerText('');

        updatePhase('launch');

        const initialW = fromAnswered ? cw : pw;
        const initialH = fromAnswered ? 160 : 56;

        // Phase 1: Shrink into sphere and fly upward
        const launchTracks: TrackDef[] = [
          track('oCard', channels.oCard || 0, 0, 0, 200, EASE.out),
          track('hOp', channels.hOp || 0, 0, 0, 150, EASE.out),
          track('w', initialW, 56, 0, 480, EASE.io),
          track('h', initialH, 56, 0, 480, EASE.io),
          track('oInput', 1, 0, 0, 160, EASE.in),
          track('inScale', 1, 0.6, 0, 160, EASE.in),
          track('oGlow', 1, 0, 0, 240, EASE.out),
          track('oAur', 1, 0, 0, 240, EASE.out),
          track('oPill', 1, 0, 240, 480, EASE.out),
          track('oBall', 0, 1, 240, 480, EASE.out),
          track('u', channels.u || 0, 1, 480, 1200, EASE.fly),
          track('w', 56, 120, 480, 1000, EASE.grow),
          track('h', 56, 120, 480, 1000, EASE.grow),
          track('w', 120, 132, 1000, 1200, EASE.out),
          track('h', 120, 132, 1000, 1200, EASE.out),
          track('cHalo', 0, 0.6, 480, 1200, EASE.out),
        ];

        await playTracks(launchTracks, sig);
        if (sig.aborted) return;

        updatePhase('assemble');
        applyChannel('r', 66);

        // Phase 2: Assemble 3D Rotating Orb
        const assembleTracks: TrackDef[] = [
          track('oRing', 1, 0, 0, 250, EASE.out),
          track('oBall', 1, 0, 0, 200, EASE.out),
          track('orb.k', 0, 1, 0, 700, EASE.out),
          track('orb.alpha', 0, 1, 0, 700, EASE.out),
          track('orb.spin', 0, 0.9, 0, 700, EASE.out),
          track('sOp', 0, 1, 200, 500, EASE.out),
          track('sTy', 6, 0, 200, 500, EASE.out),
        ];

        await playTracks(assembleTracks, sig);
        if (sig.aborted) return;

        updatePhase('think');

        // Label cycling while AI works
        let labelIdx = 0;
        const currentLabels = propsRef.current.labels;
        const labelInterval = setInterval(() => {
          if (sig.aborted) return clearInterval(labelInterval);
          labelIdx = (labelIdx + 1) % currentLabels.length;
          orb.props.prog = labelIdx % 4;
          setActiveLabel(prev => ({ cur: currentLabels[labelIdx], prev: prev.cur, n: prev.n + 1 }));
        }, 1100);

        // Execute query
        const startTime = performance.now();
        const fetchPromise = propsRef.current.onSubmit
          ? propsRef.current.onSubmit(query)
          : Promise.resolve(propsRef.current.defaultAnswer);
        const resolvedText = await fetchPromise;

        const elapsed = performance.now() - startTime;
        const remainingWait = Math.max(0, propsRef.current.minThinkMs - elapsed);
        if (remainingWait > 0) {
          await new Promise(r => setTimeout(r, remainingWait));
        }

        clearInterval(labelInterval);
        if (sig.aborted) return;

        updatePhase('resolve');
        setActiveLabel(prev => ({ cur: propsRef.current.doneLabel, prev: prev.cur, n: prev.n + 1 }));

        // Phase 3: Orb resolves & vortices into glowing signal pip
        const resolveTracks: TrackDef[] = [
          track('orb.sweep', 0, 1, 0, 600, EASE.io),
          track('orb.spin', 0.9, 0.25, 0, 600, EASE.out),
          track('orb.floor', 0, 0.95, 300, 750, EASE.out),
          track('orb.pop', 1, 1.04, 450, 650, EASE.out),
          track('orb.pop', 1.04, 1, 650, 750, EASE.out),
        ];

        await playTracks(resolveTracks, sig);
        if (sig.aborted) return;

        updatePhase('condense');

        const condenseTracks: TrackDef[] = [
          track('sOp', 1, 0, 0, 140, EASE.in),
          track('sTy', 0, -6, 0, 140, EASE.in),
          track('orb.k', 1, 0, 80, 500, EASE.vortex),
          track('orb.vortex', 0, 1.6, 80, 500, EASE.vortex),
          track('oGreen', 0, 1, 200, 550, EASE.spring),
          track('gs', 0.55, 1, 200, 550, EASE.spring),
          track('pulse', 0, 1, 250, 600, EASE.out),
          track('orb.alpha', 1, 0, 400, 650, EASE.out),
        ];

        await playTracks(condenseTracks, sig);
        if (sig.aborted) return;

        // Phase 4: Unfold into Tactical Card
        updatePhase('unfold');
        setAnswerText(resolvedText);

        const wordCount = resolvedText.split(/\s+/).filter(Boolean).length;
        const wordRevealTime = Math.max(300, wordCount * 28);

        const unfoldTracks: TrackDef[] = [
          track('w', 132, 110, 0, 80, EASE.in),
          track('h', 132, 110, 0, 80, EASE.in),
          track('w', 110, cw, 80, 600, EASE.card),
          track('h', 110, 160, 80, 600, EASE.out),
          track('r', 66, 18, 80, 600, EASE.io),
          track('oGreen', 1, 0, 150, 450, EASE.out),
          track('oCard', 0, 1, 150, 450, EASE.out),
          track('hOp', 0, 1, 400, 650, EASE.out),
          track('dotS', 0, 1, 400, 650, EASE.spring),
          track('wp', 0, 1, 450, 450 + wordRevealTime, EASE.lin),
          track('bloom', 1, 0.6, 500, 900, EASE.io),
        ];

        await playTracks(unfoldTracks, sig);
        if (sig.aborted) return;

        updatePhase('answered');
        if (liveRef.current) {
          liveRef.current.textContent = `Tactical brief ready: ${resolvedText}`;
        }
      } catch (err) {
        console.error('Morph error:', err);
      }
    };

    const resetToIdle = async () => {
      if (activeAbortController) activeAbortController.abort();
      const ctrl = new AbortController();
      activeAbortController = ctrl;
      const sig = ctrl.signal;

      updatePhase('reset');

      const resetTracks: TrackDef[] = [
        track('oCard', 1, 0, 0, 180, EASE.out),
        track('hOp', 1, 0, 0, 150, EASE.out),
        track('cHalo', channels.cHalo || 0, 0, 0, 180, EASE.out),
      ];

      await playTracks(resetTracks, sig);
      if (sig.aborted) return;

      orb.reset();
      setAnswerText('');
      setInputValue('');
      setActiveLabel({ cur: propsRef.current.labels[0] || 'Analyzing Sector Telemetry', prev: null, n: 0 });

      const pw = getPillWidth();
      applyChannel('w', pw);
      applyChannel('h', 56);
      applyChannel('r', 999);
      applyChannel('u', 0);
      applyChannel('pulse', -1);
      applyChannel('oInput', 0);
      applyChannel('oPill', 0);
      applyChannel('oGlow', 0);
      applyChannel('oRing', 0);
      applyChannel('yOff', 8);

      const restoreTracks: TrackDef[] = [
        track('oInput', 0, 1, 0, 260, EASE.out),
        track('oPill', 0, 1, 0, 260, EASE.out),
        track('oGlow', 0, 1, 0, 260, EASE.out),
        track('oRing', 0, 1, 0, 260, EASE.out),
        track('yOff', 8, 0, 0, 260, EASE.out),
      ];

      await playTracks(restoreTracks, sig);
      if (sig.aborted) return;

      updatePhase('idle');
      if (propsRef.current.onReset) propsRef.current.onReset();
      inputRef.current?.focus();
    };

    runtimeRef.current = {
      start: (q: string) => {
        if (phaseRef.current !== 'idle') {
          if (phaseRef.current === 'answered') {
            startMorph(q);
            return true;
          }
          return false;
        }
        startMorph(q);
        return true;
      },
      escape: resetToIdle,
      reset: resetToIdle,
      hard: resetToIdle,
    };

    return () => {
      if (activeAbortController) activeAbortController.abort();
      orb.destroy();
    };
  }, [setupOrb, updatePhase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || phaseRef.current !== 'idle') return;
    runtimeRef.current?.start(query);
  };

  return (
    <div
      ref={rootRef}
      className={`relative w-full min-h-[460px] flex items-center justify-center select-none overflow-hidden rounded-2xl cairn-glass border border-white/[0.08] p-4 ${className}`}
      data-phase={phase}
      style={{
        // @ts-expect-error custom css variable
        '--iri-green': '#D4F53C',
        '--iri-amber': '#FF8A3D',
        '--iri-mint': '#34D399',
        '--ok-rgb': '212, 245, 60',
      }}
    >
      {/* Background Micro Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(70% 62% at 50% 50%, #000 0%, transparent 100%)',
        }}
      />

      {/* Atmospheric Central Halo */}
      <div
        className="absolute w-[480px] h-[480px] rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(closest-side, rgba(212, 245, 60, 0.08), rgba(212, 245, 60, 0.02) 50%, transparent)',
          opacity: 'var(--oCenter, 0)',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />

      {/* Mover Container (interpolates along bezier path) */}
      <div ref={moverRef} className="absolute left-1/2 top-1/2 w-0 h-0 will-change-transform">
        {/* Particle Trail Ghosts */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            ref={el => {
              ghostsRef.current[i] = el;
            }}
            className="absolute -left-[50px] -top-[50px] w-[100px] h-[100px] rounded-full pointer-events-none opacity-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 245, 60, 0.25), transparent 70%)',
            }}
          />
        ))}

        {/* Actor Container (morphs w, h, r, borders) */}
        <div
          ref={actorRef}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 transition-[box-shadow,border-color] duration-300"
          style={{
            width: 'var(--w, 420px)',
            height: 'var(--h, 56px)',
            borderRadius: 'var(--r, 999px)',
          }}
        >
          {/* Underglow */}
          <div
            className="absolute left-3 right-3 top-[calc(100%-4px)] h-6 rounded-full pointer-events-none filter blur-xl transition-opacity"
            style={{
              background: 'radial-gradient(50% 100% at 50% 50%, rgba(212,245,60,0.3), transparent 75%)',
              opacity: 'var(--oGlow, 1)',
            }}
          />

          {/* Green Beacon Pip */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none transition-transform"
            style={{
              opacity: 'var(--oGreen, 0)',
              transform: 'scale(var(--gs, 0.55))',
              background: 'radial-gradient(circle at 35% 25%, #ffffff 0%, #D4F53C 50%, #55642D 100%)',
              boxShadow: '0 0 24px rgba(212, 245, 60, 0.8), inset 0 1px rgba(255, 255, 255, 0.8)',
            }}
          />

          {/* Unfolded Answer Card */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none bg-surface/90 backdrop-blur-xl border border-white/[0.12] shadow-2xl"
            style={{
              opacity: 'var(--oCard, 0)',
              transform: 'scale(var(--cs, 1))',
            }}
          >
            <div
              className="absolute inset-0 rounded-[inherit] pointer-events-none"
              style={{
                background: 'radial-gradient(60% 90% at 0% 50%, rgba(212, 245, 60, 0.12), transparent 70%)',
                opacity: 'var(--bloom, 1)',
              }}
            />
          </div>

          {/* Pill Surface Glass Backdrop */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none bg-surface/70 backdrop-blur-xl border border-white/[0.1] shadow-lg"
            style={{
              opacity: 'var(--oPill, 1)',
            }}
          />

          {/* Subtle Aurora Iridescent Gradient */}
          <div
            className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
            style={{ opacity: 'var(--oAur, 1)' }}
          >
            <div
              className="absolute -bottom-4 left-4 w-2/5 h-8 rounded-full filter blur-md animate-pulse opacity-60"
              style={{ background: 'radial-gradient(closest-side, #D4F53C, transparent)' }}
            />
            <div
              className="absolute -bottom-4 right-8 w-2/5 h-8 rounded-full filter blur-md animate-pulse opacity-40"
              style={{ background: 'radial-gradient(closest-side, #FF8A3D, transparent)' }}
            />
          </div>

          {/* Rotating Perimeter Ring */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none border border-signal/30"
            style={{ opacity: 'var(--oRing, 1)' }}
          />

          {/* Interactive Input Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="absolute inset-0 flex items-center gap-3 px-4 rounded-[inherit] overflow-hidden"
            style={{
              opacity: 'var(--oInput, 1)',
              transform: 'scale(var(--inScale, 1))',
            }}
          >
            {/* Tactical Spark Icon */}
            <div className="text-signal shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-0 outline-none font-sans text-sm text-ink placeholder:text-mute/60 min-w-0"
              disabled={phase !== 'idle'}
            />

            <button
              type="submit"
              aria-label="Send query"
              disabled={phase !== 'idle' || !inputValue.trim()}
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isTyping
                  ? 'bg-signal text-deep-ground shadow-glow-signal scale-105'
                  : 'bg-surface/80 text-mute hover:text-ink'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>

          {/* 3D Particle Canvas Orb */}
          <canvas
            ref={canvasRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] pointer-events-none"
          />

          {/* Condensation Pulse */}
          <div
            ref={pulseRef}
            className="absolute inset-0 rounded-[inherit] border border-signal pointer-events-none opacity-0"
          />

          {/* Unfolded Answer Card Content */}
          <div
            ref={answerRef}
            tabIndex={-1}
            className="absolute inset-0 p-5 rounded-[inherit] flex flex-col justify-between overflow-hidden pointer-events-none font-sans text-xs"
            style={{
              opacity: 'var(--oCard, 0)',
            }}
          >
            <div
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-signal font-bold pb-1.5 border-b border-white/[0.08]"
              style={{
                opacity: 'var(--hOp, 0)',
                transform: 'translateY(calc((1 - var(--hOp, 0)) * 4px))',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-signal"
                style={{ transform: 'scale(var(--dotS, 0))' }}
              />
              <span>{answerTitle}</span>
            </div>

            <p ref={bodyRef} className="text-xs sm:text-sm font-sans text-ink leading-relaxed line-clamp-4">
              {words.map((w, idx) => (
                <span key={idx} className="mo-w inline-block mr-1 opacity-0">
                  {w}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Status Text (cycling labels) */}
      <div
        ref={statusRef}
        className="absolute left-1/2 top-[calc(50%+80px)] -translate-x-1/2 pointer-events-none font-mono text-xs tracking-wider uppercase text-center text-mute"
        style={{
          opacity: 'var(--sOp, 0)',
          transform: 'translate(-50%, var(--sTy, 6px))',
        }}
      >
        <span className="text-signal flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping" />
          <span>{activeLabel.cur}</span>
        </span>
      </div>

      {/* Reset Button (New Query) */}
      {phase === 'answered' && (
        <button
          onClick={() => runtimeRef.current?.reset()}
          className="absolute left-1/2 bottom-5 -translate-x-1/2 px-4 py-1.5 rounded-full bg-surface/80 border border-white/[0.12] text-xs font-mono text-signal hover:bg-surface hover:border-signal/50 transition-all shadow-md z-20 flex items-center gap-1.5"
        >
          <span>Ask New Query</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </button>
      )}

      {/* Accessibility Announcement */}
      <div ref={liveRef} className="sr-only" role="status" aria-live="polite" />
    </div>
  );
});

export default AIThinkingOrbAndInput;
