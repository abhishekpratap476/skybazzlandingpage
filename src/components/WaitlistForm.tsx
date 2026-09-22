"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  Crown,
  User,
  Mail,
  Phone,
  Globe2,
  ShieldCheck,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type FormStep = "basics" | "tier";
type State = "idle" | "loading" | "success" | "error";

export interface Tier {
  id: number;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  examples: string[];
  fromColor: string;
  toColor: string;
  badgeBg: string;
  borderColor: string;
}

export const TIERS: Tier[] = [
  {
    id: 1,
    name: "READY",
    icon: "🛍️",
    tagline: "Everyday Essentials",
    description: "Standard, in-stock consumer products ready to ship.",
    examples: ["Electronics", "Apparel", "Home goods", "Books"],
    fromColor: "#0071e3",
    toColor: "#38bdf8",
    badgeBg: "bg-[#0071e3]",
    borderColor: "rgba(0,113,227,0.45)",
  },
  {
    id: 2,
    name: "PREMIUM",
    icon: "◇",
    tagline: "Luxury & High-Value",
    description: "Authentic luxury goods, watches, designer bags, and premium accessories.",
    examples: ["Watches", "Designer bags", "Fine jewellery", "Premium tech"],
    fromColor: "#d97706",
    toColor: "#f59e0b",
    badgeBg: "bg-amber-500",
    borderColor: "rgba(217,119,6,0.45)",
  },
  {
    id: 3,
    name: "BESPOKE",
    icon: "⬡",
    tagline: "Custom & Made-to-Order",
    description: "Fully custom or specialised items built or sourced to your specification.",
    examples: ["Custom cars", "Industrial machinery", "Bespoke furniture", "Special orders"],
    fromColor: "#7c3aed",
    toColor: "#a78bfa",
    badgeBg: "bg-purple-500",
    borderColor: "rgba(124,58,237,0.45)",
  },
  {
    id: 4,
    name: "EXPEDITION",
    icon: "🚢",
    tagline: "Oversized International",
    description: "Heavy freight, oversized cargo, and cross-border shipments handled end-to-end.",
    examples: ["Boats", "Heavy equipment", "Large furniture", "Industrial parts"],
    fromColor: "#0d9488",
    toColor: "#2dd4bf",
    badgeBg: "bg-teal-500",
    borderColor: "rgba(13,148,136,0.45)",
  },
  {
    id: 5,
    name: "ENTERPRISE",
    icon: "🌐",
    tagline: "Bulk & Global Procurement",
    description: "Large-scale business procurement, global supply chain sourcing, and wholesale orders.",
    examples: ["Factory orders", "Global supply chain", "B2B wholesale", "Commodities"],
    fromColor: "#e11d48",
    toColor: "#f43f5e",
    badgeBg: "bg-rose-500",
    borderColor: "rgba(225,29,72,0.45)",
  },
];

