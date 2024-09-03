export default defineNuxtRouteMiddleware(async (to) => {
  const {
    $auth: {
      isAuthenticated,
      refreshUser
    }
  } = useNuxtApp()

  const token = useCookie('token')

  if (token.value) {
    await refreshUser()
  }

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  } else if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})