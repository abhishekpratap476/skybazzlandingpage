"use client";

import React, { useState, useEffect } from "react";
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
      className="relative z-10 w-full h-[580px] sm:h-[650px] md:h-[720px] min-h-[520px] flex items-center justify-center overflow-hidden bg-[#f5f5f7]"
    >
      {/* Subtle ambient lighting matching application theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0,113,227,0.08) 0%, transparent 70%)",
        }}
      />

      <InteractiveParticles
        waitlistCount={waitlistCount}
        waitlistLabel="IN WAITING LIST"
        background="transparent"
        color="#0071e3"
        size={isMobile ? 2.2 : 1.6}
        maxDimension={isMobile ? 140 : 280}
        randomness={isMobile ? 1.4 : 1.8}
        depth={isMobile ? 2.0 : 3.0}
        touchRadius={isMobile ? 0.22 : 0.2}
        className="h-full w-full"
      />
    </section>
  );
}
