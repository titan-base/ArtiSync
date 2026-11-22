import { Hono } from "hono";

// 認証 API への GET・POST などを、注入されたハンドラーに委譲する。
export function createAuthRoutes(handleAuth: (request: Request) => Promise<Response>) {
  return new Hono().all("/*", (c) => handleAuth(c.req.raw));
}
