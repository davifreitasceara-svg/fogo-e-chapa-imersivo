import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const appetizers = [
  {
    id: 1,
    name: 'Batatas Fritas',
    desc: 'Crocantes e Douradas',
    image: '/fries_appetizer.jpg',
    bgColor: '#FDB813', // Yellow/Gold
    textColor: '#5A3F00',
  },
  {
    id: 2,
    name: 'Coxas de Frango',
    desc: 'Sabor Brasa',
    image: '/chicken_wings_appetizer.jpg',
    bgColor: '#E25822', // Flame Orange
    textColor: '#4A1C08',
  },
  {
    id: 3,
    name: 'Onion Rings',
    desc: 'Perfeição em Anéis',
    image: '/onion_rings_appetizer.jpg',
    bgColor: '#D99058', // Light Brown
    textColor: '#4D2A11',
  },
  {
    id: 4,
    name: 'Palitos de Queijo',
    desc: 'Derretimento Absoluto',
    image: '/cheese_sticks_appetizer.jpg',
    bgColor: '#F4D03F', // Cheese Yellow
    textColor: '#594A11',
  },
];

export function AppetizerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideLeft = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? appetizers.length - 1 : prev - 1));
  };

  const slideRight = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === appetizers.length - 1 ? 0 : prev + 1));
  };

  const currentApp = appetizers[currentIndex];

  // Calculate previous and next indices
  const prevIndex = currentIndex === 0 ? appetizers.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === appetizers.length - 1 ? 0 : currentIndex + 1;

  return (
    <section 
      className="relative w-full h-[600px] sm:h-[800px] overflow-hidden transition-colors duration-700 flex items-center justify-center"
      style={{ backgroundColor: currentApp.bgColor }}
    >
      {/* Top Nav inside the slider (matching the video style) */}
      <div className="absolute top-8 w-full max-w-7xl px-8 flex justify-between items-center z-50">
        <h2 className="font-display text-3xl font-black tracking-tighter" style={{ color: currentApp.textColor }}>
          Entradas
        </h2>
        <div className="hidden sm:flex gap-6 rounded-full bg-white/20 backdrop-blur-md px-6 py-2 border border-white/30">
          <span className="font-bold text-sm cursor-pointer" style={{ color: currentApp.textColor }}>Destaques</span>
          <span className="font-bold text-sm cursor-pointer opacity-70 hover:opacity-100" style={{ color: currentApp.textColor }}>Porções</span>
          <span className="font-bold text-sm cursor-pointer opacity-70 hover:opacity-100" style={{ color: currentApp.textColor }}>Molhos</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between h-full pt-20">
        
        {/* Left Text */}
        <div className="w-full md:w-1/3 text-center md:text-left z-30 relative">
          <motion.h3 
            key={currentApp.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-5xl sm:text-7xl font-black leading-none mb-4 tracking-tighter"
            style={{ color: currentApp.textColor }}
          >
            {currentApp.name}
          </motion.h3>
          <motion.p 
            key={currentApp.desc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-2xl font-bold mb-8 opacity-90"
            style={{ color: currentApp.textColor }}
          >
            {currentApp.desc}
          </motion.p>
          <Button 
            className="rounded-full px-8 py-6 text-lg font-bold border-0 shadow-xl transition-transform hover:scale-105"
            style={{ backgroundColor: currentApp.textColor, color: currentApp.bgColor }}
          >
            Adicionar ao Pedido
          </Button>
        </div>

        {/* Carousel Images */}
        <div className="w-full md:w-2/3 relative h-[300px] sm:h-[500px] flex items-center justify-center mt-12 md:mt-0 perspective-[1000px]">
          {appetizers.map((app, index) => {
            // Calculate relative position (-1, 0, 1, or hidden)
            let offset = index - currentIndex;
            if (offset < -1) offset += appetizers.length;
            if (offset > 1) offset -= appetizers.length;

            // Determine if the item should be visible
            const isVisible = offset >= -1 && offset <= 1;
            
            // Animation values based on offset
            const xPos = offset * 250; // Distance between items
            const scale = offset === 0 ? 1 : 0.6;
            const opacity = offset === 0 ? 1 : (isVisible ? 0.5 : 0);
            const zIndex = offset === 0 ? 30 : 10;
            const blur = offset === 0 ? "blur(0px)" : "blur(2px)";

            return (
              <motion.div
                key={app.id}
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                initial={false}
                animate={{
                  x: xPos + "-50%",
                  scale,
                  opacity,
                  zIndex,
                  filter: blur,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 0.8
                }}
                onClick={() => {
                  if (offset === 1) slideRight();
                  if (offset === -1) slideLeft();
                }}
                style={{ width: offset === 0 ? "400px" : "250px" }}
              >
                <motion.img 
                  src={app.image} 
                  alt={app.name} 
                  className="w-full object-contain drop-shadow-2xl" 
                  style={{ 
                    mixBlendMode: 'multiply',
                    // Aggressive filter to destroy white background noise
                    filter: 'brightness(1.15) contrast(1.4) saturate(1.1)' 
                  }} 
                  animate={offset === 0 ? { y: [0, -10, 0] } : { y: 0 }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative background blobs */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[150%] h-[150px] sm:h-[300px] -ml-[25%]" style={{ fill: currentApp.textColor }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-40">
        <Button onClick={slideLeft} size="icon" className="rounded-full shadow-lg" style={{ backgroundColor: currentApp.textColor, color: currentApp.bgColor }}>
          <ChevronLeft className="size-6" />
        </Button>
        <Button onClick={slideRight} size="icon" className="rounded-full shadow-lg" style={{ backgroundColor: currentApp.textColor, color: currentApp.bgColor }}>
          <ChevronRight className="size-6" />
        </Button>
      </div>

    </section>
  );
}
