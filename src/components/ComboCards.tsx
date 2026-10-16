import { type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, Crown, Flame, Plus, Users, type LucideIcon } from "lucide-react";

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
  titleTop: string;
  titleAccent: string;
  /** Renders title on a single line ("Aristo" + "fome") instead of two lines. */
  inline?: boolean;
  items: string[];
  price: number;
  burger: { src: string; alt: string };
  drink: { src: string; alt: string };
  /** Accent as "r, g, b" so it can be reused inside rgba() for glows. */
  rgb: string;
  accentText: string;
  button: string;
};

const COMBOS: Combo[] = [
  {
    id: 401,
    tag: "Triplo Sabor",
    tagIcon: Flame,
    titleTop: "Tripa em",
    titleAccent: "Triplo",
    items: ["Tiras do tripa", "Tripa jr", "Seca-nunca"],
    price: 35,
    burger: { src: burgerBrasa, alt: "Burger Brasa" },
    drink: { src: cocaColaCutout, alt: "Refrigerante gelado" },
    rgb: "245, 158, 11",
    accentText: "text-amber-400",
    button: "bg-amber-500 text-black hover:bg-amber-400",
  },
  {
    id: 402,
    tag: "Tamanho Família",
    tagIcon: Users,
    titleTop: "Aristo",
    titleAccent: "fome",
    inline: true,
    items: ["Davi vs Golias", "Seca-nunca", "Tiras do tripa"],
    price: 60,
    burger: { src: burgerInferno, alt: "Burger Inferno" },
    drink: { src: beerCutout, alt: "Chopp gelado" },
    rgb: "239, 68, 68",
    accentText: "text-red-500",
    button: "bg-red-600 text-white hover:bg-red-500",
  },
  {
    id: 403,
    tag: "Premium",
    tagIcon: Crown,
    titleTop: "Fome dos",
    titleAccent: "Reis",
    items: ["Batatas reais", "Triplex burguer", "Gole de Martins"],
    price: 70,
    burger: { src: burgerClassico, alt: "Burger Clássico" },
    drink: { src: lemonadeCutout, alt: "Gole de Martins" },
    rgb: "168, 85, 247",
    accentText: "text-purple-400",
    button: "bg-purple-600 text-white hover:bg-purple-500",
  },
];

