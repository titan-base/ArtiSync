import "server-only";

import { resolveLoginState } from "./application/auth/auth";
import { auth, enabledProviders } from "./infrastructure/auth/auth";
import { createApp } from "./presentation/app";

// API のルーティングと Better Auth の実装を結び付ける。
export const app = createApp(auth.handler);
export { enabledProviders };

// ログイン状態の判定に Better Auth の確認処理を渡す。
export function getLoginState(headers: Headers) {
  return resolveLoginState({
    hasSession: async () => Boolean(await auth.api.getSession({ headers })),
    hasPasskey: async () => (await auth.api.listPasskeys({ headers })).length > 0,
  });
}
