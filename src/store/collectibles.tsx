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
  bikePosition: number;
  currentCollectibleIndex: number;
  selectedCollectible: Collectible | null;
  showHologram: boolean;
  isLoading: boolean;
  hasReachedEnd: boolean;
}

interface CollectiblesActions {
  setSelectedPath: (path: 'recent' | 'mycollection') => void;
  setRecentCollectibles: (collectibles: Collectible[]) => void;
  setMyCollectibles: (collectibles: Collectible[]) => void;
  setBikePosition: (position: number) => void;
  setCurrentCollectibleIndex: (index: number) => void;
  setSelectedCollectible: (collectible: Collectible | null) => void;
  setShowHologram: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setHasReachedEnd: (end: boolean) => void;
  moveBike: (direction: 'forward' | 'backward') => void;
  startAutoCycling: () => NodeJS.Timeout | undefined;
  loadMoreCollectibles: () => Promise<void>;
}

type CollectiblesContextType = CollectiblesState & CollectiblesActions;

const CollectiblesContext = createContext<CollectiblesContextType | undefined>(undefined);

export function CollectiblesProvider({ children }: { children: ReactNode }) {
  const [selectedPath, setSelectedPath] = useState<'recent' | 'mycollection'>('recent');
  const [recentCollectibles, setRecentCollectibles] = useState<Collectible[]>([]);
  const [myCollectibles, setMyCollectibles] = useState<Collectible[]>([]);
  const [bikePosition, setBikePosition] = useState(0);
  const [currentCollectibleIndex, setCurrentCollectibleIndex] = useState(0);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [showHologram, setShowHologram] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const moveBike = (direction: 'forward' | 'backward') => {
    const currentCollectibles = selectedPath === 'recent' ? recentCollectibles : myCollectibles;
    
    let newPosition = bikePosition;
    let newIndex = currentCollectibleIndex;
    
    if (direction === 'forward' && newIndex < currentCollectibles.length - 1) {
      newPosition += 100; // More realistic movement per step
      newIndex += 1;
    } else if (direction === 'backward' && newIndex > 0) {
      newPosition -= 100; // More realistic movement per step
      newIndex -= 1;
    }
    
    const reachedEnd = newIndex >= currentCollectibles.length - 1 && currentCollectibles.length > 0;
    
    setBikePosition(newPosition);
    setCurrentCollectibleIndex(newIndex);
    setHasReachedEnd(reachedEnd);
  };

  // Auto-cycling demo mode for better user experience
  const startAutoCycling = () => {
    const currentCollectibles = selectedPath === 'recent' ? recentCollectibles : myCollectibles;
    if (currentCollectibles.length === 0) return;

    let autoIndex = 0;
    const autoCycleInterval = setInterval(() => {
      if (autoIndex < currentCollectibles.length - 1) {
        setBikePosition(autoIndex * 100);
        setCurrentCollectibleIndex(autoIndex);
        setHasReachedEnd(false);
        autoIndex++;
      } else {
        setHasReachedEnd(true);
        clearInterval(autoCycleInterval);
      }
    }, 2000); // Move every 2 seconds for demo

    return autoCycleInterval;
  };

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
    bikePosition,
    currentCollectibleIndex,
    selectedCollectible,
    showHologram,
    isLoading,
    hasReachedEnd,
    setSelectedPath,
    setRecentCollectibles,
    setMyCollectibles,
    setBikePosition,
    setCurrentCollectibleIndex,
    setSelectedCollectible,
    setShowHologram,
    setIsLoading,
    setHasReachedEnd,
    moveBike,
    startAutoCycling,
    loadMoreCollectibles
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