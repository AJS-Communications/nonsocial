// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    JWT_SECRET: process.env.JWT_SECRET,
    WEBAUTHN_NAME: process.env.WEBAUTHN_NAME,
    WEBAUTHN_ORIGIN: process.env.WEBAUTHN_ORIGIN,
    WEBAUTHN_RPID: process.env.WEBAUTHN_RPID
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-security'
  ],
  compatibilityDate: '2024-08-30'
})