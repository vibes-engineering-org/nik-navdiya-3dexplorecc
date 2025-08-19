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

// Spaceship Component representing collectible casts
function Spaceship({ 
  item, 
  position, 
  onSpaceshipClick,
  showHologram 
}: { 
  item: any; 
  position: [number, number, number]; 
  onSpaceshipClick: (id: string) => void;
  showHologram: boolean;
}) {
  const spaceshipRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (spaceshipRef.current) {
      // Gentle floating and rotation animation
      spaceshipRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      spaceshipRef.current.rotation.y += 0.005;
      
      // Glowing effect when hovered
      if (hovered) {
        spaceshipRef.current.rotation.x += 0.01;
        spaceshipRef.current.rotation.z += 0.01;
      }
    }
  });

  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
        <group
          ref={spaceshipRef}
          onClick={() => onSpaceshipClick(item.id)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {/* Main Spaceship Hull */}
          <mesh>
            <coneGeometry args={[1, 3, 8]} />
            <meshStandardMaterial 
              color={hovered ? "#00ffff" : "#silver"} 
              metalness={0.9}
              roughness={0.1}
              emissive={hovered ? "#0088cc" : "#000000"}
              emissiveIntensity={hovered ? 0.3 : 0}
            />
          </mesh>

          {/* Spaceship Wings */}
          <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.3, 2, 0.1]} />
            <meshStandardMaterial color="#4169E1" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.3, 2, 0.1]} />
            <meshStandardMaterial color="#4169E1" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Engine Exhausts */}
          <group position={[0, -2, 0]}>
            <mesh position={[-0.5, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 0.8]} />
              <meshStandardMaterial 
                color="#ff4500" 
                emissive="#ff2200"
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 0.8]} />
              <meshStandardMaterial 
                color="#ff4500" 
                emissive="#ff2200"
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.25, 1]} />
              <meshStandardMaterial 
                color="#ff6600" 
                emissive="#ff3300"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>

          {/* Energy Core */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial 
              color="#00ffff" 
              emissive="#0088ff"
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Navigation Lights */}
          {Array.from({ length: 4 }, (_, i) => (
            <mesh key={i} position={[
              Math.cos((i * Math.PI * 2) / 4) * 1.2,
              0.8,
              Math.sin((i * Math.PI * 2) / 4) * 1.2
            ]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial 
                color="#00ff00" 
                emissive="#00ff00"
                emissiveIntensity={1}
              />
            </mesh>
          ))}

          {/* Energy Particles around spaceship when hovered */}
          {hovered && (
            <group>
              {Array.from({ length: 8 }, (_, i) => (
                <Float key={i} speed={3} rotationIntensity={2} floatIntensity={3}>
                  <mesh position={[
                    Math.cos((i * Math.PI * 2) / 8) * 2.5,
                    Math.sin(i * 0.7) * 1,
                    Math.sin((i * Math.PI * 2) / 8) * 2.5
                  ]}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial 
                      color="#00ffff" 
                      emissive="#0088ff"
                      emissiveIntensity={1}
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

      {/* 3D Holographic Card above spaceship */}
      {showHologram && (
        <group position={[0, 4, 0]}>
          <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
            {/* Holographic Base */}
            <mesh>
              <planeGeometry args={[4, 5]} />
              <meshStandardMaterial 
                color="#00ffff"
                transparent
                opacity={0.1}
                emissive="#0088ff"
                emissiveIntensity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Holographic Frame */}
            <mesh position={[0, 0, 0.01]}>
              <ringGeometry args={[1.8, 2.1, 32]} />
              <meshStandardMaterial 
                color="#00ffff"
                emissive="#0088ff"
                emissiveIntensity={0.8}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Content Overlay */}
            <Html
              position={[0, 0, 0.1]}
              center
              distanceFactor={6}
              transform
              sprite
            >
              <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 max-w-sm border border-cyan-400 shadow-2xl">
                {/* Holographic scan lines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent opacity-30 animate-pulse rounded-xl"></div>
                
                <div className="relative z-10 space-y-3">
                  {/* NFT / Minter info (if available) */}
                  {(item.minter?.username || item.minter?.display_name || item.minter?.pfp_url) && (
                    <div className="flex items-center space-x-3">
                      {item.minter?.pfp_url ? (
                        <img src={item.minter.pfp_url} alt={item.minter?.display_name || item.minter?.username || 'Minter'} className="w-10 h-10 rounded-full border-2 border-cyan-400 shadow-lg" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400" />
                      )}
                      <div>
                        <p className="font-semibold text-cyan-300 text-sm">
                          {item.minter?.display_name || 'Unknown Minter'}
                        </p>
                        {item.minter?.username && (
                          <p className="text-cyan-500 text-xs">@{item.minter.username}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="space-y-2">
                    {item.title && (
                      <p className="text-white text-sm font-semibold">{item.title}</p>
                    )}
                    {item.description && (
                      <p className="text-white/90 text-xs leading-relaxed">{item.description}</p>
                    )}
                    
                    {/* Media preview */}
                    {item.image && (
                      <img src={item.image} alt="Collectible preview" className="w-full h-24 object-cover rounded border border-cyan-400/50" />
                    )}
                  </div>
                  
                  {/* Token and chain */}
                  <div className="flex flex-wrap gap-2 text-xs text-cyan-300">
                    {item.tokenId && <span># {item.tokenId}</span>}
                    {item.chain && <span>• {item.chain}</span>}
                  </div>

                  {/* Timestamp */}
                  <div className="text-gray-400 text-xs">
                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>
            </Html>

            {/* Holographic Particle Effects */}
            <group>
              {Array.from({ length: 20 }, (_, i) => (
                <Float key={i} speed={1 + i * 0.1} rotationIntensity={1} floatIntensity={2}>
                  <mesh position={[
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 2
                  ]}>
                    <sphereGeometry args={[0.02]} />
                    <meshStandardMaterial 
                      color="#00ffff"
                      emissive="#00ffff"
                      emissiveIntensity={0.8}
                      transparent
                      opacity={0.6}
                    />
                  </mesh>
                </Float>
              ))}
            </group>
          </Float>
        </group>
      )}
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
function UniverseEnvironment() {
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

      {/* Central Star/Sun */}
      <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshStandardMaterial 
            color="#ffaa00"
            emissive="#ff6600"
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>
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
export function UniverseScene() {
  const { selectedPath } = useCollectiblesStore();
  const { recentMints, isLoading: isLoadingRecent } = useRecentMintEvents();
  const { userNFTs, isLoadingUserNFTs } = useContractNFTs();

  const [hoveredSpaceship, setHoveredSpaceship] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  type SpaceItem = {
    id: string;
    tokenId?: string;
    image?: string;
    title?: string;
    description?: string;
    chain?: string;
    timestamp?: number;
    minter?: { username?: string; display_name?: string; pfp_url?: string } | null;
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
      minter: m.minterFarcasterUser || null,
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
      minter: null,
    }));
  }, [userNFTs]);

  const currentItems = selectedPath === 'recent' ? recentItems : userItems;

  // Handle spaceship click
  const handleSpaceshipClick = (id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  // Generate spaceship positions in a 3D spiral around the universe
  const getSpaceshipPosition = (index: number): [number, number, number] => {
    const radius = 30 + index * 8;
    const angle = index * 0.8;
    const height = Math.sin(index * 0.3) * 20;
    
    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ];
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 0, 50], fov: 75 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance"
        }}
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
        <UniverseEnvironment />
        
        {/* Spaceship Collectibles */}
        {currentItems.map((item, index) => (
          <Spaceship
            key={item.id}
            item={item}
            position={getSpaceshipPosition(index)}
            onSpaceshipClick={handleSpaceshipClick}
            showHologram={selectedItemId === item.id}
          />
        ))}

        {/* Space Exploration Camera Controls */}
        <SpaceExplorationCamera />

        {/* Space Fog for depth */}
        <fog attach="fog" args={['#000020', 50, 300]} />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm border border-cyan-400/50">
        <div className="text-center space-y-2">
          <p className="text-sm text-cyan-300">🚀 Exploring the Universe</p>
          <div className="grid-cols-2 gap-x-8 gap-y-1 text-xs hidden md:grid text-gray-300">
            <span>🖱️ Drag to rotate</span>
            <span>🔍 Scroll to zoom</span>
            <span>⌨️ WASD/Arrows to fly</span>
            <span>Q/E for up/down</span>
            <span> Click spaceships</span>
            <span>Right-click + drag to pan</span>
          </div>
          <div className="md:hiddengrid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-300">
            🛸Touch spaceships to view collectibles
          </div>
          <p className="text-xs text-cyan-400">
            {currentItems.length} spaceships discovered in {selectedPath === 'recent' ? 'recent space' : 'your fleet'}
          </p>
        </div>
      </div>

      {/* Collection Info */}
      <div className="absolute hidden md:block top-16 left-6 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm border border-cyan-400/50">
        <h2 className="text-lg font-bold text-cyan-300 mb-2">
          {selectedPath === 'recent' ? '🌌 Recent Discoveries' : '🚁 Your Fleet'}
        </h2>
        <p className="text-sm text-gray-300">
          Exploring collectibles in the vast universe
        </p>
        <div className="text-xs text-cyan-400 mt-2">
          {hoveredSpaceship ? `Scanning: ${hoveredSpaceship}` : 'Navigate to discover'}
        </div>
      </div>
    </div>
  );
}
