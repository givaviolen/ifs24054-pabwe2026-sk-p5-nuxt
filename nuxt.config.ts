import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { deferNuxtCss } from './server/utils/deferCss'

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  srcDir: 'src/',
  ssr: false,
  devtools: { enabled: false },
  telemetry: false,
  pages: true,
  devServer: { port: customPort, host: '0.0.0.0' },
  modules: ['@pinia/nuxt'],
  css: ['~/index.css'],
  hooks: {
    'app:resolve'(app) {
      app.rootComponent = fileURLToPath(new URL('./src/app.vue', import.meta.url))
    },
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(process.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1'),
    },
  },
  runtimeConfig: {
    public: {
      appPort: String(customPort),
      delcomBaseUrl: process.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1',
    },
  },
  routeRules: {
    '/': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
    '/login': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
    '/auth/**': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
    '/cash-flows/**': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
    '/profile': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
    '/users': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  nitro: {
    devPort: customPort,
    hooks: {
      // Untuk HTML yang di-prerender saat build (200.html / index.html)
      'prerender:generate'(route) {
        if (typeof route.contents === 'string' && route.fileName?.endsWith('.html')) {
          route.contents = deferNuxtCss(route.contents)
        }
      },
    },
    externals: {
      inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/, /[\\/]node_modules[\\/]@nuxt[\\/]/, 'nuxt/dist', '@nuxt/'],
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      title: 'Delcom Cash Flow',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi pencatatan arus kas Delcom.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
          media: 'print',
          onload: "this.media='all'",
        },
      ],
      noscript: [
        {
          children: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">',
        },
      ],
      style: [{ children: 'body{background-color:#f8fafc;color:#0f172a}' }],
    },
  },
})
