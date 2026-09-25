"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import React, { useRef, useEffect } from "react";
import { Shield, Plane, Cpu, Award } from "lucide-react";

import { cn } from "@/lib/utils";
import { ImageScatter, type ScatterSet } from "@/components/ui/image-scatter";

export interface PillarCardData {
  id: number | string;
  step: string;
  badge: string;
  icon: React.ReactNode;
  iconBg: string;
  glowColor: string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  status?: string;
}

const defaultPillars: PillarCardData[] = [
  {
    id: 1,
    step: "01",
    badge: "Upcoming Reach",
    icon: <Plane className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#0084ff] to-[#005cdb] shadow-[0_10px_25px_rgba(0,132,255,0.4)]",
    glowColor: "rgba(0,132,255,0.12)",
    title: "Global Logistics Framework",
    description:
      "Developing connected dispatch pathways and routing frameworks designed to streamline product journeys across international regions.",
    stat: "Vision",
    statLabel: "Connected Routes",
    status: "Pre-Release",
  },
  {
    id: 2,
    step: "02",
    badge: "Curation Standard",
    icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#3b5bfd] to-[#1e3bb8] shadow-[0_10px_25px_rgba(59,91,253,0.4)]",
    glowColor: "rgba(59,91,253,0.12)",
    title: "Curated Quality Benchmarks",
    description:
      "Establishing multi-point inspection criteria and seller verification standards to prioritize genuine quality and customer confidence.",
    stat: "Focused",
    statLabel: "Quality Standards",
    status: "In Design",
  },
  {
    id: 3,
    step: "03",
    badge: "Platform Tech",
    icon: <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-[0_10px_25px_rgba(139,92,246,0.4)]",
    glowColor: "rgba(139,92,246,0.12)",
    title: "Intelligent Catalog Discovery",
    description:
      "Exploring AI-assisted search and intuitive categorization models to make browsing and finding items natural and effortless.",
    stat: "Smart",
    statLabel: "Search Architecture",
    status: "Preview",
  },
  {
    id: 4,
    step: "04",
    badge: "Customer Focus",
    icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#a855f7] to-[#7e22ce] shadow-[0_10px_25px_rgba(168,85,247,0.4)]",
    glowColor: "rgba(168,85,247,0.12)",
    title: "Thoughtful User Experience",
    description:
      "Designing responsive support pipelines, clear tracking updates, and transparent buyer safeguards for launch day.",
    stat: "Dedicated",
    statLabel: "Support Pipeline",
    status: "Upcoming",
  },
];

// Curated luxury product images for the dynamic background scatter effect
const defaultScatterData: ScatterSet[] = [
  {
    images: [
      "/products/watch3.png",
      "/products/rangerover.avif",
      "/products/necleas.webp",
      "/products/bag2.jpg",
      "/products/bmw.avif",
      "/products/bangles.webp",
    ],
  },
  {
    images: [
      "/products/paintings.webp",
      "/products/mersadies.avif",
      "/products/rings.webp",
      "/categories/watch.webp",
      "/categories/jwellary.webp",
      "/categories/car.webp",
    ],
  },
  {
    images: [
      "/products/himalayan.jpg",
      "/products/sofas.webp",
      "/products/watch.webp",
      "/categories/wine.jpg",
      "/categories/appliences.jpg",
      "/categories/bags.avif",
    ],
  },
];

