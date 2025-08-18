'use client';

import { useState } from 'react';
import { useCollectiblesStore } from '~/store/collectibles';

interface PathSelectorProps {
  onPathSelected: () => void;
}

export function PathSelector({ onPathSelected }: PathSelectorProps) {
  const [selectedPath, setSelectedPath] = useState<'recent' | 'mycollection' | null>(null);
  const { setSelectedPath: setStorePath } = useCollectiblesStore();

  const handlePathSelect = (path: 'recent' | 'mycollection') => {
    setSelectedPath(path);
    setStorePath(path);
    
    // Delay to show selection animation
    setTimeout(() => {
      onPathSelected();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            Farcaster Collectible Explorer
          </h1>
          <p className="text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Choose your journey through the world of collectibles
          </p>
        </div>

        {/* Path selection cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Recent/Top Path */}
          <div 
            className={`relative cursor-pointer transform transition-all duration-500 hover:scale-105 ${
              selectedPath === 'recent' ? 'scale-105 ring-4 ring-blue-400' : ''
            }`}
            onClick={() => handlePathSelect('recent')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 h-80 flex flex-col justify-between relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white rounded-full"></div>
                <div className="absolute top-12 right-8 w-8 h-8 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-6 h-6 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white rounded-full"></div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Recent & Top Collectibles</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Explore the latest and most popular collectibles from the Farcaster community. 
                  Discover trending content and emerging creators.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-blue-100 font-medium">Spring Vibes</span>
              </div>

              {/* Selection indicator */}
              {selectedPath === 'recent' && (
                <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold animate-pulse">Selected!</div>
                </div>
              )}
            </div>
          </div>

          {/* My Collection Path */}
          <div 
            className={`relative cursor-pointer transform transition-all duration-500 hover:scale-105 ${
              selectedPath === 'mycollection' ? 'scale-105 ring-4 ring-orange-400' : ''
            }`}
            onClick={() => handlePathSelect('mycollection')}
          >
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 h-80 flex flex-col justify-between relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-6 left-6 w-10 h-10 border-2 border-white transform rotate-45"></div>
                <div className="absolute top-16 right-6 w-6 h-6 border-2 border-white transform rotate-12"></div>
                <div className="absolute bottom-12 left-8 w-8 h-8 border-2 border-white transform -rotate-12"></div>
                <div className="absolute bottom-6 right-12 w-12 h-12 border-2 border-white transform rotate-45"></div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">My Collection</h2>
                <p className="text-orange-100 text-lg leading-relaxed">
                  Journey through your personal collection of Farcaster casts and collectibles. 
                  Revisit your favorite moments and creations.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-red-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-yellow-600 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-orange-100 font-medium">Autumn Journey</span>
              </div>

              {/* Selection indicator */}
              {selectedPath === 'mycollection' && (
                <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold animate-pulse">Selected!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-gray-400 text-lg">
            Click on a path to begin your 3D collectible journey
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
            <span>• Use arrow keys to navigate</span>
            <span>• Click stones to view collectibles</span>
            <span>• Press ESC to close hologram</span>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}

// Add path selector animations
if (typeof window !== 'undefined' && !document.getElementById('path-selector-animations')) {
  const style = document.createElement('style');
  style.id = 'path-selector-animations';
  style.textContent = `
    @keyframes fade-in {
      from { 
        opacity: 0; 
        transform: translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    .animate-fade-in {
      animation: fade-in 1s ease-out forwards;
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
}