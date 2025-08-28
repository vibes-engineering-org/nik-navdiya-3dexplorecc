'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface Logo3DProps {
  position: [number, number, number];
  logoSrc?: string;
}

export function Logo3D({ position, logoSrc }: Logo3DProps) {
  const logoRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (logoRef.current) {
      // Gentle rotation
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      // Subtle floating
      logoRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={logoRef} position={position}>
        {/* Logo plane with texture or fallback */}
        {logoSrc ? (
          <mesh>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={0.95}
              emissive="#ffffff"
              emissiveIntensity={0.1}
              side={THREE.DoubleSide}
            >
              <textureLoader attach="map" args={[logoSrc as any]} />
            </meshStandardMaterial>
          </mesh>
        ) : (
          <mesh>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={0.9}
              emissive="#ffffff"
              emissiveIntensity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        {/* Glowing halo behind logo */}
        <mesh>
          <ringGeometry args={[8, 16, 32]} />
          <meshStandardMaterial 
            color="#00d4ff"
            transparent
            opacity={0.3}
            emissive="#00d4ff"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Orbital rings around logo */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[10, 12, 64]} />
            <meshStandardMaterial 
              color="#00ffff"
              transparent
              opacity={0.2}
              emissive="#00ffff"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[10, 12, 64]} />
            <meshStandardMaterial 
              color="#ff00ff"
              transparent
              opacity={0.2}
              emissive="#ff00ff"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
