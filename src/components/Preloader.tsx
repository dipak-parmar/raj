"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const translations = ["RAJ", "राज", "રાજ"];
  const [transIdx, setTransIdx] = useState(0);

  useEffect(() => {
    // Dynamic translation swap loader (every 220ms for high-energy premium feel)
    const transInterval = setInterval(() => {
      setTransIdx((prev) => (prev + 1) % translations.length);
    }, 220);

    // Fade and complete loading exactly at 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(transInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center space-x-2 md:space-x-4 max-w-4xl px-6">
        
        {/* Translating "RAJ" part */}
        <div className="w-[60px] md:w-[185px] h-[40px] md:h-[80px] relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={transIdx}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute text-xl md:text-7xl font-playfair font-black text-accent tracking-wide whitespace-nowrap select-none"
            >
              {translations[transIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Static "MARKETING" part */}
        <span className="text-xl md:text-7xl font-playfair font-bold text-white tracking-widest select-none">
          MARKETING
        </span>
        
      </div>
      
      {/* Decorative center accent ambient glow */}
      <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vh] bg-accent/5 rounded-full blur-[150px] pointer-events-none animate-pulse" />
    </div>
  );
}
