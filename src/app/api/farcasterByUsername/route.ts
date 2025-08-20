import { NextRequest, NextResponse } from "next/server";
import { fetchFarcasterUserByUsername } from "~/lib/facaster";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }
  const farcasterUser = await fetchFarcasterUserByUsername(username);
  return NextResponse.json(farcasterUser);
}