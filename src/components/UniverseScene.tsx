'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars,
  Sphere,
  Text,
  Float,
  Html,
  Environment,
  PerspectiveCamera,
  useTexture,
  KeyboardControls
} from '@react-three/drei';
import * as THREE from 'three';
import { useCollectiblesStore } from '~/store/collectibles';
import { useRecentMintEvents } from '~/hooks/use-recent-mints';
import { useContractNFTs } from '~/hooks/use-contract-nfts';
import { CollectibleModal } from './CollectibleModal';
import { useProfile } from '~/hooks/use-profile';
import { TrailLine } from './TrailLine';
import { TrailCameraController } from './TrailCameraController';

// 3D NFT Card Component representing collectible casts
function NFTCard({ 
  item, 
  position, 
  onCardClick,
  onSeeMoreClick
}: { 
  item: any; 
  position: [number, number, number]; 
  onCardClick: (id: string) => void;
  onSeeMoreClick: (id: string) => void;
}) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (cardRef.current) {
      // Gentle floating animation
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Subtle tilt when hovered
      if (hovered) {
        cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, 0.1, 0.1);
        cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, 0.05, 0.1);
      } else {
        cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, 0, 0.1);
        cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, 0, 0.1);
      }
    }
  });

  // Get preview text (first few words)
  const getPreviewText = (text: string | undefined) => {
    if (!text) return "No description available";
    
    return text.length > 8 ? text.slice(0, 30) + '...' : text;
  };

  return (
    <group position={position}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group
          ref={cardRef}
          onClick={() => onCardClick(item.id)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {/* Card Base */}
          <mesh>
            <boxGeometry args={[4, 5, 0.2]} />
            <meshStandardMaterial 
              color={hovered ? "#1a1a2e" : "#16213e"} 
              metalness={0.1}
              roughness={0.3}
              emissive={hovered ? "#0f3460" : "#000000"}
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </mesh>

          {/* Card Border/Frame */}
          <mesh position={[0, 0, 0.11]}>
            <boxGeometry args={[3.8, 4.8, 0.05]} />
            <meshStandardMaterial 
              color={hovered ? "#00d4ff" : "#0066cc"} 
              metalness={0.8}
              roughness={0.2}
              emissive={hovered ? "#0088ff" : "#004488"}
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Glowing edges when hovered */}
          {hovered && (
            <>
              {/* Top edge */}
              <mesh position={[0, 2.4, 0.12]}>
                <boxGeometry args={[3.8, 0.05, 0.05]} />
                <meshStandardMaterial 
                  color="#00ffff" 
                  emissive="#00ffff"
                  emissiveIntensity={1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Bottom edge */}
              <mesh position={[0, -2.4, 0.12]}>
                <boxGeometry args={[3.8, 0.05, 0.05]} />
                <meshStandardMaterial 
                  color="#00ffff" 
                  emissive="#00ffff"
                  emissiveIntensity={1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Left edge */}
              <mesh position={[-1.9, 0, 0.12]}>
                <boxGeometry args={[0.05, 4.8, 0.05]} />
                <meshStandardMaterial 
                  color="#00ffff" 
                  emissive="#00ffff"
                  emissiveIntensity={1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Right edge */}
              <mesh position={[1.9, 0, 0.12]}>
                <boxGeometry args={[0.05, 4.8, 0.05]} />
                <meshStandardMaterial 
                  color="#00ffff" 
                  emissive="#00ffff"
                  emissiveIntensity={1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </>
          )}

          {/* Card Content Overlay */}
          <Html
            position={[0, 0, 0.15]}
            center
            distanceFactor={8}
            transform
            sprite
          >
            <div className="w-80 h-96 bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-md rounded-xl p-6 border border-blue-400/50 shadow-2xl" onClick={() => {
                
                    onSeeMoreClick(item.id);
            }}>
              {/* Header with PFP and username */}
              <div className="flex items-center space-x-3 mb-4">
                {item.auther?.pfp_url ? (
                  <img 
                    src={item.auther.pfp_url} 
                    alt={item.auther?.display_name || item.auther?.username || 'Auther'} 
                    className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-lg"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 flex items-center justify-center">
                    <span className="text-blue-300 text-lg font-bold">
                      {item.auther?.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-blue-300 text-base">
                    {item.auther?.display_name || 'Unknown Auther'}
                  </p>
                  {item.auther?.username && (
                    <p className="text-blue-400 text-sm">@{item.auther.username}</p>
                  )}
                </div>
              </div>

              {/* NFT Image */}
              {item.image && (
                <div className="mb-4 rounded-lg overflow-hidden border border-blue-400/30">
                  <img 
                    src={item.image} 
                    alt="NFT preview" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              {/* NFT Title */}
              {item.title && (
                <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
                  {item.title}
                </h3>
              )}

              {/* Preview text */}
              <div className="space-y-3 flex-1">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {getPreviewText(item.description)}
                </p>
                
                {/* See More Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeeMoreClick(item.id);
                  }}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded-lg border border-blue-400/50 transition-all duration-200 hover:border-blue-300"
                >
                  See More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              
            </div>
          </Html>

          {/* Floating particles around card when hovered */}
          {hovered && (
            <group>
              {Array.from({ length: 12 }, (_, i) => (
                <Float key={i} speed={2 + i * 0.2} rotationIntensity={1} floatIntensity={2}>
                  <mesh position={[
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 3
                  ]}>
                    <sphereGeometry args={[0.03]} />
                    <meshStandardMaterial 
                      color="#00d4ff"
                      emissive="#00d4ff"
                      emissiveIntensity={0.8}
                      transparent
                      opacity={0.7}
                    />
                  </mesh>
                </Float>
              ))}
            </group>
          )}
        </group>
      </Float>
    </group>
  );
}

// Planet Component
function Planet({ position, size, color, rotationSpeed = 0.01 }: {
  position: [number, number, number];
  size: number;
  color: string;
  rotationSpeed?: number;
}) {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <Float speed={0.2} rotationIntensity={0.1} floatIntensity={0.1}>
      <mesh ref={planetRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// Nebula Cloud Component
function NebulaCloud({ position, color }: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <Float speed={0.1} rotationIntensity={0.05} floatIntensity={0.3}>
      <mesh position={position}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// Universe Environment Component
function UniverseEnvironment({ logoSrc }: { logoSrc?: string }) {
  return (
    <group>
      {/* Background Stars */}
      <Stars 
        radius={300} 
        depth={100} 
        count={8000} 
        factor={6} 
        saturation={0.5} 
        fade={true}
        speed={0.5}
      />

      {/* Planets scattered throughout the universe */}
      <Planet position={[20, 10, -30]} size={3} color="#ff6b47" rotationSpeed={0.005} />
      <Planet position={[-40, -15, 50]} size={2.5} color="#4ecdc4" rotationSpeed={0.008} />
      <Planet position={[60, 25, -80]} size={4} color="#45b7d1" rotationSpeed={0.003} />
      <Planet position={[-80, 40, 20]} size={2} color="#f7dc6f" rotationSpeed={0.012} />
      <Planet position={[100, -30, 60]} size={3.5} color="#bb8fce" rotationSpeed={0.006} />
      <Planet position={[-60, 80, -40]} size={1.8} color="#82e0aa" rotationSpeed={0.015} />
      <Planet position={[-100, 100, -100]} size={1.8} color="#e96ee1" rotationSpeed={0.015} />
      <Planet position={[-50, 10, 100]} size={1.8} color="#8e1dd4" rotationSpeed={0.015} />

      {/* Nebula Clouds */}
      <NebulaCloud position={[0, 0, -100]} color="#ff00ff" />
      <NebulaCloud position={[80, 50, 20]} color="#00ffff" />
      <NebulaCloud position={[-100, -40, 80]} color="#ffff00" />
      <NebulaCloud position={[40, -60, -60]} color="#ff0080" />

      {/* Distant Galaxy */}
      <Float speed={0.05} rotationIntensity={0.02} floatIntensity={0.1}>
        <mesh position={[0, 0, -200]}>
          <ringGeometry args={[15, 25, 64]} />
          <meshStandardMaterial 
            color="#ffffff"
            transparent
            opacity={0.3}
            emissive="#8a2be2"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      

      {/* Logo Overlay */}
      {logoSrc && (
        <Html
          position={[0, 0, 0.1]}
          center
          distanceFactor={10}
          transform
          sprite
        >
          <img 
            src={logoSrc} 
            alt="Logo" 
            className="w-60 h-60 opacity-70"
          />
        </Html>
      )}
    </group>
  );
}

// Enhanced Camera Controller for space exploration
function SpaceExplorationCamera() {
  const { camera } = useThree();
  const [keys, setKeys] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
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
  }, []);

  useFrame(() => {
    const speed = 2;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();
    
    if (keys['w'] || keys['arrowup']) {
      camera.position.add(direction.multiplyScalar(-speed));
    }
    if (keys['s'] || keys['arrowdown']) {
      camera.position.add(direction.multiplyScalar(speed));
    }
    if (keys['a'] || keys['arrowleft']) {
      camera.position.add(right.multiplyScalar(-speed));
    }
    if (keys['d'] || keys['arrowright']) {
      camera.position.add(right.multiplyScalar(speed));
    }
    if (keys['q']) {
      camera.position.y += speed;
    }
    if (keys['e']) {
      camera.position.y -= speed;
    }
  });

  return (
    <OrbitControls
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      zoomSpeed={1.2}
      panSpeed={2.0}
      rotateSpeed={0.8}
      minDistance={5}
      maxDistance={800}
      autoRotate={false}
      enableDamping={true}
      dampingFactor={0.05}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
    />
  );
}

// Main Universe Scene Component
export function UniverseScene({ setCurrentView, logoSrc }: { setCurrentView: React.Dispatch<React.SetStateAction<'selector' | 'explorer'>>, logoSrc?: string }) {
  const { 
    selectedPath, 
    isTrailMode, 
    trailProgress, 
    setIsTrailMode, 
    setTrailProgress 
  } = useCollectiblesStore();
  const { recentMints, isLoading: isLoadingRecent } = useRecentMintEvents();
  const { userNFTs, isLoadingUserNFTs } = useContractNFTs();
  const { username, displayName, pfpUrl, fid } = useProfile();


  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAutoTrail, setIsAutoTrail] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const animRef = useRef<number | null>(null);

  type SpaceItem = {
    id: string;
    tokenId?: string;
    image?: string;
    title?: string;
    description?: string;
    chain?: string;
    timestamp?: number;
    castUrl?: string;
    minter?: { username?: string; display_name?: string; pfp_url?: string } | null;
    auther?: { username?: string; display_name?: string; pfp_url?: string } | null;
  };

  // Map hooks to unified items
  const recentItems: SpaceItem[] = useMemo(() => {
    return (recentMints || []).map((m) => ({
      id: m.transactionHash || m.tokenId,
      tokenId: m.tokenId,
      image: m.metadata?.image || (m.metadata as any)?.image_url,
      title: m.metadata?.name,
      description: m.metadata?.description as any,
      chain: m.chain,
      timestamp: m.timestamp,
      castUrl: m.metadata?.external_url,
      minter: m.minterFarcasterUser || null,
      auther: m.autherFarcasterUser || null,
    }));
  }, [recentMints]);

  const userItems: SpaceItem[] = useMemo(() => {
    return (userNFTs || []).map((n) => ({
      id: `user-${n.tokenId}`,
      tokenId: n.tokenId,
      image: n.metadata?.image || (n.metadata as any)?.image_url,
      title: n.metadata?.name,
      description: n.metadata?.description as any,
      chain: n.chain,
      timestamp: n.mintTime ? Date.parse(n.mintTime) : undefined,
      castUrl: n.metadata?.external_url,
      minter: { username, display_name: displayName, pfp_url:pfpUrl, fid },
      auther: n.auther || null,
    }));
  }, [userNFTs, username, displayName, pfpUrl, fid]);

  const currentItems = selectedPath === 'recent' ? recentItems : userItems;
  // Get positions for trail
  const collectiblePositions = useMemo(() => {
    return currentItems.map((_, index) => getCardPosition(index));
  }, [currentItems]);

  // Handle trail toggle
  const handleTrailToggle = () => {
    if (isTrailMode) {
      setIsTrailMode(false);
      setTrailProgress(0);
      setIsAutoTrail(false);
      setCurrentWaypoint(0);
    } else {
      setIsTrailMode(true);
      setTrailProgress(0);
      setCurrentWaypoint(0);
    }
  };

  // Auto-advance along trail for mobile
  useEffect(() => {
    let rafId: number;
    let lastTs = 0;
    const speedPerSec = 0.12; // fraction per second
    const step = (ts: number) => {
      if (!isTrailMode || !isAutoTrail) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      setTrailProgress(
        Math.min(1, trailProgress + speedPerSec * dt)
        );
      if (isTrailMode && isAutoTrail) rafId = requestAnimationFrame(step);
    };
    if (isTrailMode && isAutoTrail) rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isTrailMode, isAutoTrail, setTrailProgress]);

  // Smoothly animate to a specific collectible index along the trail
  const goToIndex = (targetIndex: number) => {
    if (!isTrailMode || currentItems.length === 0) return;
    const maxIndex = Math.max(0, currentItems.length - 1);
    const clamped = Math.min(maxIndex, Math.max(0, targetIndex));
    const targetProgress = maxIndex === 0 ? 0 : clamped / maxIndex;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const durationMs = 650;
    const start = performance.now();
    const startProgress = trailProgress;
    const delta = targetProgress - startProgress;

    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (ts: number) => {
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeInOut(t);
      setTrailProgress(startProgress + delta * eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setCurrentWaypoint(clamped);
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  // Keep currentWaypoint roughly in sync during auto-walk/manual changes
  useEffect(() => {
    if (currentItems.length === 0) return;
    const maxIndex = Math.max(0, currentItems.length - 1);
    const approxIndex = Math.round(trailProgress * maxIndex);
    setCurrentWaypoint(Math.min(maxIndex, Math.max(0, approxIndex)));
  }, [trailProgress, currentItems.length]);

  // Handle card click
  const handleCardClick = (id: string) => {
    const item = currentItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  // Handle see more click
  const handleSeeMoreClick = (id: string) => {
    const item = currentItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  // Generate card positions in a 3D spiral around the universe
  function getCardPosition(index: number): [number, number, number] {
    const radius = 25 + index * 6;
    const angle = index * 0.6;
    const height = Math.sin(index * 0.4) * 6; // reduced vertical spread

    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ];
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 50], fov: 75 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance"
        }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Lighting for space environment */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} distance={100} />
        <directionalLight 
          position={[50, 50, 50]} 
          intensity={0.5}
          castShadow
        />

        {/* Space Environment */}
        <color attach="background" args={['#000008']} />
        <UniverseEnvironment logoSrc={logoSrc} />
        
        {/* Floating Space Debris */}
        {Array.from({ length: 50 }, (_, i) => (
          <Float key={i} speed={0.1 + Math.random() * 0.2} rotationIntensity={0.5} floatIntensity={0.3}>
            <mesh position={[
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200
            ]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial 
                color="#666666"
                transparent
                opacity={0.3}
                emissive="#333333"
                emissiveIntensity={0.1}
              />
            </mesh>
          </Float>
        ))}
        
        {/* NFT Card Collectibles */}
        {currentItems.map((item, index) => (
          <NFTCard
            key={item.id + index}
            item={item}
            position={getCardPosition(index)}
            onCardClick={handleCardClick}
            onSeeMoreClick={handleSeeMoreClick}
          />
        ))}

        {/* Trail Line */}
        <TrailLine 
          positions={collectiblePositions}
          isVisible={isTrailMode}
          progress={trailProgress}
        />

        {/* Camera Controls */}
        {isTrailMode ? (
          <TrailCameraController 
            collectiblePositions={collectiblePositions}
            isTrailMode={isTrailMode}
          />
        ) : (
          <SpaceExplorationCamera />
        )}

        {/* Space Fog for depth */}
        <fog attach="fog" args={['#000020', 50, 300]} />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm border border-cyan-400/50 z-10">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <p className="text-sm text-cyan-300">
              {isTrailMode ? '🚶‍♂️ Walking on Trail' : '🚀 Free Exploration'}
            </p>
            
            {/* Trail Toggle Button */}
            <button
              onClick={handleTrailToggle}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                isTrailMode 
                  ? 'bg-green-600/30 text-green-300 border border-green-400/50 hover:bg-green-600/50' 
                  : 'bg-cyan-600/30 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-600/50'
              }`}
            >
              {isTrailMode ? 'Exit Trail' : 'Walk on Trail'}
            </button>
          </div>
          
          {/* Trail Progress */}
          {isTrailMode && (
            <div className="text-xs text-green-300">
              Trail Progress: {Math.round(trailProgress * 100)}% 
              <span className="text-gray-400 ml-2">
                ({Math.floor(trailProgress * currentItems.length) + 1}/{currentItems.length})
              </span>
            </div>
          )}
          
          <div className="grid-cols-2 gap-x-8 gap-y-1 text-xs hidden md:grid text-gray-300">
            {isTrailMode ? (
              <>
                <span>⌨️ W/↑ Move forward</span>
                <span>⌨️ S/↓ Move backward</span>
                <span>🔍 Scroll to navigate</span>
                <span>🃏 Click NFT cards</span>
              </>
            ) : (
              <>
                <span>🖱️ Drag to rotate</span>
                <span>🔍 Scroll to zoom</span>
                <span>⌨️ WASD/Arrows to fly</span>
                <span>Q/E for up/down</span>
                <span>🃏 Click NFT cards</span>
                <span>Right-click + drag to pan</span>
              </>
            )}
          </div>
          <div className="md:hidden grid grid-cols-1 gap-x-8 gap-y-1 text-xs text-gray-300">
            {isLoadingRecent || isLoadingUserNFTs ? 'Loading...' : (
              isTrailMode ? (
                <div className="flex items-center justify-center space-x-3">
                  <button
                    className="px-3 py-1 rounded-lg bg-green-600/30 text-green-300 border border-green-400/50"
                    onClick={() => goToIndex(currentWaypoint - 1)}
                  >
                    ◀ Back
                  </button>
                  
                  <button
                    className="px-3 py-1 rounded-lg bg-green-600/30 text-green-300 border border-green-400/50"
                    onClick={() => goToIndex(currentWaypoint + 1)}
                  >
                    Next ▶
                  </button>
                </div>
              ) : (
                '🃏 Touch NFT cards to view collectibles'
              )
            )}
          </div>
          <p className="text-xs text-cyan-400">
            {currentItems.length} NFT cards discovered in {selectedPath === 'recent' ? 'recent space' : 'your fleet'}
          </p>
        </div>
      </div>

      {/* Collection Info */}
      <div className="absolute hidden md:block top-16 left-6 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm border border-cyan-400/50 z-10">
        <h2 className="text-lg font-bold text-cyan-300 mb-2">
          {selectedPath === 'recent' ? '🌌 Recent Discoveries' : '🚁 Your Fleet'}
        </h2>
        <p className="text-sm text-gray-300">
          Exploring collectibles in the vast universe
        </p>
        <div className="text-xs text-cyan-400 mt-2">
          {hoveredCard ? `Scanning: ${hoveredCard}` : 'Navigate to discover'}
        </div>
      </div>
      {/* Back to path selector button */}
          <button
            onClick={() => setCurrentView('selector')}
            className="absolute top-16 right-6 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all z-10"
          >
            ← <span className="text-xs hidden md:inline">Change Path</span>
          </button>

      {/* Collectible Modal */}
      <CollectibleModal
        item={selectedItem}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
