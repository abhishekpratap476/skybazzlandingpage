"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InteractiveParticles from "@/components/InteractiveParticles";
import { supabase } from "@/lib/supabase";
export default function MetricsBanner() {
  const [waitlistCount, setWaitlistCount] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count, error } = await supabase
          .from("waitinglist")
          .select("*", { count: "exact", head: true });
        if (!error && typeof count === "number") {
          setWaitlistCount(count);
        }
      } catch (err) {
        console.warn("Could not fetch waitlist count:", err);
      }
    }
    fetchCount();

    const handleUpdate = () => fetchCount();
    window.addEventListener("waitlist-updated", handleUpdate);
    return () => window.removeEventListener("waitlist-updated", handleUpdate);
  }, []);

  return (
    <section
      id="metrics-section"
      className="relative z-10 w-full h-[580px] sm:h-[650px] md:h-[720px] min-h-[520px] flex items-center justify-center overflow-hidden bg-[var(--canvas-bg)]"
    >
      {/* Subtle ambient lighting matching active theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--card-glow), transparent 70%)",
        }}
      />

      {/* Full-width background watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 px-2 sm:px-4">
        {/* Soft edge fade masks for seamless horizontal blending */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--canvas-bg), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--canvas-bg), transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="w-full text-center font-extrabold tracking-tight leading-none whitespace-nowrap outline-text select-none"
          style={{
            fontSize: "clamp(2.4rem, 13.2vw, 14.5rem)",
            letterSpacing: "-0.02em",
            opacity: 0.7,
          }}
        >
          WAITING LIST
        </motion.p>
      </div>

      <InteractiveParticles
        waitlistCount={waitlistCount}
        background="transparent"
        color="#D4AF37"
        size={isMobile ? 1.4 : 1.5}
        maxDimension={isMobile ? 260 : 300}
        randomness={isMobile ? 0.35 : 0.6}
        depth={isMobile ? 1.4 : 2.5}
        touchRadius={isMobile ? 0.22 : 0.2}
        className="relative z-10 h-full w-full"
      />
    </section>
  );
}
