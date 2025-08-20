'use client';

import { useState } from 'react';
import { useCollectiblesStore } from '~/store/collectibles';
import { PathSelector } from './PathSelector';
import { Scene3D } from './Scene3D';
import { useMiniAppSdk } from '~/hooks/useMiniAppSdk';

export function CollectibleExplorer() {
  const [currentView, setCurrentView] = useState<'selector' | 'explorer'>('selector');
  const { context, isSDKLoaded } = useMiniAppSdk();
  const { selectedPath } = useCollectiblesStore();

  // Switch to explorer when a path is selected (data is provided by hooks)
  const handlePathSelected = async () => {
    setCurrentView('explorer');
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
            ← <span className="text-xs hidden md:inline">Change Path</span>
          </button>
        </div>
      )}
    </div>
  );
}