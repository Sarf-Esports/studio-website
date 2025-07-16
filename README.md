# REVATI Studio Website

<img src="https://dev.revati-studio.pages.dev/images/Revati-Studio_header_orange.png" alt="" height="218" />

- プロダクト: https://studio.revati.jp
- 開発: `https://{ブランチ|デプロイ}.revati-studio.pages.dev`
	- dev ブランチ: https://dev.revati-studio.pages.dev/

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
	npm install
1. 開発サーバーを起動する
	```bash
	# 開発サーバーを起動する前に、`licenses.json` を生成する（`npm run build` では自動で実行される）
	npm run licenses

	# 起動する
	npm run dev
	```

## 使用技術

- フレームワーク: [Astro](https://astro.build)
	- インテグレーション: [Svelte](https://svelte.dev)
- 3D グラフィックス: [Three.js](https://threejs.org) + [Threlte](https://threlte.xyz/)
- スタイルシート: [Sass](https://sass-lang.com) (SCSS)
- 開発ツール:
	- [npm](https://npmjs.com)
	- [TypeScript](https://typescriptlang.org)
	- [Prettier](https://prettier.io)
	- [ESLint](https://eslint.org)

## npm コマンド

環境構築や開発には以下の npm コマンドを使用する。

| コマンド | 説明 |
| :-- | :-- |
| `npm run dev` | 開発サーバーを起動 (`localhost:4321`) |
| `npm run build` | プロダクション用にプロジェクトを `./dist/` にビルド |
| `npm run preview` | ビルドされたサイトをローカルでプレビュー |
| `npm run licenses` | `licenses.json` を生成 |
| `npm run fmt` | Prettier を使用してコードをフォーマット |
| `npm run check` | エラーをチェック |
| `npm run lnt` | ESLint を使用してコードを検査 |
| `npm run lnt:fix` | ESLint を使用してコードを自動修正 |
| `npm run astro ...` | `astro add` などの [CLI コマンド](https://docs.astro.build/ja/reference/cli-reference/)を実行 |

## ライセンス

このプロジェクトはプロプライエタリであり、公開されていません。
