import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Flame,
  ShieldCheck,
  FileText,
  RotateCcw,
  MapPin,
  Clock3,
  Mail,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedBackgroundVideo } from "@/components/OptimizedBackgroundVideo";

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  activeTab: "privacidade" | "termos" | "reembolso";
  children: React.ReactNode;
}

export function PolicyLayout({
  title,
  subtitle,
  badge,
  activeTab,
  children,
}: PolicyLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const navigate = useNavigate();

  const tabs = [
    {
      id: "privacidade",
      label: "Privacidade",
      href: "/privacidade",
      icon: ShieldCheck,
    },
    {
      id: "termos",
      label: "Termos de Uso",
      href: "/termos",
      icon: FileText,
    },
    {
      id: "reembolso",
      label: "Reembolso",
      href: "/reembolso",
      icon: RotateCcw,
    },
  ];

  const navLinks = [
    { href: "/#menu", label: "Cardápio" },
    { href: "/#gallery", label: "Galeria 3D" },
    { href: "/drinks", label: "Bebidas" },
    { href: "/#contato", label: "Onde Estamos" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Background Video with Fiery Ambient Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <OptimizedBackgroundVideo
          src="/quero_mais_chamas.mp4"
          active={true}
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        {/* Deep cinematic gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black pointer-events-none" />

        {/* Ambient Fire Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-b from-orange-600/25 via-red-600/15 to-transparent blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-red-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-amber-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Official Navbar */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-colors duration-700">
        <div className="mx-auto flex h-16 sm:h-20 lg:h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="/"
              className="font-display text-lg sm:text-2xl font-black tracking-tighter text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
            >
              <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <Flame className="size-4 sm:size-5 text-white" strokeWidth={2.5} />
              </div>
              <span>FOGO E CHAPA</span>
            </a>
          </motion.div>

          {/* Center: Floating Navigation Pill */}
          <motion.nav
            className="hidden md:flex items-center gap-1 text-sm font-bold text-white bg-white/10 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10 shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 lg:px-5 py-2 rounded-full z-10 transition-colors cursor-pointer text-xs uppercase tracking-wider font-display font-bold hover:text-white"
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
              </a>
            ))}
          </motion.nav>

          {/* Right: Quick Action Buttons */}
          <motion.div
            className="flex items-center gap-2.5 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black font-display font-black uppercase tracking-wider px-4 sm:px-6 py-2 text-xs sm:text-sm hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <ArrowLeft className="size-3.5 sm:size-4" />
              <span>Voltar ao Cardápio</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsNavOpen((prev) => !prev)}
              className="flex md:hidden items-center justify-center size-9 sm:size-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer active:scale-95"
              aria-label={isNavOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/15 px-5 py-4 flex flex-col gap-2.5 shadow-2xl"
            >
              <a
                href="/#inicio"
                onClick={() => setIsNavOpen(false)}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Início
              </a>
              <a
                href="/#menu"
                onClick={() => setIsNavOpen(false)}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Cardápio
              </a>
              <a
                href="/#gallery"
                onClick={() => setIsNavOpen(false)}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Galeria 3D
              </a>
              <a
                href="/drinks"
                onClick={() => setIsNavOpen(false)}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Bebidas Exclusivas</span>
                <span className="text-[10px] bg-amber-500/25 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">Lata 3D</span>
              </a>
              <a
                href="/#contato"
                onClick={() => setIsNavOpen(false)}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Onde Estamos / Local
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-16 md:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Flame Pill Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border border-orange-500/40 text-orange-400 font-display font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(249,115,22,0.3)] mb-5"
          >
            <Flame className="size-3.5 text-orange-400 animate-pulse" />
            <span>{badge}</span>
          </motion.div>

          {/* Impactful Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-white mb-4 drop-shadow-[0_4px_35px_rgba(255,100,0,0.4)]"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 font-sans text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 text-xs font-mono text-orange-300/80 mt-4 px-3.5 py-1 rounded-full bg-white/5 border border-white/10"
          >
            <Clock3 className="size-3.5 text-orange-400" />
            <span>Última atualização: 23 de Outubro de 2026 • Fortaleza, CE</span>
          </motion.div>

          {/* Policy Navigation Tabs - Floating Pill System */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 p-1.5 rounded-full bg-black/70 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.href}
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.55)] scale-[1.02]"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-10 leading-relaxed text-sm sm:text-base text-zinc-300">
          {children}
        </div>

        {/* Local Support Card - Fortaleza Gastronomic Point */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-b from-zinc-900/90 to-black/95 p-6 sm:p-10 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />
          <div className="absolute -top-10 -right-10 w-52 h-52 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Flame className="size-5" />
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wide text-white">
              Atendimento Fogo & Chapa Fortaleza
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
            Dúvidas sobre o cardápio, entrega de hambúrgueres na brasa ou esclarecimento sobre nossas diretrizes legais? Nossa equipe cearense está disponível para atendimento rápido e personalizado.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-white/10 pt-6">
            <div className="flex gap-3 items-start">
              <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm uppercase tracking-wide">Ponto de Brasa</p>
                <p className="text-zinc-400 text-xs mt-1 leading-snug">
                  Av. Beira Mar, 3120<br />
                  Meireles, Fortaleza - CE
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25">
                <Clock3 className="size-5" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm uppercase tracking-wide">Horário Aberto</p>
                <p className="text-zinc-400 text-xs mt-1 leading-snug">
                  Terça a Domingo<br />
                  18:00 às 23:30
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm uppercase tracking-wide">Contato Direto</p>
                <p className="text-zinc-400 text-xs mt-1 leading-snug">
                  contato@fogoechapa.com.br<br />
                  Retorno prioritário
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Consistent Footer */}
      <footer className="relative z-10 w-full pt-12 sm:pt-16 pb-8 border-t border-white/15 bg-black/90 backdrop-blur-2xl text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex flex-col gap-8 lg:gap-10">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 pb-6 border-b border-white/10">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-display font-black text-sm sm:text-base md:text-lg">
              <a href="/#menu" className="hover:text-orange-400 transition-colors">
                MENU
              </a>
              <a href="/#gallery" className="hover:text-orange-400 transition-colors">
                GALERIA
              </a>
              <a href="/drinks" className="hover:text-orange-400 transition-colors">
                BEBIDAS
              </a>
              <a href="/#contato" className="hover:text-orange-400 transition-colors">
                LOCAL
              </a>
            </div>

            <div className="text-2xl sm:text-3xl font-black font-display tracking-tighter uppercase flex items-center gap-2">
              <Flame className="size-6 text-orange-500" />
              <span>FOGO E CHAPA</span>
            </div>

            <Link
              to="/"
              className="font-display font-bold uppercase tracking-wider rounded-full border-2 border-orange-500 text-white hover:bg-orange-500 px-6 py-2 text-xs sm:text-sm transition-all"
            >
              PEDIR AGORA
            </Link>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-3 font-bold text-xs sm:text-sm uppercase relative z-10">
              <a href="/#menu" className="block hover:text-white/70 transition-colors">
                MENU
              </a>
              <a href="/#gallery" className="block hover:text-white/70 transition-colors">
                GALERIA 3D
              </a>
              <a href="/drinks" className="block hover:text-white/70 transition-colors">
                BEBIDAS NA LATA
              </a>
              <a href="/#contato" className="block hover:text-white/70 transition-colors">
                ONDE ESTAMOS
              </a>
            </div>

            <div className="space-y-3 font-bold text-xs sm:text-sm uppercase relative z-10">
              <Link to="/privacidade" className="block hover:text-orange-400 transition-colors">
                POLÍTICA DE PRIVACIDADE
              </Link>
              <Link to="/termos" className="block hover:text-orange-400 transition-colors">
                TERMOS DE SERVIÇO
              </Link>
              <Link to="/reembolso" className="block hover:text-orange-400 transition-colors">
                POLÍTICA DE REEMBOLSO
              </Link>
            </div>

            <div className="space-y-4 flex flex-col justify-start relative z-10">
              <div className="flex gap-3">
                <div className="size-10 rounded-full flex items-center justify-center shrink-0 text-white bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                  <MapPin className="size-5" />
                </div>
                <div className="text-sm font-bold">
                  Av. Beira Mar, 3120
                  <br />
                  <span className="text-xs font-normal opacity-70">
                    Meireles, Fortaleza - CE, 60165-121
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="size-10 rounded-full flex items-center justify-center shrink-0 text-white bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                  <Clock3 className="size-5" />
                </div>
                <div className="text-sm font-bold">
                  Horário de Funcionamento
                  <br />
                  <span className="text-xs font-normal opacity-70">
                    Terça a Domingo: 18h às 23h30
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Fogo e Chapa. Todos os direitos reservados.</p>
            <p>Hamburgueria artesanal na brasa • Feito em Fortaleza/CE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
