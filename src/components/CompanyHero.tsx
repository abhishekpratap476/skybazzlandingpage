"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function SplitWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function CompanyHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const bullets = ["100% Authentic Quality Guarantee", "Fast Doorstep Express Shipping", "24/7 Dedicated Customer Care"];

  return (
    <section id="company-hero" className="relative min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] pt-20 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Light ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="animate-mesh-drift absolute -top-32 right-0 w-[700px] h-[700px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 65%)" }} />
        <div className="animate-mesh-drift-2 absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(88,86,214,0.10) 0%, transparent 65%)" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,113,227,0.05) 0%, transparent 60%)" }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e125_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e125_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.25 }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-8">

          <motion.div variants={itemVariants} className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-px w-6 sm:w-8 bg-[#0071e3]/50" />
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#0071e3]">Enterprise Commerce</span>
            <div className="h-px w-6 sm:w-8 bg-[#0071e3]/50" />
          </motion.div>

          <motion.div variants={itemVariants} className="w-full flex justify-center">
            <div className="space-y-0 leading-none flex flex-col items-center text-center">
              <div className="text-[clamp(2.1rem,7.2vw,6.5rem)] font-extrabold tracking-tight text-slate-900 leading-[0.95] text-center">
                <SplitWords text="Order Anything" delay={0.05} />
              </div>

              {/* "anything." — outline stroke */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2.1rem,7.2vw,6.5rem)] font-extrabold tracking-tight leading-[0.95] text-center"
                style={{
                  WebkitTextStroke: "1.5px #1e1b4b",
                  color: "transparent",
                }}
              >
                from anywhere.
              </motion.div>

              {/* "Before it — gradient */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="text-[clamp(1.25rem,4vw,3.5rem)] font-extrabold tracking-tight leading-tight mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 text-center"
              >
                <span className="text-slate-400 font-semibold">— all over the</span>
                <span style={{
                  background: "linear-gradient(135deg, #3d52e8, #7c3aed 50%, #e11d48)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>world.</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-[#86868b] text-xs sm:text-base md:text-lg font-medium leading-relaxed max-w-xl px-2 sm:px-0">
            Curated electronics, lifestyle essentials, and premium goods delivered worldwide with express doorstep shipping.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 pt-1 sm:pt-2 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/waitlist" className="group relative inline-flex items-center justify-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl neon-btn font-extrabold text-xs sm:text-sm tracking-wide w-full sm:w-auto text-center">
              <span>Join Priority Waitlist</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 sm:pt-2">
            {bullets.map((text, i) => (
              <div key={i} className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[10.5px] sm:text-xs font-semibold text-slate-700">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-px section-divider" />
    </section>
  );
}
