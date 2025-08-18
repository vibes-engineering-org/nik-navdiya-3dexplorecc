import { NextRequest, NextResponse } from 'next/server';
import { CollectiblesService } from '~/services/collectibles';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      );
    }

    // For now, return mock data. In production, this would:
    // - Query Neynar API for user's casts
    // - Filter for collectible/NFT-related content
    // - Fetch additional metadata from Alchemy API
    
    const collectibles = CollectiblesService.getMockCollectibles('mycollection');
    
    // Update author info to match the requested FID
    const userCollectibles = collectibles.map(collectible => ({
      ...collectible,
      author: {
        ...collectible.author,
        fid: parseInt(fid)
      }
    }));
    
    // Simulate pagination
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = startIndex + limit;
    const paginatedCollectibles = userCollectibles.slice(startIndex, endIndex);
    const hasMore = endIndex < userCollectibles.length;
    const nextCursor = hasMore ? endIndex.toString() : undefined;

    return NextResponse.json({
      collectibles: paginatedCollectibles,
      cursor: nextCursor,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching user collectibles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user collectibles' },
      { status: 500 }
    );
  }
}