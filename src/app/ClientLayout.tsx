"use client";

import React, { useState, useEffect } from "react";
import { AppProvider } from "../context/AppContext";
import Preloader from "../components/Preloader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import LenisScroll from "../components/LenisScroll";
import CartDrawer from "../components/CartDrawer";
import QuickViewModal from "../components/QuickViewModal";
import LeafParticles from "../components/LeafParticles";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!window.navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <AppProvider>
      {/* Offline Dialog Screen */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-6 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-md w-full bg-primary border border-white/10 p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto relative">
                <span className="text-2xl animate-pulse">📡</span>
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-poppins text-accent font-semibold block">
                  Network Disconnected
                </span>
                <h2 className="text-2xl font-playfair font-bold text-white">
                  Offline Mode Detected
                </h2>
                <p className="font-inter text-xs text-lightMint/60 leading-relaxed">
                  Raj Marketing needs an active internet connection to synchronize catalog items and execute checkout forms. Reconnecting automatically...
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-inter text-lightMint/40 italic">
                Scanning bank terminals & organic databases
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lenis Smooth Scroll wrapper */}
      <LenisScroll />
      
      {/* Custom Circular cursor */}
      <CustomCursor />

      {/* Complete Preloader */}
      <AnimatePresence>
        {loading && (
          <Preloader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Top Scrolls-Away Marquee (black bg, light green text) */}
      {!loading && (
        <div className="w-full h-10 bg-black text-accent font-poppins text-[10px] md:text-xs font-semibold uppercase tracking-widest flex items-center overflow-hidden select-none border-b border-white/5 relative z-40">
          <style>{`
            @keyframes marquee-top {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-top {
              display: flex;
              width: max-content;
              animation: marquee-top 25s linear infinite;
            }
          `}</style>
          <div className="animate-marquee-top">
            <span className="px-4 whitespace-nowrap">
              🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp; 🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp; 🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp; 🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp;
            </span>
            <span className="px-4 whitespace-nowrap">
              🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp; 🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp; 🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp; 🌿 RAJ MARKETING &nbsp;&bull;&nbsp; TRUSTED BRAND &nbsp;&bull;&nbsp; AYURVEDIC PRODUCTS &nbsp;&bull;&nbsp; 100% ORGANIC BOTANICAL FORMULATIONS &nbsp;&bull;&nbsp; ESTABLISHED HERITAGE &nbsp;&bull;&nbsp;
            </span>
          </div>
        </div>
      )}

      {/* Sticky Navbar (outside filter wrapper to prevent fixed positioning bug) */}
      {!loading && <Navbar />}

      {/* Global floating drawers and modals */}
      {!loading && (
        <>
          <CartDrawer />
          <QuickViewModal />
        </>
      )}

      {/* Main site wrapper */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col min-h-screen relative bg-backgroundCustom text-textCustom transition-colors duration-500 overflow-x-hidden"
          >
            {/* Global floating leaves/particles */}
            <LeafParticles />

            {/* Main Application Pages Routing */}
            <main className="flex-grow z-10">{children}</main>

            {/* Footer block */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </AppProvider>
  );
}
