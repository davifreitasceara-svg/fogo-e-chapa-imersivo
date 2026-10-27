import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Crown, Flame, ShoppingBag, Sparkles, Users, type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import burgerBrasa from "@/assets/burger-brasa.png";
import burgerInferno from "@/assets/burger-inferno.png";
import burgerClassico from "@/assets/burger-classico.png";
import cocaColaCutout from "@/assets/coca-cola-cutout.png";
import beerCutout from "@/assets/beer-cutout.png";
import lemonadeCutout from "@/assets/lemonade-cutout.png";

type Combo = {
  id: number;
  tag: string;
  tagIcon: LucideIcon;
  title1: string;
  title2: string;
  desc: string;
  items: string[];
  price: number;
  burger: { src: string; alt: string };
  drink: { src: string; alt: string };
  side?: string;
  rgb: string;
  accentColor: string;
  bgWatermark: string;
};

const COMBOS: Combo[] = [
  {
    id: 401,
    tag: "Triplo Sabor",
    tagIcon: Flame,
    title1: "TRIPA EM",
    title2: "TRIPLO",
    desc: "A combinação suprema com tiras crocantes, burger na brasa artesanal e o legítimo Seca-nunca trincando de gelado.",
    items: ["Tiras do tripa", "Tripa jr", "Seca-nunca"],
    price: 35,
    burger: { src: burgerBrasa, alt: "Burger Brasa" },
    drink: { src: cocaColaCutout, alt: "Refrigerante gelado" },
    side: "/appetizer_chicken.png",
    rgb: "245, 158, 11",
    accentColor: "#f59e0b",
    bgWatermark: "TRIPLO",
  },
  {
    id: 402,
    tag: "Tamanho Família",
    tagIcon: Users,
    title1: "ARISTO",
    title2: "FOME",
    desc: "Para quem não brinca em serviço: o colossal Davi vs Golias com chopp artesanal e porção reforçada de tiras.",
    items: ["Davi vs Golias", "Seca-nunca", "Tiras do tripa"],
    price: 60,
    burger: { src: burgerInferno, alt: "Burger Inferno" },
    drink: { src: beerCutout, alt: "Chopp gelado" },
    side: "/fries_cheddar.png",
    rgb: "239, 68, 68",
    accentColor: "#ef4444",
    bgWatermark: "ARISTO",
  },
  {
    id: 403,
    tag: "Seleção Real",
    tagIcon: Crown,
    title1: "FOME DOS",
    title2: "REIS",
    desc: "Experiência gastronômica da realeza: burger triplex premium, batatas reais e suco natural Gole de Martins.",
    items: ["Batatas reais", "Triplex burguer", "Gole de Martins"],
    price: 70,
    burger: { src: burgerClassico, alt: "Burger Clássico" },
    drink: { src: lemonadeCutout, alt: "Gole de Martins" },
    side: "/appetizer_croquettes.png",
    rgb: "168, 85, 247",
    accentColor: "#a855f7",
    bgWatermark: "REIS",
  },
];

