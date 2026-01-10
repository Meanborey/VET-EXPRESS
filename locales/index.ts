import en from './En/index'
import cn from './Cn/index'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    cn
  }
}))
