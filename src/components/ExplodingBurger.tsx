import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

const FRAME_COUNT = 240;

function getFrameSrc(index: number) {
  return `/video1_frames/frame_${index.toString().padStart(4, "0")}.jpg`;
}

export function ExplodingBurger() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Draw an image on the canvas with "cover" behavior
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas pixel size to its CSS size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // "object-contain" math: scale image to fit fully without cropping
    const cw = rect.width;
    const ch = rect.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.min(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // Pre-load all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (i === 0) {
          drawFrame(img);
        }
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [drawFrame]);

  // Redraw on resize
  useEffect(() => {
    const handleResize = () => {
      const img = imagesRef.current[currentFrameRef.current];
      if (img?.complete) drawFrame(img);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Scrub the canvas on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (imagesRef.current.length === 0) return;

    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    currentFrameRef.current = frameIndex;
    const img = imagesRef.current[frameIndex];
    if (img?.complete) {
      drawFrame(img);
    }
  });

  return (
    <div
      ref={containerRef}
      id="gallery"
      className="relative w-full h-[600vh]"
    >
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-gray-800/60 text-sm font-mono animate-pulse">
              Carregando...
            </div>
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
            x: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [-50, 0, -50])
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">01</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">Pão Brioche</h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">Selado na manteiga para não desmanchar. Macio e dourado perfeito.</p>
        </motion.div>

        <motion.div
          className="absolute right-[5%] md:right-[10%] top-1/3 max-w-[280px] text-right z-20 pointer-events-none hidden md:block"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.35, 0.45, 0.55], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.35, 0.45, 0.55], [50, 0, 50])
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">02</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">Queijo Cheddar</h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 ml-auto rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">Derretido no ponto exato, abraçando a carne suculenta.</p>
        </motion.div>

        <motion.div
          className="absolute left-[5%] md:left-[10%] top-1/2 max-w-[280px] text-left z-20 pointer-events-none hidden md:block"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.6, 0.7, 0.8], [-50, 0, -50])
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">03</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">Blend Fogo &amp; Chapa</h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">Três carnes de 180g de pura suculência, feitas na brasa ardente.</p>
        </motion.div>
        
        <motion.div
          className="absolute right-[5%] md:right-[10%] top-2/3 max-w-[280px] text-right z-20 pointer-events-none hidden md:block"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]),
            x: useTransform(scrollYProgress, [0.75, 0.85, 0.95], [50, 0, 50])
          }}
        >
          <span className="text-7xl font-black text-gray-200 block mb-[-10px] opacity-50">04</span>
          <h3 className="text-3xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-sm">Salada Fresca</h3>
          <div className="w-16 h-1.5 bg-orange-500 my-3 ml-auto rounded-full"></div>
          <p className="text-gray-800 text-base font-bold leading-snug drop-shadow-sm">Alface crocante e tomate fresquinho cortado todos os dias.</p>
        </motion.div>

        {/* Triplex Burger label — bottom, doesn't cover the burger */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 text-center z-20 pointer-events-none">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-1">
            Conheça o
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900">
            Triplex <span className="text-orange-500">Burger</span>
          </h2>
        </div>
      </section>
    </div>
  );
}