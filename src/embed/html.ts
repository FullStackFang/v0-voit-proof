import { areaName, pips } from "./format";
import { PIP } from "./marks";

// HTML builders shared by the player and the /verify and /pool pages. Everything from data is escaped.

export type Profile = Partial<Record<string, { earned: number; of: number }>>;

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** One row per area seen: name, a pip per gold item, "1.5 of 2". No overall score. */
export function profileHtml(profile: Profile): string {
  const rows = Object.entries(profile).flatMap(([area, a]) =>
    a
      ? [`<div class="row"><span>${esc(areaName(area))}</span><span class="pips">${pips(a.earned, a.of).map((p) => PIP[p]).join("")}</span><span class="v">${a.earned} of ${a.of}</span></div>`]
      : [],
  );
  return `<div class="vc-prof">${rows.join("")}</div>`;
}
