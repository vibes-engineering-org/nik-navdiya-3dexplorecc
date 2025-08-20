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
          <Scene3D setCurrentView={setCurrentView} />
          
        </div>
      )}
    </div>
  );
}