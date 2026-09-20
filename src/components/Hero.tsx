"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, 280]);
  const titleScale = useTransform(scrollY, [0, 600], [1, 2.0]);
  const titleOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.35, 0.60]);

  useEffect(() => {
    const timer = setTimeout(() => setIsIntroFinished(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full -mt-22 z-10 h-[75vh] sm:h-[85vh] md:h-[calc(100vh+5.5rem)] min-h-[500px]">
      <div id="hero" className="sticky top-0 h-full w-full flex flex-col justify-between overflow-hidden bg-[#1d1d1f]">

        {/* Subtle ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-mesh-drift absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(0,113,227,0.5) 0%, transparent 70%)" }} />
          <div className="animate-mesh-drift-2 absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, rgba(88,86,214,0.4) 0%, transparent 70%)" }} />
        </div>

        {/* Background video + overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2.0, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/hero2.mp4" type="video/mp4" />
          </video>
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black" />
          {/* Scanline texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)", backgroundSize: "100% 3px" }} />
        </motion.div>

        {/* Nav spacer */}
        <div className="w-full h-14 sm:h-20 shrink-0" />

        {/* Brand wordmark */}
        <div className={`absolute inset-0 flex flex-col items-center pointer-events-none select-none px-4 ${isIntroFinished ? "justify-end pb-8 sm:pb-16 md:pb-24" : "justify-center"}`}>
          <motion.h1
            layout
            initial={{ scale: 0.85, opacity: 0, filter: "blur(12px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ default: { duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }, layout: { type: "spring", stiffness: 70, damping: 16 } }}
            style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
            className={`font-display font-black text-center uppercase tracking-tighter pointer-events-auto cursor-default flex
              ${isIntroFinished
                ? "flex-row gap-[0.22em] text-[clamp(2.4rem,8vw,4.2vw)] leading-none"
                : "flex-col text-[clamp(3.6rem,16vw,12vw)] leading-[0.8]"}`}
          >
            {["Sky", "Bazz"].map((word, i) => (
              <motion.span key={word} layout transition={{ type: "spring", stiffness: 70, damping: 16 }} className="inline-block text-white">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {isIntroFinished && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 sm:mt-3 text-[11px] sm:text-sm text-white/60 font-medium tracking-[0.18em] sm:tracking-[0.3em] uppercase text-center max-w-xs sm:max-w-none"
            >
              Next-Gen Shopping · Global Express Delivery
            </motion.p>
          )}

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1.2 }}
            className="mt-5 sm:mt-8 flex flex-col items-center gap-1.5 sm:gap-2"
          >
            <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">Scroll</span>
            <div className="relative w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-white/60"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.0 }}
          className="relative w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-end"
        >
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="opacity-40 hover:opacity-80 transition-opacity text-white" aria-label="Instagram">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </motion.footer>
      </div>
    </div>
  );
}
