"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, MessageCircle, MousePointerClick, ChevronLeft, ChevronRight } from "lucide-react";
import ProductReel from "./ProductReel";
import { getCompany } from "@/lib/data";

// Lazy-load 3D viewer — never blocks first paint
const Product3D = dynamic(() => import("./Product3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

// ═══════════════════════════════════════════════════════════════════
// Product models — add more entries here as new GLB files become
// available.  Path → the file inside public/assets/models/.
// Only the first model exists right now; the rest show "Model file
// not found – add …" until you place the corresponding GLB file there.
// ═══════════════════════════════════════════════════════════════════
const models = [
  { id: "lower-control-arm", name: "Lower Control Arm", path: "/assets/models/model-001.glb" },
  { id: "stabilizer-link",  name: "Stabilizer Link",    path: "/assets/models/model-002.glb" },
  { id: "ball-joint",       name: "Ball Joint",         path: "/assets/models/model-003.glb" },
  { id: "bracket",          name: "Bracket",            path: "/assets/models/model-004.glb" },
];

// Text animation variants (NO filter — compatible with gradient text)
const badgeVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 320, damping: 16, delay: 0.1 } },
};

const titleVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

const descVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const ctaContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } },
};
const ctaItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 18 } },
};

export default function Hero() {
  const company = getCompany();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const [locked, setLocked] = useState(true);
  const [modelIdx, setModelIdx] = useState(0);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  // Mobile detection (≤768px) — enables lightweight static fallback on phones.
  // Desktop remains on full Three.js / GLB rendering (untouched).
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    setMounted(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const current = models[modelIdx];
  const prev = () => setModelIdx((v) => (v - 1 + models.length) % models.length);
  const next = () => setModelIdx((v) => (v + 1) % models.length);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-ambient section-hero">
      {/* Parallax ambient glow */}
      <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, -14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-indigo-200/30 via-purple-100/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 -left-24 w-[50%] h-[50%] rounded-full bg-gradient-to-br from-sky-200/25 via-blue-100/15 to-transparent blur-3xl"
        />
      </motion.div>

      {/* Full-bleed visual layer — borderless */}
      <div className="absolute inset-0 z-0">
        {/* Desktop / tablet: full Three.js GLB rendering (unchanged) */}
        {mounted && !isMobile ? (
          <>
            <Product3D locked={locked} modelPath={current.path} />

            {/* Model switcher (bottom-left — no collision with unlock button) */}
            <div className="absolute bottom-6 left-6 z-40 flex items-center gap-1.5">
              <motion.button
                onClick={prev}
                className="w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/60 bg-white/70 text-[#334155] hover:bg-white/90 transition-colors"
                aria-label="Previous model"
              >
                <ChevronLeft size={15} />
              </motion.button>
              <motion.span
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-semibold text-[#334155] bg-white/60 backdrop-blur-lg border border-white/50 px-3 py-1.5 rounded-full min-w-[100px] text-center"
              >
                {current.name}
              </motion.span>
              <motion.button
                onClick={next}
                className="w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/60 bg-white/70 text-[#334155] hover:bg-white/90 transition-colors"
                aria-label="Next model"
              >
                <ChevronRight size={15} />
              </motion.button>
            </div>

            {/* Unlock interaction button (bottom-right) */}
            <button
              onClick={() => setLocked((v) => !v)}
              className="absolute bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-95"
              style={{
                background:
                  locked
                    ? "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.5))"
                    : "linear-gradient(135deg, rgba(220,38,38,0.92), rgba(185,28,28,0.85))",
                border: locked ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(220,38,38,0.4)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 24px rgba(0,0,0,0.12)",
                color: locked ? "#334155" : "#fff",
              }}
            >
              <MousePointerClick size={14} />
              {locked ? "Unlock model" : "Lock model"}
            </button>
          </>
        ) : null}

      </div>

      {/* Foreground content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 pointer-events-none z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          <div>
            {/* Badge */}
            <motion.div
              variants={badgeVariant}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-8 backdrop-blur-sm pointer-events-auto"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent uppercase">
                {company.businessType}
              </span>
            </motion.div>

            {/* Title — gradient text, NO filter animation (reliable) */}
            <motion.h1
              variants={titleVariant}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-[-0.02em] leading-[1.06] mb-6 bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent"
            >
              {company.tagline}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={descVariant}
              initial="hidden"
              animate="show"
              className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-xl font-medium antialiased pointer-events-auto"
            >
              {company.description}
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={ctaContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row gap-3.5 pointer-events-auto"
            >
              <motion.div variants={ctaItem}>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white text-sm font-semibold btn-primary shadow-lg shadow-red-200 group"
                >
                  Explore Products
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </motion.div>
              <motion.div variants={ctaItem}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[#0F172A] text-sm font-semibold btn-secondary"
                >
                  <MessageCircle size={18} />
                  Request Quote
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile-only lightweight product visual (≤768px) — in normal flow below CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-12 md:hidden"
            >
              <div
                className="relative w-full max-w-[320px] mx-auto animate-float"
                style={{ animationDuration: "7s" }}
              >
                {/* soft ambient glow behind product to keep Apple / HarmonyOS premium feel */}
                <div
                  className="absolute inset-0 rounded-full opacity-70"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(191,219,254,0.35) 0%, rgba(255,255,255,0) 70%)",
                    filter: "blur(30px)",
                  }}
                />
                <img
                  src="/assets/hero/hero.svg"
                  alt={`${company.brand} Suspension Components`}
                  className="relative w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}