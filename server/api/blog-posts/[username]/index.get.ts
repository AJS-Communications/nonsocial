export default defineEventHandler(async (event) => {
  const user = await $fetch(`/api/people/${event.context.params.username}`)
  const type = await $fetch('/api/types/blogPost')
  return {
    types: 'Blog Posts',
    items: [
      {
        id: 1,
        title: 'How to use the Helix for a one-man band',
        description: 'In this post, you will learn how to use the Helix to build complex routes.',
        createdDate: new Date('2021-01-26'),
        user,
        type
      },
      {
        id: 2,
        title: 'Another day, another election',
        description: 'This election cycle was absolutely terrifying, for multiple reasons.',
        createdDate: new Date('2022-04-20'),
        user,
        type
      },
      {
        id: 3,
        title: 'My favorite Beatles song',
        description: 'Today, we will be going over my favorite Beatles song of all time.',
        createdDate: new Date('2020-03-02'),
        user,
        type
      },
      {
        id: 4,
        title: 'Seriously, Frasier is a TV gold',
        description: 'It has been years since Frasier has gone of the air, yet, it is still as relevant as ever.',
        createdDate: new Date('2019-11-13'),
        user,
        type
      },
      {
        id: 5,
        title: 'Working... ah, what a thing',
        description: 'You gotta wonder how morons like Elon Musk wind up with all the money.',
        createdDate: new Date('2019-11-13'),
        user,
        type
      }
    ].sort((a, b) => {
      return  new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf()
    })
  }
})