'use client';

import { useEffect } from 'react';
import { Collectible } from '~/store/collectibles';

interface HologramDisplayProps {
  collectible: Collectible;
  onClose: () => void;
}

export function HologramDisplay({ collectible, onClose }: HologramDisplayProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Enhanced Hologram Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden"
        style={{
          animation: 'hologramGlow 2s ease-in-out infinite alternate, hologramFloat 4s ease-in-out infinite'
        }}
      >
        {/* Multi-layer holographic effects */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 p-[2px] animate-spin-slow">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        </div>
        
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30 blur-xl animate-pulse"></div>
        
        {/* Inner content container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl border border-cyan-400 border-opacity-50 overflow-hidden backdrop-blur-sm">
          {/* Holographic grid overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Main scrollable content */}
          <div className="relative p-4 sm:p-6 overflow-y-auto max-h-[95vh] scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-cyan-500">
            {/* Enhanced Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-cyan-400 hover:text-white text-2xl font-bold z-20 w-10 h-10 bg-gray-900 bg-opacity-80 rounded-full border border-cyan-400 border-opacity-50 flex items-center justify-center backdrop-blur-sm hover:bg-opacity-100 transition-all"
            >
              ×
            </button>

            {/* Enhanced Author section */}
            <div className="flex items-center space-x-3 sm:space-x-4 mb-6 pb-4 border-b border-cyan-500 border-opacity-30">
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60 animate-pulse"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-80 animate-spin-slow"></div>
                <img 
                  src={collectible.author.pfp.url} 
                  alt={collectible.author.display_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-cyan-400 relative z-10"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{collectible.author.display_name}</h2>
                <p className="text-cyan-400 text-sm sm:text-base truncate">@{collectible.author.username}</p>
                <p className="text-xs text-gray-400">FID: {collectible.author.fid}</p>
              </div>
            </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Content</h3>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {collectible.text}
            </p>
          </div>

          {/* Media embeds */}
          {collectible.embeds && collectible.embeds.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Media</h3>
              <div className="space-y-4">
                {collectible.embeds.map((embed, index) => (
                  <div key={index} className="relative">
                    {embed.metadata?.image && (
                      <div className="relative group">
                        <img 
                          src={embed.metadata.image.url}
                          alt={`Embed ${index + 1}`}
                          className="w-full rounded-lg shadow-lg max-h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"></div>
                      </div>
                    )}
                    {embed.url && !embed.metadata?.image && (
                      <a 
                        href={embed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <p className="text-blue-400 hover:text-blue-300 truncate">{embed.url}</p>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Engagement stats */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Engagement</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Likes</span>
                  <span className="text-pink-400 font-semibold">{collectible.reactions.likes_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recasts</span>
                  <span className="text-green-400 font-semibold">{collectible.reactions.recasts_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Replies</span>
                  <span className="text-blue-400 font-semibold">{collectible.reactions.replies_count}</span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm block">Published</span>
                  <span className="text-white">{formatDate(collectible.timestamp)}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm block">Hash</span>
                  <span className="text-gray-300 font-mono text-xs break-all">{collectible.hash}</span>
                </div>
                {collectible.channel && (
                  <div>
                    <span className="text-gray-400 text-sm block">Channel</span>
                    <span className="text-blue-300">/{collectible.channel.id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Enhanced Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 transition-all shadow-lg border border-blue-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 active:scale-95">
                <div className="flex items-center justify-center space-x-2">
                  <span>View on Farcaster</span>
                </div>
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 via-teal-500 to-green-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-green-600 hover:via-teal-600 hover:to-green-700 transition-all shadow-lg border border-green-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 active:scale-95">
                <div className="flex items-center justify-center space-x-2">
                  <span>Collect</span>
                </div>
              </button>
              <button className="flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 transition-all shadow-lg border border-pink-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 active:scale-95">
                <div className="flex items-center justify-center space-x-2">
                  <span>Share</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Hologram scan lines effect */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.4) 2px, rgba(0,255,255,0.4) 3px)',
              animation: 'scanlines 0.08s linear infinite'
            }}
          ></div>
          
          {/* Data stream effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,200,255,0.2) 20px, rgba(0,200,255,0.2) 22px)',
              animation: 'dataStream 2s linear infinite'
            }}
          ></div>
          
          {/* Glitch effect */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              background: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,0,255,0.3) 1px, rgba(255,0,255,0.3) 2px)',
              animation: 'glitch 3s ease-in-out infinite'
            }}
          ></div>
        </div>
        
        {/* Floating hologram particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${(i * 13 + 10) % 90}%`,
                top: `${(i * 17 + 15) % 80}%`,
                animation: `float${i % 3} ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Background click to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      ></div>
    </div>
  );
}

// Add enhanced hologram-specific animations
if (typeof window !== 'undefined' && !document.getElementById('hologram-animations')) {
  const style = document.createElement('style');
  style.id = 'hologram-animations';
  style.textContent = `
    @keyframes hologramGlow {
      0% { 
        box-shadow: 0 0 50px rgba(6, 182, 212, 0.4), 0 0 100px rgba(59, 130, 246, 0.2), 0 0 150px rgba(168, 85, 247, 0.1); 
      }
      100% { 
        box-shadow: 0 0 80px rgba(6, 182, 212, 0.8), 0 0 150px rgba(59, 130, 246, 0.5), 0 0 200px rgba(168, 85, 247, 0.3); 
      }
    }
    
    @keyframes hologramFloat {
      0%, 100% { transform: translateY(0px) rotateY(0deg); }
      50% { transform: translateY(-5px) rotateY(2deg); }
    }
    
    @keyframes scanlines {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    
    @keyframes dataStream {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes glitch {
      0%, 90%, 100% { transform: translateX(0); }
      20% { transform: translateX(-2px); }
      40% { transform: translateX(2px); }
      60% { transform: translateX(-1px); }
      80% { transform: translateX(1px); }
    }
    
    @keyframes float0 {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-10px) scale(1.2); }
    }
    
    @keyframes float1 {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33% { transform: translateY(-8px) translateX(3px); }
      66% { transform: translateY(-5px) translateX(-3px); }
    }
    
    @keyframes float2 {
      0%, 100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.1); }
    }
    
    .animate-spin-slow {
      animation: spin 3s linear infinite;
    }
    
    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
    }
    
    .scrollbar-track-gray-800::-webkit-scrollbar-track {
      background: rgba(31, 41, 55, 0.5);
      border-radius: 2px;
    }
    
    .scrollbar-thumb-cyan-500::-webkit-scrollbar-thumb {
      background: rgba(6, 182, 212, 0.8);
      border-radius: 2px;
    }
    
    .scrollbar-thumb-cyan-500::-webkit-scrollbar-thumb:hover {
      background: rgba(6, 182, 212, 1);
    }
  `;
  document.head.appendChild(style);
}