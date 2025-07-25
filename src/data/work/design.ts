import type { Work } from "../../types";

import ow250511 from "../../assets/works/250511_annc_ow.webp";
import welcome250518 from "../../assets/works/250518_annc_welcome.webp";
import studioHeader1 from "../../assets/works/250724_studio_header1.webp";
import studioHeader2 from "../../assets/works/250724_studio_header2.webp";
import studioLogo from "../../assets/works/250724_studio_logo.webp";
import apexdiv250716 from "../../assets/works/250716_annc_apexdiv.webp";
import game250503 from "../../assets/works/250503_annc_game.webp";
import game250514 from "../../assets/works/250514_annc_game.webp";
import game250609 from "../../assets/works/250609_annc_game.webp";
import result250514 from "../../assets/works/250514_annc_result.webp";
import academy250427 from "../../assets/works/250427_annc_academy.webp";
import ccdiv250725 from "../../assets/works/250725_annc_ccdiv.webp";

export const DESIGN = [
  {
    title: "X用ヘッダー",
    clientName: "REVATI",
    createdAt: "2024-04-01",
    tags: ["デザイン"],
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
    title: "OW部門 発表画像",
    clientName: "REVATI",
    createdAt: "2025-05-11",
    tags: ["告知画像"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI OW部門 告知画像",
        src: ow250511,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "加入発表画像",
    clientName: "REVATI",
    createdAt: "2025-05-18",
    tags: ["告知画像"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI 加入発表画像",
        src: welcome250518,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "REVATI Studio ヘッダー",
    clientName: "REVATI Studio",
    createdAt: "2025-07-24",
    tags: ["デザイン"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI Studio ヘッダー (1)",
        src: studioHeader1,
        showInCarousel: false,
      },
      {
        type: "image",
        caption: "REVATI Studio ヘッダー (2)",
        src: studioHeader2,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "REVATI Studio ロゴ",
    clientName: "REVATI Studio",
    createdAt: "2025-07-24",
    tags: ["デザイン"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI Studio ロゴ",
        src: studioLogo,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "APEX部門 発表画像",
    clientName: "REVATI",
    createdAt: "2025-07-16",
    tags: ["告知画像"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI APEX部門 発表画像",
        src: apexdiv250716,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "試合告知画像",
    clientName: "REVATI",
    createdAt: "2025-05-03",
    tags: ["告知画像"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI 試合告知画像",
        src: game250503,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "試合告知画像",
    clientName: "REVATI",
    createdAt: "2025-05-14",
    tags: ["告知画像"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI 試合告知画像",
        src: game250514,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "リザルト画像",
    clientName: "REVATI",
    createdAt: "2025-05-14",
    tags: ["告知画像"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI リザルト画像",
        src: result250514,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "試合告知画像",
    clientName: "REVATI",
    createdAt: "2025-06-09",
    tags: ["告知画像"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI 試合告知画像",
        src: game250609,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "OWアカデミー部門 発表画像",
    clientName: "REVATI",
    createdAt: "2025-04-27",
    tags: ["告知画像"],
    authors: ["HIKA"],
    assets: [
      {
        type: "image",
        caption: "REVATI OWアカデミー部門 発表画像",
        src: academy250427,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "REVATI 加入発表画像",
    clientName: "REVATI",
    createdAt: "2025-07-25",
    tags: ["告知画像"],
    authors: ["Reku"],
    assets: [
      {
        type: "image",
        caption: "REVATI 加入発表画像",
        src: ccdiv250725,
        showInCarousel: true,
      },
    ],
  },
] satisfies Work[];
