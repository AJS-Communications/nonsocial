// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    JWT_SECRET: process.env.JWT_SECRET,
    WEBAUTHN_NAME: process.env.WEBAUTHN_NAME,
    WEBAUTHN_ORIGIN: process.env.WEBAUTHN_ORIGIN,
    WEBAUTHN_RPID: process.env.WEBAUTHN_RPID,
    public: {
      APP_TITLE: process.env.APP_TITLE,
      APP_TITLE_SHORT: process.env.APP_TITLE_SHORT,
      APP_META_DESCRIPTION: process.env.APP_META_DESCRIPTION,
      RESULTS_PER_PAGE: process.env.RESULTS_PER_PAGE
    }
  },
  modules: [
    '@nuxtjs/robots',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-security'
  ],
  compatibilityDate: '2024-08-30'
})