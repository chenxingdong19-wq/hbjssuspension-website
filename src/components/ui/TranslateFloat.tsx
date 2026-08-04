"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, AlertTriangle } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "zh-CN", label: "中文" },
] as const;

const spring = { type: "spring", stiffness: 260, damping: 22, mass: 0.8 } as const;

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (opts: Record<string, unknown>, el: string) => unknown;
        InlineLayout?: { SIMPLE: number };
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
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Google Translate script once — with timeout fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded?
    if (document.getElementById("google-translate-script")) {
      setScriptReady(true);
      return;
    }

    // 8s timeout — if Google is blocked/unreachable, show friendly error
    const timeout = setTimeout(() => {
      if (!scriptReady) {
        setLoadTimedOut(true);
        setScriptReady(true); // let UI show error
      }
    }, 8000);

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      clearTimeout(timeout);
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ru,zh-CN",
            layout: 0, // SIMPLE layout
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setScriptReady(true);
        // Clean up banner artifacts after init
        setTimeout(() => {
          const banner = document.querySelector(
            ".goog-te-banner-frame"
          ) as HTMLIFrameElement | null;
          if (banner) banner.style.display = "none";
          document.body.style.top = "0px";
          // keep skiptranslate visible — required for translation
        }, 300);
      }
    };

    script.onerror = () => {
      clearTimeout(timeout);
      setLoadTimedOut(true);
      setScriptReady(true);
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Aggressive cleanup — Google re-inserts DOM elements asynchronously after translation
  const cleanGoogleUI = useCallback(() => {
    // Try multiple times to catch delayed injections
    const cleanup = () => {
      document.body.style.top = "0px";
      // Remove all banner frames
      document.querySelectorAll("iframe.goog-te-banner-frame, .goog-te-banner-frame").forEach((el) => {
        (el as HTMLElement).style.display = "none";
        (el as HTMLElement).setAttribute("width", "0");
        (el as HTMLElement).setAttribute("height", "0");
      });
      // Collapse any remaining gadget wrappers
      document.querySelectorAll(".goog-te-gadget, .goog-te-gadget-simple, .goog-logo-link, #goog-gt-tt").forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
      // Remove any goog-gt-* divs
      document.querySelectorAll("div[id*='goog-gt-']").forEach((el) => {
        (el as HTMLElement).style.display = "none";
        (el as HTMLElement).style.height = "0";
      });
    };

    cleanup();
    // Google injects UI after a delay — clean again multiple times
    setTimeout(cleanup, 200);
    setTimeout(cleanup, 600);
    setTimeout(cleanup, 1200);
    setTimeout(cleanup, 2500);
  }, []);

  // Switch language via the hidden Google select
  const switchLang = useCallback((code: string) => {
    const googSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;

    if (googSelect) {
      googSelect.value = code;
      googSelect.dispatchEvent(new Event("change", { bubbles: true }));
      setCurrent(code);
      setOpen(false);
      // Aggressively clean Google UI after language switch
      cleanGoogleUI();
    } else {
      // Script not loaded yet / blocked — just set cookie so reload applies
      document.cookie =
        "googtrans=/en/" +
        (code === "en" ? "en" : code) +
        ";path=/;domain=" +
        window.location.hostname;
      window.location.reload();
    }
  }, []);

  // Detect current language on mount
  useEffect(() => {
    if (!scriptReady || loadTimedOut) return;
    const check = setInterval(() => {
      const sel = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (sel?.value) {
        setCurrent(sel.value);
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, [scriptReady, loadTimedOut]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label ?? "English";

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden Google translate anchor — required by widget, must stay in DOM */}
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
        {/* Translate toggle */}
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
            {loadTimedOut ? (
              <AlertTriangle size={14} className="text-amber-500" />
            ) : (
              <Globe size={14} className="text-[#475569]" />
            )}
          </div>
          <span className="hidden sm:inline text-[11px] font-semibold text-[#475569]">
            {loadTimedOut ? "Translate" : currentLabel}
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
              {loadTimedOut ? (
                <p className="px-4 py-2 text-[11px] text-amber-600">
                  Translation service is currently unreachable. Please try again later or use a VPN.
                </p>
              ) : (
                LANGUAGES.map((lang) => (
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
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hide Google Translate UI artifacts aggressively */}
      <style>{`
        /* Banner & frames */
        .goog-te-banner-frame,
        .goog-te-banner-frame *,
        iframe.goog-te-banner-frame { display: none !important; width: 0 !important; height: 0 !important; }
        /* Gadget & branding */
        .goog-te-gadget,
        .goog-te-gadget *,
        .goog-logo-link,
        .goog-logo-link * { display: none !important; }
        /* Tooltip / balloon */
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-te-balloon-frame * { display: none !important; }
        /* Menu frames */
        .goog-te-menu-frame,
        .goog-te-menu2 { display: none !important; }
        /* Status bar / inline gadget */
        .goog-te-gadget-icon { display: none !important; }
        .goog-te-gadget-simple { display: none !important; }
        .goog-te-gadget .goog-te-gadget-simple { display: none !important; }
        /* Any remaining Google overlaid elements */
        div[id*="goog-gt-"] { display: none !important; height: 0 !important; }
        /* Keep the select functional but visually hidden */
        .goog-te-combo {
          opacity: 0 !important;
          position: absolute !important;
          pointer-events: none !important;
        }
        /* Force body to NOT shift for banner */
        body { top: 0px !important; position: relative !important; }
      `}</style>
    </div>
  );
}