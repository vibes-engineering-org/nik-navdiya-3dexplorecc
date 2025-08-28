'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface TrailLineProps {
  positions: Array<[number, number, number]>;
  isVisible: boolean;
  progress: number; // 0 to 1
}

export function TrailLine({ positions, isVisible, progress }: TrailLineProps) {
  const lineRef = useRef<any>(null);
  const glowLineRef = useRef<any>(null);
  
  // Create the trail path geometry
  const { geometry, totalLength, progressLength } = useMemo(() => {
    if (positions.length < 2) {
      return { geometry: null, totalLength: 0, progressLength: 0 };
    }

    // Create a smooth curve through all positions
    const points: THREE.Vector3[] = [];
    
    // Add intermediate points for smoother curves
    for (let i = 0; i < positions.length; i++) {
      const current = new THREE.Vector3(...positions[i]);
      points.push(current);
      
      // Add intermediate point between current and next (except for last point)
      if (i < positions.length - 1) {
        const next = new THREE.Vector3(...positions[i + 1]);
        const midpoint = current.clone().lerp(next, 0.5);
        // Keep the trail closer to cards: minimal vertical offset
        midpoint.y += Math.sin(i * 0.5) * 0.5;
        points.push(midpoint);
      }
    }

    // Create a smooth catmull-rom curve
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(200);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const totalLength = curve.getLength();
    const progressLength = totalLength * progress;

    return { geometry, totalLength, progressLength };
  }, [positions, progress]);

  // Create progress-based partial geometry
  const progressGeometry = useMemo(() => {
    if (!geometry || progress === 0) return null;
    
    const positionAttribute = geometry.getAttribute('position');
    const totalPoints = positionAttribute.count;
    const progressPoints = Math.floor(totalPoints * progress);
    
    if (progressPoints < 2) return null;
    
    const progressPositions = new Float32Array(progressPoints * 3);
    for (let i = 0; i < progressPoints * 3; i++) {
      progressPositions[i] = positionAttribute.array[i];
    }
    
    const progressGeom = new THREE.BufferGeometry();
    progressGeom.setAttribute('position', new THREE.BufferAttribute(progressPositions, 3));
    
    return progressGeom;
  }, [geometry, progress]);

  // Animate the trail
  useFrame((state) => {
    if (!isVisible) return;
    
    // Animate the main trail line
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
    }
    
    // Animate the glow effect
    if (glowLineRef.current) {
      const material = glowLineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.3;
    }
  });

  if (!geometry || !isVisible) return null;

  return (
    <group>
      {/* Main trail line (full path) */}
      <Line
        ref={lineRef}
        points={geometry ? Array.from(geometry.attributes.position.array).reduce((acc: THREE.Vector3[], val: number, i: number) => {
          if (i % 3 === 0) acc.push(new THREE.Vector3(val, geometry.attributes.position.array[i + 1], geometry.attributes.position.array[i + 2]));
          return acc;
        }, []) : []}
        color="#00ffff"
        transparent
        opacity={0.3}
        lineWidth={2}
      />
      
      {/* Glow effect for main trail */}
      <Line
        ref={glowLineRef}
        points={geometry ? Array.from(geometry.attributes.position.array).reduce((acc: THREE.Vector3[], val: number, i: number) => {
          if (i % 3 === 0) acc.push(new THREE.Vector3(val, geometry.attributes.position.array[i + 1], geometry.attributes.position.array[i + 2]));
          return acc;
        }, []) : []}
        color="#00aaff"
        transparent
        opacity={0.1}
        lineWidth={4}
      />
      
      {/* Progress line (walked path) */}
      {progressGeometry && progress > 0 && (
        <>
          <Line
            points={Array.from(progressGeometry.attributes.position.array).reduce((acc: THREE.Vector3[], val: number, i: number) => {
              if (i % 3 === 0) acc.push(new THREE.Vector3(val, progressGeometry.attributes.position.array[i + 1], progressGeometry.attributes.position.array[i + 2]));
              return acc;
            }, [])}
            color="#00ff00"
            transparent
            opacity={0.8}
            lineWidth={3}
          />
          
          {/* Glow for progress line */}
          <Line
            points={Array.from(progressGeometry.attributes.position.array).reduce((acc: THREE.Vector3[], val: number, i: number) => {
              if (i % 3 === 0) acc.push(new THREE.Vector3(val, progressGeometry.attributes.position.array[i + 1], progressGeometry.attributes.position.array[i + 2]));
              return acc;
            }, [])}
            color="#88ff88"
            transparent
            opacity={0.4}
            lineWidth={6}
          />
        </>
      )}
      
      {/* Trail markers at collectible positions */}
      {positions.map((position, index) => (
        <group key={index} position={position}>
          {/* Marker sphere */}
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial 
              color={index / (positions.length - 1) <= progress ? "#00ff00" : "#00ffff"}
              emissive={index / (positions.length - 1) <= progress ? "#004400" : "#001144"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Marker glow */}
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial 
              color={index / (positions.length - 1) <= progress ? "#00ff00" : "#00ffff"}
              transparent
              opacity={0.2}
            />
          </mesh>
          
          {/* Trail number */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#444444"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
