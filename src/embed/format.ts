// Small formatting rules shared by the player and the /verify and /pool pages.

const AREA_NAMES: Record<string, string> = {
  records: "Records",
  tenancy: "Tenancy",
  rules: "Rules",
  "ai-in-the-loop": "AI in the loop",
  "ai-code": "AI code",
  ops: "Ops",
};

export function areaName(area: string): string {
  return AREA_NAMES[area] ?? area;
}

/** One pip per gold item in an area: full for each whole point, half for a half, empty for the rest. */
export function pips(earned: number, of: number): ("full" | "half" | "none")[] {
  return Array.from({ length: of }, (_, i) => (earned >= i + 1 ? "full" : earned >= i + 0.5 ? "half" : "none"));
}

/** 185 → "3 min 05 s"; 45 → "45 s". */
export function duration(seconds: number): string {
  const s = Math.round(seconds);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
}

/** The flags that are not zero, in words: "20 s away", "2 pastes", "1 bulk input". */
export function flagWords(f: { timeAwaySeconds: number; pasteAttempts: number; bulkInputs: number }): string[] {
  const out: string[] = [];
  if (f.timeAwaySeconds > 0) out.push(`${duration(f.timeAwaySeconds)} away`);
  if (f.pasteAttempts > 0) out.push(`${f.pasteAttempts} ${f.pasteAttempts === 1 ? "paste" : "pastes"}`);
  if (f.bulkInputs > 0) out.push(`${f.bulkInputs} bulk ${f.bulkInputs === 1 ? "input" : "inputs"}`);
  return out;
}

/** "education-platform-engineer" → "Education platform engineer". Tokens carry the pack id only. */
export function roleName(pack: string): string {
  const words = pack.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
