import { NextRequest, NextResponse } from 'next/server';
import { CollectiblesService } from '~/services/collectibles';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    // For now, return mock data. In production, this would integrate with:
    // - Neynar API for Farcaster casts
    // - Alchemy API for NFT metadata
    // - Custom logic to identify collectible casts
    
    const collectibles = CollectiblesService.getMockCollectibles('recent');
    
    // Simulate pagination
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = startIndex + limit;
    const paginatedCollectibles = collectibles.slice(startIndex, endIndex);
    const hasMore = endIndex < collectibles.length;
    const nextCursor = hasMore ? endIndex.toString() : undefined;

    return NextResponse.json({
      collectibles: paginatedCollectibles,
      cursor: nextCursor,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching recent collectibles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent collectibles' },
      { status: 500 }
    );
  }
}