import { expect, test } from "vitest";
import { areaName, duration, flagWords, pips, roleName } from "./format";

test("pips: whole points full, a half point half, the rest empty", () => {
  expect(pips(1.5, 2)).toEqual(["full", "half"]);
  expect(pips(0.5, 1)).toEqual(["half"]);
  expect(pips(0, 1)).toEqual(["none"]);
  expect(pips(2, 3)).toEqual(["full", "full", "none"]);
});

test("duration in minutes and padded seconds", () => {
  expect(duration(185)).toBe("3 min 05 s");
  expect(duration(45)).toBe("45 s");
  expect(duration(60)).toBe("1 min 00 s");
});

test("flag words list only what is not zero", () => {
  expect(flagWords({ timeAwaySeconds: 20, pasteAttempts: 2, bulkInputs: 1 })).toEqual(["20 s away", "2 pastes", "1 bulk input"]);
  expect(flagWords({ timeAwaySeconds: 0, pasteAttempts: 0, bulkInputs: 0 })).toEqual([]);
});

test("names for areas and roles", () => {
  expect(areaName("ai-in-the-loop")).toBe("AI in the loop");
  expect(roleName("education-platform-engineer")).toBe("Education platform engineer");
});
