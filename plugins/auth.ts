export default defineNuxtPlugin(() => {
  const { user } = useUser()

  addRouteMiddleware('global-auth', (to, from) => {
    if (!user.value && to.name !== 'login') {
      const redirectUrl = useCookie('redirect-url', { secure: true })
      redirectUrl.value = to.fullPath
      return navigateTo('/login')
    }
  }, { global: true })
})