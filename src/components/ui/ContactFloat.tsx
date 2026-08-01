"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { getCompany } from "@/lib/data";

declare global {
  interface Window {
    Tawk_API?: {
      toggle: () => void;
      hideWidget: () => void;
      [key: string]: unknown;
    };
  }
}

const spring = { type: "spring", stiffness: 260, damping: 22, mass: 0.8 } as const;

export default function ContactFloat() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState<"chat" | "whatsapp" | null>(null);
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const company = getCompany();
  const number = company.social.whatsapp.replace(/\D/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic effect (mouse proximity)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 15 });
  const sy = useSpring(my, { stiffness: 150, damping: 15 });

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(t);
  }, []);

  // First-visit hint bubble (localStorage — only once)
  useEffect(() => {
    const key = "hbjs-contact-hint-shown";
    if (typeof window !== "undefined" && !localStorage.getItem(key)) {
      const t1 = setTimeout(() => setShowHint(true), 1800);
      const t2 = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem(key, "1");
      }, 6500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  // Scroll interaction — shrink slightly while scrolling, restore when stopped
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setScrolled(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setScrolled(false), 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const openChat = useCallback(() => {
    setPressed("chat");
    setTimeout(() => setPressed(null), 300);
    setExpanded(false);
    // Open Tawk.to widget
    if (typeof window !== "undefined" && window.Tawk_API) {
      window.Tawk_API.toggle();
    } else {
      window.open("https://tawk.to/chat/6a6d5ae003ca471d44326847/1jutim02m", "_blank");
    }
  }, []);

  const openWhatsApp = useCallback(() => {
    setPressed("whatsapp");
    setTimeout(() => setPressed(null), 300);
    setExpanded(false);
    window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
  }, [number]);

  // Magnetic pull handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      mx.set(Math.max(-5, Math.min(5, dx * 0.08)));
      my.set(Math.max(-5, Math.min(5, dy * 0.08)));
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  // Ripple spawn
  const spawnRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipple({ id, x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 650);
  }, []);

  const buttonBase =
    "group relative overflow-hidden flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl backdrop-blur-2xl transition-shadow duration-300";
  const glassStyle = {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.78), rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.24))",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 24px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[90]"
    >
      {/* First-visit hint bubble */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 8 }}
            transition={spring}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-medium text-[#334155]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.65))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 24px rgba(0,0,0,0.1)",
            }}
          >
            <span className="mr-1.5">👋</span> Chat with our team
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-l-8 border-y-transparent border-l-white/70" style={{ borderTopWidth: 6, borderBottomWidth: 6, borderLeftWidth: 8 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanding sub-buttons */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end gap-3 mb-3"
          >
            {/* Online Chat */}
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              transition={{ ...spring, delay: 0.1 }}
              onClick={(e) => {
                spawnRipple(e);
                openChat();
              }}
              aria-label="Open online chat"
              className={`${buttonBase} hover:scale-[1.04] active:scale-95 ${
                scrolled ? "scale-95" : "scale-100"
              }`}
              style={glassStyle}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:bg-sky-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-none">Online Support</div>
                <div className="text-xs font-medium text-[#334155] leading-tight mt-1 group-hover:text-sky-600 transition-colors">Online Chat</div>
              </div>
              {/* Glass sheen */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute inset-[-100%] bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animation: "contactSheen 2.6s ease-in-out infinite" }} />
              </div>
            </motion.button>

            {/* WhatsApp */}
            <motion.a
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              transition={{ ...spring, delay: 0.2 }}
              href={`https://wa.me/${number}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              onClick={(e) => {
                spawnRipple(e as unknown as React.MouseEvent<HTMLButtonElement>);
                openWhatsApp();
              }}
              className={`${buttonBase} hover:scale-[1.04] active:scale-95 ${
                scrolled ? "scale-95" : "scale-100"
              }`}
              style={glassStyle}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center transition-transform duration-300 group-hover:rotate-[8deg] group-hover:bg-green-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9.5 13.5c.5 1 1.5 2 2.5 2s2-1 2.5-2" />
                  </svg>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-none">Quick Connect</div>
                <div className="text-xs font-medium text-[#334155] leading-tight mt-1 group-hover:text-green-600 transition-colors">WhatsApp</div>
              </div>
              {/* Glass sheen */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute inset-[-100%] bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animation: "contactSheen 2.6s ease-in-out infinite" }} />
              </div>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Contact button — floating + breathing */}
      <motion.button
        onClick={() => setExpanded((v) => !v)}
        aria-label="Contact options"
        className={`relative overflow-hidden flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl backdrop-blur-2xl ${
          pressed ? "scale-95" : "hover:scale-[1.05] active:scale-95"
        } ${scrolled ? "scale-[0.96]" : "scale-100"} transition-transform duration-300`}
        style={glassStyle}
        animate={{
          y: [0, -4, 0],
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 24px rgba(0,0,0,0.08)",
            "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.12)",
            "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 24px rgba(0,0,0,0.08)",
          ],
          opacity: [1, 0.96, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/70 border border-white/80 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 shadow-inner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {expanded ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8" />
                  <path d="M8 13h5" />
                </>
              )}
            </svg>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-none transition-colors">Contact Us</div>
          <div className="text-xs font-medium text-[#334155] leading-tight mt-1">Tap to connect</div>
        </div>

        {/* Glass sheen moving band */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute bg-gradient-to-tr from-transparent via-white/50 to-transparent"
            style={{
              inset: "-100% 0 -100% 0",
              transform: "translateX(-100%)",
              animation: expanded ? "none" : "contactSheen 3.8s ease-in-out infinite",
              opacity: 0.35,
            }}
          />
          {/* Inner highlight edge */}
          <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)" }} />
        </div>

        {/* Ripple */}
        <AnimatePresence>
          {ripple && expanded && (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pointer-events-none absolute w-4 h-4 rounded-full bg-white/60"
              style={{ left: ripple.x - 8, top: ripple.y - 8 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Global sheen keyframes */}
      <style>{`
        @keyframes contactSheen {
          0%, 12% { transform: translateX(-130%) skewX(-18deg); }
          60%, 100% { transform: translateX(130%) skewX(-18deg); }
        }
      `}</style>
    </motion.div>
  );
}