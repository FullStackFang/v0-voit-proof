import { CORS, preflight, readJson, serverDeps } from "@/server/deps";
import { submitAnswer } from "@/server/sessions";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, body } = await submitAnswer(serverDeps(), id, await readJson(req));
  return Response.json(body, { status, headers: CORS });
}

export const OPTIONS = preflight;
