import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface AnimatedBrandLogoProps {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  href?: string;
}

const STEAM_PUFFS = [
  { id: 1, x: 24, delay: 0.45, scale: 0.9, drift: -6 },
  { id: 2, x: 68, delay: 0.85, scale: 1.1, drift: 5 },
  { id: 3, x: 112, delay: 1.35, scale: 0.95, drift: -4 },
  { id: 4, x: 158, delay: 1.8, scale: 1.15, drift: 7 },
  { id: 5, x: 202, delay: 2.25, scale: 1.0, drift: -5 },
  { id: 6, x: 236, delay: 2.65, scale: 1.2, drift: 8 },
];

const SIZZLE_DROPS = [
  { id: 1, x: 32, y: -20, drift: -10, delay: 0.5, color: "#ea580c" },
  { id: 2, x: 46, y: -26, drift: 6, delay: 0.56, color: "#fbbf24" },
  { id: 3, x: 56, y: -22, drift: 10, delay: 0.62, color: "#f59e0b" },
  { id: 4, x: 108, y: -28, drift: -7, delay: 1.38, color: "#fbbf24" },
  { id: 5, x: 124, y: -24, drift: 9, delay: 1.46, color: "#ea580c" },
  { id: 6, x: 176, y: -24, drift: -8, delay: 2.02, color: "#dc2626" },
  { id: 7, x: 204, y: -26, drift: 8, delay: 2.35, color: "#f59e0b" },
  { id: 8, x: 226, y: -30, drift: 13, delay: 2.66, color: "#ea580c" },
  { id: 9, x: 238, y: -24, drift: 16, delay: 2.74, color: "#fbbf24" },
];

const CHAPA_FLAME_LICKS = [
  { id: 1, left: "7%", delay: 0.48 },
  { id: 2, left: "24%", delay: 0.86 },
  { id: 3, left: "45%", delay: 1.32 },
  { id: 4, left: "65%", delay: 1.78 },
  { id: 5, left: "83%", delay: 2.24 },
];

