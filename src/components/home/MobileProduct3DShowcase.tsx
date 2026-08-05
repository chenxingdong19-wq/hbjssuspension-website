"use client";

import { Suspense, Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, useGLTF } from "@react-three/drei";
import { type Group, type Object3D } from "three";

// Local Draco decoder — no external CDN (same as Product3D)
useGLTF.setDecoderPath("/draco/");

const MODEL_PATH = "/assets/models/model-001.glb";

// Real product image — graceful fallback while the GLB loads/renders.
// Never shows a dark placeholder box or placeholder text.
const PRODUCT_IMAGE = "/assets/products/control-arms/control-arm-001/01.webp";

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
  // Thin translucent spinner over the static product image while GLB loads — no empty box.
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-accent rounded-full animate-spin backdrop-blur-sm bg-white/40 rounded-full" />
    </div>
  );
}

// Any 3D render failure → render nothing (static product image stays visible underneath).
class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Mobile-only (≤768px) second-screen 3D product showcase.
 *
 * - Rendered after the Hero on the Home page.
 * - Uses the same GLB model as the desktop Hero background.
 * - Auto slow rotation only (no drag / orbit / unlock).
 * - The showcase area is transparent and blends with the page background —
 *   there is NO dark box / empty container. A real product image sits underneath
 *   at all times (pre-load, loading, and failure states).
 * - GLB is pre-flighted with a HEAD request when the section approaches the viewport
 *   (IntersectionObserver). If the model is missing or fails, the Canvas is simply
 *   not mounted — the page transitions naturally with the static product image.
 * - Desktop never renders this section (matchMedia gate + md:hidden).
 */
export default function MobileProduct3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  // null = not checked yet, true = GLB exists, false = missing/failed
  const [modelOk, setModelOk] = useState<boolean | null>(null);

  // Mount + mobile detection (≤768px)
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lazy-load: wait until the showcase scrolls near the viewport
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

  // Pre-flight the GLB only once the section is near the viewport.
  // Missing / failed model → stay on the static real product image (no empty box).
  useEffect(() => {
    if (!isMobile || !inView) return;
    let cancelled = false;
    fetch(MODEL_PATH, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setModelOk(r.ok);
      })
      .catch(() => {
        if (!cancelled) setModelOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isMobile, inView]);

  const showCanvas = mounted && isMobile && inView && modelOk === true;

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

        {/* Transparent showcase area — blends with the page background.
            Always a real product image underneath; 3D canvas layers on top only
            when the GLB is confirmed available. No dark box, no placeholder text. */}
        <div className="relative mx-auto w-full max-w-[420px] aspect-square">
          {/* Soft ambient glow behind product — keeps the premium feel without a boxed container */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(191,219,254,0.22) 0%, rgba(255,255,255,0) 68%)",
              filter: "blur(24px)",
            }}
          />

          {/* Static real product image — visible pre-load, during load, and on any failure */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={PRODUCT_IMAGE}
              alt="Lower Control Arm"
              loading="lazy"
              className="w-[70%] h-[70%] object-contain"
            />
          </div>

          {/* 3D canvas — only mounted when the model is available */}
          {showCanvas && (
            <CanvasErrorBoundary fallback={null}>
              <div className="absolute inset-0 z-10">
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
              </div>
            </CanvasErrorBoundary>
          )}
        </div>
      </div>
    </section>
  );
}