import { CORS, preflight, readJson, serverDeps } from "@/server/deps";
import { startSession } from "@/server/sessions";

export async function POST(req: Request) {
  const { status, body } = await startSession(serverDeps(), await readJson(req));
  return Response.json(body, { status, headers: CORS });
}

export const OPTIONS = preflight;
