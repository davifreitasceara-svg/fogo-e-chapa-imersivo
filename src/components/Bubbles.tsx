import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Bubble = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
};

export function Bubbles({ count = 20, color = "white" }: { count?: number; color?: string }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const effectiveCount = Math.min(count, isMobile ? 10 : 18);

  const bubbles = useMemo<Bubble[]>(() => {
    // Pseudo-random function for deterministic rendering
    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: effectiveCount }, (_, i) => ({
      left: rand(i + 1) * 100,
      size: 4 + rand(i + 21) * 6,
      delay: rand(i + 41) * 4,
      duration: 3 + rand(i + 61) * 3.5,
      drift: (rand(i + 81) - 0.5) * 35,
      opacity: 0.25 + rand(i + 101) * 0.45,
    }));
  }, [effectiveCount]);

  // Renderiza só no navegador para evitar hydration mismatch (SSR x cliente)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full" style={{ contain: "strict" }}>
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            backgroundColor: color === "white" ? "rgba(255,255,255,0.35)" : `${color}55`,
            border: `1px solid ${color === "white" ? "rgba(255,255,255,0.7)" : color + "AA"}`,
            boxShadow: `0 0 5px ${color === "white" ? "rgba(255,255,255,0.5)" : color + "88"}`,
            transform: "translateZ(0)",
          }}
          initial={{ y: "100%", x: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: ["50%", "-800%"],
            x: [0, b.drift, -b.drift, 0],
            opacity: [0, b.opacity, b.opacity, 0],
            scale: [0.8, 1, 1.15, 1],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: b.duration * 0.8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  );
}
