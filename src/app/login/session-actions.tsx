"use client";

import { useState } from "react";
import { authClient } from "./auth-client";

const socialProviders = [
  { id: "google", name: "Google" },
  { id: "github", name: "GitHub" },
] as const;

type Provider = typeof socialProviders[number]["id"];

// ログインと新規登録で OAuth ボタンを共有する。
export function AuthForm({ providers, oauthFailed, mode }: {
  providers: Record<Provider, boolean>;
  oauthFailed: boolean;
  mode: "login" | "register";
}) {
  const isRegistration = mode === "register";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(oauthFailed ? "認証を完了できませんでした。もう一度お試しください。" : "");

  async function signIn(method: Provider | "passkey") {
    setBusy(true);
    setError("");
    try {
      if (method === "passkey") {
        const result = await authClient.signIn.passkey();
        if (result.error || !result.data) throw new Error("Passkey sign-in failed");
        window.location.replace("/");
        return;
      }

      const result = await authClient.signIn.social({
        provider: method,
        callbackURL: "/login",
        errorCallbackURL: isRegistration ? "/register" : "/login",
        requestSignUp: isRegistration,
      });
      if (result.error || !result.data) throw new Error("OAuth sign-in failed");
    } catch {
      setError(method === "passkey"
        ? "パスキーでログインできませんでした。登録済みのパスキーを選ぶか、Google・GitHubでお試しください。"
                : isRegistration
          ? "新規登録を開始できませんでした。もう一度お試しください。"
          : "ログインを開始できませんでした。もう一度お試しください。");
      setBusy(false);
    }
  }

  return (
    <div className="actions">
      {socialProviders.map(({ id, name }) => (
        <button key={id} type="button" disabled={busy || !providers[id]} onClick={() => void signIn(id)}>
          {name}で続ける{providers[id] ? "" : "（未設定）"}
        </button>
      ))}
      {!isRegistration && (
        <button type="button" className="secondary" disabled={busy} onClick={() => void signIn("passkey")}>
          パスキーでログイン
        </button>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
