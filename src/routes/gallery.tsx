import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Burger3D } from "@/components/Burger3D";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
});

function Gallery() {
  const [burger, setBurger] = useState("inferno");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get("burger");
    if (b) setBurger(b);
  }, []);

  const getBurgerInfo = () => {
    switch (burger) {
      case "classico":
        return {
          title: "X-Burguer", subtitle: "Clássico", color: "text-green-500", desc: "Pão com Gergelim • Queijo Prato • Blend 180g • Molho Especial"
        };
      case "brasa":
        return {
          title: "Davi vs", subtitle: "Golias", color: "text-purple-500", desc: "Pão Australiano • Cheddar Duplo • Duplo Blend • Bacon"
        };
      case "inferno":
      default:
        return {
          title: "Inferno", subtitle: "Burger", color: "text-red-500", desc: "Pão Brioche • Queijo Cheddar • Blend Fogo & Chapa • Salada"
        };
    }
  };

  const info = getBurgerInfo();

  return (
    <div className="min-h-screen bg-zinc-950 font-sans w-full relative overflow-hidden flex flex-col items-center justify-center">
      <div className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors uppercase tracking-[0.18em] text-xs sm:text-sm font-bold bg-zinc-900/80 px-3.5 py-2 sm:p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen w-full items-center justify-center bg-zinc-950 px-4 sm:px-8 py-16 sm:py-20 lg:py-8 gap-8 lg:gap-12 max-w-7xl mx-auto">
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center relative h-[42vh] xs:h-[48vh] sm:h-[55vh] lg:h-[75vh] z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
          
          {/* THE REAL 3D BURGER */}
          <Burger3D />
          
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-white/40 uppercase tracking-[0.25em] text-[10px] font-bold z-20 pointer-events-none animate-pulse text-center w-full px-4">
            Toque e arraste para girar 360º livremente
          </div>
        </div>

        <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start justify-center text-center lg:text-left text-white mt-4 sm:mt-8 lg:mt-0 z-20 relative">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <span className="h-px w-6 sm:w-8 bg-orange-500"></span>
            <span className="text-orange-500/80 uppercase tracking-widest text-[11px] sm:text-xs font-black">Experiência 3D Real</span>
          </div>

          <h1 className={`text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter ${info.color} mb-4 sm:mb-6 leading-none`}>
            {info.title} <br />
            <span className="text-white text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">{info.subtitle}</span>
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base lg:text-xl font-medium tracking-wide leading-relaxed max-w-md">
            {info.desc}
          </p>

          <div className="mt-12 p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl max-w-sm w-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-zinc-100 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Totalmente em 3D
              </h3>
              <p className="text-zinc-500 text-sm">
                Construído com tecnologia WebGL. Arraste para inspecionar os detalhes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
