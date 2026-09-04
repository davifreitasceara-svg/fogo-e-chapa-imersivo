import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';

const appetizers = [
  {
    id: 1,
    name: 'Batatas Fritas',
    desc: 'Crocantes e Douradas',
    image: '/fries_appetizer.jpg',
    bgColor: '#DFB06C', // Warm golden
    textColor: '#ffffff',
  },
  {
    id: 2,
    name: 'Coxas de Frango',
    desc: 'Sabor na Brasa',
    image: '/chicken_wings_appetizer.jpg',
    bgColor: '#E26D5C', // Warm orange/red
    textColor: '#ffffff',
  },
  {
    id: 3,
    name: 'Onion Rings',
    desc: 'Perfeição em Anéis',
    image: '/onion_rings_appetizer.jpg',
    bgColor: '#966B53', // Brownish
    textColor: '#ffffff',
  },
  {
    id: 4,
    name: 'Queijo Crocante',
    desc: 'Derretimento Absoluto',
    image: '/cheese_sticks_appetizer.jpg',
    bgColor: '#D49A89', // Muted peach
    textColor: '#ffffff',
  },
];

export function AppetizerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? appetizers.length - 1 : prev - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => (prev === appetizers.length - 1 ? 0 : prev + 1));
  };

  const currentApp = appetizers[currentIndex];

  return (
    <section className="relative w-full h-[700px] sm:h-[850px] overflow-hidden">
      {/* Animated Background Color */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ backgroundColor: currentApp.bgColor }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Wavy Cream Bottom Background */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] sm:h-[45%] z-10 bg-[#F5E6D3]" style={{ clipPath: 'polygon(0% 20%, 10% 15%, 20% 25%, 30% 10%, 40% 20%, 50% 5%, 60% 25%, 70% 15%, 80% 20%, 90% 10%, 100% 25%, 100% 100%, 0% 100%)' }}></div>
      
      {/* Smooth SVG Wave Alternative for exact match */}
      <div className="absolute bottom-0 left-0 w-full h-[45%] z-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full text-[#FDF8F2]" style={{ transform: 'translateY(-40%)' }}>
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[#FDF8F2]"></div>
      </div>

      {/* Top Navbar */}
      <div className="absolute top-6 w-full px-8 flex justify-between items-center z-50">
        <div className="font-display font-black text-2xl tracking-tighter" style={{ color: currentApp.textColor }}>Entradas</div>
        
        <div className="hidden md:flex bg-[#1A1A1A] rounded-full px-8 py-2.5 gap-8 shadow-xl">
          <span className="text-white text-xs font-bold tracking-wider cursor-pointer hover:text-white/80">HOME</span>
          <span className="text-white/60 text-xs font-bold tracking-wider cursor-pointer hover:text-white">ABOUT</span>
          <span className="text-white/60 text-xs font-bold tracking-wider cursor-pointer hover:text-white">CONTACT</span>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <Search className="text-white size-4" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <ShoppingBag className="text-white size-4" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto h-full flex flex-col md:flex-row items-center pt-20">
        
        {/* Left Typography Area */}
        <div className="w-full md:w-5/12 px-8 sm:px-16 flex flex-col justify-center h-full z-30 mt-10 md:mt-0">
          <motion.h1 
            key={currentApp.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display text-6xl sm:text-[80px] leading-[0.9] font-black tracking-tighter mb-6 text-white drop-shadow-md"
          >
            Sabor Perfeito em Cada Mordida
          </motion.h1>
          <motion.p 
            key={currentApp.desc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/90 text-lg sm:text-xl font-medium mb-10 max-w-sm"
          >
            Você não pode comprar a felicidade, mas pode pedir nossas {currentApp.name.toLowerCase()} crocantes, que é quase a mesma coisa.
          </motion.p>
          
          <div className="flex flex-col gap-8">
            <button className="bg-[#2B1B15] text-white px-8 py-4 rounded-full font-bold text-sm w-fit hover:bg-black transition-colors shadow-xl">
              PEDIR AGORA
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#FDF8F2] bg-gray-300 bg-[url('https://i.pravatar.cc/100?img=1')] bg-cover"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#FDF8F2] bg-gray-300 bg-[url('https://i.pravatar.cc/100?img=2')] bg-cover"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#FDF8F2] bg-gray-300 bg-[url('https://i.pravatar.cc/100?img=3')] bg-cover"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2B1B15] text-sm">10K+ Avaliações</span>
                <span className="text-[#2B1B15]/60 text-xs font-medium">★★★★★ 4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Slider Area */}
        <div className="w-full md:w-7/12 relative h-[400px] sm:h-[600px] flex items-center justify-center perspective-[1200px]">
          
          {appetizers.map((app, index) => {
            let offset = index - currentIndex;
            if (offset < -2) offset += appetizers.length;
            if (offset > 2) offset -= appetizers.length;

            const isVisible = offset >= -1 && offset <= 2;
            if (!isVisible) return null;

            // Positioning logic exactly like the video
            // offset 0 = center (large)
            // offset 1 = right (medium)
            // offset 2 = far right (small)
            // offset -1 = left (medium, behind text slightly)
            
            let x = 0;
            let scale = 1;
            let zIndex = 20;
            let rotate = 0;

            if (offset === 0) {
              x = 0;
              scale = 1.1;
              zIndex = 30;
            } else if (offset === 1) {
              x = 300;
              scale = 0.6;
              zIndex = 20;
            } else if (offset === 2) {
              x = 500;
              scale = 0.4;
              zIndex = 10;
            } else if (offset === -1) {
              x = -250;
              scale = 0.6;
              zIndex = 15;
            }

            // Adjust for mobile screens
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              x = x * 0.5; 
            }

            return (
              <motion.div
                key={app.id}
                className="absolute top-1/2 left-1/2 -translate-y-[55%] -translate-x-1/2 cursor-pointer drop-shadow-2xl"
                initial={false}
                animate={{
                  x: x + "-50%",
                  scale,
                  zIndex,
                  opacity: offset === 2 ? 0.3 : 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 14,
                  mass: 0.8
                }}
                onClick={() => {
                  if (offset === 1) slideRight();
                  if (offset === -1) slideLeft();
                }}
                style={{ width: "380px" }}
              >
                <motion.img 
                  src={app.image} 
                  alt={app.name} 
                  className="w-full object-contain" 
                  style={{ 
                    mixBlendMode: 'multiply',
                    // Extremely strong filter to destroy white background artifacts completely
                    filter: 'contrast(1.3) brightness(1.1) saturate(1.1)' 
                  }} 
                  animate={offset === 0 ? { y: [0, -15, 0] } : { y: 0 }}
                  transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                />
              </motion.div>
            );
          })}

          {/* Navigation Controls under the center item */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex gap-3 z-40">
            <button 
              onClick={slideLeft} 
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-[#2B1B15]"
            >
              <ChevronLeft className="size-5" strokeWidth={3} />
            </button>
            <button 
              onClick={slideRight} 
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-[#2B1B15]"
            >
              <ChevronRight className="size-5" strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
