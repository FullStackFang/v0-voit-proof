// @vitest-environment happy-dom
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { MAX_WRITE, VoitChallenge, readConfig } from "./player";

// The player against a fake server: fetch is stubbed, so nothing touches the network.

beforeAll(() => {
  if (!customElements.get("voit-challenge")) customElements.define("voit-challenge", VoitChallenge);
});

const art = { kind: "code", label: "AI suggestion · gradebook.ts", body: "// Fetch grades\nreturn db.grade.findMany();" };
const decide = { id: "d1", area: "tenancy", format: "decide", artifact: art, question: "What do you do?", options: ["Merge it.", "Send it back.", "Add pagination.", "Add an index."] };
const rank = { id: "r1", area: "records", format: "rank", artifact: art, question: "Put these in order.", options: ["Back up", "Rehearse", "Tell schools", "Run it"] };
const write = { id: "w1", area: "ops", format: "write", artifact: art, question: "What goes wrong?" };

const claims = { sessionId: "5d1c0e8e-1111-4222-8333-944455556666", items: ["d1", "r1", "x", "y", "w1"], written: "Port 22 is never opened.", totalSeconds: 185 };
const TOKEN = ["eyJhbGciOiJFZERTQSJ9", Buffer.from(JSON.stringify(claims)).toString("base64url"), "c2ln"].join(".");
const profile = { records: { earned: 1.5, of: 2 }, rules: { earned: 1, of: 1 } };

let calls: { url: string; body: Record<string, unknown> }[];
let replies: { status: number; body: unknown }[];
const serve = (...r: { status: number; body: unknown }[]) => replies.push(...r);
const started = (item: object, total = 5) => ({
  status: 201,
  body: { sessionId: claims.sessionId, role: "Education platform engineer", employer: "Fernhill Learning", item, position: 1, total },
});
const next = (item: object, position: number, total = 5, extra = {}) => ({ status: 200, body: { done: false, item, position, total, ...extra } });
const finished = (extra = {}) => ({ status: 200, body: { done: true, profile, token: TOKEN, ...extra } });

beforeEach(() => {
  calls = [];
  replies = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(init.body as string) });
      const r = replies.shift();
      if (!r) throw new Error(`no reply queued for ${url}`);
      return new Response(JSON.stringify(r.body), { status: r.status });
    }),
  );
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const settle = () => new Promise((r) => setTimeout(r, 0));
const FORM = `<form><input name="name" value="Ada"><voit-challenge pack="education-platform-engineer"></voit-challenge><button>Submit application</button></form>`;

async function mount(html: string) {
  document.body.innerHTML = html;
  await settle();
  return document.querySelector("voit-challenge")!.shadowRoot!;
}
async function press(el: Element | null) {
  (el as HTMLElement).click();
  await settle();
}
/** "What decided it?": type a reason, then go on. */
async function because(root: ShadowRoot, words = "a reason") {
  const own = root.querySelector<HTMLTextAreaElement>(".vc-own")!;
  own.value = words;
  own.dispatchEvent(new Event("input"));
  await press(root.querySelector("[data-go]"));
}
const go = (root: ShadowRoot) => root.querySelector<HTMLButtonElement>("[data-go]")!;
const text = (root: ShadowRoot) => root.querySelector(".vc")!.textContent!.replace(/\s+/g, " ");
const rows = (root: ShadowRoot) => [...root.querySelectorAll(".vc-rank li")].map((li) => li.querySelector("span:not(.n):not(.mv)")!.textContent);

/** An embed in a plain form, started, showing `first`. */
async function begin(first: object, ...more: { status: number; body: unknown }[]) {
  serve(started(first), ...more);
  const root = await mount(FORM);
  await press(box(root));
  return root;
}
const box = (root: ShadowRoot) => root.querySelector<HTMLElement>(".box")!;
const pop = (root: ShadowRoot) => root.querySelector<HTMLElement>(".pop")!;
const submit = () => document.querySelector<HTMLButtonElement>("form > button")!;

