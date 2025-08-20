import { FarcasterUser } from "~/hooks/use-recent-mints";

export const fetchFarcasteUserByFid = async (fid: string): Promise<FarcasterUser | null> => {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      console.warn('No Neynar API key found');
      return null;
    }
    const url = `https://api.neynar.com/v2/farcaster/user/${fid}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        api_key: apiKey,
      },
    });
    if (!response.ok) {
      console.warn(`Neynar API error: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;  
}


export const fetchFarcasteUserByAddress = async (address: string): Promise<FarcasterUser | null> => {
     try {
      const apiKey = process.env.NEYNAR_API_KEY;
      if (!apiKey) {
        console.warn('No Neynar API key found');
        return null;
      }
      const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${encodeURIComponent(address)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          api_key: apiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        console.warn(`Neynar API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      
      // The response is an object with addresses as keys
      for (const [addr, userList] of Object.entries(data)) {
        if (addr.toLowerCase() === address.toLowerCase() && Array.isArray(userList) && userList.length > 0) {
          const user = userList[0] as any;
          return {
            fid: user.fid,
            username: user.username,
            display_name: user.display_name,
            pfp_url: user.pfp_url,
          };
        }
      }

      return null;
    } catch (error) {
      console.warn(`Error fetching Farcaster user for address ${address}:`, error);
      return null;
    }
}


export const fetchFarcasterUserByUsername = async (username: string): Promise<FarcasterUser | null> => {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      console.warn('No Neynar API key found');
      return null;
    }
    const url = `https://api.neynar.com/v2/farcaster/user/by-username?username=${username}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        api_key: apiKey,
      },
    });
    if (!response.ok) {
      console.warn(`Neynar API error: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
}