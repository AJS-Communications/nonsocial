# Nonsocial

An open source (MIT LICENSE) social media application.

## Why

I believe in a town square for everyone. I believe social media should be a public asset and not for profit. This project is a step towards that reality.

## Todo List

This isn't a complete list of items but its a good start for focus. There is a ton of work ahead and what's already been done is up for refactor to improve code quality. Feel free to come up with ideas.

- [ ] User authentication
- [ ] User Groups
- [ ] User Roles
- [ ] Recommendation engine
- [ ] Hashtag parsing
- [ ] @user parsing
- [ ] URL parsing
- [x] Posting
- [x] Commenting
- [x] Liking
- [x] Favoriting
- [x] Sharing - partially done
- [ ] Infinite scrolling
- [ ] Searching
- [ ] Exploring hashtags
- [ ] Administration Portal
- [ ] Moderation Portal
- [ ] Code cleanup and keeping things DRY
- [ ] Unit testing
- [ ] E2E testing
- [ ] Much more

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

You will need a `.env` file with your database specified. For example:

```
DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@localhost:3306/nonsocial"
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
