"use client";

import { useState, useEffect, useCallback } from 'react';
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { extractFidFromTokenId, isValidFid } from '~/lib/farcaster-tokenId-utils';

interface MintEvent {
  tokenId: string;
  to: string;
  fid: string;
  castHash: string;
  blockNumber: number;
  transactionHash: string;
  timestamp?: number;
}

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  image_url?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  [key: string]: unknown;
}

interface RecentMintNFT {
  tokenId: string;
  to: string;
  fid: string;
  castHash: string;
  metadata: NFTMetadata | null;
  contractAddress: string;
  chain: string;
  blockNumber: number;
  transactionHash: string;
  timestamp?: number;
  minterFarcasterUser?: FarcasterUser | null;
  authorFarcasterUser?: FarcasterUser | null;
}

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface CacheData {
  nfts: RecentMintNFT[];
  lastScannedBlock: number;
  timestamp: number;
  version: string;
}

interface UseRecentMintEventsReturn {
  recentMints: RecentMintNFT[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const CONTRACT_ADDRESS = '0xc011Ec7Ca575D4f0a2eDA595107aB104c7Af7A09';
const CACHE_KEY = 'farcaster_nfts_cache_v1';
const CACHE_TTL = 300000; // 5 minutes

// Cache utility functions
const getCachedData = (): CacheData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CacheData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - data.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Error reading cache:', error);
    return null;
  }
};

