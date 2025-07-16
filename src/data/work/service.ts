import type { Work } from "../../types";

import revatiJp from "../../assets/works/revati-jp.png";

export const SERVICE = [
  {
    title: "revati.jp",
    createdAt: "2023-01-21",
    tags: ["Web Development"],
    authors: ["Rinrin.rs", "GEN3987", "Retoruto9900K", "しろねこ"],
    assets: [
      {
        type: "website",
        title: "revati.jp",
        url: "https://revati.jp",
        clientName: "REVATI",
        thumbnail: revatiJp,
      },
      {
        type: "external",
        title: "ソースコード（リポジトリ）はこちら",
        url: "https://github.com/Sarf-Esports/website",
      },
    ],
  },
] satisfies Work[];
