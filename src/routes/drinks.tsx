import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { Can3DScene } from "@/components/Can3D";

export const Route = createFileRoute("/drinks")({
  component: DrinksPage,
});

const DRINKS_DATA = [
  { 
    id: "1", name: "Brio Morango", color: "#E60000", logoText: "morango", subTitle: "brio", description: "& frutas vermelhas · 330 ml", icon: "🍓",
    indexLabel: "01 — & RED BERRIES", fullDesc: "Sweet strawberries first, then a very crisp finish.", kcal: "45 kcal", juice: "30% juice", sugar: "No added sugar",
    fruitImage: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1000&auto=format&fit=crop",
    textColor: "#ffffff"
  },
  { 
    id: "2", name: "Brio Limão", color: "#009c5b", logoText: "limão", subTitle: "brio", description: "& toque cítrico · 330 ml", icon: "🍋",
    indexLabel: "02 — & LIME CITRUS", fullDesc: "A burst of lemon with a refreshing lime aftertaste.", kcal: "35 kcal", juice: "20% juice", sugar: "No added sugar",
    fruitImage: "https://images.unsplash.com/photo-1590502593747-4229879f758f?q=80&w=1000&auto=format&fit=crop",
    textColor: "#ffffff"
  },
  { 
    id: "3", name: "Brio Manga", color: "#F49F2A", logoText: "manga", subTitle: "brio", description: "& maracujá doce · 330 ml", icon: "🥭",
    indexLabel: "03 — & PASSION FRUIT", fullDesc: "Ripe mango first, then a sour little kick.", kcal: "48 kcal", juice: "25% juice", sugar: "No added sugar",
    fruitImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop",
    textColor: "#3e2723"
  },
  { 
    id: "4", name: "Brio Laranja", color: "#F47920", logoText: "laranja", subTitle: "brio", description: "& tangerina fresca · 330 ml", icon: "🍊",
    indexLabel: "04 — & FRESH TANGERINE", fullDesc: "Sunny orange flavor blended with zesty tangerine.", kcal: "42 kcal", juice: "28% juice", sugar: "No added sugar",
    fruitImage: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1000&auto=format&fit=crop",
    textColor: "#ffffff"
  },
  { 
    id: "5", name: "Brio Uva", color: "#662D91", logoText: "uva", subTitle: "brio", description: "& açaí silvestre · 330 ml", icon: "🍇",
    indexLabel: "05 — & WILD AÇAÍ", fullDesc: "Rich concord grapes mixed with earthy açaí berries.", kcal: "50 kcal", juice: "35% juice", sugar: "No added sugar",
    fruitImage: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=1000&auto=format&fit=crop",
    textColor: "#ffffff"
  },
];

