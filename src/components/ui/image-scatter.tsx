"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScatterSet {
  heading?: string;
  images: string[];
}

export interface ImageScatterProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ScatterSet[];
  cardWidth?: number;
  cardHeight?: number;
  animationDuration?: number;
  animationOverlap?: number;
  headingFadeDuration?: number;
  scroller?: string | Element | null;
  showHeading?: boolean;
  interval?: number;
}

export function ImageScatter({
  data,
  cardWidth = 240,
  cardHeight = 310,
  animationDuration = 0.85,
  animationOverlap = 0.5,
  headingFadeDuration = 0.5,
  scroller,
  showHeading = false,
  interval = 4000,
  className,
  ...props
}: ImageScatterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !galleryRef.current || data.length === 0) return;

    const gallery = galleryRef.current;
    const galleryHeading = headingRef.current;

    let viewport = {
      centerX: containerRef.current.clientWidth / 2,
      centerY: containerRef.current.clientHeight / 2,
      rangeMin: Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight) * 0.44,
      rangeMax: Math.max(containerRef.current.clientWidth, containerRef.current.clientHeight) * 0.85,
    };

    let state = {
      activeCards: [] as { element: HTMLDivElement; centerX: number; centerY: number }[],
      currentSection: 0,
      isAnimating: false,
    };

    function updateViewport() {
      if (!containerRef.current) return;
      viewport.centerX = containerRef.current.clientWidth / 2;
      viewport.centerY = containerRef.current.clientHeight / 2;
      viewport.rangeMin = Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight) * 0.44;
      viewport.rangeMax = Math.max(containerRef.current.clientWidth, containerRef.current.clientHeight) * 0.85;
    }

    function getEdgePosition(centerX: number, centerY: number) {
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight;

      const distances = {
        left: centerX,
        right: containerWidth - centerX,
        top: centerY,
        bottom: containerHeight - centerY,
      };

      const minDistance = Math.min(...Object.values(distances));
      const cardCenterOffsetX = cardWidth / 2;
      const cardCenterOffsetY = cardHeight / 2;
      const offsetVariation = () => (Math.random() - 0.5) * 400;

      if (minDistance === distances.left) {
        return {
          x: -cardWidth - 100 - Math.random() * 200,
          y: centerY - cardCenterOffsetY + offsetVariation(),
        };
      }
      if (minDistance === distances.right) {
        return {
          x: containerWidth + 50 + Math.random() * 200,
          y: centerY - cardCenterOffsetY + offsetVariation(),
        };
      }
      if (minDistance === distances.top) {
        return {
          x: centerX - cardCenterOffsetX + offsetVariation(),
          y: -cardHeight - 100 - Math.random() * 200,
        };
      }

      return {
        x: centerX - cardCenterOffsetX + offsetVariation(),
        y: containerHeight + 50 + Math.random() * 200,
      };
    }

    function createCards(sectionIndex: number) {
      const cards: { element: HTMLDivElement; centerX: number; centerY: number }[] = [];
      const sectionData = data[sectionIndex];

      if (!sectionData || !sectionData.images.length) return cards;

      sectionData.images.forEach((src) => {
        const card = document.createElement("div");
        card.className =
          "absolute rounded-2xl border-4 border-white shadow-[0_25px_50px_rgba(0,0,0,0.3)] overflow-hidden will-change-transform bg-white pointer-events-none";
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;

        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        img.className = "w-full h-full object-cover rounded-xl pointer-events-none";
        card.appendChild(img);

        const angle = Math.random() * Math.PI * 2;
        const radius = viewport.rangeMin + Math.random() * (viewport.rangeMax - viewport.rangeMin);
        const centerX = viewport.centerX + Math.cos(angle) * radius;
        const centerY = viewport.centerY + Math.sin(angle) * radius;

        gsap.set(card, {
          left: centerX - cardWidth / 2,
          top: centerY - cardHeight / 2,
          rotation: Math.random() * 40 - 20,
          opacity: 1,
        });

        gallery.appendChild(card);
        cards.push({ element: card, centerX, centerY });
      });

      return cards;
    }

    function animateHeading(newText: string) {
      if (!showHeading || !galleryHeading) return gsap.timeline();
      return gsap
        .timeline()
        .to(galleryHeading, {
          opacity: 0,
          duration: headingFadeDuration,
          ease: "power2.inOut",
        })
        .call(() => {
          galleryHeading.textContent = newText;
        })
        .to(galleryHeading, {
          opacity: 1,
          duration: headingFadeDuration,
          ease: "power2.inOut",
        });
    }

    function animateCards(
      exitingCards: { element: HTMLDivElement; centerX: number; centerY: number }[],
      enteringCards: { element: HTMLDivElement; centerX: number; centerY: number }[]
    ) {
      const tl = gsap.timeline();

      exitingCards.forEach(({ element, centerX, centerY }) => {
        const targetEdge = getEdgePosition(centerX, centerY);
        tl.to(
          element,
          {
            left: targetEdge.x,
            top: targetEdge.y,
            rotation: Math.random() * 140 - 70,
            opacity: 0,
            duration: animationDuration,
            ease: "power2.in",
            onComplete: () => element.remove(),
          },
          0
        );
      });

      enteringCards.forEach(({ element, centerX, centerY }) => {
        const targetEdge = getEdgePosition(centerX, centerY);
        gsap.set(element, {
          left: targetEdge.x,
          top: targetEdge.y,
          rotation: Math.random() * 140 - 70,
          opacity: 0,
        });

        tl.to(
          element,
          {
            left: centerX - cardWidth / 2,
            top: centerY - cardHeight / 2,
            rotation: Math.random() * 40 - 20,
            opacity: 1,
            duration: animationDuration,
            ease: "power2.out",
          },
          animationOverlap
        );
      });

      return tl;
    }

    function reinitialize() {
      state.activeCards.forEach(({ element }) => element.remove());
      updateViewport();
      state.activeCards = createCards(state.currentSection);
    }

    // Initialize first section
    state.activeCards = createCards(0);
    if (showHeading && galleryHeading) {
      galleryHeading.textContent = data[0]?.heading || "";
      gsap.set(galleryHeading, { opacity: 1 });
    }

    let intervalId: NodeJS.Timeout;

    function nextSection() {
      if (state.isAnimating) return;

      const targetSection = (state.currentSection + 1) % data.length;

      state.isAnimating = true;
      const newCards = createCards(targetSection);

      Promise.all([
        animateCards(state.activeCards, newCards).then(),
        animateHeading(data[targetSection]?.heading || "").then(),
      ]).then(() => {
        state.activeCards = newCards;
        state.currentSection = targetSection;
        state.isAnimating = false;
      });
    }

    intervalId = setInterval(nextSection, interval);

    const handleResize = () => {
      reinitialize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
      state.activeCards.forEach(({ element }) => element.remove());
    };
  }, [data, cardWidth, cardHeight, animationDuration, animationOverlap, headingFadeDuration, showHeading, interval]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full flex justify-center items-center overflow-hidden bg-transparent", className)}
      {...props}
    >
      <div ref={galleryRef} className="absolute inset-0 pointer-events-none" />
      {showHeading && (
        <h1
          ref={headingRef}
          className="w-[90%] md:w-[45%] text-center text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-tight tracking-tight z-10 will-change-[opacity] text-neutral-900 dark:text-white pointer-events-none"
        />
      )}
    </div>
  );
}

export default ImageScatter;
