interface User {
  id: string
  username: string
  name: string
  email: string
  bio: string
  photoUrl: string
  bookmarks: [Bookmark]
  likes: [Like]
  boosts: [Boost]
  following: [Follow]
  followers: [Follow]
}

interface Follow {
  id: string
  author: User
  authorId: User.id
  following: User
  followingId: User.id
}

interface Post {
  id: string
  createdDate: DateTime
  text: string
  author: User
  authorId: User.id
  parentId: Post.id
  parent: Post
  children: Post[]
  bookmarks: Bookmark[]
  likes: Like[]
  boosts: Boost[]
  _count: {
    children: number
    comments: number
    bookmarks: number
    boosts: number
    likes: number
  }
}

interface Bookmark {
  id: string
  postId: Post.id
  post: Post
  author?: User
  authorId: User.id
}

interface Like {
  id: string
  postId: Post.id
  post: Post
  author: User
  authorId: User.id
}

interface Boost {
  id: string
  postId: Post.id
  post: Post
  author: User
  authorId: User.id
}