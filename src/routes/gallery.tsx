import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Box } from "lucide-react";
import { ExplodingBurger } from "@/components/ExplodingBurger";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
});

function Gallery() {
  // Read search params via window.location (since useSearch might need precise types, fallback to URLSearchParams is easier if we don't know the exact route config type)
  const [burger, setBurger] = useState("inferno");
  const [interactiveMode, setInteractiveMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get("burger");
    if (b) setBurger(b);
  }, []);

  // Prevent scroll when in 3D interactive mode (the ExplodingBurger component takes over scrolling)
  useEffect(() => {
    if (interactiveMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [interactiveMode]);

  const renderInteractiveMode = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto"
      >
        <button
          onClick={() => setInteractiveMode(false)}
          className="fixed top-8 left-8 md:top-12 md:left-12 z-[100] bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-3 backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
        >
          <ArrowLeft size={20} />
          <span className="font-bold tracking-widest uppercase text-sm">Sair do 3D</span>
        </button>

        {burger === "inferno" && (
          <ExplodingBurger
            frameCount={240}
            framePrefix="/video1_frames/frame_"
            burgerName1="Inferno"
            burgerName2="Burger"
            ingredient1="Pão Brioche"
            ingredientDesc1="Selado na manteiga para não desmanchar."
            ingredient2="Queijo Cheddar"
            ingredientDesc2="Derretido no ponto exato, abraçando a carne."
            ingredient3="Blend Fogo & Chapa"
            ingredientDesc3="Três carnes de 180g de pura suculência."
            ingredient4="Salada Fresca"
            ingredientDesc4="Alface crocante e tomate fresquinho."
            bgClass="bg-zinc-950"
            titleColorClass="text-red-500"
          />
        )}
        {burger === "classico" && (
          <ExplodingBurger
            frameCount={300}
            framePrefix="/xburguer_frames/frame_"
            burgerName1="X-Burguer"
            burgerName2="Clássico"
            ingredient1="Pão com Gergelim"
            ingredientDesc1="Pão tradicional, macio e levemente tostado."
            ingredient2="Queijo Prato"
            ingredientDesc2="O clássico queijo derretido perfeito."
            ingredient3="Blend 180g"
            ingredientDesc3="Carne suculenta com tempero secreto."
            ingredient4="Molho Especial"
            ingredientDesc4="O toque final inesquecível."
            bgClass="bg-zinc-950"
            titleColorClass="text-green-500"
          />
        )}
        {burger === "brasa" && (
          <ExplodingBurger
            frameCount={300}
            framePrefix="/davi_vs_golias_frames/frame_"
            burgerName1="Davi vs Golias"
            burgerName2=""
            ingredient1="Pão Australiano"
            ingredientDesc1="Adocicado e macio, contrastando com o salgado."
            ingredient2="Cheddar Duplo"
            ingredientDesc2="Para quem acha que queijo nunca é demais."
            ingredient3="Duplo Blend"
            ingredientDesc3="Duas carnes monstruosas para matar a fome."
            ingredient4="Bacon Crocante"
            ingredientDesc4="Fatias grossas de bacon artesanal."
            bgClass="bg-zinc-950"
            titleColorClass="text-purple-500"
          />
        )}
      </motion.div>
    );
  };

  const getBurgerInfo = () => {
    switch (burger) {
      case "inferno":
        return {
          title: "Inferno",
          subtitle: "Burger",
          color: "text-red-500",
          pao: "Pão Brioche",
          queijo: "Queijo Cheddar",
          carne: "Blend Fogo & Chapa",
          extra: "Salada Fresca",
          frame: "/video1_frames/frame_0001.jpg",
        };
      case "classico":
        return {
          title: "X-Burguer",
          subtitle: "Clássico",
          color: "text-green-500",
          pao: "Pão com Gergelim",
          queijo: "Queijo Prato",
          carne: "Blend 180g",
          extra: "Molho Especial",
          frame: "/xburguer_frames/frame_0001.jpg",
        };
      case "brasa":
        return {
          title: "Davi vs",
          subtitle: "Golias",
          color: "text-purple-500",
          pao: "Pão Australiano",
          queijo: "Cheddar Duplo",
          carne: "Duplo Blend",
          extra: "Bacon Crocante",
          frame: "/davi_vs_golias_frames/frame_0001.jpg",
        };
      default:
        return null;
    }
  };

  const info = getBurgerInfo();

  return (
    <div className="min-h-screen bg-zinc-950 font-sans w-full relative overflow-x-hidden">
      <AnimatePresence>{interactiveMode && renderInteractiveMode()}</AnimatePresence>

      <div className="fixed top-8 left-8 z-40">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm font-bold"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
      </div>

      {info ? (
        <div className="flex flex-col lg:flex-row min-h-screen w-full items-center justify-center bg-zinc-950 p-8 pt-24 lg:pt-8 gap-12">
          {/* Lado Esquerdo: Hambúrguer Inicial */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => setInteractiveMode(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <img
                src={info.frame}
                alt="Burger"
                className="w-[80%] max-w-md mx-auto object-contain drop-shadow-2xl mix-blend-screen"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full blur-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-orange-500 text-white font-black px-6 py-3 rounded-full flex items-center gap-3 uppercase tracking-widest shadow-2xl">
                  <Box size={24} />
                  Ver em 3D
                </div>
              </div>
            </div>
            <p className="mt-8 text-gray-400 font-medium tracking-widest uppercase text-sm animate-pulse">
              Clique para interação 3D
            </p>
          </motion.div>

          {/* Lado Direito: Galeria / Conteúdo das Partes */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center text-left text-white max-w-2xl mt-12 lg:mt-0">
            <h1
              className={`text-4xl md:text-6xl font-black uppercase tracking-tight ${info.color} mb-12`}
            >
              {info.title} <span className="text-white">{info.subtitle}</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 relative overflow-hidden">
                <img
                  src="/parts/pao.jpg"
                  alt={info.pao}
                  className={`w-24 h-24 object-cover rounded-full shadow-lg mb-4 border-2 border-zinc-800 ${burger === "brasa" ? "grayscale-[30%] brightness-75" : ""}`}
                />
                <span className="text-xl font-black text-zinc-600 mb-1">01</span>
                <h3 className={`text-lg font-black uppercase ${info.color}`}>{info.pao}</h3>
              </div>

              <div className="flex flex-col bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <img
                  src="/parts/queijo.jpg"
                  alt={info.queijo}
                  className="w-24 h-24 object-cover rounded-full shadow-lg mb-4 border-2 border-zinc-800"
                />
                <span className="text-xl font-black text-zinc-600 mb-1">02</span>
                <h3 className={`text-lg font-black uppercase ${info.color}`}>{info.queijo}</h3>
              </div>

              <div className="flex flex-col bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <img
                  src="/parts/carne.jpg"
                  alt={info.carne}
                  className="w-24 h-24 object-cover rounded-full shadow-lg mb-4 border-2 border-zinc-800"
                />
                <span className="text-xl font-black text-zinc-600 mb-1">03</span>
                <h3 className={`text-lg font-black uppercase ${info.color}`}>{info.carne}</h3>
              </div>

              <div className="flex flex-col bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="w-24 h-24 rounded-full shadow-lg mb-4 border-2 border-zinc-800 bg-zinc-800 flex items-center justify-center text-3xl">
                  {burger === "inferno" ? "🥗" : burger === "classico" ? "🥣" : "🥓"}
                </div>
                <span className="text-xl font-black text-zinc-600 mb-1">04</span>
                <h3 className={`text-lg font-black uppercase ${info.color}`}>{info.extra}</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center">
          <h1 className="text-2xl md:text-5xl font-black text-white/50 uppercase tracking-[0.2em] text-center px-4">
            Em breve...
          </h1>
        </div>
      )}
    </div>
  );
}
