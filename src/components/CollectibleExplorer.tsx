'use client';

import { useState, useEffect } from 'react';
import { useCollectiblesStore } from '~/store/collectibles';
import { CollectiblesService } from '~/services/collectibles';
import { PathSelector } from './PathSelector';
import { Scene3D } from './Scene3D';
import { useMiniAppSdk } from '~/hooks/useMiniAppSdk';

export function CollectibleExplorer() {
  const [currentView, setCurrentView] = useState<'selector' | 'explorer'>('selector');
  const { context, isSDKLoaded } = useMiniAppSdk();
  
  const {
    selectedPath,
    setRecentCollectibles,
    setMyCollectibles,
    setIsLoading,
    loadMoreCollectibles
  } = useCollectiblesStore();

  // Load collectibles when path is selected
  const handlePathSelected = async () => {
    setIsLoading(true);
    
    try {
      if (selectedPath === 'recent') {
        // Load recent collectibles - try API first, fallback to mock
        try {
          const response = await CollectiblesService.fetchRecentCollectibles();
          setRecentCollectibles(response.collectibles);
        } catch (error) {
          console.log('Using mock data for recent collectibles');
          const mockData = CollectiblesService.getMockCollectibles('recent');
          setRecentCollectibles(mockData);
        }
      } else {
        // Load user's collectibles
        if (isSDKLoaded && context?.user?.fid) {
          try {
            const response = await CollectiblesService.fetchUserCollectibles(context.user.fid);
            setMyCollectibles(response.collectibles);
          } catch (error) {
            console.log('Using mock data for user collectibles');
            const mockData = CollectiblesService.getMockCollectibles('mycollection');
            setMyCollectibles(mockData);
          }
        } else {
          // Fallback to mock data if no user context
          const mockData = CollectiblesService.getMockCollectibles('mycollection');
          setMyCollectibles(mockData);
        }
      }
    } catch (error) {
      console.error('Error loading collectibles:', error);
    } finally {
      setIsLoading(false);
      setCurrentView('explorer');
    }
  };

  // Reset to selector when path changes
  const handleBackToSelector = () => {
    setCurrentView('selector');
  };

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {currentView === 'selector' ? (
        <div className="relative">
          <PathSelector onPathSelected={handlePathSelected} />
          
          {/* Back button - hidden on selector view initially */}
        </div>
      ) : (
        <div className="relative">
          <Scene3D />
          
          {/* Back to path selector button */}
          <button
            onClick={handleBackToSelector}
            className="absolute top-16 right-6 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all z-10"
          >
            ← Change Path
          </button>
        </div>
      )}
    </div>
  );
}