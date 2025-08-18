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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      {/* Hologram Container */}
      <div 
        className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-1 max-w-2xl w-full max-h-[90vh] overflow-hidden"
        style={{
          boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)',
          animation: 'hologramGlow 2s ease-in-out infinite alternate'
        }}
      >
        {/* Holographic border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60 animate-pulse"></div>
        
        {/* Main content */}
        <div className="relative bg-gray-900 rounded-xl p-6 overflow-y-auto max-h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>

          {/* Author section */}
          <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-700">
            <div className="relative">
              <img 
                src={collectible.author.pfp.url} 
                alt={collectible.author.display_name}
                className="w-16 h-16 rounded-full border-2 border-blue-400"
              />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-60 animate-spin"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{collectible.author.display_name}</h2>
              <p className="text-gray-400">@{collectible.author.username}</p>
              <p className="text-sm text-gray-500">FID: {collectible.author.fid}</p>
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

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
              View on Farcaster
            </button>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-lg">
              Collect
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg">
              Share
            </button>
          </div>
        </div>

        {/* Hologram scan lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.3) 2px, rgba(0,255,255,0.3) 4px)',
              animation: 'scanlines 0.1s linear infinite'
            }}
          ></div>
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

// Add hologram-specific animations
if (typeof window !== 'undefined' && !document.getElementById('hologram-animations')) {
  const style = document.createElement('style');
  style.id = 'hologram-animations';
  style.textContent = `
    @keyframes hologramGlow {
      0% { 
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.3), 0 0 100px rgba(59, 130, 246, 0.1); 
      }
      100% { 
        box-shadow: 0 0 80px rgba(59, 130, 246, 0.6), 0 0 150px rgba(59, 130, 246, 0.3); 
      }
    }
    
    @keyframes scanlines {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
  `;
  document.head.appendChild(style);
}