import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  devtools: { enabled: false },

  devServer: { port: Number(process.env.APP_PORT || 3000), host: '0.0.0.0' },
  modules: ['@pinia/nuxt'],
  css: ['~/index.css'],
  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(process.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1'),
    },
  },
  runtimeConfig: {
    public: {
      appPort: process.env.APP_PORT || '3000',
      delcomBaseUrl: process.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1',
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'cache-control': 'public, max-age=0, must-revalidate',
      },
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
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
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
    },
  },
})