describe("<voit-challenge> setup", () => {
  test("attributes are read in one function: pack required, mode embed by default", () => {
    const el = document.createElement("div");
    expect(readConfig(el)).toEqual({ pack: null, mode: "embed" });
    el.setAttribute("pack", "p");
    el.setAttribute("mode", "practice");
    expect(readConfig(el)).toEqual({ pack: "p", mode: "practice" });
  });

  test("missing pack: a short message and no request", async () => {
    const root = await mount(`<voit-challenge></voit-challenge>`);
    expect(root.textContent).toContain("Not configured.");
    expect(calls).toEqual([]);
  });

  test("renders in its own shadow root, so host styles and the player do not mix", async () => {
    const root = await mount(`<style>button, div { color: red; font-family: Comic Sans MS; }</style>${FORM}`);
    expect(root.querySelector("style")!.textContent).toContain(".box {");
    expect(document.querySelector(".vc")).toBeNull();
    expect(document.querySelectorAll("button")).toHaveLength(1); // only the host's own submit button
  });

  test("renders like a captcha: the box and the voitProof mark, no text, no request", async () => {
    const root = await mount(FORM);
    expect(box(root).dataset.state).toBe("waiting");
    expect(box(root).textContent!.replace(/\s+/g, "")).toBe("voitProofPrivacy·Terms");
    expect(pop(root).hidden).toBe(true);
    expect(calls).toEqual([]);
  });

  test("clicking the box starts the session and opens the window; closing keeps the place", async () => {
    const root = await begin(decide, next(rank, 2));
    expect(pop(root).hidden).toBe(false);
    expect(box(root).dataset.state).toBe("working");
    await press(root.querySelectorAll(".vc-opt")[1]);
    await press(go(root));
    await because(root);
    await press(root.querySelector("[data-x]"));
    expect(pop(root).hidden).toBe(true);
    expect(box(root).dataset.state).toBe("waiting");
    await press(box(root));
    expect(pop(root).hidden).toBe(false);
    expect(root.querySelector(".band .q")!.textContent).toBe("Put these in order.");
    expect(calls.filter((c) => c.url.endsWith("/api/sessions"))).toHaveLength(1);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(pop(root).hidden).toBe(true);
    await press(box(root));
    await press(root.querySelector(".veil"));
    expect(pop(root).hidden).toBe(true);
  });

  test("in a plain form: Start draws an embed session and shows item 1 under the consent line", async () => {
    const root = await begin(decide);
    expect(calls[0].url).toBe("http://localhost:7001/api/sessions");
    expect(calls[0].body).toEqual({ pack: "education-platform-engineer", mode: "embed" });
    expect(root.querySelector(".pf .n")!.textContent).toBe("01 / 05");
    expect(root.querySelector(".vc-consent")!.textContent).toContain("Your written answer goes to Fernhill Learning with your application.");
    expect(root.querySelector(".vc-art .c")!.textContent).toBe("// Fetch grades");
  });

  test("the consent line is shown above the first item only", async () => {
    const root = await begin(decide, next(rank, 2));
    await press(root.querySelectorAll(".vc-opt")[1]);
    await press(go(root));
    await because(root);
    expect(root.querySelector(".pf .n")!.textContent).toBe("02 / 05");
    expect(root.querySelector(".vc-consent")).toBeNull();
  });
});

