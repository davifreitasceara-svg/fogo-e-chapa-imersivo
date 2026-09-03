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

export function Embers({ count = 40 }: { count?: number }) {
  const embers = useMemo<Ember[]>(() => {
    // Deterministic pseudo-random so SSR and client agree.
    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      left: rand(i + 1) * 100,
      size: 2 + rand(i + 21) * 4,
      delay: rand(i + 41) * 8,
      duration: 7 + rand(i + 61) * 8,
      drift: (rand(i + 81) - 0.5) * 160,
      opacity: 0.35 + rand(i + 101) * 0.55,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((e, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[-10%] rounded-full bg-flame"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            boxShadow: "0 0 12px 2px var(--flame)",
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: ["0%", "-1100%"],
            x: [0, e.drift],
            opacity: [0, e.opacity, e.opacity, 0],
            scale: [1, 1.2, 0.4],
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
