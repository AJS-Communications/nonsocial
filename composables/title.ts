export const useTitle = () => {
  const title = useState('title', () => '')
  watch(title, () => {
    useHead({
      title: title.value
    })
  })
  return title
}