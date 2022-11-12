export default defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      name: 'statusUpdate',
      route: '/status-updates',
      title: 'Status Update'
    },
    {
      id: 2,
      name: 'blogPost',
      route: '/blog-posts',
      title: 'Blog Post'
    }
  ]
})