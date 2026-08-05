"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, useGLTF } from "@react-three/drei";
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

// Reuses the existing desktop model — mobile second-screen showcase.
const MODEL_PATH = "/assets/models/model-001.glb";

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
function RotatingModel() {
  const { scene } = useGLTF(MODEL_PATH);
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
    <group ref={group} scale={1.1}>
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
 * - Auto slow rotation of the lower control arm, centered & large.
 * - GLB is fetched only when this section approaches the viewport
 *   (IntersectionObserver 200px margin) — never blocks first paint.
 * - Transparent background blends with the page; PBR/HDR environment
 *   for a crisp industrial showcase look.
 * - Desktop never renders this section (matchMedia gate + md:hidden).
 */
export default function Product3DViewer() {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  // null = checking, true = GLB ready, false = not available
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

  // Pre-flight the GLB only near the viewport
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
            Lower control arm — rotating 3D showcase, engineered for precision.
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
                  camera={{ position: [0, 0.8, 3.8], fov: 40 }}
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
                    <RotatingModel />
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.3} blur={2.4} scale={8} far={2} frames={1} />
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
      </div>
    </section>
  );
}