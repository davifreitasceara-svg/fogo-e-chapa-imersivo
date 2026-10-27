import { useEffect, useRef } from "react";
import type { DrinkCoordinates, DrinkLiquid } from "./DrinkGrid";

export type LiquidSpillCanvasProps = {
  liquid: DrinkLiquid;
  coords: DrinkCoordinates;
  isPouring: boolean;
  puddleVisible: boolean;
  big?: boolean;
};

// Color parsing helper
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbaStr(hex: string, alpha = 1): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

// Ballistic splash droplet particle with velocity-aligned motion stretch
interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

// Internal stream traveling bubble / pulp particle
interface StreamBead {
  phase: number;
  speed: number;
  lateralOffset: number;
  r: number;
}

// Carbonation micro-bubble / foam bead
interface FoamBubble {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
}

// Fixed satellite spatter bead around the puddle
interface SpatterBead {
  angle: number;
  distFactor: number;
  r: number;
}

export function LiquidSpillCanvas({
  liquid,
  coords,
  isPouring,
  puddleVisible,
  big = false,
}: LiquidSpillCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Timing refs for smooth state transitions
  const isPouringRef = useRef(isPouring);
  isPouringRef.current = isPouring;
  const puddleVisibleRef = useRef(puddleVisible);
  puddleVisibleRef.current = puddleVisible;

  const pourStartRef = useRef<number | null>(null);
  const pourStopRef = useRef<number | null>(null);
  const fadeStartRef = useRef<number | null>(null);

  const isRunningRef = useRef(false);
  const startLoopRef = useRef<() => void>(() => {});

  // Handle isPouring transition
  useEffect(() => {
    if (isPouring) {
      pourStartRef.current = performance.now();
      pourStopRef.current = null;
      fadeStartRef.current = null;
      startLoopRef.current();
    } else if (pourStartRef.current !== null && pourStopRef.current === null) {
      pourStopRef.current = performance.now();
    }
  }, [isPouring]);

  // Handle puddleVisible transition
  useEffect(() => {
    if (puddleVisible) {
      fadeStartRef.current = null;
      startLoopRef.current();
    } else if (pourStartRef.current !== null && fadeStartRef.current === null) {
      fadeStartRef.current = performance.now();
      startLoopRef.current();
    }
  }, [puddleVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number = 0;
    const particles: SplashParticle[] = [];
    const bubbles: FoamBubble[] = [];

    // Organic satellite spatter beads around puddle with natural distribution
    const spatterBeads: SpatterBead[] = [
      { angle: 0.18, distFactor: 1.18, r: 2.8 },
      { angle: 0.72, distFactor: 1.28, r: 1.9 },
      { angle: 1.45, distFactor: 1.15, r: 3.2 },
      { angle: 2.15, distFactor: 1.34, r: 2.1 },
      { angle: 2.85, distFactor: 1.22, r: 2.6 },
      { angle: 3.55, distFactor: 1.30, r: 1.7 },
      { angle: 4.25, distFactor: 1.24, r: 2.3 },
      { angle: 4.95, distFactor: 1.16, r: 3.0 },
      { angle: 5.55, distFactor: 1.29, r: 1.8 },
      { angle: 5.95, distFactor: 1.21, r: 2.4 },
    ];

    // Internal fluid beads rushing through the stream current (pulp/carbonation)
    const streamBeads: StreamBead[] = [
      { phase: 0.08, speed: 1.8, lateralOffset: -0.22, r: 1.8 },
      { phase: 0.24, speed: 2.2, lateralOffset: 0.18, r: 1.5 },
      { phase: 0.42, speed: 1.9, lateralOffset: -0.12, r: 2.2 },
      { phase: 0.58, speed: 2.4, lateralOffset: 0.25, r: 1.6 },
      { phase: 0.76, speed: 2.0, lateralOffset: -0.18, r: 2.0 },
      { phase: 0.91, speed: 2.3, lateralOffset: 0.12, r: 1.7 },
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle Resize & DPR for ultra-crisp fluid rendering without mobile lag
      const rect = container.getBoundingClientRect();
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (targetW <= 0 || targetH <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const W = rect.width;
      const H = rect.height;

      // Coordinate mapping relative to the glass box
      // Container bounds: left: -15%, top: -10%, width: 170%, height: 125%
      const boxW = W / 1.7;
      const boxH = H / 1.25;
      const boxX = boxW * 0.15;
      const boxY = boxH * 0.10;

      const pourX = boxX + (coords.pourX / 100) * boxW;
      const pourY = boxY + (coords.pourY / 100) * boxH;
      // No mobile, puxa o ponto de aterrissagem do líquido para mais perto do copo (1.04x em vez de 1.30x) para não vazar da tela do celular!
      const landRatio = isMobile ? (big ? 1.06 : 1.02) : (coords.landX / 100);
      const landX = boxX + Math.min(coords.landX / 100, landRatio) * boxW;
      const floorY = boxY + (coords.floorY / 100) * boxH;

      const dxTotal = landX - pourX;
      const dyTotal = floorY - pourY;

      // Master Opacity (dissolves cleanly when puddleVisible turns false)
      let globalAlpha = 1;
      if (fadeStartRef.current !== null) {
        const fadeElapsed = (now - fadeStartRef.current) / 1000;
        globalAlpha = Math.max(0, 1 - fadeElapsed / 0.55);
      }
      ctx.globalAlpha = globalAlpha;

      const activePour = isPouringRef.current;
      const activePuddle =
        puddleVisibleRef.current || (fadeStartRef.current !== null && globalAlpha > 0);

      // Puddle growth progress: expands smoothly as liquid enters
      let puddleGrow = 0;
      if (pourStartRef.current !== null) {
        const pourElapsed = (now - pourStartRef.current) / 1000;
        puddleGrow = Math.min(1, Math.max(0, (pourElapsed - 0.04) * 2.2));
      }

      const puddleRx = (big ? 86 : 66) * (0.12 + 0.88 * puddleGrow);
      const puddleRy = puddleRx * 0.28;

      /* ====================================================================== */
      /*  1. HYPER-REALISTIC ORGANIC VISCOUS PUDDLE                             */
      /* ====================================================================== */
      if (activePuddle && puddleGrow > 0.02) {
        ctx.save();

        const steps = 60;

        // 1.1 Soft photographic ambient contact shadow under puddle (no harsh outline)
        ctx.save();
        const shadowGrad = ctx.createRadialGradient(
          landX,
          floorY + 2.5,
          puddleRx * 0.15,
          landX,
          floorY + 2.5,
          puddleRx * 1.15,
        );
        shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.24)");
        shadowGrad.addColorStop(0.35, "rgba(0, 0, 0, 0.12)");
        shadowGrad.addColorStop(0.70, "rgba(0, 0, 0, 0.04)");
        shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.beginPath();
        ctx.ellipse(landX, floorY + 2.5, puddleRx * 1.15, puddleRy * 1.20, 0, 0, Math.PI * 2);
        ctx.fillStyle = shadowGrad;
        ctx.fill();
        ctx.restore();

        // 1.2 Viscous puddle body with multi-stop radial optical depth & Beer-Lambert absorption
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const perturb =
            1 +
            0.10 * Math.cos(2 * theta - 0.4) +
            0.06 * Math.cos(3 * theta + 1.2) +
            0.03 * Math.sin(5 * theta - 0.7);
          const px = landX + puddleRx * perturb * Math.cos(theta);
          const py = floorY + puddleRy * perturb * Math.sin(theta);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const pGrad = ctx.createRadialGradient(
          landX - puddleRx * 0.14,
          floorY - puddleRy * 0.28,
          puddleRx * 0.04,
          landX,
          floorY,
          puddleRx * 1.06,
        );
        pGrad.addColorStop(0, rgbaStr(liquid.glow || liquid.light, 0.98));
        pGrad.addColorStop(0.24, rgbaStr(liquid.light, 0.95));
        pGrad.addColorStop(0.64, rgbaStr(liquid.color, 0.98));
        pGrad.addColorStop(0.92, rgbaStr(liquid.color, 0.95));
        pGrad.addColorStop(1, rgbaStr(liquid.color, 0.82));

        ctx.fillStyle = pGrad;
        ctx.fill();

        // 1.3 Viscous Meniscus Bead: Delicate surface tension reflection along upper perimeter only
        ctx.save();
        ctx.beginPath();
        // Upper light-catching arc (-160° to +20°)
        for (let i = Math.floor(steps * 0.45); i <= Math.floor(steps * 0.95); i++) {
          const theta = (i / steps) * Math.PI * 2;
          const perturb =
            1 +
            0.10 * Math.cos(2 * theta - 0.4) +
            0.06 * Math.cos(3 * theta + 1.2) +
            0.03 * Math.sin(5 * theta - 0.7);
          const px = landX + (puddleRx - 0.8) * perturb * Math.cos(theta);
          const py = floorY + (puddleRy - 0.5) * perturb * Math.sin(theta);
          if (i === Math.floor(steps * 0.45)) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const rimGrad = ctx.createLinearGradient(
          landX - puddleRx * 0.5,
          floorY - puddleRy,
          landX + puddleRx * 0.5,
          floorY,
        );
        rimGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        rimGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.75)");
        rimGrad.addColorStop(0.7, rgbaStr(liquid.light, 0.6));
        rimGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = rimGrad;
        ctx.stroke();
        ctx.restore();

        // 1.4 Wet Surface Glare (Curved specular studio reflection on fluid surface)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          landX - puddleRx * 0.22,
          floorY - puddleRy * 0.26,
          puddleRx * 0.40,
          puddleRy * 0.30,
          -0.18,
          0,
          Math.PI * 2,
        );
        const glareGrad = ctx.createLinearGradient(
          landX - puddleRx * 0.45,
          floorY - puddleRy * 0.48,
          landX,
          floorY,
        );
        glareGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        glareGrad.addColorStop(0.40, "rgba(255, 255, 255, 0.22)");
        glareGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = glareGrad;
        ctx.fill();
        ctx.restore();

        // 1.5 Concentric capillary wave ripples radiating from stream touchdown
        if (activePour) {
          const tRipple = now / 1000;
          for (let rIdx = 0; rIdx < 3; rIdx++) {
            const phase = (tRipple * 1.6 + rIdx * 0.33) % 1;
            const rWave = phase * (puddleRx * 0.90);
            if (rWave > 4) {
              const alphaWave = (1 - phase) * 0.42;
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(landX, floorY, rWave, rWave * 0.28, 0, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 255, 255, ${alphaWave})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
              ctx.restore();
            }
          }
        }

        // 1.6 Glistening 3D satellite spatter droplets
        for (const bead of spatterBeads) {
          const bdistX = puddleRx * bead.distFactor;
          const bdistY = puddleRy * bead.distFactor;
          const bx = landX + bdistX * Math.cos(bead.angle);
          const by = floorY + bdistY * Math.sin(bead.angle);
          const br = bead.r;

          // Droplet shadow
          ctx.beginPath();
          ctx.ellipse(bx + 0.5, by + br * 0.35, br * 0.95, br * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
          ctx.fill();

          // Droplet body with spherical lens gradient
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          const beadGrad = ctx.createRadialGradient(
            bx - br * 0.35,
            by - br * 0.35,
            br * 0.1,
            bx,
            by,
            br,
          );
          beadGrad.addColorStop(0, rgbaStr(liquid.glow || liquid.light, 1));
          beadGrad.addColorStop(0.65, rgbaStr(liquid.color, 1));
          beadGrad.addColorStop(1, rgbaStr(liquid.color, 0.85));
          ctx.fillStyle = beadGrad;
          ctx.fill();

          // Specular glint dot at 10 o'clock
          ctx.beginPath();
          ctx.arc(bx - br * 0.35, by - br * 0.35, br * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
        }

        ctx.restore(); // end puddle body
        ctx.restore(); // end puddle
      }

      /* ====================================================================== */
      /*  2. 3D CYLINDRICAL VISCOUS STREAM (Fluid Mechanics & Optical Caustics) */
      /* ====================================================================== */
      let sHead = 0;
      let sTail = 0;

      if (pourStartRef.current !== null) {
        const pourElapsed = (now - pourStartRef.current) / 1000;
        sHead = Math.min(1, pourElapsed / 0.06);
      }
      if (pourStopRef.current !== null) {
        const drainElapsed = (now - pourStopRef.current) / 1000;
        sTail = Math.min(1, drainElapsed / 0.14);
      }

      const streamActive = (activePour || sTail < 1) && sHead > sTail;

      if (streamActive) {
        ctx.save();

        const tFlow = now / 1000;
        const baseWidth = big ? 23 : 17.5;

        // Projectile Bézier control points:
        // Leaves glass rim along tangential tilt vector with forward momentum, accelerating down with gravity
        const p0x = pourX;
        const p0y = pourY;
        const p1x = pourX + dxTotal * 0.36;
        const p1y = pourY + dyTotal * 0.05; // rapid initial outward ejection arc
        const p2x = landX - dxTotal * 0.04;
        const p2y = floorY - dyTotal * 0.44; // steep downward acceleration
        const p3x = landX;
        const p3y = floorY;

        // Evaluate Bézier point, tangent & normal at parameter s
        const getSpline = (s: number) => {
          const inv = 1 - s;
          const inv2 = inv * inv;
          const inv3 = inv2 * inv;
          const s2 = s * s;
          const s3 = s2 * s;

          const bx = inv3 * p0x + 3 * inv2 * s * p1x + 3 * inv * s2 * p2x + s3 * p3x;
          const by = inv3 * p0y + 3 * inv2 * s * p1y + 3 * inv * s2 * p2y + s3 * p3y;

          // Tangent derivative
          const dx =
            3 * inv2 * (p1x - p0x) + 6 * inv * s * (p2x - p1x) + 3 * s2 * (p3x - p2x);
          const dy =
            3 * inv2 * (p1y - p0y) + 6 * inv * s * (p2y - p1y) + 3 * s2 * (p3y - p2y);
          const len = Math.hypot(dx, dy) || 1;

          // Normal perpendicular vector
          const nx = -dy / len;
          const ny = dx / len;

          // Capillary Rayleigh-Plateau wave undulation traveling down the stream
          const wave =
            (1.6 * Math.sin(28 * s - 34 * tFlow) + 0.7 * Math.sin(56 * s - 68 * tFlow)) *
            s *
            Math.pow(1 - s, 0.45);

          const cx = bx + nx * wave;
          const cy = by + ny * wave;

          // Fluid continuity necking: stream tapers in freefall as velocity increases (A*v = const)
          // Near impact, decelerates and splays outward
          const taper = 0.54 + 0.46 * Math.pow(1 - s, 0.75);
          const impactFlare = s > 0.82 ? 1 + 0.85 * Math.pow((s - 0.82) / 0.18, 2) : 1;
          const flowBreathe = 1 + 0.08 * Math.cos(22 * s - 28 * tFlow);

          const w = baseWidth * taper * impactFlare * flowBreathe;

          return { x: cx, y: cy, nx, ny, w };
        };

        const numSteps = 50;
        const startIndex = Math.floor(sTail * numSteps);
        const endIndex = Math.ceil(sHead * numSteps);

        const leftPts: { x: number; y: number }[] = [];
        const rightPts: { x: number; y: number }[] = [];
        const centerPts: { x: number; y: number; w: number }[] = [];
        const innerLeftPts: { x: number; y: number }[] = [];
        const innerRightPts: { x: number; y: number }[] = [];

        for (let i = startIndex; i <= endIndex; i++) {
          const s = Math.min(sHead, Math.max(sTail, i / numSteps));
          const pt = getSpline(s);
          centerPts.push({ x: pt.x, y: pt.y, w: pt.w });
          leftPts.push({ x: pt.x - pt.nx * (pt.w * 0.5), y: pt.y - pt.ny * (pt.w * 0.5) });
          rightPts.push({ x: pt.x + pt.nx * (pt.w * 0.5), y: pt.y + pt.ny * (pt.w * 0.5) });
          // Inner core ribbon (70% width for volumetric optical depth)
          innerLeftPts.push({ x: pt.x - pt.nx * (pt.w * 0.35), y: pt.y - pt.ny * (pt.w * 0.35) });
          innerRightPts.push({ x: pt.x + pt.nx * (pt.w * 0.35), y: pt.y + pt.ny * (pt.w * 0.35) });
        }

        const firstLeft = leftPts[0];
        const firstRight = rightPts[0];
        const firstCenter = centerPts[0];

        if (firstLeft && firstRight && firstCenter && centerPts.length >= 2) {
          // 2.0 In-Glass Fluid Reservoir & Overflow Crest (ZERO GAP GUARANTEE)
          // Renders a smooth, rounded bulb welling up from inside the rim and spilling over
          if (sTail < 0.15) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(
              pourX - baseWidth * 0.28,
              pourY + baseWidth * 0.10,
              baseWidth * 0.85,
              baseWidth * 0.56,
              0.40,
              0,
              Math.PI * 2,
            );
            const tongueGrad = ctx.createRadialGradient(
              pourX - baseWidth * 0.42,
              pourY,
              2,
              pourX - baseWidth * 0.28,
              pourY + baseWidth * 0.10,
              baseWidth * 0.85,
            );
            tongueGrad.addColorStop(0, rgbaStr(liquid.glow || liquid.light, 0.98));
            tongueGrad.addColorStop(0.35, rgbaStr(liquid.light, 0.96));
            tongueGrad.addColorStop(0.85, rgbaStr(liquid.color, 0.94));
            tongueGrad.addColorStop(1, rgbaStr(liquid.color, 0.80));
            ctx.fillStyle = tongueGrad;
            ctx.fill();

            // Specular fluid crest glint over the rim
            ctx.beginPath();
            ctx.ellipse(
              pourX - baseWidth * 0.15,
              pourY + baseWidth * 0.05,
              baseWidth * 0.45,
              baseWidth * 0.20,
              0.35,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.70)";
            ctx.fill();
            ctx.restore();
          }

          // 2.1 Ambient Soft Drop Shadow behind falling stream
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(firstLeft.x + 3, firstLeft.y + 4);
          for (let i = 1; i < leftPts.length; i++) {
            const lp = leftPts[i]!;
            ctx.lineTo(lp.x + 3, lp.y + 4);
          }
          for (let i = rightPts.length - 1; i >= 0; i--) {
            const rp = rightPts[i]!;
            ctx.lineTo(rp.x + 3, rp.y + 4);
          }
          ctx.closePath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
          ctx.fill();
          ctx.restore();

          // 2.2 Volumetric Fluid Outer Sheath (Cylindrical Liquid Layer)
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(firstLeft.x, firstLeft.y);
          for (let i = 1; i < leftPts.length; i++) {
            const lp = leftPts[i]!;
            ctx.lineTo(lp.x, lp.y);
          }
          for (let i = rightPts.length - 1; i >= 0; i--) {
            const rp = rightPts[i]!;
            ctx.lineTo(rp.x, rp.y);
          }
          ctx.closePath();

          const streamGrad = ctx.createLinearGradient(pourX, pourY, landX, floorY);
          streamGrad.addColorStop(0, rgbaStr(liquid.light, 0.96));
          streamGrad.addColorStop(0.20, rgbaStr(liquid.light, 0.94));
          streamGrad.addColorStop(0.60, rgbaStr(liquid.color, 0.98));
          streamGrad.addColorStop(0.92, rgbaStr(liquid.color, 0.96));
          streamGrad.addColorStop(1, rgbaStr(liquid.glow || liquid.light, 0.94));

          ctx.fillStyle = streamGrad;
          ctx.fill();
          ctx.restore();

          // 2.3 Dense Luminous Core (Simulating 3D Cylindrical Light Concentration)
          ctx.save();
          ctx.beginPath();
          const firstInnerLeft = innerLeftPts[0]!;
          ctx.moveTo(firstInnerLeft.x, firstInnerLeft.y);
          for (let i = 1; i < innerLeftPts.length; i++) {
            const lp = innerLeftPts[i]!;
            ctx.lineTo(lp.x, lp.y);
          }
          for (let i = innerRightPts.length - 1; i >= 0; i--) {
            const rp = innerRightPts[i]!;
            ctx.lineTo(rp.x, rp.y);
          }
          ctx.closePath();

          const coreGrad = ctx.createLinearGradient(pourX, pourY, landX, floorY);
          coreGrad.addColorStop(0, rgbaStr(liquid.glow || liquid.light, 0.85));
          coreGrad.addColorStop(0.25, rgbaStr(liquid.light, 0.80));
          coreGrad.addColorStop(0.65, rgbaStr(liquid.color, 0.90));
          coreGrad.addColorStop(1, rgbaStr(liquid.glow || liquid.light, 0.85));

          ctx.fillStyle = coreGrad;
          ctx.fill();
          ctx.restore();

          // 2.4 Internal Caustic Beam (Light passing through curved cylindrical liquid lens)
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(firstCenter.x, firstCenter.y);
          for (let i = 1; i < centerPts.length; i++) {
            const cp = centerPts[i]!;
            ctx.lineTo(cp.x, cp.y);
          }
          ctx.lineWidth = baseWidth * 0.38;
          ctx.lineCap = "round";
          ctx.strokeStyle = rgbaStr(liquid.glow || liquid.light, 0.55);
          ctx.stroke();
          ctx.restore();

          // 2.5 High-Gloss Specular Ridge (Wet Studio Reflection along Upper Surface)
          // Feathers smoothly with the fluid trajectory
          ctx.save();
          ctx.beginPath();
          const sheenOffset = 0.76;
          ctx.moveTo(
            firstCenter.x + (firstRight.x - firstCenter.x) * sheenOffset,
            firstCenter.y + (firstRight.y - firstCenter.y) * sheenOffset,
          );
          for (let i = 1; i < centerPts.length; i++) {
            const cp = centerPts[i]!;
            const rp = rightPts[i]!;
            ctx.lineTo(
              cp.x + (rp.x - cp.x) * sheenOffset,
              cp.y + (rp.y - cp.y) * sheenOffset,
            );
          }
          const sheenGrad = ctx.createLinearGradient(pourX, pourY, landX, floorY);
          sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.90)");
          sheenGrad.addColorStop(0.30, "rgba(255, 255, 255, 0.70)");
          sheenGrad.addColorStop(0.70, "rgba(255, 255, 255, 0.30)");
          sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.lineWidth = big ? 2.2 : 1.7;
          ctx.lineCap = "round";
          ctx.strokeStyle = sheenGrad;
          ctx.stroke();
          ctx.restore();

          // 2.6 Internal Fluid Beads / Pulp / Carbonation (Adds Realistic Depth & Life!)
          ctx.save();
          for (const bead of streamBeads) {
            const beadS = (tFlow * bead.speed + bead.phase) % 1;
            if (beadS >= sTail && beadS <= sHead) {
              const pt = getSpline(beadS);
              const bx = pt.x + pt.nx * (pt.w * bead.lateralOffset);
              const by = pt.y + pt.ny * (pt.w * bead.lateralOffset);
              const br = bead.r * (0.8 + 0.4 * Math.sin(beadS * Math.PI));

              ctx.beginPath();
              ctx.arc(bx, by, br, 0, Math.PI * 2);
              ctx.fillStyle = rgbaStr(liquid.glow || liquid.light, 0.75);
              ctx.fill();

              // Micro specular highlight
              ctx.beginPath();
              ctx.arc(bx - br * 0.3, by - br * 0.3, br * 0.35, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
              ctx.fill();
            }
          }
          ctx.restore();

          // 2.7 Sliding Glint Highlights (Light nodes sliding down with the current)
          ctx.save();
          for (let g = 0; g < 3; g++) {
            const glintS = (tFlow * 2.3 + g * 0.35) % 0.88;
            if (glintS >= sTail && glintS <= sHead) {
              const gpt = getSpline(glintS);
              const gx = gpt.x + gpt.nx * (gpt.w * 0.30);
              const gy = gpt.y + gpt.ny * (gpt.w * 0.30);
              ctx.beginPath();
              ctx.arc(gx, gy, big ? 2.2 : 1.7, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
              ctx.fill();
            }
          }
          ctx.restore();
        }

        // 2.8 Pinch-off Breakup: Trailing falling droplets when stream ends
        if (sTail > 0.30 && sTail < 1) {
          ctx.save();
          const numPinch = 3;
          for (let d = 0; d < numPinch; d++) {
            const dropS = Math.min(1, sTail + (d + 1) * 0.12);
            if (dropS <= sHead) {
              const dpt = getSpline(dropS);
              const dr = (big ? 2.8 : 2.2) * (1 - d * 0.18);
              ctx.beginPath();
              ctx.arc(dpt.x, dpt.y, dr, 0, Math.PI * 2);
              ctx.fillStyle = rgbaStr(liquid.color, 0.95);
              ctx.fill();
              // Glint
              ctx.beginPath();
              ctx.arc(dpt.x - dr * 0.3, dpt.y - dr * 0.3, dr * 0.4, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
              ctx.fill();
            }
          }
          ctx.restore();
        }

        ctx.restore(); // end stream
      }

      /* ====================================================================== */
      /*  3. IMPACT HYDRODYNAMICS: SPLASH CROWN, FOAM & BALLISTIC DROPLETS     */
      /* ====================================================================== */
      const isImpacting = streamActive && sHead >= 0.88;

      // 3.1 Dynamic Splash Crown (Coronet of high-speed fluid erupting at impact)
      if (isImpacting) {
        ctx.save();
        const tCrown = now / 1000;
        const crownR = big ? 16 : 13;
        const numSpikes = 8;

        ctx.beginPath();
        for (let i = 0; i <= numSpikes; i++) {
          const frac = i / numSpikes;
          const angle = -Math.PI / 2 + (frac - 0.5) * 1.9;
          const spikeH =
            (big ? 18 : 14) * (0.75 + 0.35 * Math.sin(tCrown * 30 + i * 2.2));

          const cx = landX + crownR * Math.cos(angle);
          const cy = floorY + crownR * 0.28 * Math.sin(angle);
          const tipX = cx + Math.cos(angle) * (spikeH * 0.55);
          const tipY = cy - spikeH;

          if (i === 0) ctx.moveTo(tipX, tipY);
          else ctx.lineTo(tipX, tipY);
        }
        ctx.lineTo(landX + crownR, floorY);
        ctx.lineTo(landX - crownR, floorY);
        ctx.closePath();

        const crownGrad = ctx.createLinearGradient(
          landX,
          floorY - (big ? 20 : 16),
          landX,
          floorY,
        );
        crownGrad.addColorStop(0, "rgba(255, 255, 255, 0.92)");
        crownGrad.addColorStop(0.38, rgbaStr(liquid.glow || liquid.light, 0.90));
        crownGrad.addColorStop(1, rgbaStr(liquid.color, 0.82));
        ctx.fillStyle = crownGrad;
        ctx.fill();

        // Glistening droplet tips on crown spikes
        for (let i = 0; i < numSpikes; i++) {
          const frac = i / numSpikes;
          const angle = -Math.PI / 2 + (frac - 0.5) * 1.9;
          const spikeH =
            (big ? 18 : 14) * (0.75 + 0.35 * Math.sin(tCrown * 30 + i * 2.2));
          const cx = landX + crownR * Math.cos(angle);
          const cy = floorY + crownR * 0.28 * Math.sin(angle);
          const tipX = cx + Math.cos(angle) * (spikeH * 0.55);
          const tipY = cy - spikeH;

          ctx.beginPath();
          ctx.arc(tipX, tipY, big ? 1.6 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
        }

        ctx.restore();
      }

      // 3.2 Spawn & Simulate Ballistic Splash Droplets
      if (isImpacting) {
        // Spawn 2-3 droplets per frame for rich fluid spray
        const count = Math.random() < 0.75 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const speedScale = big ? 1.25 : 1.05;
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.7;
          const speed = (95 + Math.random() * 165) * speedScale;
          particles.push({
            x: landX + (Math.random() - 0.5) * 6,
            y: floorY + (Math.random() - 0.5) * 3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: 1.2 + Math.random() * (big ? 3.0 : 2.4),
            alpha: 1,
            life: 0,
            maxLife: 0.38 + Math.random() * 0.25,
            color: Math.random() > 0.4 ? liquid.light : liquid.color,
          });
        }

        // Spawn carbonation micro-bubbles if soda, beer, or sparkling drink
        if (liquid.foam && Math.random() < 0.85) {
          bubbles.push({
            x: landX + (Math.random() - 0.5) * (puddleRx * 0.5),
            y: floorY + (Math.random() - 0.5) * (puddleRy * 0.6),
            r: 1.2 + Math.random() * 2.6,
            vx: (Math.random() - 0.5) * 8,
            vy: -(8 + Math.random() * 15),
            alpha: 1,
            life: 0,
            maxLife: 0.55 + Math.random() * 0.4,
          });
        }
      }

      // Update & Draw Splash Particles with motion-stretch velocity elongation
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Gravity & air drag
        p.vy += 640 * dt;
        p.vx *= 0.982;
        p.vy *= 0.982;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Disappear if hits table floor
        if (p.y >= floorY + 3.5 && p.vy > 0) {
          particles.splice(i, 1);
          continue;
        }

        const lifeFrac = p.life / p.maxLife;
        p.alpha = Math.max(0, 1 - lifeFrac * 0.8);

        // Motion-stretch elongation along velocity vector
        const speed = Math.hypot(p.vx, p.vy);
        const stretch = Math.min(speed / 120, 2.0);
        const dir = Math.atan2(p.vy, p.vx);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(dir);
        ctx.scale(1 + stretch, 1);

        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fillStyle = rgbaStr(p.color, p.alpha);
        ctx.fill();

        // Droplet specular highlight
        ctx.beginPath();
        ctx.arc(-p.r * 0.25, -p.r * 0.25, p.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.fill();

        ctx.restore();
      }

      // Update & Draw Carbonation Foam Bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (!b) continue;
        b.life += dt;
        if (b.life >= b.maxLife) {
          bubbles.splice(i, 1);
          continue;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.alpha = 1 - b.life / b.maxLife;

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = rgbaStr(liquid.foam || "#fff5ea", b.alpha * 0.9);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.95})`;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // restore dpr scale

      // Continue animation loop as long as pouring, puddle, or particles exist
      if (
        activePour ||
        activePuddle ||
        streamActive ||
        particles.length > 0 ||
        bubbles.length > 0
      ) {
        animId = requestAnimationFrame(render);
      } else {
        isRunningRef.current = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    startLoopRef.current = startLoop;

    if (isPouringRef.current || puddleVisibleRef.current) {
      startLoop();
    }

    return () => {
      cancelAnimationFrame(animId);
      isRunningRef.current = false;
    };
  }, [big, coords, liquid]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute select-none"
      style={{
        left: "-15%",
        top: "-10%",
        width: "170%",
        height: "125%",
        zIndex: 30,
      }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
