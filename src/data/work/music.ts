import type { IconImage, Work } from "../../types";

import musicNoteIcon from "../../assets/icons/music-note-beamed.svg";

const musicNoteIconImage: IconImage = {
  icon: musicNoteIcon,
  width: "40%",
  height: "40%",
  backgroundColor:
    "linear-gradient(135deg, #e16428 0%, #ff7a3a 50%, #e16428 100%)",
};

export const MUSIC = [
  {
    title: "BACK ONCE AGAIN",
    createdAt: "2025-07-09",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "BACK ONCE AGAIN",
        src: "/music/back-once-again.mp3",
      },
    ],
  },
  {
    title: "Kill it [ABYSSUM EP VOL.2]",
    createdAt: "2025-07-09",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "Kill it [ABYSSUM EP VOL.2]",
        src: "/music/kill-it.mp3",
      },
    ],
  },
  {
    title: "ON MY OWN",
    createdAt: "2025-07-09",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "ON MY OWN",
        src: "/music/gangcat-onmyown.mp3",
      },
    ],
  },
  {
    title: "sound check",
    createdAt: "2025-07-09",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "sound check",
        src: "/music/sound-check.mp3",
      },
    ],
  },
  {
    title: "take this!",
    createdAt: "2025-07-09",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "take this!",
        src: "/music/take-this.mp3",
      },
    ],
  },
  {
    title: "GIVE U UP",
    createdAt: "2025-07-19",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "GIVE U UP",
        src: "/music/give-u-up.mp3",
      },
    ],
  },
  {
    title: "教えてダーリン",
    createdAt: "2025-07-19",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "教えてダーリン",
        src: "/music/oshiete-darling.mp3",
      },
    ],
  },
  {
    title: "skill check",
    createdAt: "2025-07-19",
    tags: ["BGM"],
    authors: ["くりす"],
    thumbnail: musicNoteIconImage,
    assets: [
      {
        type: "music",
        title: "skill check",
        src: "/music/skill-check.mp3",
      },
    ],
  },
] satisfies Work[];
