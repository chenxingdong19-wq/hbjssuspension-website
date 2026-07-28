"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ProductReel() {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* ===== Ambient glow spots ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
        <div className="absolute top-[15%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-300/15 via-purple-300/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-gradient-to-br from-sky-300/12 via-blue-300/6 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[30%] w-[55%] h-[55%] bg-gradient-to-tr from-rose-300/5 via-slate-200/4 to-transparent rounded-full blur-3xl" />
      </div>

      {/* ===== Drop shadow under the product ===== */}
      <div
        className="absolute bottom-[18%] left-[20%] right-[20%] h-[15%] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* ===== VIDEO — mask-edge fade, no border, no box ===== */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex: 2,
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 42%, black 45%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 42%, black 45%, transparent 80%)",
        }}
      >
        {!videoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-[140%] h-[140%] object-contain"
            style={{
              border: "none",
              background: "transparent",
              boxShadow: "none",
            }}
            onError={() => setVideoFailed(true)}
          >
            <source src="/assets/hero/product-rotation.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/assets/hero/hero.svg"
              alt="Automotive Suspension Components"
              className="w-[120%] h-[120%] object-contain"
              loading="eager"
            />
          </div>
        )}
      </div>

      {/* ===== ISO Badge ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: [0, -5, 0] }}
        transition={{
          opacity: { delay: 0.9, duration: 0.5 },
          y: { delay: 1.2, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full antialiased"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px) saturate(1.6)",
            WebkitBackdropFilter: "blur(20px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse-dot" />
          <span className="text-[11px] font-medium tracking-normal text-slate-500 whitespace-nowrap">
            ISO 9001<span className="text-slate-300 mx-1">·</span>IATF 16949 Certified
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}