'use client';

import { useEffect, useRef, useState } from 'react';
import { useCollectiblesStore, Collectible } from '~/store/collectibles';
import { BikeRider } from './BikeRider';
import { RoadEnvironment } from './RoadEnvironment';
import { CollectibleStone } from './CollectibleStone';
import { HologramDisplay } from './HologramDisplay';

export function Scene3D() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const movingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    selectedPath,
    recentCollectibles,
    myCollectibles,
    bikePosition,
    currentCollectibleIndex,
    selectedCollectible,
    showHologram,
    hasReachedEnd,
    moveBike,
    setCurrentCollectibleIndex,
    setSelectedCollectible,
    setShowHologram
  } = useCollectiblesStore();

  const currentCollectibles = selectedPath === 'recent' ? recentCollectibles : myCollectibles;

  // Initialize scene
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced keyboard navigation with movement detection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          handleMovement(() => moveBike('forward'));
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleMovement(() => moveBike('backward'));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveBike]);

  // Movement detection function
  const handleMovement = (moveAction: () => void) => {
    setIsMoving(true);
    moveAction();
    
    if (movingTimeoutRef.current) {
      clearTimeout(movingTimeoutRef.current);
    }
    
    movingTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 800);
  };

  // Handle stone interaction
  const handleStoneClick = (collectible: Collectible, index: number) => {
    setSelectedCollectible(collectible);
    setCurrentCollectibleIndex(index);
    setShowHologram(true);
  };

  const closeHologram = () => {
    setShowHologram(false);
    setSelectedCollectible(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-sky-300 to-green-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sceneRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 touch-none select-none"
      style={{
        perspective: '1200px',
        perspectiveOrigin: 'center 60%'
      }}
    >
      {/* 3D Scene Container */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translateZ(${-bikePosition * 2}px) rotateX(10deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Road Environment */}
        <RoadEnvironment 
          bikePosition={bikePosition}
          selectedPath={selectedPath}
          hasReachedEnd={hasReachedEnd}
        />

        {/* Collectible Stones along the road */}
        {currentCollectibles.map((collectible, index) => (
          <CollectibleStone
            key={collectible.id}
            collectible={collectible}
            index={index}
            position={index * 100}
            isNear={Math.abs(index - currentCollectibleIndex) <= 1}
            onClick={() => handleStoneClick(collectible, index)}
          />
        ))}

        {/* Enhanced Bike Rider with movement detection */}
        <BikeRider 
          position={bikePosition}
          isMoving={isMoving}
        />

        {/* End of road barrier */}
        {hasReachedEnd && (
          <div 
            className="absolute bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transform -translate-x-1/2"
            style={{
              left: '50%',
              top: '400px',
              transform: `translate3d(-50%, 0, ${currentCollectibles.length * 100 + 50}px)`,
            }}
          >
            End of Journey
          </div>
        )}
      </div>

      {/* Enhanced Mobile Navigation Controls with movement detection */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 px-4 py-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 shadow-2xl">
        <button
          onClick={() => handleMovement(() => moveBike('backward'))}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 touch-manipulation"
          disabled={currentCollectibleIndex <= 0}
        >
          <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Enhanced Position Progress Bar */}
        <div className="flex flex-col items-center min-w-[140px] px-2">
          <div className="text-white text-sm font-medium mb-1">
            <span className="text-cyan-400">{currentCollectibleIndex + 1}</span>
            <span className="text-gray-400 mx-1">of</span>
            <span className="text-purple-400">{currentCollectibles.length}</span>
          </div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${((currentCollectibleIndex + 1) / currentCollectibles.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {selectedPath === 'recent' ? 'Recent NFTs' : 'My Collection'}
          </div>
        </div>

        <button
          onClick={() => handleMovement(() => moveBike('forward'))}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 touch-manipulation"
          disabled={hasReachedEnd}
        >
          <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Compact Mobile Info Bar */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xs">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white border-opacity-20">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">
              {selectedPath === 'recent' ? 'Recent' : 'My Collection'}
            </span>
            <span className="text-xs opacity-75 hidden md:block">
              ↑↓ keys or tap to navigate
            </span>
          </div>
        </div>
      </div>

      {/* Touch instruction for mobile */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 md:hidden">
        <div className="bg-black bg-opacity-40 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white border-opacity-20">
          Tap stones
        </div>
      </div>

      {/* Hologram Display */}
      {showHologram && selectedCollectible && (
        <HologramDisplay
          collectible={selectedCollectible}
          onClose={closeHologram}
        />
      )}
    </div>
  );
}