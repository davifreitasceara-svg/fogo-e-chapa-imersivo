import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Droplets,
  Maximize2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import cocaCola from "@/assets/coca-cola.jpg";
import orangeJuice from "@/assets/orange-juice.jpg";
import lemonade from "@/assets/lemonade.jpg";
import beer from "@/assets/beer.jpg";
import icedTea from "@/assets/iced-tea.jpg";
import guarana from "@/assets/guarana.jpg";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type DrinkLiquid = {
  /** Main saturated liquid color */
  color: string;
  /** Lighter translucent highlight color for depth/gloss */
  light: string;
  /** Core specular glow */
  glow?: string;
  /** Optional foam / carbonation color (soda, beer…) */
  foam?: string;
};

export type DrinkCoordinates = {
  /** % from left where the glass rim lands at peak tilt */
  pourX: number;
  /** % from top where the glass rim lands at peak tilt */
  pourY: number;
  /** % from left where the stream hits the table floor */
  landX: number;
  /** % from top of the table floor */
  floorY: number;
  /** CSS transform-origin for the glass tilt */
  pivotOrigin: string;
};

export type DrinkItem = {
  id: number;
  name: string;
  title: [string, string];
  description: string;
  price: number;
  image: string;
  tag?: string;
  volume: string;
  notes: string[];
  liquid: DrinkLiquid;
  coords: DrinkCoordinates;
};

export type DrinkTheme = {
  bgLight: string;
  primary: string;
  secondary: string;
  secondaryAlpha: string;
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

export const DRINK_SHOWCASE: DrinkItem[] = [
  {
    id: 201,
    name: "Coca Cola",
    title: ["COCA", "COLA"],
    description: "Clássica e gelada, com gelo e rodela de limão.",
    price: 9,
    image: cocaCola,
    tag: "Clássico",
    volume: "350ml",
    notes: ["Gelo", "Limão", "Gaseificada"],
    liquid: {
      color: "#2a0d04",
      light: "#b45309",
      glow: "#f59e0b",
      foam: "#fde68a",
    },
    coords: {
      pourX: 96,
      pourY: 26,
      landX: 114,
      floorY: 92,
      pivotOrigin: "65% 88%",
    },
  },
  {
    id: 202,
    name: "Gole de Martins",
    title: ["GOLE DE", "MARTINS"],
    description: "Suco de laranja artesanal com hortelã fresca.",
    price: 14,
    image: orangeJuice,
    tag: "Da casa",
    volume: "400ml",
    notes: ["Natural", "Hortelã", "Sem conservantes"],
    liquid: {
      color: "#ea580c",
      light: "#fbbf24",
      glow: "#fef08a",
    },
    coords: {
      pourX: 95,
      pourY: 28,
      landX: 113,
      floorY: 92,
      pivotOrigin: "65% 88%",
    },
  },
  {
    id: 203,
    name: "Sprite Gelada",
    title: ["SPRITE", "GELADA"],
    description: "Limão refrescante, trincando de gelada.",
    price: 8,
    image: lemonade,
    volume: "350ml",
    notes: ["Limão", "Gelo", "Gaseificada"],
    liquid: {
      color: "#ca8a04",
      light: "#facc15",
      glow: "#fef08a",
      foam: "#ffffff",
    },
    coords: {
      pourX: 97,
      pourY: 26,
      landX: 115,
      floorY: 92,
      pivotOrigin: "65% 88%",
    },
  },
  {
    id: 204,
    name: "Chopp Gelado",
    title: ["CHOPP", "GELADO"],
    description: "Tirado na hora, com colarinho cremoso.",
    price: 12,
    image: beer,
    tag: "+18",
    volume: "500ml",
    notes: ["Pilsen", "Colarinho", "Trincando"],
    liquid: {
      color: "#d97706",
      light: "#fcd34d",
      glow: "#fef3c7",
      foam: "#fffbeb",
    },
    coords: {
      pourX: 99,
      pourY: 26,
      landX: 117,
      floorY: 92,
      pivotOrigin: "67% 88%",
    },
  },
  {
    id: 205,
    name: "Chá Gelado",
    title: ["CHÁ", "GELADO"],
    description: "Refrescante de pêssego com limão siciliano.",
    price: 10,
    image: icedTea,
    volume: "400ml",
    notes: ["Pêssego", "Limão", "Hortelã"],
    liquid: {
      color: "#9a3412",
      light: "#f97316",
      glow: "#fdba74",
    },
    coords: {
      pourX: 100,
      pourY: 27,
      landX: 118,
      floorY: 92,
      pivotOrigin: "68% 88%",
    },
  },
  {
    id: 206,
    name: "Seca-nunca",
    title: ["SECA-", "NUNCA"],
    description: "Mata a sede de verdade. Receita secreta da casa.",
    price: 12,
    image: guarana,
    tag: "Favorito",
    volume: "500ml",
    notes: ["Receita secreta", "Gelo", "Gaseificada"],
    liquid: {
      color: "#15803d",
      light: "#4ade80",
      glow: "#bbf7d0",
      foam: "#f0fdf4",
    },
    coords: {
      pourX: 97,
      pourY: 25,
      landX: 115,
      floorY: 92,
      pivotOrigin: "66% 88%",
    },
  },
];

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* -------------------------------------------------------------------------- */
/*                               Web Audio Engine                             */
/* -------------------------------------------------------------------------- */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx ??= new Ctx();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function playGlassKnockSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    // Glass resonance ping
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.08);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);

    // Wood table knock thump
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(160, t);
    thump.frequency.exponentialRampToValueAtTime(45, t + 0.07);
    thumpGain.gain.setValueAtTime(0.08, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    thump.connect(thumpGain).connect(ctx.destination);
    thump.start(t);
    thump.stop(t + 0.09);
  } catch {
    /* ignore */
  }
}

function playGlassSettleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    // Settle clack 1
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(90, t + 0.04);
    g1.gain.setValueAtTime(0.06, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc1.connect(g1).connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.06);

    // Micro rebound tap 2 (30ms later)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(260, t + 0.035);
    osc2.frequency.exponentialRampToValueAtTime(80, t + 0.075);
    g2.gain.setValueAtTime(0.03, t + 0.035);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc2.connect(g2).connect(ctx.destination);
    osc2.start(t + 0.035);
    osc2.stop(t + 0.09);
  } catch {
    /* ignore */
  }
}

function playPourPhysicsSound(liquid: DrinkLiquid, big = false) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const duration = big ? 1.45 : 1.25;

    // Fluid rushing noise buffer
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Resonant bandpass for liquid stream
    const filter1 = ctx.createBiquadFilter();
    filter1.type = "bandpass";
    filter1.Q.value = 2.4;
    filter1.frequency.setValueAtTime(1600, now);
    filter1.frequency.exponentialRampToValueAtTime(850, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.055, now + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter1).connect(gain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);

    // Optional carbonation effervescence fizz (if soda or beer)
    if (liquid.foam) {
      const fizzFilter = ctx.createBiquadFilter();
      fizzFilter.type = "highpass";
      fizzFilter.frequency.setValueAtTime(3800, now);
      const fizzGain = ctx.createGain();
      fizzGain.gain.setValueAtTime(0.0001, now);
      fizzGain.gain.exponentialRampToValueAtTime(0.035, now + 0.15);
      fizzGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      const fizzNoise = ctx.createBufferSource();
      fizzNoise.buffer = buffer;
      fizzNoise.connect(fizzFilter).connect(fizzGain).connect(ctx.destination);
      fizzNoise.start(now);
      fizzNoise.stop(now + duration);
    }

    // Liquid bubbling/glugging resonant pulses
    const glugCount = big ? 4 : 3;
    for (let i = 0; i < glugCount; i++) {
      const glugTime = now + 0.12 + i * 0.22;
      const osc = ctx.createOscillator();
      const glugGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(360 + Math.random() * 80, glugTime);
      osc.frequency.exponentialRampToValueAtTime(140, glugTime + 0.12);

      glugGain.gain.setValueAtTime(0.0001, glugTime);
      glugGain.gain.exponentialRampToValueAtTime(0.045, glugTime + 0.02);
      glugGain.gain.exponentialRampToValueAtTime(0.0001, glugTime + 0.12);

      osc.connect(glugGain).connect(ctx.destination);
      osc.start(glugTime);
      osc.stop(glugTime + 0.14);
    }
  } catch {
    /* ignore */
  }
}

/* -------------------------------------------------------------------------- */
/*                         Fluid Stream & Splash Elements                     */
/* -------------------------------------------------------------------------- */

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type FluidSpillOverlayProps = {
  liquid: DrinkLiquid;
  coords: DrinkCoordinates;
  isPouring: boolean;
  puddleVisible: boolean;
  big?: boolean;
};

