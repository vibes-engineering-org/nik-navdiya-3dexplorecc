'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCollectiblesStore } from '~/store/collectibles';

interface TrailCameraControllerProps {
  collectiblePositions: Array<[number, number, number]>;
  isTrailMode: boolean;
}

export function TrailCameraController({ collectiblePositions, isTrailMode }: TrailCameraControllerProps) {
  const { camera } = useThree();
  const { trailProgress, setTrailProgress } = useCollectiblesStore();
  const lookAhead = 0.04; // look further ahead so next card stays in view
  const desiredDistanceFromCard = 11; // closer to card
  const desiredHeightAboveCard = 100; // slightly lower to cards
  
  const [keys, setKeys] = React.useState<{[key: string]: boolean}>({});
  const trailCurve = useRef<THREE.CatmullRomCurve3 | null>(null);
  const lastProgressRef = useRef(trailProgress);

  // Create the trail curve
  const trailPath = useMemo(() => {
    if (collectiblePositions.length < 2) return null;

    // Create a smooth curve through all positions with camera-friendly offsets
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i < collectiblePositions.length; i++) {
      const current = new THREE.Vector3(...collectiblePositions[i]);
      
      // Offset camera position to be behind and above the collectible
      const offset = new THREE.Vector3(0, 8, 15);
      const cameraPos = current.clone().add(offset);
      points.push(cameraPos);
      
      // Add intermediate point between current and next (except for last point)
      if (i < collectiblePositions.length - 1) {
        const next = new THREE.Vector3(...collectiblePositions[i + 1]);
        const nextCameraPos = next.clone().add(offset);
        const midpoint = cameraPos.clone().lerp(nextCameraPos, 0.5);
        
        // Add some variation for smoother movement
        midpoint.y += Math.sin(i * 0.3) * 3;
        points.push(midpoint);
      }
    }

    const curve = new THREE.CatmullRomCurve3(points);
    trailCurve.current = curve;
    return curve;
  }, [collectiblePositions]);

  // Handle keyboard input for trail movement
  useEffect(() => {
    if (!isTrailMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [event.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [event.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTrailMode]);

  // Handle mouse wheel for trail movement
  useEffect(() => {
    if (!isTrailMode) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.01 : -0.01;
    

      setTrailProgress(Math.max(0, Math.min(1, trailProgress + delta)));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isTrailMode, setTrailProgress]);

  useFrame(() => {
    if (!isTrailMode || !trailPath || collectiblePositions.length < 2) return;

    // Handle forward/backward movement along trail
    const speed = 0.005; // Adjust speed as needed
    let newProgress = trailProgress;

    if (keys['w'] || keys['arrowup']) {
      newProgress = Math.min(1, trailProgress + speed);
    }
    if (keys['s'] || keys['arrowdown']) {
      newProgress = Math.max(0, trailProgress - speed);
    }

    // Update progress if changed
    if (newProgress !== trailProgress) {
      setTrailProgress(newProgress);
    }

    // Get camera position along the trail
    const cameraPosition = trailPath.getPoint(trailProgress);
    camera.position.copy(cameraPosition);

    // Determine current focus collectible
    const numSegments = Math.max(1, collectiblePositions.length - 1);
    const approxIndex = Math.round(trailProgress * numSegments);
    const focusIndex = Math.min(collectiblePositions.length - 1, Math.max(0, approxIndex));
    const focusCard = new THREE.Vector3(...collectiblePositions[focusIndex]);

    // Compute desired camera position relative to focus card
    // Use tangent of curve (direction of travel) to place camera behind the target
    const aheadT = Math.min(1, trailProgress + lookAhead);
    const pathPointAhead = trailPath.getPoint(aheadT);
    const pathPointNow = trailPath.getPoint(trailProgress);
    const travelDir = pathPointAhead.clone().sub(pathPointNow).normalize();
    
    const desiredPosition = focusCard
      .clone()
      .add(travelDir.clone().multiplyScalar(-desiredDistanceFromCard))
      .add(new THREE.Vector3(0, desiredHeightAboveCard, 0));

    // Smoothly move the camera towards the desired position
    camera.position.lerp(desiredPosition, 0.08);

    // Look directly at the card (slightly above center for better framing)
    const lookAtTarget = focusCard.clone().add(new THREE.Vector3(0, 1.5, 0));
    const direction = lookAtTarget.clone().sub(camera.position).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
    camera.quaternion.slerp(targetQuaternion, 0.08);

    lastProgressRef.current = trailProgress;
  });

  // Reset camera position when trail mode is disabled
  useEffect(() => {
    if (!isTrailMode && lastProgressRef.current > 0) {
      // Smoothly transition back to free camera
      setTrailProgress(0);
    }
  }, [isTrailMode, setTrailProgress]);

  return null; // This component doesn't render anything visual
}