export function AnimatedBrandLogo({ onClick, href = "#inicio" }: AnimatedBrandLogoProps) {
  const { user } = useAuth();
  const [animKey, setAnimKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Trigger animation when user logs in or logs out
  useEffect(() => {
    if (user?.id) {
      setAnimKey((prev) => prev + 1);
    }
  }, [user?.id]);

  useEffect(() => {
    setIsPlaying(true);
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, 5400);
    return () => clearTimeout(timer);
  }, [animKey]);

  const triggerReplay = () => {
    if (!isPlaying) {
      setAnimKey((prev) => prev + 1);
    }
  };

  const fogoChars = ["F", "O", "G", "O"];
  const chapaChars = ["C", "H", "A", "P", "A"];

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={triggerReplay}
      className="group relative inline-flex items-center gap-2.5 sm:gap-3.5 py-1 pr-3 select-none cursor-pointer focus:outline-none"
      aria-label="Fogo e Chapa - Início"
    >
      <style>{`
        @keyframes crestFlameFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          33% { transform: scaleY(1.06) scaleX(0.96) skewX(-1.5deg); }
          66% { transform: scaleY(0.96) scaleX(1.04) skewX(1.5deg); }
        }
        @keyframes innerTongueDance {
          0%, 100% { transform: scaleY(1) translateY(0px); }
          50% { transform: scaleY(1.1) translateY(-1px); }
        }
        @keyframes burgerLayersExplode {
          0%, 18%, 32%, 62%, 92%, 100% { transform: translateY(0px); }
          24% { transform: translateY(-4.5px); }
          76% { transform: translateY(-5.5px); }
        }
        @keyframes burgerBottomLayer {
          0%, 18%, 32%, 62%, 92%, 100% { transform: translateY(0px); }
          24% { transform: translateY(3.5px); }
          76% { transform: translateY(4.5px); }
        }
        .animate-crest-flame {
          animation: crestFlameFlicker 2.1s ease-in-out infinite;
          transform-origin: 32px 46px;
        }
        .animate-inner-tongue {
          animation: innerTongueDance 1.5s ease-in-out infinite;
          transform-origin: 32px 46px;
        }
        .animate-top-bun {
          animation: burgerLayersExplode 4.3s ease-in-out forwards;
        }
        .animate-bottom-bun {
          animation: burgerBottomLayer 4.3s ease-in-out forwards;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT EMBLEM: ARTISAN BURGER HOUSE CREST
          (Crossed Pitmaster Spatulas + Multi-Tongue Flame + Sizzling Chapa Grate)
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Crisp Golden Ring & Steam Puff When Burger Lands Back in the Crest (~4.15s) */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key={`catch-ring-${animKey}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: [0.6, 1.4, 1.7],
                opacity: [0, 0.85, 0],
              }}
              transition={{
                duration: 0.75,
                delay: 4.1,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-400/75 z-30"
            />
          )}
        </AnimatePresence>

        <motion.div
          key={`crest-badge-${animKey}`}
          initial={{ scale: 1, rotate: 0 }}
          animate={{
            scale: [1, 1.05, 0.97, 1, 0.91, 1.2, 0.95, 1],
            rotate: [0, -3, 3, 0, 5, -8, 3, 0],
          }}
          transition={{
            duration: 4.8,
            times: [0, 0.14, 0.35, 0.65, 0.83, 0.89, 0.95, 1],
            ease: "easeInOut",
          }}
          className="relative flex size-11 sm:size-12 items-center justify-center"
        >
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full overflow-visible drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]"
          >
            <defs>
              <radialGradient id="medallionBg" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="70%" stopColor="#1c1917" />
                <stop offset="100%" stopColor="#0c0a09" />
              </radialGradient>

              <linearGradient id="crestSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#e2e8f0" />
                <stop offset="75%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="crestWood" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>

              <linearGradient id="crestOuterFire" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="45%" stopColor="#ea580c" />
                <stop offset="85%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>

              <linearGradient id="crestInnerFire" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="55%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>

              <linearGradient id="brassRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* 1. Circular Pitmaster Medallion Base */}
            <circle
              cx="32"
              cy="33"
              r="26"
              fill="url(#medallionBg)"
              stroke="url(#brassRim)"
              strokeWidth="2.2"
            />
            <circle
              cx="32"
              cy="33"
              r="22.5"
              fill="none"
              stroke="#78350f"
              strokeWidth="0.8"
              strokeDasharray="3 2"
              opacity="0.7"
            />

            {/* 2. Left Crossed Pitmaster Spatula */}
            <motion.g
              key={`left-spatula-${animKey}`}
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -14, 8, 0, -18, 7, 0] }}
              transition={{
                duration: 4.8,
                times: [0, 0.12, 0.25, 0.78, 0.88, 0.94, 1],
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "32px 34px" }}
            >
              <g transform="rotate(-38 32 34)">
                <path
                  d="M23 5 H41 L43.5 23 C43.5 25 42 26.5 39.5 26.5 H24.5 C22 26.5 20.5 25 20.5 23 L23 5 Z"
                  fill="url(#crestSteel)"
                  stroke="#1e293b"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path d="M23.4 5.7 H40.6 L41 8.2 H23 Z" fill="#ffffff" opacity="0.9" />
                <rect x="25.5" y="10" width="2.4" height="12" rx="1.2" fill="#1c1917" />
                <rect x="30.8" y="10" width="2.4" height="12" rx="1.2" fill="#1c1917" />
                <rect x="36.1" y="10" width="2.4" height="12" rx="1.2" fill="#1c1917" />
                <path d="M29.5 26.5 V37 H34.5 V26.5" fill="#94a3b8" stroke="#1e293b" strokeWidth="1.1" />
                <rect
                  x="27.5"
                  y="36"
                  width="9"
                  height="21"
                  rx="4.2"
                  fill="url(#crestWood)"
                  stroke="#1c1917"
                  strokeWidth="1.3"
                />
                <circle cx="32" cy="41.5" r="1.4" fill="#fde68a" />
                <circle cx="32" cy="47" r="1.4" fill="#fde68a" />
                <circle cx="32" cy="52.5" r="1.4" fill="#fde68a" />
              </g>
            </motion.g>

            {/* 3. Right Crossed Pitmaster Spatula */}
            <motion.g
              key={`right-spatula-${animKey}`}
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 14, -8, 0, 18, -7, 0] }}
              transition={{
                duration: 4.8,
                times: [0, 0.12, 0.25, 0.78, 0.88, 0.94, 1],
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "32px 34px" }}
            >
              <g transform="rotate(38 32 34)">
                <path
                  d="M23 5 H41 L43.5 23 C43.5 25 42 26.5 39.5 26.5 H24.5 C22 26.5 20.5 25 20.5 23 L23 5 Z"
                  fill="url(#crestSteel)"
                  stroke="#1e293b"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path d="M23.4 5.7 H40.6 L41 8.2 H23 Z" fill="#ffffff" opacity="0.9" />
                <rect x="25.5" y="10" width="2.4" height="12" rx="1.2" fill="#1c1917" />
                <rect x="30.8" y="10" width="2.4" height="12" rx="1.2" fill="#1c1917" />
                <rect x="36.1" y="10" width="2.4" height="12" rx="1.2" fill="#1c1917" />
                <path d="M29.5 26.5 V37 H34.5 V26.5" fill="#94a3b8" stroke="#1e293b" strokeWidth="1.1" />
                <rect
                  x="27.5"
                  y="36"
                  width="9"
                  height="21"
                  rx="4.2"
                  fill="url(#crestWood)"
                  stroke="#1c1917"
                  strokeWidth="1.3"
                />
                <circle cx="32" cy="41.5" r="1.4" fill="#fde68a" />
                <circle cx="32" cy="47" r="1.4" fill="#fde68a" />
                <circle cx="32" cy="52.5" r="1.4" fill="#fde68a" />
              </g>
            </motion.g>

            {/* 4. Central Multi-Tongue Wood-Fired Flame Crest */}
            <g className="animate-crest-flame">
              <path
                d="M32 10
                   C34 15, 39 18, 38 25
                   C41 22, 44 19, 43 16
                   C47 21, 49 29, 46 36
                   C48 34, 50 32, 50 29
                   C52 35, 48 44, 40 47
                   H24
                   C16 44, 12 35, 14 29
                   C14 32, 16 34, 18 36
                   C15 29, 17 21, 21 16
                   C20 19, 23 22, 26 25
                   C25 18, 30 15, 32 10 Z"
                fill="url(#crestOuterFire)"
                stroke="#1c1917"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                className="animate-inner-tongue"
                d="M32 20
                   C33.5 24, 37 27, 36 32
                   C38.5 30, 40 28, 39.5 25.5
                   C42 30, 41 39, 36 45
                   H28
                   C23 39, 22 30, 24.5 25.5
                   C24 28, 25.5 30, 28 32
                   C27 27, 30.5 24, 32 20 Z"
                fill="url(#crestInnerFire)"
              />
              <path
                d="M32 31 C34 34, 35.5 38, 34 45 H30 C28.5 38, 30 34, 32 31 Z"
                fill="#fffbeb"
              />
            </g>

            {/* 5. Heavy Cast-Iron Chapa / Grill Grate Bar at Base of Flame */}
            <g>
              <rect
                x="15"
                y="44.5"
                width="34"
                height="5.5"
                rx="2.75"
                fill="#292524"
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              <rect x="19" y="46.2" width="3.5" height="2.1" rx="1" fill="#ea580c" />
              <rect x="25" y="46.2" width="3.5" height="2.1" rx="1" fill="#f59e0b" />
              <rect x="31" y="46.2" width="3.5" height="2.1" rx="1" fill="#fbbf24" />
              <rect x="37" y="46.2" width="3.5" height="2.1" rx="1" fill="#f59e0b" />
              <rect x="43" y="46.2" width="2.5" height="2.1" rx="1" fill="#ea580c" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN STAGE: HORIZONTAL CHEF SPATULA CARRYING & FLIPPING THE BURGER
          ACROSS "FOGO E CHAPA"
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col justify-center">
        {/* PARABOLIC FLIGHT TRAIL ARC: Appears when the spatula catapults the burger back to the crest! */}
        <AnimatePresence>
          {isPlaying && (
            <svg
              key={`flight-arc-${animKey}`}
              viewBox="0 0 260 80"
              className="pointer-events-none absolute -left-8 -top-11 w-[265px] h-[75px] overflow-visible z-20"
            >
              <motion.path
                d="M 248 44 Q 125 -22 4 42"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 0.75, 0],
                }}
                transition={{
                  duration: 1.45,
                  delay: 2.72,
                  times: [0, 0.75, 1],
                  ease: "easeInOut",
                }}
              />
            </svg>
          )}
        </AnimatePresence>

        {/* 1) HORIZONTAL FLAT-TOP SPATULA:
               - Glides in from left carrying the burger right on its flat steel blade
               - Presses down ("Smash") on FOGO (~0.55s)
               - Mini-tosses the burger over "E" (~1.4s)
               - Slides across CHAPA and executes a strong upward wrist flick (~2.7s) */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key={`flat-spatula-${animKey}`}
              initial={{ x: -34, y: -4, rotate: -8, opacity: 0, scale: 0.85 }}
              animate={{
                x: [-34, 14, 18, 86, 94, 152, 206, 214, 186, 236],
                y: [-4, -9, -2, -8, -16, -7, -6, -24, -12, 8],
                rotate: [-8, 0, 8, -2, -24, 2, -6, -45, 16, 32],
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0.9, 0],
                scale: [0.85, 1, 1.06, 1, 1.08, 1, 1.05, 1.18, 1, 0.75],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 4.5,
                times: [0, 0.1, 0.16, 0.3, 0.36, 0.5, 0.64, 0.72, 0.88, 1],
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-0 top-0 z-30"
            >
              {/* Side-Profile Flat-Top Chef Spatula SVG (Blade flat under the burger!) */}
              <svg
                viewBox="0 0 92 40"
                className="w-16 sm:w-20 h-auto drop-shadow-[0_3px_5px_rgba(0,0,0,0.75)]"
              >
                <defs>
                  <linearGradient id="flatSteelBlade" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
                {/* Walnut Wood Handle on Left -> Cranked Steel Neck -> Flat Horizontal Blade on Right */}
                <rect
                  x="2"
                  y="4"
                  width="25"
                  height="9.5"
                  rx="4.75"
                  fill="#78350f"
                  stroke="#290f02"
                  strokeWidth="1.4"
                  transform="rotate(14 14 8)"
                />
                <circle cx="9" cy="7.5" r="1.4" fill="#fde68a" />
                <circle cx="17.5" cy="9.5" r="1.4" fill="#fde68a" />
                {/* Cranked Z-Bend Stainless Tang */}
                <path
                  d="M24 11 L35 23 H86 L82 26.8 H33 L21 13.5 Z"
                  fill="url(#flatSteelBlade)"
                  stroke="#1e293b"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                {/* Warm Heat Tint at Tip of Blade */}
                <path d="M68 23.4 H84.5 L81.8 26.2 H68 Z" fill="#f59e0b" opacity="0.45" />
                {/* Top Gleaming Edge of Flat Blade */}
                <line x1="35" y1="23" x2="85" y2="23" stroke="#ffffff" strokeWidth="1.2" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2) ARTISAN DOUBLE-BACON SMASH BURGER (WITH SEPARATING LAYERS IN MID-AIR!):
               - Sits directly on the horizontal spatula blade (x+28px offset)
               - Squashes when smashed on FOGO (~0.55s)
               - Layers separate & snap back together during the 360° hop over "E" (~1.4s)
               - Glides across CHAPA and gets catapulted high in a double-flip arc (~2.7s - 4.2s)
               - Lands squarely inside the left Pitmaster Crest! */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key={`riding-burger-${animKey}`}
              initial={{ x: -6, y: -22, scaleX: 0.9, scaleY: 1.1, rotate: -6, opacity: 0 }}
              animate={{
                x: [-6, 42, 46, 114, 122, 180, 232, 148, 56, -34],
                y: [-22, -23, -14, -22, -44, -21, -20, -58, -50, -2],
                scaleX: [0.9, 1.02, 1.32, 1.0, 0.92, 1.16, 0.88, 1.15, 1.08, 0.3],
                scaleY: [1.1, 0.98, 0.7, 1.0, 1.14, 0.86, 1.18, 1.15, 1.08, 0.3],
                rotate: [-6, 0, 3, -2, -360, -355, -345, -540, -720, -1080],
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 4.35,
                times: [0, 0.1, 0.16, 0.3, 0.38, 0.5, 0.64, 0.78, 0.9, 1],
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-0 top-0 z-40"
            >
              {/* Detailed Artisan Smash Burger SVG with Animated Separating Layers */}
              <svg
                viewBox="0 0 52 48"
                className="size-8 sm:size-9 overflow-visible drop-shadow-[0_3px_5px_rgba(0,0,0,0.75)]"
              >
                {/* TOP LAYER GROUP (Brioche Crown + Sesame Seeds - separates upward during jumps!) */}
                <g className="animate-top-bun">
                  <path
                    d="M7 18 C7 9 15 4 26 4 C37 4 45 9 45 18 Z"
                    fill="#d97706"
                    stroke="#78350f"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M14 10 Q23 6.5 33 9"
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                  <ellipse cx="18" cy="12" rx="1.6" ry="0.9" fill="#fef3c7" transform="rotate(-15 18 12)" />
                  <ellipse cx="26" cy="10.2" rx="1.6" ry="0.9" fill="#fef3c7" />
                  <ellipse cx="34" cy="12.2" rx="1.6" ry="0.9" fill="#fef3c7" transform="rotate(15 34 12.2)" />
                  <ellipse cx="22" cy="14.5" rx="1.4" ry="0.8" fill="#fef3c7" transform="rotate(8 22 14.5)" />
                  <ellipse cx="30" cy="14.5" rx="1.4" ry="0.8" fill="#fef3c7" transform="rotate(-8 30 14.5)" />
                </g>

                {/* MIDDLE LAYER GROUP (Ruffled Lettuce + Ripe Tomato + Smoked Bacon) */}
                <g>
                  {/* Ripe Red Tomato Slice */}
                  <rect x="9" y="17.5" width="34" height="2.6" rx="1.3" fill="#dc2626" />
                  {/* Fresh Ruffled Green Lettuce */}
                  <path
                    d="M5 19.5 Q10 23 15 19.5 Q20 23 25 19.5 Q30 23 35 19.5 Q40 23 45 19.5"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  {/* Crispy Smoked Bacon Strips */}
                  <path
                    d="M4 21.8 Q9 19.8 14 22.2 L38 22.2 Q43 19.8 48 21.8"
                    fill="none"
                    stroke="#991b1b"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>

                {/* BOTTOM LAYER GROUP (Melted Cheddar + Double Smash Patty + Bottom Bun) */}
                <g className="animate-bottom-bun">
                  {/* Melted Sharp Cheddar Corners */}
                  <path
                    d="M7 21.5 H45 L34 28.8 L26 23.8 L17 27.8 Z"
                    fill="#f59e0b"
                    stroke="#b45309"
                    strokeWidth="0.6"
                  />
                  {/* Crusty Seared Smash Patty */}
                  <rect
                    x="6"
                    y="22.5"
                    width="40"
                    height="7"
                    rx="3.5"
                    fill="#451a03"
                    stroke="#290f02"
                    strokeWidth="1.2"
                  />
                  {/* Grill Sear Marks */}
                  <line x1="14" y1="24" x2="12" y2="28" stroke="#1c1917" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="22" y1="24" x2="20" y2="28" stroke="#1c1917" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="30" y1="24" x2="28" y2="28" stroke="#1c1917" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="38" y1="24" x2="36" y2="28" stroke="#1c1917" strokeWidth="1.3" strokeLinecap="round" />
                  {/* Toasted Bottom Brioche Heel */}
                  <path
                    d="M8 29.5 H44 C44 34 39 36 26 36 C13 36 8 34 8 29.5 Z"
                    fill="#b45309"
                    stroke="#78350f"
                    strokeWidth="1.2"
                  />
                </g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3) NATURAL FLAME LICKS RISING AS THE SPATULA SCRAPES ACROSS */}
        <AnimatePresence>
          {isPlaying &&
            CHAPA_FLAME_LICKS.map((f) => (
              <motion.svg
                key={`flame-lick-${animKey}-${f.id}`}
                viewBox="0 0 20 28"
                style={{ left: f.left }}
                initial={{ opacity: 0, scaleY: 0.2, y: 8 }}
                animate={{
                  opacity: [0, 0.95, 0.75, 0],
                  scaleY: [0.2, 1.15, 0.85, 0.1],
                  y: [8, -2, -6, -10],
                }}
                transition={{
                  duration: 1.3,
                  delay: f.delay,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute -top-2 w-3.5 h-4.5 z-20 origin-bottom"
              >
                <path
                  d="M10 2 C10 2 18 10 17 18 C16 23 13 26 10 26 C7 26 4 23 3 18 C2 10 10 2 10 2 Z"
                  fill="#ea580c"
                />
                <path
                  d="M10 9 C10 9 14.5 14 14 19 C13.5 22.5 12 24.5 10 24.5 C8 24.5 6.5 22.5 6 19 C5.5 14 10 9 10 9 Z"
                  fill="#fbbf24"
                />
              </motion.svg>
            ))}
        </AnimatePresence>

        {/* 4) CRISP WHITE GRILL STEAM PUFFS */}
        <AnimatePresence>
          {isPlaying &&
            STEAM_PUFFS.map((s) => (
              <motion.svg
                key={`steam-${animKey}-${s.id}`}
                viewBox="0 0 28 24"
                style={{ left: s.x }}
                initial={{ opacity: 0, y: 6, scale: 0.4 }}
                animate={{
                  opacity: [0, 0.6, 0.35, 0],
                  y: [6, -10, -20, -30],
                  x: [0, s.drift, s.drift * 1.4],
                  scale: [0.4, s.scale, s.scale * 1.25, s.scale * 1.4],
                }}
                transition={{
                  duration: 1.8,
                  delay: s.delay,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute top-0 size-5 z-20"
              >
                <circle cx="10" cy="14" r="5.5" fill="#e7e5e4" />
                <circle cx="17" cy="11" r="6.5" fill="#f5f5f4" />
                <circle cx="14" cy="16" r="5" fill="#d6d3d1" />
              </motion.svg>
            ))}
        </AnimatePresence>

        {/* 5) GOLDEN SIZZLE DROPLETS ON SMASH & FLIP */}
        <AnimatePresence>
          {isPlaying &&
            SIZZLE_DROPS.map((c) => (
              <motion.span
                key={`sizzle-drop-${animKey}-${c.id}`}
                initial={{ x: c.x, y: 4, scale: 0, opacity: 0 }}
                animate={{
                  x: [c.x, c.x + c.drift],
                  y: [4, c.y * 0.65, c.y - 8],
                  scale: [0, 1.1, 0.6, 0],
                  opacity: [0, 0.95, 0.75, 0],
                }}
                transition={{
                  duration: 1.35,
                  delay: c.delay,
                  ease: "easeOut",
                }}
                style={{ backgroundColor: c.color }}
                className="pointer-events-none absolute left-0 top-1/2 size-1.5 rounded-full z-30"
              />
            ))}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════
            TYPOGRAPHY: SOLID, CRISP WHITE "FOGO E CHAPA"
            Each letter briefly toasts warm amber as the hot spatula scrapes under it!
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative flex items-center gap-1.5 sm:gap-2 font-display text-lg sm:text-2xl font-black tracking-tighter uppercase leading-none text-white">
          {/* FOGO */}
          <span className="inline-flex items-baseline">
            {fogoChars.map((char, idx) => (
              <motion.span
                key={`fogo-char-${animKey}-${idx}`}
                initial={{ y: 0, scaleX: 1, scaleY: 1, rotate: 0, color: "#ffffff" }}
                animate={{
                  y: [0, 4, -8, 1.5, 0],
                  scaleX: [1, 1.24, 0.88, 1.04, 1],
                  scaleY: [1, 0.74, 1.22, 0.96, 1],
                  rotate: [0, -5, 6, -2, 0],
                  color: ["#ffffff", "#f59e0b", "#fbbf24", "#ffffff", "#ffffff"],
                }}
                transition={{
                  duration: 0.95,
                  delay: 0.42 + idx * 0.14,
                  ease: "easeInOut",
                }}
                className="inline-block origin-bottom"
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* Connector: E */}
          <motion.span
            key={`e-tag-${animKey}`}
            initial={{ y: 0, scale: 1, rotate: 0 }}
            animate={{
              y: [0, 3, -10, 1.5, 0],
              scale: [1, 0.85, 1.28, 0.94, 1],
              rotate: [0, -14, 14, -5, 0],
            }}
            transition={{
              duration: 1.0,
              delay: 1.28,
              ease: "easeInOut",
            }}
            className="inline-flex items-center justify-center px-1.5 py-0.5 text-[0.72em] font-black rounded bg-orange-600 text-white border border-orange-400/40"
          >
            E
          </motion.span>

          {/* CHAPA */}
          <span className="inline-flex items-baseline">
            {chapaChars.map((char, idx) => (
              <motion.span
                key={`chapa-char-${animKey}-${idx}`}
                initial={{ y: 0, scaleX: 1, scaleY: 1, rotate: 0, color: "#ffffff" }}
                animate={{
                  y: [0, 3.5, -9, 1.5, 0],
                  scaleX: [1, 1.22, 0.88, 1.04, 1],
                  scaleY: [1, 0.76, 1.24, 0.96, 1],
                  rotate: [0, 5, -7, 2, 0],
                  color: ["#ffffff", "#ea580c", "#fbbf24", "#ffffff", "#ffffff"],
                }}
                transition={{
                  duration: 0.95,
                  delay: 1.65 + idx * 0.16,
                  ease: "easeInOut",
                }}
                className="inline-block origin-bottom"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </div>

        {/* Matte Cast-Iron Griddle ("Chapa") Bar Underneath */}
        <div className="relative mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-stone-700/80">
          <motion.div
            key={`chapa-sear-${animKey}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 1] }}
            transition={{
              duration: 2.9,
              times: [0, 0.82, 1],
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "left center" }}
            className="h-full w-full bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600"
          />
        </div>
      </div>
    </a>
  );
}
