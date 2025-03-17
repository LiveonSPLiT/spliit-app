import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from './lib/locale'

export const locales = [
  'en-US',
  'hi-IN',
  'mr-IN',
  'gu-IN',
  'pa-IN',
  'zh-CN',
  'ko-KR',
  'ja-JP',
  'ru-RU',
  'id-ID',
] as const
export type Locale = (typeof locales)[number]
export type Locales = ReadonlyArray<Locale>
export const defaultLocale: Locale = 'en-US'

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) ?? defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
