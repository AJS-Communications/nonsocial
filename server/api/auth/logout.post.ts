export default defineEventHandler(async (event) => {
  event.context.auth = null
  deleteCookie(event, 'auth_token')
  return { message: 'Logged out successfully' }
})