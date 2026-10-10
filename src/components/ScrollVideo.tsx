import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export interface ScrollVideoProps {
  videoSrc: string;
  burgerName1?: string;
  burgerName2?: string;
  ingredient1?: string;
  ingredientDesc1?: string;
  ingredient2?: string;
  ingredientDesc2?: string;
  ingredient3?: string;
  ingredientDesc3?: string;
  ingredient4?: string;
  ingredientDesc4?: string;
}

export function ScrollVideo({
  videoSrc,
  burgerName1 = "Triplex",
  burgerName2 = "Burger",
  ingredient1 = "Pão Brioche",
  ingredientDesc1 = "Selado na manteiga para não desmanchar. Macio e dourado perfeito.",
  ingredient2 = "Queijo Cheddar",
  ingredientDesc2 = "Derretido no ponto exato, abraçando a carne suculenta.",
  ingredient3 = "Blend Fogo & Chapa",
  ingredientDesc3 = "Três carnes de 180g de pura suculência, feitas na brasa ardente.",
  ingredient4 = "Salada Fresca",
  ingredientDesc4 = "Alface crocante e tomate fresquinho cortado todos os dias.",
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (videoRef.current && duration > 0) {
      // Use requestAnimationFrame for smoother playback scrubbing
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = latest * duration;
        }
      });
    }
  });

  return (
    <div ref={containerRef} id="gallery" className="relative w-full h-[600vh]">
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-contain"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setLoaded(true);
          }}
        />

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-gray-800/60 text-sm font-mono animate-pulse">Carregando...</div>
          </div>
        )}

        {/* Fixed stylistic typography (background/edges) */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none hidden lg:block">
          <p className="text-[10px] font-bold tracking-[0.5em] text-gray-300 rotate-90 origin-top-left translate-x-4 mt-8">
            100% ARTESANAL
          </p>
        </div>

        <div className="absolute bottom-8 right-8 z-20 pointer-events-none hidden lg:block">
          <p className="text-[10px] font-bold tracking-[0.5em] text-gray-300 -rotate-90 origin-bottom-right -translate-x-4 mb-8">
            PREMIUM QUALITY
          </p>
        </div>

        <div className="absolute top-10 right-10 z-20 pointer-events-none hidden md:block">
          <div className="w-16 h-[1px] bg-gray-200"></div>
          <div className="w-[1px] h-16 bg-gray-200 absolute top-0 right-0"></div>
        </div>

        <div className="absolute bottom-10 left-10 z-20 pointer-events-none hidden md:block">
          <div className="w-16 h-[1px] bg-gray-200 absolute bottom-0 left-0"></div>
          <div className="w-[1px] h-16 bg-gray-200 absolute bottom-0 left-0"></div>
        </div>

        {/* Fun floating texts based on scroll */}
        <motion.div
          className="absolute left-[5%] md:left-[10%] top-1/4 max-w-[280px] text-left z-20 pointer-events-none hidden md:block"
          style={{
            opacity: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [-50, 0, -50]),
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">01</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">
            {ingredient1}
          </h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">
            {ingredientDesc1}
          </p>
        </motion.div>

        <motion.div
          className="absolute right-[5%] md:right-[10%] top-1/3 max-w-[280px] text-right z-20 pointer-events-none hidden md:block"
          style={{
            opacity: useTransform(scrollYProgress, [0.35, 0.45, 0.55], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.35, 0.45, 0.55], [50, 0, 50]),
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">02</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">
            {ingredient2}
          </h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 ml-auto rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">
            {ingredientDesc2}
          </p>
        </motion.div>

        <motion.div
          className="absolute left-[5%] md:left-[10%] top-1/2 max-w-[280px] text-left z-20 pointer-events-none hidden md:block"
          style={{
            opacity: useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.6, 0.7, 0.8], [-50, 0, -50]),
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">03</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">
            {ingredient3}
          </h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">
            {ingredientDesc3}
          </p>
        </motion.div>

        <motion.div
          className="absolute right-[5%] md:right-[10%] top-2/3 max-w-[280px] text-right z-20 pointer-events-none hidden md:block"
          style={{
            opacity: useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.75, 0.85, 0.95], [50, 0, 50]),
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">04</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">
            {ingredient4}
          </h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 ml-auto rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">
            {ingredientDesc4}
          </p>
        </motion.div>

        {/* Burger label — bottom, doesn't cover the burger */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 text-center z-20 pointer-events-none">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-1">
            Conheça o
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900">
            {burgerName1} <span className="text-orange-500">{burgerName2}</span>
          </h2>
        </div>
      </section>
    </div>
  );
}
