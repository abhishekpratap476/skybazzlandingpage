"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Globe2 } from "lucide-react";
import WaitlistNavbar from "@/components/WaitlistNavbar";
import WaitlistFooter from "@/components/WaitlistFooter";
import WaitlistForm from "@/components/WaitlistForm";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between selection:bg-[#0071e3]/20 relative overflow-x-hidden font-sans">
      {/* ── SEPARATE DEDICATED WAITLIST NAVBAR ── */}
      <WaitlistNavbar />

      {/* ── AMBIENT LIGHTING BACKGROUND ── */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[350px] bg-gradient-to-b from-[#0071e3]/12 to-[#5856d6]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-80 -right-20 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#34aadc]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-4xl mx-auto px-3.5 sm:px-6 pt-24 sm:pt-36 pb-16 sm:pb-20 z-10 w-full flex flex-col items-center text-center">

        {/* Short, Punchy Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1d1d1f] mb-3 leading-tight"
        >
          Reserve Early Access.
        </motion.h1>

        {/* Short Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-slate-500 text-xs sm:text-base max-w-md mx-auto mb-6 sm:mb-8 font-normal leading-relaxed px-2"
        >
          Priority cargo dispatch, launch privileges, and zero platform fees.
        </motion.p>

        {/* Modern Form Card */}
        <motion.div
          id="waitlist-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white/95 p-4 sm:p-8 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,113,227,0.12)] backdrop-blur-2xl text-left"
        >
          <WaitlistForm />
        </motion.div>

        {/* Clean Modern Perks Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 text-xs text-slate-500"
        >
          <div className="flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-[#0071e3]" />
            <span>Priority Queue</span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Surcharge</span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <Globe2 className="w-4 h-4 text-indigo-600" />
            <span>150+ Corridors</span>
          </div>
        </motion.div>
      </main>

      {/* ── WAITLIST FOOTER WITH MARQUEE ── */}
      <WaitlistFooter />
    </div>
  );
}
