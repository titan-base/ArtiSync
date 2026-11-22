import { app } from "@/server/bootstrap";

// Next.js が受け取った API リクエストを Hono に渡す。
const handler = (req: Request) => app.fetch(req);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
