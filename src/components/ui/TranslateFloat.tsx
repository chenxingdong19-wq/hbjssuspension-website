"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, AlertTriangle } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "zh-CN", label: "中文" },
] as const;

const spring = { type: "spring", stiffness: 300, damping: 24, mass: 0.7 } as const;

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

/** Remove + zero-size Google Translate banner iframe & artifacts */
function purgeGoogleUI() {
  try {
    if (document.body) document.body.style.top = "0px";
  } catch {
    /* noop */
  }
  document
    .querySelectorAll(
      "iframe.goog-te-banner-frame, .goog-te-banner-frame, #goog-gt-tt, .goog-te-gadget, .goog-te-gadget-simple, .goog-logo-link, .goog-te-balloon-frame, .goog-te-menu-frame, .goog-te-menu2, .goog-te-gadget-icon, div[id*='goog-gt-']"
    )
    .forEach((el) => {
      try {
        (el as HTMLElement).style.setProperty("display", "none", "important");
        (el as HTMLElement).style.setProperty("height", "0px", "important");
        (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
      } catch {
        /* noop */
      }
      if (
        el.classList.contains("goog-te-banner-frame") ||
        (el as HTMLElement).id === "goog-gt-tt" ||
        (el as HTMLElement).id?.startsWith("goog-gt-")
      ) {
        el.remove();
      }
    });
}

export default function TranslateFloat() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const [loaded, setLoaded] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load Google Translate script once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("google-translate-script")) {
      setScriptReady(true);
      return;
    }

    const timeout = setTimeout(() => {
      setLoadTimedOut(true);
      setScriptReady(true);
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
            layout: 0,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setScriptReady(true);
        purgeGoogleUI();
      }
    };

    script.onerror = () => {
      clearTimeout(timeout);
      setLoadTimedOut(true);
      setScriptReady(true);
    };

    document.head.appendChild(script);
    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Continuous purge
  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = window.setInterval(purgeGoogleUI, 400);
    purgeGoogleUI();
    let observer: MutationObserver | undefined;
    if ("MutationObserver" in window) {
      observer = new MutationObserver(() => purgeGoogleUI());
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class", "id"],
      });
    }
    return () => {
      window.clearInterval(interval);
      observer?.disconnect();
    };
  }, []);

  const switchLang = useCallback((code: string) => {
    const googSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (googSelect) {
      googSelect.value = code;
      googSelect.dispatchEvent(new Event("change", { bubbles: true }));
      setCurrent(code);
      setOpen(false);
      purgeGoogleUI();
      setTimeout(purgeGoogleUI, 400);
    } else {
      document.cookie =
        "googtrans=/en/" +
        (code === "en" ? "en" : code) +
        ";path=/;domain=" +
        window.location.hostname;
      window.location.reload();
    }
  }, []);

  // Detect current language
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label ?? "English";

  return (
    <div
      ref={ref}
      className="fixed right-4 z-[85] select-none"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {/* Hidden Google translate anchor */}
      <div
        id="google_translate_element"
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 0, height: 0, overflow: "hidden" }}
      />

      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={loaded ? { opacity: 1, x: 0 } : {}}
        transition={spring}
      >
        <div className="relative flex flex-col items-center">
          {/* Globe button — opens menu */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Translate website"
            className="w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.5))",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 22px rgba(0,0,0,0.12)",
            }}
          >
            {loadTimedOut ? (
              <AlertTriangle size={17} className="text-amber-500" />
            ) : (
              <Globe size={17} className="text-[#475569]" />
            )}
          </button>

          {/* Tiny current-lang label under button */}
          <span className="mt-1 text-[9px] font-semibold text-[#94A3B8] tracking-wide">
            {loadTimedOut ? "TRANS" : currentLabel.split("-")[0]}
          </span>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: -4 }}
                transition={spring}
                className="absolute right-full mr-3 top-0 min-w-[140px] py-1.5 backdrop-blur-2xl rounded-2xl border border-white/60"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.14)",
                }}
              >
                {loadTimedOut ? (
                  <p className="px-4 py-2 text-[11px] text-amber-600 max-w-[170px]">
                    Translation service unreachable. Try later or use a VPN.
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
        </div>
      </motion.div>

      {/* CSS — force Google banner to zero size */}
      <style>{`
        .goog-te-banner-frame,
        iframe.goog-te-banner-frame {
          display: none !important;
          height: 0 !important;
          width: 0 !important;
          visibility: hidden !important;
        }
        .goog-te-gadget,
        .goog-te-gadget *,
        .goog-logo-link,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-te-menu-frame,
        .goog-te-menu2,
        div[id*="goog-gt-"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
        }
        .goog-te-combo {
          opacity: 0 !important;
          position: absolute !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
        }
        body {
          top: 0px !important;
          position: relative !important;
        }
      `}</style>
    </div>
  );
}