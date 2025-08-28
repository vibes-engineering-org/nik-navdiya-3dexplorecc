'use client';

import { UniverseScene } from './UniverseScene';
import React from 'react'; // Added React import

export function Scene3D({ 
  setCurrentView, 
  logoSrc 
}: { 
  setCurrentView: React.Dispatch<React.SetStateAction<'selector' | 'explorer'>>;
  logoSrc?: string;
}) {
  return (
    <div className="relative w-full min-h-screen">
      {/* Universe Scene with integrated holographic cards */}
      <div className="relative z-0">
        <UniverseScene setCurrentView={setCurrentView} logoSrc={logoSrc} />
      </div>
    </div>
  );
}