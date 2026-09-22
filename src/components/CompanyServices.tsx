"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Plane, ShieldCheck, CreditCard, Headphones, ShoppingBag, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function CompanyServices() {
  const services = [
    {
      id: "01",
      badge: "SMART AI",
      icon: <Search className="w-5 h-5" />,
      title: "Curated Product Discovery",
      subtitle: "Smart Search & Instant Inventory",
      description: "Discover top-tier electronics, horology, lifestyle essentials, and luxury items with real-time stock and instant search.",
      highlights: ["Authentic Product Catalog", "Curated Tech & Luxury", "Instant Search"],
      color: "from-blue-600 to-cyan-500",
      glow: "var(--accent-glow)",
    },
    {
      id: "02",
      badge: "VERIFIED AUTHENTIC",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-300" />,
      title: "100% Quality & Authenticity",
      description: "Every item undergoes rigorous multi-point physical checks before packaging to guarantee 100% genuine brand quality.",
      highlights: ["Zero Replica Guarantee", "Verified Quality Inspection", "Sealed Product Dispatch"],
      color: "from-emerald-600 to-teal-500",
      glow: "rgba(16, 185, 129, 0.25)",
    },
    {
      id: "03",
      badge: "EXPRESS AIR",
      icon: <Plane className="w-5 h-5" />,
      title: "Express Doorstep Air Delivery",
      description: "Priority air courier corridors linking international logistics hubs directly to your doorstep with real-time GPS tracking.",
      highlights: ["Same-Day Dispatch", "Live Order Tracking", "Worldwide Express Shipping"],
      color: "from-sky-600 to-blue-500",
      glow: "var(--accent-secondary-glow)",
    },
    {
      id: "04",
      badge: "BANK SECURE",
      icon: <CreditCard className="w-5 h-5" />,
      title: "Secure & Flexible Checkout",
      description: "Protected by bank-level 256-bit encryption with multiple secure payment methods and instant invoice generation.",
      highlights: ["256-bit Bank Encryption", "Multiple Payment Options", "Transparent Pricing"],
      color: "from-indigo-600 to-blue-600",
      glow: "var(--accent-glow)",
    },
    {
      id: "05",
      badge: "24/7 DEDICATED",
      icon: <Headphones className="w-5 h-5" />,
      title: "24/7 Dedicated Customer Care",
      description: "Friendly customer support specialists available round-the-clock to assist with orders, sizing, and shipping inquiries.",
      highlights: ["Live Chat & Email Support", "Sub-1hr Response Time", "Dedicated Support Desk"],
      color: "from-cyan-600 to-blue-600",
      glow: "var(--accent-secondary-glow)",
    },
    {
      id: "06",
      badge: "BUYER SHIELD",
      icon: <ShoppingBag className="w-5 h-5" />,
      title: "Order Protection & Buyer Security",
      description: "Enjoy complete peace of mind with order protection, full refund guarantees, and total buyer security on every item.",
      highlights: ["Order Protection Guarantee", "Full Money-Back Guarantee", "Total Buyer Security"],
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
                Our Capabilities
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12] text-[var(--text-primary)]">
              Seamless Shopping,{" "}
              <span className="skybazz-headline-gradient">
                Unmatched Quality
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
            From single item purchases to curated collection orders, SkyBazz delivers an end-to-end premium shopping experience.
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
              Support &amp; Guidance
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">Have Questions About Your Order?</h3>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Connect with our team for order tracking, product guidance, and custom delivery assistance.
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
