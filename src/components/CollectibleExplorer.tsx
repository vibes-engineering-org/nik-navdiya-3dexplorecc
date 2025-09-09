'use client';

import { useState, useEffect } from 'react';
import { useCollectiblesStore } from '~/store/collectibles';
import { Scene3D } from './Scene3D';
import { ViewToggle } from './ViewToggle';
import { OnboardingTooltip } from './OnboardingTooltip';
import { useMiniAppSdk } from '~/hooks/useMiniAppSdk';

export function CollectibleExplorer({ logoSrc }: { logoSrc?: string }) {
  const { context, isSDKLoaded } = useMiniAppSdk();
  const [isViewLoading, setIsViewLoading] = useState(false);
  
  const {
    selectedPath,
    setSelectedPath,
    setRecentCollectibles,
    setMyCollectibles,
    setIsLoading,
    loadMoreCollectibles
  } = useCollectiblesStore();

  // Load Scene3D directly on mount with default 'recent' path
  useEffect(() => {
    // Set default path to 'recent' if not already set
    if (selectedPath !== 'recent' && selectedPath !== 'mycollection') {
      setSelectedPath('recent');
    }
  }, [selectedPath, setSelectedPath]);

  // Handle view change with loading state
  const handleViewChange = async (newView: 'recent' | 'mycollection') => {
    if (isViewLoading || newView === selectedPath) return;
    
    setIsViewLoading(true);
    setSelectedPath(newView);
    
    // Simulate loading time for smooth UX
    setTimeout(() => {
      setIsViewLoading(false);
    }, 800);
  };

  return (
    <div className="w-full min-h-screen overflow-hidden">
      <div className="relative">
        {/* View Toggle - Fixed overlay at top center */}
        <ViewToggle 
          activeView={selectedPath}
          onViewChange={handleViewChange}
          isLoading={isViewLoading}
        />
        
        {/* Onboarding Tooltip - Shows navigation instructions */}
        <OnboardingTooltip />
        
        {/* 3D Scene - Load immediately */}
        <Scene3D setCurrentView={() => {}} logoSrc={logoSrc} />
      </div>
    </div>
  );
}