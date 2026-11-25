import { bigint, boolean, index, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// テスト用ユーザーテーブル。
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Better Auth が管理するユーザー。
export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ログイン状態と有効期限。
export const session = pgTable("session", {
  id: text().primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (table) => [index("session_user_id_idx").on(table.userId)]);

// Google・GitHub のアカウントと認証ユーザーの紐付け。
export const account = pgTable("account", {
  id: text().primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text(),
  password: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("account_user_id_idx").on(table.userId),
  uniqueIndex("account_provider_identity_idx").on(table.providerId, table.accountId),
]);

// 認証処理で使う期限付きの検証データ。
export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);

// 登録されたパスキーの公開鍵と認証器情報。
export const passkey = pgTable("passkey", {
  id: text().primaryKey(),
  name: text(),
  publicKey: text("public_key").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credential_id").notNull().unique(),
  // WebAuthn の符号なし 32 ビット値を number のまま保存する。
  counter: bigint({ mode: "number" }).notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text(),
  createdAt: timestamp("created_at"),
  aaguid: text(),
}, (table) => [index("passkey_user_id_idx").on(table.userId)]);
