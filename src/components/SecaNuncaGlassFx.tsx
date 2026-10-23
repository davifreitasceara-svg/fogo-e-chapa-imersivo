import { useMemo } from "react";
import { motion } from "framer-motion";

export function SecaNuncaGlassFx({ isPouring }: { isPouring: boolean }) {
  // Static bubble positions and animation durations for optimal performance
  const bubbles = useMemo(
    () => [
      { id: 1, left: "40%", size: 4, duration: 2.8, delay: 0.1 },
      { id: 2, left: "48%", size: 3, duration: 2.3, delay: 0.7 },
      { id: 3, left: "55%", size: 5, duration: 3.2, delay: 0.4 },
      { id: 4, left: "62%", size: 3.5, duration: 2.5, delay: 1.2 },
      { id: 5, left: "44%", size: 4.5, duration: 3.0, delay: 1.6 },
      { id: 6, left: "58%", size: 2.5, duration: 2.1, delay: 0.9 },
      { id: 7, left: "50%", size: 4, duration: 2.7, delay: 1.9 },
    ],
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
    >
      {/* 1. Sub-Zero Cold Vapor Mist (rising gently from ice cubes and lime at the top) */}
      <div className="absolute left-[38%] top-[8%] h-[24%] w-[32%] pointer-events-none">
        <motion.div
          animate={{
            y: [-2, -18, -32],
            x: [0, 6, 12],
            opacity: [0, 0.45, 0],
            scale: [0.7, 1.2, 1.6],
          }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute left-[20%] top-[30%] h-7 w-7 rounded-full bg-emerald-100/40 blur-md"
        />
        <motion.div
          animate={{
            y: [-4, -20, -36],
            x: [0, -5, -10],
            opacity: [0, 0.4, 0],
            scale: [0.8, 1.3, 1.7],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            delay: 1.4,
            ease: "easeOut",
          }}
          className="absolute right-[25%] top-[25%] h-8 w-8 rounded-full bg-teal-100/35 blur-md"
        />
      </div>

      {/* 2. Sparkling Effervescence (Carbonation micro-bubbles rising inside emerald liquid) */}
      <div className="absolute left-[33%] top-[22%] h-[72%] w-[35%] overflow-hidden pointer-events-none">
        {bubbles.map((b) => (
          <motion.span
            key={b.id}
            animate={{
              y: ["100%", "-20%"],
              x: [0, (b.id % 2 === 0 ? 3 : -3), 0],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: isPouring ? b.duration * 0.6 : b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: "linear",
            }}
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              bottom: 0,
            }}
            className="absolute rounded-full bg-emerald-200 shadow-[0_0_6px_rgba(74,222,128,0.9)]"
          >
            {/* Tiny glint on bubble */}
            <span className="absolute left-0.5 top-0.5 block h-0.5 w-0.5 rounded-full bg-white opacity-90" />
          </motion.span>
        ))}
      </div>

      {/* 3. Sweating Glass Condensation Drops (realistic water beads on cold exterior) */}
      <div className="absolute left-[34%] top-[28%] h-[65%] w-[34%] pointer-events-none">
        <motion.div
          animate={{
            y: isPouring ? [0, 12, 18] : 0,
            opacity: [0.8, 0.95, 0.8],
          }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute left-[22%] top-[35%] h-3.5 w-2 rounded-full bg-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.18)]"
        />
        <motion.div
          animate={{
            y: isPouring ? [0, 8, 14] : 0,
            opacity: [0.75, 0.9, 0.75],
          }}
          transition={{ duration: 1.6, delay: 0.1, ease: "easeInOut" }}
          className="absolute right-[24%] top-[52%] h-4 w-2.5 rounded-full bg-white/65 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.18)]"
        />
        <div className="absolute left-[54%] top-[72%] h-2.5 w-1.5 rounded-full bg-white/75 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.15)]" />
      </div>

      {/* 4. Dynamic 3D Cylindrical Glass Reflection Sweep */}
      <motion.div
        animate={{
          x: isPouring ? ["-20%", "40%"] : ["-10%", "15%", "-10%"],
          opacity: isPouring ? [0.45, 0.85, 0.5] : [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: isPouring ? 1.6 : 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[32%] top-[12%] h-[84%] w-[36%] rounded-[2rem] pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.12) 36%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.12) 64%, transparent 80%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
