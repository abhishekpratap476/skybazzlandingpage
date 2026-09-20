"use client";

import { useState, useRef } from "react";
import { ArrowUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TICKER_ITEMS = [
  "SKYBAZZ", "×", "COMING SOON", "×",
  "RESERVE NOW", "×", "UNBOX THE BAZZ", "×",
  "ZERO FEES", "×", "GLOBAL REACH", "×",
  "AI POWERED", "×", "EARLY ACCESS", "×",
];

function Marquee() {
  return (
    <div className="w-full overflow-hidden border-y border-slate-200/80 bg-white/70 py-3 select-none backdrop-blur-md">
      <div className="flex gap-8 whitespace-nowrap w-max animate-marquee">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className={`text-[10px] font-extrabold tracking-[0.35em] ${
              item === "×" ? "text-[#0071e3]" : "text-slate-400"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SplitHeadline({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, rotateX: -30 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", transformOrigin: "top center" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function WaitlistFooter() {
  const [email, setEmail]           = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 120) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    try {
      const waitlistUserId = crypto.randomUUID();
      const { error } = await supabase.from("waitinglist").upsert({
        id: waitlistUserId,
        email: cleanEmail,
        full_name: "Waitlist Member",
        is_active: true,
        company: "Skybazz Logistics Corp",
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn("Footer waitlist submit notice:", error.message);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("waitlist-updated"));
      }
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 6000);
    } catch (err) {
      console.warn("Footer waitlist submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="waitlist" className="relative w-full overflow-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Top gradient divider */}
      <div className="absolute inset-x-0 top-0 h-px section-divider" />

      {/* Light ambient blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-30 animate-mesh-drift"
        style={{ background: "radial-gradient(circle, rgba(0,113,227,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-25 animate-mesh-drift-2"
        style={{ background: "radial-gradient(circle, rgba(88,86,214,0.10) 0%, transparent 70%)" }} />

      {/* Marquee ticker */}
      <Marquee />

      {/* Main editorial section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-end">

          {/* LEFT: Stacked headline */}
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 mb-6"
            >
              <div className="h-px w-8 bg-[#0071e3]/60" />
              <span className="text-[10px] font-extrabold tracking-[0.4em] uppercase text-[#0071e3]">
                The Future of Commerce
              </span>
            </motion.div>

            <SplitHeadline
              text="BE READY"
              className="text-[clamp(2.2rem,7.5vw,7rem)] font-extrabold tracking-tight leading-none text-[#1d1d1f]"
            />

            <SplitHeadline
              text="FOR YOUR"
              className="text-[clamp(2.2rem,7.5vw,7rem)] font-extrabold tracking-tight leading-none text-slate-300"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-[clamp(2.4rem,8.5vw,7.5rem)] font-extrabold tracking-tight leading-none"
            >
              <span style={{
                background: "linear-gradient(135deg, #0071e3 0%, #5856d6 50%, #34aadc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                NEXT.
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[#86868b] text-sm font-medium max-w-sm leading-relaxed pt-3"
            >
              A marketplace built for the bold — zero fees, AI-powered sourcing, and global reach from day one.
            </motion.p>
          </div>

          {/* RIGHT: Email form + socials */}
          <div className="space-y-8 lg:pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="space-y-4 bg-white/80 border border-slate-200/80 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-lg shadow-slate-200/50"
            >
              <div>
                <p className="text-[11px] font-extrabold tracking-[0.28em] uppercase text-[#0071e3] mb-1">
                  Get Launch-Day Access
                </p>
                <p className="text-[#86868b] text-xs leading-relaxed font-medium">
                  Drop your email and be first in line when we open the doors.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200"
                  >
                    <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-emerald-800 font-bold text-sm">You&apos;re in! 🎉</p>
                      <p className="text-emerald-600 text-xs">We&apos;ll see you at launch.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2.5"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="your@email.com"
                      maxLength={120}
                      autoComplete="email"
                      required
                      className="w-full py-3.5 px-5 text-sm bg-slate-50 border border-slate-200 text-[#1d1d1f] placeholder:text-slate-400 rounded-2xl focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                    />
                    {errorMessage && (
                      <p className="text-xs text-rose-500 font-medium px-1">{errorMessage}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-extrabold text-white text-sm bg-[#0071e3] hover:bg-[#0062c3] shadow-md shadow-[#0071e3]/30 disabled:opacity-40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      {loading ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <>Reserve Early Access <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="text-slate-400 text-[11px] text-center">
                No spam · One email at launch · Free forever
              </p>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              {[
                { Icon: XIcon,         label: "X / Twitter" },
                { Icon: InstagramIcon, label: "Instagram"   },
                { Icon: LinkedinIcon,  label: "LinkedIn"    },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#0071e3] hover:border-blue-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
              <span className="text-[10px] font-bold text-slate-400 tracking-wider ml-1">FOLLOW US</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-width wordmark */}
      <div className="relative mt-12 overflow-hidden select-none">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f5f5f7, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f5f5f7, transparent)" }} />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center font-extrabold tracking-tight leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(3.5rem, 16vw, 16rem)",
            WebkitTextStroke: "1.5px rgba(0,113,227,0.12)",
            color: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          SKYBAZZ
        </motion.p>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-slate-200/80 mt-0 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#1d1d1f] uppercase">SKYBAZZ</span>
            <span className="text-slate-300 text-xs">·</span>
            <p className="text-[10px] tracking-widest text-slate-400 font-medium">
              © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex gap-4 text-[10px] tracking-widest text-slate-500 font-medium">
              {["PRIVACY", "TERMS", "CONTACT"].map((item) => (
                <a key={item} href="#" className="hover:text-[#0071e3] transition-colors">{item}</a>
              ))}
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:border-slate-300 text-[10px] font-extrabold tracking-widest uppercase text-slate-600 hover:text-[#0071e3] transition-all shadow-sm cursor-pointer"
            >
              TOP
              <ArrowUp className="h-2.5 w-2.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
