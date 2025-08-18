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

  // Mock data for development/fallback - Expanded with 50+ collectibles
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
        text: 'Just dropped my latest digital art piece! This one represents the intersection of nature and technology.',
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
        text: 'Abstract composition exploring the relationship between color and emotion. What feelings does this evoke?',
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
      },
      {
        id: '6',
        hash: '0x890abcdef1234567',
        author: {
          fid: 4567,
          username: 'frank_music',
          display_name: 'Frank Melody',
          pfp: {
            url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Visualizing sound waves through art. This piece captures the essence of my latest ambient track.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 76,
          recasts_count: 12,
          replies_count: 7
        },
        channel: {
          id: 'music',
          name: 'Music & Audio'
        }
      },
      {
        id: '7',
        hash: '0xcdef123456789abc',
        author: {
          fid: 7890,
          username: 'grace_architect',
          display_name: 'Grace Builder',
          pfp: {
            url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Architectural visualization of sustainable living spaces. The future is green and beautiful.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 234,
          recasts_count: 67,
          replies_count: 45
        },
        channel: {
          id: 'architecture',
          name: 'Architecture'
        }
      },
      {
        id: '8',
        hash: '0x23456789abcdef01',
        author: {
          fid: 2345,
          username: 'henry_vr',
          display_name: 'Henry Virtual',
          pfp: {
            url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Step into virtual worlds where imagination meets reality. This is just the beginning.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 312,
          recasts_count: 89,
          replies_count: 56
        },
        channel: {
          id: 'vr',
          name: 'Virtual Reality'
        }
      },
      {
        id: '9',
        hash: '0x56789abcdef01234',
        author: {
          fid: 6789,
          username: 'ivy_nature',
          display_name: 'Ivy Green',
          pfp: {
            url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Macro photography reveals the intricate beauty hidden in everyday nature. Look closer.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 187,
          recasts_count: 42,
          replies_count: 31
        },
        channel: {
          id: 'nature',
          name: 'Nature'
        }
      },
      {
        id: '10',
        hash: '0x789abcdef0123456',
        author: {
          fid: 9876,
          username: 'jack_minimal',
          display_name: 'Jack Simple',
          pfp: {
            url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Sometimes less is more. Minimalist design speaks volumes through simplicity.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 145,
          recasts_count: 33,
          replies_count: 18
        },
        channel: {
          id: 'design',
          name: 'Design'
        }
      },
      {
        id: '11',
        hash: '0xabcdef0123456789',
        author: {
          fid: 1357,
          username: 'kate_street',
          display_name: 'Kate Urban',
          pfp: {
            url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Street art brings color and life to urban spaces. Every wall tells a story.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 267,
          recasts_count: 78,
          replies_count: 44
        },
        channel: {
          id: 'street-art',
          name: 'Street Art'
        }
      },
      {
        id: '12',
        hash: '0xdef0123456789abc',
        author: {
          fid: 2468,
          username: 'liam_code',
          display_name: 'Liam Developer',
          pfp: {
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Code is poetry. This visualization shows the beauty of algorithms in motion.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 198,
          recasts_count: 54,
          replies_count: 37
        },
        channel: {
          id: 'programming',
          name: 'Programming'
        }
      },
      {
        id: '13',
        hash: '0x0123456789abcdef',
        author: {
          fid: 3691,
          username: 'mia_space',
          display_name: 'Mia Cosmos',
          pfp: {
            url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Exploring the cosmos through digital art. Each star holds infinite possibilities.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 423,
          recasts_count: 112,
          replies_count: 89
        },
        channel: {
          id: 'space',
          name: 'Space & Cosmos'
        }
      },
      {
        id: '14',
        hash: '0x3456789abcdef012',
        author: {
          fid: 4802,
          username: 'noah_retro',
          display_name: 'Noah Vintage',
          pfp: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Bringing back the 80s aesthetic with modern twists. Nostalgia meets innovation.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1551732998-cac2fb6b31a5?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 156,
          recasts_count: 41,
          replies_count: 23
        },
        channel: {
          id: 'retro',
          name: 'Retro & Vintage'
        }
      },
      {
        id: '15',
        hash: '0x6789abcdef012345',
        author: {
          fid: 5913,
          username: 'olivia_motion',
          display_name: 'Olivia Animate',
          pfp: {
            url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Motion graphics that tell stories. Every frame is carefully crafted to convey emotion.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 289,
          recasts_count: 73,
          replies_count: 52
        },
        channel: {
          id: 'animation',
          name: 'Animation'
        }
      },
      {
        id: '16',
        hash: '0x9abcdef012345678',
        author: {
          fid: 7024,
          username: 'peter_pixel',
          display_name: 'Peter Dots',
          pfp: {
            url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Pixel art revival in the digital age. Every dot tells part of the story.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 134,
          recasts_count: 29,
          replies_count: 16
        },
        channel: {
          id: 'pixel-art',
          name: 'Pixel Art'
        }
      },
      {
        id: '17',
        hash: '0xcdef012345678abc',
        author: {
          fid: 8135,
          username: 'quinn_fractal',
          display_name: 'Quinn Infinite',
          pfp: {
            url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Fractal patterns reveal the hidden mathematics of beauty. Infinite complexity from simple rules.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 376,
          recasts_count: 98,
          replies_count: 71
        },
        channel: {
          id: 'fractals',
          name: 'Fractals & Math Art'
        }
      },
      {
        id: '18',
        hash: '0x012345678abcdef9',
        author: {
          fid: 9246,
          username: 'ruby_portrait',
          display_name: 'Ruby Face',
          pfp: {
            url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Digital portraits that capture more than just appearance. The soul shines through pixels.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 34).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 223,
          recasts_count: 61,
          replies_count: 38
        },
        channel: {
          id: 'portraits',
          name: 'Digital Portraits'
        }
      },
      {
        id: '19',
        hash: '0x345678abcdef0129',
        author: {
          fid: 1357,
          username: 'sam_glitch',
          display_name: 'Sam Error',
          pfp: {
            url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Embracing digital errors as artistic features. Sometimes the best art comes from mistakes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1518640467116-512266f676ac?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 167,
          recasts_count: 43,
          replies_count: 27
        },
        channel: {
          id: 'glitch-art',
          name: 'Glitch Art'
        }
      },
      {
        id: '20',
        hash: '0x678abcdef0123459',
        author: {
          fid: 2468,
          username: 'tina_cyber',
          display_name: 'Tina Neon',
          pfp: {
            url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Cyberpunk visions of tomorrow. Neon dreams and digital realities collide.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 38).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 445,
          recasts_count: 134,
          replies_count: 97
        },
        channel: {
          id: 'cyberpunk',
          name: 'Cyberpunk'
        }
      },
      {
        id: '21',
        hash: '0xabcdef9012345678',
        author: {
          fid: 3579,
          username: 'uma_origami',
          display_name: 'Uma Paper',
          pfp: {
            url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Digital origami brings ancient art into the virtual realm. Each fold tells a story.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 198,
          recasts_count: 52,
          replies_count: 31
        },
        channel: {
          id: 'crafts',
          name: 'Digital Crafts'
        }
      },
      {
        id: '22',
        hash: '0x234567890abcdef1',
        author: {
          fid: 4680,
          username: 'victor_storm',
          display_name: 'Victor Weather',
          pfp: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Capturing the raw power of nature through digital storm simulations.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 312,
          recasts_count: 78,
          replies_count: 45
        },
        channel: {
          id: 'nature',
          name: 'Nature'
        }
      },
      {
        id: '23',
        hash: '0x567890abcdef1234',
        author: {
          fid: 5791,
          username: 'wendy_crystal',
          display_name: 'Wendy Gem',
          pfp: {
            url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Crystal formations in digital space. Geometry meets organic growth.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 245,
          recasts_count: 67,
          replies_count: 38
        },
        channel: {
          id: 'geometry',
          name: 'Sacred Geometry'
        }
      },
      {
        id: '24',
        hash: '0x890abcdef1234567',
        author: {
          fid: 6802,
          username: 'xavier_ocean',
          display_name: 'Xavier Deep',
          pfp: {
            url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Underwater worlds recreated in stunning detail. Dive into digital oceans.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 389,
          recasts_count: 95,
          replies_count: 62
        },
        channel: {
          id: 'underwater',
          name: 'Ocean Art'
        }
      },
      {
        id: '25',
        hash: '0xbcdef1234567890a',
        author: {
          fid: 7913,
          username: 'yuki_zen',
          display_name: 'Yuki Peaceful',
          pfp: {
            url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Zen gardens translated into interactive digital experiences. Find your center.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 156,
          recasts_count: 41,
          replies_count: 24
        },
        channel: {
          id: 'meditation',
          name: 'Zen & Meditation'
        }
      },
      {
        id: '26',
        hash: '0xdef1234567890abc',
        author: {
          fid: 8024,
          username: 'zoe_neon',
          display_name: 'Zoe Electric',
          pfp: {
            url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Electric dreams in neon hues. The future is bright and colorful.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1518640467116-512266f676ac?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 278,
          recasts_count: 71,
          replies_count: 43
        },
        channel: {
          id: 'neon',
          name: 'Neon Art'
        }
      },
      {
        id: '27',
        hash: '0x1234567890abcde2',
        author: {
          fid: 9135,
          username: 'adam_hologram',
          display_name: 'Adam Light',
          pfp: {
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Holographic projections that blur the line between reality and imagination.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 334,
          recasts_count: 87,
          replies_count: 59
        },
        channel: {
          id: 'hologram',
          name: 'Holographic Art'
        }
      },
      {
        id: '28',
        hash: '0x4567890abcdef123',
        author: {
          fid: 1246,
          username: 'bella_vintage',
          display_name: 'Bella Classic',
          pfp: {
            url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Vintage aesthetics reimagined for the digital age. Old soul, new medium.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1551732998-cac2fb6b31a5?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 189,
          recasts_count: 48,
          replies_count: 29
        },
        channel: {
          id: 'vintage',
          name: 'Vintage Art'
        }
      },
      {
        id: '29',
        hash: '0x7890abcdef123456',
        author: {
          fid: 2357,
          username: 'carlos_mech',
          display_name: 'Carlos Machine',
          pfp: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Mechanical precision meets artistic vision. Engineering as art form.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 56).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 267,
          recasts_count: 64,
          replies_count: 41
        },
        channel: {
          id: 'mechanical',
          name: 'Mechanical Art'
        }
      },
      {
        id: '30',
        hash: '0xabcdef123456789b',
        author: {
          fid: 3468,
          username: 'diana_galaxy',
          display_name: 'Diana Cosmos',
          pfp: {
            url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
          }
        },
        text: 'Galaxy formations captured in digital brushstrokes. The universe is our canvas.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 58).toISOString(),
        embeds: [{
          metadata: {
            image: {
              url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop'
            }
          }
        }],
        reactions: {
          likes_count: 412,
          recasts_count: 103,
          replies_count: 78
        },
        channel: {
          id: 'galaxy',
          name: 'Galaxy Art'
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