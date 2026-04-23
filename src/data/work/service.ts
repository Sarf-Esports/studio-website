import type { Work } from "../../types";

import revatiJp from "../../assets/works/2023/01/230121_revati-jp.webp";
import revatiStudio from "../../assets/works/2025/07/250724_studio-revati-jp.webp";
import revatiTournament from "../../assets/works/2026/04/260423_tmnl_tournament-website.webp";

export const SERVICE = [
  {
    title: "REVATI",
    clientName: "REVATI",
    createdAt: "2023-01-21",
    tags: ["Webサイト"],
    authors: ["Rinrin.rs", "GEN3987", "RetoRuto9900K", "しろねこ"],
    assets: [
      {
        type: "website",
        title: "revati.jp",
        url: "https://revati.jp",
        thumbnail: revatiJp,
      },
      {
        type: "external",
        title: "ソースコード（リポジトリ）はこちら",
        url: "https://github.com/revati-jp/website",
      },
    ],
  },
  {
    title: "REVATI Studio",
    clientName: "REVATI Studio",
    createdAt: "2025-07-24",
    tags: ["Webサイト"],
    authors: ["RetoRuto9900K", "Rinrin.rs", "Studio Members"],
    assets: [
      {
        type: "website",
        title: "studio.revati.jp",
        url: "https://studio.revati.jp",
        thumbnail: revatiStudio,
      },
      {
        type: "external",
        title: "ソースコード（リポジトリ）はこちら",
        url: "https://github.com/revati-jp/studio-website",
      },
    ],
    border: "3px solid #494040ff",
  },
  {
    title: "英語ドキュメンタリー翻訳",
    clientName: "ObsSojourn",
    createdAt: "2025-10-03",
    tags: ["翻訳/通訳"],
    authors: ["KISHI"],
    assets: [
      {
        type: "video",
        title:
          "どのようにして13歳の神童はOverWatchの「ミスター・ワールドワイド」になったのだろう？ | TOPDRAGON",
        src: "https://www.youtube.com/watch?v=ryLfOLm2-88",
      },
    ],
  },
  {
    title: "英語ドキュメンタリー翻訳",
    clientName: "ObsSojourn",
    createdAt: "2025-11-04",
    tags: ["翻訳/通訳"],
    authors: ["KISHI"],
    assets: [
      {
        type: "video",
        title:
          "このD.Va天才少年はいかにしてOWCSの頂点へとたどり着いたのか｜ZIYAD",
        src: "https://www.youtube.com/watch?v=djK1Wt2NUDk",
      },
    ],
  },
  {
    title: "試合解説動画 翻訳",
    clientName: "Ocie",
    createdAt: "2025-12-30",
    tags: ["翻訳/通訳"],
    authors: ["KISHI"],
    assets: [
      {
        type: "video",
        title:
          "VARRELが特殊なイラリー構成とラマットラのサイド攻撃でTeam Falconsを圧倒した方法とは？",
        src: "http://youtube.com/watch?v=jH3qhqwsPwo",
      },
    ],
  },
  {
    title: "REVATI Tournaments",
    clientName: "REVATI",
    createdAt: "2026-04-23",
    tags: ["Webサイト"],
    authors: [
      { name: "Rinrin.rs", role: "サイト制作" },
      { name: "RetoRuto9900K", role: "サイト制作" },
      { name: "Reku", role: "デザイン" },
      { name: "HIKA", role: "デザイン" },
      { name: "ちゃちゃまる", role: "デザイン" },
    ],
    assets: [
      {
        type: "website",
        title: "tournament.revati.jp",
        url: "https://tournament.revati.jp",
        thumbnail: revatiTournament,
      },
      // {
      //   type: "external",
      //   title: "ソースコード（リポジトリ）はこちら",
      //   url: "https://github.com/revati-jp/tournament-website",
      // },
    ],
  },
] satisfies Work[];
