import { expect, test } from "vitest";
import { AREAS, loadBank } from "./bank";

test("the first pack has 6 gold (4 decide, 2 rank), 3 open decide or rank, 3 write, all six areas", () => {
  const bank = loadBank();
  const pack = bank.packs.get("education-platform-engineer");
  expect(pack).toBeDefined();
  const items = pack!.items.map((id) => bank.items.get(id)!);
  const gold = items.filter((i) => i.kind === "gold");

  expect(gold.filter((i) => i.format === "decide")).toHaveLength(4);
  expect(gold.filter((i) => i.format === "rank")).toHaveLength(2);
  expect(items.filter((i) => i.kind === "open" && i.format !== "write")).toHaveLength(3);
  expect(items.filter((i) => i.format === "write")).toHaveLength(3);
  expect(new Set(items.map((i) => i.area))).toEqual(new Set(AREAS));
});
