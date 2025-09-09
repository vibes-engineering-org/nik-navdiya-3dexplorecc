"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk';
import { fetchFarcasteUserByFid } from '~/lib/facaster';
import { FarcasterUser } from './use-recent-mints';
import { useProfile } from './use-profile';
import { extractFidFromTokenId, isValidFid } from '~/lib/farcaster-tokenId-utils';

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

interface NFTToken {
  tokenId: string;
  metadata: NFTMetadata | null;
  contractAddress: string;
  chain: string;
  mintTime?: string;
  author?: FarcasterUser | null;
  minter?: FarcasterUser | null;
}

interface UseContractNFTsReturn {
  userNFTs: NFTToken[];
  recentNFTs: NFTToken[];
  isLoadingUserNFTs: boolean;
  isLoadingRecentNFTs: boolean;
  error: string | null;
  loadMoreRecent: () => void;
  hasMoreRecent: boolean;
  isLoadingMoreRecent: boolean;
}

const CONTRACT_ADDRESS = '0xc011Ec7Ca575D4f0a2eDA595107aB104c7Af7A09';
const ITEMS_PER_PAGE = 10;

export function useContractNFTs(): UseContractNFTsReturn {
  const { address, isConnected } = useAccount();
  const { fid } = useProfile();
  const [farcasterAddresses, setFarcasterAddresses] = useState<string[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [userNFTs, setUserNFTs] = useState<NFTToken[]>([]);
  const [recentNFTs, setRecentNFTs] = useState<NFTToken[]>([]);
  const [isLoadingUserNFTs, setIsLoadingUserNFTs] = useState(false);
  const [isLoadingRecentNFTs, setIsLoadingRecentNFTs] = useState(false);
  const [isLoadingMoreRecent, setIsLoadingMoreRecent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageKey, setPageKey] = useState<string | undefined>(undefined);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);

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


  const fetchAuthor = useCallback(async (username: string | undefined): Promise<FarcasterUser | null> => {
    // Skip if username is undefined, null, or empty string
    if (!username || username === 'undefined') {
      return null;
    }
    const response = await fetch(`/api/farcasterByUsername?username=${username}`);
    return response.json();
  }, []);

  // Fetch Farcaster user by address using Neynar API
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

  // Fetch Farcaster verified addresses
  const fetchFarcasterAddresses = useCallback(async (fidToFetch: number): Promise<string[]> => {
    try {
      setIsLoadingAddresses(true);
      const response = await fetch(`/api/farcaster-addresses?fid=${fidToFetch}`);
      if (!response.ok) {
        console.warn('Failed to fetch Farcaster addresses:', response.status);
        return [];
      }
      const data = await response.json();
      return data.addresses || [];
    } catch (error) {
      console.error('Error fetching Farcaster addresses:', error);
      return [];
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  // Fetch user's NFTs from the contract
  const fetchUserNFTs = useCallback(async () => {
    // Determine which addresses to use
    const addressesToCheck: string[] = [];
    
    // Add Farcaster addresses if available
    if (farcasterAddresses.length > 0) {
      addressesToCheck.push(...farcasterAddresses);
    }
    
    // Add wallet address as fallback if connected
    if (address && isConnected && !addressesToCheck.some(addr => addr.toLowerCase() === address.toLowerCase())) {
      addressesToCheck.push(address);
    }
    
    if (addressesToCheck.length === 0) {
      console.log('No addresses available - no Farcaster addresses and wallet not connected');
      setUserNFTs([]);
      return;
    }

    console.log('Fetching NFTs for addresses:', addressesToCheck);
    setIsLoadingUserNFTs(true);
    setError(null);

    try {
      const allNfts: NFTToken[] = [];
      
      // Fetch NFTs for each address
      for (const addressToCheck of addressesToCheck) {
        const result = await safeAlchemyRequest(async () => {
          const alchemy = getAlchemy();
          return await alchemy.nft.getNftsForOwner(addressToCheck, {
            contractAddresses: [CONTRACT_ADDRESS],
            omitMetadata: false
          });
        });

        if (result && result.ownedNfts) {
          console.log(`Alchemy returned ${result.ownedNfts.length} NFTs for address ${addressToCheck}`);
          
          for (const nft of result.ownedNfts) {
            const metadata = (nft as any).metadata || nft.raw?.metadata || null;
            
            // Debug: Log metadata structure
            if (nft.tokenId && metadata) {
              console.log(`NFT ${nft.tokenId} metadata:`, metadata);
              console.log(`NFT ${nft.tokenId} attributes:`, metadata?.attributes);
            }
            
            // Primary method: Extract FID from tokenId
            const fidExtraction = await extractFidFromTokenId(
              nft.tokenId,
              CONTRACT_ADDRESS
            );
            
            let author: FarcasterUser | null = null;
            
            // Use extracted FID to get author data
            if (fidExtraction.success && fidExtraction.fid && isValidFid(fidExtraction.fid)) {
              console.log(`NFT ${nft.tokenId} FID extracted: ${fidExtraction.fid} via ${fidExtraction.method}`);
              author = await fetchFarcasteUserByFid(fidExtraction.fid);
            }
            
            // Fallback: Try both 'author' and 'auther' from metadata for backwards compatibility
            if (!author) {
              const authorUsername = metadata?.attributes?.find((attr: any) => 
                attr.trait_type === 'author' || attr.trait_type === 'auther'
              )?.value;
              
              console.log(`NFT ${nft.tokenId} falling back to author username from metadata:`, authorUsername);
              
              if (authorUsername) {
                author = await fetchAuthor(authorUsername);
              }
            }
            
            // Check if we already have this NFT to avoid duplicates
            const exists = allNfts.some(existingNft => 
              existingNft.tokenId === nft.tokenId && 
              existingNft.contractAddress === CONTRACT_ADDRESS
            );
            
            if (!exists) {
              // Try to fetch minter information by getting transfer data
              let minter: FarcasterUser | null = null;
              try {
                const alchemy = getAlchemy();
                const transfers = await alchemy.core.getAssetTransfers({
                  fromAddress: '0x0000000000000000000000000000000000000000',
                  contractAddresses: [CONTRACT_ADDRESS],
                  category: [AssetTransfersCategory.ERC721],
                  maxCount: 50 // Get more transfers and filter by tokenId
                });
                
                // Filter transfers by tokenId
                const tokenTransfers = transfers.transfers.filter(t => t.tokenId === nft.tokenId);
                if (tokenTransfers.length > 0) {
                  const toAddress = tokenTransfers[0].to;
                  if (toAddress) {
                    minter = await fetchFarcasterUserByAddress(toAddress);
                  }
                }
              } catch (error) {
                console.warn(`Failed to fetch minter for token ${nft.tokenId}:`, error);
              }

              allNfts.push({
                tokenId: nft.tokenId,
                metadata,
                contractAddress: CONTRACT_ADDRESS,
                chain: 'base',
                author,
                minter
              });
            }
          }
        }
      }

      console.log('Total unique NFTs found:', allNfts.length);
      setUserNFTs(allNfts);
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch user NFTs');
    } finally {
      setIsLoadingUserNFTs(false);
    }
  }, [farcasterAddresses, address, isConnected, fetchAuthor, fetchFarcasterUserByAddress]);

  // Fetch recently minted NFTs
  const fetchRecentNFTs = useCallback(async (currentPageKey?: string, append: boolean = false) => {
    if (!append) {
      setIsLoadingRecentNFTs(true);
    } else {
      setIsLoadingMoreRecent(true);
    }
    setError(null);

    try {
      const result = await safeAlchemyRequest(async () => {
        const alchemy = getAlchemy();
        return await alchemy.nft.getNftsForContract(CONTRACT_ADDRESS, {
          pageSize: ITEMS_PER_PAGE,
          pageKey: currentPageKey,
          omitMetadata: false
        });
      });

      if (!result) {
        throw new Error('Failed to fetch recent NFTs from Alchemy');
      }

      const nfts: NFTToken[] = [];

      for (const nft of result.nfts || []) {
        const metadata = (nft as any).metadata || nft.raw?.metadata || null;
        
        // Extract FID from tokenId to get author data
        let author: FarcasterUser | null = null;
        try {
          const fidExtraction = await extractFidFromTokenId(
            nft.tokenId,
            CONTRACT_ADDRESS
          );
          
          if (fidExtraction.success && fidExtraction.fid && isValidFid(fidExtraction.fid)) {
            console.log(`Recent NFT ${nft.tokenId} FID extracted: ${fidExtraction.fid} via ${fidExtraction.method}`);
            author = await fetchFarcasteUserByFid(fidExtraction.fid);
          }
          
          // Fallback: Try metadata attributes
          if (!author) {
            const authorUsername = metadata?.attributes?.find((attr: any) => 
              attr.trait_type === 'author' || attr.trait_type === 'auther'
            )?.value;
            
            if (authorUsername && typeof authorUsername === 'string') {
              console.log(`Recent NFT ${nft.tokenId} falling back to metadata author:`, authorUsername);
              author = await fetchAuthor(authorUsername);
            }
          }
        } catch (error) {
          console.warn(`Failed to extract author for recent NFT ${nft.tokenId}:`, error);
        }
        
        nfts.push({
          tokenId: nft.tokenId,
          metadata,
          contractAddress: CONTRACT_ADDRESS,
          chain: 'base',
          author
        });
      }

      if (append) {
        setRecentNFTs(prev => [...prev, ...nfts]);
      } else {
        setRecentNFTs(nfts);
      }

      // Update pagination state
      setPageKey(result.pageKey);
      setHasMoreRecent(!!result.pageKey);

    } catch (error) {
      console.error('Error fetching recent NFTs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch recent NFTs');
    } finally {
      if (!append) {
        setIsLoadingRecentNFTs(false);
      } else {
        setIsLoadingMoreRecent(false);
      }
    }
  }, [fetchAuthor]);

  // Load more recent NFTs
  const loadMoreRecent = useCallback(() => {
    if (!isLoadingMoreRecent && hasMoreRecent && pageKey) {
      fetchRecentNFTs(pageKey, true);
    }
  }, [pageKey, isLoadingMoreRecent, hasMoreRecent, fetchRecentNFTs]);

  // Fetch Farcaster addresses when FID is available
  useEffect(() => {
    if (fid) {
      console.log('Fetching Farcaster addresses for FID:', fid);
      fetchFarcasterAddresses(fid).then(addresses => {
        console.log('Fetched Farcaster addresses for FID', fid, ':', addresses);
        setFarcasterAddresses(addresses);
      });
    } else {
      console.log('No FID available from Farcaster profile');
    }
  }, [fid, fetchFarcasterAddresses]);

  // Initial data fetch - depends on addresses being loaded
  useEffect(() => {
    // Only fetch if we have addresses (either from Farcaster or wallet) or if we tried loading Farcaster addresses
    if (farcasterAddresses.length > 0 || (address && isConnected) || (!fid && !isLoadingAddresses)) {
      fetchUserNFTs();
    }
  }, [fetchUserNFTs, farcasterAddresses, address, isConnected, fid, isLoadingAddresses]);

  useEffect(() => {
    fetchRecentNFTs(undefined, false);
    setPageKey(undefined);
    setHasMoreRecent(true);
  }, [fetchRecentNFTs]);

  return {
    userNFTs,
    recentNFTs,
    isLoadingUserNFTs,
    isLoadingRecentNFTs,
    error,
    loadMoreRecent,
    hasMoreRecent,
    isLoadingMoreRecent,
  };
}