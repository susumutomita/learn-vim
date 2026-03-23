# Learn VIM - キーボード駆動開発マスター

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue)](https://susumutomita.github.io/learn-vim/)

Neovim / Ghostty / Claude Code を使いこなすためのインタラクティブ学習アプリ。

> **🔗 デモ:** [https://susumutomita.github.io/learn-vim/](https://susumutomita.github.io/learn-vim/)

## 機能

- **Neovim Core** — モーション、編集、テキストオブジェクト、レジスタ、マクロ、検索置換、ビジュアルモード、マーク、ウィンドウ/バッファ、Exコマンド
- **Neovim プラグイン** — Telescope、Neo-tree、LSP、プラグインエコシステム
- **Ghostty Terminal** — ターミナル操作の効率化
- **Claude Code** — AI駆動のコーディング
- **統合ワークフロー** — 全ツールを組み合わせた実践的なワークフロー

各カテゴリでローカルのClaude Code CLIが問題を生成し、回答をリアルタイムでバリデーション＆フィードバックします。

## 技術スタック

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [CodeMirror](https://codemirror.net/) 6 + Vim keybindings
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI (問題生成・フィードバック / ローカル実行)
- [Biome](https://biomejs.dev/) (フォーマット・リント)

## セットアップ

```bash
# 依存パッケージのインストール
make install
```

> **注意:** 問題生成・フィードバック機能にはローカルで [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI がインストールされている必要があります。
> API キーは不要です。`claude` コマンドがパスに通っていれば動作します。

## 開発

```bash
# 開発サーバーの起動
make start

# その他のコマンドはヘルプを参照
make
```

## 利用可能なコマンド

| コマンド | 説明 |
| --- | --- |
| `make` | ヘルプを表示 |
| `make install` | 依存パッケージをインストール |
| `make start` | 開発サーバーを起動 |
| `make build` | プロダクションビルド |
| `make lint` | ESLintを実行 |
| `make format` | Biomeでフォーマット |
| `make check` | Biomeでフォーマット+リントチェック |
| `make typecheck` | TypeScriptの型チェック |
| `make ci` | CI全チェック実行 |
| `make clean` | ビルド成果物を削除 |

## ライセンス

[LICENSE](./LICENSE) を参照してください。
