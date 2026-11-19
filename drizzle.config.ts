import { defineConfig } from "drizzle-kit";

// ホストから実行するので .env を読み込む（${VAR} の展開は Docker Compose しか行わないため、ここでURLを組み立てる）
try {
    process.loadEnvFile(".env");
} catch {}

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT = "5432" } = process.env;

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: `postgresql://${encodeURIComponent(POSTGRES_USER!)}:${encodeURIComponent(POSTGRES_PASSWORD!)}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}`,
    },
});
