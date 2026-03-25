# :learn VIM — キーボード駆動開発マスター

[![CI](https://github.com/susumutomita/learn-vim/actions/workflows/ci.yml/badge.svg)](https://github.com/susumutomita/learn-vim/actions/workflows/ci.yml)

ブラウザ上のVimエディタで実践しながら、Neovim / Ghostty / Claude Code のテクニックを身につけるインタラクティブ学習アプリです。

## どんなアプリ？

**「問題を読む → Vimエディタで操作する → 正誤判定＆AI解説」** のサイクルで、キーボード駆動の開発スキルを体系的に学べます。

### 学習の流れ

```
1. ホーム画面でカテゴリを選択（例: 高速移動、テキストオブジェクト...）
2. 問題が出題される（組み込み問題 or AI生成）
3. ブラウザ上のVimエディタで実際に操作して回答
   - エディタ型: Vimキーバインドで編集 → :w で提出
   - コマンド入力型: 正しいコマンドをテキストで入力
4. 正誤判定＆フィードバック
5. AIチャットで解説を聞いたり深堀りしたりできる
```

### 主な機能

| 機能 | 説明 |
|------|------|
| **Vimエディタ** | [CodeMirror 6](https://codemirror.net/) + Vim keybindings でブラウザ内にリアルなVim環境 |
| **17カテゴリ** | 移動、編集、テキストオブジェクト、レジスタ、マクロ、Telescope、LSP、Ghostty、Claude Code など |
| **組み込み問題** | AI不要で即座に学習開始できる問題セット |
| **AI問題生成** | [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) で難易度に応じた問題を動的生成 |
| **AIチャット** | 問題のコンテキストを持ったAIチューターに質問・深堀り |
| **進捗トラッキング** | localStorage に正解数・連続学習日数・苦手分野を保存 |
| **チュートリアル** | 初回アクセス時に使い方を案内するオーバーレイ |

## アーキテクチャ

```
┌─ ブラウザ ──────────────────────────────────────────┐
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Vim Editor       │  │  サイドバー              │  │
│  │  (CodeMirror 6    │  │  📋 問題タブ             │  │
│  │   + vim mode)     │  │    - 問題文              │  │
│  │                   │  │    - 期待結果             │  │
│  │  :w で提出        │  │    - ヒント              │  │
│  │                   │  │  🤖 AIチャットタブ       │  │
│  │                   │  │    - 質問・解説           │  │
│  └──────────────────┘  │    - クイックプロンプト   │  │
│                         └──────────────────────────┘  │
│  [Submit] [Reset] [Hint] [Skip]                       │
└────────────────────────────────────────────────────────┘
          │
          │ fetch /api/challenge, /api/feedback, /api/chat
          ▼
┌─ Next.js Server (API Routes) ─┐
│                                │
│  /api/challenge                │
│    組み込み問題 → 即座に返却    │
│    AI生成 → claude CLI 呼び出し │
│                                │
│  /api/feedback                 │
│    回答の正誤に応じたAI解説     │
│                                │
│  /api/chat                     │
│    問題コンテキスト付きAI会話    │
└────────┬───────────────────────┘
         │ execFile("claude", ["-p", ...])
         ▼
┌─ Claude Code CLI ─┐
│  ローカルの claude  │
│  コマンドを利用     │
│  (定額プラン対応)   │
└────────────────────┘
```

### ポイント

- **APIキー不要**: Anthropic APIキーではなく、ローカルにインストール済みの `claude` CLI を `execFile` で呼び出します。Claude Code の定額プランをそのまま利用できます。
- **組み込み問題あり**: Claude CLI がなくても学習可能です。AI 生成がタイムアウトした場合は自動的に組み込み問題にフォールバックします。
- **進捗はローカル保存**: サーバーやDBは不要。ブラウザの localStorage に保存されます。

## 学習カテゴリ一覧

### Neovim Core（エディタ型）

| カテゴリ | 学べること |
|----------|-----------|
| 高速移動 | `f/t/F/T`, `{/}`, `%`, `w/b/e`, `gg/G` |
| 編集の極意 | `dd`, `cc`, `yy`, `p/P`, `J`, `.`, `u/Ctrl-r` |
| テキストオブジェクト | `ciw`, `di"`, `va{`, `yit` など |
| レジスタ | `"ayy`, `"ap`, `"+y`, `Ctrl-r a` |
| マクロ | `qq...q`, `@q`, `@@`, `10@q` |
| 検索＆置換 | `/pattern`, `*`, `:%s/old/new/g`, `\v` |
| ビジュアルモード | `v`, `V`, `Ctrl-v`, ブロック編集 |
| マーク＆ジャンプ | `ma`, `` `a ``, `''`, `` `. `` |
| ウィンドウ＆バッファ | `Ctrl-w s/v/h/j/k/l`, `:bn`, `:bp` |
| Exコマンド | `:g/pattern/d`, `:norm`, `:%!sort`, `:read` |

### Neovim プラグイン（コマンド入力型）

| カテゴリ | 学べること |
|----------|-----------|
| Telescope | `<leader>ff`, `<leader>fg`, `<leader>fb` |
| Neo-tree | ファイルツリー操作、`a`, `d`, `r`, `c` |
| LSP | `gd`, `gr`, `K`, `<leader>rn`, コード診断 |

### ターミナル & ツール（コマンド入力型）

| カテゴリ | 学べること |
|----------|-----------|
| Ghostty | `Cmd+D`, `Cmd+Shift+D`, ペイン操作、フォント設定 |
| Claude Code | `/`, `@`, `!`, 効率的なプロンプティング |
| 統合ワークフロー | Neovim + Ghostty + Claude Code の連携 |

## セットアップ

### 必須要件

- [Bun](https://bun.sh/) (パッケージマネージャ・ランタイム)

### オプション（AI機能を使う場合）

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (`claude` コマンドがPATHに存在すること)

### インストール＆起動

```bash
git clone https://github.com/susumutomita/learn-vim.git
cd learn-vim

# 依存パッケージのインストール
make install

# 開発サーバーの起動
make start
# → http://localhost:3000 で開きます
```

> **Note**: Claude CLI がインストールされていなくても、組み込み問題で学習できます。
> AI問題生成・AIチャット・AIフィードバックを使う場合のみ Claude CLI が必要です。

## 開発コマンド

| コマンド | 説明 |
|----------|------|
| `make install` | 依存パッケージをインストール |
| `make start` | 開発サーバーを起動 (ホットリロード) |
| `make build` | プロダクションビルド |
| `make lint` | ESLint を実行 |
| `make format` | Biome でフォーマット |
| `make check` | Biome でフォーマット+リントチェック |
| `make typecheck` | TypeScript の型チェック |
| `make ci` | CI 全チェック実行 (check + lint + typecheck + build) |
| `make clean` | ビルド成果物を削除 |

## プロジェクト構成

```
src/
├── app/
│   ├── page.tsx              # ホーム画面（カテゴリ選択）
│   ├── challenge/page.tsx    # チャレンジ画面（メイン学習UI）
│   └── api/
│       ├── challenge/route.ts  # 問題生成API
│       ├── feedback/route.ts   # フィードバックAPI
│       └── chat/route.ts       # AIチャットAPI
├── components/
│   ├── editor/
│   │   ├── VimEditor.tsx     # CodeMirror 6 + Vim keybindings
│   │   ├── VimStatusBar.tsx  # Vimモード表示バー
│   │   └── EditorTheme.ts   # エディタテーマ定義
│   ├── challenge/            # 問題表示・操作ボタン・フィードバック
│   ├── chat/
│   │   └── AIChatPanel.tsx   # AIチャットパネル
│   └── tutorial/
│       └── TutorialOverlay.tsx # 初回チュートリアル
├── hooks/
│   ├── useChallenge.ts       # 問題生成・提出・ヒントのロジック
│   └── useProgress.ts       # 進捗管理（localStorage）
├── lib/
│   ├── builtin-challenges.ts # 組み込み問題データ
│   ├── categories.ts         # 17カテゴリの定義
│   ├── claude.ts             # Claude CLI呼び出しラッパー
│   ├── prompts.ts            # AI問題生成プロンプト
│   └── validator.ts          # 回答バリデーション
└── types/
    ├── challenge.ts          # 問題・カテゴリの型定義
    └── progress.ts           # 進捗データの型定義
```

## 技術スタック

| 技術 | 用途 | ドキュメント |
|------|------|-------------|
| [Next.js](https://nextjs.org/) 15 | フレームワーク (App Router) | [Docs](https://nextjs.org/docs) |
| [React](https://react.dev/) 19 | UI ライブラリ | [Docs](https://react.dev/reference/react) |
| [TypeScript](https://www.typescriptlang.org/) | 型安全 | [Docs](https://www.typescriptlang.org/docs/) |
| [Tailwind CSS](https://tailwindcss.com/) 4 | スタイリング | [Docs](https://tailwindcss.com/docs) |
| [CodeMirror](https://codemirror.net/) 6 | ブラウザ内Vimエディタ | [Docs](https://codemirror.net/docs/) |
| [Bun](https://bun.sh/) | パッケージマネージャ・ランタイム | [Docs](https://bun.sh/docs) |
| [Biome](https://biomejs.dev/) | フォーマット・リント | [Docs](https://biomejs.dev/reference/) |
| [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) | AI問題生成・チャット | [Docs](https://docs.anthropic.com/en/docs/claude-code) |

## ライセンス

[LICENSE](./LICENSE) を参照してください。
