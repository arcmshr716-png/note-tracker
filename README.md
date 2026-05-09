# Note Tracker

Note記事の売上・いいね管理ツール

## 機能
- 記事ごとのいいね数・売上数・売上金額を記録
- 分析メモと反省点の記録
- 数値変更時の履歴スナップショット
- ダッシュボードで集計サマリーを表示

## 技術スタック
- Next.js 16 (App Router)
- Tailwind CSS v4
- Prisma 7 + libSQL

## 本番デプロイ（Vercel + Turso）
1. [Turso](https://turso.tech) で無料DBを作成
2. `DATABASE_URL=libsql://...` を Vercel の環境変数に設定
3. GitHubリポジトリを Vercel に接続してデプロイ
