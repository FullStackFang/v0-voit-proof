// The small drawings, as SVG markup, from the approved mockup. Constants only: no data goes in here.
// Colours are set with style="" because presentation attributes do not read CSS variables.

/** The seal: four strokes on the blue plate, the third coral. Sits inside a .seal span. */
export const SEAL = `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><rect x="5" y="6" width="14" height="2"/><rect x="5" y="10" width="14" height="2"/><rect x="5" y="16" width="14" height="2"/><rect x="5" y="13" width="9" height="2" style="fill:var(--you)"/></g></svg>`;

export const ARROW = `<svg viewBox="0 0 20 12" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="6" x2="18" y2="6"/><polyline points="13,1 18,6 13,11"/></g></svg>`;

export const GRIP = `<svg class="grip" viewBox="0 0 10 16" aria-hidden="true"><g fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/></g></svg>`;

export const PIP = {
  full: `<svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" style="fill:var(--proof)"/></svg>`,
  half: `<svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.25" fill="none" stroke-width="1.5" style="stroke:var(--proof)"/><path d="M7 1A6 6 0 0 0 7 13Z" style="fill:var(--proof)"/></svg>`,
  none: `<svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.25" fill="none" stroke-width="1.5" style="stroke:var(--ink-2)" opacity=".5"/></svg>`,
};

/** The end figure: five gates, the coral stroke through every one, ending in a dot. */
export const PASSED = `<svg class="vc-gate" viewBox="0 0 584 40" aria-hidden="true"><g stroke-width="2" style="stroke:var(--ink-2)"><line x1="110" y1="4" x2="110" y2="36"/><line x1="210" y1="4" x2="210" y2="36"/><line x1="310" y1="4" x2="310" y2="36"/><line x1="410" y1="4" x2="410" y2="36"/><line x1="510" y1="4" x2="510" y2="36"/></g><line x1="6" y1="20" x2="560" y2="20" stroke-width="5" stroke-linecap="round" style="stroke:var(--you)"/><circle cx="560" cy="20" r="6" style="fill:var(--you)"/></svg>`;
