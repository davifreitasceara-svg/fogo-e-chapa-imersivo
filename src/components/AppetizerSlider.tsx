import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
const appetizers = [
  {
    id: 101,
    title1: 'BATATA',
    title2: 'FRITA',
    name: 'Batatas Fritas',
    desc: 'Crocante por fora, macia por dentro. Nossa batata rústica clássica, temperada com páprica e sal grosso.',
    price: 'R$ 24,90',
    tags: ['Crocante', 'Vegetariano'],
    image: '/fries_appetizer_transparente.png',
    bgColor: '#ECA02A', // Vibrant Mustard Yellow
    textColor: '#ffffff',
  },
  {
    id: 102,
    title1: 'ASINHA',
    title2: 'DE FRANGO',
    name: 'Coxas de Frango',
    desc: 'Asinhas empanadas super crocantes, marinadas no buttermilk com nosso dry rub especial da casa.',
    price: 'R$ 32,90',
    tags: ['Apimentado', 'Mais Pedido'],
    image: '/frango_transparente.png',
    bgColor: '#C6311E', // Deep Fiery Red
    textColor: '#ffffff',
  },
  {
    id: 103,
    title1: 'ANÉIS',
    title2: 'DE CEBOLA',
    name: 'Onion Rings',
    desc: 'Anéis de cebola gigantes empanados em massa de cerveja preta. Acompanha molho barbecue artesanal.',
    price: 'R$ 28,90',
    tags: ['Crocante', 'Feito na Hora'],
    image: '/onion_rings_appetizer_transparente.png',
    bgColor: '#C86218', // Warm Golden Orange
    textColor: '#ffffff',
  },
  {
    id: 104,
    title1: 'PALITOS',
    title2: 'DE QUEIJO',
    name: 'Queijo Crocante',
    desc: 'Sticks de mozzarella derretendo por dentro, empanados e fritos. Servidos com geleia de pimenta.',
    price: 'R$ 34,90',
    tags: ['Derretido', 'Agridoce'],
    image: '/cheese_sticks_appetizer_transparente.png',
    bgColor: '#D75B29', // Rich Cheddar Orange
    textColor: '#ffffff',
  },
];