function DrinksPage() {
  const [activeIndex, setActiveIndex] = useState(2); // 2 is Mango (center)
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'detail'>('carousel');

  const shiftLeft = () => {
    if (viewMode === 'detail') return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : DRINKS_DATA.length - 1));
  };

  const shiftRight = () => {
    if (viewMode === 'detail') return;
    setActiveIndex((prev) => (prev < DRINKS_DATA.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Scroll down -> show details
      if (e.deltaY > 50 && viewMode === 'carousel') {
        setViewMode('detail');
      }
      // Scroll up -> return to carousel
      else if (e.deltaY < -50 && viewMode === 'detail') {
        setViewMode('carousel');
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [viewMode]);

  const centerDrink = DRINKS_DATA[activeIndex];

  return (
    <motion.div 
      className="relative h-screen overflow-hidden font-display flex flex-col"
      animate={{ backgroundColor: centerDrink.color }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <AnimatePresence>
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative w-full h-full pt-16">
        
        {/* --- 3D SCENE (Shared across both modes) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Can3DScene drinks={DRINKS_DATA} activeIndex={activeIndex} viewMode={viewMode} />
        </div>

        {/* --- CAROUSEL MODE: BOTTOM CONTROLS --- */}
        <AnimatePresence>
          {viewMode === 'carousel' && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-auto w-full max-w-[1600px] mx-auto flex items-end justify-between z-10 pb-12 px-8 sm:px-16 absolute bottom-0 left-0 right-0 pointer-events-auto"
            >
          
          {/* Left Text */}
          <div className="flex-1 pb-2">
            <h1 className="text-4xl sm:text-[2.75rem] font-black text-white leading-[1.05] tracking-tight">
              Sabor refrescante.<br /> Nada mais.
            </h1>
          </div>

          {/* Centered Info & Arrows */}
          <div className="absolute left-1/2 bottom-12 -translate-x-1/2 flex items-center gap-6 sm:gap-12">
            
            <button 
              onClick={shiftLeft}
              className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex flex-col items-center min-w-[280px]">
              <motion.h2 
                key={centerDrink.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-6xl font-black text-white lowercase tracking-tighter mb-2"
              >
                {centerDrink.name}
              </motion.h2>
              <motion.div 
                key={centerDrink.id + "sub"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold text-sm flex items-center gap-2"
              >
                <span>0{DRINKS_DATA.findIndex(d => d.id === centerDrink.id) + 1} / 0{DRINKS_DATA.length}</span>
                <span>·</span>
                <span>{centerDrink.description}</span>
              </motion.div>
              
              {/* Pagination Dots */}
              <div className="flex gap-2 mt-6">
                {DRINKS_DATA.map((d, i) => (
                  <div 
                    key={d.id} 
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} 
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={shiftRight}
              className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <ArrowRight size={20} />
            </button>

          </div>

            {/* Right spacer for centering balance */}
            <div className="flex-1"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DETAIL MODE: INFORMATION LAYER --- */}
        <AnimatePresence>
          {viewMode === 'detail' && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 w-full max-w-[1600px] mx-auto px-8 sm:px-16 flex items-center pointer-events-none z-10 pt-20 pb-12"
            >
              {/* Left Text Content */}
              <div className="flex-1 flex flex-col space-y-6 pointer-events-auto" style={{ color: centerDrink.textColor }}>
                <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                  {centerDrink.indexLabel}
                </span>
                <h2 className="text-7xl sm:text-[8rem] font-black leading-none tracking-tighter lowercase drop-shadow-md">
                  {centerDrink.logoText}
                </h2>
                <p className="text-xl sm:text-2xl font-bold opacity-90 max-w-md">
                  {centerDrink.fullDesc}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="border px-5 py-2 rounded-full font-bold text-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.kcal}
                  </span>
                  <span className="border px-5 py-2 rounded-full font-bold text-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.juice}
                  </span>
                  <span className="border px-5 py-2 rounded-full font-bold text-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.sugar}
                  </span>
                </div>
              </div>

              {/* Center spacer for 3D Can to shine through */}
              <div className="w-[20%] md:w-[30%]"></div>

              {/* Right Fruit Image */}
              <div className="flex-1 flex justify-end h-[40vh] md:h-[60vh] relative pointer-events-auto pr-8">
                <motion.img
                  key={centerDrink.id}
                  src={centerDrink.fruitImage}
                  alt={centerDrink.name}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full w-full max-w-md object-cover rounded-[2rem] shadow-2xl"
                />
              </div>

              {/* Right Side Pagination Dots */}
              <div className="absolute right-4 sm:right-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 pointer-events-auto z-50">
                {DRINKS_DATA.map((drink, idx) => (
                  <button
                    key={drink.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      activeIndex === idx 
                        ? 'scale-125' 
                        : 'scale-100 opacity-60 hover:opacity-100 border-transparent'
                    }`}
                    style={{ 
                      backgroundColor: drink.color, 
                      borderColor: activeIndex === idx ? centerDrink.textColor : 'transparent' 
                    }}
                    aria-label={`Select ${drink.name}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </motion.div>
  );
}
