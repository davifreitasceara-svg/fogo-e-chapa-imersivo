import { CartCheckoutSheet } from "../components/CartCheckoutSheet";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, type FormEvent } from "react";
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
  Star,
  UserRound,
  X,
  ArrowUpRight,
  PlaySquare,
  Layers,
  TrendingUp,
  Bike,
  Navigation
, ChefHat } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Embers } from "@/components/Embers";
import { AppetizerSlider } from "@/components/AppetizerSlider";
import heroBurger from "@/assets/hero-burger.png";
import burgerClassico from "@/assets/burger-classico.jpg";
import burgerBrasa from "@/assets/burger-brasa.jpg";
import burgerInferno from "@/assets/burger-inferno.jpg";
import bebidaCola from "@/assets/bebida-cola.jpg";
import bebidaLimonada from "@/assets/bebida-limonada.jpg";
import bebidaCerveja from "@/assets/bebida-cerveja.jpg";
import sodaSplash from '../assets/soda-splash.jpg'
import cocaCola from '../assets/coca-cola.jpg'
import orangeJuice from '../assets/orange-juice.jpg'
import lemonade from '../assets/lemonade.jpg'
import beer from '../assets/beer.jpg'
import icedTea from '../assets/iced-tea.jpg'
import guarana from '../assets/guarana.jpg'
import coffeeSplash from "@/assets/coffee-splash.jpg";

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
  // Burgers
  { id: 1, name: "Chapa Clássico", description: "Blend 160g, cheddar inglês, picles agridoce e molho da casa no brioche tostado.", price: 34.9, image: burgerClassico, badge: "Mais pedido", category: "burger" },
  { id: 2, name: "Brasa Bacon", description: "Blend 180g, queijo meia cura, bacon crocante, cebola caramelizada e barbecue de rapadura.", price: 42.9, image: burgerBrasa, badge: "Assinatura", category: "burger" },
  { id: 3, name: "Inferno", description: "Blend 180g, cheddar, jalapeño, cebola crispy e molho vermelho picante da casa.", price: 39.9, image: burgerInferno, badge: "Picante", category: "burger" },
  // Appetizers
  { id: 101, name: "Batatas Fritas", description: "Batatas fritas crocantes com tempero especial.", price: 19.9, image: "/fries_appetizer.jpg", category: "burger" },
  { id: 102, name: "Coxas de Frango", description: "Asinhas e coxas de frango fritas e temperadas.", price: 29.9, image: burgerClassico, category: "burger" }, // using a placeholder if we don't have the exact image
  { id: 103, name: "Onion Rings", description: "Anéis de cebola empanados e fritos.", price: 24.9, image: burgerBrasa, category: "burger" }, // placeholder
  { id: 104, name: "Queijo Crocante", description: "Palitos de queijo crocantes por fora e derretidos por dentro.", price: 26.9, image: burgerInferno, category: "burger" }, // placeholder
  // Drinks
  { id: 201, name: "Cola Tradicional", description: "Refrigerante de cola tradicional.", price: 8.9, image: cocaCola, category: "drink" },
  { id: 202, name: "Suco de Laranja", description: "Suco natural de laranja espremida na hora.", price: 10.9, image: orangeJuice, category: "drink" },
  { id: 203, name: "Limonada Suíça", description: "Limonada refrescante.", price: 12.9, image: lemonade, category: "drink" },
  { id: 204, name: "Cerveja Pilsen", description: "Cerveja clara e refrescante.", price: 14.9, image: beer, category: "drink" },
  { id: 205, name: "Chá Gelado", description: "Chá mate gelado com limão.", price: 9.9, image: icedTea, category: "drink" },
  { id: 206, name: "Guaraná Natural", description: "Refrigerante de guaraná tradicional.", price: 8.9, image: guarana, category: "drink" },

  // Text Menu Items
  { id: 301, name: "PEPPERONI", description: "PEPPERONI", price: 12.0, image: burgerClassico, category: "burger" },
  { id: 302, name: "MARGHERITA", description: "MARGHERITA", price: 11.75, image: burgerClassico, category: "burger" },
  { id: 303, name: "FRANGO BBQ", description: "FRANGO BBQ", price: 14.25, image: burgerClassico, category: "burger" },
  { id: 304, name: "QUATRO QUEIJOS", description: "QUATRO QUEIJOS", price: 13.0, image: burgerClassico, category: "burger" },
  { id: 305, name: "SALAME PICANTE", description: "SALAME PICANTE", price: 15.5, image: burgerClassico, category: "burger" },
  { id: 306, name: "COGUMELO TRUFADO", description: "COGUMELO TRUFADO", price: 16.0, image: burgerClassico, category: "burger" },
  { id: 307, name: "VEGETARIANA", description: "VEGETARIANA", price: 13.0, image: burgerClassico, category: "burger" },
  { id: 308, name: "CLÁSSICO", description: "CLÁSSICO", price: 10.5, image: burgerClassico, category: "burger" },
  { id: 309, name: "DUPLO QUEIJO", description: "DUPLO QUEIJO", price: 13.0, image: burgerClassico, category: "burger" },
  { id: 310, name: "SMASH", description: "SMASH", price: 13.75, image: burgerClassico, category: "burger" },
  { id: 311, name: "BACON BBQ", description: "BACON BBQ", price: 14.0, image: burgerClassico, category: "burger" },
  { id: 312, name: "FRANGO CROCANTE", description: "FRANGO CROCANTE", price: 12.0, image: burgerClassico, category: "burger" },
  { id: 313, name: "CLÁSSICO", description: "CLÁSSICO", price: 7.25, image: burgerClassico, category: "burger" },
  { id: 314, name: "CHILI COM QUEIJO", description: "CHILI COM QUEIJO", price: 8.25, image: burgerClassico, category: "burger" },
  { id: 315, name: "BACON E QUEIJO", description: "BACON E QUEIJO", price: 11.0, image: burgerClassico, category: "burger" },
  { id: 316, name: "FRANGO", description: "FRANGO", price: 8.5, image: burgerClassico, category: "burger" },
  { id: 317, name: "CAESAR", description: "CAESAR", price: 11.25, image: burgerClassico, category: "burger" },
  { id: 318, name: "CROCANTE APIMENTADO", description: "CROCANTE APIMENTADO", price: 11.0, image: burgerClassico, category: "burger" },
  { id: 319, name: "FRANGO COM ALHO", description: "FRANGO COM ALHO", price: 12.5, image: burgerClassico, category: "burger" },
  { id: 320, name: "BUFFALO", description: "BUFFALO", price: 12.0, image: burgerClassico, category: "burger" },
  { id: 321, name: "BBQ", description: "BBQ", price: 11.0, image: burgerClassico, category: "burger" },
  { id: 322, name: "MEL GLAÇADO", description: "MEL GLAÇADO", price: 14.5, image: burgerClassico, category: "burger" },
  { id: 323, name: "MEL APIMENTADO", description: "MEL APIMENTADO", price: 14.0, image: burgerClassico, category: "burger" },
  { id: 324, name: "LEMON PEPPER", description: "LEMON PEPPER", price: 13.0, image: burgerClassico, category: "burger" },
  { id: 325, name: "CEBOLA", description: "CEBOLA", price: 4.25, image: burgerClassico, category: "burger" },
  { id: 326, name: "JALAPEÑO", description: "JALAPEÑO", price: 9.0, image: burgerClassico, category: "burger" },
  { id: 327, name: "CROCANTE", description: "CROCANTE", price: 7.75, image: burgerClassico, category: "burger" },
  { id: 328, name: "COCA-COLA", description: "COCA-COLA", price: 2.25, image: burgerClassico, category: "burger" },
  { id: 329, name: "LIMONADA", description: "LIMONADA", price: 3.0, image: burgerClassico, category: "burger" },
  { id: 330, name: "CHÁ GELADO", description: "CHÁ GELADO", price: 3.75, image: burgerClassico, category: "burger" },
  { id: 331, name: "REFRIGERANTE DE LARANJA", description: "REFRIGERANTE DE LARANJA", price: 2.0, image: burgerClassico, category: "burger" },
  { id: 332, name: "MILKSHAKE", description: "MILKSHAKE", price: 5.5, image: burgerClassico, category: "burger" },
  { id: 333, name: "MOJITO", description: "MOJITO", price: 4.0, image: burgerClassico, category: "burger" },
  { id: 334, name: "COLD BREW", description: "COLD BREW", price: 2.0, image: burgerClassico, category: "burger" },
];

const sparks = Array.from({ length: 18 }, (_, index) => ({
  left: `${8 + ((index * 47) % 86)}%`,
  delay: `${(index % 7) * 0.42}s`,
  duration: `${3.4 + (index % 5) * 0.48}s`,
}));

function Brand({ color }: { color?: string }) {
  return (
    <a href="#inicio" className="group flex items-center gap-3" aria-label="Fogo e Chapa   início">
      <span 
        className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all group-hover:rotate-6 duration-700"
        style={{ color: color || 'var(--primary)', borderColor: color ? `${color}40` : undefined, backgroundColor: color ? `${color}1A` : undefined }}
      >
        <Flame className="size-5 fill-current" />
      </span>
      <span className="font-display text-xl font-black uppercase leading-none text-foreground">Fogo <span className="transition-colors duration-700" style={{ color: color || 'var(--primary)' }}>&</span> Chapa</span>
    </a>
  );
}

const MOCK_DRIVERS = [
  { name: "Carlos S.", vehicle: "Honda CG 160", plate: "ABC-1234", avatar: "https://i.pravatar.cc/150?u=carlos" },
  { name: "Marcos T.", vehicle: "Yamaha YBR 125", plate: "XYZ-9876", avatar: "https://i.pravatar.cc/150?u=marcos" },
  { name: "Rafael M.", vehicle: "Honda Biz", plate: "QWE-4567", avatar: "https://i.pravatar.cc/150?u=rafael" }
];

