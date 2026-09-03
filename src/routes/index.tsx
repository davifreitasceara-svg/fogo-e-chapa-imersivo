import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  Check,
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
import heroBurger from "@/assets/hero-burger.jpg";
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

  function addToCart(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setAddedId(id);
    window.setTimeout(() => setAddedId((current) => (current === id ? null : current)), 1100);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.14em] md:flex" aria-label="Navegação principal">
            <a className="nav-link" href="#inicio">Início</a>
            <a className="nav-link" href="#cardapio">Cardápio</a>
            <a className="nav-link" href="#sobre">Nossa brasa</a>
            <a className="nav-link" href="#contato">Contato</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button aria-label={`Sacola com ${cartCount} itens`} variant="ghost" size="icon" className="relative">
              <ShoppingBag className="size-5" />
              {cartCount > 0 && <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{cartCount}</span>}
            </Button>
            <Button className="hidden sm:inline-flex" variant="outline" size="sm" onClick={() => setAuthOpen(true)}><UserRound className="size-4" /> Entrar / Cadastrar</Button>
            <Button className="md:hidden" variant="ghost" size="icon" aria-label="Abrir menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background px-5 py-5 md:hidden" aria-label="Navegação mobile">
            {[["Início", "#inicio"], ["Cardápio", "#cardapio"], ["Nossa brasa", "#sobre"], ["Contato", "#contato"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-border py-3 text-sm font-semibold uppercase">{label}</a>)}
            <Button className="mt-5 w-full" variant="outline" onClick={() => { setMenuOpen(false); setAuthOpen(true); }}>Entrar / Cadastrar</Button>
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="relative flex min-h-[94svh] items-end overflow-hidden pt-18">
          <div className="absolute inset-0">
            <img src={heroBurger} alt="Hambúrguer artesanal Fogo e Chapa cercado por chamas" width={1536} height={1280} fetchPriority="high" className="hero-image h-full w-full object-cover object-[65%_center]" />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
          <div className="sparks absolute inset-0 overflow-hidden" aria-hidden="true">
            {sparks.map((spark, index) => <i key={index} style={{ left: spark.left, animationDelay: spark.delay, animationDuration: spark.duration }} />)}
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-end px-5 pb-16 pt-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-20">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.18em] text-gold"><Sparkles className="size-4" /> Artesanal. Intenso. Sem atalhos.</div>
              <h1 className="font-display text-[clamp(3.6rem,8vw,7.8rem)] font-black uppercase leading-[0.78] text-foreground">Carne.<br /><span className="text-primary">Fogo.</span><br />Técnica.</h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Smash burgers selados na chapa de ferro, ingredientes escolhidos a dedo e o sabor inconfundível da brasa.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild><a href="#cardapio">Ver cardápio <ChevronRight className="size-4" /></a></Button>
                <Button size="lg" variant="outline" asChild><a href="#sobre">Conheça a brasa</a></Button>
              </div>
              <div className="mt-9 flex items-center gap-5 text-xs uppercase tracking-[0.12em] text-muted-foreground"><span><strong className="block text-xl text-foreground">4.9</strong> avaliação</span><span className="h-8 w-px bg-border" /><span><strong className="block text-xl text-foreground">25 min</strong> tempo médio</span></div>
            </div>
          </div>
          <a href="#cardapio" aria-label="Ir para o cardápio" className="absolute bottom-5 right-5 z-10 hidden animate-bounce items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground sm:flex lg:right-8">Descubra <ArrowDown className="size-4" /></a>
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