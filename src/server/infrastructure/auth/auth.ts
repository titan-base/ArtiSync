import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { db } from "@/db";

function oauthCredentials(clientId?: string, clientSecret?: string) {
  return clientId && clientSecret ? { clientId, clientSecret, disableImplicitSignUp: true } : undefined;
}

// 認証情報が揃っているプロバイダーだけ有効にする。
const google = oauthCredentials(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
const github = oauthCredentials(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET);
export const enabledProviders = { google: Boolean(google), github: Boolean(github) };
// Drizzle にセッション、OAuth アカウント、パスキーを保存する。
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  // 描画時の GET は読み取りにし、更新は Cookie を受け取れるクライアントに任せる。
  session: { deferSessionRefresh: true },
  emailAndPassword: { enabled: false },
  socialProviders: {
    ...(google ? { google } : {}),
    ...(github ? { github } : {}),
  },
  // ユーザー名を入力せずに見つけられるパスキーを登録する。
  plugins: [passkey({
    rpName: "ArtiSync",
    authenticatorSelection: { residentKey: "required" },
  })],
});