describe("the three formats", () => {
  test("decide: pick by click or by key, then lock it in", async () => {
    const root = await begin(decide, next(rank, 2));
    expect(go(root).disabled).toBe(true);
    root.querySelector(".vc")!.dispatchEvent(new KeyboardEvent("keydown", { key: "c", bubbles: true }));
    expect(root.querySelectorAll(".vc-opt")[2].getAttribute("aria-checked")).toBe("true");
    await press(root.querySelectorAll(".vc-opt")[1]);
    expect(root.querySelectorAll(".vc-opt")[2].getAttribute("aria-checked")).toBe("false");
    await press(go(root));
    await because(root);
    expect(calls[1].url).toBe(`http://localhost:7001/api/sessions/${claims.sessionId}/answers`);
    expect(calls[1].body).toEqual({ itemId: "d1", answer: 1, why: "a reason", signals: { timeAwaySeconds: 0, pasteAttempts: 0, bulkInputs: 0 } });
    expect(root.querySelector(".band .q")!.textContent).toBe("Put these in order.");
  });

  test("rank by keyboard: the move-up key moves the focused row up one place", async () => {
    const root = await begin(rank, next(write, 2));
    expect(rows(root)).toEqual(["Back up", "Rehearse", "Tell schools", "Run it"]);
    root.querySelectorAll(".vc-rank li")[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(rows(root)).toEqual(["Back up", "Tell schools", "Rehearse", "Run it"]);
    root.querySelectorAll(".vc-rank li")[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(rows(root)).toEqual(["Tell schools", "Back up", "Rehearse", "Run it"]);
    await press(go(root));
    await because(root);
    expect(calls[1].body.answer).toEqual([2, 0, 1, 3]);
  });

  test("rank: each option keeps its own colour as it moves", async () => {
    const root = await begin(rank);
    const hues = () => [...root.querySelectorAll<HTMLElement>(".vc-rank li")].map((li) => li.dataset.hue);
    expect(hues()).toEqual(["0", "1", "2", "3"]);
    root.querySelectorAll(".vc-rank li")[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(hues()).toEqual(["0", "2", "1", "3"]);
    expect(rows(root)[1]).toBe("Tell schools");
  });

  test("rank by drag, and by the arrow buttons", async () => {
    const root = await begin(rank);
    const li = () => root.querySelectorAll(".vc-rank li");
    li()[3].dispatchEvent(new Event("dragstart", { bubbles: true }));
    li()[0].dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));
    expect(rows(root)).toEqual(["Run it", "Back up", "Rehearse", "Tell schools"]);
    await press(li()[1].querySelector("[data-down]"));
    expect(rows(root)).toEqual(["Run it", "Rehearse", "Back up", "Tell schools"]);
  });

  test("write: the 281st character is not inserted", async () => {
    const root = await begin(write);
    const box = root.querySelector("textarea")!;
    box.value = "a".repeat(MAX_WRITE + 1);
    box.dispatchEvent(new Event("input"));
    expect(box.value).toHaveLength(MAX_WRITE);
    expect(root.querySelector("[data-count]")!.textContent).toBe("280 / 280");
  });

  test("write: paste inserts nothing, is counted, says so once, and the answer is still accepted", async () => {
    const root = await begin(write, finished());
    const box = root.querySelector("textarea")!;
    const paste = new Event("paste", { cancelable: true });
    box.dispatchEvent(paste);
    expect(paste.defaultPrevented).toBe(true);
    expect(root.querySelector("[data-note]")!.textContent).toBe("Paste is off here. Type it in your own words.");
    expect(go(root).disabled).toBe(true);
    for (const v of ["P", "Po", "Port"]) {
      box.value = v;
      box.dispatchEvent(new Event("input"));
    }
    box.value += " 22 is never opened, so SSH is refused.";
    box.dispatchEvent(new Event("input"));
    await press(go(root));
    expect(calls[1].body).toEqual({
      itemId: "w1",
      answer: "Port 22 is never opened, so SSH is refused.",
      signals: { timeAwaySeconds: 0, pasteAttempts: 1, bulkInputs: 1 },
    });
  });

  test("why: after the pick, one box; the answer and the Why go in one request", async () => {
    const root = await begin(decide, next(rank, 2));
    await press(root.querySelectorAll(".vc-opt")[1]);
    await press(go(root));
    expect(calls).toHaveLength(1); // nothing sent yet
    expect(root.querySelector(".band .q")!.textContent).toBe("What decided it?");
    expect(root.querySelectorAll(".vc-opt")).toHaveLength(0);
    expect(go(root).disabled).toBe(true);
    await because(root, "   ");
    expect(go(root).disabled).toBe(true);
    await because(root, "  teacherId is never used ");
    expect(calls[1].body).toMatchObject({ itemId: "d1", answer: 1, why: "teacherId is never used" });
  });

  test("why in own words: typed, 80 characters at most, paste blocked and counted", async () => {
    const root = await begin(rank, finished());
    await press(go(root));
    const own = root.querySelector<HTMLTextAreaElement>(".vc-own")!;
    const paste = new Event("paste", { cancelable: true });
    own.dispatchEvent(paste);
    expect(paste.defaultPrevented).toBe(true);
    own.value = "y".repeat(81);
    own.dispatchEvent(new Event("input"));
    expect(own.value).toHaveLength(80);
    own.value = "the delete is the step you cannot undo";
    own.dispatchEvent(new Event("input"));
    await press(go(root));
    expect(calls[1].body).toMatchObject({ itemId: "r1", answer: [0, 1, 2, 3], why: "the delete is the step you cannot undo" });
    expect((calls[1].body.signals as { pasteAttempts: number }).pasteAttempts).toBe(1);
  });

  test("time away: 20 seconds out of the tab is reported with that item", async () => {
    const root = await begin(decide, next(rank, 2));
    let state: DocumentVisibilityState = "visible";
    vi.spyOn(document, "visibilityState", "get").mockImplementation(() => state);
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    state = "hidden";
    document.dispatchEvent(new Event("visibilitychange"));
    now.mockReturnValue(1_020_000);
    state = "visible";
    document.dispatchEvent(new Event("visibilitychange"));
    await press(root.querySelectorAll(".vc-opt")[0]);
    await press(go(root));
    await because(root);
    expect(calls[1].body.signals).toEqual({ timeAwaySeconds: 20, pasteAttempts: 0, bulkInputs: 0 });
  });
});

describe("finishing", () => {
  test("submit waits for the box: disabled, and Enter is cancelled, until it is ticked", async () => {
    const root = await begin(write, finished());
    const form = document.querySelector("form")!;
    expect(submit().disabled).toBe(true);
    const early = new Event("submit", { cancelable: true });
    form.dispatchEvent(early);
    expect(early.defaultPrevented).toBe(true);
    const box2 = root.querySelector("textarea")!;
    box2.value = "Port 22 is never opened.";
    box2.dispatchEvent(new Event("input"));
    await press(go(root));
    expect(submit().disabled).toBe(false);
    const late = new Event("submit", { cancelable: true });
    form.dispatchEvent(late);
    expect(late.defaultPrevented).toBe(false);
  });

  test("removing the element gives the host its button back", async () => {
    await mount(FORM);
    expect(submit().disabled).toBe(true);
    document.querySelector("voit-challenge")!.remove();
    expect(submit().disabled).toBe(false);
  });

  test("on finish the token lands in a hidden voit-result input, the window closes and the box ticks", async () => {
    const root = await begin(write, finished());
    const form = document.querySelector("form")!;
    expect(new FormData(form).has("voit-result")).toBe(false);
    const note = root.querySelector("textarea")!;
    note.value = "Port 22 is never opened.";
    note.dispatchEvent(new Event("input"));
    await press(go(root));
    expect(new FormData(form).get("voit-result")).toBe(TOKEN);
    expect(new FormData(form).get("name")).toBe("Ada");
    expect(pop(root).hidden).toBe(true);
    expect(box(root).dataset.state).toBe("done");
    expect(root.querySelector(".cb")!.getAttribute("aria-checked")).toBe("true");
    await press(box(root));
    expect(pop(root).hidden).toBe(true); // a ticked box stays ticked
  });

  test("an answer the server rejects shows its reason and stores nothing new", async () => {
    const root = await begin(decide, { status: 409, body: { error: "That item is already answered" } });
    await press(root.querySelectorAll(".vc-opt")[0]);
    await press(go(root));
    await because(root);
    expect(root.querySelector(".vc-err")!.textContent).toBe("That item is already answered");
    expect(root.querySelector(".band .q")!.textContent).toBe("What decided it?");
  });
});

describe("practice", () => {
  const PRACTICE = `<voit-challenge pack="education-platform-engineer" mode="practice"></voit-challenge>`;

  test("starts at once, says written answers stay private, and gives the reason after a known item", async () => {
    serve(started(decide, 12), next(rank, 2, 12, { feedback: { right: true, reason: "Nothing checks the teacher." } }));
    const root = await mount(PRACTICE);
    expect(root.querySelector(".box")).toBeNull();
    expect(pop(root).classList.contains("inline")).toBe(true);
    expect(calls[0].body).toEqual({ pack: "education-platform-engineer", mode: "practice" });
    expect(root.querySelector(".vc-consent")!.textContent).toContain("Your written answers stay private.");
    await press(root.querySelectorAll(".vc-opt")[1]);
    await press(go(root));
    await because(root);
    expect(text(root)).toContain("Right.");
    expect(text(root)).toContain("Nothing checks the teacher.");
    expect(root.querySelector(".vc-hint")!.textContent).toMatch(/^B · locked in at/);
    await press(go(root));
    expect(root.querySelector(".band .q")!.textContent).toBe("Put these in order.");
  });

  test("items with no verdict go straight on", async () => {
    serve(started(decide, 12), next(rank, 2, 12));
    const root = await mount(PRACTICE);
    await press(root.querySelectorAll(".vc-opt")[0]);
    await press(go(root));
    await because(root);
    expect(root.querySelector(".band .q")!.textContent).toBe("Put these in order.");
  });

  test("an unknown pack says the challenge is not available", async () => {
    serve({ status: 404, body: { error: "Unknown pack nope" } });
    const root = await mount(`<voit-challenge pack="nope" mode="practice"></voit-challenge>`);
    expect(text(root)).toContain("This challenge is not available.");
  });
});
