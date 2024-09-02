export default defineNuxtRouteMiddleware(async (to, from) => {
  const {
    $auth: {
      isAuthenticated
    }
  } = useNuxtApp()

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  } else if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})