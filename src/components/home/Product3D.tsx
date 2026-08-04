"use client";

import { Component, Suspense, useRef, useState, useEffect, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import { PMREMGenerator, Vector3, type Group, type Object3D } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Draco decoder hosted locally — no external CDN dependency
useGLTF.setDecoderPath("/draco/");

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

// Resting pose — fixed forever (position never moves). Balanced position.
const FIXED_POS = new Vector3(1.4, -0.3, 0);

function ModelGroup({
  interactable,
  modelPath,
}: {
  interactable: boolean;
  modelPath: string;
}) {
  const { scene } = useGLTF(modelPath);
  const group = useRef<Group>(null);
  const rotationY = useRef(0);
  const rotationX = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!interactable) {
      // Showcase: slow auto-rotation
      group.current.rotation.y += delta * 0.35;
    } else {
      // Interact: apply user-driven rotation only
      group.current.rotation.y = rotationY.current;
      group.current.rotation.x = rotationX.current;
    }
  });

  return (
    <>
      <group ref={group} position={FIXED_POS.clone()} scale={1.6}>
        <primitive object={scene as unknown as Object3D} />
      </group>
      <DragOverlay interactable={interactable} rotationY={rotationY} rotationX={rotationX} />
    </>
  );
}

function DragOverlay({
  interactable,
  rotationY,
  rotationX,
}: {
  interactable: boolean;
  rotationY: { current: number };
  rotationX: { current: number };
}) {
  const { gl } = useThree();
  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    if (!el || !interactable) return;

    const onDown = (e: PointerEvent) => {
      try {
        (el as HTMLElement).setPointerCapture?.(e.pointerId);
      } catch {
        /* noop */
      }
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !last.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      rotationY.current += dx * 0.01;
      rotationX.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, rotationX.current + dy * 0.01)
      );
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      dragging.current = false;
      last.current = null;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [interactable, gl, rotationY, rotationX]);

  return null;
}

export default function Product3D({
  locked,
  modelPath,
}: {
  locked: boolean;
  modelPath: string;
}) {
  const [modelOk, setModelOk] = useState<null | boolean>(null);

  useEffect(() => {
    setModelOk(null);
    fetch(modelPath, { method: "HEAD" })
      .then((r) => setModelOk(r.ok))
      .catch(() => setModelOk(false));
  }, [modelPath]);

  if (modelOk === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!modelOk) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-[#94A3B8]">
        Model file not found — add "{modelPath.split("/").pop()}" to public/assets/models/
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <CanvasErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center text-sm text-[#64748B]">
            3D viewer temporarily unavailable
          </div>
        }
      >
        <Canvas
          dpr={[0.8, 1.25]}
          camera={{ position: [2.8, 1.5, 3.6], fov: 38 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          onCreated={({ scene, gl }) => {
            const pmrem = new PMREMGenerator(gl);
            scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          }}
          style={{ width: "100%", height: "100%" }}
          className={`!absolute !inset-0 ${locked ? "cursor-default" : "cursor-grab active:cursor-grabbing touch-none"}`}
        >
          <Suspense fallback={null}>
            <ModelGroup key={modelPath} interactable={!locked} modelPath={modelPath} />
          </Suspense>
      <ContactShadows position={[1.4, -1.0, 0]} opacity={0.38} blur={2.4} scale={6} far={1.8} frames={1} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} />
          <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#bcd9ff" />
          <spotLight position={[0, 8, 2]} angle={0.55} penumbra={1} intensity={1.4} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}