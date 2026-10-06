import { signingKey, toPublicJwk } from "@/server/result";

// The public half of the result-signing key, for anyone verifying a Voit result.
export function GET() {
  return Response.json(toPublicJwk(signingKey()), {
    headers: { "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" },
  });
}
