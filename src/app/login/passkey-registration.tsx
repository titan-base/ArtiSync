"use client";

import { useState } from "react";
import { authClient } from "./auth-client";

// ログイン中のユーザーのアカウントにパスキーを追加する。
export function PasskeyRegistration() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function register() {
    setBusy(true);
    setMessage("");
    try {
      const result = await authClient.passkey.addPasskey();
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
        onClick={() => void register()}
      >
        {busy ? "登録中…" : "パスキーを登録"}
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
