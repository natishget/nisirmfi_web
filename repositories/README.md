`repositories/` centralizes Prisma DB access. Examples:

- repositories/prismaClient.ts
- repositories/career.repo.ts
- repositories/user.repo.ts
- repositories/news.repo.ts
  Keep raw DB queries and transactions here; return typed DTOs to services.
