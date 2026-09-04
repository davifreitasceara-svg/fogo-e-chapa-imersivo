import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import heroPizza from "@/assets/hero-pizza.jpg";
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
    <div className="min-h-screen overflow-x-hidden bg-brown-brand text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 bg-brown-brand">
        <div className="bg-orange-brand py-1.5 text-[11px] sm:text-xs font-semibold text-brown-brand flex items-center justify-center gap-4 sm:gap-6 w-full text-center px-4">
          <span>18 Urban Lane, Chicago</span>
          <span className="hidden sm:inline">🍕 Open Daily - 10AM to 11PM</span>
          <span className="hidden sm:inline">🍔 Pickup & Delivery Available</span>
        </div>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🍔</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-tighter text-white">HOTBITE</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 bg-brown-light px-8 py-3 rounded-full text-sm font-semibold text-white/90">
             <a href="#about" className="hover:text-orange-brand transition-colors">About</a>
             <a href="#menu" className="hover:text-orange-brand transition-colors">Menu</a>
             <a href="#gallery" className="hover:text-orange-brand transition-colors">Gallery</a>
             <a href="#delivery" className="hover:text-orange-brand transition-colors">Delivery</a>
          </nav>

          <Button className="rounded-full bg-orange-brand text-brown-brand hover:bg-orange-brand/90 font-bold px-6">
             Contact Us
          </Button>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative flex min-h-[94svh] items-center justify-center overflow-hidden bg-brown-brand pt-24">
           {/* Center Text */}
           <div className="relative z-10 text-center w-full flex flex-col items-center justify-center h-full">
             <h1 className="font-display text-[22vw] leading-[0.8] font-black uppercase text-orange-brand text-3d tracking-tighter mt-12 sm:mt-0">
               WRAPPED
               <br/>
               IN FLAVOR
             </h1>
             
             {/* Center Pizza Image */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[85vw] sm:w-[65vw] max-w-[800px] pointer-events-none drop-shadow-2xl z-20">
                <img src={heroPizza} alt="Delicious Pizza" className="w-full h-auto object-contain rounded-full shadow-2xl" />
             </div>

             {/* Floating Elements (Badges and Emojis) */}
             <div className="hidden sm:block absolute top-[25%] left-[25%] -rotate-12 bg-brown-light border border-orange-brand text-orange-brand px-4 py-1.5 rounded-full font-bold text-sm z-30 shadow-lg">Stretchy</div>
             <div className="hidden sm:block absolute top-[35%] left-[20%] -rotate-6 bg-brown-light border border-orange-brand text-orange-brand px-4 py-1.5 rounded-full font-bold text-sm z-30 shadow-lg">Cheesy</div>
             <div className="hidden sm:block absolute top-[50%] left-[23%] rotate-6 bg-brown-light border border-orange-brand text-orange-brand px-4 py-1.5 rounded-full font-bold text-sm z-30 shadow-lg">Crispy</div>

             <div className="hidden sm:block absolute top-[60%] right-[32%] text-4xl z-30 drop-shadow-lg">😋</div>
             <div className="hidden sm:flex absolute top-[75%] right-[25%] bg-brown-light rounded-full p-4 border border-orange-brand z-30 shadow-xl items-center justify-center size-20">
                <span className="text-4xl">🔥</span>
             </div>
             
             {/* Carousel arrows */}
             <div className="hidden sm:block absolute top-1/2 left-8 -translate-y-1/2 z-30">
                <Button size="icon" variant="outline" className="bg-white text-brown-brand hover:bg-white/90 rounded-xl size-12 shadow-xl border-0"><ChevronLeft className="size-6" /></Button>
             </div>
             <div className="hidden sm:block absolute top-1/2 right-8 -translate-y-1/2 z-30">
                <Button size="icon" variant="outline" className="bg-white text-brown-brand hover:bg-white/90 rounded-xl size-12 shadow-xl border-0"><ChevronRight className="size-6" /></Button>
             </div>

             <p className="mt-16 sm:mt-24 text-white/90 text-lg md:text-2xl font-medium tracking-wide z-30 relative px-4 text-center">
               Crispy, juicy street food made the right way.
             </p>
           </div>
        </section>

        <section id="cardapio" className="relative border-t border-border bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div><p className="eyebrow">Direto da chapa</p><h2 className="section-title">Escolha seu <span>fogo</span></h2></div>
              <div className="flex w-fit rounded-sm border border-border bg-background p-1" role="tablist" aria-label="Categorias do cardápio">
                <Button role="tab" aria-selected={tab === "burger"} variant={tab === "burger" ? "fire" : "ghost"} onClick={() => setTab("burger")}><Flame className="size-4" /> Hambúrgueres</Button>
                <Button role="tab" aria-selected={tab === "drink"} variant={tab === "drink" ? "fire" : "ghost"} onClick={() => setTab("drink")}>Bebidas</Button>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="product-card group overflow-hidden border border-border bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={product.image} alt={product.name} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-card-overlay" />
                    {product.badge && <span className="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">{product.badge}</span>}
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3"><h3 className="font-display text-2xl font-black uppercase">{product.name}</h3><span className="shrink-0 text-lg font-bold text-gold">R$ {product.price.toFixed(2).replace(".", ",")}</span></div>
                    <p className="mt-3 min-h-15 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                    <Button className="mt-5 w-full" variant={addedId === product.id ? "outline" : "fire"} onClick={() => addToCart(product.id)}>{addedId === product.id ? <><Check className="size-4" /> Adicionado</> : <><Plus className="size-4" /> Adicionar ao carrinho</>}</Button>
                  </div>
                </article>
              ))}
            </div>
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