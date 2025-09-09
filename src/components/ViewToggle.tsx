'use client';

import { useState } from 'react';

interface ViewToggleProps {
  activeView: 'recent' | 'mycollection';
  onViewChange: (view: 'recent' | 'mycollection') => void;
  isLoading?: boolean;
}

export function ViewToggle({ activeView, onViewChange, isLoading = false }: ViewToggleProps) {
  const [hoveredView, setHoveredView] = useState<'recent' | 'mycollection' | null>(null);

  const handleViewClick = (view: 'recent' | 'mycollection') => {
    if (isLoading || activeView === view) return;
    onViewChange(view);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/10">
        {/* Background slider */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-[calc(100%-12px)] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-full transition-all duration-300 ease-out ${
            activeView === 'recent' 
              ? 'left-1.5 w-[110px]' 
              : 'left-[116px] w-[130px]'
          }`}
        />
        
        {/* Toggle buttons */}
        <div className="relative flex items-center">
          <button
            onClick={() => handleViewClick('recent')}
            onMouseEnter={() => setHoveredView('recent')}
            onMouseLeave={() => setHoveredView(null)}
            disabled={isLoading}
            className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              activeView === 'recent'
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {isLoading && activeView === 'recent' ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                <span>Latest</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">🌌</span>
                <span>Latest</span>
              </div>
            )}
          </button>
          
          <button
            onClick={() => handleViewClick('mycollection')}
            onMouseEnter={() => setHoveredView('mycollection')}
            onMouseLeave={() => setHoveredView(null)}
            disabled={isLoading}
            className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              activeView === 'mycollection'
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {isLoading && activeView === 'mycollection' ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                <span>Your Collection</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">🛸</span>
                <span>Your Collection</span>
              </div>
            )}
          </button>
        </div>

        {/* Hover effects */}
        {hoveredView && !isLoading && (
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full animate-ping ${
                  hoveredView === 'recent' ? 'bg-cyan-400' : 'bg-purple-400'
                }`}
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${20 + (i % 2) * 60}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}