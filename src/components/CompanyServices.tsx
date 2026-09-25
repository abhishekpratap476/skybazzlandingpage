"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Plane, ShieldCheck, CreditCard, Headphones, ShoppingBag, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function CompanyServices() {
  const services = [
    {
      id: "01",
      badge: "AI DISCOVERY",
      icon: <Search className="w-5 h-5" />,
      title: "Curated Product Discovery",
      subtitle: "Smart Search & Intuitive Catalog",
      description: "Exploring intuitive browsing pathways across lifestyle, electronics, and specialty goods with smart catalog categorization.",
      highlights: ["Curated Product Selections", "Intelligent Search Models", "Category Exploration"],
      color: "from-blue-600 to-cyan-500",
      glow: "var(--accent-glow)",
    },
    {
      id: "02",
      badge: "QUALITY BENCHMARK",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-300" />,
      title: "Quality & Sourcing Standards",
      description: "Developing multi-point review criteria and seller verification standards to prioritize genuine quality and customer confidence.",
      highlights: ["Multi-Point Review Criteria", "Seller Verification Framework", "Secure Packaging Guidelines"],
      color: "from-emerald-600 to-teal-500",
      glow: "rgba(16, 185, 129, 0.25)",
    },
    {
      id: "03",
      badge: "LOGISTICS NETWORK",
      icon: <Plane className="w-5 h-5" />,
      title: "Global Logistics Framework",
      description: "Structuring international transit routes designed to connect cross-border hubs with dependable last-mile delivery.",
      highlights: ["Connected Air Corridors", "End-to-End Tracking Blueprint", "International Delivery Routes"],
      color: "from-sky-600 to-blue-500",
      glow: "var(--accent-secondary-glow)",
    },
    {
      id: "04",
      badge: "CHECKOUT SECURITY",
      icon: <CreditCard className="w-5 h-5" />,
      title: "Protected Payment Architecture",
      description: "Integrating industry-standard encrypted transaction protocols with versatile payment options and clear pricing.",
      highlights: ["Industry-Standard Encryption", "Flexible Payment Gateways", "Transparent Fee Structure"],
      color: "from-indigo-600 to-blue-600",
      glow: "var(--accent-glow)",
    },
    {
      id: "05",
      badge: "CLIENT SUPPORT",
      icon: <Headphones className="w-5 h-5" />,
      title: "Dedicated Support Channels",
      description: "Building responsive customer guidance systems to help shoppers with inquiries, order navigation, and product details.",
      highlights: ["Multichannel Assistance", "Clear Guidance & FAQs", "Dedicated Support Desk"],
      color: "from-cyan-600 to-blue-600",
      glow: "var(--accent-secondary-glow)",
    },
    {
      id: "06",
      badge: "BUYER ASSURANCE",
      icon: <ShoppingBag className="w-5 h-5" />,
      title: "Buyer Assurance Framework",
      description: "Establishing clear buyer safeguards, dispute resolution guidelines, and order verification for a trustworthy experience.",
      highlights: ["Transparent Order Guidelines", "Buyer Protection Protocols", "Verified Transaction Flow"],
      color: "from-purple-600 to-indigo-600",
      glow: "rgba(168,85,247,0.2)",
    },
  ];

  return (
    <section
      id="services-section"
      className="relative w-full py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-[var(--canvas-bg)] text-[var(--text-primary)] overflow-hidden transition-colors duration-400"
    >
      {/* Light ambient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 animate-mesh-drift"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 animate-mesh-drift-2"
        style={{ background: "radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 65%)" }} />

      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-10 sm:space-y-16 md:space-y-20">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
            className="space-y-3 sm:space-y-4 max-w-2xl"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-px w-6 sm:w-8 bg-[var(--accent-primary)]/60" />
              <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[var(--accent-primary)]">
                Platform Blueprint
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12] text-[var(--text-primary)]">
              Designed for Tomorrow&apos;s{" "}
              <span className="skybazz-headline-gradient">
                Global Commerce
              </span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[var(--text-secondary)] text-xs sm:text-sm max-w-md leading-relaxed font-medium"
          >
            Currently in pre-release preparation, SkyBazz is developing an interconnected shopping experience focused on quality standards, smart navigation, and reliable global fulfillment.
          </motion.p>
        </div>

        {/* Services bento grid with elevated cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16,1,0.3,1] }}
              whileHover={{ y: -6 }}
              className="skybazz-card p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 cursor-default group"
            >
              {/* Hover radial glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 10% 10%, ${service.glow}, transparent 65%)` }}
              />

              {/* Top row: icon + badge pill + number */}
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                
                <span className="skybazz-pill text-[9px] sm:text-[10px] py-1 px-2.5">
                  {service.badge}
                </span>

                <span className="font-mono text-[10px] sm:text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {service.id}
                </span>
              </div>

              {/* Text */}
              <div className="space-y-2 flex-1">
                <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                  {service.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 pt-3 border-t border-[var(--border-subtle)]">
                {service.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-[var(--text-secondary)]">
                    <Check className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          className="skybazz-card p-7 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border-[var(--border-hover)]"
        >
          {/* Ambient orbs inside CTA */}
          <div className="absolute top-0 left-1/4 w-72 h-36 rounded-full opacity-35 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-56 h-28 rounded-full opacity-25 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, var(--accent-secondary-glow) 0%, transparent 70%)" }} />

          <div className="relative z-10 space-y-2 text-center md:text-left">
            <span className="text-[var(--accent-primary)] font-extrabold text-[10px] sm:text-xs uppercase tracking-[0.3em] block">
              Early Access &amp; Inquiries
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">Be Part of Our Launch Journey</h3>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Join early testers, explore platform previews, and secure your place in the priority queue before public launch.
            </p>
          </div>
          <Link
            href="/waitlist"
            className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl skybazz-cta font-extrabold text-sm tracking-wide shrink-0 w-full sm:w-auto text-center cursor-pointer"
          >
            <span>Join Priority Waitlist</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px section-divider" />
    </section>
  );
}
