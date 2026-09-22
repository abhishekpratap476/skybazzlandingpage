"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSectionName, setCurrentSectionName] = useState("OVERVIEW");

  const sectionsList = [
    { id: "hero",               name: "OVERVIEW"   },
    { id: "company-hero",      name: "ENTERPRISE" },
    { id: "categories-section",name: "CATEGORIES" },
    { id: "about-section",     name: "COMPANY"    },
    { id: "services-section",  name: "SERVICES"   },
    { id: "video-section",     name: "SHOWREEL"   },
    { id: "trending-section",  name: "TRENDING"   },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
      const scrollPosition = window.scrollY + 220;
      for (let i = sectionsList.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionsList[i].id);
        if (el && scrollPosition >= el.offsetTop) {
          setCurrentSectionName(sectionsList[i].name);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-500 ease-in-out">
        <div className={`mx-auto flex items-center justify-between relative transition-all duration-500 ease-in-out pointer-events-auto
          ${mobileMenuOpen
            ? "w-full h-14 sm:h-16 bg-transparent border-transparent shadow-none px-3.5 sm:px-8"
            : !isScrolled
            ? "w-full h-14 sm:h-16 bg-transparent border-b border-transparent shadow-none backdrop-blur-none px-3.5 sm:px-8 md:px-12"
            : "w-[94%] max-w-7xl mt-2 sm:mt-4 h-12 sm:h-14 border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 sm:px-6 shadow-2xl backdrop-blur-2xl rounded-2xl"
          }`}
        >
          {/* Left: Menu + section indicator */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="nav-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border transition-all duration-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] cursor-pointer
                ${mobileMenuOpen
                  ? "border-[var(--border-hover)] bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm"
                  : !isScrolled
                  ? "border-white/20 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md"
                  : "border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-hover)] text-[var(--text-primary)]"
                }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="flex h-3.5 w-4 flex-col justify-between">
                <span className={`h-0.5 w-full transition-all duration-300 ${mobileMenuOpen ? "bg-[var(--accent-primary)] translate-y-[6px] rotate-45" : !isScrolled ? "bg-white" : "bg-[var(--text-primary)]"}`} />
                <span className={`h-0.5 w-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : !isScrolled ? "bg-white" : "bg-[var(--text-primary)]"}`} />
                <span className={`h-0.5 w-full transition-all duration-300 ${mobileMenuOpen ? "bg-[var(--accent-primary)] -translate-y-[6px] -rotate-45" : !isScrolled ? "bg-white" : "bg-[var(--text-primary)]"}`} />
              </div>
              <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
            </button>

            {!mobileMenuOpen && (
              <>
                <span className={`hidden sm:inline-block h-3 w-px transition-colors duration-300 ${!isScrolled ? "bg-white/25" : "bg-[var(--border-stroke)]"}`} />

                {/* Animated section label */}
                <div className="hidden sm:flex relative overflow-hidden items-center h-6">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSectionName}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] select-none ${
                        !isScrolled ? "text-[var(--accent-secondary)] drop-shadow-[0_0_10px_var(--accent-glow)]" : "text-[var(--accent-primary)]"
                      }`}
                    >
                      {currentSectionName}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Center: Brand logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className={`transition-all duration-500 transform ease-out ${isScrolled && !mobileMenuOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-8 scale-95 pointer-events-none"}`}>
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group">
                <Image src="/Skybazz2-removebg-preview.png" alt="Skybazz Logo" width={28} height={28} priority
                  className="h-5 sm:h-7 md:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm" />
                <span className="hidden min-[380px]:inline text-xs sm:text-sm md:text-base font-extrabold tracking-[0.2em] sm:tracking-[0.22em] text-[var(--text-primary)] select-none transition-all duration-300 group-hover:tracking-[0.3em] uppercase">
                  SKYBAZZ
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Theme Switcher + Waitlist CTA */}
          <div className={`flex items-center gap-2 sm:gap-3 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            


            <Link
              id="nav-waitlist-btn"
              href="/waitlist"
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.15em] transition-all duration-300 hover:scale-105 shadow-sm
                ${!isScrolled
                  ? "bg-white/15 hover:bg-white/25 border border-white/30 text-white backdrop-blur-md"
                  : "skybazz-cta"
                }`}
              title="Join the Early Access Waiting List"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Waitlist</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Fullscreen Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[var(--surface-elevated)]/98 backdrop-blur-3xl overflow-y-auto text-[var(--text-primary)]"
          >
            <div className="w-full px-6 pt-20 sm:pt-28 max-w-7xl mx-auto">
              <div className="h-px w-full section-divider" />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center py-6 px-4 gap-5 sm:gap-6 my-auto">


              <nav className="flex flex-col items-center gap-4 sm:gap-5 text-center w-full max-w-sm">
                {sectionsList.map((sec, index) => (
                  <motion.button
                    key={sec.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.35, ease: [0.16,1,0.3,1] }}
                    onClick={() => scrollToSection(sec.id)}
                    className={`text-xl sm:text-2xl font-black tracking-[0.18em] transition-colors cursor-pointer py-1
                      ${currentSectionName === sec.name ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"}`}
                  >
                    {sec.name}
                  </motion.button>
                ))}

                <div className="h-px w-28 section-divider my-1" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionsList.length * 0.05 + 0.1 }}
                  className="flex flex-col gap-3 w-full max-w-xs px-2"
                >
                  <Link
                    href="/waitlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full skybazz-cta font-extrabold text-xs tracking-wider shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>JOIN WAITING LIST</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </nav>
            </div>

            <div className="w-full px-6 pb-8 pt-4 text-center text-[11px] text-[var(--text-muted)] font-bold tracking-widest">
              © {new Date().getFullYear()} SKYBAZZ LOGISTICS CORP.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
