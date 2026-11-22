import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { enabledProviders, getLoginState } from "@/server/bootstrap";
import { LoginForm } from "./session-actions";
import { PasskeyRegistration } from "./passkey-registration";

// セッションとパスキーの登録状況を確認してから画面を表示する。
export const instant = false;

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const loginState = await getLoginState(await headers());
  if (loginState === "ready") redirect("/");

  if (loginState === "passkey-required") {
    return (
      <main className="card" aria-labelledby="passkey-title">
        <h1 id="passkey-title">パスキーを登録</h1>
        <p className="hint">パスキーを登録すると、次回からパスキーでログインできます。</p>
        <PasskeyRegistration />
      </main>
    );
  }

  const query = await searchParams;
  return (
    <main className="card" aria-labelledby="login-title">
      <h1 id="login-title">ログイン</h1>
      <LoginForm providers={enabledProviders} oauthFailed={Boolean(query.error)} />
      <p className="hint">初めての方は Google または GitHub で認証してから、パスキーを登録してください。</p>
    </main>
  );
}
