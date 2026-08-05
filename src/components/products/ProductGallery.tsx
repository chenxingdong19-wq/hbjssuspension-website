"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const total = images?.length ?? 0;
  const prev = () => setActive((a) => (a === 0 ? total - 1 : a - 1));
  const next = () => setActive((a) => (a === total - 1 ? 0 : a + 1));

  const btnClass =
    "w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-500 hover:text-slate-800 hover:scale-110 transition-all duration-200";

  const isSingle = total <= 1;

  if (total === 0) {
    return (
      <div className="aspect-square glass-card flex items-center justify-center text-slate-400 text-sm">
        No images available
      </div>
    );
  }

  return (
    <>
      {/* ===== Gallery ===== */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative aspect-square glass-card glass-noise overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full cursor-zoom-in"
              onClick={() => setLightbox(true)}
            >
              <SafeImage
                src={images[active]}
                alt={`${name} - ${active + 1}`}
                className="w-full h-full object-contain p-8"
                fallbackClassName="absolute inset-0"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint — visible on mobile, hover-reveal on desktop */}
          <div className="absolute top-4 right-4 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-md glass-card flex items-center justify-center">
              <ZoomIn size={16} className="text-slate-500" />
            </div>
          </div>

          {/* Arrows — always visible on mobile, hover-reveal on desktop */}
          <button
            onClick={prev}
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${btnClass} ${isSingle ? "opacity-30 cursor-default pointer-events-none" : "md:opacity-0 md:group-hover:opacity-100"}`}
            disabled={isSingle}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${btnClass} ${isSingle ? "opacity-30 cursor-default pointer-events-none" : "md:opacity-0 md:group-hover:opacity-100"}`}
            disabled={isSingle}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          {/* Counter — always visible */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <span className="px-3 py-1 rounded-full glass-card text-xs text-slate-500">
              {active + 1} / {total}
            </span>
          </div>
        </div>

        {/* Thumbnails — always visible */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                i === active
                  ? "ring-2 ring-slate-400/50 ring-offset-2 ring-offset-transparent scale-105"
                  : "opacity-60 hover:opacity-90 hover:scale-105"
              }`}
            >
              <img
                src={img}
                alt={`${name} thumb ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-contain bg-[#F0F3F8] p-2"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ===== Lightbox ===== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform z-10"
            >
              <X size={24} className="text-slate-600" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className={`absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass-card flex items-center justify-center transition-all duration-200 z-10 ${isSingle ? "opacity-30 cursor-default pointer-events-none" : "hover:scale-105"}`}
              disabled={isSingle}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} className="text-slate-600" />
            </button>

            {/* Image */}
            <motion.img
              key={`lightbox-${active}`}
              src={images[active]}
              alt={`${name} - fullscreen ${active + 1}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="max-w-[88vw] max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className={`absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass-card flex items-center justify-center transition-all duration-200 z-10 ${isSingle ? "opacity-30 cursor-default pointer-events-none" : "hover:scale-105"}`}
              disabled={isSingle}
              aria-label="Next image"
            >
              <ChevronRight size={28} className="text-slate-600" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span className="px-4 py-2 rounded-full glass-card text-sm text-slate-500">
                {active + 1} / {total}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}