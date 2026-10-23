import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SecaNuncaGlassFx({ isPouring }: { isPouring: boolean }) {
  // Bubbles inside the beverage that respond dynamically to pouring
  const bubbles = useMemo(
    () => [
      { id: 1, left: "38%", size: 4, duration: 2.4, delay: 0.1 },
      { id: 2, left: "46%", size: 3, duration: 2.1, delay: 0.5 },
      { id: 3, left: "54%", size: 5, duration: 2.7, delay: 0.3 },
      { id: 4, left: "62%", size: 3.5, duration: 2.2, delay: 0.8 },
      { id: 5, left: "42%", size: 4.5, duration: 2.5, delay: 1.2 },
      { id: 6, left: "58%", size: 3, duration: 2.0, delay: 0.6 },
      { id: 7, left: "50%", size: 4, duration: 2.3, delay: 1.5 },
      { id: 8, left: "65%", size: 4.5, duration: 1.9, delay: 0.2 },
    ],
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-visible select-none"
    >
      {/* ====================================================================== */}
      {/* 1. INTERNAL FLUID SURGE (O Líquido Saindo de DENTRO do Copo)            */}
      {/* ====================================================================== */}
      <div className="absolute left-[31.5%] top-[15.5%] h-[74.5%] w-[37%] overflow-visible pointer-events-none">
        {/* Dynamic fluid slosh mass inside the tumbler body */}
        <motion.div
          animate={
            isPouring
              ? {
                  // When tilted, liquid rushes to upper-right lip, draining from upper-left
                  clipPath: [
                    "polygon(0% 10%, 100% 10%, 100% 100%, 0% 100%)",
                    "polygon(0% 38%, 100% 0%, 100% 100%, 0% 100%)",
                    "polygon(0% 42%, 100% -2%, 100% 100%, 0% 100%)",
                    "polygon(0% 40%, 100% 0%, 100% 100%, 0% 100%)",
                  ],
                  opacity: [0.65, 0.95, 0.95, 0.92],
                }
              : {
                  clipPath: "polygon(0% 10%, 100% 10%, 100% 100%, 0% 100%)",
                  opacity: 0.45,
                }
          }
          transition={{
            duration: isPouring ? 1.4 : 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-b-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(16, 185, 129, 0.55) 45%, rgba(5, 150, 105, 0.75) 100%)",
            mixBlendMode: "color-burn",
          }}
        />

        {/* Luminous internal fluid wave and illumination surging towards the opening */}
        <motion.div
          animate={
            isPouring
              ? {
                  opacity: [0, 0.85, 0.8, 0],
                  scaleX: [0.8, 1.15, 1.05],
                  y: [-2, -8, -12],
                }
              : { opacity: 0, y: 0 }
          }
          transition={{ duration: 1.3, ease: "easeOut" }}
          className="absolute right-0 top-0 h-16 w-full rounded-tr-xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 85% 20%, rgba(74, 222, 128, 0.85) 0%, rgba(34, 197, 94, 0.5) 45%, transparent 80%)",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* ====================================================================== */}
      {/* 2. OVERFLOWING FLUID TONGUE & CREST AT THE RIM LIP (Saída na borda)    */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {isPouring && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, x: -8, y: 4 }}
            animate={{
              opacity: [0, 1, 1, 0.95],
              scale: [0.3, 1.1, 1.02, 1],
              x: 0,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.4, x: -6, y: 4, transition: { duration: 0.22 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute left-[64%] top-[14%] h-10 w-16 pointer-events-none z-30"
          >
            {/* Viscous glowing fluid crest emerging directly over the rim lip */}
            <div
              className="absolute inset-0 rounded-[50%_60%_70%_40%] shadow-[0_0_12px_rgba(74,222,128,0.85)]"
              style={{
                background:
                  "radial-gradient(circle at 40% 35%, #86efac 0%, #22c55e 35%, #15803d 75%, #166534 100%)",
                transform: "rotate(18deg)",
              }}
            />
            {/* Specular gloss glint on the crest curve */}
            <div
              className="absolute left-2 top-1.5 h-3 w-7 rounded-full bg-white/80 blur-[0.6px]"
              style={{ transform: "rotate(15deg)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================== */}
      {/* 3. SPARKLING EFFERVESCENCE (Microbolhas subindo e sugadas no fluxo)     */}
      {/* ====================================================================== */}
      <div className="absolute left-[33%] top-[20%] h-[74%] w-[35%] overflow-visible pointer-events-none">
        {bubbles.map((b) => (
          <motion.span
            key={b.id}
            animate={
              isPouring
                ? {
                    // Under pouring tilt, bubbles rush towards the top-right lip
                    y: ["90%", "-10%"],
                    x: [0, 18, 32],
                    opacity: [0, 0.95, 0.95, 0],
                    scale: [0.7, 1.2, 1],
                  }
                : {
                    y: ["95%", "-15%"],
                    x: [0, b.id % 2 === 0 ? 3 : -3, 0],
                    opacity: [0, 0.85, 0.85, 0],
                    scale: 1,
                  }
            }
            transition={{
              duration: isPouring ? b.duration * 0.48 : b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: isPouring ? "easeIn" : "linear",
            }}
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              bottom: 0,
            }}
            className="absolute rounded-full bg-emerald-200 shadow-[0_0_8px_rgba(74,222,128,0.95)]"
          >
            <span className="absolute left-0.5 top-0.5 block h-0.5 w-0.5 rounded-full bg-white opacity-90" />
          </motion.span>
        ))}
      </div>

      {/* ====================================================================== */}
      {/* 4. SUB-ZERO COLD VAPOR MIST (Névoa saindo do topo gelado)               */}
      {/* ====================================================================== */}
      <div className="absolute left-[38%] top-[8%] h-[24%] w-[32%] pointer-events-none">
        <motion.div
          animate={
            isPouring
              ? {
                  y: [-2, -26, -48],
                  x: [0, 14, 28],
                  opacity: [0, 0.65, 0],
                  scale: [0.8, 1.4, 1.9],
                }
              : {
                  y: [-2, -18, -32],
                  x: [0, 6, 12],
                  opacity: [0, 0.45, 0],
                  scale: [0.7, 1.2, 1.6],
                }
          }
          transition={{
            duration: isPouring ? 2.2 : 3.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute left-[20%] top-[30%] h-8 w-8 rounded-full bg-emerald-100/45 blur-md"
        />
        <motion.div
          animate={
            isPouring
              ? {
                  y: [-4, -30, -52],
                  x: [0, 10, 24],
                  opacity: [0, 0.55, 0],
                  scale: [0.8, 1.5, 2.0],
                }
              : {
                  y: [-4, -20, -36],
                  x: [0, -5, -10],
                  opacity: [0, 0.4, 0],
                  scale: [0.8, 1.3, 1.7],
                }
          }
          transition={{
            duration: isPouring ? 2.4 : 3.8,
            repeat: Infinity,
            delay: 0.8,
            ease: "easeOut",
          }}
          className="absolute right-[25%] top-[25%] h-9 w-9 rounded-full bg-teal-100/40 blur-md"
        />
      </div>

      {/* ====================================================================== */}
      {/* 5. SWEATING GLASS CONDENSATION DROPS (Gotas de orvalho exterior)        */}
      {/* ====================================================================== */}
      <div className="absolute left-[34%] top-[28%] h-[65%] w-[34%] pointer-events-none">
        <motion.div
          animate={{
            y: isPouring ? [0, 14, 22] : 0,
            opacity: [0.8, 0.95, 0.8],
          }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute left-[22%] top-[35%] h-3.5 w-2 rounded-full bg-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.18)]"
        />
        <motion.div
          animate={{
            y: isPouring ? [0, 10, 16] : 0,
            opacity: [0.75, 0.9, 0.75],
          }}
          transition={{ duration: 1.6, delay: 0.1, ease: "easeInOut" }}
          className="absolute right-[24%] top-[52%] h-4 w-2.5 rounded-full bg-white/65 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.18)]"
        />
        <div className="absolute left-[54%] top-[72%] h-2.5 w-1.5 rounded-full bg-white/75 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.15)]" />
      </div>

      {/* ====================================================================== */}
      {/* 6. DYNAMIC 3D CYLINDRICAL GLASS REFLECTION SWEEP                       */}
      {/* ====================================================================== */}
      <motion.div
        animate={{
          x: isPouring ? ["-20%", "45%"] : ["-10%", "15%", "-10%"],
          opacity: isPouring ? [0.45, 0.9, 0.55] : [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: isPouring ? 1.6 : 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[32%] top-[12%] h-[84%] w-[36%] rounded-[2rem] pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.12) 36%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.12) 64%, transparent 80%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
