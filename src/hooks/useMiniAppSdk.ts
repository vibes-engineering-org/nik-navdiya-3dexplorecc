import { useState, useEffect } from 'react';

export interface MiniAppContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
  };
}

export function useMiniAppSdk() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);

  useEffect(() => {
    // Mock SDK initialization
    const timer = setTimeout(() => {
      setIsSDKLoaded(true);
      // Mock user context
      setContext({
        user: {
          fid: 1234,
          username: 'mock_user',
          displayName: 'Mock User'
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    isSDKLoaded,
    context
  };
}