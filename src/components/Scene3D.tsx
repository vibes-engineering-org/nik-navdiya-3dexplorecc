'use client';

import { UniverseScene } from './UniverseScene';

export function Scene3D() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Universe Scene with integrated holographic cards */}
      <div className="relative z-0">
        <UniverseScene />
      </div>
    </div>
  );
}