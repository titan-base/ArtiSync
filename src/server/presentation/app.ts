import { Hono } from "hono";
import { createAuthRoutes } from "./routes/auth";

// 共通の API プレフィックスと機能別ルートを設定する。
export function createApp(handleAuth: (request: Request) => Promise<Response>) {
  const app = new Hono().basePath("/api");

  app.get("/health", (c) => c.json({ status: "ok" }));
  app.route("/auth", createAuthRoutes(handleAuth));
  return app;
}
