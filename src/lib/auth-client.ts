import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";

// ログインとパスキー登録で共通のブラウザ用クライアント。
export const authClient = createAuthClient({
  plugins: [passkeyClient()],
  // 同じ画面を開き続けた場合も、期限の更新が必要か定期的に確かめる。
  sessionOptions: { refetchInterval: 60 * 60 },
});
