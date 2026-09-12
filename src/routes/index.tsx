import { CartCheckoutSheet } from "../components/CartCheckoutSheet";
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
  ArrowUpRight,
  PlaySquare,
  Layers,
  TrendingUp
} from "lucide-react";

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
