'use client';

import { useState } from 'react';
import { Collectible } from '~/store/collectibles';

interface CollectibleStoneProps {
  collectible: Collectible;
  index: number;
  position: number;
  isNear: boolean;
  onClick: () => void;
}

export function CollectibleStone({ collectible, index, position, isNear, onClick }: CollectibleStoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // Position stones alternately on left and right sides
  const isLeft = index % 2 === 0;
  const sideOffset = isLeft ? -120 : 120;

  const handleStoneClick = () => {
    onClick();
  };

  const handleStoneHover = () => {
    setIsHovered(true);
    if (isNear) {
      setShowCard(true);
    }
  };

  const handleStoneLeave = () => {
    setIsHovered(false);
    setShowCard(false);
  };

  return (
    <div
      className="absolute transition-all duration-300"
      style={{
        left: '50%',
        top: '480px',
        transform: `translate3d(calc(-50% + ${sideOffset}px), 0, ${position}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Stone */}
      <div
        className={`relative cursor-pointer transition-all duration-300 ${
          isNear ? 'animate-pulse' : ''
        } ${isHovered ? 'scale-110' : 'scale-100'}`}
        onClick={handleStoneClick}
        onMouseEnter={handleStoneHover}
        onMouseLeave={handleStoneLeave}
      >
        {/* Stone base */}
        <div className="relative w-8 h-6 bg-gray-500 rounded-full shadow-lg">
          {/* Stone texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 rounded-full"></div>
          <div className="absolute inset-1 bg-gradient-to-tl from-transparent to-white opacity-30 rounded-full"></div>
          
          {/* Glow effect when near */}
          {isNear && (
            <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-50 animate-ping"></div>
          )}
          
          {/* Magic sparkles */}
          {isNear && (
            <>
              <div className="absolute -top-1 -left-1 w-1 h-1 bg-yellow-300 rounded-full animate-twinkle"></div>
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
            </>
          )}
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-black opacity-30 rounded-full blur-sm"></div>
      </div>

      {/* 3D Card Pop-out */}
      {showCard && isNear && (
        <div 
          className="absolute -top-32 left-1/2 transform -translate-x-1/2 animate-fade-in"
          style={{
            animation: 'float 2s ease-in-out infinite, rotateCard 4s linear infinite'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 w-48 transform-gpu"
            style={{
              transform: 'perspective(500px) rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Card content preview */}
            <div className="space-y-2">
              {/* Author info */}
              <div className="flex items-center space-x-2">
                <img 
                  src={collectible.author.pfp.url} 
                  alt={collectible.author.display_name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs font-medium text-gray-800 truncate">
                  {collectible.author.display_name}
                </span>
              </div>
              
              {/* Content preview */}
              <p className="text-xs text-gray-600 line-clamp-2">
                {collectible.text.slice(0, 60)}...
              </p>
              
              {/* Image preview if available */}
              {collectible.embeds[0]?.metadata?.image && (
                <img 
                  src={collectible.embeds[0].metadata.image.url}
                  alt="Collectible preview"
                  className="w-full h-20 object-cover rounded"
                />
              )}
              
              {/* Stats */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>❤️ {collectible.reactions.likes_count}</span>
                <span>🔄 {collectible.reactions.recasts_count}</span>
              </div>
            </div>
            
            {/* Holographic overlay effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30 rounded-lg"
              style={{
                animation: 'shimmer 1.5s ease-in-out infinite'
              }}
            ></div>
          </div>
          
          {/* Card connector line */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-blue-400 opacity-60"></div>
        </div>
      )}
    </div>
  );
}

// Add custom animations via style tag
if (typeof window !== 'undefined' && !document.getElementById('collectible-animations')) {
  const style = document.createElement('style');
  style.id = 'collectible-animations';
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(-50%); }
      50% { transform: translateY(-10px) translateX(-50%); }
    }
    
    @keyframes rotateCard {
      0% { transform: perspective(500px) rotateY(0deg); }
      100% { transform: perspective(500px) rotateY(360deg); }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 0; transform: scale(0); }
      50% { opacity: 1; transform: scale(1); }
    }
    
    .animate-twinkle {
      animation: twinkle 1.5s ease-in-out infinite;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px) translateX(-50%); }
      to { opacity: 1; transform: translateY(0) translateX(-50%); }
    }
  `;
  document.head.appendChild(style);
}