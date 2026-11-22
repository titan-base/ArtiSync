import type { ReactNode } from "react";
import "./login.css";

// ログイン画面にだけ中央揃えと背景を適用する。
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div className="login-screen">{children}</div>;
}
