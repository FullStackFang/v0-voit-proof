import { duration } from "./format";
import { esc, profileHtml, type Profile } from "./html";
import { GRIP, SEAL } from "./marks";
import { FONTS_URL, GATE, PLAYER } from "./styles";

// <voit-challenge pack="..." mode="embed|practice">: voitProof, framework-free, in a shadow root.
// Embed: a 304 x 78 captcha box. Clicking it starts the session and opens the challenge window,
// centred over the page; the host form cannot be submitted until the box is ticked, and the signed result lands
// in a hidden voit-result input. Practice: the same window, inline. The server owns the set, the
// order and the clock; the player shows one item at a time and reports integrity signals. After each
// pick or order it asks "What decided it?" and sends the Why with the answer.

type Mode = "embed" | "practice";
type Config = { pack: string | null; mode: Mode };
type Item = {
  id: string;
  area: string;
  format: "decide" | "rank" | "write";
  artifact: { kind: "code" | "text" | "log"; label: string; body: string };
  question: string;
  options?: string[];
};
type Step = { item: Item; position: number; total: number };
type Started = Step & { sessionId: string; role: string; employer: string };
type Feedback = { right?: boolean; reason: string };
type Finished = { done: true; profile: Profile; token: string };
type Answered = ((Step & { done: false }) | Finished) & { feedback?: Feedback };
type Signals = { timeAwaySeconds: number; pasteAttempts: number; bulkInputs: number };
type BoxState = "waiting" | "working" | "done";

export const MAX_WRITE = 280;
/** Own words on the Why step. */
export const MAX_WHY = 80;
/** An input event that adds more than this many characters at once counts as bulk input. */
const BULK = 15;

// captured while the script runs, so the player calls the server it was loaded from
const SCRIPT_SRC = (document.currentScript as HTMLScriptElement | null)?.src;
const apiOrigin = () => (SCRIPT_SRC ? new URL(SCRIPT_SRC).origin : location.origin);

/** Every attribute the element reads, in one place. */
export function readConfig(el: Element): Config {
  return { pack: el.getAttribute("pack")?.trim() || null, mode: el.getAttribute("mode") === "practice" ? "practice" : "embed" };
}

export class VoitChallenge extends HTMLElement {
  private root = this.attachShadow({ mode: "open" });
  private config: Config = { pack: null, mode: "embed" };
  private session: { id: string; employer: string; startedAt: number } | null = null;
  private signals: Signals = noSignals();
  private awaySince: number | null = null;
  private box: HTMLElement | null = null;
  private veil: HTMLElement | null = null;
  private pop!: HTMLElement;
  private vc!: HTMLElement;
  private state: BoxState = "waiting";
  private starting = false;
  /** Host submit buttons this element disabled, to restore exactly those. */
  private held: (HTMLButtonElement | HTMLInputElement)[] = [];
  private form: HTMLFormElement | null = null;

