import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    typescript: true,
    scss: {
      prependData: [
        '@use "src/styles/_color.scss" as *;',
        '@use "src/styles/_mixin.scss" as *;',
      ].join("\n"),
    },
  }),
};

export default config;
