// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Noto Sans JP",
      cssVariable: "--font-noto-sans-jp",
      weights: [400, 500, 900],
      subsets: ["japanese", "latin"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      weights: [400, 800],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Special Gothic Expanded One",
      cssVariable: "--font-special-gothic-expanded-one",
      weights: [400],
    },
  ],
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
