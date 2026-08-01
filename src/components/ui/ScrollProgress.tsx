"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        transformOrigin: "0% 0%",
        background:
          "linear-gradient(90deg, rgba(220,38,38,0.0), rgba(220,38,38,0.55), rgba(220,38,38,0.9))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 0 12px rgba(220,38,38,0.15)",
      }}
      aria-hidden
    />
  );
}