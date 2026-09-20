"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Volume2, VolumeX, Maximize2, Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  src?: string;
  fallbackSrc?: string;
  poster?: string;
  title?: string;
  subtitle?: string;
}

export default function VideoPlayer({
  src = "/hero.mp4",
  fallbackSrc = "https://vjs.zencdn.net/v/oceans.mp4",
  poster = "/feat_ai_sourcing.jpg",
  title = "Video ",
  // subtitle = "Scroll to expand into a full-screen presentation.",
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Screen freezes sticky from start of container to end
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smoothly maps so video reaches full screen at 0.95, holds momentarily, 
  // then seamlessly unpins into the next section with zero gap
  const videoWidth = useTransform(
    scrollYProgress,
    [0, 0.95],
    [isMobile ? "92vw" : "68vw", "100vw"]
  );

  const videoHeight = useTransform(
    scrollYProgress,
    [0, 0.95],
    [isMobile ? "42vh" : "68vh", "100vh"]
  );

  const borderRadius = useTransform(scrollYProgress, [0, 0.92], ["24px", "0px"]);
  const borderWidth = useTransform(scrollYProgress, [0, 0.92], ["1px", "0px"]);

  // Title and text overlay smoothly fades out early in scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.22], [0, -35]);
  const overlayOpacity = useTransform(scrollYProgress, [0.2, 0.9], [0.35, 0.05]);

  const [currentSrc, setCurrentSrc] = useState(src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Auto-play when visible, pause when away
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentContainer);
    return () => observer.disconnect();
  }, []);

  // Sync prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setUsingFallback(false);
  }, [src]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoError = () => {
    if (!usingFallback && fallbackSrc && currentSrc !== fallbackSrc) {
      setUsingFallback(true);
      setCurrentSrc(fallbackSrc);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch(() => setIsPlaying(false));
        }
      }, 100);
    } else {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(handleVideoError);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    } else {
      videoRef.current.requestFullscreen().catch(() => { });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[140vh] sm:h-[180vh] bg-[#f5f5f7] select-none"
    >
      {/* Pinned full-viewport stage during scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#f5f5f7]">
        {/* Soft background ambient glow matching application theme */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(0,113,227,0.08), transparent 70%)",
          }}
        />

        {/* Text Header above video (smoothly glides up and fades out) */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute top-[8%] sm:top-[10%] left-0 right-0 z-20 pointer-events-none text-center px-6 max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.35em] text-brand-500 uppercase mb-2 block">
            CINEMATIC EXPERIENCE
          </span> */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2 uppercase">
            {title}
          </h2>
          <div className="h-0.5 w-14 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full mb-3" />
        </motion.div>

        {/* Expanding Video Frame: from centered card to 100vw x 100vh full-screen */}
        <motion.div
          style={{
            width: videoWidth,
            height: videoHeight,
            borderRadius,
            borderWidth,
          }}
          className="relative overflow-hidden flex items-center justify-center bg-black border-slate-200/80 shadow-[0_25px_65px_rgba(0,0,0,0.18)] group"
        >
          {!hasError ? (
            <video
              ref={videoRef}
              src={currentSrc}
              poster={poster}
              preload="auto"
              muted={isMuted}
              playsInline
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleVideoError}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 text-center p-8">
              <div className="h-16 w-16 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4">
                <Play className="h-7 w-7 text-brand-400 ml-1" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Cinematic presentation ready. Click to play.
              </p>
            </div>
          )}

          {/* Vignette Overlay */}
          <motion.div
            style={{
              opacity: overlayOpacity,
              background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
            onClick={togglePlay}
            className="absolute inset-0 pointer-events-none cursor-pointer"
          />

          {/* Bottom-left Play/Pause Control with Circular Progress Ring */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-30 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xl border border-white/25 shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="21" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="transparent"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="131.95"
                strokeDashoffset={131.95 - (currentTime / (duration || 1)) * 131.95}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
            </svg>

            <div className="z-10 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white translate-x-[1px]" />
              )}
            </div>
          </button>

          {/* Bottom-right audio and fullscreen buttons */}
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleMute}
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-400" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
              title="Fullscreen"
              aria-label="Expand to full screen"
            >
              <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