  private onVisibility = () => {
    if (document.visibilityState === "hidden") this.awaySince ??= Date.now();
    else this.settleAway();
  };
  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.close();
  };
  private blockSubmit = (e: Event) => {
    if (this.state !== "done") {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  connectedCallback() {
    document.addEventListener("visibilitychange", this.onVisibility);
    if (this.root.childNodes.length) return; // moved in the DOM: keep the state
    this.config = readConfig(this);
    loadFonts();
    const embed = this.config.mode === "embed";
    this.root.innerHTML = `<style>${GATE}${PLAYER}</style>${
      embed
        ? `<div class="box" data-state="waiting" part="box">
             <button class="cb" type="button" role="checkbox" aria-checked="false" aria-label="voitProof"></button>
             <span class="sp"></span>
             <span class="mk"><span class="seal">${SEAL}</span><b>voit<span>Proof</span></b><small>Privacy · Terms</small></span>
           </div>
           <div class="veil" hidden></div>`
        : ""
    }<div class="pop${embed ? "" : " inline"}"${embed ? ` hidden aria-modal="true"` : ""} role="dialog" aria-label="voitProof"><div class="vc"></div></div>`;
    this.box = this.root.querySelector(".box");
    this.veil = this.root.querySelector(".veil");
    this.pop = this.root.querySelector(".pop")!;
    this.vc = this.root.querySelector(".vc")!;

    if (!this.config.pack) {
      if (this.box) this.box.querySelector(".sp")!.textContent = "Not configured.";
      else this.problem("This challenge is not configured.");
      return;
    }
    if (!embed) {
      void this.start();
      return;
    }
    // the form's submit button can come after this element in the page: look once the page is parsed
    const hold = () => this.isConnected && this.hold();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hold, { once: true });
    else queueMicrotask(hold);
    this.box!.onclick = () => void this.openBox();
    this.veil!.onclick = () => this.close();
  }

  disconnectedCallback() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.close();
    this.release();
  }

  // ---------- the box, the window and the form ----------

  private async openBox() {
    if (this.state === "done") return;
    this.open();
    if (this.session || this.starting) return;
    this.problem("");
    await this.start();
  }

  private open() {
    this.setState("working");
    this.veil!.hidden = false;
    this.pop.hidden = false;
    document.addEventListener("keydown", this.onKey);
  }

  private close() {
    if (!this.box || this.pop.hidden) return;
    this.veil!.hidden = true;
    this.pop.hidden = true;
    document.removeEventListener("keydown", this.onKey);
    if (this.state !== "done") this.setState("waiting");
  }

  private setState(s: BoxState) {
    this.state = s;
    if (!this.box) return;
    this.box.dataset.state = s;
    const cb = this.box.querySelector(".cb")!;
    cb.setAttribute("aria-checked", String(s === "done"));
    cb.innerHTML = s === "done" ? CHECK : "";
  }

  /** Until the box is ticked, the host form's submit buttons are disabled and its submit is cancelled. */
  private hold() {
    this.form = this.closest("form");
    if (!this.form) return;
    this.held = [...this.form.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button:not([type]), button[type="submit"], input[type="submit"]')].filter(
      (b) => !b.disabled,
    );
    this.held.forEach((b) => (b.disabled = true));
    this.form.addEventListener("submit", this.blockSubmit, true);
  }

  private release() {
    this.held.forEach((b) => (b.disabled = false));
    this.held = [];
    this.form?.removeEventListener("submit", this.blockSubmit, true);
  }

  // ---------- views ----------

  private async start() {
    this.starting = true;
    const reply = await this.post<Started>("/api/sessions", { pack: this.config.pack, mode: this.config.mode });
    this.starting = false;
    if (reply?.status !== 201) {
      if (reply?.status === 404) return this.problem("This challenge is not available.");
      return this.problem("Could not reach Voit.", () => void this.start());
    }
    const s = reply.body as Started;
    this.session = { id: s.sessionId, employer: s.employer, startedAt: Date.now() };
    this.item(s);
  }

  private problem(message: string, retry?: () => void) {
    const vc = this.paint(`${band("voitProof", message || "One moment.")}<div class="pb"></div>${this.foot("", retry ? "Try again" : "", !retry)}`);
    if (retry) vc.querySelector<HTMLButtonElement>("[data-go]")!.onclick = retry;
  }

  private item(step: Step) {
    this.signals = noSignals();
    this.awaySince = document.visibilityState === "hidden" ? Date.now() : null;
    const { item, position, total } = step;
    const employer = esc(this.session!.employer);
    const consent =
      position === 1
        ? `<p class="vc-consent">Your answers, without your name, help us calibrate these challenges. <b>${
            this.config.mode === "embed" ? `Your written answer goes to ${employer} with your application.` : "Your written answers stay private."
          }</b></p>`
        : "";
    const hint =
      item.format === "decide"
        ? "Answers are final."
        : item.format === "rank"
          ? "Drag, or use ↑ ↓"
          : this.config.mode === "embed"
            ? `Not scored. ${employer} reads it as you wrote it.`
            : "Not scored. It stays private.";
    const vc = this.paint(`
      ${band(item.artifact.label, item.question)}
      <div class="pb">
        ${consent}
        ${artifactHtml(item.artifact)}
        <div data-body></div>
        <p class="vc-hint">${hint}</p>
        <p class="vc-err" hidden></p>
      </div>
      ${this.foot(`${pad(position)} / ${pad(total)}`, position === total && item.format === "write" ? "Done" : "Next", true, track(position, total, "pick"))}`);
    const body = vc.querySelector<HTMLElement>("[data-body]")!;
    const go = vc.querySelector<HTMLButtonElement>("[data-go]")!;
    const ready = (answer: unknown, said: string) => {
      go.disabled = false;
      go.onclick = () => (item.format === "write" ? void this.answer(step, answer, said, vc) : this.why(step, answer, said));
    };
    if (item.format === "decide") this.decide(body, vc, item.options!, ready);
    else if (item.format === "rank") this.rank(body, item.options!, ready);
    else this.write(body, ready, () => (go.disabled = true));
  }

  private decide(body: HTMLElement, vc: HTMLElement, options: string[], ready: (a: unknown, said: string) => void) {
    body.innerHTML = `<div class="vc-opts" role="radiogroup">${options
      .map((o, i) => `<button class="vc-opt" type="button" role="radio" aria-checked="false" data-i="${i}"><span class="k">${letter(i)}</span><span>${esc(o)}</span></button>`)
      .join("")}</div>`;
    const buttons = [...body.querySelectorAll<HTMLButtonElement>(".vc-opt")];
    const pick = (i: number) => {
      buttons.forEach((b, j) => b.setAttribute("aria-checked", String(i === j)));
      ready(i, letter(i));
    };
    buttons.forEach((b, i) => (b.onclick = () => pick(i)));
    // keys A to D while focus is inside the window
    vc.onkeydown = (e) => {
      const i = e.key.length === 1 ? e.key.toUpperCase().charCodeAt(0) - 65 : -1;
      if (i >= 0 && i < options.length && !e.ctrlKey && !e.metaKey && !e.altKey) pick(i);
    };
  }

  private rank(body: HTMLElement, options: string[], ready: (a: unknown, said: string) => void) {
    const order = options.map((_, i) => i);
    let dragging: number | null = null;
    const move = (from: number, to: number) => {
      if (to < 0 || to >= order.length || from === to) return;
      order.splice(to, 0, ...order.splice(from, 1));
      draw();
    };
    const draw = (moving?: number) => {
      body.innerHTML = `<ol class="vc-rank">${order
        .map(
          (o, pos) => `<li tabindex="0" draggable="true" data-pos="${pos}" data-hue="${o}" aria-label="${pos + 1}: ${esc(options[o])}"${pos === moving ? ` class="moving"` : ""}>
            ${GRIP}<span class="n">${pos + 1}</span><span>${esc(options[o])}</span>
            <span class="mv"><button type="button" tabindex="-1" aria-label="Move up" data-up ${pos === 0 ? "disabled" : ""}>↑</button><button type="button" tabindex="-1" aria-label="Move down" data-down ${pos === order.length - 1 ? "disabled" : ""}>↓</button></span>
          </li>`,
        )
        .join("")}</ol>`;
      body.querySelectorAll<HTMLLIElement>("li").forEach((li) => {
        const pos = Number(li.dataset.pos);
        const shift = (by: number) => {
          move(pos, pos + by);
          const to = Math.max(0, Math.min(order.length - 1, pos + by));
          draw(to);
          body.querySelector<HTMLElement>(`li[data-pos="${to}"]`)!.focus();
        };
        li.onkeydown = (e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            shift(e.key === "ArrowUp" ? -1 : 1);
          }
        };
        li.onblur = () => li.classList.remove("moving");
        li.querySelector<HTMLButtonElement>("[data-up]")!.onclick = () => shift(-1);
        li.querySelector<HTMLButtonElement>("[data-down]")!.onclick = () => shift(1);
        li.ondragstart = (e) => {
          dragging = pos;
          li.classList.add("moving");
          (e as DragEvent).dataTransfer?.setData("text/plain", String(pos));
        };
        li.ondragover = (e) => e.preventDefault();
        li.ondrop = (e) => {
          e.preventDefault();
          if (dragging !== null) move(dragging, pos);
          dragging = null;
        };
        li.ondragend = () => {
          dragging = null;
          li.classList.remove("moving");
        };
      });
      ready([...order], "");
    };
    draw();
  }

  private write(body: HTMLElement, ready: (a: unknown, said: string) => void, notReady: () => void) {
    body.innerHTML = `<textarea class="vc-box" maxlength="${MAX_WRITE}" aria-label="Your answer" spellcheck="true"></textarea>
      <div class="vc-under"><span data-note></span><span data-count>0 / ${MAX_WRITE}</span></div>`;
    const box = body.querySelector("textarea")!;
    const note = body.querySelector<HTMLElement>("[data-note]")!;
    const count = body.querySelector<HTMLElement>("[data-count]")!;
    let before = 0;
    box.onpaste = (e) => {
      e.preventDefault();
      this.signals.pasteAttempts += 1;
      note.textContent = "Paste is off here. Type it in your own words.";
    };
    box.ondrop = (e) => e.preventDefault();
    box.oninput = () => {
      const chars = [...box.value];
      if (chars.length > MAX_WRITE) box.value = chars.slice(0, MAX_WRITE).join("");
      const now = [...box.value].length;
      if (now - before > BULK) this.signals.bulkInputs += 1;
      before = now;
      count.textContent = `${now} / ${MAX_WRITE}`;
      if (box.value.trim()) ready(box.value, "");
      else notReady();
    };
  }

  /** "What decided it?" in the candidate's own words. Sent with the answer in one request. */
  private why(step: Step, answer: unknown, said: string) {
    const { item, position, total } = step;
    const vc = this.paint(`
      ${band(item.artifact.label, "What decided it?")}
      <div class="pb">
        <p class="vc-hint vc-ask">${said ? `You picked <span class="k">${esc(said)}</span>.` : "Your order is set."} In a line, why?</p>
        <textarea class="vc-box vc-own" maxlength="${MAX_WHY}" rows="3" aria-label="What decided it?"></textarea>
        <div class="vc-under"><span data-note></span><span data-count>0 / ${MAX_WHY}</span></div>
        <p class="vc-err" hidden></p>
      </div>
      ${this.foot(`${pad(position)} / ${pad(total)}`, position === total ? "Done" : "Next", true, track(position, total, "why"))}`);
    const go = vc.querySelector<HTMLButtonElement>("[data-go]")!;
    const own = vc.querySelector("textarea")!;
    const note = vc.querySelector<HTMLElement>("[data-note]")!;
    const count = vc.querySelector<HTMLElement>("[data-count]")!;
    let before = 0;
    own.onpaste = (e) => {
      e.preventDefault();
      this.signals.pasteAttempts += 1;
      note.textContent = "Paste is off. Type it.";
    };
    own.ondrop = (e) => e.preventDefault();
    own.oninput = () => {
      const chars = [...own.value];
      if (chars.length > MAX_WHY) own.value = chars.slice(0, MAX_WHY).join("");
      const now = [...own.value].length;
      if (now - before > BULK) this.signals.bulkInputs += 1;
      before = now;
      count.textContent = `${now} / ${MAX_WHY}`;
      go.disabled = !own.value.trim();
    };
    go.onclick = () => void this.answer(step, answer, said, vc, own.value.trim());
    own.focus();
  }

  private async answer(step: Step, answer: unknown, said: string, vc: HTMLElement, why?: string) {
    const go = vc.querySelector<HTMLButtonElement>("[data-go]")!;
    const err = vc.querySelector<HTMLElement>(".vc-err")!;
    go.disabled = true;
    this.settleAway();
    const reply = await this.post<Answered>(`/api/sessions/${this.session!.id}/answers`, {
      itemId: step.item.id,
      answer,
      ...(why !== undefined && { why }),
      signals: { ...this.signals, timeAwaySeconds: Math.round(this.signals.timeAwaySeconds) },
    });
    if (reply?.status !== 200) {
      err.hidden = false;
      err.textContent = (reply?.body as { error?: string } | undefined)?.error ?? "Could not reach Voit. Try again.";
      go.disabled = reply?.status === 409; // out of turn or finished: trying again cannot help
      return;
    }
    const r = reply.body as Answered;
    const next = () => (r.done ? this.end(r) : this.item(r));
    if (r.feedback) this.feedback(step, r.feedback, said, next);
    else next();
  }

  /** Practice only: one line after a gold item or a write item with an insight. */
  private feedback(step: Step, f: Feedback, said: string, next: () => void) {
    const verdict = f.right === undefined ? "Worth knowing." : f.right ? "Right." : "Not quite.";
    const at = `locked in at ${duration((Date.now() - this.session!.startedAt) / 1000)}`;
    const vc = this.paint(`
      ${band(step.item.artifact.label, verdict)}
      <div class="pb">
        <div class="vc-said"><span class="dot${f.right === false ? " off" : ""}"></span><p>${esc(f.reason)}</p></div>
        <p class="vc-hint">${said ? `${said} · ${at}` : at.charAt(0).toUpperCase() + at.slice(1)}</p>
      </div>
      ${this.foot(`${pad(step.position)} / ${pad(step.total)}`, "Next", false, track(step.position, step.total, "why"))}`);
    vc.querySelector<HTMLButtonElement>("[data-go]")!.onclick = next;
  }

  private end({ profile, token }: Finished) {
    if (this.config.mode === "practice") {
      const total = readClaims(token).items.length;
      const gold = Object.values(profile).reduce((n, a) => n + (a?.of ?? 0), 0);
      const vc = this.paint(`
        ${band("Practice", "Done.")}
        <div class="pb">
          <p class="vc-lede">${gold} of the ${total} calls have a known answer. Here is how those went.</p>
          ${profileHtml(profile)}
          <p class="vc-hint">Your written answers stayed private.</p>
        </div>
        ${this.foot(`${pad(total)} / ${pad(total)}`, "Practise again", false, track(total, total, "end"))}`);
      const again = vc.querySelector<HTMLButtonElement>("[data-go]")!;
      again.onclick = () => {
        again.disabled = true;
        void this.start();
      };
      return;
    }

    if (this.form) {
      let input = this.form.querySelector<HTMLInputElement>('input[name="voit-result"]');
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = "voit-result";
        this.form.append(input);
      }
      input.value = token;
    }
    this.setState("done");
    this.close();
    this.release();
  }

  // ---------- plumbing ----------

  private foot(count: string, label: string, disabled: boolean, progress = "") {
    const x = this.box ? `<button class="x" type="button" data-x aria-label="Close">×</button>` : "";
    const go = label ? `<button class="go" type="button" data-go${disabled ? " disabled" : ""}>${label}</button>` : "";
    return `<div class="pf">${x}${progress}<span class="n">${count}</span>${go}</div>`;
  }

  /** Replaces the window's content; the window itself stays put. */
  private paint(inner: string): HTMLElement {
    this.vc.onkeydown = null;
    this.vc.innerHTML = inner;
    const x = this.vc.querySelector<HTMLButtonElement>("[data-x]");
    if (x) x.onclick = () => this.close();
    return this.vc;
  }

  private settleAway() {
    if (this.awaySince === null) return;
    this.signals.timeAwaySeconds += (Date.now() - this.awaySince) / 1000;
    this.awaySince = document.visibilityState === "hidden" ? Date.now() : null;
  }

  private async post<T>(path: string, body: unknown): Promise<{ status: number; body: T | { error: string } } | null> {
    try {
      const res = await fetch(`${apiOrigin()}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      return { status: res.status, body: await res.json() };
    } catch {
      return null;
    }
  }
}

const CHECK = `<svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="3,8.5 6.5,12 13,4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** The blue band: what this screen is about, then the question. */
function band(label: string, question: string) {
  return `<div class="band"><div class="t">${esc(label)}</div><p class="q">${esc(question)}</p></div>`;
}

/** The run of calls as tiles: done, this one (half once picked), to come. The one just finished flips in; at the end, all of them. */
function track(position: number, total: number, at: "pick" | "why" | "end") {
  const tiles = Array.from({ length: total }, (_, i) => {
    const n = i + 1;
    const state = at === "end" || n < position ? "done" : n === position ? (at === "why" ? "now half" : "now") : "";
    const just = at === "end" || (at === "pick" && n === position - 1) ? " just" : "";
    return `<i class="${state}${just}" style="--i:${i}"></i>`;
  });
  return `<span class="track${at === "end" ? " end" : ""}" aria-hidden="true">${tiles.join("")}</span>`;
}

/** Code and logs in mono with a line gutter, comment lines quieter; text as prose. Lines wrap, never scroll sideways. */
function artifactHtml({ kind, body }: Item["artifact"]) {
  if (kind === "text") return `<pre class="vc-art prose">${esc(body)}</pre>`;
  const lines = body
    .split("\n")
    .map((l) => `<span class="l">${kind === "code" && /^\s*(\/\/|#|--)/.test(l) ? `<span class="c">${esc(l)}</span>` : esc(l)}</span>`);
  // each line is its own block, so no newline between them (it would render as a blank line)
  return `<pre class="vc-art">${lines.join("")}</pre>`;
}

/** The token's payload, read for display only; the host and /verify do the verifying. */
function readClaims(token: string): { sessionId: string; items: string[]; written: string | null; totalSeconds: number } {
  const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function loadFonts() {
  if (document.querySelector(`link[href="${FONTS_URL}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONTS_URL;
  document.head.append(link);
}

const noSignals = (): Signals => ({ timeAwaySeconds: 0, pasteAttempts: 0, bulkInputs: 0 });
const pad = (n: number) => String(n).padStart(2, "0");
const letter = (i: number) => String.fromCharCode(65 + i);
