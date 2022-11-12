export default defineEventHandler(async (event) => {
  const statusUpdates = await $fetch(`/api/status-updates/${event.context.params.username}`)
  return statusUpdates.items.find(i => i.id === parseInt(event.context.params.id))
})