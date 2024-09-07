export const handlePostClick = async (item: Post, event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    await navigateTo(`/posts/${item.id}`)
  }
}