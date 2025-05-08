// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
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
});
