import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';

const appetizers = [
  {
    id: 1,
    title1: 'BATATA',
    title2: 'FRITA',
    name: 'Batatas Fritas',
    image: '/fries_appetizer.jpg',
    bgColor: '#DFB06C',
    textColor: '#ffffff',
  },
  {
    id: 2,
    title1: 'ASINHA',
    title2: 'DE FRANGO',
    name: 'Coxas de Frango',
    image: '/chicken_wings_appetizer.jpg',
    bgColor: '#E26D5C',
    textColor: '#ffffff',
  },
  {
    id: 3,
    title1: 'ANÉIS',
    title2: 'DE CEBOLA',
    name: 'Onion Rings',
    image: '/onion_rings_appetizer.jpg',
    bgColor: '#966B53',
    textColor: '#ffffff',
  },
  {
    id: 4,
    title1: 'PALITOS',
    title2: 'DE QUEIJO',
    name: 'Queijo Crocante',
    image: '/cheese_sticks_appetizer.jpg',
    bgColor: '#D49A89',
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
    // To move items LEFT (down-left), currentIndex must INCREASE.
    setCurrentIndex((prev) => (prev === appetizers.length - 1 ? 0 : prev + 1));
  };

  const slideRight = () => {
    // To move items RIGHT (up-right), currentIndex must DECREASE.
    setCurrentIndex((prev) => (prev === 0 ? appetizers.length - 1 : prev - 1));
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
        
        {/* Navigation removed as per user request */}
        <div></div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <Search className="text-white size-4" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <ShoppingBag className="text-white size-4" />
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-[1400px] mx-auto h-full flex flex-col md:flex-row items-center pt-20">
        
        <div className="w-full md:w-5/12 px-8 sm:px-16 flex flex-col justify-center h-full z-30 mt-10 md:mt-0">
          <motion.div
            key={currentApp.title1}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col mb-10"
          >
            <span 
              className="font-display text-7xl sm:text-[110px] leading-[0.85] font-black tracking-tighter text-transparent"
              style={{ WebkitTextStroke: "3px white" }}
            >
              {currentApp.title1}
            </span>
            <span className="font-display text-7xl sm:text-[110px] leading-[0.85] font-black tracking-tighter text-white drop-shadow-xl mt-2">
              {currentApp.title2}
            </span>
          </motion.div>
          
          <div className="flex flex-col gap-8">
            <button className="bg-[#2B1B15] text-white px-8 py-4 rounded-full font-bold text-sm w-fit hover:bg-black transition-colors shadow-xl">
              PEDIR AGORA
            </button>
          </div>
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

            if (offset === 0) {
              x = 0;
              y = 0;
              scale = 1.35;
              zIndex = 30;
              rotate = 0;
            } else if (offset === 1) {
              x = 240;
              y = -110;
              scale = 0.75;
              zIndex = 20;
              rotate = 15;
            } else if (offset === 2) {
              x = 420;
              y = -190;
              scale = 0.5;
              zIndex = 10;
              rotate = 35;
            } else if (offset === -1) {
              x = -240;
              y = 130;
              scale = 0.75;
              zIndex = 15;
              rotate = -25;
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
                  rotate,
                  zIndex,
                  opacity: offset === 2 ? 0.2 : (offset === -1 ? 0 : 1) // Fades out strongly on the left
                }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 10,
                  mass: 0.9,
                  velocity: 2 // Gives an initial push to feel more dynamic
                }}
                onClick={() => {
                  if (offset === 1) slideLeft();
                  if (offset === -1) slideRight();
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

        </div>
      </div>

      {/* Footer / Wave Area */}
      <div className="absolute bottom-0 left-0 w-full z-40">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[100px] sm:h-[150px] text-[#FDF8F2] block mb-[-2px]">
          <path fill="currentColor" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <div className="w-full bg-[#FDF8F2] h-[100px] flex items-center justify-between px-8 sm:px-16 pb-6">
          {/* Left: Empty space to keep arrows centered */}
          <div className="flex items-center gap-4 w-48"></div>

          {/* Center: Navigation Controls */}
          <div className="flex gap-4">
            <button 
              onClick={slideLeft} 
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform text-[#2B1B15] border border-gray-100"
            >
              <ChevronLeft className="size-5" strokeWidth={3} />
            </button>
            <button 
              onClick={slideRight} 
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform text-[#2B1B15] border border-gray-100"
            >
              <ChevronRight className="size-5" strokeWidth={3} />
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
