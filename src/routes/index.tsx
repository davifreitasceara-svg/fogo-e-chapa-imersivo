import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fogo e Chapa — Hamburgueria Premium na Brasa" },
      {
        name: "description",
        content:
          "Hambúrgueres artesanais grelhados na brasa, cervejas e drinks autorais. Conheça o cardápio do Fogo e Chapa e peça agora.",
      },
      { property: "og:title", content: "Fogo e Chapa — Hamburgueria Premium na Brasa" },
      {
        property: "og:description",
        content:
          "Carne maturada, chapa a 300°C e brasa de verdade. Cardápio interativo de hambúrgueres e bebidas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [cart, setCart] = useState(0);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <main>
        <Hero />
        <MenuSection onAdd={() => setCart((c) => c + 1)} />
        <About />
      </main>
      <Footer />

      <AnimatePresence>
        {cart > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed right-5 bottom-5 z-50 flex items-center gap-3 rounded-full bg-fire px-5 py-3.5 text-sm font-bold text-primary-foreground uppercase shadow-[var(--shadow-fire)]"
          >
            <ShoppingBag className="size-4" />
            {cart} {cart === 1 ? "item" : "itens"}
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Toaster position="top-center" />
    </div>
  );
}
