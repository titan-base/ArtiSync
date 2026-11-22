import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";

// ログインとパスキー登録で共通のブラウザ用クライアント。
export const authClient = createAuthClient({ plugins: [passkeyClient()] });
