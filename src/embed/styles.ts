// The Gate, as CSS strings, from the approved mockup (mockups/judge-the-ai.html).
// GATE is shared: the player puts it in its shadow root (:host), the Next pages in the document (:root).
// PLAYER is the player's own. Cream ground only: the player sits on the candidate's screen.

export const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600&family=Hanken+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Pixelify+Sans&display=swap";

export const GATE = `
:host, :root {
  --display: "Bricolage Grotesque", "Hanken Grotesk", system-ui, sans-serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --pixel: "Pixelify Sans", var(--mono);
  --r-s: 10px; --r-m: 16px; --r-l: 24px;
  --ground: oklch(0.975 0.012 85); --ground-2: oklch(0.945 0.022 80);
  --ink: oklch(0.23 0.015 60); --ink-2: oklch(0.47 0.015 60); --line: oklch(0.88 0.016 80);
  --proof: oklch(0.50 0.21 265); --proof-tint: oklch(0.92 0.045 265);
  --you: oklch(0.66 0.19 35); --you-tint: oklch(0.935 0.055 40);
  --team: oklch(0.58 0.12 180); --team-tint: oklch(0.925 0.05 180);
  --flag: oklch(0.82 0.16 92); --noise-tint: oklch(0.94 0.03 300); --noise-ink: oklch(0.55 0.07 300);
  --on-proof: oklch(0.98 0.01 265);
}
.label { font: 500 12px/1.4 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }
.vc-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.vc-brand { display: flex; align-items: center; gap: 10px; font: 600 15px var(--display); letter-spacing: -.01em; }
.seal { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: var(--proof); color: var(--on-proof); flex: none; }
.seal svg { width: 18px; height: 18px; }
.seal.big { width: 36px; height: 36px; border-radius: 10px; }
.seal.big svg { width: 20px; height: 20px; }
.vc-foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 22px; flex-wrap: wrap; }
.vc-hint { font: 400 13px var(--mono); color: var(--ink-2); }
.btn { display: inline-flex; align-items: center; gap: 12px; height: 52px; padding: 0 22px 0 24px; border: 0; border-radius: 999px; background: var(--ink); color: var(--ground); font: 600 16px var(--sans); cursor: pointer; }
.btn svg { width: 20px; height: 12px; transition: transform .25s cubic-bezier(.2,.8,.2,1); }
.btn:hover svg { transform: translateX(4px); }
.btn:disabled { opacity: .4; cursor: default; }
.btn:disabled:hover svg { transform: none; }
@media (prefers-reduced-motion: reduce) { .btn svg { transition: none; } }
:focus-visible { outline: 2px solid var(--proof); outline-offset: 3px; }
.vc-prof .row { display: grid; grid-template-columns: 1fr auto 76px; gap: 16px; align-items: center; padding: 11px 0; border-top: 1px solid var(--line); font-size: 15.5px; }
.vc-prof .row:last-child { border-bottom: 1px solid var(--line); }
.vc-prof .pips { display: flex; gap: 6px; }
.vc-prof .pips svg { width: 14px; height: 14px; }
.vc-prof .v { font: 400 14px var(--mono); font-variant-numeric: tabular-nums; text-align: right; color: var(--ink); }
.vc-words { margin: 18px 0 0; padding: 14px 16px; border-radius: var(--r-m); background: var(--ground); font-size: 15px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; }
.vc-words .label { display: block; margin-bottom: 6px; white-space: normal; }
.vc-signed { display: flex; align-items: center; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
.vc-signed b { font: 600 15px var(--display); display: block; }
.vc-signed span.m { font: 400 13px var(--mono); color: var(--ink-2); }
.vc-done { font: 600 26px/1.15 var(--display); letter-spacing: -.02em; margin: 6px 0 6px; }
.vc-lede { margin: 0 0 20px; font-size: 15.5px; color: var(--ink-2); max-width: 46ch; }
`;

