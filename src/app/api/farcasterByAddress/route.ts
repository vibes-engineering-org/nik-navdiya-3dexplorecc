import { NextRequest, NextResponse } from "next/server";
import { fetchFarcasteUserByAddress } from "~/lib/facaster";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }
  const farcasterUser = await fetchFarcasteUserByAddress(address);
  return NextResponse.json(farcasterUser);
}