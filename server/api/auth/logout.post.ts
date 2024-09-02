export default defineEventHandler(async (event) => {
  event.context.auth = null
  deleteCookie(event, 'token')
  return { message: 'Logged out successfully' }
})