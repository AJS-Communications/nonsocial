export default defineNuxtPlugin(() => {
  const { user } = useUser()

  addRouteMiddleware('global-auth', (to, from) => {
    if (!user.value && to.name !== 'login') {
      return navigateTo('/login')
    }
  }, { global: true })
})