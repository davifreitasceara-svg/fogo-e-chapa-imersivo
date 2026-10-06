import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ExplodingBurger } from "@/components/ExplodingBurger";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute('/gallery')({
  component: GalleryRoute,
});

function GalleryRoute() {
  const [burger, setBurger] = useState('inferno');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get('burger');
    if (b) setBurger(b);
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/" className="flex items-center justify-center bg-white text-black w-12 h-12 rounded-full hover:bg-gray-200 transition-colors shadow-lg">
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>
      {burger === 'inferno' ? (
        <div className="bg-white">
          <ExplodingBurger />
        </div>
      ) : burger === 'classico' ? (
        <div className="bg-white">
          <ExplodingBurger 
            frameCount={300} 
            framePrefix="/xburguer_frames/frame_" 
            frameOffset={1}
            bgClass="bg-white"
            canvasClass="mix-blend-multiply brightness-[1.04] contrast-[1.02]"
            burgerName1="X"
            burgerName2="Burguer"
          />
        </div>
      ) : burger === 'brasa' ? (
        <div className="bg-white">
          <ExplodingBurger 
            frameCount={300} 
            framePrefix="/davi_vs_golias_frames/frame_" 
            frameOffset={1}
            bgClass="bg-white"
            canvasClass="mix-blend-multiply brightness-[1.04] contrast-[1.02]"
            burgerName1="Davi"
            burgerName2="vs Golias"
          />
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center">
          <h1 className="text-2xl md:text-5xl font-black text-white/50 uppercase tracking-[0.2em] text-center px-4">
            Vídeo a caminho...
          </h1>
        </div>
      )}
    </div>
  );
}
