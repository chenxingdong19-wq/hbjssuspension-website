"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, useGLTF } from "@react-three/drei";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PMREMGenerator,
  type Group,
  type Object3D,
  type Mesh,
  type MeshStandardMaterial,
  type MeshPhysicalMaterial,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Local Draco decoder — no external CDN (same as desktop Product3D)
useGLTF.setDecoderPath("/draco/");

// Model catalog — same entries as the desktop Hero. Only model-001 exists right now;
// the rest show "More products coming soon" and are reserved for future GLB files.
const MODELS = [
  { id: "lower-control-arm", name: "Lower Control Arm", path: "/assets/models/model-001.glb" },
  { id: "stabilizer-link",  name: "Stabilizer Link",    path: "/assets/models/model-002.glb" },
  { id: "ball-joint",       name: "Ball Joint",         path: "/assets/models/model-003.glb" },
  { id: "bracket",          name: "Bracket",            path: "/assets/models/model-004.glb" },
] as const;

const COMING_SOON = "More products coming soon";

/** Boost PBR material response to the environment map (same technique as Product3D). */
function boostEnvIntensity(scene: Object3D) {
  scene.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as MeshStandardMaterial | MeshPhysicalMaterial;
      if ("envMapIntensity" in m) {
        m.envMapIntensity = 1.15;
        m.needsUpdate = true;
      }
    }
  });
}

/** Auto slow rotation — industrial display cabinet.
 *  FUTURE INTENT (not implemented now, per scope): pointer-drag rotation & wheel zoom. */
function RotatingModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const group = useRef<Group>(null);

  useEffect(() => {
    boostEnvIntensity(scene);
  }, [scene]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group} scale={1.35}>
      <Center>
        <primitive object={scene as unknown as Object3D} />
      </Center>
    </group>
  );
}

class ViewerErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/**
 * Mobile-only (≤768px) second-screen 3D product showcase.
 *
 * - Rendered by pages/Home right after the Hero (before Stats).
 * - Auto slow rotation of the displayed model, centered & large.
 * - Feature key: glass capsule at the bottom switches between models
 *   (circular prev/next). Connected model → renders; unconnected model
 *   → transparent area + "More products coming soon" label.
 * - GLB is fetched only when this section approaches the viewport
 *   (IntersectionObserver 200px margin) — never blocks first paint.
 * - Transparent background blends with the page; PBR/HDR environment.
 * - Desktop never renders this section (matchMedia gate + md:hidden).
 */
export default function Product3DViewer() {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const [modelIdx, setModelIdx] = useState(0);
  // null = checking, true = current GLB ready, false = not available
  const [modelOk, setModelOk] = useState<boolean | null>(null);

  const current = MODELS[modelIdx];
  const prev = () => setModelIdx((v) => (v - 1 + MODELS.length) % MODELS.length);
  const next = () => setModelIdx((v) => (v + 1) % MODELS.length);

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

  // Pre-flight the current model — reset + re-check on every switch
  useEffect(() => {
    setModelOk(null);
    if (!isMobile || !inView) return;
    let cancelled = false;
    fetch(current.path, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setModelOk(r.ok);
      })
      .catch(() => {
        if (!cancelled) setModelOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isMobile, inView, current.path]);

  const showCanvas = mounted && isMobile && inView && modelOk === true;

  // Desktop / tablet → this section never renders
  if (!mounted || !isMobile) return null;

  return (
    <section ref={containerRef} className="md:hidden py-16" aria-label="3D Product Showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            3D Showcase
          </span>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-3">View in 360°</h2>
          <p className="text-sm text-[#64748B] mt-2 max-w-xs mx-auto">
            Explore our suspension components in rotating 3D showcase.
          </p>
        </div>

        {/* Transparent showcase area — blends with the page background */}
        <div className="relative mx-auto w-full max-w-[420px] aspect-square">
          {/* Soft ambient glow behind product — premium glass feel */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(191,219,254,0.22) 0%, rgba(255,255,255,0) 68%)",
              filter: "blur(24px)",
            }}
          />

          {showCanvas ? (
            <ViewerErrorBoundary fallback={null}>
              <div className="absolute inset-0 z-10 w-full h-full">
                <Canvas
                  dpr={[1, 1.75]}
                  camera={{ position: [0, 0.8, 3.3], fov: 36 }}
                  gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: "high-performance" }}
                  onCreated={({ scene, gl }) => {
                    // Higher-res environment map — crisp reflections on metal PBR parts
                    const pmrem = new PMREMGenerator(gl);
                    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.15).texture;
                    gl.toneMappingExposure = 1.15;
                  }}
                  className="w-full h-full"
                >
                  <Suspense fallback={null}>
                    <RotatingModel key={current.id} modelPath={current.path} />
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.3} blur={2.4} scale={9} far={2} frames={1} />
                  </Suspense>
                  <ambientLight intensity={0.65} />
                  <directionalLight position={[4, 6, 4]} intensity={1.5} />
                  <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#bcd9ff" />
                  <spotLight position={[0, 8, 2]} angle={0.55} penumbra={1} intensity={1.3} />
                  {/* Rim / back light — crisp silhouette for industrial showcase look */}
                  <directionalLight position={[-3, 1, -4]} intensity={0.6} color="#e2e8f0" />
                </Canvas>
              </div>
            </ViewerErrorBoundary>
          ) : (
            /* Loading / checking — simple spinner, no fallback image */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Feature key — always visible glass capsule (touch friendly, no hover) */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={prev}
            aria-label="Previous model"
            className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/60 bg-white/70 text-[#334155] transition-transform active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <span
            key={modelOk === true ? current.id : `empty-${current.id}`}
            className="text-xs font-semibold text-[#334155] bg-white/60 backdrop-blur-lg border border-white/50 px-4 py-2 rounded-full min-w-[150px] text-center max-w-[210px] truncate"
          >
            {modelOk === true ? current.name : COMING_SOON}
          </span>
          <button
            onClick={next}
            aria-label="Next model"
            className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/60 bg-white/70 text-[#334155] transition-transform active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}