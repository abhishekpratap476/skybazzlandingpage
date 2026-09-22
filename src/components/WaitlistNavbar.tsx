"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Zap, Crown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function WaitlistNavbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-500">
      <div
        className={`
          mx-auto flex items-center justify-between relative transition-all duration-500 ease-in-out pointer-events-auto
          ${scrolled
            ? "w-[94%] sm:w-[90%] max-w-6xl mt-2.5 sm:mt-4 h-12 sm:h-14 border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3.5 sm:px-6 shadow-2xl backdrop-blur-2xl rounded-2xl"
            : "w-full h-14 sm:h-16 bg-[var(--surface-card)]/80 border-b border-[var(--border-subtle)] px-3.5 sm:px-8 md:px-12 backdrop-blur-xl"
          }
        `}
      >
        {/* ── LEFT: Logo & Wordmark ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group select-none"
            aria-label="SkyBazz home"
          >
            <Image
              src="/Skybazz2-removebg-preview.png"
              alt="SkyBazz Logo"
              width={28}
              height={28}
              priority
              className="h-6 sm:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] sm:tracking-[0.24em] text-[var(--text-primary)] uppercase transition-all group-hover:tracking-[0.32em]">
              SKYBAZZ
            </span>
          </Link>
        </div>

        {/* ── RIGHT: Theme Switcher & Home link ── */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center p-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
            <button
              type="button"
              onClick={() => setTheme("cobalt")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider transition-all duration-300 cursor-pointer ${
                theme === "cobalt"
                  ? "bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Aero Titanium & Electric Cobalt"
            >
              <Zap className="w-3 h-3" />
              <span className="hidden min-[400px]:inline">AERO</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("gold")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider transition-all duration-300 cursor-pointer ${
                theme === "gold"
                  ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Obsidian & Champagne Gold"
            >
              <Crown className="w-3 h-3" />
              <span className="hidden min-[400px]:inline">GOLD</span>
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--surface-elevated)] transition-all cursor-pointer border border-[var(--border-subtle)]"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden min-[360px]:inline">Home</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
