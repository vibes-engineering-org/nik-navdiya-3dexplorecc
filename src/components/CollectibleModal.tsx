'use client';

import React from 'react';
import { X } from 'lucide-react';

interface CollectibleModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CollectibleModal({ item, isOpen, onClose }: CollectibleModalProps) {
  if (!isOpen || !item) return null;

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-xl rounded-2xl border border-blue-400/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-400/30">
          <h2 className="text-xl font-bold text-white">Collectible Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Minter Info */}
          <div className="flex items-center space-x-4 mb-6">
            {item.minter?.pfp_url ? (
              <img 
                src={item.minter.pfp_url} 
                alt={item.minter?.display_name || item.minter?.username || 'Minter'} 
                className="w-16 h-16 rounded-full border-2 border-blue-400 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 flex items-center justify-center">
                <span className="text-blue-300 text-xl font-bold">
                  {item.minter?.username?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-blue-300">
                {item.minter?.display_name || 'Unknown Minter'}
              </h3>
              {item.minter?.username && (
                <p className="text-blue-400">@{item.minter.username}</p>
              )}
              {item.minter?.fid && (
                <p className="text-gray-400 text-sm">FID: {item.minter.fid}</p>
              )}
            </div>
          </div>

          {/* NFT Image */}
          {item.image && (
            <div className="mb-6 rounded-xl overflow-hidden border border-blue-400/30">
              <img 
                src={item.image} 
                alt="NFT preview" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* NFT Details */}
          <div className="space-y-4 mb-6">
            {item.title && (
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-1">Title</h4>
                <p className="text-white text-lg font-semibold">{item.title}</p>
              </div>
            )}

            {item.description && (
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-1">Description</h4>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            )}

            {/* Metadata Attributes */}
            {item.metadata?.attributes && item.metadata.attributes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-3">
                  {item.metadata.attributes.map((attr: any, index: number) => (
                    <div key={index} className="bg-blue-900/30 rounded-lg p-3 border border-blue-400/20">
                      <p className="text-blue-300 text-xs font-medium">{attr.trait_type}</p>
                      <p className="text-white font-semibold">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-400/20">
            <div>
              <h5 className="text-blue-300 text-sm font-medium">Auther</h5>
                <p className="text-white capitalize" onClick={() => window.open(`https://www.farcaster.xyz/${item.auther?.username}`, '_blank')}>@{item.auther?.username || 'Unknown Auther'}</p>
            </div>
            <div>
              <h5 className="text-blue-300 text-sm font-medium">Minter</h5>
              <p className="text-white capitalize" onClick={() => window.open(`https://www.farcaster.xyz/${item.minter?.username}`, '_blank')}>@{item.minter?.username || 'Unknown Minter'}</p>
            </div>
            <div className="col-span-2">
              <h5 className="text-blue-300 text-sm font-medium">Token ID</h5>
              <p className="text-white font-mono">#{item.tokenId || 'N/A'}</p>
            </div>
            <div onClick={() => window.open(item.castUrl, '_blank')} className="cursor-pointer col-span-2">
              <h5 className="text-blue-300 text-sm font-medium col-span-2">Cast URL</h5>
              <p className="text-gray-300 font-mono text-xs break-all">{item.castUrl}</p>
            </div>
          </div>


          {/* Transaction Hash */}
          {item.transactionHash && (
            <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-600/30">
              <h5 className="text-blue-300 text-sm font-medium mb-2">Transaction Hash</h5>
              <p className="text-gray-300 font-mono text-xs break-all">{item.transactionHash}</p>
            </div>
          )}

          {/* Cast Hash */}
          {item.castHash && (
            <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-600/30">
              <h5 className="text-blue-300 text-sm font-medium mb-2">Cast Hash</h5>
              <p className="text-gray-300 font-mono text-xs break-all">{item.castHash}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
