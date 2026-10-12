import React from "react";
import { motion } from "framer-motion";
import { Plus, Check, Flame } from "lucide-react";

interface ComboItem {
  id: number;
  badge: string;
  badgeColor: string;
  badgeBorder: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  price: string;
  accentColor: string;
  hoverBorder: string;
  hoverGlow: string;
  buttonClass: string;
  burgerImg: string;
  sideImg: string;
  drinkImg: string;
  isPopular?: boolean;
}

const COMBOS: ComboItem[] = [
  {
    id: 401,
    badge: "Triplo Sabor",
    badgeColor: "text-amber-400 bg-amber-400/10",
    badgeBorder: "border-amber-400/25",
    titlePrefix: "TRIPA EM",
    titleHighlight: "TRIPLO",
    description: "Acompanha tiras do tripa, tripa jr e seca-nunca gelado.",
    price: "35",
    accentColor: "#F59E0B",
    hoverBorder: "hover:border-amber-500/50",
    hoverGlow: "rgba(245, 158, 11, 0.2)",
    buttonClass: "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)]",
    burgerImg: "/burger-brasa_clean.png",
    sideImg: "/fries_conv_clean.png",
    drinkImg: "/coca-cola_clean.png",
  },
  {
    id: 402,
    badge: "Tamanho Família",
    badgeColor: "text-red-400 bg-red-500/10",
    badgeBorder: "border-red-500/30",
    titlePrefix: "ARISTO",
    titleHighlight: "FOME",
    description: "Davi vs Golias, seca-nunca, tiras do tripa. Você aguenta?",
    price: "60",
    accentColor: "#EF4444",
    hoverBorder: "hover:border-red-500/60 border-red-500/30",
    hoverGlow: "rgba(239, 68, 68, 0.25)",
    buttonClass: "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    burgerImg: "/burger-inferno_clean.png",
    sideImg: "/fries_cheddar_clean.png",
    drinkImg: "/beer_clean.png",
    isPopular: true,
  },
  {
    id: 403,
    badge: "Premium",
    badgeColor: "text-purple-300 bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    titlePrefix: "FOME DOS",
    titleHighlight: "REIS",
    description: "Batatas reais, triplex burguer e gole de Martins. Majestosa.",
    price: "70",
    accentColor: "#A855F7",
    hoverBorder: "hover:border-purple-500/50",
    hoverGlow: "rgba(168, 85, 247, 0.2)",
    buttonClass: "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]",
    burgerImg: "/burger-classico_clean.png",
    sideImg: "/fries_royal_clean.png",
    drinkImg: "/lemonade_clean.png",
  },
];

interface CombosSectionProps {
  onAddToCart: (id: number) => void;
  addedId?: number | null;
}

export function CombosSection({ onAddToCart, addedId }: CombosSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
      }}
      className="mt-16 pt-16 border-t border-white/10 w-full"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <h4 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
          COMBOS ESPECIAIS
        </h4>
        <p className="mt-3 text-base sm:text-lg font-medium opacity-70 text-white/80 max-w-xl">
          As combinações definitivas para matar qualquer fome.
        </p>
      </div>

      {/* Grid of 3 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-[1400px] mx-auto px-4 md:px-8">
        {COMBOS.map((combo) => {
          const isAdded = addedId === combo.id;

          return (
            <motion.div
              key={combo.id}
              whileHover={{ y: -10 }}
              className={`relative group rounded-[40px] p-7 sm:p-10 flex flex-col justify-between overflow-hidden bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-500 ${combo.hoverBorder}`}
            >
              {/* Radial ambient glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(circle at 50% 25%, ${combo.hoverGlow} 0%, transparent 70%)`,
                }}
              />

              {/* Top area: Badge */}
              <div className="flex items-center justify-between w-full mb-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest border uppercase ${combo.badgeColor} ${combo.badgeBorder}`}
                >
                  {combo.badge}
                </span>

                {combo.isPopular && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 uppercase tracking-wider">
                    <Flame className="size-3.5 fill-red-400 text-red-400" /> Mais Pedido
                  </span>
                )}
              </div>

              {/* 3D Visual Hero Stage (Clean Transparent Cutouts) */}
              <div className="relative h-[250px] sm:h-[270px] w-full flex items-center justify-center my-2 select-none">
                {/* Glow under plate */}
                <div
                  className="absolute bottom-2 w-44 h-10 rounded-[50%] blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, ${combo.accentColor} 0%, transparent 70%)`,
                  }}
                />
                <div className="absolute bottom-3 w-40 h-4 rounded-full bg-black/80 blur-md pointer-events-none" />

                {/* Left Side: Porção / Fritas */}
                <div className="absolute left-2 sm:left-4 bottom-4 z-10 w-[125px] sm:w-[145px] transition-transform duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-1">
                  <img
                    src={combo.sideImg}
                    alt="Acompanhamento"
                    className="w-full h-auto object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.85)] pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* Right Side: Bebida Gelada */}
                <div className="absolute right-2 sm:right-4 bottom-5 z-10 w-[85px] sm:w-[100px] transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-1">
                  <img
                    src={combo.drinkImg}
                    alt="Bebida"
                    className="w-full h-auto object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.9)] pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* Center: Hambúrguer na Brasa */}
                <div className="relative z-20 w-[185px] sm:w-[210px] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2">
                  <img
                    src={combo.burgerImg}
                    alt="Hambúrguer"
                    className="w-full h-auto object-contain filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.95)] pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col text-left mt-4 mb-8">
                <h4 className="font-display text-4xl sm:text-5xl font-black text-white uppercase mb-3 leading-[0.92] drop-shadow-md">
                  {combo.titlePrefix}
                  <br />
                  <span style={{ color: combo.accentColor }}>{combo.titleHighlight}</span>
                </h4>
                <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed">
                  {combo.description}
                </p>
              </div>

              {/* Footer: Price & Buy Button */}
              <div className="flex items-end justify-between w-full pt-6 border-t border-white/10 mt-auto">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                    Por apenas
                  </span>
                  <div className="flex items-baseline leading-none">
                    <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {combo.price}
                    </span>
                    <span
                      className="text-2xl font-bold ml-0.5"
                      style={{ color: combo.accentColor }}
                    >
                      ,00
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddToCart(combo.id)}
                  className={`h-14 sm:h-16 px-7 sm:px-8 rounded-full font-black uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-300 ${
                    isAdded
                      ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                      : combo.buttonClass
                  }`}
                >
                  {isAdded ? (
                    <>
                      <span>Adicionado</span>
                      <Check className="size-5 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      <span>Comprar</span>
                      <Plus className="size-5 stroke-[2.5]" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
