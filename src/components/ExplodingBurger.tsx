import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import burgerTopBun from "@/assets/burger_top_bun.jpg";
import burgerCheese from "@/assets/burger_cheese.jpg";
import burgerPatty from "@/assets/burger_patty.jpg";
import burgerBottomBun from "@/assets/burger_bottom_bun.jpg";

export function ExplodingBurger() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // The values will animate as the user scrolls from the top to the bottom of the section
  const topBunY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -180, -220]);
  const cheeseY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -60, -80]);
  const pattyY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 30, 40]);
  const bottomBunY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 120, 160]);

  // Opacity of labels
  const labelOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section ref={containerRef} id="gallery" className="relative h-[200vh] bg-white text-black">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden w-full">
        <h2 className="text-4xl sm:text-6xl font-black mb-12 sm:mb-20 uppercase font-display tracking-tighter text-center">
          A Anatomia do Sabor
        </h2>
        
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto aspect-square flex flex-col items-center justify-center">
          
          {/* Top Bun */}
          <motion.div style={{ y: topBunY }} className="absolute z-50 flex items-center w-full justify-center">
            <img src={burgerTopBun} alt="Pão Superior" className="w-[80%] sm:w-[70%] object-contain" style={{ mixBlendMode: 'multiply' }} />
            <motion.div style={{ opacity: labelOpacity }} className="hidden md:block absolute right-0 translate-x-[40%] pr-10 w-48">
              <p className="text-xl font-black uppercase tracking-widest text-[#006B2D]">Pão Artesanal</p>
              <p className="text-sm text-gray-600 font-medium">Tostado na manteiga</p>
            </motion.div>
          </motion.div>

          {/* Cheese */}
          <motion.div style={{ y: cheeseY }} className="absolute z-40 flex items-center w-full justify-center">
            <img src={burgerCheese} alt="Queijo Cheddar" className="w-[80%] sm:w-[70%] object-contain" style={{ mixBlendMode: 'multiply' }} />
            <motion.div style={{ opacity: labelOpacity }} className="hidden md:block absolute left-0 -translate-x-[40%] pl-10 text-right w-48">
              <p className="text-xl font-black uppercase tracking-widest text-amber-500">Queijo Derretido</p>
              <p className="text-sm text-gray-600 font-medium">Cheddar inglês e cebola</p>
            </motion.div>
          </motion.div>

          {/* Patty */}
          <motion.div style={{ y: pattyY }} className="absolute z-30 flex items-center w-full justify-center">
            <img src={burgerPatty} alt="Carne" className="w-[80%] sm:w-[70%] object-contain" style={{ mixBlendMode: 'multiply' }} />
            <motion.div style={{ opacity: labelOpacity }} className="hidden md:block absolute right-0 translate-x-[40%] pr-10 w-48">
              <p className="text-xl font-black uppercase tracking-widest text-[#7A1200]">Blend 180g</p>
              <p className="text-sm text-gray-600 font-medium">Sabor de churrasco</p>
            </motion.div>
          </motion.div>

          {/* Bottom Bun */}
          <motion.div style={{ y: bottomBunY }} className="absolute z-20 flex items-center w-full justify-center">
            <img src={burgerBottomBun} alt="Pão Inferior" className="w-[80%] sm:w-[70%] object-contain" style={{ mixBlendMode: 'multiply' }} />
            <motion.div style={{ opacity: labelOpacity }} className="hidden md:block absolute left-0 -translate-x-[40%] pl-10 text-right w-48">
              <p className="text-xl font-black uppercase tracking-widest text-[#006B2D]">Base Sólida</p>
              <p className="text-sm text-gray-600 font-medium">Segura todo o sabor</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
