"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

// Fizzy matcha carbonation bubble particles burst when opened
function FizzyBubbles({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 75;

  const [positions, velocities] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = 1.55;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      vel[i * 3] = (Math.random() - 0.5) * 1.8;
      vel[i * 3 + 1] = 1.2 + Math.random() * 2.5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current || !active) return;
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocities[i * 3] * delta;
      array[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      array[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Gravity & air drag
      velocities[i * 3 + 1] -= delta * 3.5;

      // Reset when falling down
      if (array[i * 3 + 1] < 0.5) {
        array[i * 3] = (Math.random() - 0.5) * 0.3;
        array[i * 3 + 1] = 1.55;
        array[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        velocities[i * 3 + 1] = 1.5 + Math.random() * 2.8;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#86EFAC"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Stylized Animated Hand popping the pull tab
function StylizedHand({ progress }: { progress: number }) {
  // progress goes 0 (approaching) -> 1 (pulling open)
  const handRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (handRef.current) {
      if (progress < 0.3) {
        // Approaching from top-right
        const t = progress / 0.3;
        handRef.current.position.set(0.6 - t * 0.45, 2.5 - t * 0.85, 0.4 - t * 0.35);
        handRef.current.rotation.set(-0.3 + t * 0.1, -0.4, 0.2 - t * 0.1);
      } else if (progress < 0.7) {
        // Lifting up tab
        const t = (progress - 0.3) / 0.4;
        handRef.current.position.set(0.15, 1.65 + t * 0.35, 0.05 - t * 0.1);
        handRef.current.rotation.set(-0.2 - t * 0.5, -0.4, 0.1);
      } else {
        // Moving away gracefully
        const t = (progress - 0.7) / 0.3;
        handRef.current.position.set(0.15 + t * 1.2, 2.0 + t * 1.0, -0.05 + t * 0.8);
        handRef.current.rotation.set(-0.7 - t * 0.2, -0.4, 0.1);
      }
    }
  });

  return (
    <group ref={handRef} position={[0.6, 2.5, 0.4]}>
      {/* Index Finger Tip on Tab */}
      <mesh position={[0, 0, 0]} rotation={[0.4, 0, 0]}>
        <capsuleGeometry args={[0.075, 0.28, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.4} />
      </mesh>
      {/* Index Finger Second Joint */}
      <mesh position={[0.02, 0.22, 0.12]} rotation={[0.7, 0.1, 0]}>
        <capsuleGeometry args={[0.08, 0.32, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.4} />
      </mesh>
      {/* Thumb Joint pinching the tab */}
      <mesh position={[-0.14, 0.08, -0.04]} rotation={[-0.3, 0.4, -0.5]}>
        <capsuleGeometry args={[0.085, 0.35, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.4} />
      </mesh>
      {/* Hand Palm / Knuckles */}
      <mesh position={[0.05, 0.45, 0.35]} rotation={[0.6, 0.2, -0.1]}>
        <boxGeometry args={[0.32, 0.45, 0.22]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.45} />
      </mesh>
      {/* Wrist / Arm */}
      <mesh position={[0.12, 0.85, 0.65]} rotation={[0.7, 0.2, -0.1]}>
        <cylinderGeometry args={[0.15, 0.17, 0.6, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3D Can with Pull-Tab Opening Physics
function UnoMatchaOpeningCan() {
  const canGroupRef = useRef<THREE.Group>(null);
  const tabRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, "/uno-cha-can.png");

  const [animTime, setAnimTime] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(2, 1);
  }

  // Animation cycle: 0 -> 1 every 6 seconds
  useFrame((_, delta) => {
    setAnimTime((prev) => {
      const next = (prev + delta * 0.25) % 1; // 4s full loop
      return next;
    });

    if (canGroupRef.current) {
      // Gentle floating spin
      canGroupRef.current.rotation.y += delta * 0.3;
    }

    if (tabRef.current) {
      // Tab opening angle based on animation time
      if (animTime > 0.35 && animTime < 0.8) {
        setIsOpen(true);
        const openT = Math.min((animTime - 0.35) / 0.15, 1);
        tabRef.current.rotation.x = -openT * 1.35; // Flip tab up 75 degrees
      } else if (animTime >= 0.8 || animTime < 0.1) {
        setIsOpen(false);
        tabRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <Float speed={2.0} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={canGroupRef} position={[0, -0.1, 0]}>
        {/* Main Can Body with Texture */}
        <Cylinder args={[1.05, 1.05, 2.7, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial map={texture} roughness={0.25} metalness={0.35} />
        </Cylinder>

        {/* Top Rim Aluminum Chime */}
        <Cylinder args={[0.98, 1.05, 0.18, 64]} position={[0, 1.44, 0]}>
          <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.9} />
        </Cylinder>
        <Cylinder args={[0.96, 0.96, 0.06, 64]} position={[0, 1.54, 0]}>
          <meshStandardMaterial color="#CBD5E1" roughness={0.2} metalness={0.95} />
        </Cylinder>

        {/* Can Top Lid */}
        <Cylinder args={[0.9, 0.9, 0.04, 32]} position={[0, 1.55, 0]}>
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.9} />
        </Cylinder>

        {/* Opening Hole when popped */}
        {isOpen && (
          <mesh position={[0, 1.575, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.22, 32]} />
            <meshBasicMaterial color="#14532D" />
          </mesh>
        )}

        {/* Pull Tab with Hinge Pivot */}
        <group ref={tabRef} position={[0, 1.57, 0.1]}>
          <mesh position={[0, 0.015, 0.18]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.26, 0.02, 0.42]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.95} />
          </mesh>
          {/* Rivet */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
        </group>

        {/* Bottom Inverted Rim */}
        <Cylinder args={[1.05, 0.92, 0.22, 64]} position={[0, -1.46, 0]}>
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.85} />
        </Cylinder>

        {/* Fizzy Particle Steam Burst when opened */}
        <FizzyBubbles active={isOpen} />

        {/* Animated Hand */}
        <StylizedHand progress={animTime} />
      </group>
    </Float>
  );
}

export default function HandOpeningCanScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.4, 4.3], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.9} color="#FFFBF3" />
        <directionalLight position={[-5, -4, -3]} intensity={0.9} color="#7DD3FC" />
        <pointLight position={[0, 3, 2]} intensity={1.4} color="#FEF08A" />

        <React.Suspense fallback={null}>
          <UnoMatchaOpeningCan />
        </React.Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.3}
        />
      </Canvas>
    </div>
  );
}
