interface User {
  id: string
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
  commenters: Post[]
  bookmarks: Bookmark[]
  likes: Like[]
  boosts: Boost[]
  counts: {
    commentCount: number
    boostCount: number
    likeCount: number
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