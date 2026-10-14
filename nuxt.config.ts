import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { deferNuxtCss } from "./server/utils/deferCss";

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000;

// Browser memanggil API lewat proxy same-origin (server/api/delcom/[...path].ts).
// Set VITE_DELCOM_DIRECT=true (lalu build ulang) untuk memanggil Delcom langsung.
const delcomBaseUrl = process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
const useDirectApi = process.env.VITE_DELCOM_DIRECT === "true";

const htmlCache = { headers: { "cache-control": "public, max-age=0, must-revalidate" } };

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  telemetry: false,
  // SPA mode (client-side routing & localStorage)
  ssr: false,
  // Nuxt membaca source dari src/
  srcDir: "src/",
  // Aktifkan vue-router; rute disediakan oleh src/router.options.ts
  pages: true,
  // Tanpa app manifest: tidak ada fetch runtime ke /_nuxt/builds/meta/*.json
  experimental: { appManifest: false },
  css: ["~/index.css"],
  modules: ["@pinia/nuxt"],
  hooks: {
    // Pakai src/app.vue langsung sebagai root component (tanpa nuxt-root bawaan)
    "app:resolve"(app) {
      app.rootComponent = fileURLToPath(new URL("./src/app.vue", import.meta.url));
    },
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(useDirectApi ? delcomBaseUrl : "/api/delcom"),
      DELCOM_ORIGIN: JSON.stringify(new URL(delcomBaseUrl).origin),
    },
  },
  devServer: { port: customPort },
  // HTML tidak boleh "no-store" agar halaman bisa dipulihkan dari back/forward cache (bfcache).
  routeRules: {
    "/": htmlCache,
    "/auth/**": htmlCache,
    "/cash-flows/**": htmlCache,
    "/profile": htmlCache,
    "/users": htmlCache,
    "/api/**": { headers: { "cache-control": "private, no-cache" } },
    "/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
  },
  nitro: {
    hooks: {
      // Untuk HTML yang di-prerender saat build (200.html / index.html)
      "prerender:generate"(route) {
        if (typeof route.contents === "string" && route.fileName?.endsWith(".html")) {
          route.contents = deferNuxtCss(route.contents);
        }
      },
    },
    // Paksa runtime Nuxt digabung (inline) ke build server
    externals: {
      inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/, /[\\/]node_modules[\\/]@nuxt[\\/]/, "nuxt/dist", "@nuxt/"],
    },
  },
  app: {
    head: {
      title: "Delcom Cash Flow",
      htmlAttrs: { lang: "id" },
      meta: [
        {
          name: "description",
          content:
            "Delcom Cash Flow: aplikasi pencatat arus kas pribadi untuk memantau pemasukan, pengeluaran, tabungan, dan pinjaman.",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      ],
      // CSS kritis minimal agar tidak ada flash putih sebelum stylesheet utama aktif
      style: [{ innerHTML: "body{background-color:#f8fafc;color:#0f172a}" }],
      bodyAttrs: { class: "bg-slate-50 text-slate-900 font-sans antialiased min-h-screen" },
    },
  },
});