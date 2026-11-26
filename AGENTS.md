<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ディレクトリ構成

### フロントエンド

- `src/app/` — Next.js の App Router。ルーティング専用で、page/layout は薄く保つ。UI の部品やロジックは下の `features/` などに置く
  - `(auth)/` — 未ログインで見る画面（ログイン、新規登録）。共通のレイアウトと CSS を `(auth)/layout.tsx` で共有する
  - `(main)/` — ログインが必要な画面。ログインの確認は layout ではなく各 page（またはデータ取得の箇所）で行う（layout は画面を移動しても再実行されないため）
  - `api/[[...route]]/route.ts` — API は Hono に全て委譲する（ここにロジックを書かない）
  - ルートグループ `(group)` は URL に含まれない。新しい画面は上のどちらかに置く
- `src/features/<feature>/` — 機能ごとの UI とクライアント側のロジック。`<feature>` は `src/server` の機能名と合わせる（例: `auth`, `users`）
  - `components/` — その機能の React コンポーネント
  - `hooks/` など — 必要になったら作る
- `src/components/ui/` — 特定の機能に依存しない共通 UI（ボタン、ダイアログなど）
- `src/lib/` — クライアント側で共通に使う設定やユーティリティ（例: `auth-client.ts`）

依存の向き: app → features → components / lib

- `features/` 同士はなるべく import し合わない。複数の機能で使うものは `components/ui/` か `lib/` に移す
- `app/` 以外から `@/server` と `@/db` の実装を import しない。型だけなら `import type` で読み込んでよい（Hono RPC の `AppType` など）
- `app/` の Server Component からは `@/server` の関数（例: `getLoginState`）を呼んでよい
- 上のルールは ESLint（`eslint.config.mjs` の `no-restricted-imports`）で検査している

### バックエンド

- `src/server/` — バックエンド（レイヤードアーキテクチャ）。機能ごとに `<layer>/<feature>/` に置く（presentation のみ例外）。`<feature>` は複数形（例: `users`）
  - `presentation/` — Hono のルーティング、リクエストの検証（zod）、レスポンスの整形
    - `app.ts` — Hono アプリ本体（`basePath("/api")`）。各機能のルートをここでマウントする
    - `routes/<feature>.ts` — 機能ごとのルート定義。他の層と違い、機能ごとのディレクトリは切らない
  - `application/` — ユースケース
  - `domain/` — エンティティとビジネスルール。他の層や外部ライブラリに依存しない
  - `infrastructure/` — DB アクセスなど、domain が定義したインターフェースの実装
- `src/db/` — Drizzle の schema と DB クライアント（server-only）。import してよいのは `infrastructure/` からのみ

依存の向き: presentation → application → domain ← infrastructure

## コミット

- 作業をひとつのコミットにまとめない。意味のある単位（パッケージ追加、スキーマ変更、機能追加など）ごとに分けてコミットする
- 履歴を読めば何をやったかが追えるようにする
- メッセージは日本語。1行目に何をしたかを書き、必要なら空行のあとに理由や補足を書く

