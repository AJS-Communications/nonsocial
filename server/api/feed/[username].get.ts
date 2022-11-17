export default defineEventHandler(async (event) => {
  const blogPosts = await $fetch(`/api/blog-posts/${event.context.params.username}`)
  const statusUpdates = await $fetch(`/api/status-updates/${event.context.params.username}`)
  return [...blogPosts, ...statusUpdates].sort((a, b) => {
    return  new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf()
  })
})