"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, AlertTriangle, GripHorizontal } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "zh-CN", label: "中文" },
] as const;

const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.7 } as const;

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
      // Remove banners & bubbles completely (their close button would undo translation)
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
  const rootRef = useRef<HTMLDivElement>(null);

  // ── Draggable state (rAF-throttled, direct DOM transform = smooth) ──
  const posRef = useRef({ x: 180, y: 24 });
  const dragRef = useRef<{
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    moved: boolean;
    raf: number | null;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    posRef.current.y = Math.max(24, window.innerHeight - 130);
    if (rootRef.current) {
      rootRef.current.style.left = posRef.current.x + "px";
      rootRef.current.style.top = posRef.current.y + "px";
    }
  }, []);

  const applyPos = () => {
    if (rootRef.current) {
      rootRef.current.style.transform =
        "translate3d(" + posRef.current.x + "px, " + posRef.current.y + "px, 0)";
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Only start drag from the handle/grip area — not from button
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: posRef.current.x,
      oy: posRef.current.y,
      moved: false,
      raf: null,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;

    // rAF-throttle — only update DOM transform once per frame, no React re-render
    if (d.raf !== null) return;
    d.raf = requestAnimationFrame(() => {
      if (!dragRef.current) return;
      const d2 = dragRef.current;
      posRef.current.x = Math.max(8, Math.min(window.innerWidth - 210, d2.ox + (e.clientX - d2.sx)));
      posRef.current.y = Math.max(8, Math.min(window.innerHeight - 70, d2.oy + (e.clientY - d2.sy)));
      applyPos();
      d2.raf = null;
    });
  };

  const onPointerEnd = () => {
    if (dragRef.current?.raf !== null && dragRef.current?.raf !== undefined) {
      cancelAnimationFrame(dragRef.current.raf);
    }
    dragRef.current = null;
  };

  // ── Load Google Translate script (once) ───────────────────────
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

  // ── Continuous purge (300ms + MutationObserver) ───────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = window.setInterval(purgeGoogleUI, 300);
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

  // ── Switch language ───────────────────────────────────────────
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
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label ?? "English";

  return (
    <div ref={rootRef} className="fixed z-[85] select-none" style={{ left: 0, top: 0 }}>
      {/* Hidden Google translate anchor */}
      <div
        id="google_translate_element"
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 0, height: 0, overflow: "hidden" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={spring}
      >
        <div className="relative">
          {/* Floating pill: drag handle + label */}
          <div
            className="flex items-center gap-1.5 pl-1 pr-1 py-1 rounded-full backdrop-blur-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.5))",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 22px rgba(0,0,0,0.1)",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            {/* Drag grip */}
            <span className="p-1 cursor-grab active:cursor-grabbing">
              <GripHorizontal size={13} className="text-[#94A3B8]" />
            </span>

            {/* Clickable translate toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              aria-label="Translate website"
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full hover:bg-black/[0.03] transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-white/80 border border-white/90 flex items-center justify-center">
                {loadTimedOut ? (
                  <AlertTriangle size={13} className="text-amber-500" />
                ) : (
                  <Globe size={13} className="text-[#475569]" />
                )}
              </span>
              <span className="text-[11px] font-semibold text-[#475569]">
                {loadTimedOut ? "Translate" : currentLabel}
              </span>
              <span
                className={`text-[8px] text-[#94A3B8] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={spring}
                className="absolute bottom-full left-0 mb-2 min-w-[150px] py-1.5 backdrop-blur-2xl rounded-2xl border border-white/60"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                {loadTimedOut ? (
                  <p className="px-4 py-2 text-[11px] text-amber-600">
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

      {/* CSS — force banner to zero size unconditionally */}
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