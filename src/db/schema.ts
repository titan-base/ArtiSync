import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

//テスト用テーブル
export const users = pgTable("users",{
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createAt: timestamp("created_at").defaultNow().notNull(),
});