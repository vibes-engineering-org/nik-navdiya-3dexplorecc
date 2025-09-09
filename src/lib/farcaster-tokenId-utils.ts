/**
 * Utility functions for extracting FID from Farcaster collectible tokenIds
 * 
 * Farcaster collectible tokenIds can encode FID and castHash in various ways.
 * This module provides multiple strategies to extract the FID.
 */

import { Alchemy, Network } from 'alchemy-sdk';

export interface TokenIdParseResult {
  fid?: string;
  castHash?: string;
  success: boolean;
  method: string;
}

/**
 * Strategy 1: Parse tokenId as encoded FID + castHash
 * Some contracts encode FID in the lower bits and castHash in upper bits
 */
export function parseTokenIdAsEncodedData(tokenId: string): TokenIdParseResult {
  try {
    const tokenIdBig = BigInt(tokenId);
    
    // Strategy 1a: FID in lower 64 bits, castHash in upper bits
    const fidMask = (BigInt(1) << BigInt(64)) - BigInt(1);
    const extractedFid = (tokenIdBig & fidMask).toString();
    
    if (extractedFid !== '0' && extractedFid !== tokenId) {
      return {
        fid: extractedFid,
        success: true,
        method: 'encoded_lower_64_bits'
      };
    }
    
    // Strategy 1b: FID in lower 32 bits
    const fidMask32 = (BigInt(1) << BigInt(32)) - BigInt(1);
    const extractedFid32 = (tokenIdBig & fidMask32).toString();
    
    if (extractedFid32 !== '0' && extractedFid32 !== tokenId) {
      return {
        fid: extractedFid32,
        success: true,
        method: 'encoded_lower_32_bits'
      };
    }
    
    return {
      success: false,
      method: 'encoded_data_failed'
    };
  } catch (error) {
    console.warn('Error parsing tokenId as encoded data:', error);
    return {
      success: false,
      method: 'encoded_data_error'
    };
  }
}

/**
 * Strategy 2: Extract FID from mint transaction logs
 */
export async function extractFidFromMintTransaction(
  contractAddress: string,
  tokenId: string,
  transactionHash?: string
): Promise<TokenIdParseResult> {
  if (!transactionHash) {
    return {
      success: false,
      method: 'no_transaction_hash'
    };
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
    if (!apiKey) {
      return {
        success: false,
        method: 'no_alchemy_key'
      };
    }

    const alchemy = new Alchemy({
      apiKey: apiKey,
      network: Network.BASE_MAINNET,
    });

    const receipt = await alchemy.core.getTransactionReceipt(transactionHash);
    
    if (!receipt) {
      return {
        success: false,
        method: 'no_transaction_receipt'
      };
    }
    
    // Look for Transfer events from zero address (mint)
    const transferEvents = receipt.logs.filter(log => 
      log.address?.toLowerCase() === contractAddress.toLowerCase() &&
      log.topics.length >= 4 &&
      log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && // Transfer event
      log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000' // from zero address
    );

    for (const event of transferEvents) {
      // Check if this is the right tokenId
      const eventTokenId = BigInt(event.topics[3]).toString();
      if (eventTokenId === tokenId) {
        // Look for additional data that might contain FID
        if (event.data && event.data !== '0x') {
          // Try to parse data as FID + castHash
          const data = event.data.slice(2); // remove 0x
          if (data.length >= 64) {
            // First 32 bytes might be FID
            const possibleFid = BigInt('0x' + data.slice(0, 64)).toString();
            if (possibleFid !== '0' && possibleFid.length < 10) { // FIDs are typically under 7 digits
              return {
                fid: possibleFid,
                success: true,
                method: 'transaction_log_data'
              };
            }
          }
        }
      }
    }

    // Look for custom Mint events that might have FID
    const mintEvents = receipt.logs.filter(log => 
      log.address?.toLowerCase() === contractAddress.toLowerCase() &&
      log.topics.length >= 1
    );

    for (const event of mintEvents) {
      if (event.data && event.data !== '0x') {
        const data = event.data.slice(2);
        // Try different parsing strategies for custom events
        if (data.length >= 128) {
          // Data might contain: tokenId (32 bytes) + fid (32 bytes) + castHash (32 bytes)
          const chunk1 = data.slice(0, 64);  // First 32 bytes
          const chunk2 = data.slice(64, 128); // Second 32 bytes
          const chunk3 = data.slice(128, 192); // Third 32 bytes if exists
          
          for (const chunk of [chunk1, chunk2, chunk3]) {
            if (chunk) {
              const possibleFid = BigInt('0x' + chunk).toString();
              if (possibleFid !== '0' && possibleFid.length >= 1 && possibleFid.length <= 8) {
                return {
                  fid: possibleFid,
                  success: true,
                  method: 'transaction_log_custom_event'
                };
              }
            }
          }
        }
      }
    }

    return {
      success: false,
      method: 'transaction_log_no_fid'
    };
  } catch (error) {
    console.warn('Error extracting FID from mint transaction:', error);
    return {
      success: false,
      method: 'transaction_log_error'
    };
  }
}

