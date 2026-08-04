"use client";

import { motion } from "framer-motion";
import { Camera, Play, Building2, Users, Video } from "lucide-react";

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
 * Reserve area for future exhibition photos / client group photos / company intro video.
 * Assets go in:
 *   - public/assets/company/exhibition/   (photos)
 *   - public/assets/company/videos/       (video)
 * No media uploaded yet — elegant placeholders shown until then.
 */

// Future photo slots (auto-detected from the exhibition folder at build/dev time)
const PHOTO_SLOTS = 3;

export default function GlobalPresence() {
  return (
    <section className="py-24 border-t border-gray-200 section-mid relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute -top-24 -right-24 w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-200/20 via-purple-100/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={cont} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="text-center mb-20">
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
        <motion.div variants={cont} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mb-20">
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
            {Array.from({ length: PHOTO_SLOTS }).map((_, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="glass-card overflow-hidden rounded-2xl group"
              >
                <div className="aspect-[4/3] relative flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/70 overflow-hidden">
                  {/* placeholder icon + text */}
                  <div className="text-center px-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/70 backdrop-blur border border-white/80 flex items-center justify-center">
                      {i === 0 ? (
                        <Building2 size={20} className="text-[#94A3B8]" />
                      ) : i === 1 ? (
                        <Users size={20} className="text-[#94A3B8]" />
                      ) : (
                        <Camera size={20} className="text-[#94A3B8]" />
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] font-medium">
                      Exhibition Photo {i + 1}
                    </p>
                  </div>
                  {/* hover hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-accent/0 group-hover:bg-accent/[0.04] transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-[11px] text-[#94A3B8]">
                    Add photo to&nbsp;
                    <code className="text-[10px] font-mono text-[#64748B]">
                      /assets/company/exhibition/
                    </code>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video */}
        <motion.div variants={cont} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
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
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-card group">
              {/* placeholder poster */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-700/70 backdrop-blur">
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center mb-4">
                  <Play size={26} className="text-white ml-1" />
                </div>
                <p className="text-sm text-white/80 font-medium">Company Intro Video</p>
                <p className="text-xs text-white/40 mt-1">
                  Add video to&nbsp;
                  <code className="text-[10px] font-mono text-white/50">
                    /assets/company/videos/
                  </code>
                </p>
              </div>
              {/* actual video (comment-post: once file exists, uncomment) */}
              {/*
              <video
                className="absolute inset-0 w-full h-full object-cover"
                controls
                preload="none"
                poster="/assets/company/videos/poster.jpg"
              >
                <source src="/assets/company/videos/company-intro.mp4" type="video/mp4" />
                <source src="/assets/company/videos/company-intro.webm" type="video/webm" />
              </video>
              */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}