const setCachedData = (nfts: RecentMintNFT[], lastScannedBlock: number) => {
  if (typeof window === 'undefined') return;
  try {
    const cacheData: CacheData = {
      nfts,
      lastScannedBlock,
      timestamp: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error setting cache:', error);
  }
};


export function useRecentMintEvents(): UseRecentMintEventsReturn {
  const [recentMints, setRecentMints] = useState<RecentMintNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Alchemy SDK with error handling
  const getAlchemy = () => {
    const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_ALCHEMY_KEY is not configured');
    }
    const settings = {
      apiKey: apiKey,
      network: Network.BASE_MAINNET,
    };
    return new Alchemy(settings);
  };

  // Safe Alchemy request wrapper
  const safeAlchemyRequest = async <T>(request: () => Promise<T>): Promise<T | null> => {
    try {
      return await request();
    } catch (error: any) {
      console.warn('Alchemy request failed:', error);
      // Check for rate limit or bad request errors
      if (error?.status === 429 || error?.status === 400) {
        console.warn('Alchemy API limit exceeded or bad request');
      }
      return null;
    }
  };

  // Function to fetch recent NFTs using getNftsForContract API (simplified, mainly for metadata)
  const fetchNFTsForContract = useCallback(async (): Promise<RecentMintNFT[]> => {
    const result = await safeAlchemyRequest(async () => {
      const alchemy = getAlchemy();
      const nfts = await alchemy.nft.getNftsForContract(CONTRACT_ADDRESS, {
        pageSize: 10,
        omitMetadata: false
      });

      const recentMintsWithMetadata: RecentMintNFT[] = [];
      
      for (const nft of nfts.nfts) {
        try {
          // Extract metadata from NFT object
          const metadata = (nft as any).metadata || nft.raw?.metadata || null;
          
          // Extract FID from tokenId
          const fidExtraction = await extractFidFromTokenId(
            nft.tokenId,
            CONTRACT_ADDRESS
          );
          const extractedFid = fidExtraction.success && fidExtraction.fid && isValidFid(fidExtraction.fid) 
            ? fidExtraction.fid 
            : '';
          
          console.log(`Token ${nft.tokenId}: FID extraction result:`, fidExtraction);

          recentMintsWithMetadata.push({
            tokenId: nft.tokenId,
            to: '', // Will be populated by transfer data
            fid: extractedFid,
            castHash: '', // Will need to be derived from other sources
            metadata,
            contractAddress: CONTRACT_ADDRESS,
            chain: 'base',
            blockNumber: 0, // Will be populated by transfer data
            transactionHash: '', // Will be populated by transfer data
            minterFarcasterUser: null, // Will be populated later
            authorFarcasterUser: null, // Will be populated later
          });
        } catch (error) {
          console.warn(`Failed to process NFT ${nft.tokenId}:`, error);
        }
      }

      return recentMintsWithMetadata;
    });
    
    return result || [];
  }, []);

  // Function to fetch recent mints using getAssetTransfers (secondary method)
  const fetchRecentMintsViaTransfers = useCallback(async (): Promise<RecentMintNFT[]> => {
    const result = await safeAlchemyRequest(async () => {
      const alchemy = getAlchemy();
      const transfers = await alchemy.core.getAssetTransfers({
        fromAddress: '0x0000000000000000000000000000000000000000',
        contractAddresses: [CONTRACT_ADDRESS],
        category: [AssetTransfersCategory.ERC721],
        maxCount: 10,
        order: SortingOrder.DESCENDING
      });

      const recentMintsWithMetadata: RecentMintNFT[] = [];
      
      for (const transfer of transfers.transfers) {
        try {
          const tokenId = transfer.tokenId || '';
          
          // Fetch NFT metadata
          let metadata: NFTMetadata | null = null;
          try {
            const nft = await alchemy.nft.getNftMetadata(CONTRACT_ADDRESS, tokenId);
            metadata = (nft as any).metadata || nft.raw?.metadata || null;
          } catch (error) {
            console.warn(`Error fetching metadata for token ${tokenId}:`, error);
          }
          
          // Extract FID from tokenId and transaction
          const fidExtraction = await extractFidFromTokenId(
            tokenId,
            CONTRACT_ADDRESS,
            transfer.hash || undefined
          );
          const extractedFid = fidExtraction.success && fidExtraction.fid && isValidFid(fidExtraction.fid) 
            ? fidExtraction.fid 
            : '';
            
          console.log(`Token ${tokenId}: FID extraction result:`, fidExtraction);
          
          recentMintsWithMetadata.push({
            tokenId,
            to: transfer.to || '',
            fid: extractedFid,
            castHash: '', // Will need to be derived from transaction details
            metadata,
            contractAddress: CONTRACT_ADDRESS,
            chain: 'base',
            blockNumber: parseInt(transfer.blockNum, 16) || 0,
            transactionHash: transfer.hash || '',
            minterFarcasterUser: null, // Will be populated later
            authorFarcasterUser: null, // Will be populated later
          });
        } catch (error) {
          console.warn(`Failed to process transfer for token ${transfer.tokenId}:`, error);
        }
      }

      return recentMintsWithMetadata;
    });
    
    return result || [];
  }, []);

  // Function to fetch Farcaster user by address using Neynar API
  const fetchFarcasterUserByAddress = useCallback(async (address: string): Promise<FarcasterUser | null> => {
    // Skip if address is empty or invalid
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return null;
    }
    
    try {
      const response = await fetch(`/api/farcasterByAddress?address=${address}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        console.warn(`Neynar API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.warn(`Error fetching Farcaster user for address ${address}:`, error);
      return null;
    }
  }, []);

  const fetchFarcasteUserByFid = useCallback(async (fid: string): Promise<FarcasterUser | null> => {
    const response = await fetch(`/api/farcasterByFid?fid=${fid}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.warn(`Neynar API error: ${response.status}`);
      return null;
    }
    return response.json();
  }, []);


  // Function to fetch recent mint events with caching
  const fetchRecentMints = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to load from cache first
      const cachedData = getCachedData();
      if (cachedData) {
        console.log('Using cached data');
        setRecentMints(cachedData.nfts);
        setIsLoading(false);
        return;
      }

      // Try primary method: getNftsForContract
      let recentMintsWithMetadata = await fetchNFTsForContract();
      
      // If primary method fails or returns no results, try secondary method: getAssetTransfers
      if (recentMintsWithMetadata.length === 0) {
        console.log('Primary method returned no results, trying secondary method');
        recentMintsWithMetadata = await fetchRecentMintsViaTransfers();
      }

      // Populate Farcaster user data for each mint
      for (const mint of recentMintsWithMetadata) {
        try {
          const [minterFarcasterUser, authorFarcasterUser] = await Promise.all([
            fetchFarcasterUserByAddress(mint.to),
            mint.fid ? fetchFarcasteUserByFid(mint.fid) : Promise.resolve(null)
          ]);

          mint.minterFarcasterUser = minterFarcasterUser;
          mint.authorFarcasterUser = authorFarcasterUser;
        } catch (error) {
          console.warn(`Failed to fetch Farcaster user data for token ${mint.tokenId}:`, error);
        }
      }

      // Sort by block number descending (most recent first) and take top 10
      recentMintsWithMetadata = recentMintsWithMetadata
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 10);

      // Cache the results (using latest block from the results)
      // Only cache if we have data
      if (recentMintsWithMetadata.length > 0) {
        const latestBlock = Math.max(...recentMintsWithMetadata.map(nft => nft.blockNumber));
        setCachedData(recentMintsWithMetadata, latestBlock);
      }
      setRecentMints(recentMintsWithMetadata);
    } catch (error) {
      console.error('Error fetching recent mint events:', error);
      
      // Try to use cached data as fallback
      try {
        const fallbackCached = localStorage.getItem(CACHE_KEY);
        if (fallbackCached) {
          const fallbackData: CacheData = JSON.parse(fallbackCached);
          console.log('Using cached data as fallback due to error');
          setRecentMints(fallbackData.nfts);
          setError('Using cached data - ' + (error instanceof Error ? error.message : 'Failed to fetch recent mint events'));
        } else {
          setError(error instanceof Error ? error.message : 'Failed to fetch recent mint events');
        }
      } catch (cacheError) {
        console.warn('Error reading fallback cache:', cacheError);
        setError(error instanceof Error ? error.message : 'Failed to fetch recent mint events');
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchNFTsForContract, fetchRecentMintsViaTransfers, fetchFarcasterUserByAddress, fetchFarcasteUserByFid]);

  // Refetch function that clears cache
  const refetch = useCallback(() => {
    // Clear cache to force fresh data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    fetchRecentMints();
  }, [fetchRecentMints]);

  // Initial data fetch
  useEffect(() => {
    fetchRecentMints();
  }, [fetchRecentMints]);

  return {
    recentMints,
    isLoading,
    error,
    refetch,
  };
}