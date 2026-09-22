"use client";

import React, { useEffect, useRef, useState } from "react";
import DomeGallery from "./DomeGallery";

export default function DomeGallerySection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [galleryEntered, setGalleryEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGalleryEntered(true);
          if (!hasShownOnce) {
            setVisible(true);
            setHasShownOnce(true);
            const timer = setTimeout(() => {
              setVisible(false);
            }, 3500);
            return () => clearTimeout(timer);
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasShownOnce]);

  return (
    <div
      ref={sectionRef}
      id="trending-section"
      className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen min-h-[460px] bg-[var(--canvas-bg)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] flex flex-col justify-between overflow-hidden transition-colors duration-400"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)" }} />

      {/* Floating header */}
      <div
        className={`absolute top-6 sm:top-8 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1.5 transition-all duration-1000 ease-in-out pointer-events-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-8 bg-[var(--accent-primary)]/60" />
          <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.4em] uppercase text-[var(--accent-primary)]">
            Interactive Showcase
          </span>
          <div className="h-px w-8 bg-[var(--accent-primary)]/60" />
        </div>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-[var(--text-primary)]">
          Featured Product Gallery
        </h2>
      </div>

      {/* 3D Dome Gallery */}
      <div
        className={`w-full h-full flex-1 relative overflow-hidden transition-all duration-[1200ms] ease-out transform ${galleryEntered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
          }`}
      >
        <DomeGallery
          fit={isMobile ? 0.95 : 0.85}
          fitBasis="width"
          minRadius={isMobile ? 220 : 350}
          maxVerticalRotationDeg={0}
          segments={isMobile ? 20 : 30}
          dragDampening={1.6}
          grayscale={false}
          autoRotate={true}
          autoRotateSpeed={0.8}
          imageBorderRadius="14px"
          openedImageBorderRadius="20px"
          overlayBlurColor="rgba(10,10,14,0.88)"
        />
      </div>
    </div>
  );
}
