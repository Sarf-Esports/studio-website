import type { Work } from '../types';

export const WORKS = {
  'Movie': [
  ],
  'Music': [
    {
      title: 'BACK ONCE AGAIN',
      subCategory: 'Music Production',
      createdAt: '2025-07-09',
      authors: ['chris_gangcat'],
      assets: [
        {
          type: 'music',
          title: 'BACK ONCE AGAIN',
          src: '/music/back-once-again.mp3',
        },
      ]
    },
    {
      title: 'Kill it [ABYSSUM EP VOL.2]',
      subCategory: 'Music Production',
      createdAt: '2025-07-09',
      authors: ['chris_gangcat'],
      assets: [
        {
          type: 'music',
          title: 'Kill it [ABYSSUM EP VOL.2]',
          src: '/music/kill-it.mp3',
        },
      ]
    },
    {
      title: 'GANGCAT ONMYOWN',
      subCategory: 'Music Production',
      createdAt: '2025-07-09',
      authors: ['chris_gangcat'],
      assets: [
        {
          type: 'music',
          title: 'GANGCAT ONMYOWN',
          src: '/music/gangcat-onmyown.mp3'
        }
      ]
    },
    {
      title: 'sound check',
      subCategory: 'Music Production',
      createdAt: '2025-07-09',
      authors: ['chris_gangcat'],
      assets: [
        {
          type: 'music',
          title: 'sound check',
          src: '/music/sound-check.mp3'
        }
      ]
    }
  ],
  'Design': [
    {
      title: "ればっちくん",
      subCategory: "Illustration",
      createdAt: "2025-05-09",
      authors: ["にんじゃはむぞー"],
      assets: [
        {
          type: 'image',
          title: "ればっちくん",
          src: "https://i.imgur.com/ARpQ8JC.png",
          showInCarousel: true,
        }
      ]
    },
    {
      title: "鮮やかHDR",
      subCategory: "Illustration",
      createdAt: "2023-04-12",
      authors: ["Stable Diffusion"],
      assets: [
        {
          type: 'image',
          title: "鮮やかHDR",
          src: "https://files.aipictors.com/db9a4176-9792-462b-ac7f-a5935edccca3",
          showInCarousel: true,
        }
      ]
    },
    {
      title: "REVATI ヘッダー",
      subCategory: "Graphic Design",
      createdAt: "2024-04-01",
      authors: ["REVATI"],
      assets: [
        {
          type: 'image',
          title: "REVATI ヘッダー",
          src: "https://revati.jp/images/logos/revati/header_mini_oxipng.png",
          showInCarousel: true,
        }
      ]
    },
    {
      title: "No Image (©2023 Rinrin.rs | CC BY-SA 4.0)",
      subCategory: "Graphic Design",
      createdAt: "2023-10-02",
      authors: ["Rinrin.rs"],
      assets: [
        {
          type: 'image',
          title: "No Image",
          src: "https://feat--168-goods-poster-carou.revati.pages.dev/images/news/thumbnails/20240301_test.png",
          showInCarousel: true,
        }
      ]
    },
    {
      title: "ポスター Ω<ﾅﾝﾃﾞｽｯﾃｰ!? (©2024 Rinrin.rs | CC BY-SA 4.0)",
      subCategory: "Graphic Design",
      createdAt: "2024-09-18",
      authors: ["Rinrin.rs"],
      assets: [
        {
          type: 'image',
          title: "ポスター Ω<ﾅﾝﾃﾞｽｯﾃｰ!? (©2024 Rinrin.rs | CC BY-SA 4.0)",
          src: "https://dev.rinrin.pages.dev/images/creations/thumbnails/poster-nandesuttee.webp",
          showInCarousel: true,
        }
      ],
    },
  ],
  'Service': [
    {
      title: "revati.jp",
      subCategory: "Web Development",
      createdAt: "2023-01-21",
      thumbnail: "https://i.imgur.com/gEmZFMK.png",
      authors: ["Rinrin.rs", "GEN3987", "Retoruto9900K", "しろねこ"],
      assets: [
        {
          type: 'website',
          title: "revati.jp",
          url: "https://revati.jp",
          clientName: "REVATI",
          thumbnail: "https://i.imgur.com/gEmZFMK.png",
        },
      ],
    },
    // bot, etc.
  ]
} satisfies Record<string, Work[]>;

export type WORKS = typeof WORKS;