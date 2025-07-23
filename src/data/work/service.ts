import type { Work } from "../../types";

import revatiJp from "../../assets/works/revati-jp.webp";
import revatiStudio from "../../assets/works/studio-revati-jp.webp";

export const SERVICE = [
  {
    title: "REVATI",
    createdAt: "2023-01-21",
    tags: ["Webサイト"],
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
  {
    title: "REVATI Studio",
    createdAt: "2025-07-24",
    tags: ["Webサイト"],
    authors: ["RetoRuto9900K", "Rinrin.rs", "Studio Members"],
    assets: [
      {
        type: "website",
        title: "studio.revati.jp",
        url: "https://studio.revati.jp",
        clientName: "REVATI Studio",
        thumbnail: revatiStudio,
      },
      {
        type: "external",
        title: "ソースコード（リポジトリ）はこちら",
        url: "https://github.com/Sarf-Esports/studio-website",
      },
    ],
    border: "3px solid #494040ff",
  },
] satisfies Work[];
