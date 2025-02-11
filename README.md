# Nonsocial

An open source (MIT LICENSE) social media application.

## Why

I believe in a town square for everyone. I believe social media should be a public utility and not for profit. This project is a step towards that reality.

## Todo List

This isn't a complete list of items but its a good start for focus. There is a ton of work ahead and what's already been done is up for refactor to improve code quality. Feel free to come up with ideas.

- [] User Authentication
  - [X] Login
  - [X] Logout
  - [X] Register
  - [X] Passkeys
  - [ ] Email Validation
  - [ ] Account Recovery
- [ ] User Groups
- [ ] User Notifications
- [ ] User (Direct) Messaging
- [ ] User Profiles
- [ ] User Roles
- [ ] User Following
- [ ] User Blocking
- [ ] User Reporting
- [ ] User Muting
- [x] Recommendation engine
  - [x] Get your own posts
  - [x] Get posts of the users you follow
  - [x] Get posts that the users you follow have boosted
  - [x] Get posts that the users you follow have liked
  - [x] Get posts that the users you follow have commented on
- [ ] Posting
  - [x] Text-based posting
  - [x] Hashtag parsing
  - [x] Hasttag autosuggest
  - [x] @username parsing
  - [ ] @username autosuggest
  - [x] URL parsing
  - [ ] Media (Image/Image Galleries/Videos)
  - [ ] Memes/Gifs
  - [ ] Polls
  - [ ] Scheduling
  - [ ] Location
- [ ] Delete Post
- [ ] Edit Post
- [x] Boosting
- [x] Commenting
- [x] Likes
- [x] Bookmarks
- [x] Sharing
- [x] Infinite scrolling
- [ ] Searching
- [ ] Exploring
  - [x] Get most recent public posts
  - [ ] Get all public posts with most used tags that day
  - [ ] Get all public posts that have been liked the most that day
  - [ ] Get all public posts that have been boosted the most that day
- [ ] Administration Portal
- [ ] Moderation Portal
- [ ] Code cleanup and keeping things DRY
- [ ] Unit testing
- [ ] E2E testing
- [ ] Bug fixing
- [ ] Much more...

## Setup

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Infrastructure

This application is built with [Nuxt 3](https://http://nuxt.com), [Tailwind CSS](https://http://tailwindcss.com), and [Prisma](https://www.prisma.io). 

Development has been done with a MySQL database up to this point (wanted ENUM support). I am open to whatever database makes sense. If you are an expert in the field, please chime in.

You will need a `.env` file with some values specified. For example:

```
DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@localhost:3306/nonsocial"
JWT_SECRET="secret-jwt-salt-value"
WEBAUTHN_NAME="Nonsocial"
WEBAUTHN_ORIGIN="http://localhost:3000"
WEBAUTHN_RPID="localhost"
APP_TITLE="Nonsocial"
APP_TITLE_SHORT="NS"
APP_META_DESCRIPTION="An open-source townsquare for everyone."
RESULTS_PER_PAGE="100"
```

## Database

### Migration

```bash
npm run migrate
```

### Reset

```bash
npm run reset
```

### Studio

```bash
npm run studio
```

### Format Schema File

```bash
npm run format
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