function FluidSpillOverlay({
  liquid,
  coords,
  isPouring,
  puddleVisible,
  big = false,
}: FluidSpillOverlayProps) {
  const { pourX, pourY, landX, floorY } = coords;
  const dxTotal = landX - pourX;
  const dyTotal = floorY - pourY;

  // Stream geometry with realistic fluid continuity (Conservation of Mass: A*v = const)
  // At the lip: stream width ~3.4 units (viewBox space)
  // Stream geometry with realistic fluid projectile motion & continuity (A*v = const)
  // Liquid leaves the tipped rim with outward horizontal velocity (vx > 0)
  // It arches over in a true parabolic leap, tapers in freefall, and fans out at impact
  const ribbonPaths = useMemo(() => {
    // 1. Outer boundary curve (upper lip -> outward parabolic crest -> tapered midfall -> impact flare)
    const pOuter0 = `${pourX + 0.6} ${pourY - 1.8}`;
    const cOuter1 = `${pourX + dxTotal * 0.65} ${pourY + dyTotal * 0.15}`;
    const cOuter2 = `${landX + 1.8} ${pourY + dyTotal * 0.68}`;
    const pOuter1 = `${landX + 3.4} ${floorY}`;

    // 2. Inner boundary curve (lower lip -> inner parabolic crest -> tapered midfall -> impact flare)
    const pInner0 = `${pourX - 1.8} ${pourY + 2.0}`;
    const cInner1 = `${pourX + dxTotal * 0.42} ${pourY + dyTotal * 0.18}`;
    const cInner2 = `${landX - 1.8} ${pourY + dyTotal * 0.68}`;
    const pInner1 = `${landX - 3.4} ${floorY}`;

    // Complete closed fluid ribbon
    const fluidRibbon = `M ${pOuter0} C ${cOuter1}, ${cOuter2}, ${pOuter1} L ${pInner1} C ${cInner2}, ${cInner1}, ${pInner0} Z`;

    // Primary central parabolic flowing spine
    const spine = `M ${pourX} ${pourY} C ${pourX + dxTotal * 0.55} ${pourY + dyTotal * 0.16}, ${landX} ${pourY + dyTotal * 0.68}, ${landX} ${floorY}`;

    // Secondary inner refraction vein (slightly offset to create twisting liquid depth)
    const innerVein = `M ${pourX - 0.5} ${pourY + 0.8} C ${pourX + dxTotal * 0.52} ${pourY + dyTotal * 0.18}, ${landX - 0.8} ${pourY + dyTotal * 0.66}, ${landX - 0.5} ${floorY - 1}`;

    // Outer edge sheen highlight
    const outerSheen = `M ${pOuter0} C ${cOuter1}, ${cOuter2}, ${pOuter1}`;

    return { fluidRibbon, spine, innerVein, outerSheen };
  }, [dxTotal, dyTotal, floorY, landX, pourX, pourY]);

  // Airborne satellite droplets (parabolic freefall under gravity)
  const airborneDrops = useMemo(
    () =>
      Array.from({ length: big ? 16 : 12 }, (_, i) => ({
        id: i,
        size: rand(2.6, big ? 6.5 : 5.0),
        outX: rand(4, 16),
        landOffset: rand(-4, 6),
        delay: rand(0.04, 0.45),
        duration: rand(0.38, 0.55),
      })),
    [big],
  );

  // Impact splash fountain droplets (parabolic fountain bursting upward and outward)
  const splashFountain = useMemo(
    () =>
      Array.from({ length: big ? 20 : 15 }, (_, i) => ({
        id: i,
        size: rand(3.8, big ? 8.5 : 6.8),
        dx: rand(-22, 25),
        up: rand(12, 28),
        delay: rand(0.04, 0.45),
        duration: rand(0.35, 0.52),
      })),
    [big],
  );

  // Surface tension satellite spatter beads around puddle
  const puddleBeads = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        x: rand(-26, 26),
        y: rand(-8, 8),
        size: rand(2.2, 4.2),
      })),
    [],
  );

  const glossy = `radial-gradient(circle at 35% 30%, ${liquid.light} 0%, ${liquid.color} 70%)`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible select-none" aria-hidden>
      {/* ------------------------------------------------------------------ */}
      {/* 1. ORGANIC VISCOUS PUDDLE (Natural surface tension & wet glare)     */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {puddleVisible && (
          <motion.div
            key="puddle"
            className="absolute z-10"
            style={{
              left: `${landX}%`,
              top: `${floorY}%`,
              width: big ? "56%" : "46%",
              height: "11%",
              x: "-50%",
              y: "-50%",
            }}
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.88 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{
              scale: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.65, ease: "easeInOut" },
            }}
          >
            {/* Table soft contact shadow */}
            <div
              className="absolute inset-0 rounded-[50%] blur-sm"
              style={{ background: "rgba(0, 0, 0, 0.14)", transform: "translateY(2px) scale(0.98)" }}
            />

            {/* Main viscous puddle: smooth organic fluid body with surface tension rim */}
            <div
              className="absolute inset-0"
              style={{
                borderRadius: "56% 44% 60% 40% / 46% 54% 46% 54%",
                background: `radial-gradient(ellipse at 46% 38%, ${liquid.light} 0%, ${liquid.color} 72%, ${liquid.color} 100%)`,
                boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.55), inset 0 -1.5px 3px rgba(0, 0, 0, 0.18), 0 2px 8px ${liquid.color}33`,
              }}
            />

            {/* Specular wet surface glare */}
            <div
              className="absolute rounded-[50%] blur-[0.6px]"
              style={{
                left: "22%",
                top: "16%",
                width: "36%",
                height: "30%",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.08) 80%)",
              }}
            />

            {/* Satellite spatter droplets scattered on table */}
            {puddleBeads.map((b) => (
              <span
                key={`pb-${b.id}`}
                className="absolute rounded-full"
                style={{
                  left: `calc(50% + ${b.x}px)`,
                  top: `calc(50% + ${b.y}px)`,
                  width: b.size,
                  height: b.size * 0.85,
                  background: glossy,
                  boxShadow: `0 1px 2px rgba(0, 0, 0, 0.12)`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* 2. CONCENTRIC SHOCKWAVE RIPPLES (Continuous table wave pulses)    */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isPouring && (
          <>
            <motion.div
              key="ripple-1"
              className="absolute z-10 rounded-[50%] border-2"
              style={{
                left: `${landX}%`,
                top: `${floorY}%`,
                width: big ? "42%" : "34%",
                height: "8%",
                x: "-50%",
                y: "-50%",
                borderColor: liquid.light,
              }}
              initial={{ scale: 0.1, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              key="ripple-2"
              className="absolute z-10 rounded-[50%] border"
              style={{
                left: `${landX}%`,
                top: `${floorY}%`,
                width: big ? "50%" : "40%",
                height: "9%",
                x: "-50%",
                y: "-50%",
                borderColor: "rgba(255, 255, 255, 0.85)",
              }}
              initial={{ scale: 0.1, opacity: 0.85 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.32, repeat: Infinity, ease: "easeOut" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* 3. CONTINUOUS PARABOLIC FLUID STREAM (Active while tilting)         */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isPouring && (
          <motion.div
            key="stream-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-30 overflow-visible"
          >
            {/* SVG Parabolic Fluid Ribbon & Multi-Strand Flowing Spine */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full overflow-visible"
              fill="none"
            >
              <defs>
                {/* Vertical Stream Depth Gradient */}
                <linearGradient
                  id={`fluid-flow-grad-${pourX}-${pourY}`}
                  x1={`${pourX}%`}
                  y1={`${pourY}%`}
                  x2={`${landX}%`}
                  y2={`${floorY}%`}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={liquid.light} stopOpacity="0.95" />
                  <stop offset="25%" stopColor={liquid.light} stopOpacity="0.95" />
                  <stop offset="65%" stopColor={liquid.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={liquid.light} stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* 3.1 MAIN FLUID RIBBON (Tapered 2D Volume with outward parabolic momentum) */}
              <motion.path
                d={ribbonPaths.fluidRibbon}
                fill={`url(#fluid-flow-grad-${pourX}-${pourY})`}
                opacity={0.92}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.92 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              />

              {/* 3.2 TRANSLUCENT LIGHT CORE RIBBON */}
              <path
                d={ribbonPaths.spine}
                stroke={liquid.light}
                strokeWidth={big ? 4.0 : 2.6}
                strokeLinecap="round"
                opacity={0.65}
              />

              {/* 3.3 SECONDARY INNER REFRACTION VEIN (Twisting liquid depth) */}
              <motion.path
                d={ribbonPaths.innerVein}
                stroke={liquid.light}
                strokeWidth={big ? 1.6 : 1.0}
                strokeLinecap="round"
                strokeDasharray="8 6 12 8"
                animate={{ strokeDashoffset: [0, -140] }}
                transition={{ duration: 0.44, repeat: Infinity, ease: "linear" }}
                opacity={0.75}
              />

              {/* 3.4 PRIMARY FLOWING SPECULAR SPINE (Rushing downward at high speed!) */}
              <motion.path
                d={ribbonPaths.spine}
                stroke="rgba(255, 255, 255, 0.92)"
                strokeWidth={big ? 2.0 : 1.4}
                strokeLinecap="round"
                strokeDasharray="14 8 22 10"
                animate={{ strokeDashoffset: [0, -108] }}
                transition={{ duration: 0.38, repeat: Infinity, ease: "linear" }}
              />

              {/* 3.5 SPECULAR OUTER EDGE SHEEN */}
              <path
                d={ribbonPaths.outerSheen}
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth={big ? 0.9 : 0.6}
                strokeLinecap="round"
                opacity={0.8}
              />

              {/* 3.6 IMPACT SPLASH CROWN (Coronet of liquid erupting upward at impact site) */}
              <motion.g
                transform={`translate(${landX}, ${floorY})`}
                animate={{ scaleY: [0.75, 1.3, 0.8], scaleX: [0.9, 1.15, 0.95] }}
                transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  d="M -7 0 C -6 -4, -5 -7, -4.5 -8 C -4 -5, -3 -3, -2 -6 C -1 -9, 0 -10, 1 -7 C 2 -4, 3 -7, 4 -9 C 5 -6, 6 -4, 7 0 Z"
                  fill={liquid.light}
                  opacity={0.85}
                />
                <circle cx="-4.5" cy="-8" r="0.9" fill="#ffffff" opacity={0.9} />
                <circle cx="-2" cy="-6" r="0.8" fill={liquid.light} />
                <circle cx="1" cy="-7" r="1.0" fill="#ffffff" opacity={0.95} />
                <circle cx="4" cy="-9" r="0.85" fill={liquid.light} />
              </motion.g>
            </svg>

            {/* 3.7 GLASS RIM MENISCUS BEAD (Oriented along the rim to seal the mouth) */}
            <div
              className="absolute z-40 rounded-full"
              style={{
                left: `${pourX}%`,
                top: `${pourY}%`,
                width: big ? 16 : 12,
                height: big ? 10 : 7.5,
                transform: "translate(-50%, -50%) rotate(-25deg)",
                background: `radial-gradient(ellipse at 40% 35%, ${liquid.light} 0%, ${liquid.color} 75%)`,
                boxShadow: `0 2px 6px ${liquid.color}66`,
              }}
            />

            {/* 3.8 IMPACT CONTACT SPOT FLARE */}
            <motion.div
              className="absolute z-40 rounded-full"
              style={{
                left: `${landX}%`,
                top: `${floorY}%`,
                width: big ? 18 : 14,
                height: big ? 9 : 7,
                x: "-50%",
                y: "-50%",
                background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${liquid.light} 55%, ${liquid.color} 90%)`,
                boxShadow: `0 0 10px ${liquid.light}aa`,
              }}
              animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 3.9 AIRBORNE SATELLITE TEARDROP DROPLETS (Gravitational acceleration in freefall) */}
            {airborneDrops.map((d) => (
              <motion.span
                key={`dr-${d.id}`}
                className="absolute z-30 pointer-events-none"
                style={{
                  width: d.size,
                  height: d.size * 1.35,
                  marginLeft: -d.size / 2,
                  marginTop: -d.size / 2,
                  background: glossy,
                  borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%",
                  boxShadow: `0 1px 3px ${liquid.color}55`,
                }}
                initial={{ left: `${pourX}%`, top: `${pourY}%`, opacity: 0.95 }}
                animate={{
                  left: [`${pourX}%`, `${pourX + d.outX}%`, `${landX + d.landOffset}%`],
                  top: [`${pourY}%`, `${pourY + dyTotal * 0.42}%`, `${floorY}%`],
                  opacity: [0.95, 1, 0],
                }}
                transition={{
                  duration: d.duration,
                  delay: d.delay,
                  repeat: Infinity,
                  repeatDelay: 0.12,
                  ease: "easeIn",
                }}
              />
            ))}

            {/* 3.10 IMPACT SPLASH FOUNTAIN BEADS (Upward & outward parabolic splash) */}
            {splashFountain.map((c) => (
              <motion.span
                key={`sp-${c.id}`}
                className="absolute z-30 rounded-full pointer-events-none"
                style={{
                  width: c.size,
                  height: c.size,
                  marginLeft: -c.size / 2,
                  marginTop: -c.size / 2,
                  background: glossy,
                  boxShadow: `0 1px 3px ${liquid.color}55`,
                }}
                initial={{ left: `${landX}%`, top: `${floorY}%`, opacity: 0 }}
                animate={{
                  left: [`${landX}%`, `${landX + c.dx * 0.55}%`, `${landX + c.dx}%`],
                  top: [`${floorY}%`, `${floorY - c.up}%`, `${floorY + 1}%`],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.25, 0.35],
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  repeat: Infinity,
                  repeatDelay: 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Spillable glass                               */
/* -------------------------------------------------------------------------- */

type SpillableGlassProps = {
  src: string;
  alt: string;
  liquid: DrinkLiquid;
  coords: DrinkCoordinates;
  big?: boolean;
  muted?: boolean;
  onSpill?: () => void;
  className?: string;
  showHint?: boolean;
};

export function SpillableGlass({
  src,
  alt,
  liquid,
  coords,
  big = false,
  muted = false,
  onSpill,
  className = "",
  showHint = true,
}: SpillableGlassProps) {
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  // State machine: isPouring (stream active) and puddleVisible (puddle present)
  const [isPouring, setIsPouring] = useState(false);
  const [puddleVisible, setPuddleVisible] = useState(false);
  const isBusyRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const spill = useCallback(() => {
    // Sound & tactile feedback
    if (!muted) {
      playGlassKnockSound();
      playPourPhysicsSound(liquid, big);
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate?.([20, 50, 20]);
      } catch {
        /* ignore */
      }
    }
    onSpill?.();

    // Clear previous timeouts if re-clicked
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    isBusyRef.current = true;
    setPuddleVisible(true);

    // Dynamic glass tilt timeline:
    // 0.00s - 0.06s: Anticipation dip (-2deg)
    // 0.06s - 0.18s: Rapid tip to 27deg (pivoting on bottom-right base corner)
    // 0.18s - 1.40s: HELD AT 27deg with reactive micro-vibrations from pouring liquid
    // 1.40s: Pour finishes
    // 1.42s - 1.76s: Returns upright with elastic overshoot (-3deg -> 1deg -> 0deg)
    if (!reduceMotion) {
      controls.stop();
      void controls.start({
        rotate: [0, -2, 27, 26.3, 27.4, 26.6, 27.1, 27, -3, 1, 0],
        x: [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        transition: {
          duration: 1.76,
          times: [0, 0.04, 0.12, 0.32, 0.52, 0.68, 0.78, 0.81, 0.90, 0.96, 1],
          ease: "easeInOut",
        },
      });
    }

    // Liquid stream turns ON at 180ms (as glass reaches full tilt)
    const tStart = window.setTimeout(() => {
      setIsPouring(true);
    }, 180);
    timersRef.current.push(tStart);

    // Liquid stream turns OFF at 1400ms (1.22s of pouring, cleanly before glass rights itself)
    const tEnd = window.setTimeout(() => {
      setIsPouring(false);
    }, 1400);
    timersRef.current.push(tEnd);

    // Table settle clack sound when glass base touches down (at 1.74s)
    const tClack = window.setTimeout(() => {
      if (!muted) playGlassSettleSound();
    }, 1740);
    timersRef.current.push(tClack);

    // Puddle stays visible on table, then dissolves smoothly at 2.7s
    const tPuddle = window.setTimeout(() => {
      setPuddleVisible(false);
      isBusyRef.current = false;
    }, 2700);
    timersRef.current.push(tPuddle);
  }, [big, controls, liquid, muted, onSpill, reduceMotion]);

  return (
    <div
      onClick={spill}
      aria-label={`Derramar ${alt}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          spill();
        }
      }}
      className={`group/glass relative block aspect-square w-full cursor-pointer select-none outline-none focus-visible:ring-4 focus-visible:ring-offset-4 rounded-3xl ${className}`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Ambient liquid glow behind the glass */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover/glass:scale-115 group-hover/glass:opacity-60 group-focus-visible/glass:opacity-60"
        style={{
          background: `radial-gradient(circle, ${liquid.glow || liquid.light} 0%, transparent 70%)`,
        }}
      />

      {/* Table contact shadow (shifts dynamically under the right pivot base when tilted) */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[92%] h-[6%] -translate-y-1/2 rounded-[50%] blur-md transition-all duration-300"
        style={{
          left: isPouring ? "60%" : "50%",
          width: isPouring ? "30%" : "44%",
          transform: "translateX(-50%)",
          background: isPouring ? "rgba(0, 0, 0, 0.28)" : "rgba(0, 0, 0, 0.18)",
        }}
      />

      {/* Synchronized Fluid Spill Overlay (Stream, Droplets, Splash, Puddle) */}
      <FluidSpillOverlay
        liquid={liquid}
        coords={coords}
        isPouring={isPouring}
        puddleVisible={puddleVisible}
        big={big}
      />

      {/* Glass Element with pivot transform */}
      <motion.div
        className="relative z-10 block h-full w-full"
        style={{ mixBlendMode: "multiply" }}
        whileHover={reduceMotion ? {} : { y: -6 }}
        whileTap={reduceMotion ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <motion.div
          className="block h-full w-full select-none"
          style={{ transformOrigin: coords.pivotOrigin }}
          animate={controls}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain select-none"
            style={{ filter: "contrast(1.15) brightness(1.08)" }}
          />
        </motion.div>
      </motion.div>

      {/* Interactive hover hint (cleanly hidden while pouring or when puddle is present) */}
      {showHint && !isPouring && !puddleVisible && (
        <span
          className="pointer-events-none absolute bottom-1 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover/glass:translate-y-0 md:group-hover/glass:opacity-100"
          style={{ color: "#1f1f1f" }}
        >
          <Droplets className="size-3.5 animate-bounce" style={{ color: liquid.color }} />
          Toque para derramar
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Drink card                                 */
/* -------------------------------------------------------------------------- */

type DrinkCardProps = {
  drink: DrinkItem;
  index: number;
  total: number;
  theme: DrinkTheme;
  added: boolean;
  quantity: number;
  muted: boolean;
  onAdd: (id: number, e: MouseEvent) => void;
  onOpen: (id: number) => void;
  onSpill: () => void;
};

function DrinkCard({
  drink,
  index,
  total,
  theme,
  added,
  quantity,
  muted,
  onAdd,
  onOpen,
  onSpill,
}: DrinkCardProps) {
  const col = index % 3;
  const isLastRow = index >= total - (total % 3 || 3);
  const borderClasses = [
    "border-b",
    col < 2 ? "md:border-r" : "",
    isLastRow ? "md:border-b-0" : "",
    index === total - 1 ? "border-b-0" : "",
  ].join(" ");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.08 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col p-6 md:p-8 lg:p-10 transition-colors duration-700 ${borderClasses}`}
      style={{ borderColor: theme.secondaryAlpha, backgroundColor: theme.bgLight }}
    >
      {/* Background radial tint on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 50% 100%, ${drink.liquid.light}35 0%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onOpen(drink.id)}
          className="text-left"
          aria-label={`Ver detalhes de ${drink.name}`}
        >
          {drink.tag && (
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors duration-700"
              style={{ backgroundColor: theme.secondary }}
            >
              {drink.tag}
            </span>
          )}
          <h3
            className="font-display text-2xl font-black uppercase leading-none transition-colors duration-700 lg:text-3xl"
            style={{ color: theme.secondary }}
          >
            {drink.title[0]}
            <br />
            {drink.title[1]}
          </h3>
        </button>

        <div className="flex flex-col items-end gap-1">
          <span
            className="font-display text-xl font-black leading-none transition-colors duration-700 lg:text-2xl"
            style={{ color: theme.primary }}
          >
            {formatBRL(drink.price)}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest opacity-60"
            style={{ color: theme.primary }}
          >
            {drink.volume}
          </span>
        </div>
      </div>

      <p
        className="relative mt-3 max-w-[90%] text-sm font-medium leading-snug opacity-70 transition-colors duration-700"
        style={{ color: theme.primary }}
      >
        {drink.description}
      </p>

      {/* Glass with Fluid Physics */}
      <div className="relative flex flex-1 items-center justify-center py-6">
        <div className="w-full max-w-[280px]">
          <SpillableGlass
            src={drink.image}
            alt={drink.name}
            liquid={drink.liquid}
            coords={drink.coords}
            muted={muted}
            onSpill={onSpill}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="relative flex items-center justify-between gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={(e) => onAdd(drink.id, e)}
          className="relative flex items-center gap-2 overflow-hidden rounded-full border-[2.5px] px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-colors duration-300"
          style={{
            borderColor: theme.secondary,
            backgroundColor: added ? theme.secondary : "transparent",
            color: added ? "#fff" : theme.secondary,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="size-4" /> Adicionado
              </motion.span>
            ) : (
              <motion.span
                key="order"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Plus className="size-4" /> Order now
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {quantity > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex h-8 min-w-8 items-center justify-center gap-1 rounded-full px-2 text-xs font-black text-white"
                style={{ backgroundColor: theme.primary }}
                aria-label={`${quantity} na sacola`}
              >
                <ShoppingBag className="size-3.5" />
                {quantity}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => onOpen(drink.id)}
            className="flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 hover:text-white"
            style={{ borderColor: theme.secondaryAlpha, color: theme.secondary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label={`Abrir ${drink.name}`}
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Drink grid                                 */
/* -------------------------------------------------------------------------- */

const MUTE_KEY = "fogo-chapa:drinks-muted";

function useMutedPreference() {
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    try {
      setMuted(window.localStorage.getItem(MUTE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);
  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  return [muted, toggle] as const;
}

type DrinkGridProps = {
  theme: DrinkTheme;
  cart: Record<number, number>;
  addedId: number | null;
  onAdd: (id: number, e?: MouseEvent) => void;
  onOpen: (id: number) => void;
  onViewMenu: () => void;
  drinks?: DrinkItem[];
};

export function DrinkGrid({
  theme,
  cart,
  addedId,
  onAdd,
  onOpen,
  onViewMenu,
  drinks = DRINK_SHOWCASE,
}: DrinkGridProps) {
  const [muted, toggleMuted] = useMutedPreference();
  const [spillCount, setSpillCount] = useState(0);
  const handleSpill = useCallback(() => setSpillCount((c) => c + 1), []);

  return (
    <section
      id="bebidas"
      aria-labelledby="drinks-grid-title"
      className="w-full border-t py-16 transition-colors duration-700 md:py-24"
      style={{ backgroundColor: theme.bgLight, borderColor: theme.secondaryAlpha }}
    >
      <div className="mx-auto max-w-[1400px] px-5 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <motion.h2
              id="drinks-grid-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl font-display text-5xl font-black uppercase leading-[0.85] tracking-tighter transition-colors duration-700 md:text-6xl lg:text-[5.5rem]"
              style={{ color: theme.secondary }}
            >
              DRINKS FOR
              <br />
              EVERYDAY
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex items-center gap-2 text-sm font-bold"
              style={{ color: theme.primary }}
            >
              <Sparkles className="size-4 animate-spin" style={{ animationDuration: "6s" }} />
              Clique em um copo para inclinar e derramar a bebida em tempo real!
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-3"
          >
            <AnimatePresence>
              {spillCount > 0 && (
                <motion.span
                  key="counter"
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="flex items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-xs font-black uppercase tracking-wider shadow-sm"
                  style={{ borderColor: theme.secondaryAlpha, color: theme.secondary }}
                  aria-live="polite"
                >
                  <Droplets className="size-4 animate-pulse" />
                  <motion.span
                    key={spillCount}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    {spillCount}
                  </motion.span>
                  {spillCount === 1 ? "copo derramado" : "copos derramados"}
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={toggleMuted}
              className="flex size-11 items-center justify-center rounded-full border-2 transition-transform duration-300 hover:scale-110"
              style={{ borderColor: theme.secondaryAlpha, color: theme.secondary }}
              aria-label={muted ? "Ativar som" : "Desativar som"}
              title={muted ? "Ativar som" : "Desativar som"}
            >
              {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>

            <button
              type="button"
              onClick={onViewMenu}
              className="group flex items-center gap-3 rounded-full border-[3px] px-6 py-3 text-sm font-black uppercase text-white shadow-lg transition-all duration-700 hover:shadow-xl"
              style={{ backgroundColor: theme.secondary, borderColor: theme.secondary }}
            >
              VIEW ALL MENU
              <ChevronRight
                className="size-5 rounded-full bg-white p-0.5 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: theme.secondary }}
              />
            </button>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {drinks.map((drink, index) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              index={index}
              total={drinks.length}
              theme={theme}
              added={addedId === drink.id}
              quantity={cart[drink.id] ?? 0}
              muted={muted}
              onAdd={(id, e) => onAdd(id, e)}
              onOpen={onOpen}
              onSpill={handleSpill}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Drink spotlight                               */
/* -------------------------------------------------------------------------- */

type DrinkSpotlightProps = {
  drinkId: number;
  theme: DrinkTheme;
  quantity: number;
  onClose: () => void;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  onNavigate?: (id: number) => void;
  drinks?: DrinkItem[];
};

export function DrinkSpotlight({
  drinkId,
  theme,
  quantity,
  onClose,
  onAdd,
  onRemove,
  onNavigate,
  drinks = DRINK_SHOWCASE,
}: DrinkSpotlightProps) {
  const index = drinks.findIndex((d) => d.id === drinkId);
  const drink = drinks[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!onNavigate) return;
      if (e.key === "ArrowRight") onNavigate(drinks[(index + 1) % drinks.length]!.id);
      if (e.key === "ArrowLeft") onNavigate(drinks[(index - 1 + drinks.length) % drinks.length]!.id);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [drinks, index, onClose, onNavigate]);

  if (!drink) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
      style={{ backgroundColor: "rgba(8, 3, 16, 0.75)" }}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drink-spotlight-title"
    >
      <motion.div
        key={drink.id}
        initial={{ y: 60, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[94vh] w-full max-w-5xl overflow-y-auto overflow-x-hidden rounded-[2rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.65)] md:grid-cols-[1.1fr_1fr] md:overflow-hidden md:rounded-[2.5rem]"
        style={{ backgroundColor: theme.bgLight }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 flex size-11 items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur transition-transform hover:rotate-90 hover:scale-110"
          style={{ color: theme.secondary }}
          aria-label="Fechar"
        >
          <X className="size-5" />
        </button>

        {/* Left — High-Res Interactive Physics Glass */}
        <div
          className="relative flex min-h-[360px] items-center justify-center overflow-hidden px-8 pb-10 pt-14 md:min-h-[560px]"
          style={{
            background: `radial-gradient(120% 90% at 40% 30%, #ffffff 0%, ${drink.liquid.light}55 55%, ${drink.liquid.color}33 100%)`,
          }}
        >
          {/* Ambient liquid glow */}
          <motion.div
            aria-hidden
            className="absolute size-72 rounded-full blur-3xl md:size-96"
            style={{ background: `${drink.liquid.light}77` }}
            animate={{
              scale: [1, 1.15, 1],
              borderRadius: [
                "40% 60% 70% 30% / 40% 50% 60% 50%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "40% 60% 70% 30% / 40% 50% 60% 50%",
              ],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <span
            aria-hidden
            className="pointer-events-none absolute -left-4 bottom-2 select-none font-display text-[7rem] font-black uppercase leading-none opacity-[0.07] md:text-[9rem]"
            style={{ color: drink.liquid.color }}
          >
            {drink.title[0]}
          </span>

          <div className="relative w-full max-w-[360px]">
            <SpillableGlass
              src={drink.image}
              alt={drink.name}
              liquid={drink.liquid}
              coords={drink.coords}
              big
            />
          </div>
        </div>

        {/* Right — Details & Order */}
        <div className="relative flex flex-col justify-center gap-6 p-7 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {drink.tag && (
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: theme.secondary }}
                >
                  {drink.tag}
                </span>
              )}
              <span
                className="rounded-full border-2 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest"
                style={{ borderColor: theme.secondaryAlpha, color: theme.secondary }}
              >
                {drink.volume}
              </span>
            </div>
            <h2
              id="drink-spotlight-title"
              className="font-display text-5xl font-black uppercase leading-[0.85] tracking-tighter md:text-6xl"
              style={{ color: theme.secondary }}
            >
              {drink.title[0]}
              <br />
              {drink.title[1]}
            </h2>
            <p
              className="mt-4 text-base font-medium leading-relaxed opacity-75"
              style={{ color: theme.primary }}
            >
              {drink.description}
            </p>
          </motion.div>

          <motion.ul
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
          >
            {drink.notes.map((note) => (
              <motion.li
                key={note}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm"
                style={{ color: theme.primary }}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: drink.liquid.color }} />
                {note}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col gap-4 border-t pt-6"
            style={{ borderColor: theme.secondaryAlpha }}
          >
            <div className="flex items-end justify-between">
              <div>
                <span
                  className="block text-[10px] font-black uppercase tracking-widest opacity-60"
                  style={{ color: theme.primary }}
                >
                  Preço
                </span>
                <span className="font-display text-4xl font-black leading-none" style={{ color: theme.primary }}>
                  {formatBRL(drink.price)}
                </span>
              </div>

              <div
                className="flex items-center gap-1 rounded-full border-2 p-1"
                style={{ borderColor: theme.secondaryAlpha }}
              >
                <button
                  type="button"
                  onClick={() => onRemove(drink.id)}
                  disabled={quantity === 0}
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 disabled:opacity-30"
                  style={{ color: theme.secondary }}
                  aria-label="Remover um"
                >
                  <Minus className="size-4" />
                </button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="w-7 text-center font-display text-lg font-black"
                  style={{ color: theme.secondary }}
                >
                  {quantity}
                </motion.span>
                <button
                  type="button"
                  onClick={() => onAdd(drink.id)}
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
                  style={{ color: theme.secondary }}
                  aria-label="Adicionar um"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAdd(drink.id)}
              className="flex w-full items-center justify-center gap-3 rounded-full py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg"
              style={{
                backgroundColor: theme.secondary,
                boxShadow: `0 14px 30px -10px ${theme.secondary}`,
              }}
            >
              <ShoppingBag className="size-5" />
              {quantity > 0
                ? `Adicionar mais • ${formatBRL(drink.price)}`
                : `Adicionar • ${formatBRL(drink.price)}`}
            </motion.button>

            {onNavigate && (
              <div className="flex items-center justify-between pt-1">
                {[-1, 1].map((dir) => {
                  const target = drinks[(index + dir + drinks.length) % drinks.length]!;
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => onNavigate(target.id)}
                      className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider opacity-60 transition-opacity hover:opacity-100 ${dir === 1 ? "flex-row-reverse" : ""}`}
                      style={{ color: theme.secondary }}
                    >
                      <ChevronRight className={`size-4 ${dir === -1 ? "rotate-180" : ""}`} />
                      {target.name}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
