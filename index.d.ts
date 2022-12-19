interface User {
  id: number
  username: string
  name: string
  photoUrl: string
  bookmarks: [Bookmark]
  likes: [Like]
  boosts: [Boost]
  following: [Follow]
  followers: [Follow]
}

interface Follow {
  id: number
  author: User
  authorId: User.id
  following: User
  followingId: User.id
}

interface Post {
  id: number
  author: User
  authorId: User.id
}

interface Bookmark {
  id: number
  postId: Post.id
  post: Post
  author?: User
  authorId: User.id
}

interface Like {
  id: number
  postId: Post.id
  post: Post
  author: User
  authorId: User.id
}

interface Boost {
  id: number
  postId: Post.id
  post: Post
  author: User
  authorId: User.id
}