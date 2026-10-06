// Model solvability: gives every gold item of a pack to current models, the way a candidate relaying
// it would, and writes content/solvability.json. Run by hand only, with the founder's go.
//
//   npm run solvability -- [--pack education-platform-engineer] [--models claude:claude-opus-5-5,codex,ollama:qwen2.5:7b] [--tries 5]
//
// Providers and how each signs in: scripts/models.ts. Keys, when a provider needs one, come from .env.
// No refusal fallbacks: a fallback would answer with a different model and blur the per-model rates.
// A refusal or error counts as an unreadable try.

import { writeFileSync } from "node:fs";
import { loadBank } from "../src/server/bank";
import { runSolvability, type Ask } from "../src/server/solvability";
import { ask, DEFAULT_MODELS } from "./models";

try {
  process.loadEnvFile();
} catch {
  // no .env: subscription and local providers need none
}

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const pack = arg("pack", "education-platform-engineer");
const models = arg("models", DEFAULT_MODELS.join(",")).split(",");
const tries = Number(arg("tries", "5"));

let done = 0;
const perItem = models.length * tries;
const counted: Ask = async (model, prompt) => {
  try {
    return await ask(model, prompt);
  } finally {
    if (++done % perItem === 0) console.log(`  item ${done / perItem} done`);
  }
};

const report = await runSolvability(loadBank(), pack, models, tries, counted);
writeFileSync("content/solvability.json", JSON.stringify({ runAt: new Date().toISOString(), ...report }, null, 2) + "\n");

for (const i of report.items) {
  const per = Object.entries(i.byModel).map(([m, r]) => `${m} ${r.right}/${r.tries}`).join(", ");
  console.log(`${i.id.padEnd(20)} ${(i.rate * 100).toFixed(0).padStart(3)}%  ${i.unreadable} unreadable  (${per})${i.retired ? "  retired" : ""}`);
}
console.log(`\npack ${(report.packRate * 100).toFixed(0)}%, target below ${report.target * 100}%: ${report.meetsTarget ? "met" : "NOT met"}`);
