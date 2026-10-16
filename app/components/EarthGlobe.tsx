
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

type GlobeProps = {
  latitude: number;
  longitude: number;
};

const EARTH_TEXTURE =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

function Earth({ latitude, longitude }: GlobeProps) {
  const texture = useTexture(EARTH_TEXTURE);

  const markerPosition = useMemo(() => {
    const lat = THREE.MathUtils.degToRad(latitude);
    const lon = THREE.MathUtils.degToRad(longitude);

    const radius = 1.025;

    return new THREE.Vector3(
      -radius * Math.cos(lat) * Math.sin(lon),
      radius * Math.sin(lat),
      radius * Math.cos(lat) * Math.cos(lon)
    );
  }, [latitude, longitude]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
            map={texture}
            roughness={0.85}
            metalness={0}
            emissive="#8abed5"
            emissiveMap={texture}
            emissiveIntensity={0.3}
            toneMapped={false}
        />
      </mesh>

      <mesh scale={1.035}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color="#5591a9"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={markerPosition}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#9ccddc" />
      </mesh>

      <mesh position={markerPosition}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial
          color="#9ccddc"
          transparent
          opacity={0.18}
        />
      </mesh>

      <ambientLight intensity={2.0} color="#dceef8" />
        <directionalLight
        position={[4, 3, 5]}
        intensity={3.0}
        color="#ffffff"
        />
        <pointLight
        position={[-3, -1, -4]}
        intensity={1.0}
        color="#5591a9"
        />
    </group>
  );
}

function LoadingGlobe() {
  return (
    <mesh scale={1.035}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
            color="#5591a9"
            transparent
            opacity={0.16}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
    </mesh>
  );
}

export default function EarthGlobe(props: GlobeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={<LoadingGlobe />}>
        <Stars
          radius={40}
          depth={20}
          count={1200}
          factor={2}
          saturation={0}
          fade
          speed={0.3}
        />
        <Earth {...props} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.1}
        maxDistance={5}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </Canvas>
  );
}
