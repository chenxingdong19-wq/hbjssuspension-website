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

/** Reserved GLB path — drop `model-001.glb` into `public/models/` when ready.
 *  Desktop Hero keeps using /assets/models/model-001.glb (unchanged). */
const MODEL_PATH = "/models/model-001.glb";

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

/** Auto slow rotation only — industrial display cabinet.
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
 * Mobile-only reserved 3D product viewer (desktop has its own full-bleed Hero 3D).
 *
 * - GLB absent  → transparent (simple spinner while checking, then nothing).
 * - GLB present → auto slow rotation, transparent background, PBR-enhancement.
 * - No fallback product image / white box / placeholder text.
 */
export default function Product3DViewer() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  // Check for the reserved GLB only on mobile
  useEffect(() => {
    if (!mounted || !isMobile) return;
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
  }, [mounted, isMobile]);

  if (!mounted || !isMobile) return null;

  // Simple loading state while checking (transparent or loading per requirement)
  if (modelOk === null) {
    return (
      <div className="md:hidden flex items-center justify-center py-10" aria-hidden>
        <div className="w-6 h-6 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Model not connected yet → keep the area transparent, no fallback visuals
  if (!modelOk) return null;

  return (
    <div className="md:hidden relative w-full max-w-[400px] mx-auto aspect-[4/3] mt-10 pointer-events-none">
      <ViewerErrorBoundary fallback={null}>
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
      </ViewerErrorBoundary>
    </div>
  );
}