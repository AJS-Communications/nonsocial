export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = await useAuth()
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})