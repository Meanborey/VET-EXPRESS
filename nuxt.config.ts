// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],

  // Step 2: runtimeConfig - reads from .env
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://qacltom.udaya-tech.com/vetTkWBusApi',
      apiToken: process.env.NUXT_PUBLIC_API_TOKEN || 'ade765b5-0644-47df-90fb-fc91b89b3dba'
    }
  },

  i18n: {
    locales: [
      { code: 'en', file: 'En/index.ts', name: 'English' },
      { code: 'cn', file: 'Cn/index.ts', name: '中文' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: './locales/'
  },
  typescript: {
    typeCheck: false
  },
  app: {
    head: {
      title: 'Vireak Buntham Express',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/vireak-buntham (1).ico' }
      ],
      meta: [
        { name: 'description', content: 'Vireak Buntham Express - Your trusted travel partner' }
      ]
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
