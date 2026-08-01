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

      {/* ===== Soft floating shadow (diffuse, subtle) ===== */}
      <div
        className="absolute bottom-[16%] left-[18%] right-[18%] h-[18%] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.07) 0%, transparent 75%)",
          filter: "blur(2px)",
          zIndex: 1,
        }}
      />

      {/* ===== Soft glass halo behind video (seams into background) ===== */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[36px]"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 52% 52% at 50% 46%, rgba(255,255,255,0.10), rgba(191,219,254,0.06) 55%, transparent 78%)",
          filter: "blur(28px)",
        }}
      />

      {/* ===== VIDEO — soft multi-stop mask fade, floating, no box ===== */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex: 2,
          opacity: 0.96,
          maskImage:
            "radial-gradient(ellipse 62% 58% at 50% 44%, black 30%, rgba(0,0,0,0.55) 56%, rgba(0,0,0,0.18) 72%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 58% at 50% 44%, black 30%, rgba(0,0,0,0.55) 56%, rgba(0,0,0,0.18) 72%, transparent 92%)",
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
            className="w-[118%] h-[118%] object-contain"
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
              className="w-[118%] h-[118%] object-contain"
              loading="eager"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}