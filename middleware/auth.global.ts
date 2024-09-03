export default defineNuxtRouteMiddleware(async (to) => {
  const {
    $auth: {
      isAuthenticated,
      refreshUser
    }
  } = useNuxtApp()

  await refreshUser()

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  } else if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})