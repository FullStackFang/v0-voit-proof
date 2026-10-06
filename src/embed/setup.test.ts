// @vitest-environment happy-dom
import { expect, test } from "vitest";

test("DOM tests run in happy-dom", () => {
  document.body.innerHTML = "<form><input name='a'></form>";
  expect(document.querySelector("input")?.name).toBe("a");
});
