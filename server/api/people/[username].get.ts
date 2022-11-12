export default defineEventHandler(async (event) => {
  const people = await $fetch(`/api/people/`)
  return people.find(i => i.username === event.context.params.username)
})