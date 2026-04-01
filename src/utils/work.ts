import { WORKS } from "../data/work";
import type {
  Asset,
  AssetType,
  Work,
  Track,
  ImageSource,
  IconImage,
} from "../types";

/** Work IDを生成する関数 */
export function getWorkId(work: Work): string {
  return `${work.title}_${work.createdAt}`;
}

/** IconImageかどうかを判定する型ガード */
export function isIconImage(img: unknown): img is IconImage {
  return (
    img !== null &&
    typeof img === "object" &&
    "icon" in img &&
    "backgroundColor" in img
  );
}

/**
 * Workオブジェクトからサムネイル画像のソースを特定する関数
 *
 * IconImageの場合はnullを返す（最適化対象外）
 */
export function getThumbnailSource(work: Work): ImageSource | null {
  if ("thumbnail" in work && work.thumbnail !== undefined) {
    if (isIconImage(work.thumbnail)) return null;
    return work.thumbnail;
  }

  const firstAsset = work.assets[0];
  if (
    firstAsset &&
    "thumbnail" in firstAsset &&
    firstAsset.thumbnail !== undefined
  )
    return firstAsset.thumbnail;

  const imageAsset = work.assets.find((asset) => asset.type === "image");
  if (imageAsset && imageAsset.type === "image") return imageAsset.src;

  return null;
}

export interface WorkEntry extends Work {
  category: keyof WORKS;
}

export interface WorkQueryOptions {
  category?: keyof WORKS;
  author?: string;
  tags?: string[];
}

export interface WorkSlugEntry extends WorkEntry {
  slug: string;
}

export function queryWorks(options?: WorkQueryOptions): WorkEntry[] {
  const works: WorkEntry[] = [];

  for (const category in WORKS) {
    if (options?.category && options.category !== category) continue;
    const categoryWorks = WORKS[category as keyof WORKS];

    for (const work of categoryWorks) {
      if (
        options?.author &&
        !work.authors.some((a) => extractAuthorName(a) === options.author)
      )
        continue;
      if (
        options?.tags &&
        !options.tags.every((tag) => work.tags.includes(tag))
      )
        continue;

      works.push({
        ...work,
        category: category as keyof WORKS,
      });
    }
  }

  return works;
}

const CREATED_AT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function formatCreatedAtToYYMMDD(createdAt: string): string {
  const matched = CREATED_AT_PATTERN.exec(createdAt);
  if (matched !== null) {
    const year = matched[1].slice(2);
    return `${year}${matched[2]}${matched[3]}`;
  }

  const digits = createdAt.replace(/[^\d]/g, "");
  if (digits.length >= 8) {
    return `${digits.slice(2, 4)}${digits.slice(4, 6)}${digits.slice(6, 8)}`;
  }
  if (digits.length >= 6) {
    return digits.slice(0, 6);
  }

  return "000000";
}

function normalizeTitleForSlug(title: string): string {
  const normalized = title
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\u3000\s]+/g, "-")
    .replace(/[\\/|]+/g, "-")
    .replace(/[?&=#%<>{}()+,.;:!~^'"`]/g, "")
    .replace(/\[|\]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized.length > 0 ? normalized : "work";
}

function getBaseWorkSlug(work: Work): string {
  const normalizedTitle = normalizeTitleForSlug(work.title);
  const yymmdd = formatCreatedAtToYYMMDD(work.createdAt);
  return `${normalizedTitle}-${yymmdd}`;
}

function createWorkLookupKey(work: Work): string {
  const authors = work.authors
    .map((author) =>
      typeof author === "string" ? author : `${author.name}:${author.role}`,
    )
    .join("|");

  return `${work.title}::${work.createdAt}::${work.clientName ?? ""}::${authors}`;
}

function getWorkEntrySortKey(work: WorkEntry): string {
  return `${work.category}::${createWorkLookupKey(work)}`;
}

function buildWorkSlugEntries(): WorkSlugEntry[] {
  const works = queryWorks();
  const groupedWorks = new Map<string, WorkEntry[]>();

  for (const work of works) {
    const baseSlug = getBaseWorkSlug(work);
    const entries = groupedWorks.get(baseSlug);

    if (entries === undefined) {
      groupedWorks.set(baseSlug, [work]);
    } else {
      entries.push(work);
    }
  }

  const slugEntries: WorkSlugEntry[] = [];

  for (const [baseSlug, grouped] of groupedWorks) {
    const sorted = grouped
      .slice()
      .sort((a, b) =>
        getWorkEntrySortKey(a).localeCompare(getWorkEntrySortKey(b), "ja"),
      );

    sorted.forEach((work, index) => {
      const slug = index === 0 ? baseSlug : `${baseSlug}-${index}`; // 重複がある場合は末尾に連番を付与
      slugEntries.push({
        ...work,
        slug,
      });
    });
  }

  return slugEntries;
}

const WORK_SLUG_ENTRIES = buildWorkSlugEntries();
const WORK_SLUG_MAP = new Map<string, WorkSlugEntry>();
const WORK_LOOKUP_KEY_MAP = new Map<string, WorkSlugEntry[]>();
for (const work of WORK_SLUG_ENTRIES) {
  WORK_SLUG_MAP.set(work.slug, work);

  const lookupKey = createWorkLookupKey(work);
  const entries = WORK_LOOKUP_KEY_MAP.get(lookupKey);
  if (entries === undefined) {
    WORK_LOOKUP_KEY_MAP.set(lookupKey, [work]);
  } else {
    entries.push(work);
  }
}

export function getWorkSlug(work: Work): string | undefined {
  const lookupKey = createWorkLookupKey(work);
  const candidates = WORK_LOOKUP_KEY_MAP.get(lookupKey);

  if (!candidates || candidates.length === 0) return;

  return candidates[0].slug;
}

export function findWorkBySlug(slug: string): WorkSlugEntry | null {
  return WORK_SLUG_MAP.get(slug) ?? null;
}

export interface AssetQueryOptions {
  category?: keyof WORKS;
  type?: AssetType;
  excludeHideFromCarousel?: boolean;
}

export function queryAssets(options?: AssetQueryOptions): Asset[] {
  const works = queryWorks();
  const assets: Asset[] = [];

  if (!options) return works.flatMap((work) => work.assets);

  for (const work of works) {
    if (options.category && work.category !== options.category) continue;

    for (const asset of work.assets) {
      if (options.type && asset.type !== options.type) continue;
      if (
        options.excludeHideFromCarousel &&
        asset.type === "image" &&
        asset.hideFromCarousel === true
      )
        continue;

      assets.push(asset);
    }
  }

  return assets;
}

export function getMusicList(): Track[] {
  const works = queryWorks({ category: "music" });
  const tracks: Track[] = [];

  for (const work of works) {
    for (const asset of work.assets) {
      if (asset.type === "music") {
        tracks.push({
          title: asset.title,
          artist: work.authors.map(extractAuthorName).join(", "),
          src: asset.src,
        });
      }
    }
  }

  return tracks;
}

function extractAuthorName(
  author: string | { name: string; role: string },
): string {
  return typeof author === "string" ? author : author.name;
}
