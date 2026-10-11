import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { Can3DScene } from "@/components/Can3D";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import drinkLimao from "@/assets/drink-limao.jpg";
import drinkMorango from "@/assets/drink-morango.jpg";
import drinkManga from "@/assets/drink-manga.jpg";
import drinkLaranja from "@/assets/orange-juice.jpg";
import drinkUva from "@/assets/drink-uva.jpg";

export const Route = createFileRoute("/drinks")({
  component: DrinksPage,
});

const DRINKS_DATA = [
  { 
    id: "1", 
    name: "Fogo e Chapa Morango", 
    price: "R$ 9,90", 
    color: "#E60000", 
    logoText: "morango", 
    subTitle: "fogo e chapa", 
    description: "& frutas vermelhas · 330 ml", 
    icon: "🍓",
    indexLabel: "01 — & RED BERRIES", 
    fullDesc: "Morangos frescos colhidos no ponto certo com finalização crocante e refrescante.", 
    ingredients: "Água gaseificada, suco concentrado de morango, extrato de framboesa, amora silvestre e vitamina C. 100% natural, sem corantes e sem adição de açúcares.",
    ingredientTags: ["Morango Silvestre", "Amora & Framboesa", "Água Gaseificada", "Sem Açúcar Adicionado"],
    kcal: "45 kcal", 
    juice: "30% suco", 
    sugar: "Zero açúcar",
    fruitImage: drinkMorango,
    textColor: "#ffffff"
  },
  { 
    id: "2", 
    name: "Fogo e Chapa Limão", 
    price: "R$ 9,90", 
    color: "#009c5b", 
    logoText: "limão", 
    subTitle: "fogo e chapa", 
    description: "& toque cítrico · 330 ml", 
    icon: "🍋",
    indexLabel: "02 — & LIME CITRUS", 
    fullDesc: "Explosão cítrica marcante de limões frescos com retrogosto suave e refrescante.", 
    ingredients: "Água gaseificada, suco prensado de limão tahiti, raspas de limão siciliano, extrato natural de hortelã e vitamina C. Sem conservantes artificiais.",
    ingredientTags: ["Limão Tahiti & Siciliano", "Extrato de Hortelã", "Água Gaseificada", "Zero Conservantes"],
    kcal: "35 kcal", 
    juice: "20% suco", 
    sugar: "Zero açúcar",
    fruitImage: drinkLimao,
    textColor: "#ffffff"
  },
  { 
    id: "3", 
    name: "Fogo e Chapa Manga", 
    price: "R$ 9,90", 
    color: "#F49F2A", 
    logoText: "manga", 
    subTitle: "fogo e chapa", 
    description: "& maracujá doce · 330 ml", 
    icon: "🥭",
    indexLabel: "03 — & PASSION FRUIT", 
    fullDesc: "A suculência tropical da manga palmer em perfeita harmonia com o azedinho do maracujá.", 
    ingredients: "Água gaseificada, polpa natural de manga palmer, suco concentrado de maracujá doce e vitamina C. Feito apenas com frutas selecionadas.",
    ingredientTags: ["Manga Palmer", "Maracujá Doce", "Água Gaseificada", "Vitamina C"],
    kcal: "48 kcal", 
    juice: "25% suco", 
    sugar: "Zero açúcar",
    fruitImage: drinkManga,
    textColor: "#3e2723"
  },
  { 
    id: "4", 
    name: "Fogo e Chapa Laranja", 
    price: "R$ 9,90", 
    color: "#F47920", 
    logoText: "laranja", 
    subTitle: "fogo e chapa", 
    description: "& tangerina fresca · 330 ml", 
    icon: "🍊",
    indexLabel: "04 — & FRESH TANGERINE", 
    fullDesc: "Sabor ensolarado e vibrante da laranja pera prensada com o perfume cítrico da tangerina fresca.", 
    ingredients: "Água gaseificada, suco natural de laranja pera prensada a frio, suco de tangerina fresca, raspas cítricas e vitamina C. 100% natural, sem conservantes.",
    ingredientTags: ["Laranja Pera", "Tangerina Fresca", "Água Gaseificada", "100% Suco"],
    kcal: "42 kcal", 
    juice: "28% suco", 
    sugar: "Zero açúcar",
    fruitImage: drinkLaranja,
    textColor: "#ffffff"
  },
  { 
    id: "5", 
    name: "Fogo e Chapa Uva", 
    price: "R$ 9,90", 
    color: "#662D91", 
    logoText: "uva", 
    subTitle: "fogo e chapa", 
    description: "& açaí silvestre · 330 ml", 
    icon: "🍇",
    indexLabel: "05 — & WILD AÇAÍ", 
    fullDesc: "Uvas concord encorpadas e aveludadas enriquecidas com o poder antioxidante do açaí puro.", 
    ingredients: "Água gaseificada, suco integral de uva concord, polpa pura de açaí silvestre orgânico e vitamina C. Sem adição de açúcares ou corantes.",
    ingredientTags: ["Uva Concord", "Açaí Silvestre Orgânico", "Água Gaseificada", "Rico em Antioxidantes"],
    kcal: "50 kcal", 
    juice: "35% suco", 
    sugar: "Zero açúcar",
    fruitImage: drinkUva,
    textColor: "#ffffff"
  },
];

