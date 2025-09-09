import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      console.warn("No Neynar API key found");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const url = `https://api.neynar.com/v2/farcaster/user/bulk/?fids=${fid}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        api_key: apiKey,
      },
    });

    if (!response.ok) {
      console.warn(`Neynar API error: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract verified addresses from the user data
    const verifiedAddresses: string[] = [];

    // Add custody address if available
    if (user.custody_address) {
      verifiedAddresses.push(user.custody_address);
    }

    // Add verified addresses if available
    if (user.verified_addresses?.eth_addresses) {
      verifiedAddresses.push(...user.verified_addresses.eth_addresses);
    }

    return NextResponse.json({
      fid: user.fid,
      username: user.username,
      addresses: verifiedAddresses.filter(Boolean), // Remove any null/undefined values
    });
  } catch (error) {
    console.error("Error fetching Farcaster addresses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
