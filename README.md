This is a [Next.js](https://nextjs.org) corporate website built with the App Router.

## Database Setup

This project uses Prisma ORM with PostgreSQL.

Required environment variables are documented in [`.env.example`](.env.example).

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Key Prisma files:

- [prisma/schema.prisma](prisma/schema.prisma)
- [prisma.config.ts](prisma.config.ts)
- [prisma/migrations/20260521150000_initial/migration.sql](prisma/migrations/20260521150000_initial/migration.sql)

Available API routes:

- `/api/users`
- `/api/news`
- `/api/careers`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
