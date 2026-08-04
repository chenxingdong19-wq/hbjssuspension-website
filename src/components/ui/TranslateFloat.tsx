"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "zh-CN", label: "中文" },
] as const;

const spring = { type: "spring", stiffness: 260, damping: 22, mass: 0.8 } as const;

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (opts: Record<string, unknown>, el: string) => unknown;
        InlineLayout: { SIMPLE: number };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function TranslateFloat() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const [loaded, setLoaded] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Google Translate script once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = document.getElementById("google-translate-script");
    if (existing) {
      setScriptReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      // Hide the default Google translate dropdown completely
      const hideBanner = () => {
        const banner = document.querySelector(".goog-te-banner-frame") as HTMLIFrameElement | null;
        if (banner) banner.style.display = "none";
        const body = document.body;
        if (body) {
          body.style.top = "0px";
          // Hide google top bar artifacts
          const skipto = document.getElementById(":1.targetLanguage") as HTMLElement | null;
          if (skipto) skipto.style.display = "none";
          // Also hide the popup frame that sometimes appears
          const frames = document.querySelectorAll("iframe.goog-te-menu-frame");
          frames.forEach((f) => ((f as HTMLElement).style.display = "none"));
        }
      };

      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ru,zh-CN",
            layout: window.google.translate.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setScriptReady(true);
        // Try hiding banner immediately after init
        setTimeout(hideBanner, 200);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount — it's global
    };
  }, []);

  // Switch language via the hidden Google select
  const switchLang = useCallback(
    (code: string) => {
      if (code === "en") {
        // Reset to original english: simulate clicking the "original" option
        const googSelect = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement | null;
        if (googSelect) {
          googSelect.value = "en";
          googSelect.dispatchEvent(new Event("change", { bubbles: true }));
          // Also try removing the translated class from body
          setTimeout(() => {
            document.body.classList.remove("translated-ltr", "translated-rtl");
          }, 100);
        } else {
          // Reload with no translation: set cookie to en
          document.cookie = "googtrans=/en/en;path=/;domain=" + window.location.hostname;
          window.location.reload();
          return;
        }
      } else {
        const googSelect = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement | null;
        if (googSelect) {
          googSelect.value = code;
          googSelect.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          // Fallback: set cookie and reload
          document.cookie =
            "googtrans=/en/" + code + ";path=/;domain=" + window.location.hostname;
          window.location.reload();
          return;
        }
      }
      setCurrent(code);
      setOpen(false);
    },
    []
  );

  // Auto-detect current language from URL or cookie (for returning visits)
  useEffect(() => {
    if (!scriptReady) return;
    // Check if already translated on page load
    const checkLang = setInterval(() => {
      const googSelect = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement | null;
      if (googSelect && googSelect.value) {
        setCurrent(googSelect.value === "en" ? "en" : googSelect.value);
        clearInterval(checkLang);
      }
    }, 200);
    return () => clearInterval(checkLang);
  }, [scriptReady]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label || "English";

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden Google translate container — required by the widget, never visible */}
      <div
        id="google_translate_element"
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 0, height: 0, overflow: "hidden" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={spring}
        className="relative"
      >
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Translate website"
          className="group flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-[1.04] active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.78), rgba(255,255,255,0.4))",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div className="w-8 h-8 rounded-full bg-white/60 border border-white/70 flex items-center justify-center">
            <Globe size={14} className="text-[#475569]" />
          </div>
          <span className="hidden sm:inline text-[11px] font-semibold text-[#475569]">
            {currentLabel}
          </span>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={spring}
              className="absolute bottom-full right-0 mb-2 min-w-[140px] py-1.5 backdrop-blur-2xl rounded-2xl border border-white/60"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.5))",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLang(lang.code)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                    current === lang.code
                      ? "text-accent bg-red-50/60"
                      : "text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.04]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Style overrides — hide Google's default UI artifacts */}
      <style>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-gadget { display: none !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
        .goog-te-menu-frame { display: none !important; }
        .goog-te-menu2 { display: none !important; }
        .goog-te-combo { display: none !important; }
        .skiptranslate { display: none !important; }
        /* Keep our content visible */
        .notranslate { }
      `}</style>
    </div>
  );
}