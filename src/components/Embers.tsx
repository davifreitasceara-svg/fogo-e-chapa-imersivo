import { useMemo } from "react";
import { motion } from "framer-motion";

type Ember = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
};

export function Embers({ count = 24 }: { count?: number }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const effectiveCount = Math.min(count, isMobile ? 12 : 22);

  const embers = useMemo<Ember[]>(() => {
    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: effectiveCount }, (_, i) => ({
      left: rand(i + 1) * 100,
      size: 2 + rand(i + 21) * 3,
      delay: rand(i + 41) * 6,
      duration: 6 + rand(i + 61) * 6,
      drift: (rand(i + 81) - 0.5) * 120,
      opacity: 0.4 + rand(i + 101) * 0.5,
    }));
  }, [effectiveCount]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" style={{ contain: "strict" }}>
      {embers.map((e, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[-5%] rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 pointer-events-none"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            filter: "drop-shadow(0 0 4px rgba(249, 115, 22, 0.75))",
            transform: "translateZ(0)",
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: ["0%", "-1000%"],
            x: [0, e.drift],
            opacity: [0, e.opacity, e.opacity, 0],
            scale: [1, 1.15, 0.5],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
