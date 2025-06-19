# 仕様書

<!-- 不足や変更点等があれば随時更新してください。 -->

## ウェブサイト概要

- サイト名: REVATI Studio
- URL: https://studio.revati.jp
- リポジトリ: https://github.com/Sarf-Esports/studio-website

## サイトマップ

- WORKS (TOP)
  - Our Works
    - Media Production
      - Video Production
      - Video Editing
    - Visual Design
      - Illustration
      - Graphic Design
      - Web Design
    - Digital Development
      - Web Development
      - App Development
      - Bot Development
- ABOUT
- CONTACT
  - Google Formを埋め込む

## デザイン

- カラーパレット: https://colorhunt.co/palette/363333272121e16428f6e9e9
  - `#363333`
  - `#272121`
  - `#e16428`
  - `#f6e9e9`
- フォント
  - Noto Sans Japanese
    - Regular: `400`
    - Black: `900`

## 使用技術

- Astro v5
  - TypeScript
  - SCSS
- Three.js
- Cloudflare Pages

## その他要件

- SPA?
  - [View Transition](https://docs.astro.build/ja/guides/view-transitions/)を使う
- 作品のカルーセル
- 3D ロゴの配置
  - ドラッグ可能なウィンドウの中に入れる。
- 音楽再生機能
  - プレイヤー
  - 波形表示
- レスポンシブデザイン対応
- 日本語のみの対応

## 音楽再生の機能
- MusicPlayer (svelte) (状態をまとめて管理)
  - ControlPanel (svelte)
  - WaveDisplay (svelte)

- Desktop
  - 画面下部に横全画面で波を表示
  - 画面右下にコントロールを表示(title, artist, play/pause, next, prev)
- Mobile
  - 画面右側に波を表示
  - 画面下部に横全画面で小さめ(低め)のコントロールを表示(title, artist, play/pause, next, prev)