const MOCK_ROUTES = [
  {
    start: [-23.568, -46.658],
    customer: [-23.555, -46.65],
    route1: [[-23.568031, -46.658033], [-23.568066, -46.657993], [-23.568136, -46.657915], [-23.568464, -46.657546], [-23.568619, -46.657372], [-23.56926, -46.656651], [-23.569331, -46.656572], [-23.56926, -46.656503], [-23.568552, -46.655813], [-23.56847, -46.655733], [-23.568378, -46.655643], [-23.567854, -46.655133], [-23.567775, -46.655056], [-23.567594, -46.654879], [-23.566836, -46.65414], [-23.566766, -46.654071], [-23.566699, -46.654005], [-23.565954, -46.653278], [-23.565878, -46.653203], [-23.565764, -46.653092], [-23.565079, -46.652423], [-23.564987, -46.652332], [-23.564934, -46.652284], [-23.564885, -46.652239], [-23.564511, -46.652685], [-23.564295, -46.652945], [-23.563978, -46.653317], [-23.563906, -46.653402], [-23.563655, -46.653707], [-23.563459, -46.653942], [-23.563427, -46.653979], [-23.563006, -46.654499], [-23.562728, -46.654827], [-23.562559, -46.65504], [-23.562282, -46.65538], [-23.562211, -46.655463], [-23.56215, -46.655401], [-23.5621, -46.655351]],
    route2: [[-23.5621, -46.655351], [-23.56215, -46.655401], [-23.562211, -46.655463], [-23.561954, -46.655767], [-23.561713, -46.656058], [-23.561351, -46.656485], [-23.561258, -46.656383], [-23.561014, -46.656115], [-23.560989, -46.656062], [-23.560973, -46.656009], [-23.560973, -46.655903], [-23.560994, -46.655688], [-23.561, -46.655666], [-23.561015, -46.655641], [-23.561039, -46.655608], [-23.561061, -46.65557], [-23.561069, -46.655538], [-23.561061, -46.655485], [-23.561043, -46.655439], [-23.561017, -46.655394], [-23.56099, -46.655355], [-23.56097, -46.655317], [-23.560945, -46.655263], [-23.560953, -46.655141], [-23.560962, -46.655009], [-23.560949, -46.654811], [-23.56091, -46.654737], [-23.560863, -46.654685], [-23.560763, -46.654619], [-23.560631, -46.654557], [-23.560487, -46.654502], [-23.56021, -46.654397], [-23.55999, -46.654307], [-23.559838, -46.654242], [-23.559742, -46.654201], [-23.559605, -46.654153], [-23.559364, -46.654122], [-23.559163, -46.65409], [-23.559088, -46.654036], [-23.559032, -46.653996], [-23.558716, -46.653778], [-23.558698, -46.653766], [-23.558435, -46.653595], [-23.558309, -46.653495], [-23.558274, -46.653355], [-23.558051, -46.652986], [-23.557836, -46.652597], [-23.557575, -46.652124], [-23.557085, -46.65127], [-23.557018, -46.651153], [-23.556522, -46.650321], [-23.556419, -46.650194], [-23.556339, -46.650133], [-23.556265, -46.650057], [-23.556239, -46.650033], [-23.556187, -46.649986], [-23.556139, -46.649954], [-23.556136, -46.649928], [-23.556123, -46.649864], [-23.556117, -46.649841], [-23.556108, -46.649819], [-23.556081, -46.649757], [-23.556034, -46.64968], [-23.556003, -46.64964], [-23.555969, -46.649604], [-23.555932, -46.64957], [-23.555893, -46.64954], [-23.555851, -46.649514], [-23.555808, -46.649491], [-23.555769, -46.649475], [-23.555689, -46.649453], [-23.555617, -46.64945], [-23.555553, -46.649379], [-23.555314, -46.649083], [-23.555098, -46.648847], [-23.554965, -46.648733], [-23.554845, -46.648645], [-23.554729, -46.648853], [-23.55476, -46.649017], [-23.55478, -46.649123], [-23.554981, -46.649895], [-23.554991, -46.649933], [-23.554986, -46.649974], [-23.55498, -46.649984]]
  },
  {
    start: [-23.565, -46.66],
    customer: [-23.56, -46.645],
    route1: [[-23.564924, -46.659922], [-23.56482, -46.660044], [-23.564428, -46.660489], [-23.564393, -46.660529], [-23.56433, -46.660601], [-23.564234, -46.66071], [-23.563554, -46.661486], [-23.563489, -46.66156], [-23.563407, -46.661476], [-23.562984, -46.66104], [-23.562807, -46.660858], [-23.562731, -46.660779], [-23.562801, -46.6607], [-23.563503, -46.659933], [-23.563579, -46.659847], [-23.563657, -46.659758], [-23.564606, -46.658656], [-23.564621, -46.658638], [-23.56468, -46.65857], [-23.564621, -46.65851], [-23.56387, -46.657734], [-23.563784, -46.657646], [-23.563651, -46.657509], [-23.563017, -46.656859], [-23.562977, -46.656818], [-23.562912, -46.656751], [-23.562836, -46.65667], [-23.562144, -46.65595], [-23.562072, -46.655882], [-23.562013, -46.655825], [-23.561954, -46.655767], [-23.561713, -46.656058], [-23.561351, -46.656485], [-23.561258, -46.656383], [-23.561014, -46.656115], [-23.560989, -46.656062], [-23.560973, -46.656009], [-23.560973, -46.655903], [-23.560994, -46.655688], [-23.561, -46.655666], [-23.561015, -46.655641], [-23.561039, -46.655608], [-23.561061, -46.65557], [-23.561069, -46.655538], [-23.561061, -46.655485], [-23.561087, -46.655419], [-23.561097, -46.6554], [-23.561267, -46.65519], [-23.561925, -46.654421], [-23.561965, -46.654374], [-23.561996, -46.65434], [-23.562054, -46.654414], [-23.562441, -46.654897], [-23.562559, -46.65504], [-23.562282, -46.65538], [-23.562211, -46.655463], [-23.56215, -46.655401], [-23.5621, -46.655351]],
    route2: [[-23.5621, -46.655351], [-23.56215, -46.655401], [-23.562211, -46.655463], [-23.561954, -46.655767], [-23.561713, -46.656058], [-23.561351, -46.656485], [-23.561258, -46.656383], [-23.561014, -46.656115], [-23.560989, -46.656062], [-23.560973, -46.656009], [-23.560973, -46.655903], [-23.560994, -46.655688], [-23.561, -46.655666], [-23.561015, -46.655641], [-23.561039, -46.655608], [-23.561061, -46.65557], [-23.561069, -46.655538], [-23.561061, -46.655485], [-23.561087, -46.655419], [-23.561097, -46.6554], [-23.561267, -46.65519], [-23.561925, -46.654421], [-23.561965, -46.654374], [-23.561996, -46.65434], [-23.56177, -46.654077], [-23.561691, -46.65403], [-23.561586, -46.653989], [-23.561484, -46.653944], [-23.561392, -46.653895], [-23.561063, -46.653717], [-23.560616, -46.653491], [-23.560324, -46.653331], [-23.559826, -46.653057], [-23.559605, -46.652935], [-23.559521, -46.652879], [-23.559456, -46.652817], [-23.559366, -46.652713], [-23.559224, -46.652469], [-23.559206, -46.652437], [-23.558878, -46.65182], [-23.558804, -46.65168], [-23.558983, -46.651667], [-23.559109, -46.651673], [-23.559792, -46.651704], [-23.560106, -46.651712], [-23.560328, -46.651722], [-23.560683, -46.651731], [-23.561359, -46.651773], [-23.561493, -46.651782], [-23.561714, -46.651978], [-23.561795, -46.652049], [-23.561866, -46.651964], [-23.563018, -46.650575], [-23.563077, -46.650503], [-23.563156, -46.650409], [-23.563577, -46.649908], [-23.563959, -46.649432], [-23.564188, -46.64916], [-23.564218, -46.649124], [-23.564231, -46.649108], [-23.564242, -46.649096], [-23.564288, -46.64904], [-23.564363, -46.648952], [-23.564518, -46.648768], [-23.564995, -46.648202], [-23.565148, -46.64802], [-23.565418, -46.647701], [-23.565479, -46.647623], [-23.565419, -46.64758], [-23.565385, -46.647555], [-23.565337, -46.647524], [-23.565086, -46.647333], [-23.564632, -46.646939], [-23.564258, -46.646616], [-23.563986, -46.646367], [-23.563718, -46.646148], [-23.563596, -46.646049], [-23.563463, -46.645934], [-23.563439, -46.645916], [-23.56333, -46.64582], [-23.563104, -46.645633], [-23.563033, -46.645572], [-23.562943, -46.645495], [-23.562956, -46.645593], [-23.562963, -46.645669], [-23.56286, -46.64569], [-23.562754, -46.645711], [-23.562546, -46.645745], [-23.562057, -46.645794], [-23.561277, -46.645875], [-23.561144, -46.645878], [-23.561043, -46.645871], [-23.560877, -46.645824], [-23.560776, -46.645788], [-23.560581, -46.645585], [-23.560444, -46.645452], [-23.560445, -46.645402], [-23.560418, -46.64535], [-23.560413, -46.645301], [-23.560423, -46.64527], [-23.560446, -46.645245], [-23.560508, -46.645205], [-23.560325, -46.645209], [-23.560244, -46.645181], [-23.560187, -46.645149], [-23.560103, -46.645111], [-23.560061, -46.645095], [-23.559993, -46.645088]]
  },
  {
    start: [-23.559, -46.662],
    customer: [-23.55, -46.66],
    route1: [[-23.558915, -46.662095], [-23.559288, -46.662489], [-23.559365, -46.662567], [-23.55941, -46.662609], [-23.55919, -46.662858], [-23.559117, -46.662941], [-23.559049, -46.663016], [-23.558829, -46.663265], [-23.55861, -46.663511], [-23.558367, -46.663788], [-23.55835, -46.663806], [-23.558289, -46.663876], [-23.558241, -46.663826], [-23.558224, -46.663808], [-23.557502, -46.663069], [-23.557423, -46.662988], [-23.557494, -46.66291], [-23.558182, -46.662127], [-23.558254, -46.662042], [-23.558323, -46.661965], [-23.558327, -46.661961], [-23.558735, -46.661504], [-23.558956, -46.661257], [-23.559038, -46.661164], [-23.559081, -46.661117], [-23.559091, -46.661105], [-23.559244, -46.660932], [-23.55935, -46.660811], [-23.559827, -46.66027], [-23.559911, -46.660175], [-23.55999, -46.660086], [-23.560015, -46.660058], [-23.560373, -46.659652], [-23.560428, -46.65959], [-23.560569, -46.65943], [-23.560898, -46.659055], [-23.560974, -46.658969], [-23.561048, -46.658885], [-23.561579, -46.658283], [-23.56174, -46.658101], [-23.561813, -46.658017], [-23.561902, -46.657914], [-23.562367, -46.657379], [-23.562829, -46.656845], [-23.562877, -46.65679], [-23.562912, -46.656751], [-23.562836, -46.65667], [-23.562144, -46.65595], [-23.562072, -46.655882], [-23.562013, -46.655825], [-23.561954, -46.655767], [-23.561713, -46.656058], [-23.561351, -46.656485], [-23.561258, -46.656383], [-23.561014, -46.656115], [-23.560989, -46.656062], [-23.560973, -46.656009], [-23.560973, -46.655903], [-23.560994, -46.655688], [-23.561, -46.655666], [-23.561015, -46.655641], [-23.561039, -46.655608], [-23.561061, -46.65557], [-23.561069, -46.655538], [-23.561061, -46.655485], [-23.561087, -46.655419], [-23.561097, -46.6554], [-23.561267, -46.65519], [-23.561925, -46.654421], [-23.561965, -46.654374], [-23.561996, -46.65434], [-23.562054, -46.654414], [-23.562441, -46.654897], [-23.562559, -46.65504], [-23.562282, -46.65538], [-23.562211, -46.655463], [-23.56215, -46.655401], [-23.5621, -46.655351]],
    route2: [[-23.5621, -46.655351], [-23.56215, -46.655401], [-23.562211, -46.655463], [-23.561954, -46.655767], [-23.561713, -46.656058], [-23.561351, -46.656485], [-23.561183, -46.656673], [-23.561126, -46.656738], [-23.560879, -46.657011], [-23.560846, -46.657047], [-23.560662, -46.657249], [-23.560434, -46.657502], [-23.560349, -46.657597], [-23.560286, -46.657662], [-23.560186, -46.657766], [-23.559989, -46.657954], [-23.559638, -46.658345], [-23.559481, -46.658521], [-23.559125, -46.658919], [-23.559033, -46.659022], [-23.558285, -46.659845], [-23.558039, -46.660117], [-23.55795, -46.660025], [-23.557456, -46.659506], [-23.557057, -46.659087], [-23.556988, -46.659015], [-23.556941, -46.658966], [-23.556873, -46.6589], [-23.556815, -46.658838], [-23.556348, -46.658341], [-23.556304, -46.658294], [-23.556259, -46.658247], [-23.556181, -46.658164], [-23.555624, -46.65757], [-23.555605, -46.657551], [-23.555555, -46.657497], [-23.55549, -46.65757], [-23.554877, -46.658263], [-23.554815, -46.658336], [-23.554754, -46.658402], [-23.554731, -46.658429], [-23.554151, -46.659088], [-23.554079, -46.659174], [-23.554012, -46.659252], [-23.553834, -46.659461], [-23.5535, -46.659845], [-23.55341, -46.659963], [-23.553322, -46.660106], [-23.553271, -46.660212], [-23.553143, -46.660325], [-23.55313, -46.660337], [-23.55282, -46.66062], [-23.552493, -46.660962], [-23.55241, -46.661035], [-23.552349, -46.661005], [-23.552271, -46.660966], [-23.551652, -46.660655], [-23.551559, -46.660609], [-23.551345, -46.660501], [-23.55117, -46.660414], [-23.550856, -46.660256], [-23.55084, -46.660248], [-23.550759, -46.660208], [-23.550346, -46.660001], [-23.550251, -46.659954], [-23.550057, -46.65986]]
  }
];

