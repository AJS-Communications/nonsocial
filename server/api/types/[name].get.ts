export default defineEventHandler(async (event) => {
  const types = await $fetch(`/api/types/`)
  return types.find(i => i.name === event.context.params.name)
})