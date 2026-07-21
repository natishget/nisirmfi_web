# Project Instructions

## Project Structure

- `frontend/` → Next.js application.
- `server/` → NestJS API.
- `backend/` → Chatbot service (**DO NOT TOUCH**).

> Never touch anything inside the `backend` folder or any chatbot-related functionality inside the `frontend` folder.

---

## API Implementation

The centralized RTK Query API Slice is located at:

```text
frontend/state/api/ApiSlice.ts
```

Before implementing anything:

1. Analyze how the login functionality is implemented.
2. Follow the same architecture, naming conventions, and patterns.
3. Implement all frontend requests through `ApiSlice.ts` except the chatbot functionality.
4. Improve the current implementation when necessary while keeping it consistent with the existing codebase.

Implement:

- Queries
- Mutations
- Proper cache invalidation
- Loading states
- Proper TypeScript types
- Robust and consistent error handling

---

## Error Handling

Improve the current error handling implementation by properly handling:

- Network errors
- Validation errors
- Unauthorized and forbidden requests
- Server errors
- Unexpected API responses
- File upload errors

Follow Next.js, NestJS, and RTK Query best practices.

---

## Backend Requirements

You may modify anything inside the `server` folder when necessary.

You may:

- Modify existing APIs
- Create new APIs if needed
- Improve DTOs and validations
- Improve services and controllers
- Improve pagination implementations

Follow the existing project structure and avoid unnecessary abstractions.

---

## Pagination

Everything that displays collections of data should support pagination whenever appropriate.

Implement:

- page
- limit
- total
- totalPages
- hasNextPage
- hasPreviousPage

for both frontend and backend implementations.

---

## Career Management

### Admin

Administrators should be able to:

- View all careers
- Create careers
- Update careers
- Delete careers
- View expired and scheduled careers

### Public Website

Normal website visitors should only be able to view careers when:

```text
currentDate >= postDate
AND
currentDate <= endDate
```

Careers outside this range must never be returned from public APIs.

---

## News Management

### Admin

Administrators should be able to manage all news regardless of status.

### Public Website

Normal website visitors should only be able to view news when:

```text
status = published
```

No other statuses should be returned from public APIs.

---

## Cloudinary

The Cloudinary implementation inside the `server` folder is currently not working.

Please:

- Find the actual cause of the issue.
- Fix it properly.
- Verify uploads, updates, and deletions work correctly.
- Ensure environment variables are configured correctly.
- Follow Cloudinary best practices.

Do not implement temporary fixes.

---

## Important Rules

- Never touch the `backend` folder.
- Never touch chatbot-related functionality.
- Never touch the backend and modify the database schema and structure.
- Only modify the `frontend` and `server` folders.
- All frontend API requests (except chatbot requests) must use `frontend/state/api/ApiSlice.ts`.
- Keep the implementation consistent with the existing login functionality.
- Follow best practices for security, scalability, maintainability, and performance.
- Verify that all implemented features are working correctly before finishing.
- If creating new APIs or modifying existing ones results in a cleaner implementation, you may do so while maintaining consistency with the project's architecture.