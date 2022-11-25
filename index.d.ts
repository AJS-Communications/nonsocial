interface User {
  id: number
  username: string
  Bookmark: [Bookmark]
  Favorite: [Favorite]
  Repost: [Repost]
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