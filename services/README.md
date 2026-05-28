The `services/` folder contains business logic that orchestrates repositories and performs validations. Example:

- services/auth.service.ts
- services/career.service.ts
- services/news.service.ts
- services/user.service.ts
  Services should be pure and testable; avoid coupling to request/response objects.
