# deps: ソースをコピーする前に依存パッケージを入れ、ソースだけの変更ではこの層を再利用する。
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# migrate: Drizzle Kit で未適用の SQL を実行し、終了コードを Compose に返す。
FROM deps AS migrate
COPY drizzle.prod.config.ts ./
COPY drizzle/ ./drizzle/
USER node
CMD ["npm", "run", "db:migrate", "--", "--config=drizzle.prod.config.ts"]

# builder: deps の /app とインストール済みパッケージを引き継ぎ、Next.js をビルドする。
FROM deps AS builder
COPY . .
RUN npm run build

# runner: 新しい Node.js イメージに、実行に必要なビルド成果物だけをコピーする。
FROM node:24-alpine AS runner
WORKDIR /app
# コンテナ内の全ネットワークインターフェースで 3000 番を待ち受ける。
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# standalone には server.js と実行時の依存パッケージが入る。静的ファイルと public は別途コピーする。
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 一般ユーザー node で起動する。ホスト側へのポート公開は Compose で設定する。
USER node
EXPOSE 3000
CMD ["node", "server.js"]
