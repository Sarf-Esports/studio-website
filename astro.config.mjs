// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '@use "/src/styles/_color.scss" as *;',
            '@use "/src/styles/_mixin.scss" as *;',
          ].join("\n"),
        },
      },
    },
  },

  integrations: [svelte()],
});
