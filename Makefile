.DEFAULT_GOAL := help

.PHONY: help install dev start build lint format format-check typecheck ci clean

help: ## ヘルプを表示
	@echo ""
	@echo "  learn-vim - キーボード駆動開発マスター"
	@echo ""
	@echo "  使い方: make <target>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## 依存パッケージをインストール
	bun install

dev: ## 開発サーバーを起動 (ホットリロード)
	bun run dev

start: dev ## 開発サーバーを起動 (devのエイリアス)

build: ## プロダクションビルド
	bun run build

lint: ## ESLintを実行
	bun run lint

format: ## Biomeでフォーマット
	bun run format

format-check: ## フォーマットのチェック (CIで使用)
	bun run format:check

check: ## Biomeでフォーマット+リントチェック
	bun run check

typecheck: ## TypeScriptの型チェック
	bun run typecheck

ci: check lint typecheck build ## CI: Biome・ESLint・型チェック・ビルドを実行

clean: ## ビルド成果物を削除
	rm -rf .next out node_modules
