"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function WaitlistNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleWaitlistUpdated = () => {
      setIsRegistered(true);
    };
    window.addEventListener("waitlist-updated", handleWaitlistUpdated);
    return () => window.removeEventListener("waitlist-updated", handleWaitlistUpdated);
  }, []);

  const scrollToForm = () => {
    const formCard = document.getElementById("waitlist-card");
    if (formCard) {
      formCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstInput = formCard.querySelector("input");
      if (firstInput) {
        setTimeout(() => (firstInput as HTMLInputElement).focus(), 400);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-500">
      <div
        className={`
          mx-auto flex items-center justify-between relative transition-all duration-500 ease-in-out pointer-events-auto
          ${scrolled
            ? "w-[94%] sm:w-[90%] max-w-6xl mt-2.5 sm:mt-4 h-12 sm:h-14 border border-slate-200/80 bg-white/88 px-3.5 sm:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl rounded-2xl"
            : "w-full h-14 sm:h-16 bg-white/60 border-b border-slate-200/40 px-3.5 sm:px-8 md:px-12 backdrop-blur-md"
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
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] sm:tracking-[0.24em] text-[#1d1d1f] uppercase transition-all group-hover:tracking-[0.32em]">
              SKYBAZZ
            </span>
          </Link>

          {/* <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-[#0071e3] uppercase tracking-wider ml-1">
            <Sparkles className="w-2.5 h-2.5" />
            Waitlist
          </span> */}
        </div>

        {/* ── RIGHT: Navigation & CTA ── */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-[#0071e3] hover:bg-slate-100/70 transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden min-[360px]:inline">Home</span>
          </Link>

          {/* {isRegistered ? (
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] sm:text-xs font-bold text-emerald-700 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Reserved</span>
            </div>
          ) : (
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-xs shadow-[#0071e3]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Join Queue
            </button>
          )} */}
        </div>
      </div>
    </nav>
  );
}
