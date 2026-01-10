// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'cn', file: 'cn.json', name: '中文' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales'
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
