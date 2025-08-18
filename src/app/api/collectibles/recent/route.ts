import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock recent collectibles data for now
    const mockCollectibles = [
      {
        id: '1',
        hash: '0x1234567890abcdef',
        author: {
          fid: 1234,
          username: 'alice',
          display_name: 'Alice Creator',
          pfp: {
            url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Just dropped my latest digital art piece! This one represents the intersection of nature and technology.',
        timestamp: new Date().toISOString(),
        embeds: [{
          url: undefined,
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1518640467116-512266f676ac?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 142,
          recasts_count: 28,
          replies_count: 15
        },
        channel: {
          id: 'art',
          name: 'Art'
        }
      }
    ];

    return NextResponse.json({
      collectibles: mockCollectibles,
      cursor: undefined,
      hasMore: false
    });
  } catch (error) {
    console.error('Error fetching recent collectibles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent collectibles' },
      { status: 500 }
    );
  }
}