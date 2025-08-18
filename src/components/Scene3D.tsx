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
    startAutoCycling,
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
        case 'ArrowRight':
          event.preventDefault();
          handleMovement(() => moveBike('forward'));
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          event.preventDefault();
          handleMovement(() => moveBike('backward'));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveBike]);

  // Touch/Swipe gesture support for mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.changedTouches[0].screenX;
      touchStartY = event.changedTouches[0].screenY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      touchEndX = event.changedTouches[0].screenX;
      touchEndY = event.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 50;

      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - move forward
          handleMovement(() => moveBike('forward'));
        } else {
          // Swipe left - move backward  
          handleMovement(() => moveBike('backward'));
        }
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY < 0) {
          // Swipe up - move forward
          handleMovement(() => moveBike('forward'));
        } else {
          // Swipe down - move backward
          handleMovement(() => moveBike('backward'));
        }
      }
    };

    const sceneElement = sceneRef.current;
    if (sceneElement) {
      sceneElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      sceneElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (sceneElement) {
        sceneElement.removeEventListener('touchstart', handleTouchStart);
        sceneElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
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

      {/* Enhanced Mobile Navigation Controls with improved touch interactions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-3 w-full max-w-sm px-4">
        {/* Auto-cycle button for demo */}
        <button
          onClick={() => startAutoCycling()}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm font-medium backdrop-blur-sm border border-white border-opacity-20"
        >
          Auto Cycle Demo
        </button>

        {/* Main navigation controls */}
        <div className="flex items-center space-x-4 px-6 py-4 bg-black bg-opacity-70 backdrop-blur-md rounded-3xl border border-white border-opacity-30 shadow-2xl w-full">
          <button
            onClick={() => handleMovement(() => moveBike('backward'))}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95 disabled:opacity-40 touch-manipulation min-w-[56px] min-h-[56px] flex items-center justify-center"
            disabled={currentCollectibleIndex <= 0}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Enhanced Position Progress Bar with better mobile layout */}
          <div className="flex flex-col items-center min-w-[160px] px-3">
            <div className="text-white text-base font-semibold mb-2">
              <span className="text-cyan-300">{currentCollectibleIndex + 1}</span>
              <span className="text-gray-300 mx-2">of</span>
              <span className="text-purple-300">{currentCollectibles.length}</span>
            </div>
            <div className="w-28 h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner border border-gray-600">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 transition-all duration-700 ease-out shadow-sm rounded-full"
                style={{ width: `${((currentCollectibleIndex + 1) / currentCollectibles.length) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-300 mt-2 font-medium">
              {selectedPath === 'recent' ? 'Recent NFTs' : 'My Collection'}
            </div>
          </div>

          <button
            onClick={() => handleMovement(() => moveBike('forward'))}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95 disabled:opacity-40 touch-manipulation min-w-[56px] min-h-[56px] flex items-center justify-center"
            disabled={hasReachedEnd}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Info Bar with better visibility */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="bg-black bg-opacity-70 backdrop-blur-md text-white px-5 py-3 rounded-2xl border border-white border-opacity-30 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-semibold text-base text-cyan-300">
                {selectedPath === 'recent' ? 'Recent NFTs' : 'My Collection'}
              </span>
              <span className="text-xs text-gray-300 opacity-80">
                {currentCollectibles.length} items to explore
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-300 opacity-75 md:block">
                Swipe • Tap buttons • Arrow keys
              </div>
              <div className="text-xs text-purple-300 font-medium mt-1">
                {isMoving ? 'Cycling...' : 'Paused'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Gesture Instructions */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 md:hidden z-10">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl border border-white border-opacity-20 shadow-lg">
          <div className="text-center">
            <div className="font-medium text-cyan-300 mb-1">Tap NFT stones</div>
            <div className="text-xs text-gray-300">Swipe ← → to move</div>
          </div>
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