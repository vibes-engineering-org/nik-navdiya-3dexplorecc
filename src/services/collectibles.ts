import { Collectible } from '~/store/collectibles';

export interface CollectiblesResponse {
  collectibles: Collectible[];
  cursor?: string;
  hasMore: boolean;
}

export class CollectiblesService {
  static async fetchRecentCollectibles(cursor?: string, limit = 20): Promise<CollectiblesResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/collectibles/recent?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent collectibles');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recent collectibles:', error);
      throw error;
    }
  }

  static async fetchUserCollectibles(fid: number, cursor?: string, limit = 20): Promise<CollectiblesResponse> {
    try {
      const params = new URLSearchParams();
      params.append('fid', fid.toString());
      if (cursor) params.append('cursor', cursor);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/collectibles/user?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user collectibles');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user collectibles:', error);
      throw error;
    }
  }

  // Mock data for development/fallback
  static getMockCollectibles(path: 'recent' | 'mycollection'): Collectible[] {
    const baseCollectibles: Collectible[] = [
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
        text: 'Just dropped my latest digital art piece! This one represents the intersection of nature and technology. What do you think?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        embeds: [{
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
      },
      {
        id: '2',
        hash: '0xfedcba0987654321',
        author: {
          fid: 5678,
          username: 'bob_creates',
          display_name: 'Bob the Builder',
          pfp: {
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Experimenting with generative patterns. Each piece is unique and created through algorithmic processes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        embeds: [{
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
        }
      },
      {
        id: '3',
        hash: '0xabcdef1234567890',
        author: {
          fid: 9101,
          username: 'charlie_photo',
          display_name: 'Charlie Lens',
          pfp: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Captured this moment during golden hour. Sometimes the best art happens when you least expect it.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 203,
          recasts_count: 45,
          replies_count: 22
        },
        channel: {
          id: 'photography',
          name: 'Photography'
        }
      },
      {
        id: '4',
        hash: '0x567890abcdef1234',
        author: {
          fid: 1121,
          username: 'diana_design',
          display_name: 'Diana Designer',
          pfp: {
            url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'New character design for my upcoming project. Inspired by cyberpunk aesthetics and nature fusion.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 156,
          recasts_count: 31,
          replies_count: 19
        }
      },
      {
        id: '5',
        hash: '0x234567890abcdef1',
        author: {
          fid: 3141,
          username: 'eve_artist',
          display_name: 'Eve Creator',
          pfp: {
            url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Abstract composition exploring the relationship between color and emotion. What feelings does this evoke for you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 94,
          recasts_count: 18,
          replies_count: 12
        },
        channel: {
          id: 'abstract',
          name: 'Abstract Art'
        }
      }
    ];

    // Modify data slightly based on path
    if (path === 'mycollection') {
      return baseCollectibles.map(collectible => ({
        ...collectible,
        reactions: {
          ...collectible.reactions,
          likes_count: Math.floor(collectible.reactions.likes_count * 0.7),
          recasts_count: Math.floor(collectible.reactions.recasts_count * 0.8),
        }
      }));
    }

    return baseCollectibles;
  }
}