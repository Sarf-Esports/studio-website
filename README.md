# REVATI Studio Website

<img src="https://dev-studio.revati.workers.dev/images/Revati-Studio_header_orange.png" alt="" height="218" />

- プロダクト: https://studio.revati.jp
- 開発: `https://{ブランチ|デプロイ}-studio.revati.workers.dev`
  - dev ブランチ: https://dev-studio.revati.workers.dev/

## ドキュメント

- 仕様書: [docs/SPECIFICATION.md](./docs/SPECIFICATION.md)

## 環境構築

1. リポジトリをクローンする
1. `master` ブランチでは直接作業しないので、`dev` ブランチなどに切り替える

   ```bash
   git switch dev

   # 必要に応じて、そこからトピックブランチを作成する
   git switch -c feat/my-feature
   ```

1. 依存関係をインストールする
   ```bash
   pnpm install
   ```
1. 開発サーバーを起動する

   ```bash
   # 開発サーバーを起動する前に、`licenses.json` を生成する（`pnpm run build` では自動で実行される）
   pnpm run licenses

   # 起動する
   pnpm run dev
   ```

## 使用技術

- フレームワーク: [Astro](https://astro.build)
  - インテグレーション: [Svelte](https://svelte.dev)
- 3D グラフィックス: [Three.js](https://threejs.org) + [Threlte](https://threlte.xyz/)
- スタイルシート: [Sass](https://sass-lang.com) (SCSS)
- 開発ツール:
  - [pnpm](https://pnpm.io)
  - [TypeScript](https://typescriptlang.org)
  - [Prettier](https://prettier.io)
  - [ESLint](https://eslint.org)

## pnpm コマンド

環境構築や開発には以下の pnpm コマンドを使用する。(`pnpm dev`のように省略することも可能)

| コマンド             | 説明                                                                                          |
| :------------------- | :-------------------------------------------------------------------------------------------- |
| `pnpm run dev`       | 開発サーバーを起動 (`localhost:4321`)                                                         |
| `pnpm run build`     | プロダクション用にプロジェクトを `./dist/` にビルド                                           |
| `pnpm run preview`   | ビルドされたサイトをローカルでプレビュー                                                      |
| `pnpm run licenses`  | `licenses.json` を生成                                                                        |
| `pnpm run fmt`       | Prettier を使用してコードをフォーマット                                                       |
| `pnpm run check`     | エラーをチェック                                                                              |
| `pnpm run lnt`       | ESLint を使用してコードを検査                                                                 |
| `pnpm run lnt:fix`   | ESLint を使用してコードを自動修正                                                             |
| `pnpm run astro ...` | `astro add` などの [CLI コマンド](https://docs.astro.build/ja/reference/cli-reference/)を実行 |

## License

The source code in this repository is licensed under the **BSD 3-Clause "New" or "Revised" License**.
The full license text is available in the [`LICENSE`](./LICENSE) file.

### Scope of the License

The BSD 3-Clause License applies to the software source code (e.g., `*.astro`, `*.svelte`, `*.scss`, `*.ts` files) created by REVATI Studio.

It **does not apply** to the following:

#### 1. REVATI Studio Proprietary Assets

- All trademarks, service marks, and logos associated with REVATI Studio.
- All original content created by REVATI Studio, including text, images, audio, video, 3D models, and other media.

All rights to these materials are reserved by REVATI Studio and are not granted under the BSD license.

#### 2. Third-Party Assets

- Fonts (e.g., Noto Sans CJK, Special Gothic, Montserrat).
- Icons (e.g., Bootstrap Icons, Lucide).
- Other third-party libraries and assets.

These assets are subject to their respective licenses.
Please refer to the [Licenses page](https://studio.revati.jp/licenses) for details.
