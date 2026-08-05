"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, useGLTF, useProgress } from "@react-three/drei";
import { type Group, type Object3D } from "three";

// Local Draco decoder — no external CDN (same as Product3D)
useGLTF.setDecoderPath("/draco/");

const MODEL_PATH = "/assets/models/model-001.glb";

function ShowcaseModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const group = useRef<Group>(null);

  // Gentle auto-rotation only — no drag, no orbit controls, no unlock (industrial display case feel)
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group} scale={1.15}>
      <Center>
        <primitive object={scene as unknown as Object3D} />
      </Center>
    </group>
  );
}

function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F8FAFC]/70 backdrop-blur-sm">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
      <span className="mt-3 text-xs font-medium text-[#94A3B8]">{Math.round(progress)}%</span>
    </div>
  );
}

/**
 * Mobile-only (≤768px) second-screen 3D product showcase.
 *
 * - Rendered after the Hero on the Home page.
 * - Uses the same GLB model as the desktop Hero background.
 * - Auto slow rotation only (no drag / orbit / unlock).
 * - GLB is NOT fetched until this section approaches the viewport
 *   (IntersectionObserver) so the first screen always opens instantly.
 * - Desktop never renders the canvas (matchMedia gate + md:hidden), so
 *   desktop Hero / Product3D behavior stays untouched.
 */
export default function MobileProduct3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);

  // Mount + mobile detection (≤768px)
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lazy-load GLB only when the showcase scrolls near the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!isMobile || !el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isMobile]);

  const showCanvas = mounted && isMobile && inView;

  return (
    <section ref={containerRef} className="md:hidden py-16" aria-label="3D Product Showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            3D Showcase
          </span>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-3">View in 360°</h2>
          <p className="text-sm text-[#64748B] mt-2 max-w-xs mx-auto">
            Lower control arm — rotating 3D showcase, engineered for precision.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] aspect-square glass-card glass-noise overflow-hidden">
          {showCanvas ? (
            <>
              <LoadingOverlay />
              <Canvas
                dpr={[0.8, 1.25]}
                camera={{ position: [0, 0.8, 3.8], fov: 42 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
                className="w-full h-full"
              >
                <Suspense fallback={null}>
                  <ShowcaseModel />
                  <ContactShadows position={[0, -1.4, 0]} opacity={0.32} blur={2.4} scale={8} far={2} frames={1} />
                </Suspense>
                <ambientLight intensity={0.75} />
                <directionalLight position={[4, 6, 4]} intensity={1.6} />
                <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#bcd9ff" />
                <spotLight position={[0, 8, 2]} angle={0.55} penumbra={1} intensity={1.4} />
              </Canvas>
            </>
          ) : (
            /* Lightweight static placeholder until viewport is near — keeps the cabinet visually stable */
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/assets/hero/hero.svg"
                alt="Suspension component"
                className="w-[62%] h-auto object-contain opacity-90"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}