function Index() {
  const [activeDriver, setActiveDriver] = useState<number>(0);
  const [activeRoute, setActiveRoute] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [activeOrderTime, setActiveOrderTime] = useState<number | null>(null);
  const [activeOrderType, setActiveOrderType] = useState<"delivery" | "pickup" | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [tab, setTab] = useState<"burger" | "drink">("burger");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [addedId, setAddedId] = useState<number | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const nextHero = () => {
    setSlideDirection(1);
    setHeroIndex((prev) => (prev + 1) % carouselSlides.length);
  };
  const prevHero = () => {
    setSlideDirection(-1);
    setHeroIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };
  
  const currentSlide = carouselSlides[heroIndex]!;

  // Dynamic theme based on the currently selected burger
  const currentTheme = useMemo(() => {
    switch (heroIndex) {
      case 0: // CHAPA CLÁSSICO - Green
        return {
          bgLight: "#F0FAF4", // very light green
          bgDark: "#0B1F13",
          bgVeryDark: "#040B07",
          primary: "#006B2D",
          secondary: "#00A144",
          secondaryAlpha: "rgba(0, 161, 68, 0.15)",
          textDark: "#05140B",
        };
      case 1: // BRASA BACON - Purple
        return {
          bgLight: "#F5F0FA", // very light purple
          bgDark: "#150824",
          bgVeryDark: "#0B0414",
          primary: "#2B005F",
          secondary: "#4B168C",
          secondaryAlpha: "rgba(75, 22, 140, 0.15)",
          textDark: "#10031F",
        };
      case 2: // INFERNO PICANTE - Red
        return {
          bgLight: "#FAF0F0", // very light red
          bgDark: "#260602",
          bgVeryDark: "#120301",
          primary: "#7A1200",
          secondary: "#C41E00",
          secondaryAlpha: "rgba(196, 30, 0, 0.15)",
          textDark: "#1F0400",
        };
      default:
        return {
          bgLight: "#F0FAF4",
          bgDark: "#0B1F13",
          bgVeryDark: "#040B07",
          primary: "#006B2D",
          secondary: "#00A144",
          secondaryAlpha: "rgba(0, 161, 68, 0.15)",
          textDark: "#05140B",
        };
    }
  }, [heroIndex]);

  const cartCount = Object.entries(cart).reduce((sum, [id, count]) => {
    if (products.some(p => p.id === parseInt(id))) return sum + count;
    return sum;
  }, 0);
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


  const handleCheckout = (address: string, orderType?: "delivery" | "pickup" | null) => {
    if (Object.keys(cart).length === 0) return;
    
    // In a real app, this would send an API request.
    // For demonstration, we just clear the cart and open the tracking modal!
    setCart({});
    setActiveOrderTime(Date.now());
    setActiveOrderType(orderType || "delivery");
    setActiveDriver(Math.floor(Math.random() * MOCK_DRIVERS.length));
    setActiveRoute(Math.floor(Math.random() * MOCK_ROUTES.length));
    setTrackingOpen(true);
  };

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

  function addToCart(id: number | undefined) {
    if (id === undefined) return;
    updateQuantity(id, 1);
    setAddedId(id);
    window.setTimeout(() => setAddedId((current) => (current === id ? null : current)), 1100);
  }

  return (
    <>
    <div className={`min-h-screen overflow-x-clip transition-colors duration-700 ease-in-out ${currentSlide.bgClass} text-foreground`} style={{ marginBottom: footerHeight }}>
      <header className="fixed inset-x-0 top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 transition-colors duration-700">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display text-xl sm:text-2xl font-black tracking-tighter text-white">FOGO E CHAPA</span>
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
               { href: "#drinks", label: "Drinks" },
             ].map((link) => (
               <motion.a 
                 key={link.href}
                 href={link.href} 
                 onClick={(e) => {
                   if (link.label === "Delivery" && activeOrderTime) {
                     e.preventDefault();
                     setTrackingOpen(true);
                   }
                 }}
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
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button aria-label={`Sacola com ${cartCount} itens`} variant="ghost" size="icon" className="relative rounded-full text-white hover:bg-white/20 transition-colors">
                  <ShoppingBag className="size-5" />
                  {cartCount > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
                </Button>
              </SheetTrigger>
              <CartCheckoutSheet cart={cart} products={products} updateQuantity={updateQuantity} handleCheckout={handleCheckout} currentTheme={currentTheme} />
            </Sheet>

            <Button className="hidden sm:flex rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 transition-colors">
               Contact Us
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="relative">
        <section id="inicio" className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden pt-24 z-0">
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

             <div className="hidden sm:block absolute top-[60%] right-[32%] text-4xl z-30 drop-shadow-lg">✨</div>
             
             {/* Carousel arrows */}
             <div className="hidden sm:block absolute top-1/2 left-8 -translate-y-1/2 z-30">
                <Button onClick={prevHero} size="icon" variant="outline" className="bg-white text-black hover:bg-gray-100 rounded-full size-14 shadow-xl border-0"><ChevronLeft className="size-8" /></Button>
             </div>
             <div className="hidden sm:block absolute top-1/2 right-8 -translate-y-1/2 z-30">
                <Button onClick={nextHero} size="icon" variant="outline" className="bg-white text-black hover:bg-gray-100 rounded-full size-14 shadow-xl border-0"><ChevronRight className="size-8" /></Button>
             </div>



             {/* Action Buttons */}
             <div className="relative z-30 mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className={`rounded-full text-white font-bold px-8 py-6 text-lg transition-colors duration-700 ease-in-out hover:opacity-90 ${currentSlide.buttonBg}`}>Ver Cardápio</Button>
                <Button onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })} className={`rounded-full bg-white font-bold px-8 py-6 text-lg border-0 transition-colors duration-700 ease-in-out hover:bg-gray-100 ${currentSlide.buttonText}`}>Onde Estamos</Button>
             </div>
           </div>
        </section>

        <div className="relative z-10">
        {/* Torn paper edge divider */}
        <div className="relative -mt-1 z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[60px] sm:h-[90px] md:h-[120px] transition-colors duration-700" style={{ fill: currentTheme.bgDark }}>
            <path d="M0,0 L0.0,40.0 L11.2,37.7 L22.5,33.7 L33.8,22.4 L45.0,17.2 L56.2,20.1 L67.5,16.9 L78.8,10.8 L90.0,10.0 L101.2,14.7 L112.5,17.8 L123.8,20.1 L135.0,21.3 L146.2,21.0 L157.5,22.5 L168.8,16.7 L180.0,13.8 L191.2,15.9 L202.5,18.9 L213.8,17.2 L225.0,17.8 L236.2,21.1 L247.5,18.1 L258.8,15.0 L270.0,10.0 L281.2,11.1 L292.5,11.9 L303.8,12.1 L315.0,10.0 L326.2,13.7 L337.5,17.5 L348.8,17.6 L360.0,22.4 L371.2,16.5 L382.5,17.0 L393.8,23.4 L405.0,23.4 L416.2,30.0 L427.5,31.9 L438.8,27.9 L450.0,29.4 L461.2,31.8 L472.5,32.8 L483.8,30.9 L495.0,25.1 L506.2,23.0 L517.5,15.5 L528.8,10.0 L540.0,10.0 L551.2,11.2 L562.5,17.4 L573.8,18.7 L585.0,21.4 L596.2,16.4 L607.5,10.0 L618.8,10.0 L630.0,10.0 L641.2,11.3 L652.5,10.0 L663.8,11.7 L675.0,10.0 L686.2,10.5 L697.5,11.7 L708.8,13.2 L720.0,10.0 L731.2,10.0 L742.5,10.0 L753.8,12.3 L765.0,10.0 L776.2,10.3 L787.5,12.2 L798.8,13.8 L810.0,16.7 L821.2,19.2 L832.5,23.3 L843.8,23.5 L855.0,20.8 L866.2,18.3 L877.5,10.6 L888.8,10.0 L900.0,10.0 L911.2,13.4 L922.5,15.6 L933.8,21.3 L945.0,22.5 L956.2,17.9 L967.5,10.7 L978.8,10.0 L990.0,10.0 L1001.2,10.0 L1012.5,10.0 L1023.8,12.6 L1035.0,10.0 L1046.2,10.7 L1057.5,15.2 L1068.8,15.6 L1080.0,10.0 L1091.2,10.0 L1102.5,11.5 L1113.8,10.9 L1125.0,10.0 L1136.2,12.2 L1147.5,11.6 L1158.8,20.0 L1170.0,25.9 L1181.2,28.7 L1192.5,30.2 L1203.8,29.9 L1215.0,24.7 L1226.2,23.1 L1237.5,19.5 L1248.8,17.6 L1260.0,10.0 L1271.2,13.4 L1282.5,14.8 L1293.8,17.4 L1305.0,19.0 L1316.2,19.2 L1327.5,25.5 L1338.8,34.4 L1350.0,37.8 L1361.2,34.1 L1372.5,34.1 L1383.8,33.1 L1395.0,35.8 L1406.2,31.7 L1417.5,33.6 L1428.8,37.6 L1440.0,40.0 L1440,120 L0,120 Z" />
          </svg>
        </div>

        <section id="menu" className="relative border-white/10 py-20 sm:py-28 overflow-hidden transition-colors duration-700" style={{ backgroundColor: currentTheme.bgDark }}>
          {/* Section Header */}
          <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 text-center mb-16">
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-4 transition-colors duration-700" style={{ color: currentTheme.bgLight }}>
              Sabor que fala alto
            </h2>
            <p className="text-lg sm:text-xl font-medium tracking-wide opacity-80 transition-colors duration-700" style={{ color: currentTheme.bgLight }}>
              Sabores autênticos servidos frescos todos os dias.
            </p>
          </div>

          {/* Menu Card Container */}
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 shadow-2xl origin-bottom transition-colors duration-700"
              style={{ backgroundColor: currentTheme.bgLight }}
            >
              {/* Menu Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-6 border-b-2 border-black/10 pb-6 transition-colors duration-700">
                <h3 className="font-display text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-700" style={{ color: currentTheme.textDark }}>CARDÁPIO</h3>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-[#2D150D] border border-[#2D150D]/10 shadow-sm flex items-center gap-1.5"><span className="text-amber-500 text-sm">★</span> Avaliação 4.9</span>
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-[#2D150D] border border-[#2D150D]/10 shadow-sm flex items-center gap-1.5"><span className="text-red-500 text-sm">♥</span> Favorito Local</span>
                </div>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
                
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-12">
                  
                  {/* Category: PIZZA */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>PIZZAS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "PEPPERONI", price: "12,00", spicy: true },
                        { name: "MARGHERITA", price: "11,75" },
                        { name: "FRANGO BBQ", price: "14,25" },
                        { name: "QUATRO QUEIJOS", price: "13,00" },
                        { name: "SALAME PICANTE", price: "15,50", spicy: true },
                        { name: "COGUMELO TRUFADO", price: "16,00" },
                        { name: "VEGETARIANA", price: "13,00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Apimentado">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: BURGERS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>HAMBÚRGUERES</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "CLÁSSICO", price: "10,50" },
                        { name: "DUPLO QUEIJO", price: "13,00" },
                        { name: "SMASH", price: "13,75" },
                        { name: "BACON BBQ", price: "14,00" },
                        { name: "FRANGO CROCANTE", price: "12,00", spicy: true }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Apimentado">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: HOT DOGS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>CACHORRO-QUENTE</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "CLÁSSICO", price: "7,25" },
                        { name: "CHILI COM QUEIJO", price: "8,25" },
                        { name: "BACON E QUEIJO", price: "11,00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: WRAPS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>WRAPS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "FRANGO", price: "8,50" },
                        { name: "CAESAR", price: "11,25" },
                        { name: "CROCANTE APIMENTADO", price: "11,00", spicy: true },
                        { name: "FRANGO COM ALHO", price: "12,50" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Apimentado">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>


                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-12">
                  
                  {/* Category: WINGS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>ASINHAS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "BUFFALO", price: "12,00", spicy: true },
                        { name: "BBQ", price: "11,00" },
                        { name: "MEL GLAÇADO", price: "14,50" },
                        { name: "MEL APIMENTADO", price: "14,00", spicy: true },
                        { name: "LEMON PEPPER", price: "13,00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Apimentado">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category: RINGS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>ANÉIS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "CEBOLA", price: "4,25" },
                        { name: "JALAPEÑO", price: "9,00", spicy: true },
                        { name: "CROCANTE", price: "7,75" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          {item.spicy && <span className="ml-2 text-sm" title="Apimentado">🌶️</span>}
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>


                  {/* Category: DRINKS */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                    <h4 className="font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>BEBIDAS</h4>
                    <div className="flex flex-col gap-5">
                      {[
                        { name: "COCA-COLA", price: "2,25" },
                        { name: "LIMONADA", price: "3,00" },
                        { name: "CHÁ GELADO", price: "3,75" },
                        { name: "REFRIGERANTE DE LARANJA", price: "2,00" },
                        { name: "MILKSHAKE", price: "5,50" },
                        { name: "MOJITO", price: "4,00" },
                        { name: "COLD BREW", price: "2,00" }
                      ].map(item => (
                        <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } } }} className="flex items-center w-full group">
                          <span className="font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors">{item.name}</span>
                          <div className="border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1"></div>
                          <button onClick={() => addToCart((item as any).id || products.find(p => p.name === item.name)?.id)} className="font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:bg-amber-100 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">R$ {item.price} <Plus className="size-3"/></button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>

              </div>

              {/* COMBOS ESPECIAIS (Full Width Below Grid) */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15, delayChildren: 0.2 } } }} className="mt-16 pt-16 border-t border-black/5">
                <div className="flex flex-col items-center text-center mb-10">
                  <h4 className="font-display text-4xl sm:text-5xl font-black tracking-tight transition-colors duration-700" style={{ color: currentTheme.textDark }}>COMBOS ESPECIAIS</h4>
                  <p className="mt-3 text-lg font-medium opacity-70" style={{ color: currentTheme.textDark }}>As combinações definitivas para matar qualquer fome.</p>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  
                  {/* Combo 1 */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 90 } } }}
                    className="group relative overflow-hidden rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl bg-[#0a0a0a]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black opacity-90"></div>
                    {/* Glow effect */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors duration-500"></div>
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-colors duration-500"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                      {/* Text Content */}
                      <div className="flex-1 text-white flex flex-col justify-center h-full">
                        <div>
                          <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold tracking-wider mb-4 border border-amber-500/20">MAIS VENDIDO • ECONOMIZE R$ 8</span>
                          <h4 className="font-display text-3xl sm:text-4xl font-black leading-tight mb-3">COMBO BRASA</h4>
                          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-sm">O suculento Brasa Bacon acompanhado da refrescante Coca-Cola bem gelada. A combinação definitiva.</p>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-auto">
                          <span className="text-3xl font-black font-display text-amber-500">R$ 49,90</span>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(2)} className="bg-amber-500 text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            Adicionar
                          </motion.button>
                        </div>
                      </div>

                      {/* 3D Images */}
                      <div className="w-full md:w-1/2 h-56 sm:h-64 relative flex items-center justify-center">
                        <motion.img 
                          src={cocaCola} 
                          alt="Coca Cola" 
                          className="absolute right-[15%] top-[10%] w-28 sm:w-36 h-28 sm:h-36 object-cover rounded-2xl border border-white/10 shadow-2xl rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ease-out z-10"
                        />
                        <motion.img 
                          src={burgerBrasa} 
                          alt="Burger Brasa" 
                          className="absolute left-[5%] bottom-[5%] w-40 sm:w-52 h-40 sm:h-52 object-cover rounded-2xl border-4 border-[#1a1a1a] shadow-2xl -rotate-6 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ease-out z-20"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Combo 2 */}
                  <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 90 } } }}
                    className="group relative overflow-hidden rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl bg-[#0a0a0a]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2D0A0A] to-black opacity-90"></div>
                    {/* Glow effect */}
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/30 transition-colors duration-500"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-500"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                      {/* Text Content */}
                      <div className="flex-1 text-white flex flex-col justify-center h-full">
                        <div>
                          <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold tracking-wider mb-4 border border-red-500/20">OUSADO • ECONOMIZE R$ 12</span>
                          <h4 className="font-display text-3xl sm:text-4xl font-black leading-tight mb-3">COMBO INFERNO</h4>
                          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-sm">Para os fortes: Inferno Picante com Cerveja Pilsen trincando para apagar o fogo. Você aguenta?</p>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-auto">
                          <span className="text-3xl font-black font-display text-red-500">R$ 51,90</span>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(3)} className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-red-500 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            Adicionar
                          </motion.button>
                        </div>
                      </div>

                      {/* 3D Images */}
                      <div className="w-full md:w-1/2 h-56 sm:h-64 relative flex items-center justify-center">
                        <motion.img 
                          src={beer} 
                          alt="Cerveja" 
                          className="absolute right-[5%] top-[10%] w-28 sm:w-36 h-28 sm:h-36 object-cover rounded-2xl border border-white/10 shadow-2xl -rotate-6 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ease-out z-10"
                        />
                        <motion.img 
                          src={burgerInferno} 
                          alt="Burger Inferno" 
                          className="absolute left-[5%] bottom-[5%] w-40 sm:w-52 h-40 sm:h-52 object-cover rounded-2xl border-4 border-[#2D0A0A] shadow-2xl rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ease-out z-20"
                        />
                      </div>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Appetizer Slider Section */}
        <AppetizerSlider onAddToCart={addToCart} currentTheme={currentTheme} />

        {/* Galeria Section (3D Cylinder - Exact Match) */}
        <section className="relative overflow-hidden border-y border-white/10 py-24 flex flex-col items-center transition-colors duration-700" style={{ backgroundColor: currentTheme.bgVeryDark }}>
          <div className="absolute inset-0 opacity-60 pointer-events-none transition-colors duration-700" style={{ backgroundImage: `radial-gradient(ellipse at center, ${currentTheme.secondaryAlpha} 0%, transparent 100%)` }}></div>
          
          <div className="relative z-10 w-full mb-8 flex justify-center text-center">
            <div className="flex flex-col items-center max-w-3xl px-5">
              <h2 className="font-display text-2xl sm:text-3xl font-medium mb-6 opacity-70 transition-colors duration-700" style={{ color: currentTheme.bgLight }}>
                Criado para atrair, despertar fome e surpreender seu paladar.
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5" style={{ backgroundColor: currentTheme.secondary }}>
                  Fazer Pedido <ArrowUpRight className="size-4" />
                </button>
                <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 border border-white/10 text-white px-7 py-3 rounded-full font-bold text-sm transition-all hover:bg-white/10" style={{ backgroundColor: currentTheme.bgDark }}>
                  Ver Cardápio
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes spinGallery {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
            .animate-spin-gallery {
              animation: spinGallery 40s linear infinite;
            }
            .animate-spin-gallery:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* 3D Scene */}
          <div className="relative z-10 w-full flex justify-center items-center h-[350px] sm:h-[450px]" style={{ perspective: "800px" }}>
            <div 
              className="relative w-full h-full flex justify-center items-center scale-[0.6] sm:scale-100 mt-10" 
              style={{ transformStyle: "preserve-3d" }}
            >
              <div 
                className="absolute w-full h-full animate-spin-gallery cursor-grab active:cursor-grabbing"
                style={{ transformStyle: "preserve-3d" }}
              >
                {[
                  { img: "/burger_one.jpg", alt: "Fogo e Chapa Burger 1" },
                  { img: "/pizza_hero.jpg", alt: "Fogo e Chapa Pizza" },
                  { img: "/hotdog.jpg", alt: "Fogo e Chapa Hot Dog" },
                  { img: "/burger_three.jpg", alt: "Fogo e Chapa Burger 3" },
                  { img: "/wrap.jpg", alt: "Fogo e Chapa Wrap" },
                  { img: "/burger_two.jpg", alt: "Fogo e Chapa Burger 2" },
                  { img: "/burger_one.jpg", alt: "Fogo e Chapa Burger 1" },
                  { img: "/pizza_hero.jpg", alt: "Fogo e Chapa Pizza" },
                  { img: "/hotdog.jpg", alt: "Fogo e Chapa Hot Dog" },
                  { img: "/burger_three.jpg", alt: "Fogo e Chapa Burger 3" },
                  { img: "/wrap.jpg", alt: "Fogo e Chapa Wrap" },
                  { img: "/burger_two.jpg", alt: "Fogo e Chapa Burger 2" }
                ].map((item, idx) => {
                  const angle = idx * (360 / 12);
                  return (
                    <div 
                      key={idx} 
                      className="absolute left-1/2 top-1/2 w-[240px] h-[340px] sm:w-[280px] sm:h-[380px] -ml-[120px] sm:-ml-[140px] -mt-[170px] sm:-mt-[190px] rounded-[24px] overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:border-amber-500/30"
                      style={{ 
                        transform: `rotateY(${angle}deg) translateZ(-550px)`,
                        backfaceVisibility: "hidden"
                      }}
                    >
                      <img src={item.img} alt={item.alt} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-16 px-6 sm:px-8 py-3.5 border border-[#D14F26]/30 bg-[#1A0A05]/80 backdrop-blur-md rounded-full shadow-lg">
            <span className="flex items-center gap-2 text-[#FBF5E9]/90 text-xs sm:text-sm font-medium"><PlaySquare className="size-4 opacity-70" /> Sabor Incomparável</span>
            <span className="text-[#D14F26] text-xs">  </span>
            <span className="flex items-center gap-2 text-[#FBF5E9]/90 text-xs sm:text-sm font-medium"><Layers className="size-4 opacity-70" /> Ingredientes Frescos</span>
            <span className="text-[#D14F26] text-xs">  </span>
            <span className="flex items-center gap-2 text-[#FBF5E9]/90 text-xs sm:text-sm font-medium"><TrendingUp className="size-4 opacity-70" /> Fogo na Chapa</span>
          </div>
        </section>

        {/* Drinks Section */}
        <section id="drinks" className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden bg-white py-20">
          
          <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-12 flex flex-col md:flex-row items-center justify-center w-full h-full gap-8 md:gap-0">
            
            {/* Left Content - Title and Text */}
            <div className="w-full md:w-[50%] flex flex-col justify-center relative z-20 mt-10 md:mt-0 order-2 md:order-1 h-full">
              
              <div className="relative w-full max-w-2xl pl-2 md:pl-8 pt-12">
                {/* Sticker Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="absolute -top-4 left-4 md:-top-2 md:left-8 bg-white border-[3px] rounded-full px-3 py-1 md:px-4 md:py-2 shadow-[2px_3px_0px_rgba(0,0,0,0.2)] z-30 flex flex-col items-center transition-colors duration-700"
                  style={{ borderColor: currentTheme.primary }}
                >
                  <span className="font-display font-black text-[10px] md:text-sm leading-none tracking-tighter transition-colors duration-700" style={{ color: currentTheme.primary }}>BOM</span>
                  <span className="font-display font-black text-[10px] md:text-sm leading-none tracking-tighter transition-colors duration-700" style={{ color: currentTheme.primary }}>HUMOR</span>
                </motion.div>
                
                {/* Main Tilted Title */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative z-20 flex flex-col"
                >
                  {/* Top Word (FRESHLY style) */}
                  <h2 
                    className="font-display text-[17vw] md:text-[10vw] leading-[0.85] font-black uppercase tracking-tighter ml-6 md:ml-12 transition-all duration-700" 
                    style={{ 
                      color: currentTheme.secondary,
                      textShadow: `6px 6px 0px ${currentTheme.secondaryAlpha}`
                    }}
                  >
                    NOSSOS
                  </h2>
                  
                  {/* Bottom Word (BREWED style) - Inside a skewed brown box */}
                  <div className="relative mt-2 md:mt-4 w-fit">
                    {/* The skewed background box */}
                    <div className="absolute inset-0 transform -skew-y-3 -rotate-2 scale-105 origin-left transition-colors duration-700" style={{ backgroundColor: currentTheme.secondary }} />
                    
                    {/* The text itself */}
                    <h2 
                      className="relative font-display text-[17vw] md:text-[10vw] leading-[0.85] font-black text-white uppercase tracking-tighter px-4 py-2 transform -skew-y-3 -rotate-2 transition-all duration-700" 
                      style={{ 
                        WebkitTextStroke: `2px ${currentTheme.secondary}`
                      }}
                    >
                      DRINKS
                    </h2>
                  </div>
                </motion.div>
              </div>

              {/* Story Block */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-14 md:mt-20 max-w-[320px] pl-6 md:pl-10"
              >
                <h3 className="font-display font-black text-xl mb-3 tracking-tighter uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>NOSSA HISTÓRIA</h3>
                <p className="text-sm leading-relaxed mb-8 font-medium transition-colors duration-700 opacity-80" style={{ color: currentTheme.primary }}>
                  Refrigerantes gelados e bebidas feitas para refrescar o seu dia. Encontre a nossa hamburgueria e aproveite uma experiência de sabor na brasa.
                </p>
                <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full text-white font-black uppercase px-6 py-6 text-sm transition-all duration-700 border-[3px] flex items-center gap-3 w-fit"
                  style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.secondary }}>
                  PEDIR AGORA <ChevronRight className="size-5 bg-white rounded-full p-0.5 transition-colors duration-700" style={{ color: currentTheme.secondary }} />
                </Button>
              </motion.div>

            </div>

            {/* Right Content - Generated Soda Cup Image */}
            <div className="w-full md:w-[50%] relative min-h-[400px] md:min-h-[700px] flex justify-end items-center order-1 md:order-2">
               
               {/* Main Soda Drink Image */}
               <motion.div
                 initial={{ opacity: 0, x: 100 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ 
                   type: "spring", 
                   stiffness: 40,
                   damping: 15,
                   duration: 1.2
                 }}
                 className="relative z-20 w-full max-w-[700px] md:max-w-[900px] lg:max-w-[1000px] flex justify-end md:-mr-12 lg:-mr-32 xl:-mr-48"
                 style={{ mixBlendMode: "multiply" }}
               >
                 <img 
                   src={sodaSplash} 
                   alt="Refrigerante Gelado" 
                   className="w-full h-auto object-contain scale-110 md:scale-125 lg:scale-150 origin-right"
                 />
               </motion.div>
               
            </div>
            
          </div>
        </section>

        {/* Drinks Grid Section */}
        <section className="w-full py-16 md:py-24 border-t transition-colors duration-700" style={{ backgroundColor: currentTheme.bgLight, borderColor: currentTheme.secondaryAlpha }}>
          <div className="mx-auto max-w-[1400px] px-5 lg:px-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 md:gap-0">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display font-black text-5xl md:text-6xl lg:text-[5.5rem] leading-[0.85] uppercase tracking-tighter max-w-xl transition-colors duration-700"
                style={{ color: currentTheme.secondary }}
              >
                DRINKS FOR<br/>EVERYDAY
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full text-white font-black uppercase px-6 py-5 text-sm transition-all duration-700 border-[3px] flex items-center gap-3"
                  style={{ backgroundColor: currentTheme.secondary, borderColor: currentTheme.secondary }}>
                  VIEW ALL MENU <ChevronRight className="size-5 bg-white rounded-full p-0.5 transition-colors duration-700" style={{ color: currentTheme.secondary }} />
                </Button>
              </motion.div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0">
              
              {/* Item 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:border-r pr-0 md:pr-8 lg:pr-12 pb-16 md:border-b transition-colors duration-700"
                style={{ borderColor: currentTheme.secondaryAlpha }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>COLA<br/>TRADICIONAL</h3>
                  <button onClick={() => addToCart(201)} className="font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700" style={{ color: currentTheme.secondary }}>ORDER NOW +</button>
                </div>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <img 
                    src={cocaCola} 
                    alt="Cola Tradicional" 
                    className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply" 
                    style={{ filter: "contrast(1.15) brightness(1.08)" }}
                  />
                </div>
              </motion.div>

              {/* Item 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:border-r px-0 md:px-8 lg:px-12 mt-12 md:mt-0 pb-16 md:border-b transition-colors duration-700"
                style={{ borderColor: currentTheme.secondaryAlpha }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>SUCO DE<br/>LARANJA</h3>
                  <button onClick={() => addToCart(202)} className="font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700" style={{ color: currentTheme.secondary }}>ORDER NOW +</button>
                </div>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <img 
                    src={orangeJuice} 
                    alt="Suco de Laranja" 
                    className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply" 
                    style={{ filter: "contrast(1.15) brightness(1.08)" }}
                  />
                </div>
              </motion.div>

              {/* Item 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col pl-0 md:pl-8 lg:pl-12 mt-12 md:mt-0 pb-16 md:border-b transition-colors duration-700"
                style={{ borderColor: currentTheme.secondaryAlpha }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>LIMONADA<br/>SUÍÇA</h3>
                  <button onClick={() => addToCart(203)} className="font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700" style={{ color: currentTheme.secondary }}>ORDER NOW +</button>
                </div>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <img 
                    src={lemonade} 
                    alt="Limonada Suíça" 
                    className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply" 
                    style={{ filter: "contrast(1.15) brightness(1.08)" }}
                  />
                </div>
              </motion.div>

              {/* Item 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:border-r pr-0 md:pr-8 lg:pr-12 pt-16 transition-colors duration-700"
                style={{ borderColor: currentTheme.secondaryAlpha }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>CHOPP<br/>GELADO</h3>
                  <button onClick={() => addToCart(204)} className="font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700" style={{ color: currentTheme.secondary }}>ORDER NOW +</button>
                </div>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <img 
                    src={beer} 
                    alt="Chopp Gelado" 
                    className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply" 
                    style={{ filter: "contrast(1.15) brightness(1.08)" }}
                  />
                </div>
              </motion.div>

              {/* Item 5 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col md:border-r px-0 md:px-8 lg:px-12 pt-16 transition-colors duration-700"
                style={{ borderColor: currentTheme.secondaryAlpha }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>CHÁ<br/>GELADO</h3>
                  <button onClick={() => addToCart(205)} className="font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700" style={{ color: currentTheme.secondary }}>ORDER NOW +</button>
                </div>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <img 
                    src={icedTea} 
                    alt="Chá Gelado" 
                    className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply" 
                    style={{ filter: "contrast(1.15) brightness(1.08)" }}
                  />
                </div>
              </motion.div>

              {/* Item 6 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col pl-0 md:pl-8 lg:pl-12 pt-16 transition-colors duration-700"
              >
                <div className="flex items-baseline justify-between mb-8">
                  <h3 className="font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700" style={{ color: currentTheme.secondary }}>GUARANÁ<br/>NATURAL</h3>
                  <button onClick={() => addToCart(206)} className="font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700" style={{ color: currentTheme.secondary }}>ORDER NOW +</button>
                </div>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <img 
                    src={guarana} 
                    alt="Guaraná Natural" 
                    className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply" 
                    style={{ filter: "contrast(1.15) brightness(1.08)" }}
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>


        <section id="sobre" className="border-y border-white/10 py-24 sm:py-32 relative overflow-hidden transition-colors duration-700" style={{ backgroundColor: currentTheme.bgDark }}>
          
          {/* Premium Glowing Background Effects */}
          <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-30 pointer-events-none mix-blend-screen transition-colors duration-700 animate-pulse" style={{ backgroundColor: currentTheme.secondary }}></div>
          <div className="absolute -bottom-32 right-1/4 w-[25rem] h-[25rem] rounded-full blur-[100px] opacity-20 pointer-events-none mix-blend-screen transition-colors duration-700 animate-pulse" style={{ backgroundColor: currentTheme.secondary, animationDelay: '2s' }}></div>
          <div className="absolute inset-0 pointer-events-none transition-colors duration-700" style={{ backgroundImage: `radial-gradient(ellipse at center, transparent 30%, ${currentTheme.bgDark} 100%)` }}></div>
          
          <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:items-center lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
            >
              <p className="eyebrow transition-colors duration-700" style={{ color: currentTheme.secondary }}>Manifesto da chapa</p>
              <h2 className="section-title">O sabor começa<br /><span className="transition-colors duration-700" style={{ color: currentTheme.secondary }}>no fogo</span></h2>
            </motion.div>
            <div className="grid gap-7 sm:grid-cols-2">
              {[{n:"01", title:"Blend autoral", text:"Cortes selecionados, moídos todos os dias e moldados à mão."}, {n:"02", title:"Calor de verdade", text:"Chapa de ferro em alta temperatura para a crosta perfeita."}, {n:"03", title:"Origem local", text:"Pães, hortaliças e queijos de pequenos produtores parceiros."}, {n:"04", title:"Sem atalhos", text:"Molhos, picles e acompanhamentos feitos dentro de casa."}].map((item, i) => (
                <motion.div 
                  key={item.n} 
                  className="border-t border-white/10 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <span className="font-mono text-xs transition-colors duration-700" style={{ color: currentTheme.secondary }}>{item.n}</span>
                  <h3 className="mt-3 font-display text-xl font-bold uppercase">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>

      <footer ref={footerRef} id="contato" className="fixed bottom-0 left-0 w-full pt-20 transition-colors duration-700 overflow-hidden text-white z-[-1]" style={{ backgroundColor: currentTheme.bgVeryDark }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 relative z-10 flex flex-col gap-12">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 pb-10 border-b border-white/10">
            <div className="flex gap-6 font-display font-black text-lg">
              <a href="#cardapio" className="hover:text-white/80 transition-colors">MENU</a>
              <a href="#promocoes" className="hover:text-white/80 transition-colors">PROMOÇÕES</a>
              <a href="#avaliacoes" className="hover:text-white/80 transition-colors">AVALIAÇÕES</a>
              <a href="#contato" className="hover:text-white/80 transition-colors">LOCAL</a>
            </div>
            <div className="text-4xl font-black font-display tracking-tighter uppercase flex items-center gap-1">
              FOGO<span style={{ backgroundColor: currentTheme.secondary }} className="rounded-full text-white size-8 flex items-center justify-center text-2xl -mt-1">&</span>CHAPA
            </div>
            <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="font-bold uppercase tracking-wider rounded-full border-2 hover:bg-white hover:text-black transition-colors px-8" style={{ borderColor: currentTheme.secondary, color: 'white', backgroundColor: 'transparent' }}>
              PEDIR AGORA
            </Button>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="space-y-4 font-bold text-sm uppercase">
              <a href="#cardapio" className="block hover:text-white/70 transition-colors">MENU</a>
              <a href="#promocoes" className="block hover:text-white/70 transition-colors">PROMOÇÕES</a>
              <a href="#avaliacoes" className="block hover:text-white/70 transition-colors">AVALIAÇÕES</a>
              <a href="#contato" className="block hover:text-white/70 transition-colors">ONDE ESTAMOS</a>
            </div>
            <div className="space-y-4 font-bold text-sm uppercase">
              <a href="#" className="block hover:text-white/70 transition-colors">POLÍTICA DE PRIVACIDADE</a>
              <a href="#" className="block hover:text-white/70 transition-colors">TERMOS DE SERVIÇO</a>
              <a href="#" className="block hover:text-white/70 transition-colors">POLÍTICA DE REEMBOLSO</a>
            </div>
            <div className="space-y-6">
              <a href="#" className="flex items-center gap-3 group">
                <div className="size-10 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105" style={{ backgroundColor: currentTheme.secondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 11.454c-.015-3.084 2.52-4.557 2.634-4.627-1.436-2.102-3.659-2.387-4.453-2.417-1.895-.19-3.704 1.115-4.664 1.115-.961 0-2.454-1.09-4.004-1.061-2.02.028-3.882 1.173-4.919 3.003-2.096 3.651-.537 9.07 1.503 12.032 1.002 1.455 2.179 3.086 3.754 3.031 1.498-.057 2.062-.962 3.865-.962 1.787 0 2.308.962 3.865.932 1.614-.029 2.63-1.47 3.616-2.918 1.144-1.671 1.614-3.29 1.642-3.376-.037-.014-3.153-1.214-3.138-4.32z"/><path d="M10.985 5.566c.82-.99 1.373-2.368 1.222-3.74-.112.005-.23.012-.34.012-1.353 0-2.825-.85-3.67-1.859-.757-.9-1.391-2.327-1.21-3.67 1.464.113 2.802.99 3.658 1.956.76.85 1.326 2.197 1.19 3.51-.1.006-.21.006-.31.006-1.39.006-2.784-.81-3.64-1.78z"/></svg>
                </div>
                <div className="text-xs">Baixar na<br/><span className="font-bold text-sm">App Store</span></div>
              </a>
              <a href="#" className="flex items-center gap-3 group">
                <div className="size-10 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105" style={{ backgroundColor: currentTheme.secondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.685 1.298c-.4.2-.785.643-.785 1.306v18.791c0 .663.385 1.106.785 1.306.4.2.97.106 1.442-.17L21.36 12.91c.471-.277.74-.75.74-1.16 0-.41-.269-.882-.74-1.158L6.127 1.469c-.472-.277-1.042-.371-1.442-.17z"/></svg>
                </div>
                <div className="text-xs">Baixar no<br/><span className="font-bold text-sm">Google Play</span></div>
              </a>
            </div>
            
            <div className="col-span-2 lg:col-span-1 h-48 lg:h-56 rounded-xl overflow-hidden order-first md:order-none relative bg-white/5 shadow-inner">
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3657.197368023192!2d-46.689364!3d-23.559385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce57a6020c6a51%3A0xc3928ebaf298e8!2sVila%20Madalena%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1714522804561!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="opacity-90 hover:opacity-100 transition-opacity"></iframe>
            </div>

            <div className="col-span-2 lg:col-span-1 space-y-6 flex flex-col justify-start">
              <div className="flex gap-3">
                <div className="size-10 rounded-full flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: currentTheme.secondary }}><MapPin className="size-5" /></div>
                <div className="text-sm font-bold">Rua das Brasas, 217<br/><span className="text-xs font-normal opacity-70">São Paulo, SP 05414, Brasil</span></div>
              </div>
              <div className="flex gap-3">
                <div className="size-10 rounded-full flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: currentTheme.secondary }}><Clock3 className="size-5" /></div>
                <div className="text-sm font-bold">+55 11 9999-9999<br/><span className="text-xs font-normal opacity-70">Ter-Dom, 18h - 23h</span></div>
              </div>
            </div>
          </div>

          {/* Bottom Grid Layout for Newsletter and Socials */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mt-4 items-end">
            <div className="lg:col-span-3">
              <h3 className="font-display font-black text-xl mb-4 uppercase tracking-wide" style={{ color: currentTheme.secondary }}>NUNCA PERCA UMA PROMOÇÃO</h3>
              <form className="flex max-w-sm h-12" onSubmit={(e) => { e.preventDefault(); }}>
                <input type="email" placeholder="nome@email.com" className="flex-1 bg-transparent border border-white/30 rounded-l-md px-4 text-sm focus:outline-none focus:border-white transition-colors" />
                <Button type="submit" className="font-bold hover:brightness-110 transition-all text-white rounded-l-none h-full px-6" style={{ backgroundColor: currentTheme.secondary }}>ASSINAR</Button>
              </form>
              <p className="text-xs mt-3 opacity-70 leading-relaxed">Receba combos exclusivos direto no seu e-mail.<br/>Sem spam, prometemos.</p>
            </div>
            
            <div className="lg:col-span-2 flex justify-start lg:justify-end items-center gap-3">
              <span className="text-sm font-bold mr-2">Siga-nos:</span>
              <a href="#" className="size-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" style={{ backgroundColor: currentTheme.secondary }}><Instagram className="size-5" /></a>
              <a href="#" className="size-10 rounded-full flex items-center justify-center font-bold text-lg text-white hover:scale-110 transition-transform" style={{ backgroundColor: currentTheme.secondary }}>T</a>
            </div>
          </div>
        </div>

        {/* Giant Cutoff Text Bottom Edge */}
        <div className="w-full relative h-[30vw] min-h-[160px] max-h-[400px] mt-10 overflow-hidden select-none pointer-events-none flex justify-center items-end opacity-95 transition-colors duration-700">
           <div className="font-display font-black uppercase text-[24vw] leading-[0.75] tracking-tighter whitespace-nowrap translate-y-[20%] flex items-center" style={{ color: 'white' }}>
             FOGO
             <span className="inline-flex items-center justify-center rounded-full text-white bg-secondary aspect-square w-[20vw] mx-[1vw] leading-none pb-[1vw] shadow-2xl" style={{ backgroundColor: currentTheme.secondary }}>
               &
             </span>
             CHAPA
           </div>
        </div>
      </footer>

      {authOpen && <AuthModal mode={mode} setMode={setMode} onClose={() => setAuthOpen(false)} />}
      <AnimatePresence>
        {trackingOpen && activeOrderTime && <DeliveryTrackingModal activeOrderTime={activeOrderTime} activeOrderType={activeOrderType} activeDriver={activeDriver} activeRoute={activeRoute} onClose={() => setTrackingOpen(false)} currentTheme={currentTheme} />}
      </AnimatePresence>
    </>
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
      <div className="glass-panel relative w-full max-w-md overflow-hidden border border-white/10 p-6 shadow-modal sm:p-8">
        <Button size="icon" variant="ghost" className="absolute right-3 top-3" aria-label="Fechar" onClick={onClose}><X className="size-5" /></Button>
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary"><Flame className="size-6 fill-current" /></div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Acesso à mesa</p>
        <h2 id="auth-title" className="mt-2 font-display text-3xl font-black uppercase">{mode === "login" ? "Bem-vindo de volta" : "Entre para a brasa"}</h2>
        <p className="mt-2 text-sm opacity-70">{mode === "login" ? "Acesse sua conta para acompanhar seus pedidos." : "Crie seu acesso e agilize os próximos pedidos."}</p>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-sm border border-white/10 bg-background/50 p-1">
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
        <div className="grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => setMessage("Google é apenas demonstrativo nesta versão.")}><span className="font-bold">G</span> Google</Button><Button variant="outline" onClick={() => setMessage("Apple é apenas demonstrativo nesta versão.")}>Apple</Button></div>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">Demonstração visual. Nenhum dado é enviado ou armazenado.</p>
      </div>
    </div>
  );
}

function DeliveryTrackingModal({ onClose, currentTheme, activeOrderTime, activeOrderType, activeDriver, activeRoute }: { onClose: () => void, currentTheme: any, activeOrderTime: number, activeOrderType?: "delivery" | "pickup" | null, activeDriver: number, activeRoute: number }) {
  const [stage, setStage] = useState<"picking_up" | "delivering" | "delivered">("picking_up");
  const [ratingState, setRatingState] = useState<"driver" | "food" | "done" | null>(null);
  const [driverRating, setDriverRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const pickupCode = useMemo(() => Math.floor(1000 + Math.random() * 9000).toString(), []);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let reqId: number;
    const duration1 = 30000;
    const duration2 = 45000;

    function updateStage() {
      const elapsed = Date.now() - activeOrderTime;
      if (elapsed < duration1) {
        setStage("picking_up");
      } else if (elapsed < duration1 + duration2) {
        setStage("delivering");
      } else {
        setStage("delivered");
      }
      
      if (elapsed < duration1 + duration2) {
        reqId = requestAnimationFrame(updateStage);
      }
    }
    
    reqId = requestAnimationFrame(updateStage);
    return () => cancelAnimationFrame(reqId);
  }, [activeOrderTime]);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (activeOrderType === "pickup" || mapInstanceRef.current || !mapRef.current) return;
      const L = (window as any).L;
      
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([-23.562, -46.655], 16);
      mapInstanceRef.current = map;

      // Google Maps standard tiles (no API key required overlay)
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 19
      }).addTo(map);

      // Coordinates (more detailed to simulate street turns)
      const mockRoute = MOCK_ROUTES[activeRoute];
      const driverStart = mockRoute.start;
      const restaurant = [-23.562, -46.655];
      const customer = mockRoute.customer;

      // Route 1 (Picking Up)
      const route1 = mockRoute.route1;
      // Route 2 (Delivering)
      const route2 = mockRoute.route2;
      const fullRoute = [...route1, ...route2];

      // Gray background line (full route)
      L.polyline(fullRoute, { color: '#D1D5DB', weight: 8, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      
      // Blue active line (will be updated dynamically to show remaining path)
      const activeLineBg = L.polyline([], { color: 'white', weight: 12, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      const activeLine = L.polyline([], { color: '#00A2FF', weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(map);

      // Markers
      const createDot = (color: string, icon: string) => L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: white; width: 32px; height: 32px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.2); border: 4px solid ${color}; display: flex; align-items: center; justify-content: center; font-size: 16px;">${icon}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(restaurant, { icon: createDot(currentTheme.secondary, '🍔') }).addTo(map);
      L.marker(customer, { icon: createDot('black', '📍') }).addTo(map);

      // Animated Driver Marker
      const driverIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                 <div style="position: absolute; inset: 0; background-color: #00A2FF; border-radius: 50%; opacity: 0.2; animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                 <div style="width: 32px; height: 32px; background-color: white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 10;">
                   <div id="driver-icon-rotation" style="width: 22px; height: 22px; background-color: #00A2FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s linear;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M12 2L22 20L12 16L2 20L12 2Z"/></svg>
                   </div>
                 </div>
               </div>
               <style>@keyframes pulse-ring { 0% { transform: scale(0.5); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }</style>`,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
      });

      const driverMarker = L.marker(driverStart, { icon: driverIcon }).addTo(map);

      // Simple animation loop along the route
      const duration1 = 30000; // 30s to pick up
      const duration2 = 45000; // 45s to deliver
      
      const computeDistances = (path: number[][]) => {
        const dists = [0];
        let total = 0;
        for (let i = 0; i < path.length - 1; i++) {
          const dx = path[i+1][1] - path[i][1];
          const dy = path[i+1][0] - path[i][0];
          total += Math.sqrt(dx*dx + dy*dy);
          dists.push(total);
        }
        return { dists, total };
      };
      
      const r1Data = computeDistances(route1);
      const r2Data = computeDistances(route2);

      // Helper to compute position, bearing, and remaining path based on true distance
      function getPathData(path: number[][], pathInfo: {dists: number[], total: number}, progress: number) {
        if (path.length < 2) return { pt: path[0], bearing: 0, remaining: path };
        
        const targetDist = progress * pathInfo.total;
        let idx = 0;
        for (let i = 0; i < pathInfo.dists.length - 1; i++) {
           if (targetDist >= pathInfo.dists[i] && targetDist <= pathInfo.dists[i+1]) {
             idx = i;
             break;
           }
        }
        if (targetDist >= pathInfo.total) idx = path.length - 2;
        
        const segmentLen = pathInfo.dists[idx+1] - pathInfo.dists[idx];
        const segmentProg = segmentLen === 0 ? 0 : (targetDist - pathInfo.dists[idx]) / segmentLen;
        
        const p1 = path[idx];
        const p2 = path[idx + 1];
        
        const pt = [
          p1[0] + (p2[0] - p1[0]) * segmentProg,
          p1[1] + (p2[1] - p1[1]) * segmentProg
        ];

        const dy = p2[0] - p1[0]; 
        const dx = p2[1] - p1[1]; 
        const bearing = Math.atan2(dx, dy) * (180 / Math.PI);
        
        const remaining = [pt, ...path.slice(idx + 1)];
        return { pt, bearing, remaining };
      }

      function updateActiveLine(currentPath: number[][]) {
        activeLineBg.setLatLngs(currentPath as any);
        activeLine.setLatLngs(currentPath as any);
      }

      let reqId: number;
      function animate() {
        if (!mapInstanceRef.current) return;
        const now = Date.now();
        let elapsed = now - activeOrderTime;
        
        let isDone = false;
        if (elapsed >= duration1 + duration2) {
           elapsed = duration1 + duration2;
           isDone = true;
        }

        let currentPt, currentBearing, currentRemaining;

        if (elapsed < duration1) {
           const progress = elapsed / duration1;
           const data = getPathData(route1, r1Data, progress);
           currentPt = data.pt;
           currentBearing = data.bearing;
           currentRemaining = [...data.remaining, ...route2.slice(1)];
        } else {
           const progress = (elapsed - duration1) / duration2;
           const data = getPathData(route2, r2Data, progress);
           currentPt = data.pt;
           currentBearing = data.bearing;
           currentRemaining = data.remaining;
        }

        driverMarker.setLatLng(currentPt as any);
        updateActiveLine(currentRemaining as any);

        const rotIcon = document.getElementById("driver-icon-rotation");
        if (rotIcon) {
          rotIcon.style.transform = `rotate(${currentBearing}deg)`;
        }

        if (!isDone) {
          map.setView(currentPt as any, 16, { animate: false });
          reqId = requestAnimationFrame(animate);
        } else {
          map.setView(customer as any, 16, { animate: false });
        }
      }
      
      reqId = requestAnimationFrame(animate);
      (map as any)._animateReqId = reqId;
    }

    return () => {
      if (mapInstanceRef.current) {
        if ((mapInstanceRef.current as any)._animateReqId) {
          cancelAnimationFrame((mapInstanceRef.current as any)._animateReqId);
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentTheme, activeOrderTime]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#e5e7eb]" 
    >
      <div className={`relative flex-1 overflow-hidden ${activeOrderType === "pickup" ? "bg-background flex flex-col items-center justify-center" : ""}`}>
        {/* Real Leaflet Map Container */}
        {activeOrderType !== "pickup" && <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />}
        
        {activeOrderType === "pickup" && (
             <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black overflow-hidden flex flex-col items-center justify-center pt-10">
                {/* Floating Particles Background */}
                <div className="absolute inset-0 opacity-20">
                   {[...Array(12)].map((_, i) => (
                      <div key={i} className="absolute rounded-full bg-white animate-pulse" 
                           style={{ 
                              width: Math.random() * 6 + 2 + 'px', 
                              height: Math.random() * 6 + 2 + 'px',
                              top: Math.random() * 100 + '%',
                              left: Math.random() * 100 + '%',
                              animationDuration: (Math.random() * 3 + 2) + 's',
                              animationDelay: (Math.random() * 2) + 's'
                           }}></div>
                   ))}
                </div>

                <div className="relative z-10 px-4 flex flex-col items-center w-full max-w-lg mx-auto">
                   <div className="relative group animate-in fade-in zoom-in duration-1000 w-full">
                     {/* Outer Glow */}
                     <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff9d00] via-[#ffaa22] to-[#ff5500] rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
                     
                     {/* Main Card */}
                     <div className="relative bg-black/40 backdrop-blur-3xl border border-white/20 px-8 py-16 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center transform transition-all duration-700">
                       {/* Subtle top reflection */}
                       <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                       
                       {/* Pickup Code with glowing text */}
                       <h1 className="text-8xl md:text-9xl font-black font-display uppercase tracking-tighter mb-4" 
                           style={{ 
                              color: currentTheme.secondary, 
                              textShadow: `0 0 40px ${currentTheme.secondary}aa, 0 0 100px ${currentTheme.secondary}66` 
                           }}>
                         #{pickupCode}
                       </h1>
                       
                       {/* Label */}
                       <div className="flex items-center gap-6 mt-2 mb-8">
                         <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-white/40 rounded-full"></div>
                         <p className="text-sm md:text-lg font-bold uppercase tracking-[0.4em] text-white/90">Código de Retirada</p>
                         <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-white/40 rounded-full"></div>
                       </div>
                       
                       {/* Burger Animation Container */}
                       <div className="mt-8 flex items-center justify-center relative w-full h-40">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ff9d00]/10 rounded-full blur-2xl"></div>
                          <div className="w-40 h-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700 shadow-[inset_0_0_30px_rgba(255,255,255,0.05),_0_0_40px_rgba(255,157,0,0.15)]">
                             <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-full"></div>
                             
                             {/* Hamburger Build Animation */}
                             <div className="relative z-10 flex flex-col items-center justify-center -space-y-[2px] scale-150 pt-2">
                               {/* Top Bun */}
                               <motion.div animate={{ y: [-80, -80, 0, 0, 80, 80], opacity: [0, 0, 1, 1, 0, 0], scale: [0.9, 0.9, 1, 1, 0.9, 0.9] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.15, 0.25, 0.85, 0.95, 1], ease: "backOut" }} className="relative w-14 h-6 rounded-t-full bg-gradient-to-b from-[#F59E0B] to-[#D97706] shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-50 overflow-hidden border border-[#B45309]/50">
                                 <div className="absolute top-1.5 left-3 w-1 h-1.5 bg-white/80 rounded-full rotate-45"></div>
                                 <div className="absolute top-2.5 left-6 w-1 h-1.5 bg-white/80 rounded-full -rotate-12"></div>
                                 <div className="absolute top-1.5 right-4 w-1 h-1.5 bg-white/80 rounded-full rotate-12"></div>
                                 <div className="absolute top-3 right-8 w-1 h-1.5 bg-white/80 rounded-full rotate-45"></div>
                                 <div className="absolute top-3 left-9 w-1 h-1 bg-white/80 rounded-full rotate-45"></div>
                               </motion.div>
                               
                               {/* Tomato */}
                               <motion.div animate={{ y: [-80, -80, 0, 0, 80, 80], opacity: [0, 0, 1, 1, 0, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.12, 0.22, 0.85, 0.95, 1], ease: "backOut" }} className="w-14 h-2 rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-40 border border-red-800" />
                               
                               {/* Lettuce */}
                               <motion.div animate={{ y: [-80, -80, 0, 0, 80, 80], opacity: [0, 0, 1, 1, 0, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.09, 0.19, 0.85, 0.95, 1], ease: "backOut" }} className="relative w-16 h-2 rounded-full bg-gradient-to-b from-green-400 to-green-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-30 flex justify-between px-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full -mt-0.5"></div>
                                  <div className="w-2 h-2 bg-green-400 rounded-full -mt-0.5"></div>
                                  <div className="w-2 h-2 bg-green-600 rounded-full -mt-0.5"></div>
                               </motion.div>
                               
                               {/* Cheese */}
                               <motion.div animate={{ y: [-80, -80, 0, 0, 80, 80], opacity: [0, 0, 1, 1, 0, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.06, 0.16, 0.85, 0.95, 1], ease: "backOut" }} className="w-15 h-1.5 bg-gradient-to-b from-yellow-300 to-yellow-500 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-20 -rotate-2" style={{ width: '58px' }} />
                               
                               {/* Patty */}
                               <motion.div animate={{ y: [-80, -80, 0, 0, 80, 80], opacity: [0, 0, 1, 1, 0, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.03, 0.13, 0.85, 0.95, 1], ease: "backOut" }} className="w-15 h-3.5 rounded-lg bg-gradient-to-b from-[#5C3A21] to-[#3a2211] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5),_0_2px_4px_rgba(0,0,0,0.3)] z-10 border border-[#2d190b]" style={{ width: '60px' }} />
                               
                               {/* Bottom Bun */}
                               <motion.div animate={{ y: [-80, 0, 0, 80, 80], opacity: [0, 1, 1, 0, 0], scale: [0.9, 1, 1, 0.9, 0.9] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.85, 0.95, 1], ease: "backOut" }} className="w-14 h-4 rounded-b-xl bg-gradient-to-t from-[#D97706] to-[#F59E0B] shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-0 border border-[#B45309]/50" />
                             </div>
                          </div>
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          )}
        
        {/* Close Button */}
        <Button onClick={onClose} size="icon" variant="ghost" className="absolute top-6 right-6 bg-white shadow-md text-black hover:bg-gray-100 rounded-full z-[9999]">
           <X className="size-5" />
        </Button>
      </div>

      {/* Status Card (Bottom sheet style) */}
      <div className="bg-white border-t border-gray-200 p-6 sm:p-8 rounded-t-3xl -mt-6 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
         <div className="max-w-2xl mx-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
            
            {ratingState !== null ? (
               <div className="pb-4">
                  {ratingState === "driver" && (
                    <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-4">
                      <h3 className="text-2xl font-black font-display uppercase tracking-tight text-gray-900 mb-2">Avalie a Entrega</h3>
                      <p className="text-sm font-medium opacity-70 text-gray-600 mb-6">Como foi o atendimento do entregador {MOCK_DRIVERS[activeDriver].name}?</p>
                      
                      <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setDriverRating(star)} className="focus:outline-none transition-transform hover:scale-125 hover:rotate-6">
                            <Star className={`size-12 ${driverRating >= star ? 'fill-[#ff9d00] text-[#ff9d00]' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      
                      <Button 
                        disabled={driverRating === 0}
                        className="w-full text-lg font-bold h-14 rounded-xl text-white shadow-lg disabled:opacity-50 disabled:hover:scale-100 transition-transform hover:scale-105"
                        style={{ backgroundColor: currentTheme.secondary }}
                        onClick={() => setRatingState("food")}
                      >
                        Continuar
                      </Button>
                    </div>
                  )}

                  {ratingState === "food" && (
                    <div className="mt-4 text-center animate-in fade-in slide-in-from-right-4">
                      <h3 className="text-2xl font-black font-display uppercase tracking-tight text-gray-900 mb-2">Avalie o Sabor</h3>
                      <p className="text-sm font-medium opacity-70 text-gray-600 mb-6">Como estava o seu pedido da Fogo & Chapa?</p>
                      
                      <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setFoodRating(star)} className="focus:outline-none transition-transform hover:scale-125 hover:rotate-6">
                            <Star className={`size-12 ${foodRating >= star ? 'fill-[#ff9d00] text-[#ff9d00]' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      
                      <Button 
                        disabled={foodRating === 0}
                        className="w-full text-lg font-bold h-14 rounded-xl text-white shadow-lg disabled:opacity-50 disabled:hover:scale-100 transition-transform hover:scale-105"
                        style={{ backgroundColor: currentTheme.secondary }}
                        onClick={() => setRatingState("done")}
                      >
                        Enviar Avaliação
                      </Button>
                    </div>
                  )}

                  {ratingState === "done" && (
                    <div className="mt-4 text-center animate-in zoom-in duration-500">
                      <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Star className="size-10 fill-green-500 text-green-500" />
                      </div>
                      <h3 className="text-3xl font-black font-display uppercase tracking-tight text-gray-900 mb-3">Muito Obrigado!</h3>
                      <p className="text-base font-medium opacity-70 text-gray-600 mb-8 max-w-[250px] mx-auto">
                        Sua opinião é o nosso ingrediente secreto para melhorar sempre.
                      </p>
                      <Button 
                        className="w-full text-lg font-bold h-14 rounded-xl bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 transition-transform"
                        onClick={onClose}
                      >
                        Concluir e Fechar
                      </Button>
                    </div>
                  )}
               </div>
            ) : activeOrderType === "pickup" ? (
               <div className="text-center pb-4">
                  <h2 className="text-4xl font-black font-display uppercase tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                    {stage === "picking_up" ? "Preparando seu pedido..." : stage === "delivering" ? "Quase pronto!" : "Pronto para retirar!"}
                  </h2>
                  <p className="text-lg font-medium opacity-70 text-gray-600">
                    {stage === "picking_up" ? "Estamos preparando tudo com muito capricho." : stage === "delivering" ? "Falta pouco para você saborear." : "Seu pedido está aguardando no balcão."}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-12 mb-4 px-4 flex justify-between items-center relative">
                     {/* Background line */}
                     <div className="absolute top-1/2 left-4 right-4 h-2 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
                     
                     {/* Animated fill line */}
                     <div className="absolute top-1/2 left-4 h-2 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.2)]" 
                          style={{ 
                            width: stage === "picking_up" ? "0%" : stage === "delivering" ? "calc(50% - 16px)" : "calc(100% - 32px)", 
                            backgroundColor: currentTheme.secondary 
                          }}>
                     </div>
                     
                     {/* Step 1 */}
                     <div className={`size-14 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-xl ${stage === "picking_up" || stage === "delivering" || stage === "delivered" ? "scale-110" : "bg-gray-200 text-gray-400 shadow-none"}`} 
                          style={{ backgroundColor: currentTheme.secondary }}>
                        <ChefHat className="size-6" />
                     </div>
                     
                     {/* Step 2 */}
                     <div className={`size-14 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-xl ${stage === "delivering" || stage === "delivered" ? "scale-110" : "bg-gray-100 text-gray-400 shadow-none border-2 border-white"}`} 
                          style={{ backgroundColor: stage === "delivering" || stage === "delivered" ? currentTheme.secondary : undefined }}>
                        <ShoppingBag className="size-6" />
                     </div>
                     
                     {/* Step 3 */}
                     <div className={`size-14 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-xl ${stage === "delivered" ? "scale-110" : "bg-gray-100 text-gray-400 shadow-none border-2 border-white"}`} 
                          style={{ backgroundColor: stage === "delivered" ? currentTheme.secondary : undefined }}>
                        <Check className="size-6" />
                     </div>
                  </div>

                  {stage === "delivered" && (
                    <Button 
                       className="w-full mt-8 text-lg font-bold h-14 rounded-xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                       style={{ backgroundColor: currentTheme.secondary }}
                       onClick={() => setRatingState("food")}
                    >
                      Pedido Recebido
                    </Button>
                  )}
               </div>
            ) : (
               <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black font-display uppercase tracking-tight text-gray-900">
                        {stage === "delivered" ? "Pedido Entregue!" : stage === "picking_up" ? "Indo para a loja" : "A caminho do destino"}
                      </h2>
                      <p className="text-sm font-medium opacity-70 text-gray-600 mt-1">
                        {stage === "delivered" ? "Aproveite seu lanche quente e suculento!" : stage === "picking_up" ? "O entregador está a caminho da Fogo & Chapa" : "Previsão de entrega: 15-20 min"}
                      </p>
                    </div>
                    {stage !== "delivered" && (
                      <div className="text-right">
                         <div className="text-4xl font-black font-display tracking-tighter" style={{ color: currentTheme.secondary }}>
                           {stage === "picking_up" ? "3 min" : "18:45"}
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 text-gray-500">
                           {stage === "picking_up" ? "Distância" : "Chegada"}
                         </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-gray-100 shadow-sm">
                     <div className="size-14 sm:size-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2" style={{ borderColor: currentTheme.secondary }}>
                        <img src={MOCK_DRIVERS[activeDriver].avatar} alt="Entregador" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">{MOCK_DRIVERS[activeDriver].name}</h4>
                        <p className="text-xs sm:text-sm opacity-70 text-gray-600 flex items-center gap-1.5 mt-0.5">
                           <Bike className="size-3 sm:size-4" /> {MOCK_DRIVERS[activeDriver].vehicle} • {MOCK_DRIVERS[activeDriver].plate}
                        </p>
                     </div>
                     <div className="flex gap-2">
                        <Button size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-900 shrink-0 shadow-sm"><Mail className="size-5" /></Button>
                     </div>
                  </div>

                  {stage === "delivered" && (
                    <Button 
                       className="w-full mt-6 text-lg font-bold h-14 rounded-xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                       style={{ backgroundColor: currentTheme.secondary }}
                       onClick={() => setRatingState("driver")}
                    >
                      Pedido Recebido
                    </Button>
                  )}
               </>
            )}
         </div>
      </div>
    </motion.div>
  );
}
