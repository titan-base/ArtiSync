"use client";

import { useState } from "react";
import { authClient } from "./auth-client";

// ログイン中のユーザーのアカウントにパスキーを追加する。
export function PasskeyRegistration() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [needsReauthentication, setNeedsReauthentication] = useState(false);

  // 古いセッションを終了して OAuth のログイン画面に戻る。
  async function restartLogin() {
    setBusy(true);
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error("Sign-out failed");

      window.location.replace("/login");
    } catch {
      setMessage("ログイン画面に戻れませんでした。もう一度お試しください。");
      setBusy(false);
    }
  }

  async function register() {
    setBusy(true);
    setMessage("");
    try {
      const result = await authClient.passkey.addPasskey();
      const error = result.error;
      const isStaleSession = error && "code" in error && error.code === "SESSION_NOT_FRESH";
      if (isStaleSession || error?.status === 401) {
        setNeedsReauthentication(true);
        setMessage("パスキーを登録するには、Google または GitHub で再認証してください。");
        return;
      }

      if (result.error || !result.data) throw new Error("Passkey registration failed");

      // ホームへのリクエストで登録済みの状態をサーバーが確認する。
      window.location.replace("/");
    } catch {
      setMessage("パスキーを登録できませんでした。もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        className="rounded-md border px-4 py-2 disabled:opacity-60"
        disabled={busy}
        onClick={needsReauthentication ? restartLogin : register}
      >
        {busy ? "処理中…" : needsReauthentication ? "ログイン画面に戻る" : "パスキーを登録"}
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
