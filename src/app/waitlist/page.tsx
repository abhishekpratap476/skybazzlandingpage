"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Globe2 } from "lucide-react";
import WaitlistNavbar from "@/components/WaitlistNavbar";
import WaitlistFooter from "@/components/WaitlistFooter";
import WaitlistForm from "@/components/WaitlistForm";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[var(--accent-glow)] relative overflow-x-hidden font-sans transition-colors duration-400">
      {/* ── SEPARATE DEDICATED WAITLIST NAVBAR ── */}
      <WaitlistNavbar />

      {/* ── AMBIENT LIGHTING BACKGROUND ── */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
      <div className="absolute top-80 -right-20 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)" }} />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-4xl mx-auto px-3.5 sm:px-6 pt-24 sm:pt-36 pb-16 sm:pb-20 z-10 w-full flex flex-col items-center text-center">

        {/* Short, Punchy Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] mb-3 leading-tight"
        >
          Reserve Early Access.
        </motion.h1>

        {/* Short Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-[var(--text-secondary)] text-xs sm:text-base max-w-md mx-auto mb-6 sm:mb-8 font-normal leading-relaxed px-2"
        >
          Priority cargo dispatch, launch privileges, and zero platform fees.
        </motion.p>

        {/* Modern Form Card */}
        <motion.div
          id="waitlist-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="skybazz-card w-full max-w-2xl p-4 sm:p-8 text-left border-[var(--border-hover)] shadow-2xl"
        >
          <WaitlistForm />
        </motion.div>

        {/* Clean Modern Perks Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-10 text-xs"
        >
          <div className="skybazz-trust-badge badge-express">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            <span>Priority Queue</span>
          </div>

          <div className="skybazz-trust-badge badge-security">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Surcharge</span>
          </div>

          <div className="skybazz-trust-badge badge-support">
            <Globe2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>150+ Corridors</span>
          </div>
        </motion.div>
      </main>

      {/* ── WAITLIST FOOTER WITH MARQUEE ── */}
      <WaitlistFooter />
    </div>
  );
}
