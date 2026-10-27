import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LoginModal } from "@/components/LoginModal";
import { Can3DScene, MOBILE_DETAIL_SECTIONS } from "@/components/Can3D";
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

const MOBILE_SECTION_LABELS = ["Sabor", "Ingredientes", "Nutrição", "Peça já"];

// Card de vidro das seções mobile: anima ao entrar na tela (quando a lata termina o giro e trava de frente)
function MobileCard({
  children,
  scrollerRef,
}: {
  children: React.ReactNode;
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ root: scrollerRef, amount: 0.7 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="w-full rounded-[1.75rem] bg-black/35 backdrop-blur-xl border border-white/20 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      {children}
    </motion.div>
  );
}

function DrinksPage() {
  const [activeIndex, setActiveIndex] = useState(2); // 2 is Mango (center)
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'detail'>('carousel');
  const [detailScroll, setDetailScroll] = useState(0);
  const [mobileSection, setMobileSection] = useState(0);
  const { addToCart } = useCart();

  // --- Vitrine mobile: o scroll vira rotação da lata (1 seção = 1 giro de 360°) ---
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const lastSnapRef = useRef(0);

  const handleMobileScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const el = mobileScrollerRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      setDetailScroll(p);

      const pos = p * (MOBILE_DETAIL_SECTIONS - 1);
      const nearest = Math.round(pos);
      setMobileSection(nearest);

      // Quando trava exatamente de frente em uma nova seção: pequeno feedback tátil
      if (Math.abs(pos - nearest) < 0.015 && nearest !== lastSnapRef.current) {
        lastSnapRef.current = nearest;
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try { navigator.vibrate(12); } catch {}
        }
      }
    });
  }, []);

  useEffect(() => {
    if (viewMode === 'carousel') {
      setMobileSection(0);
      lastSnapRef.current = 0;
    }
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [viewMode]);

  const shiftLeft = () => {
    if (viewMode === 'detail') return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : DRINKS_DATA.length - 1));
  };

  const shiftRight = () => {
    if (viewMode === 'detail') return;
    setActiveIndex((prev) => (prev < DRINKS_DATA.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let accumulatedDeltaY = 0;
    let rafPending = false;

    const processDelta = (delta: number) => {
      if (viewMode === 'carousel') {
        if (delta > 40) {
          setViewMode('detail');
          setDetailScroll(Math.min(0.2, (delta - 40) * 0.0015));
        }
      } else if (viewMode === 'detail') {
        // No mobile a rolagem nativa (com snap) controla a lata
        if (typeof window !== 'undefined' && window.innerWidth < 768) return;
        if (delta > 0) {
          // Rola para baixo: acelera suco e inclina lata
          setDetailScroll((prev) => Math.min(1, prev + delta * 0.0015));
        } else if (delta < 0) {
          // Rola para cima
          setDetailScroll((prev) => {
            const next = prev + delta * 0.0015;
            if (next <= 0) {
              if (prev <= 0.02 && delta < -45) {
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
      touchStartX = e.touches[0]?.clientX ?? 0;
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchStartTime = Date.now();
      accumulatedDeltaY = 0;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX;
      const touchEndY = e.changedTouches[0]?.clientY ?? touchStartY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;
      const timeDiff = Date.now() - touchStartTime;

      // Se foi um toque rápido (< 500ms)
      if (timeDiff < 500) {
        // Gesto horizontal predominante: troca de bebida no carrossel
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
          if (viewMode === 'carousel') {
            if (deltaX > 0) {
              shiftRight();
            } else {
              shiftLeft();
            }
            return;
          }
        }

        // Gesto vertical no carrossel: deslizar para cima abre detalhes
        if (viewMode === 'carousel' && deltaY > 70 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
          setViewMode('detail');
          setDetailScroll(0);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      rafPending = false;
    };
  }, [viewMode]);

  const centerDrink = (DRINKS_DATA[activeIndex] || DRINKS_DATA[0])!;

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
              className="mt-auto w-full max-w-[1600px] mx-auto flex flex-col xl:flex-row items-center xl:items-end justify-between z-10 pb-6 sm:pb-12 px-4 sm:px-8 md:px-16 absolute bottom-0 left-0 right-0 pointer-events-auto gap-4"
            >
          
          {/* Left Text - Desktop only to prevent overlapping */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hidden xl:block flex-1 pb-2"
          >
            <div className="inline-block p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <h1 className="text-3xl lg:text-4xl xl:text-[2.5rem] font-black text-white leading-[1.05] tracking-tight">
                Sabor refrescante.<br /> 
                <span className="text-white/70">Nada mais.</span>
              </h1>
            </div>
          </motion.div>

          {/* Centered Info & Arrows */}
          <div className="w-full xl:w-auto xl:absolute xl:left-1/2 xl:bottom-12 xl:-translate-x-1/2 flex items-center justify-center gap-3 sm:gap-6 md:gap-10 mx-auto px-2">
            
            <button 
              onClick={shiftLeft}
              className="size-10 sm:size-12 shrink-0 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer active:scale-95 shadow-md"
              aria-label="Bebida anterior"
            >
              <ArrowLeft size={18} />
            </button>
            
            <div className="flex flex-col items-center max-w-[260px] xs:max-w-[300px] sm:max-w-none text-center">
              <motion.h2 
                key={centerDrink.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white lowercase tracking-tighter mb-1 sm:mb-2 truncate max-w-full"
              >
                {centerDrink.name}
              </motion.h2>
              <motion.div 
                key={centerDrink.id + "sub"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
              >
                <span>0{DRINKS_DATA.findIndex(d => d.id === centerDrink.id) + 1} / 0{DRINKS_DATA.length}</span>
                <span>·</span>
                <span>{centerDrink.description}</span>
              </motion.div>
              
              {/* Pagination Dots */}
              <div className="flex gap-2 mt-3 sm:mt-5">
                {DRINKS_DATA.map((d, i) => (
                  <button 
                    key={d.id} 
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Ver bebida ${d.name}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} 
                  />
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-5">
                <button
                  onClick={() => {
                    addToCart({
                      name: centerDrink.name,
                      price: centerDrink.price,
                      image: centerDrink.fruitImage,
                    });
                    toast.success(`${centerDrink.name} adicionado à sacola!`);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-black hover:bg-white/90 font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                  <ShoppingBag size={14} className="sm:size-4" />
                  <span>Adicionar · {centerDrink.price}</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('detail');
                    setDetailScroll(0);
                  }}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Ver Detalhes ↓
                </button>
              </div>

              {/* Dica de Swipe no Celular */}
              <p className="text-[10px] text-white/75 font-semibold uppercase tracking-wider mt-2 block sm:hidden select-none">
                ← Deslize para trocar de sabor →
              </p>
            </div>

            <button 
              onClick={shiftRight}
              className="size-10 sm:size-12 shrink-0 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer active:scale-95 shadow-md"
              aria-label="Próxima bebida"
            >
              <ArrowRight size={18} />
            </button>

          </div>

          {/* Right spacer for centering balance & Scroll Indicator */}
          <div 
            onClick={() => {
              setViewMode('detail');
              setDetailScroll(0);
            }}
            className="hidden xl:flex flex-1 flex-col items-end justify-end pb-4 cursor-pointer group"
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

        {/* --- DETAIL MODE (MOBILE): VITRINE GIRATÓRIA COM SNAP --- */}
        {/* Cada seção = 1 giro completo de 360° da lata. O scroll-snap trava a rolagem sempre com a lata de frente. */}
        <AnimatePresence>
          {viewMode === 'detail' && (
            <motion.div
              key="mobile-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="md:hidden absolute inset-0 z-10 pointer-events-auto"
            >
              {/* Barra superior fixa */}
              <div className="absolute top-[84px] inset-x-0 z-30 flex items-center justify-between px-4 pointer-events-none">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('carousel');
                    setDetailScroll(0);
                  }}
                  className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-lg border border-white/20 active:scale-95 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15 tabular-nums">
                  {MOBILE_SECTION_LABELS[mobileSection]} · {mobileSection + 1}/{MOBILE_DETAIL_SECTIONS}
                </span>
              </div>

              {/* Indicador vertical de giros (direita) */}
              <div className="absolute right-3 top-[36%] -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
                {Array.from({ length: MOBILE_DETAIL_SECTIONS }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${i === mobileSection ? 'h-6 bg-white' : 'h-1.5 bg-white/40'}`}
                  />
                ))}
              </div>

              {/* Container com scroll-snap obrigatório */}
              <div
                ref={mobileScrollerRef}
                onScroll={handleMobileScroll}
                className="absolute inset-0 overflow-y-auto snap-y snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* 1. Apresentação */}
                <section className="snap-start snap-always h-full flex flex-col justify-end px-4 pb-8">
                  <MobileCard scrollerRef={mobileScrollerRef}>
                    <span className="inline-block px-3 py-1 rounded-full border border-white/40 text-[10px] font-bold tracking-widest uppercase text-white/85">
                      {centerDrink.indexLabel}
                    </span>
                    <h2 className="mt-2 text-5xl font-black leading-none tracking-tighter lowercase text-white drop-shadow-md">
                      {centerDrink.logoText}
                    </h2>
                    <p className="mt-3 text-[15px] font-bold leading-snug text-white/95">
                      {centerDrink.fullDesc}
                    </p>
                    <motion.p
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                      className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/70"
                    >
                      ↓ Role para girar a lata
                    </motion.p>
                  </MobileCard>
                </section>

                {/* 2. Ingredientes */}
                <section className="snap-start snap-always h-full flex flex-col justify-end px-4 pb-8">
                  <MobileCard scrollerRef={mobileScrollerRef}>
                    <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                      Ingredientes Naturais
                    </span>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-white/95">
                      {centerDrink.ingredients}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {centerDrink.ingredientTags?.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-white/15 border border-white/25"
                        >
                          ✦ {tag}
                        </span>
                      ))}
                    </div>
                  </MobileCard>
                </section>

                {/* 3. Tabela nutricional */}
                <section className="snap-start snap-always h-full flex flex-col justify-end px-4 pb-8">
                  <MobileCard scrollerRef={mobileScrollerRef}>
                    <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                      Por lata · 330 ml
                    </span>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        { label: "Energia", value: centerDrink.kcal },
                        { label: "Fruta", value: centerDrink.juice },
                        { label: "Açúcar", value: centerDrink.sugar },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl bg-white/10 border border-white/20 px-2 py-3 text-center"
                        >
                          <div className="text-[9px] font-black uppercase tracking-widest text-white/60">
                            {stat.label}
                          </div>
                          <div className="mt-1 text-sm font-black text-white leading-tight">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </MobileCard>
                </section>

                {/* 4. Comprar */}
                <section className="snap-start snap-always h-full flex flex-col justify-end px-4 pb-8">
                  <MobileCard scrollerRef={mobileScrollerRef}>
                    <div className="flex items-center gap-3">
                      <img
                        src={centerDrink.fruitImage}
                        alt={centerDrink.name}
                        className="size-16 rounded-2xl object-cover border border-white/25 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-black uppercase tracking-wider text-white/70">
                          Gelada e pronta
                        </div>
                        <div className="text-lg font-black text-white truncate">{centerDrink.name}</div>
                        <div className="text-2xl font-black text-white">{centerDrink.price}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCart({
                          name: centerDrink.name,
                          price: centerDrink.price,
                          image: centerDrink.fruitImage,
                        });
                        toast.success(`${centerDrink.name} adicionado à sacola!`);
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black font-black text-sm uppercase tracking-wider shadow-2xl active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag size={16} /> Adicionar à sacola
                    </button>
                    <button
                      type="button"
                      onClick={() => mobileScrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                      className="mt-2 w-full py-2 text-[11px] font-black uppercase tracking-wider text-white/75 cursor-pointer"
                    >
                      ↑ Girar de volta ao início
                    </button>
                  </MobileCard>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DETAIL MODE (DESKTOP/TABLET): INFORMATION LAYER --- */}
        <AnimatePresence>
          {viewMode === 'detail' && (
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 hidden md:flex flex-col lg:flex-row items-center justify-between z-10 pt-16 sm:pt-20 pb-24 sm:pb-12 overflow-y-auto lg:overflow-hidden pointer-events-auto"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* Left Text Content */}
              <div className="flex-1 w-full flex flex-col space-y-3 sm:space-y-5 max-w-xl py-2 sm:py-4" style={{ color: centerDrink.textColor }}>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.8, y: 0 }} transition={{ delay: 0.1 }}
                  className="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase w-max"
                  style={{ borderColor: centerDrink.textColor }}
                >
                  {centerDrink.indexLabel}
                </motion.span>
                
                <motion.h2 
                  key={centerDrink.id + "title"}
                  initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] font-black leading-none tracking-tighter lowercase drop-shadow-md"
                >
                  {centerDrink.logoText}
                </motion.h2>
                
                <motion.div 
                  key={centerDrink.id + "desc"}
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }}
                  className="space-y-2 sm:space-y-3 max-w-md"
                >
                  <p className="text-base sm:text-xl lg:text-2xl font-bold leading-snug">
                    {centerDrink.fullDesc}
                  </p>

                  {/* Ingredientes Detalhados */}
                  <div className="pt-2 pb-1 border-t border-current/20">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider opacity-75 block mb-1">
                      Ingredientes Naturais:
                    </span>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                      {centerDrink.ingredients}
                    </p>
                  </div>

                  {/* Tags dos Ingredientes Principais */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {centerDrink.ingredientTags?.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/15 backdrop-blur-sm border border-white/20"
                        style={{ borderColor: centerDrink.textColor }}
                      >
                        ✦ {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-4"
                >
                  <span className="border-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm bg-white/10 backdrop-blur-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.kcal}
                  </span>
                  <span className="border-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm bg-white/10 backdrop-blur-sm" style={{ borderColor: centerDrink.textColor }}>
                    {centerDrink.juice}
                  </span>
                  <span className="border-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm bg-white/10 backdrop-blur-sm" style={{ borderColor: centerDrink.textColor }}>
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
                    className="flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-black hover:bg-white/90 font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    <span>Adicionar · {centerDrink.price}</span>
                  </button>
                </motion.div>

                {/* Interactive Scroll / Waterfall Controller */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-4 select-none"
                >
                  <button
                    onClick={() => setDetailScroll((prev) => (prev > 0.85 ? 0 : Math.min(1, prev + 0.35)))}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
                      {detailScroll > 0.85 ? "Reiniciar Cascata" : "Rolar / Acelerar Líquido"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('carousel');
                      setDetailScroll(0);
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    ← Carrossel
                  </button>

                  <div className="w-20 sm:w-24 h-2 bg-white/25 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-[width] duration-75 ease-out"
                      style={{ width: `${Math.max(12, detailScroll * 100)}%` }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Center spacer for 3D Can to shine through */}
              <div className="hidden lg:block w-[15%] xl:w-[25%]"></div>

              {/* Right Fruit Image */}
              <div className="w-full lg:flex-1 flex justify-center lg:justify-end h-[220px] sm:h-[300px] lg:h-[55vh] relative pointer-events-auto pr-0 lg:pr-8 overflow-hidden items-center mt-4 lg:mt-0">
                <motion.div
                  key={centerDrink.id}
                  initial={{ opacity: 0, scale: 0.88, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: 40 }}
                  transition={{ type: "spring", stiffness: 85, damping: 18, delay: 0.15 }}
                  whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3 } }}
                  className="h-full w-full max-w-xs sm:max-w-sm rounded-[2rem] sm:rounded-[2.5rem] p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.45)] cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={centerDrink.fruitImage}
                    alt={centerDrink.name}
                    className="w-full h-full object-cover rounded-[1.7rem] sm:rounded-[2.1rem]"
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
