import { useState } from "react";`nimport { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { toast } from "sonner";
import { TiltCard } from "./TiltCard";
import burger1 from "@/assets/burger-1.jpg";
import burger2 from "@/assets/burger-2.jpg";
import burger3 from "@/assets/burger-3.jpg";
import burger4 from "@/assets/burger-4.jpg";
import drink1 from "@/assets/drink-1.jpg";
import drink2 from "@/assets/drink-2.jpg";
import drink3 from "@/assets/drink-3.jpg";
import drink4 from "@/assets/drink-4.jpg";

type Item = {
  name: string;
  description: string;
  price: string;
  image: string;
  tag?: string;
};

const burgers: Item[] = [
  {
    name: "Clássico da Chapa",
    description: "Blend 180g maturado, cheddar inglês, picles e maionese defumada.",
    price: "R$ 38",
    image: burger1,
    tag: "Mais pedido",
  },
  {
    name: "Brasa Bacon",
    description: "Bacon caramelizado, onion rings crocantes e barbecue de café.",
    price: "R$ 45",
    image: burger2,
  },
  {
    name: "Inferno Jalapeño",
    description: "Pepper jack, jalapeños na brasa e molho de pimenta defumada.",
    price: "R$ 43",
    image: burger3,
    tag: "Picante",
  },
  {
    name: "Torre Tripla",
    description: "Três smashs, cheddar derretido em cascata e cebola na manteiga.",
    price: "R$ 56",
    image: burger4,
    tag: "Desafio",
  },
];

const drinks: Item[] = [
  {
    name: "IPA da Casa",
    description: "Cerveja artesanal IPA, amargor cítrico que corta a gordura.",
    price: "R$ 22",
    image: drink1,
    tag: "Artesanal",
  },
  {
    name: "Cola Gelada",
    description: "Refrigerante em garrafa de vidro, servido com gelo e limão.",
    price: "R$ 10",
    image: drink2,
  },
  {
    name: "Old Fashioned Defumado",
    description: "Bourbon, bitter e fumaça de carvalho na taça.",
    price: "R$ 34",
    image: drink3,
    tag: "Drink autoral",
  },
  {
    name: "Limonada da Brasa",
    description: "Limão siciliano queimado, hortelã e xarope de gengibre.",
    price: "R$ 14",
    image: drink4,
  },
];

const tabs = [
  { id: "burgers", label: "🔥 Hambúrgueres", items: burgers },
  { id: "drinks", label: "🧊 Bebidas", items: drinks },
] as const;

export function MenuSection({ onAdd }: { onAdd: () => void }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("burgers");
  const items = tabs.find((t) => t.id === active)!.items;

  function add(item: Item) {
    onAdd();
    toast.success(`${item.name} foi para o carrinho`, {
      description: `${item.price} • saindo direto da chapa`,
    });
  }

  return (
    <section id="cardapio" className="relative overflow-hidden py-28">
      <div className="ember-glow absolute inset-x-0 bottom-0 h-1/2 opacity-40" />

      <div className="relative mx-auto w-full max-w-7xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-flame uppercase">
            <Flame className="size-3.5" /> Cardápio
          </span>
          <h2 className="mt-4 font-display text-5xl uppercase sm:text-6xl">
            Direto da <span className="text-fire">brasa</span> pra sua mesa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Ingredientes frescos, fogo alto e nenhuma pressa. Escolha seu lado da chapa.
          </p>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex gap-1 rounded-full border border-border bg-card/70 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative rounded-full px-6 py-2.5 text-sm font-semibold uppercase transition-colors ${
                  active === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active === tab.id && (
                  <motion.span
                    layoutId="menu-tab"
                    className="absolute inset-0 rounded-full bg-fire"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
            style={{ perspective: 1200 }}
          >
            {items.map((item) => (
              <TiltCard
                key={item.name}
                className="group relative rounded-3xl border border-border bg-card/80 p-4 shadow-[var(--shadow-deep)] transition-colors duration-300 hover:border-flame/60"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  {item.tag && (
                    <span className="absolute top-3 left-3 rounded-full bg-fire px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                      {item.tag}
                    </span>
                  )}
                  <button
                    onClick={() => add(item)}
                    className="absolute inset-x-3 bottom-3 flex translate-y-6 items-center justify-center gap-2 rounded-xl bg-fire py-3 text-xs font-bold text-primary-foreground uppercase opacity-0 shadow-[var(--shadow-fire)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Plus className="size-4" /> Adicionar ao carrinho
                  </button>
                </div>

                <div style={{ transform: "translateZ(40px)" }} className="px-2 pt-5 pb-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl uppercase">{item.name}</h3>
                    <span className="font-display text-lg text-gold">{item.price}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

