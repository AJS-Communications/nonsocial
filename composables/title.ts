export const useTitle = () => {
  const title = useState('title', () => '')
  useHead({
    title: computed(() => title.value)
  })
  return title
}