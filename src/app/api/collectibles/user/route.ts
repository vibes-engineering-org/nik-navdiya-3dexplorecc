import { NextRequest, NextResponse } from 'next/server';

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

    // Mock user collectibles data
    const mockCollectibles = [
      {
        id: '2',
        hash: '0xfedcba0987654321',
        author: {
          fid: parseInt(fid),
          username: 'user_creates',
          display_name: 'User Creator',
          pfp: {
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'My personal collection item. This represents my creative journey.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        embeds: [{
          url: undefined,
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 89,
          recasts_count: 16,
          replies_count: 8
        },
        channel: undefined
      }
    ];

    return NextResponse.json({
      collectibles: mockCollectibles,
      cursor: undefined,
      hasMore: false
    });
  } catch (error) {
    console.error('Error fetching user collectibles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user collectibles' },
      { status: 500 }
    );
  }
}