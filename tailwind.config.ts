import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',
        ms: '430px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      colors: {
        background: {
          screen: '#F3F4F6',
          button: '#F9FAFB',
          bord: '#E5E7EB',
        },
        text: {
          main: '#111827',
          subtext: '#6B7280',
        },
        fonts: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px',
          '2xl': '24px',
          '3xl': '30px',
          '4xl': '36px',
        },

      },
    },
  },
  plugins: []
}

export default config
