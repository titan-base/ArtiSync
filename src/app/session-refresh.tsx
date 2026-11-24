"use client";

import { authClient } from "./login/auth-client";

// Better Auth が必要に応じてブラウザからセッションを更新する。
export function SessionRefresh() {
  authClient.useSession();
  return null;
}
