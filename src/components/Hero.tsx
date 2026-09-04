import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Flame, Star } from "lucide-react";
import heroBurger from "@/assets/hero-burger.png";
import { Embers } from "./Embers";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const cfg = { stiffness: 120, damping: 20, mass: 0.7 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), cfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-24, 24]), cfg);
  const glowX = useSpring(useTransform(mx, [-0.5, 0.5], [-40, 40]), cfg);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      id="inicio"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      <div className="ember-glow absolute inset-0" />
      <div className="grill-lines absolute inset-0 opacity-60" />
      <Embers count={46} />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            <Flame className="size-3.5" /> Grelhado na brasa viva
          </span>

          <h1 className="mt-6 font-display text-6xl leading-[0.9] uppercase sm:text-7xl xl:text-8xl">
            Sabor que <span className="text-fire">nasce</span>
            <br />
            do fogo
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground lg:mx-0">
            Carne maturada, chapa a 300°C e brasa de verdade. Cada mordida do Fogo e Chapa é
            defumada, suculenta e feita para acabar rápido demais.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <motion.a
              href="#cardapio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded-full bg-fire px-8 py-4 text-sm font-bold text-primary-foreground uppercase shadow-[var(--shadow-fire)] transition-shadow hover:shadow-[0_0_50px_-6px_var(--flame)]"
            >
              Ver cardápio
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="#sobre"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-bold uppercase transition-colors hover:border-flame hover:text-flame"
            >
              Nossa história
            </motion.a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
            <span className="flex items-center gap-1.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span>+12 mil clientes queimando de vontade</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl"
          style={{ perspective: 1200 }}
        >
          <motion.div
            className="absolute inset-8 rounded-full bg-fire opacity-30 blur-[90px]"
            style={{ x: glowX }}
            animate={{ opacity: [0.22, 0.42, 0.22] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            animate={{ y: [-14, 14, -14] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={heroBurger}
              alt="Hambúrguer artesanal duplo do Fogo e Chapa flutuando com iluminação de brasa"
              width={1024}
              height={1024}
              className="relative w-full drop-shadow-[0_45px_60px_rgba(0,0,0,0.75)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
