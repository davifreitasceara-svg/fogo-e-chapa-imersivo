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

const TransparentImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Remove white/light grey pixels
        // By checking if the pixel is very bright, we make it transparent
        if (r > 230 && g > 230 && b > 230) {
          data[i+3] = 0; // Alpha to 0
        } else if (r > 210 && g > 210 && b > 210) {
          // Feathering for anti-aliasing
          data[i+3] = 100;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) return null;
  return <img src={dataUrl} alt={alt} className={className} />;
};

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

            // Positioning logic exactly like the video: Diagonal from top-right to bottom-left
            let x = 0;
            let y = 0;
            let scale = 1;
            let zIndex = 20;

            if (offset === 0) {
              x = 0;
              y = 0;
              scale = 1.1;
              zIndex = 30;
            } else if (offset === 1) {
              x = 220;
              y = -100;
              scale = 0.6;
              zIndex = 20;
            } else if (offset === 2) {
              x = 400;
              y = -180;
              scale = 0.4;
              zIndex = 10;
            } else if (offset === -1) {
              x = -220;
              y = 120;
              scale = 0.6;
              zIndex = 15;
            }

            // Adjust for mobile screens
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              x = x * 0.5; 
              y = y * 0.5;
            }

            return (
              <motion.div
                key={app.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                initial={false}
                animate={{
                  x: `calc(-50% + ${x}px)`,
                  y: `calc(-55% + ${y}px)`,
                  scale,
                  zIndex,
                  opacity: offset === 2 ? 0.2 : (offset === -1 ? 0 : 1) // Fades out strongly on the left
                }}
                transition={{
                  type: "spring",
                  stiffness: 85,
                  damping: 15,
                  mass: 0.8
                }}
                onClick={() => {
                  if (offset === 1) slideRight();
                  if (offset === -1) slideLeft();
                }}
                style={{ width: "360px" }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={offset === 0 ? { y: [0, -15, 0] } : { y: 0 }}
                  transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <TransparentImage 
                    src={app.image} 
                    alt={app.name} 
                    className="w-full object-contain drop-shadow-2xl" 
                  />
                </motion.div>
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
