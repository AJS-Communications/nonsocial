export const useUser = () => {
  const user = useState<User | null>('user', () => null)

  return {
    user,
    updateUser: async () => {
      if (!user.value) return
      user.value = await $fetch<User>(`/api/users/${user.value.id}`)
    }
  }
}