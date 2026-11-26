import type { ReactNode } from "react";
import "./auth.css";

// ログイン画面と新規登録画面に中央揃えと背景を適用する。
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="login-screen">{children}</div>;
}
