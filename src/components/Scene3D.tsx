'use client';

import { UniverseScene } from './UniverseScene';

  export function Scene3D({ setCurrentView }: { setCurrentView: React.Dispatch<React.SetStateAction<'selector' | 'explorer'>> }) {
  return (
    <div className="relative w-full min-h-[100vh-100px]">
      {/* Universe Scene with integrated holographic cards */}
      <div className="relative z-0">
        <UniverseScene setCurrentView={setCurrentView} />
      </div>
    </div>
  );
}