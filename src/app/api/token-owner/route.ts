import { NextRequest, NextResponse } from 'next/server';
import { Alchemy, Network } from 'alchemy-sdk';

const CONTRACT_ADDRESS = '0xc011Ec7Ca575D4f0a2eDA595107aB104c7Af7A09';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get('tokenId');

  if (!tokenId) {
    return NextResponse.json({ error: 'tokenId parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'NEXT_PUBLIC_ALCHEMY_KEY is not configured'
    }, { status: 500 });
  }

  try {
    const settings = {
      apiKey: apiKey,
      network: Network.BASE_MAINNET,
    };
    const alchemy = new Alchemy(settings);

    // Get the owner of the specific token
    const owner = await alchemy.nft.getOwnersForNft(CONTRACT_ADDRESS, tokenId);
    
    console.log('🔍 Token owner lookup:', {
      tokenId,
      contractAddress: CONTRACT_ADDRESS,
      owners: owner.owners
    });

    return NextResponse.json({
      success: true,
      tokenId,
      contractAddress: CONTRACT_ADDRESS,
      owners: owner.owners
    });

  } catch (error: any) {
    console.error('❌ Alchemy API Error:', error);
    return NextResponse.json({
      error: 'Failed to fetch token owner from Alchemy',
      details: error.message,
      tokenId,
      contractAddress: CONTRACT_ADDRESS
    }, { status: 500 });
  }
}