// Rising ember particles floating around the active combo
const EMBERS = Array.from({ length: 8 }, (_, i) => ({
  left: `${15 + ((i * 31) % 70)}%`,
  delay: (i % 4) * 0.5 + i * 0.12,
  duration: 2.8 + (i % 3) * 0.7,
  size: 2 + (i % 3),
}));

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ComboCards({
  onAdd,
}: {
  onAdd: (id: number, e: React.MouseEvent) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const slideLeft = () => {
    setCurrentIndex((prev) => (prev === COMBOS.length - 1 ? 0 : prev + 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => (prev === 0 ? COMBOS.length - 1 : prev - 1));
  };

  const currentCombo = COMBOS[currentIndex]!;
  const TagIcon = currentCombo.tagIcon;

  return (
    <div className="relative w-full overflow-hidden select-none py-6 sm:py-10">
      {/* Dynamic Ambient Background Glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-700"
        animate={{
          background: `radial-gradient(ellipse 70% 60% at 65% 50%, rgba(${currentCombo.rgb}, 0.22) 0%, transparent 80%)`,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Giant Typography Watermark Background */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-[0.04]">
        <motion.div
          key={currentCombo.bgWatermark}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display font-black text-white text-[26vw] md:text-[20vw] lg:text-[17vw] leading-none whitespace-nowrap tracking-tighter"
        >
          {currentCombo.bgWatermark}
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center px-4 sm:px-8 lg:px-12">
        {/* ==================================================================== */}
        {/* LEFT COLUMN: HERO INFORMATION (Title, Items, Price, CTA)             */}
        {/* ==================================================================== */}
        <div className="w-full md:w-5/12 flex flex-col justify-center z-30 pt-4 pb-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCombo.id}
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col"
            >
              {/* Badge Tag */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 sm:mb-6 w-fit backdrop-blur-md shadow-lg"
                style={{
                  backgroundColor: `rgba(${currentCombo.rgb}, 0.14)`,
                  borderColor: `rgba(${currentCombo.rgb}, 0.38)`,
                  color: currentCombo.accentColor,
                }}
              >
                <TagIcon className="size-4 animate-pulse" />
                <span className="font-display font-black text-xs tracking-[0.2em] uppercase">
                  {currentCombo.tag}
                </span>
              </div>

              {/* Huge Stylized Headline */}
              <div className="flex flex-col">
                <span
                  className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.88] font-black tracking-tighter text-transparent italic"
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.9)" }}
                >
                  {currentCombo.title1}
                </span>
                <span
                  className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.88] font-black tracking-tighter italic mt-1 drop-shadow-2xl"
                  style={{ color: currentCombo.accentColor }}
                >
                  {currentCombo.title2}
                </span>
              </div>

              {/* Combo Contents List with Icons */}
              <div className="mt-5 sm:mt-6 max-w-sm">
                <div className="flex flex-col gap-2.5 mb-5">
                  {currentCombo.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-white/90 text-xs sm:text-sm font-semibold tracking-wide"
                    >
                      <span
                        className="flex size-5 shrink-0 items-center justify-center rounded-full shadow-sm"
                        style={{
                          backgroundColor: `rgba(${currentCombo.rgb}, 0.22)`,
                          color: currentCombo.accentColor,
                        }}
                      >
                        <Check className="size-3 stroke-[3]" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <p className="text-white/75 text-xs sm:text-sm font-medium leading-relaxed mb-6 border-l-2 border-white/20 pl-3 sm:pl-4">
                  {currentCombo.desc}
                </p>

                {/* Price Tag & Order Button */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div
                    className="inline-block px-5 sm:px-6 py-2 rounded-2xl font-display font-black text-2xl sm:text-3xl md:text-4xl shadow-2xl transform -rotate-2 border-b-4 border-black/30 text-black"
                    style={{ backgroundColor: currentCombo.accentColor }}
                  >
                    {formatBRL(currentCombo.price)}
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.04 }}
                    onClick={(e) => onAdd(currentCombo.id, e)}
                    className="group flex items-center gap-2.5 sm:gap-3 rounded-full bg-white text-black px-6 sm:px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl transition-all duration-300 hover:bg-[#2B1B15] hover:text-white cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="size-4 transition-transform group-hover:scale-110" />
                    <span>PEDIR COMBO</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: 3D FREE-FLOATING COMBO STAGE (SEM FORMATO DE CAIXA)    */}
        {/* ==================================================================== */}
        <div className="w-full md:w-7/12 relative h-[320px] xs:h-[380px] sm:h-[450px] md:h-[520px] lg:h-[580px] flex items-center justify-center perspective-[1400px] overflow-hidden md:overflow-visible">
          {/* Dynamic Floor Shadow & Radiant Halo under active combo */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[72%] h-16 rounded-[100%] bg-black/85 blur-2xl pointer-events-none transition-all duration-700"
          />
          <motion.div
            aria-hidden
            animate={{
              boxShadow: `0 0 90px 30px rgba(${currentCombo.rgb}, 0.35)`,
            }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[48%] h-10 rounded-[100%] pointer-events-none"
          />

          {/* Floating Embers */}
          {EMBERS.map((ember, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute bottom-12 rounded-full z-30"
              style={{
                left: ember.left,
                width: ember.size,
                height: ember.size,
                backgroundColor: currentCombo.accentColor,
                boxShadow: `0 0 10px 2px rgba(${currentCombo.rgb}, 0.9)`,
              }}
              animate={{
                y: [0, -200],
                opacity: [0, 1, 0],
                x: [0, i % 2 ? 14 : -14],
              }}
              transition={{
                duration: ember.duration,
                delay: ember.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          {/* 3D Diagonal Floating Carousel of Combos */}
          {COMBOS.map((combo, index) => {
            let offset = index - currentIndex;
            if (offset < -1) offset += COMBOS.length;
            if (offset > 1) offset -= COMBOS.length;

            const isVisible = offset >= -1 && offset <= 1;
            if (!isVisible) return null;

            let x = 0;
            let y = 0;
            let scale = 1;
            let zIndex = 20;
            let rotate = 0;
            let opacity = 1;

            if (offset === 0) {
              x = 0;
              y = 0;
              scale = isMobile ? 1.08 : 1.25;
              zIndex = 30;
              rotate = 0;
              opacity = 1;
            } else if (offset === 1) {
              x = isMobile ? 110 : 220;
              y = isMobile ? -35 : -70;
              scale = isMobile ? 0.65 : 0.76;
              zIndex = 15;
              rotate = 12;
              opacity = 0.42;
            } else if (offset === -1) {
              x = isMobile ? -110 : -220;
              y = isMobile ? 35 : 70;
              scale = isMobile ? 0.65 : 0.76;
              zIndex = 15;
              rotate = -12;
              opacity = 0.42;
            }

            const isActive = offset === 0;

            return (
              <motion.div
                key={combo.id}
                className="absolute top-1/2 left-1/2 cursor-pointer will-change-transform"
                initial={false}
                animate={{
                  x: `calc(-50% + ${x}px)`,
                  y: `calc(-50% + ${y}px)`,
                  scale,
                  rotate,
                  zIndex,
                  opacity,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.32, 0.72, 0, 1],
                }}
                onClick={() => {
                  if (offset === 1) slideLeft();
                  if (offset === -1) slideRight();
                }}
                style={{ width: isMobile ? "280px" : "420px" }}
              >
                {/* Floating Elements Arena - Burger + Drink + Side composited in 3D */}
                <motion.div
                  className="relative w-full aspect-[4/3] flex items-center justify-center select-none"
                  animate={isActive ? { y: [0, -12, 0] } : { y: 0 }}
                  transition={{ y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" } }}
                >
                  {/* Drink (Behind, offset right) */}
                  <motion.div
                    className="absolute -right-2 sm:-right-4 bottom-4 sm:bottom-6 z-10 w-[42%] pointer-events-none"
                    animate={isActive ? { rotate: [6, 10, 6] } : { rotate: 6 }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img
                      src={combo.drink.src}
                      alt={combo.drink.alt}
                      draggable={false}
                      className="w-full object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.85)] filter contrast-110"
                    />
                  </motion.div>

                  {/* Burger (Foreground Hero) */}
                  <motion.div
                    className="absolute left-2 sm:left-4 bottom-1 sm:bottom-3 z-20 w-[72%] pointer-events-none"
                    animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img
                      src={combo.burger.src}
                      alt={combo.burger.alt}
                      draggable={false}
                      className="w-full object-contain drop-shadow-[0_28px_32px_rgba(0,0,0,0.92)] filter contrast-110"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM CONTROLS: PREVIOUS / NEXT ARROWS & INDICATOR DOTS             */}
      {/* ==================================================================== */}
      <div className="relative z-30 w-full flex items-center justify-center gap-4 mt-6 sm:mt-10">
        <button
          type="button"
          onClick={slideRight}
          className="group flex items-center gap-1.5 h-12 px-5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-transparent transition-all duration-300 shadow-xl cursor-pointer"
          aria-label="Combo anterior"
        >
          <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-display font-black text-xs uppercase tracking-wider hidden sm:inline">
            Anterior
          </span>
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-2 px-3">
          {COMBOS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className="h-2.5 rounded-full transition-all duration-500 cursor-pointer"
              style={{
                width: currentIndex === i ? "28px" : "8px",
                backgroundColor: currentIndex === i ? currentCombo.accentColor : "rgba(255,255,255,0.25)",
              }}
              aria-label={`Ir para combo ${c.tag}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={slideLeft}
          className="group flex items-center gap-1.5 h-12 px-5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-transparent transition-all duration-300 shadow-xl cursor-pointer"
          aria-label="Próximo combo"
        >
          <span className="font-display font-black text-xs uppercase tracking-wider hidden sm:inline">
            Próximo
          </span>
          <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
