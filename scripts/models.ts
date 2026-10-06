// Where the solvability script sends a question. A model is written `provider:model`:
//
//   claude:claude-opus-5-5     Claude Code headless (`claude -p`) on a Claude subscription, no key
//   codex                      Codex CLI (`codex exec`) on a ChatGPT sign-in, the account's default model
//   codex:gpt-5.5              ...or a named model
//   ollama:qwen2.5:7b          a local (or Ollama cloud) model through the Ollama server
//   openai:gpt-5.5             any OpenAI-compatible endpoint: OPENAI_API_KEY, OPENAI_BASE_URL (OpenAI, OpenRouter, ...)
//   gemini:gemini-2.5-pro      Google AI Studio through its OpenAI-compatible endpoint: GEMINI_API_KEY
//   anthropic:claude-opus-5-5  the Anthropic API: ANTHROPIC_API_KEY
//
// Every CLI runs with tools off or read-only, from a temp folder, so no project file is in context.

import Anthropic from "@anthropic-ai/sdk";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Ask } from "../src/server/solvability";

export const DEFAULT_MODELS = ["claude:claude-opus-5-5", "claude:claude-sonnet-5-5", "codex"];

export const ask: Ask = async (spec, prompt) => {
  const [provider, ...rest] = spec.split(":");
  const model = rest.join(":"); // ollama names carry their own colon
  switch (provider) {
    case "claude":
      return cli(`claude -p --model ${safe(model)} --tools "" --system-prompt "You are a helpful assistant." --strict-mcp-config --no-session-persistence`, prompt);
    case "codex":
      return codex(model, prompt);
    case "ollama":
      return ollama(model, prompt);
    case "openai":
      return openaiCompatible(env("OPENAI_BASE_URL", "https://api.openai.com/v1"), need("OPENAI_API_KEY"), model, prompt);
    case "gemini":
      return openaiCompatible("https://generativelanguage.googleapis.com/v1beta/openai", need("GEMINI_API_KEY"), model, prompt);
    case "anthropic":
      return anthropic(model, prompt);
    default:
      throw new Error(`Unknown provider in ${spec}; use claude, codex, ollama, openai, gemini or anthropic`);
  }
};

/** Runs a CLI with the prompt on stdin (never on the command line) from a temp folder. */
function cli(command: string, prompt: string, cwd = tmpdir()): Promise<string> {
  return new Promise((resolve, reject) => {
    // shell: true because these CLIs are .cmd shims on Windows
    const child = spawn(command, { shell: true, cwd });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(err.trim().split("\n").at(-1) || `exited ${code}`))));
    child.stdin.end(prompt);
  });
}

async function codex(model: string, prompt: string): Promise<string> {
  // the final message goes to a file; stdout carries progress
  const dir = mkdtempSync(join(tmpdir(), "voit-codex-"));
  try {
    const m = model ? ` -m ${safe(model)}` : "";
    await cli(`codex exec${m} --skip-git-repo-check --ephemeral -s read-only -o "${join(dir, "last.txt")}"`, prompt, dir);
    return readFileSync(join(dir, "last.txt"), "utf8");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function ollama(model: string, prompt: string): Promise<string> {
  const res = await fetch(`${env("OLLAMA_HOST", "http://127.0.0.1:11434")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, stream: false, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`ollama ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { message: { content: string } }).message.content;
}

async function openaiCompatible(baseUrl: string, key: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`${baseUrl} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return ((await res.json()) as { choices: { message: { content: string } }[] }).choices[0].message.content;
}

let client: Anthropic | undefined;
async function anthropic(model: string, prompt: string): Promise<string> {
  client ??= new Anthropic();
  const response = await client.messages.create({ model, max_tokens: 8000, messages: [{ role: "user", content: prompt }] });
  if (response.stop_reason === "refusal") throw new Error("refused");
  return response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
}

/** Model names reach a shell command line, so only plain characters pass. */
function safe(model: string): string {
  if (!/^[\w.:-]+$/.test(model)) throw new Error(`Bad model name: ${model}`);
  return model;
}

function env(name: string, fallback: string) {
  return process.env[name] || fallback;
}

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}
