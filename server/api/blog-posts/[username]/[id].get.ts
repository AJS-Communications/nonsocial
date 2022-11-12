export default defineEventHandler(async (event) => {
  const blogPosts = await $fetch(`/api/blog-posts/${event.context.params.username}`)
  return blogPosts.items.find(i => i.id === parseInt(event.context.params.id))
})