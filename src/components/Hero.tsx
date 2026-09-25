"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Hand } from "lucide-react";

export default function Hero() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, 280]);
  const titleScale = useTransform(scrollY, [0, 600], [1, 2.0]);
  const titleOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsIntroFinished(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full -mt-22 z-10 h-[calc(100dvh+5.5rem)] min-h-[100dvh]">
      <div id="hero" className="sticky top-0 h-full w-full flex flex-col justify-between overflow-hidden bg-[#1d1d1f]">

        {/* Subtle ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-mesh-drift absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(0,113,227,0.5) 0%, transparent 70%)" }} />
          <div className="animate-mesh-drift-2 absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, rgba(88,86,214,0.4) 0%, transparent 70%)" }} />
        </div>

        {/* Background video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2.0, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Mobile Video (< 768px): portrait optimized */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="block md:hidden absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/hero_mobile.mp4" type="video/mp4" />
          </video>

          {/* Large Screen / Desktop Video (>= 768px): landscape cinematic */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/hero2.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Nav spacer */}
        <div className="w-full h-14 sm:h-20 shrink-0" />

        {/* Brand wordmark */}
        <div className={`absolute inset-0 flex flex-col items-center pointer-events-none select-none px-4 ${isIntroFinished ? "justify-end pb-10 sm:pb-16 md:pb-24" : "justify-center"}`}>
          <motion.h1
            layout
            initial={{ scale: 0.85, opacity: 0, filter: "blur(12px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ default: { duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }, layout: { type: "spring", stiffness: 70, damping: 16 } }}
            style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
            className={`font-display font-black text-center uppercase tracking-tight pointer-events-auto cursor-default flex drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]
              ${isIntroFinished
                ? "flex-row gap-[0.22em] text-[clamp(2.2rem,8.5vw,4.2vw)] leading-none"
                : "flex-col text-[clamp(3.4rem,15vw,12vw)] leading-[0.85]"}`}
          >
            {["Sky", "Bazz"].map((word) => (
              <motion.span key={word} layout transition={{ type: "spring", stiffness: 70, damping: 16 }} className="inline-block text-white">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Scroll Down Indicator with matching SkyBazz blur & spring animation */}
          {isIntroFinished && (
            <motion.div
              layout
              initial={{ scale: 0.85, opacity: 0, filter: "blur(12px)", y: 16 }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                default: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 },
                layout: { type: "spring", stiffness: 70, damping: 16 },
              }}
              style={{ opacity: titleOpacity }}
              className="mt-6 sm:mt-8 flex flex-col items-center gap-2 select-none"
            >
              <div className="relative flex flex-col items-center">
                {/* Hand swipe gesture orb with SkyBazz luxury drop-shadow */}
                <motion.div
                  animate={{ y: [-3, 3, -3], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.8),0_0_12px_rgba(255,255,255,0.08)]"
                >
                  <Hand className="w-4 h-4 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" strokeWidth={2} />
                </motion.div>

                {/* Downward chevron glide animation */}
                <motion.div
                  animate={{ y: [-2, 4, -2], opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                  className="text-white/85 mt-1"
                >
                  <ChevronDown className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Text with animated word spans like SkyBazz */}
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/75 uppercase tracking-[0.28em] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {["Scroll", "Down"].map((word) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, filter: "blur(6px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
