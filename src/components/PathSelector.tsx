'use client';

import { useState, useEffect } from 'react';
import { useCollectiblesStore } from '~/store/collectibles';

interface PathSelectorProps {
  onPathSelected: () => void;
}

export function PathSelector({ onPathSelected }: PathSelectorProps) {
  const [selectedPath, setSelectedPath] = useState<'recent' | 'mycollection' | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const { setSelectedPath: setStorePath } = useCollectiblesStore();

  const handlePathSelect = (path: 'recent' | 'mycollection') => {
    if (isLaunching) return;
    
    setSelectedPath(path);
    setStorePath(path);
    setIsLaunching(true);
    
    // Smooth transition with realistic timing
    setTimeout(() => {
      onPathSelected();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900  overflow-y-auto">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle animated stars */}
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Floating nebula effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Launch overlay */}
      {isLaunching && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Launch animation */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                {/* Rocket ship */}
                <div className="absolute inset-0 text-6xl animate-rocket-launch">🚀</div>
                {/* Exhaust trail */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-orange-500 to-yellow-400 blur-sm animate-exhaust opacity-80"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">
                {selectedPath === 'recent' ? '🌌 Launching to Recent Discoveries' : '🛸 Accessing Your Fleet'}
              </h2>
              <p className="text-cyan-300 text-lg">Preparing cosmic navigation systems...</p>
              
              {/* Loading bar */}
              <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full mx-auto px-6 py-12 z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-block mb-4 md:mb-6">
            <div className="text-6xl md:text-8xl mb-2 md:mb-4 animate-float">🌌</div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Farcaster Collectibles Explorer
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Navigate through the cosmos and discover Farcaster collectibles among the stars
          </p>
        </div>

        {/* Path selection */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Recent Discoveries */}
          <div 
            className={`group cursor-pointer transition-all duration-700 ease-out transform ${
              selectedPath === 'recent' 
                ? 'scale-105 -translate-y-2' 
                : 'hover:scale-105 hover:-translate-y-1'
            } ${isLaunching ? 'pointer-events-none' : ''}`}
            onClick={() => handlePathSelect('recent')}
          >
            <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-xl border-2 rounded-3xl p-6 md:p-8 h-80 md:h-96 transition-all duration-700 ${
              selectedPath === 'recent' 
                ? 'border-cyan-400 shadow-2xl shadow-cyan-400/25 bg-gradient-to-br from-cyan-900/20 to-slate-900/80' 
                : 'border-slate-600/50 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-400/10'
            }`}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🚀</div>
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Explore Recent 10 FC Cast Collectibles 
                  </h2>
                  <p className="text-slate-400 text-sm">Latest Collectible Cast findings</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Explore recently minted Farcaster Collectibles from across the Farcaster galaxy. 
                Discover trending content and emerging creators in the vast Farcaster universe.
              </p>

              {/* Stats */}
              

              {/* Selection indicator */}
              {selectedPath === 'recent' && (
                <div className="absolute inset-0 bg-cyan-400/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-bounce">✨</div>
                    <div className="text-cyan-300 text-xl font-bold">Mission Selected!</div>
                  </div>
                </div>
              )}

              {/* Hover effect particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Your Fleet */}
          <div 
            className={`group cursor-pointer transition-all duration-700 ease-out transform ${
              selectedPath === 'mycollection' 
                ? 'scale-105 -translate-y-2' 
                : 'hover:scale-105 hover:-translate-y-1'
            } ${isLaunching ? 'pointer-events-none' : ''}`}
            onClick={() => handlePathSelect('mycollection')}
          >
            <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-xl border-2 rounded-3xl p-6 md:p-8 h-80 md:h-96 transition-all duration-700 ${
              selectedPath === 'mycollection' 
                ? 'border-purple-400 shadow-2xl shadow-purple-400/25 bg-gradient-to-br from-purple-900/20 to-slate-900/80' 
                : 'border-slate-600/50 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-400/10'
            }`}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">🛸</div>
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    Explore Your Collection of FC Cast Collectibles
                  </h2>
                  <p className="text-slate-400 text-sm">Explore Your minted Casts</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Navigate to your personal fleet of collected Farcaster Collectibles.
                Revisit your favorite cosmic moments and digital artifacts.
              </p>

              

              {/* Selection indicator */}
              {selectedPath === 'mycollection' && (
                <div className="absolute inset-0 bg-purple-400/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-bounce">🌟</div>
                    <div className="text-purple-300 text-xl font-bold">Fleet Accessed!</div>
                  </div>
                </div>
              )}

              {/* Hover effect particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-lg md:text-xl text-slate-400 mb-6">
            Choose your cosmic journey to begin exploring the universe of  Farcaster collectibles
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-lg">🖱️</span>
              <span>Drag to explore</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <span>Scroll to zoom in/out</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⌨️</span>
              <span>WASD to navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🛸</span>
              <span>Click Cards to discover</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced animations with better performance
if (typeof window !== 'undefined' && !document.getElementById('universe-selector-animations')) {
  const style = document.createElement('style');
  style.id = 'universe-selector-animations';
  style.textContent = `
    @keyframes twinkle {
      0%, 100% { 
        opacity: 0.3; 
        transform: scale(0.8); 
      }
      50% { 
        opacity: 1; 
        transform: scale(1.2); 
      }
    }
    
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
      }
      33% { 
        transform: translateY(-10px) rotate(5deg); 
      }
      66% { 
        transform: translateY(-5px) rotate(-3deg); 
      }
    }
    
    @keyframes rocket-launch {
      0% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
      }
      50% { 
        transform: translateY(-20px) rotate(15deg) scale(1.1); 
      }
      100% { 
        transform: translateY(-100px) rotate(45deg) scale(0.8); 
      }
    }
    
    @keyframes exhaust {
      0%, 100% { 
        height: 1rem; 
        opacity: 0.6; 
      }
      50% { 
        height: 2rem; 
        opacity: 1; 
      }
    }
    
    @keyframes loading-bar {
      0% { 
        width: 0%; 
      }
      100% { 
        width: 100%; 
      }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-rocket-launch {
      animation: rocket-launch 2s ease-out forwards;
    }
    
    .animate-exhaust {
      animation: exhaust 0.3s ease-in-out infinite;
    }
    
    .animate-loading-bar {
      animation: loading-bar 2s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}