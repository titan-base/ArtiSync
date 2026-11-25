import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { enabledProviders, getLoginState } from "@/server/bootstrap";
import { AuthForm } from "../login/session-actions";
import "../login/login.css";

export const instant = false;

// 新規アカウントは OAuth で作成し、初回認証後はパスキー登録へ進む。
export default async function RegisterPage({ searchParams }: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const loginState = await getLoginState(await headers());
  if (loginState === "ready") redirect("/");
  if (loginState === "passkey-required") redirect("/login");

  const query = await searchParams;
  return (
    <div className="login-screen">
      <main className="card" aria-labelledby="register-title">
        <h1 id="register-title">新規登録</h1>
        <AuthForm mode="register" providers={enabledProviders} oauthFailed={Boolean(query.error)} />
        <p className="hint">アカウントをお持ちの方は <Link href="/login">ログイン</Link></p>
      </main>
    </div>
  );
}
