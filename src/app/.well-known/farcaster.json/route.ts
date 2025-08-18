import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
      payload:
        "eyJkb21haW4iOiJuaWstbmF2ZGl5YS0zZGV4cGxvcmVjYy52ZXJjZWwuYXBwIn0",
      signature:
        "MHhmN2NlYmViNzk4NzYxMGUyZmI4YWRjOGFkODAyMzhhMjU4YmRkYmE4ZjIyYTNiZmNjNjA4ODY0NWIxZGU5YjhjN2IzZWNmYTg4MmRhNjFmZDdkM2I0NWMyODBkOTJmYzMzYzlmYzY3NThhZDQ3NmE4YjQ0YzRkOThhNDFlMWY5ODFj",
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Open",
      webhookUrl: `${appUrl}/api/webhook`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#555555",
      primaryCategory: "social",
    },
  };

  return Response.json(config);
}
