<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ディレクトリ構成

- `src/app/` — Next.js の App Router。API は `src/app/api/[[...route]]/route.ts` で Hono に全て委譲する（ここにロジックを書かない）
- `src/server/` — バックエンド（レイヤードアーキテクチャ）。機能ごとに `<layer>/<feature>/` に置く
  - `presentation/` — Hono のルーティング、リクエストの検証（zod）、レスポンスの整形
  - `application/` — ユースケース
  - `domain/` — エンティティとビジネスルール。他の層や外部ライブラリに依存しない
  - `infrastructure/` — DB アクセスなど、domain が定義したインターフェースの実装
- `src/db/` — Drizzle の schema と DB クライアント（server-only）。import してよいのは `infrastructure/` からのみ

依存の向き: presentation → application → domain ← infrastructure

