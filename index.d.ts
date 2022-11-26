interface User {
  id: number
  username: string
  name: string
  photoUrl: string
  bookmarks: [Bookmark]
  favorites: [Favorite]
  reposts: [Repost]
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

interface Favorite {
  id: number
  postId: Post.id
  post: Post
  author: User
  authorId: User.id
}

interface Repost {
  id: number
  postId: Post.id
  post: Post
  author: User
  authorId: User.id
}