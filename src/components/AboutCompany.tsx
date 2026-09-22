"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Shield, Plane, Cpu, Award } from "lucide-react";
import LanyardSection from "@/components/LanyardSection";

export default function AboutCompany() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Track when the user enters the About Company section
  const isInView = useInView(containerRef, { amount: 0.1 });
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [swingTrigger, setSwingTrigger] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (!hasEnteredView) {
        setHasEnteredView(true);
      }
      setSwingTrigger((prev) => prev + 1);
    }
  }, [isInView, hasEnteredView]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Header Animation: Centered at first (0 -> 0.12), then floats to top header position (0.12 -> 0.24)
  const headerY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24],
    ["0vh", "0vh", isMobile ? "-28vh" : "-30vh"]
  );
  const headerScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24],
    [1, 1, isMobile ? 0.88 : 0.92]
  );
  const headerSubOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.24],
    [1, 0.85]
  );

  // Card 0 (Left 1 - Plane) appears at progress 0.18 -> 0.30
  const card0Opacity = useTransform(scrollYProgress, [0.18, 0.30], [0, 1]);
  const card0X = useTransform(scrollYProgress, [0.18, 0.30], [isMobile ? -40 : -90, 0]);
  const card0Scale = useTransform(scrollYProgress, [0.18, 0.30], [0.9, 1]);

  // Card 1 (Right 1 - Shield) appears at progress 0.34 -> 0.46
  const card1Opacity = useTransform(scrollYProgress, [0.34, 0.46], [0, 1]);
  const card1X = useTransform(scrollYProgress, [0.34, 0.46], [isMobile ? 40 : 90, 0]);
  const card1Scale = useTransform(scrollYProgress, [0.34, 0.46], [0.9, 1]);

  // Card 2 (Left 2 - AI Smart Search) appears at progress 0.50 -> 0.62
  const card2Opacity = useTransform(scrollYProgress, [0.50, 0.62], [0, 1]);
  const card2X = useTransform(scrollYProgress, [0.50, 0.62], [isMobile ? -40 : -90, 0]);
  const card2Scale = useTransform(scrollYProgress, [0.50, 0.62], [0.9, 1]);

  // Card 3 (Right 2 - Buyer Protection) appears at progress 0.66 -> 0.78
  const card3Opacity = useTransform(scrollYProgress, [0.66, 0.78], [0, 1]);
  const card3X = useTransform(scrollYProgress, [0.66, 0.78], [isMobile ? 40 : 90, 0]);
  const card3Scale = useTransform(scrollYProgress, [0.66, 0.78], [0.9, 1]);

  // Scroll progress bar width
  const scrollBarWidth = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  const pillars = [
    {
      icon: <Plane className="w-5 h-5" />,
      title: "Worldwide Express Delivery",
      description: "Direct priority flight corridors linking international hubs to deliver your order swiftly to your doorstep.",
      color: "from-blue-600 to-cyan-500",
      glow: "rgba(0,113,227,0.15)",
      side: "left",
      opacity: card0Opacity,
      x: card0X,
      scale: card0Scale,
      step: "01",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Strict Quality & Authenticity",
      description: "100% genuine quality inspection protocol verifying every product before dispatch for total satisfaction.",
      color: "from-indigo-600 to-blue-500",
      glow: "rgba(99,102,241,0.15)",
      side: "right",
      opacity: card1Opacity,
      x: card1X,
      scale: card1Scale,
      step: "02",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "AI-Powered Smart Search",
      description: "Intelligent catalog search engine helping you instantly discover top products, categories, and recommendations.",
      color: "from-violet-600 to-indigo-500",
      glow: "rgba(139,92,246,0.15)",
      side: "left",
      opacity: card2Opacity,
      x: card2X,
      scale: card2Scale,
      step: "03",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Buyer Protection & Live Assistance",
      description: "Complete peace of mind with order protection, money-back guarantees, and 24/7 live customer assistance.",
      color: "from-purple-600 to-violet-500",
      glow: "rgba(168,85,247,0.15)",
      side: "right",
      opacity: card3Opacity,
      x: card3X,
      scale: card3Scale,
      step: "04",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="about-section"
      className="relative w-full h-[320vh] sm:h-[360vh] bg-[var(--canvas-bg)] text-[var(--text-primary)] transition-colors duration-400"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
        
        {/* 3D Lanyard Interactive Background */}
        <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
          {hasEnteredView && (
            <LanyardSection
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              triggerKey={swingTrigger}
            />
          )}
          {/* Subtle radial vignette gradient to blend lanyard and enhance foreground readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, transparent 25%, var(--canvas-bg) 92%)",
              opacity: 0.55,
            }}
          />
        </div>

        {/* Ambient atmospheric glow spots */}
        <div
          className="absolute top-1/4 right-8 w-[450px] h-[450px] rounded-full pointer-events-none opacity-20 animate-mesh-drift"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 left-8 w-[400px] h-[400px] rounded-full pointer-events-none opacity-15 animate-mesh-drift-2"
          style={{ background: "radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)" }}
        />

        {/* Subtle Section Borders */}
        <div className="absolute top-0 inset-x-0 h-px section-divider pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-px section-divider pointer-events-none" />

        {/* Storytelling Content Layer */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center pointer-events-none">
          
          {/* Main Heading — Centers at first, then glides up gracefully on scroll */}
          <motion.div
            style={{
              y: headerY,
              scale: headerScale,
            }}
            className="text-center max-w-3xl space-y-3 sm:space-y-4 pointer-events-auto transition-transform duration-75"
          >
            <div className="inline-flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
              <div className="h-px w-6 sm:w-8 bg-[var(--accent-primary)]/60" />
              <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[var(--accent-primary)]">
                About SkyBazz
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                Interactive 3D Stage
              </span>
              <div className="h-px w-6 sm:w-8 bg-[var(--accent-primary)]/60" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-[var(--text-primary)]">
              Redefining Online Shopping With{" "}
              <span className="skybazz-headline-gradient">
                Speed, Quality &amp; Care
              </span>
            </h2>

            <motion.p
              style={{ opacity: headerSubOpacity }}
              className="text-[var(--text-secondary)] text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium"
            >
              Built for shoppers who demand excellence. Scroll down to explore our core pillars.
            </motion.p>
          </motion.div>

          {/* Cards Container: 2 Columns flanking the center 3D Lanyard corridor */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-x-28 lg:gap-x-44 md:gap-y-5 mt-6 sm:mt-8 max-w-5xl pointer-events-none">
            {pillars.map((p, idx) => (
              <motion.div
                key={idx}
                style={{
                  opacity: p.opacity,
                  x: p.x,
                  scale: p.scale,
                }}
                className={`skybazz-card p-4 sm:p-6 flex flex-col gap-3 pointer-events-auto cursor-default group transition-shadow duration-300 ${
                  p.side === "left" ? "md:justify-self-end md:w-full md:max-w-md" : "md:justify-self-start md:w-full md:max-w-md"
                }`}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, var(--accent-glow), transparent 70%)` }}
                />

                <div className="flex items-center justify-between">
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    {p.icon}
                  </div>
                  
                  {/* Step Badge */}
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--text-secondary)]/60 bg-[var(--canvas-bg)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {p.step} • {p.side.toUpperCase()}
                  </span>
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Slim Storytelling Progress Indicator Bar at Bottom Center */}
          <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-36 sm:w-48 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
              <motion.div
                style={{ width: scrollBarWidth }}
                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
              />
            </div>
            <span className="text-[9px] font-mono tracking-widest text-[var(--text-secondary)] uppercase">
              Scroll To Reveal Pillars
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
