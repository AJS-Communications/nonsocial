export default defineEventHandler(async (event) => {
  setHeader(event, 'Authorization', '')
  deleteCookie(event, 'refresh-token')
  deleteCookie(event, 'token')
  event.context.auth = null
  return { message: 'Logout successful' }
})