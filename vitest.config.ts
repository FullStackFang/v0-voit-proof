import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Node by default; DOM tests opt in with `// @vitest-environment happy-dom`.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["src/**/*.test.ts"],
    // DOM tests never load files or touch the network (the player adds a font stylesheet link)
    environmentOptions: { happyDOM: { url: "http://localhost:7001", settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true, handleDisabledFileLoadingAsSuccess: true } } },
  },
});