/**
 * Strategy 3: Use a heuristic based on tokenId patterns
 * Some contracts use predictable patterns
 */
export function extractFidFromTokenIdPattern(tokenId: string): TokenIdParseResult {
  try {
    const tokenIdNum = BigInt(tokenId);
    
    // Strategy 3a: If tokenId is small (< 1000000), it might be the FID directly
    if (tokenIdNum > 0 && tokenIdNum < 1000000) {
      return {
        fid: tokenId,
        success: true,
        method: 'direct_tokenid_as_fid'
      };
    }
    
    // Strategy 3b: Check if tokenId follows timestamp + FID pattern
    // Large numbers might have FID embedded
    if (tokenIdNum > 1000000) {
      // Try extracting last 6 digits as potential FID
      const lastSixDigits = tokenIdNum % BigInt(1000000);
      if (lastSixDigits > 0 && lastSixDigits < 1000000) {
        return {
          fid: lastSixDigits.toString(),
          success: true,
          method: 'last_digits_as_fid'
        };
      }
    }
    
    return {
      success: false,
      method: 'pattern_no_match'
    };
  } catch (error) {
    console.warn('Error extracting FID from tokenId pattern:', error);
    return {
      success: false,
      method: 'pattern_error'
    };
  }
}

/**
 * Master function that tries all strategies to extract FID from tokenId
 */
export async function extractFidFromTokenId(
  tokenId: string,
  contractAddress: string,
  transactionHash?: string
): Promise<TokenIdParseResult> {
  console.log(`Extracting FID for tokenId ${tokenId}...`);
  
  // Strategy 1: Try encoded data parsing
  const encodedResult = parseTokenIdAsEncodedData(tokenId);
  if (encodedResult.success) {
    console.log(`FID extracted via ${encodedResult.method}: ${encodedResult.fid}`);
    return encodedResult;
  }
  
  // Strategy 2: Try pattern matching
  const patternResult = extractFidFromTokenIdPattern(tokenId);
  if (patternResult.success) {
    console.log(`FID extracted via ${patternResult.method}: ${patternResult.fid}`);
    return patternResult;
  }
  
  // Strategy 3: Try transaction log parsing (more expensive, do last)
  if (transactionHash) {
    const transactionResult = await extractFidFromMintTransaction(
      contractAddress,
      tokenId,
      transactionHash
    );
    if (transactionResult.success) {
      console.log(`FID extracted via ${transactionResult.method}: ${transactionResult.fid}`);
      return transactionResult;
    }
  }
  
  console.log(`Failed to extract FID from tokenId ${tokenId}`);
  return {
    success: false,
    method: 'all_strategies_failed'
  };
}

/**
 * Validate that an extracted FID is reasonable
 */
export function isValidFid(fid: string): boolean {
  try {
    const fidNum = parseInt(fid);
    // FIDs are typically positive integers under 10 million
    return fidNum > 0 && fidNum < 10000000 && !isNaN(fidNum);
  } catch {
    return false;
  }
}