"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Send, Layers, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail && emailRegex.test(cleanEmail) && cleanEmail.length <= 120) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="relative z-20 border-t border-slate-200/60 bg-[#f5f5f7]/90 backdrop-blur-md transition-colors duration-300 w-full pt-12 sm:pt-20 pb-10 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden text-[#1d1d1f]">
      {/* Decorative top border glow line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-8 pb-12 sm:pb-16 border-b border-slate-200/80">
          
          {/* Brand Info & Mission (Full width on 2-col mobile layout) */}
          <div className="col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/Skybazz2-removebg-preview.png"
                alt="Skybazz Logo"
                width={40}
                height={40}
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-black tracking-[0.25em] text-[#1d1d1f]">
                  SKYBAZZ
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.3em] text-[#86868b] uppercase">
                  ENTERPRISE PLATFORM
                </span>
              </div>
            </Link>

            <p className="text-[#86868b] text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Architecting next-generation procurement, precision components, and immersive video showreels for global innovators.
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#86868b] font-semibold pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                <ShieldCheck className="size-3.5 text-[#0071e3]" />
                <span>Verified Sourcing</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                <Layers className="size-3.5 text-[#0071e3]" />
                <span>Global Direct</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Jump Links (Left column on mobile) */}
          <div className="col-span-1 space-y-3 sm:space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#1d1d1f] uppercase">
              Sections
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#86868b]">
              {[
                { name: "Overview", id: "hero" },
                { name: "Enterprise", id: "company-hero" },
                { name: "Categories", id: "categories-section" },
                { name: "Company", id: "about-section" },
                { name: "Services", id: "services-section" },
                { name: "Showreel", id: "video-section" },
                { name: "3D Sphere", id: "trending-section" },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-[#1d1d1f] transition-colors duration-200 font-medium flex items-center gap-1.5 cursor-pointer text-left group"
                  >
                    <ArrowRight className="size-3 text-slate-400 group-hover:text-[#0071e3] transition-colors" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal & Marketplace Links (Right column on mobile) */}
          <div className="col-span-1 space-y-3 sm:space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#1d1d1f] uppercase">
              Marketplace
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#86868b]">
              {[
                { name: "Join Waitlist", href: "/waitlist" },
                { name: "Categories", href: "/categories" },
                { name: "Directories", href: "/sourcing-directories" },
                { name: "AI Search", href: "/ai-image-search" },
                { name: "Orders", href: "/orders" },
                { name: "Profile", href: "/profile" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-[#1d1d1f] transition-colors duration-200 font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected / Newsletter (Full width on 2-col mobile layout) */}
          <div className="col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#1d1d1f] uppercase">
              Enterprise Updates
            </h4>
            <p className="text-[#86868b] text-xs leading-relaxed font-medium">
              Receive direct notifications for new supplier drops & global logistics updates.
            </p>
            <form onSubmit={handleSubmit} className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter enterprise email..."
                maxLength={120}
                autoComplete="email"
                required
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0071e3] rounded-full py-2.5 pl-4 pr-10 text-xs text-[#1d1d1f] placeholder:text-[#86868b]/60 focus:outline-none transition-all duration-300 shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 rounded-full bg-[#0071e3] text-white hover:bg-[#0071e3]/90 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                {subscribed ? (
                  <span className="text-[9px] font-bold tracking-widest px-1 uppercase animate-pulse">
                    Sent
                  </span>
                ) : (
                  <Send className="size-3" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] sm:text-xs tracking-wider text-[#86868b] font-medium">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <p>© {new Date().getFullYear()} SKYBAZZ INC. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-[#1d1d1f] transition-colors duration-200">PRIVACY POLICY</Link>
              <span>/</span>
              <Link href="#" className="hover:text-[#1d1d1f] transition-colors duration-200">TERMS OF SERVICE</Link>
              <span>/</span>
              <Link href="#" className="hover:text-[#1d1d1f] transition-colors duration-200">SECURITY</Link>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:text-[#1d1d1f] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xs cursor-pointer"
          >
            Back to Top
            <ArrowUp className="size-3.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
}
