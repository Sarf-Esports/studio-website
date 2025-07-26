/**
 * YouTube関連のユーティリティ関数
 */

/**
 * YouTubeサムネイルの解像度オプション
 */
export type ThumbnailQuality = "maxres" | "hq" | "mq" | "default";

/**
 * YouTube URLのパターン
 */
const YOUTUBE_URL_PATTERNS = [
  // Standard watch URL
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  // Short URL
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
  // Embed URL
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/,
  // Legacy video URL
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
  // Mobile URL
  /(?:https?:\/\/)?m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
];

/**
 * YouTube URLから動画IDを抽出する
 * @param url YouTube URL
 * @returns 動画ID（見つからない場合はnull）
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // 動画IDから余分なパラメータを除去
      const videoId = match[1].split("&")[0].split("?")[0];
      return videoId;
    }
  }

  return null;
}

/**
 * YouTube URLかどうかを判定する
 * @param url 検証するURL
 * @returns YouTube URLの場合true
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * YouTube動画のサムネイルURLを生成する
 * @param videoId YouTube動画ID
 * @param quality サムネイルの品質（デフォルト: 'maxres'）
 * @returns サムネイル画像のURL
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: ThumbnailQuality = "maxres",
): string {
  if (!videoId) {
    throw new Error("Video ID is required");
  }

  const qualityMap = {
    maxres: "maxresdefault.jpg", // 1280x720 (最高解像度)
    hq: "hqdefault.jpg", // 480x360 (高解像度)
    mq: "mqdefault.jpg", // 320x180 (中解像度)
    default: "default.jpg", // 120x90 (デフォルト)
  };

  const filename = qualityMap[quality] || qualityMap.maxres;
  return `https://img.youtube.com/vi/${videoId}/${filename}`;
}

/**
 * YouTube URLからサムネイル画像のURLを直接生成する
 * @param url YouTube URL
 * @param quality サムネイルの品質（デフォルト: 'maxres'）
 * @returns サムネイル画像のURL（無効なURLの場合はnull）
 */
export function getYouTubeThumbnailFromUrl(
  url: string,
  quality: ThumbnailQuality = "maxres",
): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return getYouTubeThumbnail(videoId, quality);
}

/**
 * YouTube URLを埋め込み用URLに変換する
 * @param url YouTube URL
 * @param autoplay 自動再生を有効にするか（デフォルト: false）
 * @returns 埋め込み用URL（無効なURLの場合は元のURLを返す）
 */
export function getYouTubeEmbedUrl(
  url: string,
  autoplay: boolean = false,
): string {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return url; // 無効なURLの場合は元のURLをそのまま返す
  }

  const params = new URLSearchParams();
  if (autoplay) {
    params.set("autoplay", "1");
  }

  const queryString = params.toString();
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return queryString ? `${embedUrl}?${queryString}` : embedUrl;
}

/**
 * YouTube動画の情報を取得する（タイトル等は外部API必要）
 * @param videoId YouTube動画ID
 * @returns 動画の基本情報
 */
export function getYouTubeVideoInfo(videoId: string) {
  return {
    id: videoId,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    thumbnails: {
      maxres: getYouTubeThumbnail(videoId, "maxres"),
      hq: getYouTubeThumbnail(videoId, "hq"),
      mq: getYouTubeThumbnail(videoId, "mq"),
      default: getYouTubeThumbnail(videoId, "default"),
    },
  };
}

/**
 * 複数のサムネイル品質を試行してフォールバックする
 * 高解像度から順番に試行し、利用可能な最高品質のサムネイルを返す
 * @param videoId YouTube動画ID
 * @returns Promise<string> 利用可能な最高品質のサムネイルURL
 */
export async function getYouTubeThumbnailWithFallback(
  videoId: string,
): Promise<string> {
  const qualities: ThumbnailQuality[] = ["maxres", "hq", "mq", "default"];

  for (const quality of qualities) {
    const thumbnailUrl = getYouTubeThumbnail(videoId, quality);

    try {
      // 画像が存在するかチェック
      const response = await fetch(thumbnailUrl, { method: "HEAD" });
      if (response.ok) {
        return thumbnailUrl;
      }
    } catch {
      // ネットワークエラーなどの場合は次の品質を試行
      continue;
    }
  }

  // すべて失敗した場合はデフォルト品質を返す
  return getYouTubeThumbnail(videoId, "default");
}
