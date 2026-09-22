"use client";

import React, { useEffect, useMemo, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface InfiniteSpiralItem {
  id?: string | number;
  src: string;
  alt?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  label?: string;
}

export interface InfiniteSpiralProps {
  items?: Array<string | InfiniteSpiralItem>;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  animationMode?: "auto" | "drag" | "scroll" | "all";
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  spacing?: number;
  verticalSpacing?: number;
  horizontalSpacing?: number;
  perspective?: number;
  cardsPerTurn?: number;
  rotation?: number;
  cardTilt?: number;
  cardRadius?: number;
  centerScale?: number;
  edgeFade?: number;
  edgeBlur?: number;
  pauseOnHover?: boolean;
  imageFit?: CSSProperties["objectFit"];
  grayscale?: number;
  className?: string;
}

type NormalizedItem = InfiniteSpiralItem & { alt: string };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

export const BASE_CATEGORY_ITEMS: InfiniteSpiralItem[] = [
  {
    id: "luxury-watches",
    src: "/categories/watch.webp",
    alt: "Luxury Watches",
    label: "Luxury Watches",
    href: "/waitlist",
  },
  {
    id: "supercars-automotive",
    src: "/categories/car.webp",
    alt: "Supercars & Exotics",
    label: "Supercars & Exotics",
    href: "/waitlist",
  },
  {
    id: "fine-jewelry",
    src: "/categories/jwellary.webp",
    alt: "High Jewelry",
    label: "High Jewelry",
    href: "/waitlist",
  },
  {
    id: "designer-bags",
    src: "/categories/bags.avif",
    alt: "Designer Handbags",
    label: "Designer Handbags",
    href: "/waitlist",
  },
  {
    id: "fine-wine",
    src: "/categories/wine.jpg",
    alt: "Fine Wine & Spirits",
    label: "Fine Wine & Spirits",
    href: "/waitlist",
  },
  {
    id: "smart-appliances",
    src: "/categories/appliences.jpg",
    alt: "Smart Home Appliances",
    label: "Smart Appliances",
    href: "/waitlist",
  },
];

// Replicate 3 cycles to make the 3D spiral continuous and full
export const DEFAULT_SPIRAL_ITEMS: InfiniteSpiralItem[] = [
  ...BASE_CATEGORY_ITEMS.map((item) => ({ ...item, id: `${item.id}-1` })),
  ...BASE_CATEGORY_ITEMS.map((item) => ({ ...item, id: `${item.id}-2` })),
  ...BASE_CATEGORY_ITEMS.map((item) => ({ ...item, id: `${item.id}-3` })),
];

export const InfiniteSpiral = ({
  items = DEFAULT_SPIRAL_ITEMS,
  speed = 0.45,
  direction = "left",
  animationMode = "all",
  radius = 70,
  cardWidth = 175,
  cardHeight = 235,
  spacing,
  verticalSpacing = 60,
  horizontalSpacing = 240,
  perspective = 1100,
  cardsPerTurn = 6,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 16,
  centerScale = 1.25,
  edgeFade = 0.32,
  edgeBlur = 4,
  pauseOnHover = true,
  imageFit = "cover",
  grayscale = 0,
  className = "",
}: InfiniteSpiralProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | HTMLDivElement | null>>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerCoordRef = useRef(0);
  const dragMovedRef = useRef(false);

  const isHorizontal = direction === "left" || direction === "right";
  const effectiveSpacing = spacing ?? (isHorizontal ? horizontalSpacing : verticalSpacing);

  const normalizedItems = useMemo<NormalizedItem[]>(
    () =>
      items.map((item, index) =>
        typeof item === "string"
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : { alt: `Spiral image ${index + 1}`, ...item }
      ),
    [items]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId = 0;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollEnabled = animationMode === "scroll" || animationMode === "all";
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;
    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    intersectionObserver.observe(root);

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return;
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(effectiveSpacing * 2, 1),
        -1.5,
        1.5
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const render = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const autoEnabled = animationMode === "auto" || animationMode === "all";
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === "down" || direction === "right" ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = isHorizontal
        ? Math.min(1, Math.max(0.68, width / 960), Math.max(0.68, height / (cardHeight * 2.1)))
        : Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = (isHorizontal ? radius : Math.min(radius, Math.max(72, width * 0.36))) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const offset = modulo(index - progressRef.current + half, count) - half;
        const absOffset = Math.abs(offset);
        const edge = Math.min(absOffset / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(absOffset / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;

        let posX = 0;
        let posY = 0;
        let posZ = 0;

        if (isHorizontal) {
          // Horizontal flow (Right to Left): progression on X-axis, spiral orbit in Y-Z plane
          posX = offset * effectiveSpacing * fit;
          posY = Math.sin(angleRadians) * responsiveRadius;
          posZ = Math.cos(angleRadians) * responsiveRadius;
        } else {
          // Vertical flow (Bottom to Top): progression on Y-axis, spiral orbit in X-Z plane
          posX = Math.sin(angleRadians) * responsiveRadius;
          posY = offset * effectiveSpacing * fit;
          posZ = Math.cos(angleRadians) * responsiveRadius;
        }

        const depthScale = clamp(perspective / Math.max(perspective - posZ, 1), 0.75, 1.4);
        const visualScale = scale * depthScale;

        // Image clarity at the center: strictly 0 blur when card is in the central region
        const blur = absOffset < 0.95 ? 0 : edgeBlur * smoothstep(0.38, 1, edge);

        // Center card gets top stacking priority so nothing overlaps it
        const centerPriority = Math.round((1 - Math.min(absOffset / half, 1)) * 100000);

        card.style.transform = `translate(-50%, -50%) translate3d(${posX}px, ${posY}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(centerPriority);
        card.style.pointerEvents = opacity > 0.25 ? "auto" : "none";
      });
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    effectiveSpacing,
    isHorizontal,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
  ]);

  const rootStyle = {
    perspective: `${perspective}px`,
    "--spiral-width": `${cardWidth}px`,
    "--spiral-height": `${cardHeight}px`,
    "--spiral-radius": `${cardRadius}px`,
    cursor: animationMode === "drag" || animationMode === "all" ? "grab" : "default",
    touchAction: isHorizontal ? "pan-y" : "pan-x",
    userSelect: animationMode === "drag" || animationMode === "all" ? "none" : "auto",
  } as CSSProperties;

  const dragEnabled = animationMode === "drag" || animationMode === "all";

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = dragEnabled ? "grab" : "default";
  };

  const setCardRef = (index: number) => (node: HTMLAnchorElement | HTMLDivElement | null) => {
    cardRefs.current[index] = node;
  };

  const cardStyle: CSSProperties = { width: cardWidth, height: cardHeight, borderRadius: cardRadius };
  const imageStyle: CSSProperties = {
    width: cardWidth,
    height: cardHeight,
    maxWidth: "none",
    maxHeight: "none",
    objectFit: imageFit,
    filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`,
  };

  const itemClassName =
    "absolute left-1/2 top-1/2 block h-[var(--spiral-height)] w-[var(--spiral-width)] overflow-hidden rounded-[var(--spiral-radius)] border border-white/20 bg-neutral-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.9)] hover:border-white/40 motion-reduce:transition-none";

  return (
    <div
      ref={rootRef}
      className={`relative isolate h-full min-h-80 w-full overflow-hidden select-none ${className}`}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerCoordRef.current = isHorizontal ? event.clientX : event.clientY;
        targetProgressRef.current = progressRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return;
        const currentCoord = isHorizontal ? event.clientX : event.clientY;
        const pointerDelta = currentCoord - lastPointerCoordRef.current;
        lastPointerCoordRef.current = currentCoord;
        if (Math.abs(pointerDelta) > 0.5) dragMovedRef.current = true;
        targetProgressRef.current -= pointerDelta / Math.max(effectiveSpacing, 1);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          const content = (
            <div className="relative w-full h-full group overflow-hidden rounded-[var(--spiral-radius)]">
              <img
                className="absolute inset-0 block h-full w-full select-none object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
                src={item.src}
                alt={item.alt}
                loading="eager"
                decoding="async"
                draggable={false}
                style={imageStyle}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3.5 pointer-events-none">
                {item.label && (
                  <span className="text-xs font-bold text-white tracking-wide uppercase drop-shadow-md">
                    {item.label}
                  </span>
                )}
                <span className="text-[10px] text-white/70 tracking-wider font-medium">Explore Collection →</span>
              </div>
            </div>
          );

          return item.href ? (
            <a
              key={item.id ?? `${item.src}-${index}`}
              ref={setCardRef(index)}
              className={itemClassName}
              style={cardStyle}
              href={item.href}
              target={item.target}
              rel={item.target === "_blank" ? "noreferrer" : undefined}
              role="listitem"
              aria-label={item.label ?? item.alt}
            >
              {content}
            </a>
          ) : (
            <div
              key={item.id ?? `${item.src}-${index}`}
              ref={setCardRef(index)}
              className={itemClassName}
              style={cardStyle}
              role="listitem"
              aria-label={item.label ?? item.alt}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CategoryDisplay(props: InfiniteSpiralProps) {
  return (
    <section
      id="categories-section"
      className="relative w-full flex flex-col justify-center py-16 md:py-24 bg-[var(--canvas-bg)] text-[var(--text-primary)] overflow-hidden transition-colors duration-400"
    >
      {/* Light ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, var(--accent-glow) 0%, transparent 65%)" }}
      />

      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 px-4 sm:px-6 md:px-12 lg:px-16 flex flex-row items-center justify-between gap-3 relative z-10"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[var(--accent-primary)]/60" />
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.4em] uppercase text-[var(--accent-primary)]">
              Curated Collections
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
            Categories
          </h2>
        </div>

        <Link
          href="/waitlist"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-white transition-all duration-300 shadow-sm group cursor-pointer shrink-0"
          aria-label="View All Categories"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      {/* 3D Infinite Spiral Showcase (Right to Left with increased gap and crystal-clear center) */}
      <div className="w-full h-[480px] sm:h-[540px] md:h-[600px] relative px-2 sm:px-6">
        <InfiniteSpiral
          direction="left"
          cardWidth={175}
          cardHeight={235}
          radius={70}
          horizontalSpacing={240}
          animationMode="all"
          pauseOnHover={true}
          speed={0.45}
          cardsPerTurn={6}
          centerScale={1.25}
          edgeBlur={4}
          {...props}
        />
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px section-divider" />
    </section>
  );
}
