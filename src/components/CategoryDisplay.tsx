"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Masonry, { MasonryItem } from "@/components/Masonry";

export interface SourcingCategoryItem extends MasonryItem {
  id: string;
  name: string;
  subtitle: string;
  img: string;
  url: string;
  height: number;
  itemCount?: number;
  tag?: string;
}

const CATEGORIES: SourcingCategoryItem[] = [
  {
    id: "luxury-watches",
    name: "Luxury Watches",
    subtitle: "Haute Horlogerie, Swiss Movements & Collector Timepieces",
    img: "/categories/watch.webp",
    url: "/waitlist",
    height: 620,
    tag: "Timepieces",
    itemCount: 48,
  },
  {
    id: "supercars-automotive",
    name: "Supercars & Exotics",
    subtitle: "High-Performance Engineering, Rare Hypercars & Track Icons",
    img: "/categories/car.webp",
    url: "/waitlist",
    height: 520,
    tag: "Automotive",
    itemCount: 24,
  },
  {
    id: "fine-jewelry",
    name: "High Jewelry",
    subtitle: "Diamonds, Precious Gemstones & Artisanal Gold Adornments",
    img: "/categories/jwellary.webp",
    url: "/waitlist",
    height: 640,
    tag: "Fine Jewelry",
    itemCount: 36,
  },
  {
    id: "designer-bags",
    name: "Designer Handbags",
    subtitle: "Haute Couture Leathercraft, Iconic Totes & Travel Trunks",
    img: "/categories/bags.avif",
    url: "/waitlist",
    height: 540,
    tag: "Leather Goods",
    itemCount: 52,
  },
  {
    id: "fine-wine",
    name: "Fine Wine & Spirits",
    subtitle: "Grand Cru Vintages, Rare Cellar Reserves & Single Malts",
    img: "/categories/wine.jpg",
    url: "/waitlist",
    height: 580,
    tag: "Cellar Reserve",
    itemCount: 30,
  },
  {
    id: "smart-appliances",
    name: "Smart Home Appliances",
    subtitle: "Next-Gen Culinary Suites, Smart Living & Precision Home Tech",
    img: "/categories/appliences.jpg",
    url: "/waitlist",
    height: 520,
    tag: "Smart Living",
    itemCount: 45,
  },
];

export default function CategoryDisplay() {
  const router = useRouter();
  const [items] = useState<SourcingCategoryItem[]>(CATEGORIES);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsInView(true); }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories-section"
      className="relative w-full flex flex-col justify-center py-16 md:py-24 bg-[#f5f5f7] overflow-hidden"
    >
      {/* Light ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(0,113,227,0.15) 0%, transparent 65%)" }} />

      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 px-4 sm:px-6 md:px-12 lg:px-16 flex flex-row items-center justify-between gap-3"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#0071e3]/60" />
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.4em] uppercase text-[#0071e3]">
              Curated Collections
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1d1d1f] uppercase">
            Categories
          </h2>
        </div>

        <Link
          href="/waitlist"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-[#0071e3] hover:border-[#0071e3] text-slate-600 hover:text-white transition-all duration-300 shadow-sm group cursor-pointer shrink-0"
          aria-label="View All Categories"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      {/* Masonry grid */}
      <div className="w-full px-2 sm:px-6 md:px-12 lg:px-16">
        <Masonry
          items={items}
          triggerAnimation={isInView}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.97}
          blurToFocus={true}
          colorShiftOnHover={false}
          onItemClick={(_item: MasonryItem) => router.push("/waitlist")}
          renderOverlay={(item: any) => (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10 flex flex-col justify-end pointer-events-none">
                {item.tag && (
                  <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] text-blue-400 mb-1 block truncate">
                    {item.tag}
                  </span>
                )}
                {/* <h3 className="text-xs sm:text-base md:text-lg font-extrabold text-white uppercase tracking-wider line-clamp-1">
                  {item.name}
                </h3>
                {item.subtitle && (
                  <p className="hidden sm:block text-[11px] sm:text-xs text-white/75 line-clamp-2 font-medium mt-1 leading-snug">
                    {item.subtitle}
                  </p>
                )} */}
              </div>
              <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10">
                <div className="p-1.5 sm:p-2 rounded-xl bg-black/50 backdrop-blur-md text-white group-hover:bg-blue-600 transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </>
          )}
        />
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px section-divider" />
    </section>
  );
}
