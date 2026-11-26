import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import "server-only";

type Db = ReturnType<typeof drizzle<typeof schema>>;

// 開発時はHMRでモジュールが再評価されるたびにコネクションプールが増えるため、globalThisに保持して使い回す
const globalForDb = globalThis as unknown as { db?: Db };

export const db: Db = globalForDb.db ?? drizzle(process.env.DATABASE_URL!, { schema });

if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
}