export default function WaitlistForm() {
  const [step, setStep] = useState<FormStep>("basics");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Form Fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier>(TIERS[0]); // Default to READY (1)

  const [ticketNumber, setTicketNumber] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  function sanitizeString(str: string, maxLen: number): string {
    return str.replace(/[<>]/g, "").trim().slice(0, maxLen);
  }

  function validateBasics(): boolean {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg("Please enter your email address.");
      setState("error");
      return false;
    }
    if (cleanEmail.length > 120) {
      setErrorMsg("Email address cannot exceed 120 characters.");
      setState("error");
      return false;
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
    if (!valid) {
      setErrorMsg("Please enter a valid email address.");
      setState("error");
      return false;
    }
    const cleanName = fullName.trim();
    if (!cleanName) {
      setErrorMsg("Please enter your full name.");
      setState("error");
      return false;
    }
    if (cleanName.length > 80) {
      setErrorMsg("Full name cannot exceed 80 characters.");
      setState("error");
      return false;
    }
    if (phone.trim()) {
      const phoneClean = phone.trim();
      const phoneValid = /^[+]?[\d\s\-()]{6,25}$/.test(phoneClean);
      if (!phoneValid) {
        setErrorMsg("Please enter a valid phone number or leave it blank.");
        setState("error");
        return false;
      }
    }
    setErrorMsg("");
    setState("idle");
    return true;
  }

  function handleNextStep(e: React.MouseEvent) {
    e.preventDefault();
    if (validateBasics()) {
      setStep("tier");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateBasics()) return;

    setState("loading");
    const cleanEmail = sanitizeString(email.toLowerCase(), 120);
    const sanitizedName = sanitizeString(fullName, 80) || "Waitlist Member";
    const sanitizedPhone = phone.trim() ? sanitizeString(phone, 25) : null;
    const sanitizedCountry = country.trim() ? sanitizeString(country, 60) : "India";
    const sanitizedCity = city.trim() ? sanitizeString(city, 60) : null;
    const generatedTicket = `SKY-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNumber(generatedTicket);

    try {
      // 1. Check existing record
      const { data: existingWaitlist } = await supabase
        .from("waitinglist")
        .select("id")
        .eq("email", cleanEmail)
        .limit(1);

      const waitlistUserId = existingWaitlist?.[0]?.id || crypto.randomUUID();

      // 2. Prepare payload for waitinglist table
      const waitlistData: Record<string, any> = {
        id: waitlistUserId,
        email: cleanEmail,
        full_name: sanitizedName,
        phone: sanitizedPhone,
        country: sanitizedCountry,
        city: sanitizedCity,
        tier: selectedTier.name,
        preferred_tier: selectedTier.name,
        tier_id: selectedTier.id,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      const { error: wErr } = await supabase.from("waitinglist").upsert(waitlistData);
      if (wErr) {
        console.warn("Supabase upsert note:", wErr.message);
        if (wErr.message?.includes("tier") || wErr.code === "42703") {
          delete waitlistData.tier;
          delete waitlistData.preferred_tier;
          delete waitlistData.tier_id;
          const { error: retryErr } = await supabase.from("waitinglist").upsert(waitlistData);
          if (retryErr) {
            console.error("Retry upsert error:", retryErr);
            setErrorMsg("Could not save to waiting list. Please try again.");
            setState("error");
            return;
          }
        } else {
          console.error("Supabase upsert error:", wErr);
          setErrorMsg(wErr.message || "Could not save to waiting list.");
          setState("error");
          return;
        }
      }

      // 3. Upsert into customers table for synchronization
      try {
        await supabase.from("customers").upsert({
          id: waitlistUserId,
          email: cleanEmail,
          full_name: fullName.trim() || "Waitlist Member",
          phone: phone.trim() || null,
          country: country.trim() || "India",
          city: city.trim() || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        });
      } catch (custErr) {
        console.warn("Customer sync note:", custErr);
      }

      // Dispatch event for UI reactivity
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("waitlist-updated"));
      }

      setState("success");
    } catch (err: any) {
      console.error("Waitlist submit error:", err);
      setErrorMsg(err?.message || "Failed to submit. Please check your connection.");
      setState("error");
    }
  }

  function handleReset() {
    setEmail("");
    setFullName("");
    setPhone("");
    setCity("");
    setStep("basics");
    setState("idle");
    setErrorMsg("");
    setTimeout(() => emailInputRef.current?.focus(), 150);
  }

  return (
    <div className="w-full mx-auto">
      <AnimatePresence mode="wait">
        {state === "success" ? (
          /* ── CELEBRATORY SUCCESS STATE ── */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="rounded-3xl bg-white/95 border border-slate-200/90 p-8 sm:p-9 text-center shadow-[0_20px_60px_-15px_rgba(0,113,227,0.12)] backdrop-blur-xl"
          >
            {/* Animated Badge Icon */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <span className="absolute inline-flex h-18 w-18 rounded-full bg-[#0071e3]/15 animate-ping" />
              <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#34aadc] text-white shadow-lg shadow-[#0071e3]/30">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              VIP RESERVATION CONFIRMED
            </div>

            <h3 className="text-2xl font-extrabold text-[#1d1d1f] tracking-tight mb-2">
              Welcome aboard, {fullName.split(" ")[0] || "Partner"}! 🎉
            </h3>

            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
              You are officially locked in for early launch access with priority tier benefits.
            </p>

            {/* VIP Ticket Badge */}
            <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/80 p-5 mb-6 text-left shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Access Pass</div>
                  <div className="text-base font-black tracking-tight text-[#0071e3]">{ticketNumber}</div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-xs"
                  style={{ background: `linear-gradient(135deg, ${selectedTier.fromColor}, ${selectedTier.toColor})` }}
                >
                  <Crown className="w-3 h-3 text-white" />
                  {selectedTier.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">REGISTERED EMAIL</span>
                  <span className="font-semibold text-slate-800 truncate block">{email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">REGION / COUNTRY</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {city.trim() ? `${city.trim()}, ${country.trim()}` : country.trim() || "Global"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-[#0071e3] hover:border-[#0071e3]/40 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              Register Another Email
            </button>
          </motion.div>
        ) : (
          /* ── MAIN INTERACTIVE FORM ── */
          <motion.form
            key="interactive-form"
            onSubmit={handleSubmit}
            className="w-full space-y-6"
          >
            {/* Step Indicators */}
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all",
                    step === "basics"
                      ? "bg-[#0071e3] text-white shadow-xs shadow-[#0071e3]/30"
                      : "bg-emerald-500 text-white"
                  )}
                >
                  {step === "tier" ? <Check className="w-3.5 h-3.5" /> : "1"}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {step === "basics" ? "Your Information" : "Details Confirmed"}
                </span>
              </div>

              <div className="h-[1px] flex-1 mx-3 bg-slate-200" />

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all",
                    step === "tier"
                      ? "bg-[#0071e3] text-white shadow-xs shadow-[#0071e3]/30"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  2
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    step === "tier" ? "text-slate-800 font-bold" : "text-slate-400"
                  )}
                >
                  Preferred Tier
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === "basics" ? (
                /* ── STEP 1: BASICS (Name, Email, Phone, Country/City) ── */
                <motion.div
                  key="step-basics"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div className="space-y-1 text-left">
                    <label
                      htmlFor="waitlist-name"
                      className="block text-xs font-bold text-[var(--text-primary)] tracking-wide"
                    >
                      Full Name <span className="text-[var(--accent-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        id="waitlist-name"
                        type="text"
                        required
                        maxLength={80}
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (state === "error") setState("idle");
                        }}
                        placeholder="e.g. Abhishek Pratap"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--border-hover)] transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1 text-left">
                    <label
                      htmlFor="waitlist-email"
                      className="block text-xs font-bold text-[var(--text-primary)] tracking-wide"
                    >
                      Work or Personal Email <span className="text-[var(--accent-primary)]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        ref={emailInputRef}
                        id="waitlist-email"
                        type="email"
                        required
                        maxLength={120}
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (state === "error") setState("idle");
                        }}
                        placeholder="name@company.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--border-hover)] transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Phone & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label htmlFor="waitlist-phone" className="block text-xs font-bold text-[var(--text-primary)]">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          id="waitlist-phone"
                          type="tel"
                          maxLength={25}
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--border-hover)] transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="waitlist-country" className="block text-xs font-bold text-[var(--text-primary)]">
                        Country / City
                      </label>
                      <div className="relative">
                        <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          id="waitlist-country"
                          type="text"
                          maxLength={60}
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="India"
                          className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--border-hover)] transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions for Step 1 */}
                  <div className="pt-2 flex flex-col gap-2">
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 px-6 rounded-xl skybazz-cta font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Next: Select Preferred Tier</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer"
                    >
                      or Quick-Join standard list with just email →
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── STEP 2: TIER SELECTION (Exact design matching screenshot) ── */
                <motion.div
                  key="step-tier"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="space-y-5 text-left"
                >
                  <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight mb-1">
                      Select Your Preferred Tier
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Choose the category or membership tier that matches what you plan to source or access.
                    </p>
                  </div>

                  <p className="text-[var(--text-muted)] text-xs text-center font-medium pt-1">
                    Choose the category that best describes your product
                  </p>

                  {/* ── 5 TIER CARDS GRID ── */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                    {TIERS.map((t, idx) => {
                      const isSelected = selectedTier.id === t.id;
                      return (
                        <motion.button
                          type="button"
                          key={t.id}
                          id={`tier-card-${t.id}`}
                          onClick={() => setSelectedTier(t)}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.25 }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 group overflow-hidden last:col-span-2 sm:last:col-span-1",
                            isSelected
                              ? "ring-2 ring-[var(--accent-primary)]/60 shadow-lg shadow-[var(--accent-glow)]"
                              : "border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-hover)]"
                          )}
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${t.fromColor}25, ${t.toColor}15)`
                              : undefined,
                            borderColor: isSelected ? t.borderColor : undefined,
                          }}
                        >
                          {/* Number Badge Top-Right */}
                          <div
                            className={cn(
                              "absolute top-2 right-2 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center text-white shadow-2xs",
                              t.badgeBg
                            )}
                          >
                            {t.id}
                          </div>

                          {/* Large Icon */}
                          <span className="text-3xl my-2 select-none">
                            {t.icon}
                          </span>

                          {/* Tier Name */}
                          <span
                            className="text-xs font-black tracking-wider uppercase mb-1"
                            style={{
                              color: isSelected ? t.fromColor : "var(--text-primary)",
                            }}
                          >
                            {t.name}
                          </span>

                          {/* Tagline */}
                          <span className="text-[var(--text-muted)] text-[10px] leading-tight font-medium">
                            {t.tagline}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* ── EXPANDED TIER DETAIL PREVIEW BOX ── */}
                  <motion.div
                    key={selectedTier.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 sm:p-5 rounded-2xl border bg-[var(--surface-card)] shadow-xs"
                    style={{ borderColor: selectedTier.borderColor }}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="text-3xl select-none shrink-0 pt-0.5">
                        {selectedTier.icon}
                      </span>
                      <div className="space-y-2">
                        <p className="text-[var(--text-primary)] text-xs sm:text-sm font-bold leading-snug">
                          {selectedTier.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {selectedTier.examples.map((ex) => (
                            <span
                              key={ex}
                              className="text-[11px] px-3 py-1 rounded-full font-semibold bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-2xs"
                              style={{
                                borderColor: `${selectedTier.fromColor}40`,
                                color: selectedTier.fromColor,
                              }}
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("basics")}
                      className="px-4 py-3.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>

                    <motion.button
                      id="waitlist-submit"
                      type="submit"
                      disabled={state === "loading"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3.5 px-6 rounded-xl skybazz-cta font-bold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {state === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Reserving {selectedTier.name} Spot…</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Reservation</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {state === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-rose-500 text-xs text-center font-medium bg-rose-50 border border-rose-200/80 rounded-xl py-2 px-3"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero spam • 256-bit SSL encrypted • Instant confirmation</span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
