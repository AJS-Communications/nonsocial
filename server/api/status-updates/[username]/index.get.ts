export default defineEventHandler(async (event) => {
  const user = await $fetch(`/api/people/${event.context.params.username}`)
  const type = await $fetch('/api/types/statusUpdate')
  return {
    types: 'Status Updates',
    items: [
      {
        id: 1,
        title: null,
        description: 'My first status update!',
        createdDate: new Date('2021-03-01'),
        user,
        type
      },
      {
        id: 2,
        title: null,
        description: 'Today was a pretty good day. Got to spend it with the family.',
        createdDate: new Date('2022-07-09'),
        user,
        type
      },
      {
        id: 3,
        title: null,
        description: 'Here comes another long day at the office.',
        createdDate: new Date('2018-04-23'),
        user,
        type
      },
      {
        id: 4,
        title: null,
        description: 'Man, I love Frasier.',
        createdDate: new Date('2020-06-13'),
        user,
        type
      },
      {
        id: 5,
        title: null,
        description: 'The new Star Trek series is pretty good. Viva la Pike.',
        createdDate: new Date('2021-05-08'),
        user,
        type
      },
    ].sort((a, b) => {
      return  new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf()
    })
  }
})