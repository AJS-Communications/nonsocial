export default defineNuxtPlugin({
  name: 'user',
  dependsOn: ['api', 'auth'],
  async setup () {
    const { $api, $auth: { user, refreshUser } } = useNuxtApp()

    const isFollowing = (userId: string) => {
      if (!user.value) return false
      return user.value.following.filter(i => i.followerId === userId).length > 0
    }

    const follow = async (userId: string): Promise<Post | undefined> => {
      if (!user.value) return
    
      if (isFollowing(userId)) {
        const person = user.value.following.find(i => i.followerId === userId)
        await $api(`/api/users/${user.value.id}/following`, {
          method: 'delete',
          body: {
            id: person && person.id
          }
        })
      } else {
        await $api(`/api/users/${user.value.id}/following`, {
          method: 'post',
          body: {
            id: userId
          }
        })
      }
      await refreshUser()
    }

    return {
      provide: {
        user: {
          isFollowing,
          follow
        }
      }
    }
  }
})
