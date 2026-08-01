"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function ContactFloat() {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState<"chat" | "whatsapp" | null>(null);
  const company = getCompany();
  const number = company.social.whatsapp.replace(/\D/g, "");

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  const openChat = useCallback(() => {
    setPressed("chat");
    setTimeout(() => setPressed(null), 300);
    // Open Tawk.to widget
    if (typeof window !== "undefined" && window.Tawk_API) {
      window.Tawk_API.toggle();
    } else {
      // Fallback if Tawk not yet loaded — open chat page
      window.open("https://tawk.to/chat/6a6d5ae003ca471d44326847/1jutim02m", "_blank");
    }
  }, []);

  const openWhatsApp = useCallback(() => {
    setPressed("whatsapp");
    setTimeout(() => setPressed(null), 300);
    window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
  }, [number]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      {/* Online Chat — Tawk.to */}
      <button
        onClick={openChat}
        aria-label="Open online chat"
        className={`group flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl glass-card backdrop-blur-2xl transition-all duration-300 ${
          pressed === "chat" ? "scale-95" : "hover:scale-[1.04] active:scale-95"
        } hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]`}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.45))",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
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
      </button>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => {
          setPressed("whatsapp");
          setTimeout(() => setPressed(null), 300);
        }}
        className={`group flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl glass-card backdrop-blur-2xl transition-all duration-300 ${
          pressed === "whatsapp" ? "scale-95" : "hover:scale-[1.04] active:scale-95"
        } hover:shadow-[0_8px_40px_rgba(34,197,94,0.15)]`}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.45))",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center group-hover:bg-green-100 transition-colors">
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
      </a>
    </div>
  );
}