// Deterministic ember layout (avoids SSR/client hydration mismatch from Math.random).
const EMBERS = Array.from({ length: 7 }, (_, i) => ({
  left: `${18 + ((i * 37) % 64)}%`,
  delay: (i % 4) * 0.7 + i * 0.15,
  duration: 2.6 + (i % 3) * 0.6,
  size: 2 + (i % 3),
}));

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function ComboCard({
  combo,
  index,
  onAdd,
}: {
  combo: Combo;
  index: number;
  onAdd: (id: number, e: React.MouseEvent) => void;
}) {
  const reduceMotion = useReducedMotion();

  // Normalised pointer position inside the card (-0.5 … 0.5) drives tilt + parallax.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 160, damping: 18, mass: 0.4 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const burgerX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const burgerY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const drinkX = useTransform(sx, [-0.5, 0.5], [-22, 22]);
  const drinkY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  // Spotlight that follows the cursor (pixel coords).
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(${combo.rgb}, 0.16), transparent 65%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mx.set(x);
    my.set(y);
    if (reduceMotion) return;
    px.set(x / rect.width - 0.5);
    py.set(y / rect.height - 0.5);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
    mx.set(-400);
    my.set(-400);
  };

  const TagIcon = combo.tagIcon;

  return (
    <motion.div variants={cardVariants} className="h-full" style={{ perspective: 1200 }}>
      <motion.article
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full rounded-[38px] p-px"
      >
        {/* Gradient border (brightens on hover) */}
        <div
          className="absolute inset-0 rounded-[38px] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(160deg, rgba(${combo.rgb}, 0.55), rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 65%, rgba(${combo.rgb}, 0.35))`,
          }}
        />

        <div className="relative flex h-full flex-col overflow-hidden rounded-[37px] bg-[#0b0b0d]/95 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-7 xl:p-8">
          {/* Cursor spotlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
          {/* Top ambient glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-[90px] transition-opacity duration-700 opacity-50 group-hover:opacity-90"
            style={{ backgroundColor: `rgba(${combo.rgb}, 0.35)` }}
          />

          {/* ───── Product stage ───── */}
          <div className="relative mb-6 h-[260px] w-full shrink-0 sm:h-[270px]">
            {/* Slow rotating halo ring */}
            <div
              className="absolute left-1/2 top-[46%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-40 motion-safe:animate-[spin_28s_linear_infinite]"
              style={{ borderColor: `rgba(${combo.rgb}, 0.45)` }}
            />
            <div
              className="absolute left-1/2 top-[46%] h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: `radial-gradient(circle, rgba(${combo.rgb}, 0.45), transparent 70%)` }}
            />

            {/* Rising embers */}
            {EMBERS.map((ember, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute bottom-10 rounded-full"
                style={{
                  left: ember.left,
                  width: ember.size,
                  height: ember.size,
                  backgroundColor: `rgb(${combo.rgb})`,
                  boxShadow: `0 0 8px 2px rgba(${combo.rgb}, 0.8)`,
                }}
                animate={reduceMotion ? {} : { y: [0, -170], opacity: [0, 1, 0], x: [0, i % 2 ? 12 : -12] }}
                transition={{
                  duration: ember.duration,
                  delay: ember.delay + index * 0.3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Floor shadow + reflection glow */}
            <div className="absolute bottom-3 left-1/2 h-6 w-[78%] -translate-x-1/2 rounded-[100%] bg-black/80 blur-md" />
            <div
              className="absolute bottom-2 left-1/2 h-3 w-[60%] -translate-x-1/2 rounded-[100%] blur-lg transition-opacity duration-500 opacity-60 group-hover:opacity-100"
              style={{ backgroundColor: `rgba(${combo.rgb}, 0.6)` }}
            />

            {/* Drink (behind, offset right — deeper parallax) */}
            <motion.div
              className="absolute bottom-5 right-[4%] z-10 sm:right-[6%]"
              style={{ x: drinkX, y: drinkY, translateZ: 30 }}
            >
              <motion.img
                src={combo.drink.src}
                alt={combo.drink.alt}
                loading="lazy"
                draggable={false}
                animate={reduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.8 + index * 0.4 }}
                className="h-[150px] w-auto rotate-[7deg] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-105 sm:h-[165px]"
              />
            </motion.div>

            {/* Burger (hero, front) */}
            <motion.div
              className="absolute bottom-6 left-[2%] z-20 sm:left-[4%]"
              style={{ x: burgerX, y: burgerY, translateZ: 60 }}
            >
              <motion.img
                src={combo.burger.src}
                alt={combo.burger.alt}
                loading="lazy"
                draggable={false}
                animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.5 }}
                className="w-[215px] object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 sm:w-[230px]"
              />
            </motion.div>
          </div>

          {/* ───── Content ───── */}
          <div className="relative z-30 flex w-full flex-1 flex-col items-start text-left">
            <span
              className="mb-5 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em]"
              style={{
                color: `rgb(${combo.rgb})`,
                borderColor: `rgba(${combo.rgb}, 0.3)`,
                backgroundColor: `rgba(${combo.rgb}, 0.08)`,
                boxShadow: `0 0 18px rgba(${combo.rgb}, 0.18)`,
              }}
            >
              <TagIcon className="size-3.5" strokeWidth={2.5} />
              {combo.tag}
            </span>

            <h4 className="mb-5 font-display text-4xl font-black uppercase leading-[0.9] text-white drop-shadow-md sm:text-5xl">
              {combo.titleTop}
              {!combo.inline && <br />}
              <span className={combo.accentText}>{combo.titleAccent}</span>
            </h4>

            <ul className="mb-8 flex flex-col gap-2.5">
              {combo.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[15px] font-medium text-zinc-300">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `rgba(${combo.rgb}, 0.15)`, color: `rgb(${combo.rgb})` }}
                  >
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex w-full items-end justify-between gap-3 border-t border-white/10 pt-6">
              <div className="flex min-w-0 flex-col">
                <span className="mb-1 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Por apenas
                </span>
                <span className="flex items-start whitespace-nowrap font-display font-black leading-none text-white">
                  <span className="mr-1 mt-1 text-sm font-bold text-zinc-400">R$</span>
                  <span className="text-4xl sm:text-[2.6rem]">{combo.price}</span>
                  <span className={`mt-1 text-xl font-bold ${combo.accentText}`}>,00</span>
                </span>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={(e) => onAdd(combo.id, e)}
                aria-label={`Adicionar combo ${combo.titleTop} ${combo.titleAccent} ao carrinho`}
                className={`group/btn relative flex h-12 shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-full px-5 text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 ${combo.button}`}
                style={{ boxShadow: `0 10px 30px -6px rgba(${combo.rgb}, 0.65)` }}
              >
                {/* Shine sweep */}
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 blur-sm transition-transform duration-700 ease-out group-hover/btn:translate-x-[420%]" />
                <span className="relative">Comprar</span>
                <span className="relative flex size-5 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 group-hover/btn:rotate-90">
                  <Plus className="size-3.5" strokeWidth={3} />
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function ComboCards({ onAdd }: { onAdd: (id: number, e: React.MouseEvent) => void }) {
  return (
    <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:gap-10">
      {COMBOS.map((combo, i) => (
        <div key={combo.id} className={`h-full ${i === 2 ? "md:col-span-2 md:mx-auto md:w-1/2 lg:col-span-1 lg:w-full" : ""}`}>
          <ComboCard combo={combo} index={i} onAdd={onAdd} />
        </div>
      ))}
    </div>
  );
}
