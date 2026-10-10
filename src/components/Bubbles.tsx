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

export function Bubbles({ count = 25, color = "white" }: { count?: number; color?: string }) {
  const bubbles = useMemo<Bubble[]>(() => {
    // Pseudo-random function for deterministic rendering
    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      left: rand(i + 1) * 100,
      size: 4 + rand(i + 21) * 8, // 4px to 12px
      delay: rand(i + 41) * 5,
      duration: 3 + rand(i + 61) * 4,
      drift: (rand(i + 81) - 0.5) * 40,
      opacity: 0.2 + rand(i + 101) * 0.4,
    }));
  }, [count]);

  // Renderiza só no navegador para evitar hydration mismatch (SSR x cliente)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full backdrop-blur-[2px]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            backgroundColor: color === "white" ? "rgba(255,255,255,0.3)" : `${color}4D`,
            border: `1px solid ${color === "white" ? "rgba(255,255,255,0.6)" : color + "99"}`,
            boxShadow: `0 0 8px ${color === "white" ? "rgba(255,255,255,0.4)" : color + "66"}`,
          }}
          initial={{ y: "100%", x: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: ["50%", "-800%"],
            x: [0, b.drift, -b.drift, 0],
            opacity: [0, b.opacity, b.opacity, 0],
            scale: [0.8, 1, 1.2, 1],
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
