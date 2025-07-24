import type { Work } from "../../types";

import { DESIGN } from "./design";
import { VIDEO } from "./video";
import { MUSIC } from "./music";
import { SERVICE } from "./service";

export const WORKS = {
  video: VIDEO,
  music: MUSIC,
  design: DESIGN,
  service: SERVICE,
} satisfies Record<string, Work[]>;

export type WORKS = typeof WORKS;
