"use client";

import { motion } from "framer-motion";
import { Camera, Play, Video } from "lucide-react";

const cont = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Global Presence & International Cooperation
 *
 * Photos  → public/assets/company/exhibition/01.jpg, 02.jpg, 03.jpg ...
 * Video   → public/assets/company/videos/company-intro.mp4 (or .webm)
 *
 * Placeholder cards are shown only when the file is missing.
 */

const PHOTO_PATHS = [
  "/assets/company/exhibition/01.jpg",
  "/assets/company/exhibition/02.jpg",
  "/assets/company/exhibition/03.jpg",
];

// Check if a public asset exists (client-side fetch HEAD)
function assetExists(path: string): { ok: boolean; hint?: string } {
  // We rely on <img> onError instead — avoids unsafe sync checks.
  return { ok: true };
}

export default function GlobalPresence() {
  return (
    <section className="py-24 border-t border-gray-200 section-mid relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute -top-24 -right-24 w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-200/20 via-purple-100/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={cont}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-20"
        >
          <motion.span variants={item} className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            International Presence
          </motion.span>
          <motion.h2 variants={item} className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-3 mb-5">
            Global Presence & International Cooperation
          </motion.h2>
          <motion.p variants={item} className="text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Building strong partnerships with customers worldwide through professional
            manufacturing and reliable automotive suspension solutions.
          </motion.p>
        </motion.div>

        {/* Photos */}
        <motion.div
          variants={cont}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-20"
        >
          <motion.div variants={item} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Camera size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A]">
                International Exhibition & Customer Communication
              </h3>
              <p className="text-sm text-[#64748B]">
                Meeting global partners and showcasing our automotive suspension products at international exhibitions.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHOTO_PATHS.map((src, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="glass-card overflow-hidden rounded-2xl group"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/70">
                  <img
                    src={src}
                    alt={`Exhibition Photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // show graceful placeholder if file missing
                      const el = e.currentTarget;
                      el.style.display = "none";
                      const placeholder = el.parentElement?.querySelector(".exhibit-ph");
                      if (placeholder) (placeholder as HTMLElement).style.display = "flex";
                    }}
                  />
                  {/* fallback placeholder (hidden by default) */}
                  <div
                    className="exhibit-ph hidden absolute inset-0 flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/70 backdrop-blur border border-white/80 flex items-center justify-center mb-3">
                      <Camera size={20} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-xs text-[#94A3B8] font-medium">Exhibition Photo {i + 1}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          variants={cont}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={item} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Video size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A]">Company Introduction</h3>
              <p className="text-sm text-[#64748B]">
                Discover our manufacturing capabilities, production experience and commitment to
                providing high-quality suspension components for global customers.
              </p>
            </div>
          </motion.div>

          <motion.div variants={item}>
            {/* Real video — click to play (no autoplay, no sound, lazy) */}
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
              <video
                className="absolute inset-0 w-full h-full object-cover bg-slate-900"
                controls
                preload="none"
                poster="/assets/company/exhibition/01.jpg"
              >
                <source src="/assets/company/videos/company-intro.mp4" type="video/mp4" />
                <source src="/assets/company/videos/company-intro.webm" type="video/webm" />
                <p className="text-sm text-white/70 p-6">
                  Your browser does not support video. Please add company-intro.mp4 to
                  /assets/company/videos/.
                </p>
              </video>
              {/* Fallback cover if no video yet */}
              <div
                className="video-fb absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-700/70"
                style={{ display: "none" }}
              >
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center mb-4">
                  <Play size={26} className="text-white ml-1" />
                </div>
                <p className="text-sm text-white/80 font-medium">Company Intro Video</p>
                <p className="text-xs text-white/40 mt-1">/assets/company/videos/company-intro.mp4</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}