function DrinksPage() {
  const [activeIndex, setActiveIndex] = useState(2); // 2 is Mango (center)
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'detail'>('carousel');
  const [detailScroll, setDetailScroll] = useState(0);
  const { addToCart } = useCart();

  const shiftLeft = () => {
    if (viewMode === 'detail') return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : DRINKS_DATA.length - 1));
  };

  const shiftRight = () => {
    if (viewMode === 'detail') return;
    setActiveIndex((prev) => (prev < DRINKS_DATA.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    let touchStartY = 0;
    let accumulatedDeltaY = 0;
    let rafPending = false;

    const processDelta = (delta: number) => {
      if (viewMode === 'carousel') {
        if (delta > 25) {
          setViewMode('detail');
          setDetailScroll(Math.min(0.2, (delta - 25) * 0.0015));
        }
      } else if (viewMode === 'detail') {
        if (delta > 0) {
          // Rola para baixo: a lata desce suavemente e o suco acelera em volta
          setDetailScroll((prev) => Math.min(1, prev + delta * 0.0015));
        } else if (delta < 0) {
          // Rola para cima: a lata sobe
          setDetailScroll((prev) => {
            const next = prev + delta * 0.0015;
            if (next <= 0) {
              if (prev <= 0.02 && delta < -30) {
                setViewMode('carousel');
              }
              return 0;
            }
            return next;
          });
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      accumulatedDeltaY += e.deltaY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          const delta = accumulatedDeltaY;
          accumulatedDeltaY = 0;
          rafPending = false;
          processDelta(delta);
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      accumulatedDeltaY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const clientY = e.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - clientY;
      touchStartY = clientY;

      accumulatedDeltaY += deltaY * 2.2;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          const delta = accumulatedDeltaY;
          accumulatedDeltaY = 0;
          rafPending = false;
          processDelta(delta);
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      rafPending = false;
    };
  }, [viewMode]);

  const centerDrink = DRINKS_DATA[activeIndex] || DRINKS_DATA[0];

  return (
    <motion.div 
      className="relative h-screen overflow-hidden font-display flex flex-col"
      style={{ backgroundColor: centerDrink.color }}
      animate={{ backgroundColor: centerDrink.color }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <AnimatePresence>
        {loginOpen && <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative w-full h-full pt-16">
        
        {/* --- 3D SCENE (Shared across both modes) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Can3DScene 
            drinks={DRINKS_DATA} 
            activeIndex={activeIndex} 
            viewMode={viewMode} 
            detailScroll={detailScroll} 
          />
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
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex-1 pb-2"
          >
            <div className="inline-block p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <h1 className="text-4xl sm:text-[2.75rem] font-black text-white leading-[1.05] tracking-tight">
                Sabor refrescante.<br /> 
                <span className="text-white/70">Nada mais.</span>
              </h1>
            </div>
          </motion.div>

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

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    addToCart({
                      name: centerDrink.name,
                      price: centerDrink.price,
                      image: centerDrink.fruitImage,
                    });
                    toast.success(`${centerDrink.name} adicionado à sacola!`);
                  }}
                  className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-white/90 font-black text-xs uppercase tracking-wider transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Adicionar à Sacola · {centerDrink.price}</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('detail');
                    setDetailScroll(0);
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Ver Detalhes ↓
                </button>
              </div>
            </div>

            <button 
              onClick={shiftRight}
              className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <ArrowRight size={20} />
            </button>

          </div>

            {/* Right spacer for centering balance & Scroll Indicator */}
            <div 
              onClick={() => {
                setViewMode('detail');
                setDetailScroll(0);
              }}
              className="flex-1 flex flex-col items-end justify-end pb-4 cursor-pointer group"
            >
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-white text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-yellow-300 transition-colors">Role p/ baixo</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
              </motion.div>
            </div>
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
                <motion.span 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.8, y: 0 }} transition={{ delay: 0.1 }}
                  className="inline-block px-4 py-1.5 rounded-full border-2 text-xs font-bold tracking-widest uppercase w-max"
                  style={{ borderColor: centerDrink.textColor }}
                >
                  {centerDrink.indexLabel}
                </motion.span>
                
                <motion.h2 
                  key={centerDrink.id + "title"}
                  initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="text-7xl sm:text-[8rem] font-black leading-none tracking-tighter lowercase drop-shadow-md"
                >
                  {centerDrink.logoText}
                </motion.h2>
                
                <motion.div 
                  key={centerDrink.id + "desc"}
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }}
                  className="space-y-3 max-w-md"
                >
                  <p className="text-xl sm:text-2xl font-bold leading-snug">
                    {centerDrink.fullDesc}
                  </p>

                  {/* Ingredientes Detalhados */}
                  <div className="pt-2 pb-1 border-t border-current/20">
                    <span className="text-xs font-black uppercase tracking-wider opacity-75 block mb-1">
                      Ingredientes Naturais:
                    </span>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                      {centerDrink.ingredients}
                    </p>
                  </div>

                  {/* Tags dos Ingredientes Principais */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {centerDrink.ingredientTags?.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-sm border border-white/20"
                        style={{ borderColor: centerDrink.textColor }}
                      >
                        ✦ {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-4 pt-4"
                >
                  <span className="border-2 px-5 py-2 rounded-full font-bold text-sm bg-white/10 backdrop-blur-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.kcal}
                  </span>
                  <span className="border-2 px-5 py-2 rounded-full font-bold text-sm bg-white/10 backdrop-blur-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.juice}
                  </span>
                  <span className="border-2 px-5 py-2 rounded-full font-bold text-sm bg-white/10 backdrop-blur-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.sugar}
                  </span>

                  <button
                    onClick={() => {
                      addToCart({
                        name: centerDrink.name,
                        price: centerDrink.price,
                        image: centerDrink.fruitImage,
                      });
                      toast.success(`${centerDrink.name} adicionado à sacola!`);
                    }}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-black hover:bg-white/90 font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
                  >
                    <ShoppingBag size={18} />
                    <span>Adicionar à Sacola · {centerDrink.price}</span>
                  </button>
                </motion.div>

                {/* Interactive Scroll / Waterfall Controller (Posicionado aqui para não obstruir a lata no centro) */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center gap-3 pt-4 select-none"
                >
                  <button
                    onClick={() => setDetailScroll((prev) => (prev > 0.85 ? 0 : Math.min(1, prev + 0.35)))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {detailScroll > 0.85 ? "Reiniciar Cascata" : "Rolar / Acelerar Líquido"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('carousel');
                      setDetailScroll(0);
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    ← Carrossel
                  </button>

                  <div className="w-24 h-2 bg-white/25 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-[width] duration-75 ease-out"
                      style={{ width: `${Math.max(12, detailScroll * 100)}%` }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Center spacer for 3D Can to shine through */}
              <div className="w-[20%] md:w-[30%]"></div>

              {/* Right Fruit Image */}
              <div className="flex-1 flex justify-end h-[40vh] md:h-[60vh] relative pointer-events-auto pr-8 overflow-hidden items-center">
                <motion.div
                  key={centerDrink.id}
                  initial={{ opacity: 0, scale: 0.88, y: 140 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: 140 }}
                  transition={{ type: "spring", stiffness: 85, damping: 18, delay: 0.15 }}
                  whileHover={{ scale: 1.03, y: -6, transition: { duration: 0.3 } }}
                  className="h-full w-full max-w-md rounded-[2.5rem] p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.45)] cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={centerDrink.fruitImage}
                    alt={centerDrink.name}
                    className="w-full h-full object-cover rounded-[2.1rem]"
                  />
                </motion.div>
              </div>


            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </motion.div>
  );
}