export const PLAYER = `
:host { display: inline-block; max-width: 100%; }
:host([mode="practice"]) { display: block; }
[hidden] { display: none !important; }

/* the box: 304 x 78, like every captcha (mockup 06) */
.box { box-sizing: border-box; width: 304px; height: 78px; display: flex; align-items: center; gap: 12px; padding: 0 12px 0 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--ground-2); font-family: var(--sans); color: var(--ink); cursor: pointer; text-align: left; }
.box .sp { flex: 1; font-size: 13px; color: var(--ink-2); }
.cb { box-sizing: border-box; width: 28px; height: 28px; flex: none; margin: 0; padding: 0; border-radius: 4px; border: 2px solid oklch(0.62 0.012 60); background: var(--ground); color: var(--on-proof); display: grid; place-items: center; cursor: pointer; }
.cb svg { width: 18px; height: 18px; }
.box[data-state="working"] .cb { border: 3px solid var(--proof-tint); border-top-color: var(--proof); border-radius: 50%; animation: vp-spin .9s linear infinite; }
.box[data-state="done"] { cursor: default; }
.box[data-state="done"] .cb { background: var(--proof); border-color: var(--proof); cursor: default; }
@keyframes vp-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .box[data-state="working"] .cb { animation: none; } }
.mk { display: grid; justify-items: center; gap: 2px; }
.mk .seal { width: 32px; height: 32px; border-radius: 9px; }
.mk .seal svg { width: 22px; height: 22px; }
.mk b { font: 600 11px var(--display); letter-spacing: .02em; color: var(--ink); }
.mk b span { color: var(--proof); }
.mk small { font: 400 8px var(--mono); letter-spacing: .02em; color: var(--ink-2); }

/* the window: a calm board, centred over the page (inline in practice). 680 wide on an 8px rhythm, never taller
   than the screen: the band and the footer stay put and the work between them scrolls. */
.veil { position: fixed; inset: 0; background: oklch(0.23 0.015 60 / .5); z-index: 2147483646; animation: vp-fade .2s ease-out; }
.pop { position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 2147483647; box-sizing: border-box; display: flex; flex-direction: column; width: min(680px, calc(100vw - 32px)); max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px); overflow: hidden; border: 1px solid oklch(0.8 0.016 80); border-radius: var(--r-l); background: var(--ground); font: 400 16px/1.55 var(--sans); color: var(--ink); text-align: left; -webkit-font-smoothing: antialiased; animation: vp-open .32s cubic-bezier(.22,1,.36,1); --on-you: oklch(0.99 0.01 40); --edge: oklch(0.83 0.018 80); }
.pop.inline { position: static; transform: none; width: auto; max-width: 680px; max-height: none; overflow: visible; z-index: auto; animation: none; }
.vc { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }
.vc * { box-sizing: border-box; }
.vc p { margin: 0; }
@keyframes vp-fade { from { opacity: 0; } }
@keyframes vp-open { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) scale(.98); } }
@keyframes vp-in { from { opacity: 0; transform: translateY(8px); } }
@keyframes vp-pop { from { transform: scale(.6); } }
@keyframes vp-flip { from { transform: rotateX(90deg); } }

/* the band: what this is about, small; then the question, big */
.band { position: relative; flex: none; margin: 8px 8px 0; padding: 20px 24px 24px; border-radius: var(--r-m); background: var(--proof); color: var(--on-proof); }
.band .t { font: 500 12px/1.4 var(--mono); letter-spacing: .08em; text-transform: uppercase; opacity: .8; overflow-wrap: anywhere; }
.band .q { margin-top: 8px; max-width: 32ch; font: 600 clamp(21px, 1.6vw + 15px, 27px)/1.14 var(--display); letter-spacing: -.02em; text-wrap: balance; }

/* the work, between band and footer: the only part that scrolls */
.pb { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 24px; animation: vp-in .28s cubic-bezier(.22,1,.36,1); }
.pb:empty { padding: 0 0 16px; }

/* the footer: close, the run of calls, the one action */
.pf { flex: none; display: flex; align-items: center; gap: 16px; padding: 12px 12px 12px 16px; border-top: 1px solid var(--line); background: var(--ground); border-radius: 0 0 var(--r-l) var(--r-l); }
.x { width: 40px; height: 40px; flex: none; margin: 0; padding: 0; border-radius: 50%; border: 1.5px solid var(--line); background: transparent; color: var(--ink-2); font: 400 20px/1 var(--mono); display: grid; place-items: center; cursor: pointer; }
.n { flex: none; font: 400 15px var(--pixel); letter-spacing: .05em; color: var(--ink-2); white-space: nowrap; }
.track { display: flex; gap: 4px; min-width: 0; overflow: hidden; perspective: 200px; }
.track i { flex: 0 1 16px; min-width: 4px; height: 16px; border-radius: 4px; border: 1.5px solid var(--line); }
.track i.now { border: 2px solid var(--proof); }
.track i.half { background: var(--proof-tint); animation: vp-pop .24s cubic-bezier(.22,1,.36,1); }
.track i.done { border-color: var(--proof); background: var(--proof); }
.track i.just { animation: vp-flip .36s cubic-bezier(.22,1,.36,1) .12s both; }
.track.end i { animation-delay: calc(var(--i) * 60ms + .12s); }
.go { flex: none; margin: 0 0 0 auto; height: 48px; padding: 0 28px; border: 0; border-radius: 999px; background: var(--proof); color: var(--on-proof); font: 600 14px var(--mono); letter-spacing: .08em; text-transform: uppercase; cursor: pointer; transition: opacity .2s ease-out; }
.go:not(:disabled):active { transform: translateY(1px); }
.go:disabled { opacity: .35; cursor: default; }

/* inside the window */
.vc-consent { margin: 0 0 16px; padding: 12px 16px; border-radius: var(--r-s); background: var(--ground-2); font-size: 14px; line-height: 1.5; color: var(--ink-2); }
.vc-consent b { color: var(--ink); font-weight: 600; }
/* tweet-sized work: lines wrap under their own number, never a sideways scrollbar */
.vc-art { margin: 0; padding: 16px 20px 16px 12px; border-radius: var(--r-m); background: var(--ground-2); font: 400 13px/1.75 var(--mono); white-space: pre-wrap; overflow-wrap: anywhere; overflow: hidden; color: var(--ink); counter-reset: ln; tab-size: 2; }
.vc-art .l { display: block; min-height: 1.75em; padding-left: calc(2.5ch + 16px); text-indent: calc(-2.5ch - 16px); }
.vc-art .l::before { counter-increment: ln; content: counter(ln); display: inline-block; width: 2.5ch; margin-right: 16px; text-align: right; text-indent: 0; color: var(--ink-2); opacity: .5; user-select: none; -webkit-user-select: none; }
.vc-art.prose { padding: 16px 20px; white-space: pre-wrap; font: 400 16px/1.6 var(--sans); }
.vc-art .c { color: var(--ink-2); }
[data-body] { margin-top: 24px; }

/* options: chunky keys with a bottom edge; your pick lights coral */
.vc-opts { display: grid; gap: 8px; }
.vc-opt { display: grid; grid-template-columns: 32px 1fr; gap: 16px; align-items: center; width: 100%; min-height: 60px; margin: 0; padding: 12px 16px 12px 12px; text-align: left; border-radius: var(--r-m); border: 2px solid var(--line); border-bottom: 4px solid var(--edge); background: var(--ground); font: 400 16px/1.4 var(--sans); color: var(--ink); cursor: pointer; transition: border-color .15s ease-out, background-color .15s ease-out; }
.vc-opt .k { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; background: var(--ground-2); font: 500 14px var(--mono); color: var(--ink-2); }
.vc-opt:active { transform: translateY(2px); }
.vc-opt[aria-checked="true"] { border-color: var(--you); background: var(--you-tint); }
.vc-opt[aria-checked="true"] .k { background: var(--you); color: var(--on-you); animation: vp-pop .24s cubic-bezier(.22,1,.36,1); }
@media (hover: hover) { .vc-opt:hover:not([aria-checked="true"]) { border-color: var(--edge); background: oklch(0.96 0.016 82); } .x:hover { border-color: var(--ink-2); color: var(--ink); } }

/* rank: the same keys, a number tile, and big move buttons */
.vc-rank { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.vc-rank li { display: grid; grid-template-columns: 10px 32px 1fr auto; gap: 12px; align-items: center; min-height: 60px; padding: 8px 8px 8px 16px; border-radius: var(--r-m); border: 2px solid var(--line); border-bottom: 4px solid var(--edge); background: var(--ground); font-size: 16px; line-height: 1.4; cursor: grab; }
.vc-rank .grip { width: 10px; height: 16px; color: var(--ink-2); opacity: .7; }
.vc-rank .n { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; background: var(--ground-2); font: 500 14px var(--mono); color: var(--ink); letter-spacing: 0; }
.vc-rank .mv { display: flex; gap: 4px; }
.vc-rank .mv button { display: grid; place-items: center; width: 40px; height: 40px; padding: 0; margin: 0; border-radius: var(--r-s); border: 1.5px solid var(--line); background: var(--ground); font: 400 15px var(--mono); color: var(--ink-2); cursor: pointer; }
.vc-rank .mv button:disabled { opacity: .3; cursor: default; }
/* each option keeps its own hue wherever it is dragged; the number shows its slot. Hues sit between the role colours. */
.vc-rank li[data-hue="0"] { --h: 250; } .vc-rank li[data-hue="1"] { --h: 155; } .vc-rank li[data-hue="2"] { --h: 75; } .vc-rank li[data-hue="3"] { --h: 320; } .vc-rank li[data-hue="4"] { --h: 205; }
.vc-rank li[data-hue] .n { background: oklch(0.9 0.07 var(--h)); color: oklch(0.38 0.12 var(--h)); }
.vc-rank li[data-hue] .grip { color: oklch(0.55 0.12 var(--h)); opacity: 1; }
.vc-rank li.moving { border-color: var(--you); background: var(--you-tint); }
.vc-rank li.moving .n { background: var(--you); color: var(--on-you); }

/* writing: a proper box, roomy type */
.vc-box { display: block; width: 100%; min-height: 128px; margin: 0; padding: 16px 20px; border-radius: var(--r-m); border: 2px solid var(--line); background: var(--ground); font: 400 17px/1.5 var(--sans); color: var(--ink); resize: vertical; transition: border-color .15s ease-out; }
.vc-box:focus { border-color: var(--proof); }
.vc-box:focus-visible { outline: none; }
.vc-own { min-height: 0; font-size: 19px; }
.vc-under { display: flex; justify-content: space-between; gap: 16px; margin-top: 8px; padding: 0 4px; font: 400 13px var(--mono); color: var(--ink-2); font-variant-numeric: tabular-nums; }
.vc .vc-hint { margin-top: 16px; padding: 0 4px; font: 400 13px var(--mono); color: var(--ink-2); }
.vc .vc-ask { margin: 0 0 16px; padding: 0; font: 400 17px/1.5 var(--sans); color: var(--ink-2); }
.vc-ask .k { display: inline-grid; place-items: center; min-width: 28px; height: 28px; margin: 0 2px; padding: 0 6px; border-radius: 8px; background: var(--you); color: var(--on-you); font: 500 14px var(--mono); vertical-align: 1px; }
.vc-said { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; padding: 16px 20px; border-radius: var(--r-m); background: var(--ground-2); font-size: 16px; color: var(--ink); }
.vc-said .dot { width: 12px; height: 12px; border-radius: 50%; background: var(--proof); margin-top: 6px; }
.vc-said .dot.off { background: var(--ink-2); }
.vc .vc-lede { margin: 0 0 16px; font-size: 16px; color: var(--ink-2); }
.vc .vc-err { margin-top: 12px; padding: 0 4px; font: 400 13px var(--mono); color: var(--ink); }

/* phones: the same board, tighter gutters */
@media (max-width: 520px) {
  .band { padding: 16px 18px 20px; }
  .pb { padding: 16px 16px 20px; }
  .pf { gap: 12px; padding: 8px 8px 8px 12px; }
  .go { padding: 0 20px; }
  .vc-opt { gap: 12px; }
  .vc-rank li { gap: 8px; padding-left: 12px; }
  .vc-rank .mv button { width: 36px; }
}
/* short screens: the whole window scrolls and the footer sticks */
@media (max-height: 540px) {
  .pop:not(.inline) { display: block; overflow-y: auto; }
  .pop:not(.inline) .vc { display: block; }
  .pop:not(.inline) .pb { overflow: visible; }
  .pop:not(.inline) .pf { position: sticky; bottom: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .veil, .pop, .pb, .track i, .vc-opt .k { animation: none !important; }
  .vc-opt, .vc-box, .go { transition: none; }
  .vc-opt:active, .go:active { transform: none !important; }
}
`;
