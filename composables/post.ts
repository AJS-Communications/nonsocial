export const usePost = () => {
  const { user, updateUser } = useUser()

  const isBookmark = (postId: number) => {
    if (!user.value) return false
    return user.value.bookmarks.filter(i => i.postId === postId).length > 0
  }

  const isLike = (postId: number) => {
    if (!user.value) return false
    return user.value.likes.filter(i => i.postId === postId).length > 0
  }

  const isBoost = (postId: number) => {
    if (!user.value) return false
    return user.value.boosts.filter(i => i.postId === postId).length > 0
  }

  const createdDate = (dateString: Date, type: 'short' | 'long' = 'short') => {
    const date = new Date(dateString)
    if (type === 'long') {
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    } else {
      const seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000)
      if(Math.round(seconds/(60*60*24*365.25)) >= 2) return new Intl.DateTimeFormat('en-US').format(date)
      else if(Math.round(seconds/(60*60*24*30.4)) >= 2) return new Intl.DateTimeFormat('en-US').format(date)
      else if(Math.round(seconds/(60*60*24*7)) >= 2) return new Intl.DateTimeFormat('en-US').format(date)
      else if(Math.round(seconds/(60*60*24)) >= 2) return Math.round(seconds/(60*60*24)) + "d"
      else if(Math.round(seconds/(60*60)) >= 2) return Math.round(seconds/(60*60)) + "h"
      else if(Math.round(seconds/60) >= 2) return Math.round(seconds/60) + "m"
      else return 'Just now'
    }
  }

  const share = async (postId: number) => {
    const url = `${window.location.protocol}//${window.location.host}/posts/${postId}`
    if (!navigator.canShare()) {
      try {
        await navigator.share({
          title: 'Check this out!',
          text: 'Take a look at this post that I found.',
          url
        })
      } catch (e) {}
    } else {
      window.location.href = `mailto:?subject=Check this out!&body=Take a look at this post that I found: ${url}`
    }
  }

  const bookmark = async (postId: number) => {
    if (!user.value) return
  
    if (isBookmark(postId)) {
      const bookmark = user.value.bookmarks.find(i => i.postId === postId)
      await useFetch(`/api/users/${user.value.id}/bookmarks`, {
        method: 'delete',
        body: {
          id: bookmark && bookmark.id
        }
      })
    } else {
      await useFetch(`/api/users/${user.value.id}/bookmarks`, {
        method: 'post',
        body: {
          postId: postId
        }
      })
    }
    await updateUser()
  }
  
  const like = async (postId: number) => {
    if (!user.value) return
  
    if (isLike(postId)) {
      const like = user.value.likes.find(i => i.postId ===  postId)
      await useFetch(`/api/users/${user.value.id}/likes`, {
        method: 'delete',
        body: {
          id: like && like.id
        }
      })
    } else {
      await useFetch(`/api/users/${user.value.id}/likes`, {
        method: 'post',
        body: {
          postId: postId
        }
      })
    }
    await updateUser()
  }

  const boost = async (postId: number) => {
    if (!user.value) return
  
    if (isBoost(postId)) {
      const boost = user.value.boosts.find(i => i.postId ===  postId)
      await useFetch(`/api/users/${user.value.id}/boosts`, {
        method: 'delete',
        body: {
          id: boost && boost.id
        }
      })
    } else {
      await useFetch(`/api/users/${user.value.id}/boosts`, {
        method: 'post',
        body: {
          postId: postId
        }
      })
    }
    await updateUser()
  }

  return {
    isBookmark,
    isLike,
    isBoost,
    createdDate,
    share,
    bookmark,
    like,
    boost
  }
}