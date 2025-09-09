import { NextRequest, NextResponse } from "next/server";
import { fetchFarcasterUserByUsername } from "~/lib/facaster";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  // Validate username - reject if missing, empty, or "undefined" string
  if (!username || username === 'undefined' || username === 'null') {
    return NextResponse.json({ error: 'Valid username is required' }, { status: 400 });
  }
  
  const farcasterUser = await fetchFarcasterUserByUsername(username);
  return NextResponse.json(farcasterUser);
}