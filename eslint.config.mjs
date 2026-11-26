import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // フロントの部品からは server と db の実装を import しない（型だけは可）。
  {
    files: ["src/features/**", "src/components/**", "src/lib/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/server", "@/server/*", "@/db", "@/db/*"],
            allowTypeImports: true,
            message: "フロントの部品からは server/db の実装を import しない。型は import type で読み込む。",
          },
          {
            group: ["@/app", "@/app/*"],
            message: "app はルーティング専用。共通の部品は features/components/lib に置く。",
          },
        ],
      }],
    },
  },
  // 共通の UI は特定の機能に依存しない。
  {
    files: ["src/components/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": ["error", {
        patterns: [
          { group: ["@/server", "@/server/*", "@/db", "@/db/*"], allowTypeImports: true },
          { group: ["@/app", "@/app/*", "@/features", "@/features/*"], message: "components/ui は features に依存しない。" },
        ],
      }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
