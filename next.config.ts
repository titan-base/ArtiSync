import type { NextConfig } from "next";

const enableDockerPolling =
  process.env.DOCKER_DEV_POLLING === "true" &&
  process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  watchOptions: enableDockerPolling
    ? { pollIntervalMs: 1000 }
    : undefined,

  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
