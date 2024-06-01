import { sveltekit } from "@sveltejs/kit/vite";
import { plugin as markdown } from "vite-plugin-markdown";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [markdown(), sveltekit()],
  server: {
    port: 3000,
  },
});
