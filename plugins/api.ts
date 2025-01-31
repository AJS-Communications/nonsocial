export default defineNuxtPlugin({
  name: 'api',
  async setup (nuxtApp) {
    const token = useCookie('token')

    const $api = $fetch.create({
      retry: 1,
      async onRequest({ options }) {
        if (token.value) {
          const headers = options.headers ||= {} as Headers
          if (Array.isArray(headers)) {
            headers.push(['Authorization', `Bearer ${token.value}`])
          } else {
            headers.set('Authorization', `Bearer ${token.value}`)
          }
        }
      },
      async onResponse(context) {
        if (context.response.status === 401) {
          await nuxtApp.runWithContext(() => useNuxtApp().$auth.logout())
        }
      }
    })

    return {
      provide: {
        api: $api
      }
    }
  }
})