'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Collectible {
  id: string;
  hash: string;
  author: {
    fid: number;
    username: string;
    display_name: string;
    pfp: {
      url: string;
    };
  };
  text: string;
  timestamp: string;
  embeds: Array<{
    url?: string;
    metadata?: {
      image?: {
        url: string;
      };
    };
  }>;
  reactions: {
    likes_count: number;
    recasts_count: number;
    replies_count: number;
  };
  channel?: {
    id: string;
    name: string;
  };
}

interface CollectiblesState {
  // Current path selection
  selectedPath: 'recent' | 'mycollection';
  
  // Collectibles data
  recentCollectibles: Collectible[];
  myCollectibles: Collectible[];
  
  // 3D scene state
  selectedCollectible: Collectible | null;
  showHologram: boolean;
  isLoading: boolean;
  hasReachedEnd: boolean;
  
  // Trail mode state
  isTrailMode: boolean;
  trailProgress: number; // 0 to 1, representing progress along the trail
}

interface CollectiblesActions {
  setSelectedPath: (path: 'recent' | 'mycollection') => void;
  setRecentCollectibles: (collectibles: Collectible[]) => void;
  setMyCollectibles: (collectibles: Collectible[]) => void;
  setSelectedCollectible: (collectible: Collectible | null) => void;
  setShowHologram: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setHasReachedEnd: (end: boolean) => void;
  loadMoreCollectibles: () => Promise<void>;
  setIsTrailMode: (trailMode: boolean) => void;
  setTrailProgress: (progress: number) => void;
}

type CollectiblesContextType = CollectiblesState & CollectiblesActions;

const CollectiblesContext = createContext<CollectiblesContextType | undefined>(undefined);

export function CollectiblesProvider({ children }: { children: ReactNode }) {
  const [selectedPath, setSelectedPath] = useState<'recent' | 'mycollection'>('recent');
  const [recentCollectibles, setRecentCollectibles] = useState<Collectible[]>([]);
  const [myCollectibles, setMyCollectibles] = useState<Collectible[]>([]);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [showHologram, setShowHologram] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isTrailMode, setIsTrailMode] = useState(true);
  const [trailProgress, setTrailProgress] = useState(0);



  const loadMoreCollectibles = async () => {
    setIsLoading(true);
    try {
      console.log('Loading more collectibles...');
      // Implementation would go here
    } catch (error) {
      console.error('Failed to load more collectibles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: CollectiblesContextType = {
    selectedPath,
    recentCollectibles,
    myCollectibles,
    selectedCollectible,
    showHologram,
    isLoading,
    hasReachedEnd,
    isTrailMode,
    trailProgress,
    setSelectedPath,
    setRecentCollectibles,
    setMyCollectibles,
    setSelectedCollectible,
    setShowHologram,
    setIsLoading,
    setHasReachedEnd,
    loadMoreCollectibles,
    setIsTrailMode,
    setTrailProgress
  };

  return (
    <CollectiblesContext.Provider value={value}>
      {children}
    </CollectiblesContext.Provider>
  );
}

export function useCollectiblesStore() {
  const context = useContext(CollectiblesContext);
  if (context === undefined) {
    throw new Error('useCollectiblesStore must be used within a CollectiblesProvider');
  }
  return context;
}