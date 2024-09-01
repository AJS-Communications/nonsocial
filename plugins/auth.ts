export default defineNuxtPlugin(async () => {
  const isAuthenticated = useState('isAuthenticated', () => false)

  const { data: user, refresh: refreshUser } = await useFetch<User>('/api/auth/user')

  if (user.value) {
    isAuthenticated.value = true
  }

  const login = async (username: string, password: string) => {
    const data = await $fetch('/api/auth/login', {
      method: 'post',
      body: { username, password }
    })

    if (data) {
      isAuthenticated.value = true
      await refreshUser()
    }
  }

  const register = async (username: string, email: string, password: string) => {
    return await $fetch('/api/auth/register', {
      method: 'post',
      body: { username, email, password }
    })
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'post'
    })
    isAuthenticated.value = false
    user.value = null
    await navigateTo('/login')
  }

  return {
    provide: {
      auth: {
        isAuthenticated,
        user,
        refreshUser,
        login,
        register,
        logout
      }
    }
  }
})