interface StickyCard002Props {
  cards?: PillarCardData[];
  scatterData?: ScatterSet[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
}

const StickyCard002 = ({
  cards = defaultPillars,
  scatterData = defaultScatterData,
  className,
  containerClassName,
  cardClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Synchronize Lenis scroll frames directly with GSAP ScrollTrigger
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const header = headerRef.current;
      const cardsWrapper = cardsWrapperRef.current;
      const cardElements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const totalCards = cardElements.length;

      if (!header || !cardsWrapper || !cardElements[0]) return;

      const isMobile = window.innerWidth < 640;
      const yOffset1 = isMobile ? -14 : -20;
      const yOffset2 = isMobile ? -26 : -38;
      const yOffset3 = isMobile ? -38 : -54;
      const initialCardY = isMobile ? 65 : 90;

      // 1. Initial State Setup with force3D for pure GPU acceleration
      gsap.set(header, { autoAlpha: 1, y: 0, scale: 1, force3D: true });
      gsap.set(cardsWrapper, { autoAlpha: 0, y: isMobile ? 35 : 50, scale: 0.96, force3D: true });

      // Card 0 starts active and clearly centered
      gsap.set(cardElements[0], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        zIndex: 10,
        force3D: true,
      });

      // Subsequent cards start hidden slightly offscreen below
      for (let i = 1; i < totalCards; i++) {
        if (!cardElements[i]) continue;
        gsap.set(cardElements[i], {
          autoAlpha: 0,
          y: initialCardY,
          scale: 0.95,
          rotation: 0,
          zIndex: 10 + i,
          force3D: true,
        });
      }

      // Smooth, responsive scrub timeline with mobile-optimized scroll length
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (window.innerWidth < 640 ? 2.5 : 3.2)}`,
          pin: true,
          scrub: 0.8, // Silky smooth response matching wheel/touch motion
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Header smoothly dissolves and rises up
      scrollTimeline.to(
        header,
        {
          autoAlpha: 0,
          y: isMobile ? -35 : -50,
          scale: 0.92,
          duration: 1.0,
          ease: "power2.inOut",
          force3D: true,
        },
        0
      );

      // Cards deck gracefully rises into center frame
      scrollTimeline.to(
        cardsWrapper,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          force3D: true,
        },
        0.15
      );

      // Hold time: allow user to comfortably read Card 1 before next card starts moving
      const holdTime = 0.75;
      const stepDuration = 1.1;
      let currentTime = 1.6;

      // Phase 2: Sequential card stacking with physical deck physics
      for (let nextIndex = 1; nextIndex < totalCards; nextIndex++) {
        const nextCard = cardElements[nextIndex];
        if (!nextCard) continue;

        // Cascade all previous cards into the physical deck
        for (let prevIndex = 0; prevIndex < nextIndex; prevIndex++) {
          const prevCard = cardElements[prevIndex];
          if (!prevCard) continue;

          const depth = nextIndex - prevIndex;

          if (depth === 1) {
            // Card immediately behind active card
            scrollTimeline.to(
              prevCard,
              {
                scale: 0.94,
                y: yOffset1,
                rotation: prevIndex % 2 === 0 ? 1.8 : -1.8,
                autoAlpha: 0.55,
                duration: stepDuration,
                ease: "power2.inOut",
                force3D: true,
              },
              currentTime
            );
          } else if (depth === 2) {
            // Two cards back
            scrollTimeline.to(
              prevCard,
              {
                scale: 0.88,
                y: yOffset2,
                rotation: prevIndex % 2 === 0 ? -1.2 : 1.2,
                autoAlpha: 0.25,
                duration: stepDuration,
                ease: "power2.inOut",
                force3D: true,
              },
              currentTime
            );
          } else {
            // Three or more cards back: fade out cleanly
            scrollTimeline.to(
              prevCard,
              {
                scale: 0.82,
                y: yOffset3,
                autoAlpha: 0,
                duration: stepDuration,
                ease: "power2.inOut",
                force3D: true,
              },
              currentTime
            );
          }
        }

        // Active card glides smoothly into focus
        scrollTimeline.to(
          nextCard,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: stepDuration,
            ease: "power2.out",
            force3D: true,
          },
          currentTime
        );

        // Generous reading hold for newly arrived card
        currentTime += stepDuration + holdTime;
      }

      // Rest hold at the end for the final card
      scrollTimeline.to({}, { duration: 0.8 }, currentTime);

      return () => {
        scrollTimeline.scrollTrigger?.kill();
        scrollTimeline.kill();
      };
    },
    { scope: container }
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div className="sticky-cards relative flex min-h-[100dvh] h-[100dvh] w-full items-center justify-center overflow-hidden px-3 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Image Scatter Atmospheric Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 sm:opacity-80 overflow-hidden">
          <ImageScatter
            data={scatterData}
            showHeading={false}
            cardWidth={240}
            cardHeight={310}
            interval={4500}
            className="w-full h-full"
          />
          {/* Center focus gradient: Keeps foreground reading zone clear while outer photos are crisp */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, var(--canvas-bg) 25%, transparent 70%)",
            }}
          />
        </div>

        {/* Ambient atmospheric glow blobs */}
        <div
          className="absolute top-1/4 right-5 sm:right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full pointer-events-none opacity-20 animate-mesh-drift"
          style={{ background: "radial-gradient(circle, var(--accent-glow, rgba(0,113,227,0.15)) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 left-5 sm:left-10 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] rounded-full pointer-events-none opacity-15 animate-mesh-drift-2"
          style={{ background: "radial-gradient(circle, var(--accent-secondary-glow, rgba(168,85,247,0.15)) 0%, transparent 70%)" }}
        />

        {/* 1. Main Heading — Appears prominently in center when user arrives */}
        <div
          ref={headerRef}
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 xs:px-4 sm:px-6 pointer-events-none z-10"
        >
          <div className="max-w-3xl space-y-3 sm:space-y-6">
            <div className="inline-flex items-center gap-2 sm:gap-2.5">
              <div className="h-px w-5 sm:w-10 bg-[var(--accent-primary)]/70" />
              <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.25em] sm:tracking-[0.45em] uppercase text-[var(--accent-primary)]">
                Platform Preview
              </span>
              <div className="h-px w-5 sm:w-10 bg-[var(--accent-primary)]/70" />
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-[var(--text-primary)]">
              Shaping the Next Chapter of{" "}
              <span className="skybazz-headline-gradient block sm:inline mt-1 sm:mt-0">
                Curated Commerce
              </span>
            </h2>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-medium px-1 sm:px-0">
              Currently in pre-release preparation, SkyBazz is being engineered to connect shoppers with global lifestyle and luxury selections — uniting thoughtful curation, transparent navigation, and streamlined logistics.
            </p>

            <div className="pt-2 sm:pt-4 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-[var(--text-secondary)]/80 uppercase">
              <span>Scroll to explore platform pillars</span>
              <span className="inline-block animate-bounce text-xs sm:text-sm">↓</span>
            </div>
          </div>
        </div>

        {/* 2. Sticky Cards Deck — Glides up into center when header fades */}
        <div
          ref={cardsWrapperRef}
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
          className={cn(
            "relative z-20 w-full max-w-[340px] xs:max-w-[380px] sm:max-w-lg md:max-w-xl lg:max-w-2xl h-[340px] xs:h-[360px] sm:h-[390px] md:h-[420px]",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                willChange: "transform, opacity",
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
                zIndex: 10 + i,
              }}
              className={cn(
                "absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[36px] p-5 xs:p-6 sm:p-9 md:p-11 flex flex-col justify-between select-none overflow-hidden",
                "bg-white/98 text-slate-900 border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),0_10px_25px_-5px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.8)_inset]",
                cardClassName
              )}
            >
              {/* Subtle accent glow matching pillar color */}
              <div
                className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full pointer-events-none opacity-25 blur-3xl -z-10"
                style={{ background: card.glowColor }}
              />

              {/* Top Row: Icon Box + Badge & Step Number */}
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl shadow-md",
                    card.iconBg
                  )}
                >
                  {card.icon}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide bg-slate-100/90 text-slate-700 border border-slate-200/80 shadow-xs">
                    {card.badge}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-200/50">
                    {card.step}
                  </span>
                </div>
              </div>

              {/* Center: Title & Description */}
              <div className="space-y-2 sm:space-y-3.5 my-auto">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl line-clamp-3 sm:line-clamp-none">
                  {card.description}
                </p>
              </div>

              {/* Bottom: Concept Stat & Status Pill */}
              {(card.stat || card.status) && (
                <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-base xs:text-lg sm:text-2xl font-mono font-extrabold text-slate-900">
                      {card.stat}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      {card.statLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-slate-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>{card.status || "Pre-Release"}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Smooth Lenis scroll options
const lenisOptions = {
  lerp: 0.08,
  duration: 1.1,
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
};

// Skiper17 component with Lenis
const Skiper17 = () => {
  return (
    <ReactLenis root options={lenisOptions}>
      <div className="h-full w-full">
        <StickyCard002 cards={defaultPillars} />
      </div>
    </ReactLenis>
  );
};

// Default export AboutCompany renders the sticky card section with smooth scrolling & scatter background
export default function AboutCompany() {
  return (
    <ReactLenis root options={lenisOptions}>
      <section id="about-section" className="relative w-full bg-[var(--canvas-bg)] text-[var(--text-primary)] overflow-hidden">
        {/* Top section divider */}
        <div className="absolute top-0 inset-x-0 h-px section-divider z-30" />

        <StickyCard002 cards={defaultPillars} scatterData={defaultScatterData} />

        {/* Bottom section divider */}
        <div className="absolute bottom-0 inset-x-0 h-px section-divider z-30" />
      </section>
    </ReactLenis>
  );
}

export { AboutCompany, Skiper17, StickyCard002 };
