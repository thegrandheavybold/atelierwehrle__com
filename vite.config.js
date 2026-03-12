import { defineConfig } from "vite";

const netlifyDevTarget = process.env.NETLIFY_DEV_TARGET || "http://localhost:8888";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/",
    appType: "custom",
    server: {
      host: true,
      strictPort: true,
      proxy: {
        "/.netlify": {
          target: netlifyDevTarget,
          changeOrigin: true,
        },
        "/assets/img": {
          target: netlifyDevTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        "/.netlify": {
          target: netlifyDevTarget,
          changeOrigin: true,
        },
        "/assets/img": {
          target: netlifyDevTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "src/_generated",
      emptyOutDir: true,
      manifest: "manifest.json",
      sourcemap: isDev,
      minify: isDev ? false : "esbuild",
      assetsDir: "assets/build",
      rollupOptions: {
        input: {
          main: "src/js/main.js",
        },
        output: {
          entryFileNames: "assets/build/[name]-[hash].js",
          chunkFileNames: "assets/build/[name]-[hash].js",
          assetFileNames: "assets/build/[name]-[hash][extname]",
        },
      },
    },
  };
});
