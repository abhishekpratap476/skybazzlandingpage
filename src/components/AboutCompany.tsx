"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
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
}

const defaultPillars: PillarCardData[] = [
  {
    id: 1,
    step: "01",
    badge: "Priority Corridor",
    icon: <Plane className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#0084ff] to-[#005cdb] shadow-[0_10px_25px_rgba(0,132,255,0.4)]",
    glowColor: "rgba(0,132,255,0.12)",
    title: "Worldwide Express Delivery",
    description:
      "Direct priority flight corridors linking international hubs to deliver your order swiftly to your doorstep.",
    stat: "190+",
    statLabel: "Global Destinations",
  },
  {
    id: 2,
    step: "02",
    badge: "100% Verified",
    icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#3b5bfd] to-[#1e3bb8] shadow-[0_10px_25px_rgba(59,91,253,0.4)]",
    glowColor: "rgba(59,91,253,0.12)",
    title: "Strict Quality & Authenticity",
    description:
      "100% genuine quality inspection protocol verifying every product before dispatch for total satisfaction.",
    stat: "99.8%",
    statLabel: "Inspection Pass Rate",
  },
  {
    id: 3,
    step: "03",
    badge: "Neural Catalog",
    icon: <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-[0_10px_25px_rgba(139,92,246,0.4)]",
    glowColor: "rgba(139,92,246,0.12)",
    title: "AI-Powered Smart Search",
    description:
      "Intelligent catalog search engine helping you instantly discover top products, categories, and recommendations.",
    stat: "< 50ms",
    statLabel: "Semantic Matching",
  },
  {
    id: 4,
    step: "04",
    badge: "Peace of Mind",
    icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />,
    iconBg: "bg-gradient-to-br from-[#a855f7] to-[#7e22ce] shadow-[0_10px_25px_rgba(168,85,247,0.4)]",
    glowColor: "rgba(168,85,247,0.12)",
    title: "Buyer Protection & Live Assistance",
    description:
      "Complete peace of mind with order protection, money-back guarantees, and 24/7 live customer assistance.",
    stat: "24/7",
    statLabel: "Human Concierge",
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

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const header = headerRef.current;
      const cardsWrapper = cardsWrapperRef.current;
      const cardElements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const totalCards = cardElements.length;

      if (!header || !cardsWrapper || !cardElements[0]) return;

      // 1. Initial State Setup with force3D for GPU acceleration
      gsap.set(header, { opacity: 1, y: 0, scale: 1, force3D: true });
      gsap.set(cardsWrapper, { y: "75vh", opacity: 0, scale: 0.94, force3D: true });
      
      // Card 0 starts in place and visible
      gsap.set(cardElements[0], {
        y: "0%",
        scale: 1,
        rotation: 0,
        opacity: 1,
        visibility: "visible",
        force3D: true,
      });

      // All upcoming cards are completely hidden offscreen and invisible to prevent bottom peeking
      for (let i = 1; i < totalCards; i++) {
        if (!cardElements[i]) continue;
        gsap.set(cardElements[i], {
          y: "100vh",
          scale: 0.95,
          rotation: 0,
          opacity: 0,
          visibility: "hidden",
          force3D: true,
        });
      }

      // Slower, more deliberate scroll distance (~7.2 viewports)
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${window.innerHeight * (totalCards * 1.8)}`,
          pin: true,
          scrub: 1.4, // Silky inertial smoothing
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Header gently dissolves and floats up
      scrollTimeline.to(
        header,
        {
          opacity: 0,
          y: -60,
          scale: 0.94,
          duration: 1.2,
          ease: "power2.inOut",
          force3D: true,
        },
        0
      );

      // Cards container gracefully glides into center frame
      scrollTimeline.to(
        cardsWrapper,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          force3D: true,
        },
        0.1
      );

      // Hold time: allow user to comfortably read Card 1 before next card starts moving
      const holdTime = 0.8;
      const stepDuration = 1.3;
      let currentTime = 1.5 + holdTime;

      // Phase 2: Sequential card stacking with physical deck physics
      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        if (!currentCard || !nextCard) continue;

        // Make next card visible right as its slide-in starts
        scrollTimeline.set(nextCard, { visibility: "visible" }, currentTime);

        // Current card scales back and rotates slightly into the deck stack
        scrollTimeline.to(
          currentCard,
          {
            scale: 0.92,
            y: -16,
            rotation: i % 2 === 0 ? 2.5 : -2.5,
            opacity: 0.45,
            duration: stepDuration,
            ease: "power2.inOut",
            force3D: true,
          },
          currentTime
        );

        // Next card smoothly slides up from offscreen with opacity fade-in
        scrollTimeline.fromTo(
          nextCard,
          {
            y: "60vh",
            opacity: 0,
            scale: 0.96,
          },
          {
            y: "0%",
            opacity: 1,
            scale: 1,
            duration: stepDuration,
            ease: "power2.out",
            force3D: true,
          },
          currentTime
        );

        // Generous reading hold for the newly arrived card before starting the next
        currentTime += stepDuration + holdTime;
      }

      // Rest hold at the end for Card 4 before unpinning
      scrollTimeline.to({}, { duration: 1.0 }, currentTime);

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Image Scatter Atmospheric Background — Clear and Large Photos */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-90 dark:opacity-80 overflow-hidden">
          <ImageScatter
            data={scatterData}
            showHeading={false}
            cardWidth={240}
            cardHeight={310}
            interval={4200}
            className="w-full h-full"
          />
          {/* Gentle center focus gradient: Keeps foreground reading zone clear while outer photos are crisp */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, var(--canvas-bg) 15%, transparent 65%)",
            }}
          />
        </div>

        {/* Ambient atmospheric glow blobs */}
        <div
          className="absolute top-1/4 right-10 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 animate-mesh-drift"
          style={{ background: "radial-gradient(circle, var(--accent-glow, rgba(0,113,227,0.15)) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 left-10 w-[450px] h-[450px] rounded-full pointer-events-none opacity-15 animate-mesh-drift-2"
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
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none z-10"
        >
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2.5">
              <div className="h-px w-6 sm:w-10 bg-[var(--accent-primary)]/70" />
              <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.35em] sm:tracking-[0.45em] uppercase text-[var(--accent-primary)]">
                About SkyBazz
              </span>
              <div className="h-px w-6 sm:w-10 bg-[var(--accent-primary)]/70" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] text-[var(--text-primary)]">
              Redefining Online Shopping With{" "}
              <span className="skybazz-headline-gradient block sm:inline mt-1 sm:mt-0">
                Speed, Quality &amp; Care
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-medium">
              Built for shoppers who demand excellence, SkyBazz connects you with curated electronics, luxury items, and global lifestyle products — combining quality checks, transparent pricing, and fast doorstep delivery.
            </p>

            <div className="pt-4 flex items-center justify-center gap-2 text-[11px] font-mono tracking-widest text-[var(--text-secondary)]/80 uppercase">
              <span>Scroll to unveil our pillars</span>
              <span className="inline-block animate-bounce text-sm">↓</span>
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
            "relative z-20 w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl h-[380px] sm:h-[400px] md:h-[430px]",
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
              }}
              className={cn(
                "absolute inset-0 w-full h-full rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-11 flex flex-col justify-between select-none shadow-[0_25px_60px_-12px_rgba(0,0,0,0.18)]",
                // Pure crisp white card background
                "bg-white text-slate-900 border border-slate-200/90",
                cardClassName
              )}
            >
              {/* Subtle accent glow matching pillar color */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-30 blur-3xl -z-10"
                style={{ background: card.glowColor }}
              />

              {/* Top Row: Icon Box */}
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-13 w-13 sm:h-16 sm:w-16 items-center justify-center rounded-2xl shadow-md",
                    card.iconBg
                  )}
                >
                  {card.icon}
                </div>
              </div>

              {/* Center: Title & Description */}
              <div className="space-y-2.5 sm:space-y-3.5 my-auto">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                  {card.description}
                </p>
              </div>

              {/* Bottom: Stat */}
              {card.stat && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-mono font-extrabold text-slate-900">
                      {card.stat}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      {card.statLabel}
                    </span>
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

// Skiper17 component with Lenis
const Skiper17 = () => {
  return (
    <ReactLenis root options={{ lerp: 0.06, duration: 1.4, smoothWheel: true }}>
      <div className="h-full w-full">
        <StickyCard002 cards={defaultPillars} />
      </div>
    </ReactLenis>
  );
};

// Default export AboutCompany renders the sticky card section with smooth scrolling & scatter background
export default function AboutCompany() {
  return (
    <ReactLenis root options={{ lerp: 0.06, duration: 1.4, smoothWheel: true }}>
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
