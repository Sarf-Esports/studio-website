import type { Work } from "../../types";

import stadium250419 from "../../assets/works/250419_tmnl_stadium.png";
import soldier250430 from "../../assets/works/250430_tmnl_soldier.png";
import freja250510 from "../../assets/works/250510_tmnl_freja.png";
import apex250618 from "../../assets/works/250618_tmnl_apex.png";
import coach250530 from "../../assets/works/250530_tmnl_coach.png";

export const MOVIE = [
  {
    title: "REVATI×V's Montage",
    createdAt: "2025-03-31",
    tags: ["動画編集"],
    authors: ["Reku", "Ruilu", "GANGCAT"],
    assets: [
      {
        type: "video",
        title: "REVATI×V's Montage",
        src: "https://www.youtube.com/watch?v=oDSA0neUSAg",
      },
    ],
  },
  {
    title: "OW部門 ロスター告知動画",
    createdAt: "2025-04-22",
    tags: ["動画編集"],
    authors: ["おしお", "Reku", "GANGCAT"],
    assets: [
      {
        type: "video",
        title: "OW部門 ロスター告知動画",
        src: "https://www.youtube.com/watch?v=OcEMwCsxKQg",
      },
    ],
  },
  {
    title: "REVATI OW部門 Highlight",
    createdAt: "2025-05-12",
    tags: ["動画編集"],
    authors: ["Reku"],
    assets: [
      {
        type: "video",
        title: "REVATI OW部門 Highlight",
        src: "https://www.youtube.com/watch?v=rJ8QSISSMo8",
      },
    ],
  },
  {
    title: "OW2の新モード『スタジアム』が超面白いって話【Overwatch2】",
    createdAt: "2025-04-19",
    tags: ["動画編集", "サムネイル制作"],
    authors: ["かずくん", "Reku"],
    assets: [
      {
        type: "video",
        title: "OW2の新モード『スタジアム』が超面白いって話【Overwatch2】",
        src: "https://www.youtube.com/watch?v=E2v2k2AwjDc",
      },
      {
        type: "image",
        caption: "サムネイル",
        src: stadium250419,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "スタジアム駆け回るソルジャーに困惑？！【Overwatch2】",
    createdAt: "2025-04-30",
    tags: ["動画編集", "サムネイル制作"],
    authors: ["Ruilu", "Reku"],
    assets: [
      {
        type: "video",
        title: "スタジアム駆け回るソルジャーに困惑？！【Overwatch2】",
        src: "https://www.youtube.com/watch?v=idbOCbOqtmg",
      },
      {
        type: "image",
        caption: "サムネイル",
        src: soldier250430,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "みんなもフレイヤ使おう委員会代表【Overwatch2】",
    createdAt: "2025-05-10",
    tags: ["動画編集", "サムネイル制作"],
    authors: ["かずくん", "Reku"],
    assets: [
      {
        type: "video",
        title: "みんなもフレイヤ使おう委員会代表【Overwatch2】",
        src: "https://www.youtube.com/watch?v=S4vdsz8jX2A",
      },
      {
        type: "image",
        caption: "サムネイル",
        src: freja250510,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "今、APEXがアツイ【Apex Legends】",
    createdAt: "2025-06-18",
    tags: ["動画編集", "サムネイル制作"],
    authors: ["かずくん", "Reku"],
    assets: [
      {
        type: "video",
        title: "今、APEXがアツイ【Apex Legends】",
        src: "https://www.youtube.com/watch?v=3nJiWvI1Lbw",
      },
      {
        type: "image",
        caption: "サムネイル",
        src: apex250618,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "沈む様 Youtube用ED",
    createdAt: "2025-04-28",
    tags: ["動画編集"],
    authors: ["Reku"],
    assets: [
      {
        type: "video",
        title: "沈む様 Youtube用ED",
        src: "https://www.youtube.com/watch?v=WTSC12JGenE",
      },
    ],
  },
  {
    title: "沈む様 配信待機画面",
    createdAt: "2025-05-16",
    tags: ["動画編集"],
    authors: ["Reku"],
    assets: [
      {
        type: "video",
        title: "沈む様 配信待機画面",
        src: "https://www.youtube.com/watch?v=WjwuBdj5XdM",
      },
    ],
  },
  {
    title: "プロのランクでキャリーするプロコーチの秘訣 [オーバーウォッチ 2]",
    createdAt: "2025-05-30",
    tags: ["動画編集", "サムネイル制作"],
    authors: ["かずくん", "Reku"],
    assets: [
      {
        type: "video",
        title:
          "プロのランクでキャリーするプロコーチの秘訣 [オーバーウォッチ 2]",
        src: "https://www.youtube.com/watch?v=bxtQNsK_Kj4",
      },
      {
        type: "image",
        caption: "サムネイル",
        src: coach250530,
        showInCarousel: true,
      },
    ],
  },
  {
    title: "Nyam Gaming Cup 前哨戦 結婚をかけていざ勝負 VSばさお",
    createdAt: "2025-07-04",
    tags: ["動画編集"],
    authors: ["Reku"],
    assets: [
      {
        type: "video",
        title: "Nyam Gaming Cup 前哨戦 結婚をかけていざ勝負 VSばさお",
        src: "https://www.youtube.com/watch?v=98YcrhcILFk",
      },
    ],
  },
] satisfies Work[];
