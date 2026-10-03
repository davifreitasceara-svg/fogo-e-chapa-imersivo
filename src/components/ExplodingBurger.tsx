import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FRAME_COUNT = 364;

export function ExplodingBurger() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Pre-load all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(4, "0");
      img.src = `/burger_frames/frame_${frameNum}.jpg`;

      img.onload = () => {
        loadedCount++;
        
        // Setup canvas size based on the first loaded frame
        if (loadedCount === 1 && canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          
          // Draw first frame
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height);
          }
        }

        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      
      images.push(img);
    }
  }, []);

  // Update canvas when scrolling
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Calculate which frame to show based on scroll progress
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(latest * FRAME_COUNT)
      );

      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, imagesLoaded]);

  // Fade out title at 10% scroll, fade in label between 30% and 60%
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative bg-[#FAFAFA]"
      style={{ height: "1000vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Title overlay - Empurrado mais para cima para não cobrir o hambúrguer */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute top-4 sm:top-8 left-0 right-0 text-center z-20 pointer-events-none"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-orange-500 mb-1 sm:mb-2">
            A Experiência Fogo &amp; Chapa
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.95] tracking-tighter text-gray-900 drop-shadow-sm">
            Triplex
            <br />
            <span className="text-orange-500">Burguer</span>
          </h2>
          <p className="mt-2 text-gray-500 font-medium uppercase tracking-widest text-xs sm:text-sm">
            A anatomia de um gigante
          </p>
        </motion.div>

        {/* Video Frames Scrubbing via Canvas */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain max-w-5xl mx-auto"
            style={{ mixBlendMode: 'multiply' }}
          />
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA] z-50">
              <div className="text-orange-500 font-bold animate-pulse">Montando o Triplex...</div>
            </div>
          )}
        </div>

        {/* Bottom label - Empurrado para o extremo inferior da tela */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center z-20 pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl inline-block shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <h3 className="text-lg sm:text-xl text-gray-900 font-black uppercase tracking-tight mb-1">
              Triplex Burguer
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-sm mx-auto leading-snug">
              Três carnes suculentas na brasa, queijo derretido e pão tostado. Preparo absurdo.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-orange-500/30 pointer-events-auto"
              >
                Pedir Agora
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}