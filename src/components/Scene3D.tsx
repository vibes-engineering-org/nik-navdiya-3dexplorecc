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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          moveBike('forward');
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveBike('backward');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveBike]);

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
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-green-200"
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center center'
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

        {/* Bike Rider */}
        <BikeRider 
          position={bikePosition}
          isMoving={false}
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

      {/* Mobile Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 md:hidden">
        <button
          onClick={() => moveBike('backward')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-colors"
          disabled={currentCollectibleIndex <= 0}
        >
          ← Back
        </button>
        <button
          onClick={() => moveBike('forward')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-colors"
          disabled={hasReachedEnd}
        >
          Forward →
        </button>
      </div>

      {/* Position indicator */}
      <div className="absolute top-6 left-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
        <p className="text-sm">
          Position: {currentCollectibleIndex + 1} / {currentCollectibles.length}
        </p>
        <p className="text-xs opacity-75">
          {selectedPath === 'recent' ? 'Recent Collectibles' : 'My Collection'}
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute top-6 right-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg max-w-xs">
        <p className="text-xs">
          Use ↑↓ keys or buttons to navigate. Click stones to view collectibles.
        </p>
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