# ればっちくんの3Dモデル

添付されたキャラクター画像の非対称な輪郭、頭のしずく、笑った目を手作業でパスに起こし、新規に造形したモデルです。白い陶器のシェル、青紫の金属の芯、細い発光ラインを重ねています。既存の `Revati-kun.glb` は参照・加工していません。

## ファイル

| ファイル                                  | 用途                                                           |
| ----------------------------------------- | -------------------------------------------------------------- |
| `public/models/rebacchi-porcelain.glb`    | 新規モデル。形状・4つのPBRマテリアルを内包                     |
| `public/models/rebacchi-poster.svg`       | 読み込み中・JavaScript無効・WebGL非対応・取得失敗時の静止画    |
| `scripts/generate-rebacchi.ts`            | 輪郭、厚み、ベベル、目、マテリアルの定義とGLB/SVGの生成        |
| `src/components/rebacchi/Rebacchi.svelte` | SSR対応の静止画、遅延読み込み、回転・停止ボタン                |
| `src/components/rebacchi/scene.ts`        | Three.jsの描画、照明、床のshader、アニメーション、リソース管理 |
| `src/components/ErrorPage.astro`          | 404・500共通のレイアウトとモデルの配置                         |

`package.json` に再生成コマンドと開発依存 `@types/three` を追加しています。実行時の依存追加はありません。

## 使い方

既存の404・500ページはそのまま新しい表示になります。

```sh
pnpm run licenses
pnpm run dev
```

`/404` または `/500` を開きます。モデルは自動で回転・浮遊します。横ドラッグ、左右のボタン、キャンバスにフォーカスして左右の矢印キーで向きを変えられます。「正面へ」またはHomeキーで初期の向きに戻り、停止ボタンで動き全体を停止できます。スマートフォンでは縦スクロールを維持しています。

別のAstroページに置く場合:

```astro
---
import Rebacchi from "../components/rebacchi/Rebacchi.svelte";
---

<div class="character-view">
  <Rebacchi client:visible />
</div>

<style lang="scss">
  .character-view {
    height: 480px;
  }
</style>
```

モデルを変更する場合は生成スクリプトを編集して実行します。Node.js 24とプロジェクトの依存だけで再生成でき、Blenderや添付画像ファイルの再配置は不要です。

```sh
pnpm run model:rebacchi
pnpm run check && pnpm run format && pnpm run lint
pnpm run build
```

GLB/SVGはコミット対象です。通常のビルド時にはモデルの再生成を行いません。

## モデルと描画

- GLB: 263,840 bytes（約258 KiB）、11,280三角形、7,796頂点、9メッシュ、4マテリアル。
- 外部テクスチャ、HDR、圧縮デコーダー、スキニングは不要です。
- 正面は +Z、上方向は +Y。`Body` と `Crest` が独立したノードです。
- 回転・浮遊は描画コード側で行います。GLB単体にはアニメーションクリップを含みません。
- 白い面はclearcoat、側面はiridescence、継ぎ目はemissiveのglTFマテリアルです。別のビューアでは対応するPBR照明・環境マップを設定してください。
- 128pxのキューブ面から反射用の環境マップを初期化時に一度だけ生成。照明は半球光と2灯の平行光です。
- 床の光・擬似接地影は1枚の平面shaderで描画。ブルームやシャドウマップ、多段ポストエフェクトは使用していません。
- モデルを含むシーンは通常15 draw calls。ブラウザが処理する上限はPCで60fps、モバイルで30fpsです。端末がこのフレームレートを維持することを保証する値ではありません。
- 初期の画面幅が787px以下、または主ポインターがcoarseなら軽量設定になります。DPR上限1.5、描画ピクセル数上限60万。その他はDPR上限2、150万ピクセルです。
- 停止中・画面外・非表示タブでは連続描画を停止。`prefers-reduced-motion: reduce` では静止表示にし、手動回転時だけ描画します。
- Astroでのページ遷移時はfetchを中断し、イベント、observer、描画ループ、geometry、material、環境マップ、WebGL contextを解放します。
- SVGはサーバーで出力されるため、JavaScriptやWebGLがなくてもキャラクターとホームへのリンクが表示されます。

## 検証

- `pnpm run check`、`pnpm run format`、`pnpm run lint`、`pnpm run build`。
- Khronos glTF Validator: エラー0、警告0。テクスチャを使わないiridescenceの最小膜厚が無視される旨の情報メッセージが1件あります。最大膜厚の380nmが使用されます。
- Chromiumの本番プレビューでPC・モバイル表示、回転操作、停止、画面外・タブ非表示、動きの低減、Astroでの遷移、WebGL喪失、モデル取得失敗、JavaScript無効時の表示を確認。
- モバイルはブラウザの画面幅・タッチ・DPRのエミュレーションによる確認です。実機でのFPS測定は行っていません。

マテリアルとGLB出力はThree.jsの [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) と [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html) を使用しています。
