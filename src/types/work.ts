import type { ImageMetadata } from 'astro';

/** @deprecated */
export interface Work_old {
  imageSrc: string;
  title: string;
  createdAt: string;
  authors: string;
}

export interface Work {
  title: string;
  createdAt: string;
  //REVIEW - 別な名前にするかも
  subCategory: string;
  authors: string[];
  assets: Asset[];
  // ここで定義されない場合、assetsの最初の要素のサムネイルを使用する
  thumbnail?: string;
}

export type Asset = VideoAsset | ImageAsset | MusicAsset | WebsiteAsset | ExternalAsset;

export type AssetType = 'video' | 'image' | 'music' | 'website' | 'external';

export type ImageSource = string | ImageMetadata;

export interface BaseAsset {
  title: string;
}

export interface VideoAsset extends BaseAsset {
  type: 'video';
  src: string;
  thumbnail?: ImageSource;
}

export interface ImageAsset extends BaseAsset {
  type: 'image';
  src: ImageSource;
  showInCarousel?: boolean;
}

export interface MusicAsset extends BaseAsset {
  type: 'music';
  src: string;
  thumbnail?: ImageSource;
}

export interface WebsiteAsset extends BaseAsset {
  type: 'website';
  url: string;
  clientName: string;
  thumbnail?: ImageSource;
}

export interface ExternalAsset extends BaseAsset {
  type: 'external';
  url: string;
  thumbnail?: ImageSource;
}
