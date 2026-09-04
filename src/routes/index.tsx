import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Instagram,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import heroBurger from "@/assets/hero-burger.png";
import burgerClassico from "@/assets/burger-classico.jpg";
import burgerBrasa from "@/assets/burger-brasa.jpg";
import burgerInferno from "@/assets/burger-inferno.jpg";
import bebidaCola from "@/assets/bebida-cola.jpg";
import bebidaLimonada from "@/assets/bebida-limonada.jpg";
import bebidaCerveja from "@/assets/bebida-cerveja.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fogo e Chapa | Hamburgueria Artesanal" },
      { name: "description", content: "Hambúrgueres artesanais feitos na brasa, ingredientes selecionados e sabor sem atalhos." },
      { property: "og:title", content: "Fogo e Chapa | Hamburgueria Artesanal" },
      { property: "og:description", content: "Carne, fogo e técnica. Descubra nosso cardápio feito na brasa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Product = { id: number; name: string; description: string; price: number; image: string; badge?: string; category: "burger" | "drink" };

const products: Product[] = [
  { id: 1, name: "Chapa Clássico", description: "Blend 160g, cheddar inglês, picles agridoce e molho da casa no brioche tostado.", price: 34.9, image: burgerClassico, badge: "Mais pedido", category: "burger" },
  { id: 2, name: "Brasa Bacon", description: "Blend 180g, queijo meia cura, bacon crocante, cebola caramelizada e barbecue de rapadura.", price: 42.9, image: burgerBrasa, badge: "Assinatura", category: "burger" },
  { id: 3, name: "Inferno", description: "Blend 180g, cheddar, jalapeño, cebola crispy e molho vermelho picante da casa.", price: 39.9, image: burgerInferno, badge: "Picante", category: "burger" },
  { id: 4, name: "Cola Artesanal", description: "Cola de especiarias, gelada e servida com gelo cristalino.", price: 12.9, image: bebidaCola, category: "drink" },
  { id: 5, name: "Limonada Rubi", description: "Frutas vermelhas, limão, hortelã e um toque de laranja.", price: 15.9, image: bebidaLimonada, badge: "Da casa", category: "drink" },
  { id: 6, name: "IPA da Chapa", description: "Cerveja artesanal âmbar, aromática e equilibrada. 473 ml.", price: 18.9, image: bebidaCerveja, category: "drink" },
];

const sparks = Array.from({ length: 18 }, (_, index) => ({
  left: `${8 + ((index * 47) % 86)}%`,
  delay: `${(index % 7) * 0.42}s`,
  duration: `${3.4 + (index % 5) * 0.48}s`,
}));

function Brand() {
  return (
    <a href="#inicio" className="group flex items-center gap-3" aria-label="Fogo e Chapa — início">
      <span className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-transform group-hover:rotate-6"><Flame className="size-5 fill-current" /></span>
      <span className="font-display text-xl font-black uppercase leading-none text-foreground">Fogo <span className="text-primary">&</span> Chapa</span>
    </a>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [tab, setTab] = useState<"burger" | "drink">("burger");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [addedId, setAddedId] = useState<number | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const carouselSlides = [
    {
      id: "classico",
      titleLine1: "CHAPA",
      titleLine2: "CLÁSSICO",
      image: heroBurger,
      bgClass: "bg-[#00A144]",
      titleColor: "text-[#006B2D]",
      buttonBg: "bg-[#006B2D]",
      buttonText: "text-[#006B2D]",
      badges: [
        { text: "Juicy", style: "top-[25%] left-[25%] -rotate-12" },
        { text: "Smash", style: "top-[35%] left-[20%] -rotate-6" },
        { text: "160g", style: "top-[50%] left-[23%] rotate-6" },
      ]
    },
    {
      id: "brasa",
      titleLine1: "BRASA",
      titleLine2: "BACON",
      image: heroBurger,
      bgClass: "bg-[#4B168C]",
      titleColor: "text-[#2B005F]",
      buttonBg: "bg-[#2B005F]",
      buttonText: "text-[#2B005F]",
      badges: [
        { text: "Bacon", style: "top-[25%] left-[25%] -rotate-12" },
        { text: "Cheddar", style: "top-[35%] left-[20%] -rotate-6" },
        { text: "180g", style: "top-[50%] left-[23%] rotate-6" },
      ]
    },
    {
      id: "inferno",
      titleLine1: "INFERNO",
      titleLine2: "PICANTE",
      image: heroBurger,
      bgClass: "bg-[#C41E00]",
      titleColor: "text-[#7A1200]",
      buttonBg: "bg-[#7A1200]",
      buttonText: "text-[#7A1200]",
      badges: [
        { text: "Picante", style: "top-[25%] left-[25%] -rotate-12" },
        { text: "Jalapeño", style: "top-[35%] left-[20%] -rotate-6" },
        { text: "180g", style: "top-[50%] left-[23%] rotate-6" },
      ]
    }
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = right, -1 = left

  const nextHero = () => {
    setSlideDirection(1);
    setHeroIndex((prev) => (prev + 1) % carouselSlides.length);
  };
  const prevHero = () => {
    setSlideDirection(-1);
    setHeroIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };
  
  const currentSlide = carouselSlides[heroIndex];

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const visibleProducts = useMemo(() => products.filter((product) => product.category === tab), [tab]);

  useEffect(() => {
    if (!authOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setAuthOpen(false);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [authOpen]);

  function updateQuantity(id: number, delta: number) {
    setCart((current) => {
      const newQty = (current[id] || 0) + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: newQty };
    });
  }

  function addToCart(id: number) {
    updateQuantity(id, 1);
    setAddedId(id);
    window.setTimeout(() => setAddedId((current) => (current === id ? null : current)), 1100);
  }

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-700 ease-in-out ${currentSlide.bgClass} text-foreground`}>
      <header className="absolute inset-x-0 top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-2xl sm:text-3xl">🔥</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-tighter text-white">HOTBITE</span>
          </motion.div>

          <motion.nav 
            className="hidden md:flex items-center gap-1 text-sm font-bold text-white bg-white/10 backdrop-blur-sm rounded-full px-2 py-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            onMouseLeave={() => setHoveredNav(null)}
          >
             {[
               { href: "#about", label: "About" },
               { href: "#menu", label: "Menu" },
               { href: "#gallery", label: "Gallery" },
               { href: "#delivery", label: "Delivery" },
             ].map((link) => (
               <motion.a 
                 key={link.href}
                 href={link.href} 
                 className="relative px-5 py-2 rounded-full z-10"
                 variants={{
                   hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
                   visible: { 
                     opacity: 1, y: 0, filter: "blur(0px)", 
                     transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
                   },
                 }}
                 whileTap={{ scale: 0.95 }}
                 onMouseEnter={() => setHoveredNav(link.href)}
               >
                 {hoveredNav === link.href && (
                   <motion.span
                     layoutId="navPill"
                     className="absolute inset-0 bg-white/20 rounded-full"
                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
                   />
                 )}
                 <span className="relative z-10">{link.label}</span>
               </motion.a>
             ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button className="rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 transition-colors">
               Contact Us
            </Button>
          </motion.div>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
           {/* Center Text */}
           <div className="relative z-10 text-center w-full flex flex-col items-center justify-center h-full">
             {/* Animated Title - Each burger name, line by line */}
             <div className="relative mt-12 sm:mt-0">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentSlide.id + "-title"}
                   initial="hidden"
                   animate="visible"
                   exit="exit"
                   variants={{
                     hidden: {},
                     visible: { transition: { staggerChildren: 0.12 } },
                     exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
                   }}
                 >
                   {[currentSlide.titleLine1, currentSlide.titleLine2].map((line, i) => (
                     <div key={i} className="overflow-hidden">
                       <motion.h1
                         className={`font-display text-[20vw] sm:text-[18vw] leading-[0.85] font-black uppercase tracking-tighter ${currentSlide.titleColor}`}
                         variants={{
                           hidden: { 
                             y: "100%",
                             opacity: 0,
                             skewY: slideDirection * 6,
                           },
                           visible: { 
                             y: "0%",
                             opacity: 1,
                             skewY: 0,
                             transition: { 
                               duration: 0.7, 
                               ease: [0.16, 1, 0.3, 1],
                             } 
                           },
                           exit: { 
                             y: "-100%",
                             opacity: 0,
                             skewY: slideDirection * -4,
                             transition: { 
                               duration: 0.4, 
                               ease: [0.55, 0, 1, 0.45],
                             } 
                           },
                         }}
                       >
                         {line}
                       </motion.h1>
                     </div>
                   ))}
                 </motion.div>
               </AnimatePresence>
             </div>
             
             {/* Center Image - perfectly centered on title */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] sm:w-[42vw] max-w-[520px] pointer-events-none z-20" style={{ perspective: "1200px" }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img 
                    key={currentSlide.id}
                    src={currentSlide.image} 
                    alt={currentSlide.titleLine1 + " " + currentSlide.titleLine2} 
                    initial={{ 
                      x: slideDirection * 600, 
                      opacity: 0, 
                      rotateY: slideDirection * 40,
                      rotateZ: slideDirection * 10,
                      scale: 0.4,
                      filter: "blur(12px)",
                    }}
                    animate={{ 
                      x: 0, 
                      opacity: 1, 
                      rotateY: 0,
                      rotateZ: 0,
                      scale: 1,
                      filter: "blur(0px)",
                      y: [0, -8, 0],
                    }}
                    exit={{ 
                      x: slideDirection * -600, 
                      opacity: 0, 
                      rotateY: slideDirection * -40,
                      rotateZ: slideDirection * -10,
                      scale: 0.4,
                      filter: "blur(12px)",
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 70, 
                      damping: 12,
                      mass: 0.5,
                      filter: { duration: 0.25 },
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.8,
                      },
                    }}
                    className={`w-full h-auto object-contain drop-shadow-2xl ${heroIndex === 1 ? 'scale-x-[-1]' : ''} ${heroIndex === 2 ? 'hue-rotate-15 saturate-150' : ''}`}
                  />
                </AnimatePresence>
             </div>

             {/* Floating Badges */}
             {currentSlide.badges.map((badge, idx) => (
                <motion.div 
                  key={currentSlide.id + idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + (idx * 0.1), type: "spring" }}
                  className={`hidden sm:block absolute ${badge.style} bg-white border-2 px-4 py-1.5 rounded-full font-bold text-sm z-30 shadow-lg transition-colors duration-700 border-current ${currentSlide.buttonText}`}
                >
                  {badge.text}
                </motion.div>
             ))}

             <div className="hidden sm:block absolute top-[60%] right-[32%] text-4xl z-30 drop-shadow-lg">😋</div>
             
             {/* Carousel arrows */}
             <div className="hidden sm:block absolute top-1/2 left-8 -translate-y-1/2 z-30">
                <Button onClick={prevHero} size="icon" variant="outline" className="bg-white text-black hover:bg-gray-100 rounded-full size-14 shadow-xl border-0"><ChevronLeft className="size-8" /></Button>
             </div>
             <div className="hidden sm:block absolute top-1/2 right-8 -translate-y-1/2 z-30">
                <Button onClick={nextHero} size="icon" variant="outline" className="bg-white text-black hover:bg-gray-100 rounded-full size-14 shadow-xl border-0"><ChevronRight className="size-8" /></Button>
             </div>



             {/* Action Buttons */}
             <div className="relative z-30 mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className={`rounded-full text-white font-bold px-8 py-6 text-lg transition-colors duration-700 ease-in-out hover:opacity-90 ${currentSlide.buttonBg}`}>View Menu</Button>
                <Button className={`rounded-full bg-white font-bold px-8 py-6 text-lg border-0 transition-colors duration-700 ease-in-out hover:bg-gray-100 ${currentSlide.buttonText}`}>Find Us</Button>
             </div>
           </div>
        </section>

        {/* Torn paper edge divider */}
        <div className="relative -mt-1 z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[60px] sm:h-[90px] md:h-[120px]" style={{ fill: "var(--color-surface, #1a1a1a)" }}>
            <path d="M0,0 C20,15 40,8 60,20 C80,32 95,10 120,25 C145,40 155,18 180,30 C205,42 220,15 240,28 C260,41 280,12 300,22 C320,32 340,8 360,18 C380,28 400,5 420,15 C440,25 460,10 480,20 C500,30 520,8 540,22 C560,36 575,12 600,25 C625,38 640,10 660,20 C680,30 700,8 720,18 C740,28 760,5 780,15 C800,25 820,10 840,22 C860,34 880,8 900,20 C920,32 940,12 960,25 C980,38 1000,10 1020,22 C1040,34 1060,8 1080,18 C1100,28 1120,5 1140,15 C1160,25 1180,10 1200,22 C1220,34 1240,8 1260,20 C1280,32 1300,12 1320,25 C1340,38 1360,15 1380,22 C1400,29 1420,10 1440,18 L1440,120 L0,120 Z" />
          </svg>
        </div>

        <section id="menu" className="relative border-border bg-[#3D1E16] py-20 sm:py-28 overflow-hidden">
          {/* Section Header */}
          <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-[#FBF5E9] tracking-tighter uppercase mb-4">
              Flavor that speaks loud <span className="inline-block align-middle text-4xl sm:text-5xl md:text-6xl -mt-2">🔥</span>
            </h2>
            <p className="text-[#FBF5E9]/80 text-lg sm:text-xl font-medium tracking-wide">
              Bold street flavors served fresh daily.
            </p>
          </div>

          {/* Menu Card Container */}
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FBF5E9] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 shadow-2xl"
            >
              {/* Menu Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-6 border-b-2 border-[#2D150D]/10 pb-6">
                <h3 className="font-display text-5xl sm:text-6xl font-black text-[#2D150D] tracking-tighter">MENU</h3>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-[#2D150D] border border-[#2D150D]/10 shadow-sm flex items-center gap-1.5"><span className="text-amber-500 text-sm">★</span> 4.9 Rating</span>
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-[#2D150D] border border-[#2D150D]/10 shadow-sm flex items-center gap-1.5"><span className="text-red-500 text-sm">♥</span> Loved Locally</span>
                </div>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
                
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-12">
                  
                  {/* Category: PIZZA */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">PIZZA</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "PEPPERONI", price: "12.00", spicy: true },
                        { name: "MARGHERITA", price: "11.75" },
                        { name: "BBQ CHICKEN", price: "14.25" },
                        { name: "FOUR CHEESE", price: "13.00" },
                        { name: "SPICY SALAMI", price: "15.50", spicy: true },
                        { name: "TRUFFLE MUSHROOM", price: "16.00" },
                        { name: "VEGGIE", price: "13.00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Spicy">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: BURGERS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">BURGERS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "CLASSIC", price: "10.50" },
                        { name: "DOUBLE CHEESE", price: "13.00" },
                        { name: "SMASH", price: "13.75" },
                        { name: "BBQ BACON", price: "14.00" },
                        { name: "CRISPY CHICKEN", price: "12.00", spicy: true }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Spicy">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: HOT DOGS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">HOT DOGS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "CLASSIC", price: "7.25" },
                        { name: "CHILI CHEESE", price: "8.25" },
                        { name: "BACON CHEESE", price: "11.00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: WRAPS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">WRAPS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "CHICKEN", price: "8.50" },
                        { name: "CAESAR", price: "11.25" },
                        { name: "SPICY CRISPY", price: "11.00", spicy: true },
                        { name: "GARLIC CHICKEN", price: "12.50" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Spicy">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>


                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-12">
                  
                  {/* Category: WINGS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">WINGS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "BUFFALO", price: "12.00", spicy: true },
                        { name: "BBQ", price: "11.00" },
                        { name: "HONEY GLAZED", price: "14.50" },
                        { name: "HOT HONEY", price: "14.00", spicy: true },
                        { name: "LEMON PEPPER", price: "13.00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Spicy">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: RINGS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">RINGS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "ONION", price: "4.25" },
                        { name: "JALAPEÑO", price: "9.00", spicy: true },
                        { name: "CRISPY", price: "7.75" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Spicy">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Special Promo Card */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                    <span className="inline-block px-3 py-1 bg-black/20 rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20">JUN 15 – JUN 18</span>
                    <h4 className="font-display text-2xl sm:text-3xl font-black leading-tight mb-6">WRAP COMBO WITH FRIES FOR ONLY $15</h4>
                    <motion.button whileTap={{ scale: 0.95 }} className="bg-[#2D150D] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-black transition-colors w-full sm:w-auto">
                      Find Us
                    </motion.button>
                  </motion.div>

                  {/* Category: DRINKS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black text-[#2D150D] mb-6 tracking-tight">DRINKS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "COLA", price: "2.25" },
                        { name: "LEMONADE", price: "3.00" },
                        { name: "ICED TEA", price: "3.75" },
                        { name: "ORANGE SODA", price: "2.00" },
                        { name: "MILKSHAKE", price: "5.50" },
                        { name: "FRESH MOJITO", price: "4.00" },
                        { name: "COLD BREW", price: "2.00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <span className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right">${item.price}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>

              </div>
            </motion.div>
          </div>
        </section>

        <section id="sobre" className="border-y border-border bg-background py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
            <div><p className="eyebrow">Manifesto da chapa</p><h2 className="section-title">O sabor começa<br /><span>no fogo</span></h2></div>
            <div className="grid gap-7 sm:grid-cols-2">
              {[{n:"01", title:"Blend autoral", text:"Cortes selecionados, moídos todos os dias e moldados à mão."}, {n:"02", title:"Calor de verdade", text:"Chapa de ferro em alta temperatura para a crosta perfeita."}, {n:"03", title:"Origem local", text:"Pães, hortaliças e queijos de pequenos produtores parceiros."}, {n:"04", title:"Sem atalhos", text:"Molhos, picles e acompanhamentos feitos dentro de casa."}].map((item) => <div key={item.n} className="border-t border-border pt-4"><span className="font-mono text-xs text-primary">{item.n}</span><h3 className="mt-3 font-display text-xl font-bold uppercase">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p></div>)}
            </div>
          </div>
        </section>
      </main>

      <footer id="contato" className="bg-surface-deep pt-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div><Brand /><p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">Hambúrguer artesanal, fogo alto e hospitalidade para quem leva sabor a sério.</p><div className="mt-5 flex gap-2"><Button size="icon" variant="outline" aria-label="Instagram"><Instagram className="size-4" /></Button><Button size="icon" variant="outline" aria-label="TikTok" className="text-base font-black">T</Button></div></div>
          <div><h3 className="footer-title">Onde estamos</h3><p className="footer-line"><MapPin className="size-4 text-primary" /> Rua das Brasas, 217<br />Vila Madalena, São Paulo — SP</p></div>
          <div><h3 className="footer-title">Horários</h3><p className="footer-line"><Clock3 className="size-4 text-primary" /> Ter–Qui: 18h às 23h<br />Sex–Dom: 12h às 00h</p></div>
          <div><h3 className="footer-title">Atalhos</h3><div className="space-y-3 text-sm text-muted-foreground"><a className="block hover:text-primary" href="#cardapio">Cardápio</a><a className="block hover:text-primary" href="#sobre">Nossa história</a><a className="block hover:text-primary" href="mailto:oi@fogoechapa.com.br">Fale com a gente</a><button className="hover:text-primary" onClick={() => setAuthOpen(true)}>Minha conta</button></div></div>
        </div>
        <div className="border-t border-border py-5"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 text-xs text-muted-foreground sm:flex-row sm:justify-between lg:px-8"><span>© 2026 Fogo e Chapa. Todos os direitos reservados.</span><span>Feito com fogo, ferro e respeito.</span></div></div>
      </footer>

      {authOpen && <AuthModal mode={mode} setMode={setMode} onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

function AuthModal({ mode, setMode, onClose }: { mode: "login" | "signup"; setMode: (mode: "login" | "signup") => void; onClose: () => void }) {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Demonstração visual — nenhuma conta foi criada.");
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-modal-backdrop p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="glass-panel relative w-full max-w-md overflow-hidden border border-border p-6 shadow-modal sm:p-8">
        <Button size="icon" variant="ghost" className="absolute right-3 top-3" aria-label="Fechar" onClick={onClose}><X className="size-5" /></Button>
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary"><Flame className="size-6 fill-current" /></div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Acesso à mesa</p>
        <h2 id="auth-title" className="mt-2 font-display text-3xl font-black uppercase">{mode === "login" ? "Bem-vindo de volta" : "Entre para a brasa"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{mode === "login" ? "Acesse sua conta para acompanhar seus pedidos." : "Crie seu acesso e agilize os próximos pedidos."}</p>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-sm border border-border bg-background/50 p-1">
          <Button variant={mode === "login" ? "fire" : "ghost"} size="sm" onClick={() => { setMode("login"); setMessage(""); }}>Entrar</Button>
          <Button variant={mode === "signup" ? "fire" : "ghost"} size="sm" onClick={() => { setMode("signup"); setMessage(""); }}>Cadastrar</Button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && <label className="field"><span>Nome</span><div><UserRound /><input required maxLength={80} autoComplete="name" placeholder="Seu nome" /></div></label>}
          <label className="field"><span>E-mail</span><div><Mail /><input required type="email" maxLength={255} autoComplete="email" placeholder="voce@email.com" /></div></label>
          <label className="field"><span>Senha</span><div><LockKeyhole /><input required type="password" minLength={6} maxLength={72} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••" /></div></label>
          {mode === "login" && <button type="button" className="ml-auto block text-xs text-gold hover:text-primary" onClick={() => setMessage("Recuperação de senha disponível quando o acesso real for ativado.")}>Esqueci minha senha</button>}
          <Button className="w-full" size="lg" type="submit">{mode === "login" ? "Entrar" : "Criar conta"}</Button>
        </form>
        {message && <p className="mt-3 rounded-sm border border-gold/30 bg-gold/10 p-3 text-xs text-gold" role="status">{message}</p>}
        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground"><span className="h-px flex-1 bg-border" /> ou continue com <span className="h-px flex-1 bg-border" /></div>
        <div className="grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => setMessage("Google é apenas demonstrativo nesta versão.")}><span className="font-bold">G</span> Google</Button><Button variant="outline" onClick={() => setMessage("Apple é apenas demonstrativo nesta versão.")}><span className="text-lg">●</span> Apple</Button></div>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">Demonstração visual. Nenhum dado é enviado ou armazenado.</p>
      </div>
    </div>
  );
}