'use client';

import { useState, useEffect } from 'react';

export function OnboardingTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('fc-explorer-onboarding-seen');
    
    if (!hasSeenOnboarding) {
      // Show tooltip after a brief delay for scene to load
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);

      // Auto-hide after 6 seconds
      const hideTimer = setTimeout(() => {
        handleDismiss();
      }, 7000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('fc-explorer-onboarding-seen', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div 
        className={`relative bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-sm mx-auto transition-all duration-300 ${
          isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <h3 className="text-white font-bold text-lg">Navigation Guide</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-200">
              <span className="text-lg">🖱️</span>
              <span className="text-sm">Drag to explore</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <span className="text-lg">🔍</span>
              <span className="text-sm">Scroll to zoom</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <span className="text-lg">⌨️</span>
              <span className="text-sm">WASD to navigate</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <span className="text-lg">🛸</span>
              <span className="text-sm">Click cards to discover</span>
            </div>
          </div>

          {/* Got it button */}
          <button
            onClick={handleDismiss}
            className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-white/20 text-white py-2.5 px-4 rounded-xl transition-all duration-200 font-medium"
          >
            Got it! 🚀
          </button>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60"
              style={{
                left: `${15 + i * 25}%`,
                top: `${10 + (i % 2) * 70}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Arrow pointer */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-black/60 border-t border-l border-white/20 rotate-45" />
        </div>
      </div>
    </div>
  );
}