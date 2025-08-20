import { NextRequest, NextResponse } from "next/server";
import { fetchFarcasteUserByFid } from "~/lib/facaster";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  if (!fid) {
    return NextResponse.json({ error: 'Fid is required' }, { status: 400 });
  }
  const farcasterUser = await fetchFarcasteUserByFid(fid);
  return NextResponse.json(farcasterUser);
}