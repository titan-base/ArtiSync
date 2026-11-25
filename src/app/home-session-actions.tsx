"use client";

import { useState } from "react";
import { authClient } from "./login/auth-client";

// ホーム画面でセッションを更新し、ログアウト操作を受け付ける。
export function HomeSessionActions() {
  authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function signOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error("Sign-out failed");

      window.location.replace("/login");
    } catch {
      setErrorMessage("ログアウトできませんでした。もう一度お試しください。");
      setIsSigningOut(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="cursor-pointer rounded-md border px-4 py-2 font-medium disabled:cursor-default disabled:opacity-60"
        disabled={isSigningOut}
        onClick={() => void signOut()}
      >
        {isSigningOut ? "ログアウト中…" : "ログアウト"}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}
