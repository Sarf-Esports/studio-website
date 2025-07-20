import type { ImageMetadata } from "astro";

export type ImageSource = string | ImageMetadata;

export interface IconImage {
  icon: ImageSource;
  width: string;
  height: string;
  backgroundColor: string;
}

export type Image = ImageSource | IconImage;

export interface Work {
  title: string;
  createdAt: string;
  tags: string[];
  authors: string[];
  assets: Asset[];
  // ここで定義されない場合、assetsの最初の要素のサムネイルを使用する
  thumbnail?: Image;
  border?: string;
}

export type Asset =
  | VideoAsset
  | ImageAsset
  | MusicAsset
  | WebsiteAsset
  | ExternalAsset;

export type AssetType = "video" | "image" | "music" | "website" | "external";

export interface VideoAsset {
  type: "video";
  title: string;
  src: string;
  thumbnail?: ImageSource;
}

export interface ImageAsset {
  type: "image";
  src: ImageSource;
  caption: string;
  showInCarousel?: boolean;
}

export interface MusicAsset {
  type: "music";
  title: string;
  src: string;
  thumbnail?: ImageSource;
}

export interface WebsiteAsset {
  type: "website";
  title: string;
  url: string;
  clientName: string;
  thumbnail?: ImageSource;
}

export interface ExternalAsset {
  type: "external";
  title?: string;
  url: string;
  thumbnail?: ImageSource;
}
