"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Plane, Cpu, Award } from "lucide-react";

export default function AboutCompany() {
  const pillars = [
    {
      icon: <Plane className="w-5 h-5" />,
      title: "Worldwide Express Delivery",
      description: "Direct priority flight corridors linking international hubs to deliver your order swiftly to your doorstep.",
      color: "from-blue-600 to-cyan-500",
      glow: "rgba(0,113,227,0.15)",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Strict Quality & Authenticity",
      description: "100% genuine quality inspection protocol verifying every product before dispatch for total satisfaction.",
      color: "from-indigo-600 to-blue-500",
      glow: "rgba(99,102,241,0.15)",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "AI-Powered Smart Search",
      description: "Intelligent catalog search engine helping you instantly discover top products, categories, and recommendations.",
      color: "from-violet-600 to-indigo-500",
      glow: "rgba(139,92,246,0.15)",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Buyer Protection & Live Assistance",
      description: "Complete peace of mind with order protection, money-back guarantees, and 24/7 live customer assistance.",
      color: "from-purple-600 to-violet-500",
      glow: "rgba(168,85,247,0.15)",
    },
  ];

  return (
    <section
      id="about-section"
      className="relative w-full py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f5f5f7] text-[#1d1d1f] overflow-hidden"
    >
      {/* Light ambient background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 animate-mesh-drift"
        style={{ background: "radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 animate-mesh-drift-2"
        style={{ background: "radial-gradient(circle, rgba(88,86,214,0.10) 0%, transparent 70%)" }} />

      {/* Top section divider */}
      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-10 sm:space-y-16 md:space-y-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-3 sm:space-y-4"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-px w-6 sm:w-8 bg-[#0071e3]/60" />
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#0071e3]">
              About SkyBazz
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#1d1d1f]">
            Redefining Online Shopping With{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0071e3 0%, #5856d6 50%, #34aadc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Speed, Quality &amp; Care
            </span>
          </h2>
          <p className="text-[#86868b] text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium">
            Built for shoppers who demand excellence, SkyBazz connects you with curated electronics, luxury items, and global lifestyle products — combining quality checks, transparent pricing, and fast doorstep delivery.
          </p>
        </motion.div>

        {/* Pillar cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 cursor-default transition-all duration-300 hover:border-blue-200 hover:bg-white shadow-sm hover:shadow-xl"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${p.glow}, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {p.icon}
              </div>

              {/* Text */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed font-normal">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px section-divider" />
    </section>
  );
}