export function AppetizerSlider({ onAddToCart, currentTheme }: { onAddToCart?: (id: number) => void, currentTheme?: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const slideLeft = () => {
    // To move items LEFT (down-left), currentIndex must INCREASE.
    setCurrentIndex((prev) => (prev === appetizers.length - 1 ? 0 : prev + 1));
  };

  const slideRight = () => {
    // To move items RIGHT (up-right), currentIndex must DECREASE.
    setCurrentIndex((prev) => (prev === 0 ? appetizers.length - 1 : prev - 1));
  };

  const currentApp = appetizers[currentIndex]!;

  return (
    <section className="relative w-full min-h-[750px] sm:min-h-[800px] max-h-[900px] overflow-hidden flex items-center">
      {/* Base Animated Background Color */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ backgroundColor: currentTheme?.secondary || currentApp.bgColor }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Animated Light Blobs for Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 80, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, -60, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-black/30 rounded-full blur-[120px]"
        />
      </div>

      {/* Premium Dotted Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-70"></div>

      {/* Giant Watermark Text Background */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-[0.05] will-change-transform">
        <motion.div
          key={currentApp.title1}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display font-black text-white text-[32vw] leading-none whitespace-nowrap tracking-tighter"
        >
          {currentApp.title1}
        </motion.div>
      </div>

      {/* Radial Gradient Vignette Overlay for Focus */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.5)_130%)]"></div>

      {/* Top Navbar */}
      <div className="absolute top-8 w-full px-8 sm:px-16 flex justify-end items-center z-50 max-w-[1400px] left-1/2 -translate-x-1/2">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <Search className="text-white size-4" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <ShoppingBag className="text-white size-4" />
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-[1400px] mx-auto min-h-full flex flex-col md:flex-row items-center pt-20 sm:pt-24 pb-32 sm:pb-48">
        
        <div className="w-full md:w-5/12 px-8 sm:px-16 flex flex-col justify-center min-h-full z-30 mt-6 md:mt-0">
          <motion.div
            key={currentApp.title1}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col mb-4 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 sm:mb-6 w-fit shadow-xl">
               <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></span>
               <span className="font-display font-bold text-xs tracking-[0.2em] text-white uppercase">Menu de Entradas</span>
            </div>
            
            <div className="flex flex-col relative z-10">
               <span 
                 className="font-display text-6xl sm:text-[90px] leading-[0.85] font-black tracking-tighter text-transparent italic"
                 style={{ WebkitTextStroke: "2px rgba(255,255,255,0.9)" }}
               >
                 {currentApp.title1}
               </span>
               <span className="font-display text-6xl sm:text-[90px] leading-[0.85] font-black tracking-tighter text-white drop-shadow-2xl italic mt-1">
                 {currentApp.title2}
               </span>
            </div>

            <div className="mt-6 sm:mt-8 max-w-sm relative z-10">
               <div className="flex flex-wrap gap-2 mb-6">
                 {currentApp.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md bg-black/20 shadow-lg flex items-center justify-center">
                      {tag}
                    </span>
                 ))}
               </div>
               
               <p className="text-white text-sm sm:text-base font-medium leading-relaxed mb-8 drop-shadow-md opacity-90 border-l-2 border-white/30 pl-4">
                 {currentApp.desc}
               </p>
               
               <div className="mb-8">
                 <div className="inline-block bg-white text-black px-6 py-2 rounded-2xl font-display font-black text-3xl sm:text-4xl shadow-2xl transform -rotate-2 border-b-4 border-black/20">
                   {currentApp.price}
                 </div>
               </div>
               
               <div className="flex gap-4">
                  <button 
                    onClick={() => onAddToCart && onAddToCart(currentApp.id)}
                    className="group bg-[#2B1B15] text-white px-8 py-4 rounded-full font-bold text-sm w-fit hover:bg-white hover:text-black transition-all hover:-translate-y-1 shadow-2xl flex items-center gap-3 border border-transparent"
                  >
                    <ShoppingBag className="size-4 group-hover:scale-110 transition-transform" />
                    <span className="tracking-wide">PEDIR AGORA</span>
                  </button>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-7/12 relative h-[400px] sm:h-[600px] flex items-center justify-center perspective-[1200px]">
          
          {appetizers.map((app, index) => {
            let offset = index - currentIndex;
            if (offset < -2) offset += appetizers.length;
            if (offset > 2) offset -= appetizers.length;

            const isVisible = offset >= -1 && offset <= 2;
            if (!isVisible) return null;

            // Positioning logic exactly like the video: Diagonal from top-right to bottom-left
            let x = 0;
            let y = 0;
            let scale = 1;
            let zIndex = 20;
            let rotate = 0;
            let blur = 0;

            if (offset === 0) {
              x = 0;
              y = 0;
              scale = 1.35;
              zIndex = 30;
              rotate = 0;
              blur = 0;
            } else if (offset === 1) {
              x = 160;
              y = -60;
              scale = 0.8;
              zIndex = 20;
              rotate = 10;
              blur = 4;
            } else if (offset === 2) {
              x = 300;
              y = -120;
              scale = 0.6;
              zIndex = 10;
              rotate = 20;
              blur = 8;
            } else if (offset === -1) {
              x = -160;
              y = 70;
              scale = 0.8;
              zIndex = 15;
              rotate = -15;
              blur = 6;
            }

            // Adjust for mobile screens safely using the useIsMobile hook
            if (isMobile) {
              x = x * 0.5; 
              y = y * 0.5;
            }

            const isActive = offset === 0;

            return (
              <motion.div
                key={app.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                initial={false}
                animate={{
                  x: `calc(-50% + ${x}px)`,
                  y: `calc(-55% + ${y}px)`,
                  scale,
                  rotate,
                  zIndex,
                  filter: `blur(${blur}px)`,
                  opacity: offset === 2 ? 0.3 : (offset === -1 ? 0 : 1) // Fades out strongly on the left
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.32, 0.72, 0, 1] // Custom snappy spring-like easing
                }}
                onClick={() => {
                  if (offset === 1) slideLeft();
                  if (offset === -1) slideRight();
                }}
                style={{ width: "360px" }}
              >
                {isActive && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/20 rounded-full blur-[60px] -z-10" />
                )}
                <motion.div
                  className="w-full h-full"
                  animate={offset === 0 ? { y: [0, -15, 0] } : { y: 0 }}
                  transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <img 
                    src={app.image} 
                    alt={app.name} 
                    className="w-full object-contain drop-shadow-2xl mix-blend-multiply" 
                  />
                </motion.div>
              </motion.div>
            );
          })}

        </div>
      </div>

      {/* Footer / Wave Area */}
      <div className="absolute bottom-0 left-0 w-full z-40">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[100px] sm:h-[150px] block mb-[-2px] transition-colors duration-700" style={{ color: currentTheme?.secondary || '#FDF8F2' }}>
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <div className="w-full h-[100px] flex items-center justify-between px-8 sm:px-16 pb-6 transition-colors duration-700" style={{ backgroundColor: currentTheme?.secondary || '#FDF8F2' }}>
          {/* Left: Empty space to keep arrows centered */}
          <div className="flex items-center gap-4 w-48"></div>

          {/* Center: Navigation Controls */}
          <div className="flex gap-2">
            <button 
              onClick={slideLeft} 
              className="group h-12 sm:h-14 px-4 sm:px-5 rounded-full bg-[#2B1B15] flex items-center justify-center shadow-2xl hover:bg-black hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-white gap-0 border-2 border-transparent hover:border-amber-500/50"
            >
              <ChevronLeft className="size-5 sm:size-6 transition-transform duration-300 group-hover:-translate-x-1 -mr-1" strokeWidth={3} />
              <span className="font-bold text-[10px] sm:text-xs tracking-wider uppercase hidden sm:block">Anterior</span>
            </button>
            <button 
              onClick={slideRight} 
              className="group h-12 sm:h-14 px-4 sm:px-5 rounded-full bg-[#2B1B15] flex items-center justify-center shadow-2xl hover:bg-black hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-white gap-0 border-2 border-transparent hover:border-amber-500/50"
            >
              <span className="font-bold text-[10px] sm:text-xs tracking-wider uppercase hidden sm:block">Próximo</span>
              <ChevronRight className="size-5 sm:size-6 transition-transform duration-300 group-hover:translate-x-1 -ml-1" strokeWidth={3} />
            </button>
          </div>

          {/* Right: Dots (like the image) */}
          <div className="hidden md:flex gap-2 items-center">
             <div className="w-2.5 h-2.5 rounded-full bg-[#2B1B15]"></div>
             <div className="w-2 h-2 rounded-full bg-[#2B1B15]/30"></div>
             <div className="w-2 h-2 rounded-full bg-[#2B1B15]/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
