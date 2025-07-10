import type { Work } from '../../types';

import { DESIGN } from './design';
import { MOVIE } from './movie';
import { MUSIC } from './music';
import { SERVICE } from './service';

export const WORKS = {
  'Movie': MOVIE,
  'Music': MUSIC,
  'Design': DESIGN,
  'Service': SERVICE
} satisfies Record<string, Work[]>;

export type WORKS = typeof WORKS;