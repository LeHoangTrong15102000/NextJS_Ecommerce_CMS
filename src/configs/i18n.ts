import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)
  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    lng: 'vi',
    backend: {
      /* translation file path */
      loadPath: '/locales/{{lng}}.json'
    },
    fallbackLng: 'vi',
    debug: false,
    keySeparator: false, // khi mà để là false thì nó sẽ phân biệt a.b và a/b cho chúng ta
    react: {
      useSuspense: false // Nó sẽ giữ cho cái hành động bất đồng bộ(xử lý cái hành động bất đồng bộ đó khi mà thay ngôn ngữ) đó khi mà translate ngôn ngữ
    },
    interpolation: {
      escapeValue: false, // <strong>lạptrinhthatde</strong> trình biên dịch sẽ hiểu là một HTML còn nếu để là true thì nó sẽ hiểu là một cái key
      formatSeparator: ',' // 100000 -> format theo 100,000 thì nó sẽ hiểu
    }
  })

export default i18n

export const LANGUAGE_OPTIONS = [
  {
    language: 'Tiếng Việt',
    value: 'vi'
  },
  {
    language: 'English',
    value: 'en'
  }
]
