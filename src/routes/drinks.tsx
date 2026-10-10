import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { Can3DScene } from "@/components/Can3D";

export const Route = createFileRoute("/drinks")({
  component: DrinksPage,
});

const DRINKS_DATA = [
  { id: "1", name: "Brio Morango", color: "#E60000", logoText: "morango", subTitle: "brio", description: "& frutas vermelhas · 330 ml", icon: "🍓" },
  { id: "2", name: "Brio Limão", color: "#009c5b", logoText: "limão", subTitle: "brio", description: "& toque cítrico · 330 ml", icon: "🍋" },
  { id: "3", name: "Brio Manga", color: "#F49F2A", logoText: "manga", subTitle: "brio", description: "& maracujá doce · 330 ml", icon: "🥭" },
  { id: "4", name: "Brio Laranja", color: "#F47920", logoText: "laranja", subTitle: "brio", description: "& tangerina fresca · 330 ml", icon: "🍊" },
  { id: "5", name: "Brio Uva", color: "#662D91", logoText: "uva", subTitle: "brio", description: "& açaí silvestre · 330 ml", icon: "🍇" },
];

function DrinksPage() {
  const [activeIndex, setActiveIndex] = useState(2); // 2 is Mango (center)
  const [loginOpen, setLoginOpen] = useState(false);

  const shiftLeft = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : DRINKS_DATA.length - 1));
  };

  const shiftRight = () => {
    setActiveIndex((prev) => (prev < DRINKS_DATA.length - 1 ? prev + 1 : 0));
  };

  const centerDrink = DRINKS_DATA[activeIndex];

  return (
    <motion.div 
      className="relative min-h-screen overflow-hidden font-display flex flex-col"
      animate={{ backgroundColor: centerDrink.color }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <AnimatePresence>
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative w-full h-full pt-16">
        
        {/* --- CAROUSEL 3D CANS --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Can3DScene drinks={DRINKS_DATA} activeIndex={activeIndex} />
        </div>

        {/* --- BOTTOM CONTROLS --- */}
        <div className="mt-auto w-full max-w-[1600px] mx-auto flex items-end justify-between z-10 pb-12 px-8 sm:px-16 relative">
          
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
        </div>
        
      </div>
    </motion.div>
  );
}
