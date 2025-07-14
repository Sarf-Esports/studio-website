import type { Work } from "../../types";

import ow250511 from "../../assets/works/250511_pstr_ow.png";
import welcome250518 from "../../assets/works/250518_pstr_welcome.png";

export const DESIGN = [
  {
    title: "REVATI ヘッダー",
    createdAt: "2024-04-01",
    tags: ["Graphic Design"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI ヘッダー",
        src: "https://revati.jp/images/logos/revati/header_mini_oxipng.png",
        showInCarousel: true,
      },
    ],
  },
  {
    title: "REVATI OW部門 発表ポスター",
    createdAt: "2025-05-11",
    tags: ["Graphic Design"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI OW部門 発表ポスター",
        src: ow250511,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "REVATI 加入発表ポスター",
    createdAt: "2025-05-18",
    tags: ["Graphic Design"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI 加入発表ポスター",
        src: welcome250518,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "ればっちくん",
    createdAt: "2025-05-09",
    tags: ["Illustration"],
    authors: ["にんじゃはむぞー"],
    assets: [
      {
        type: "image",
        caption: "ればっちくん",
        src: "https://i.imgur.com/ARpQ8JC.png",
        showInCarousel: true,
      },
    ],
  },
] satisfies Work[];
