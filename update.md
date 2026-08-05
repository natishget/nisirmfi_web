You are a senior full-stack architect and codebase refactoring expert.

Analyze the entire project structure and perform a complete audit and implementation review.

## Project Structure

- `/frontend` → Next.js application using:
  - Redux Toolkit
  - RTK Query
  - Zod validation
  - TypeScript

- `/server` → NestJS application using:
  - Prisma ORM
  - PostgreSQL

- `/backend` → Chatbot service (DO NOT MODIFY THIS FOLDER UNDER ANY CIRCUMSTANCES)

---

# Critical Constraints

1. NEVER modify anything inside the `/backend` folder.
2. NEVER change the database schema.
3. NEVER generate Prisma migrations.
4. NEVER modify existing database tables, relationships, enums, or columns.
5. Preserve all existing business logic.
6. Use enterprise-grade best practices.
7. Maintain strict TypeScript typing.
8. Do not introduce breaking changes.
9. Before making changes, fully analyze dependencies and usages.

---

# Frontend Requirements

Perform a complete audit of the Next.js frontend.

## Current Situation

The frontend currently:

- Uses APIs from both:
  - `/server`
  - `/backend`

- Chatbot functionality uses APIs from `/backend`

- Career management uses APIs from `/server`

- News management uses APIs from `/server`

- Account opening uses APIs from `/server`

- Account tracking uses APIs from `/server`

- User management uses APIs from `/server`

- Admin dashboard uses APIs from `/server`

Currently many components are making direct API calls.

This is NOT acceptable.

---

## Refactor Requirements

Move all `/server` API interactions into:

`frontend/state/api/ApiSlice.ts`

using Redux Toolkit Query.

### Important

Keep chatbot-related API calls untouched.

Only APIs that communicate with the NestJS `/server` application should be migrated.

---

## Required Architecture

All server communication must follow:

Components
↓
RTK Query Hooks
↓
ApiSlice.ts
↓
Server API

No component should directly call:

- fetch()
- axios()
- custom API clients

for `/server` endpoints.

---

## RTK Query Requirements

For every endpoint:

- Create proper query endpoints
- Create proper mutation endpoints
- Configure tags
- Configure cache invalidation
- Configure optimistic updates where appropriate
- Configure loading states
- Configure error states
- Configure retries where appropriate

Follow Redux Toolkit Query best practices.

---

## Error Handling

Implement consistent error handling across the application.

Requirements:

- Handle 400 errors
- Handle 401 errors
- Handle 403 errors
- Handle 404 errors
- Handle 409 errors
- Handle 422 errors
- Handle 500 errors
- Handle network failures
- Handle timeout errors

Use a centralized error handling strategy.

Ensure all user-facing errors display meaningful messages.

Prevent application crashes from API failures.

---

## News Module

The news-related pages are currently not working.

Perform a complete diagnosis and fix.

Verify:

- API endpoints
- DTO compatibility
- Route configuration
- RTK Query integration
- Query parameters
- Pagination
- Filtering
- Sorting
- Data transformation
- Response mapping
- Admin CRUD operations

Ensure all news pages function correctly.

---

## Career Module

Audit and verify:

- Career listings
- Career details
- Career applications
- Career management
- Admin CRUD operations

Fix any issues found.

---

## Account Opening Module

Audit and verify:

- Account creation
- Validation
- Submission
- Tracking
- Admin management
- Status updates

Fix all issues.

---

## User Management

Verify:

- Authentication flow
- Authorization
- User CRUD operations
- Permissions
- Roles
- Protected routes

Fix any issues found.

---

## Authentication

Use the existing login implementation as the reference architecture.

All server APIs should follow the same Redux Toolkit pattern used by login.

Standardize the implementation throughout the frontend.

---

# Server Requirements

Audit the NestJS application.

## API Audit

Inspect:

- Controllers
- Services
- Modules
- DTOs
- Guards
- Validation pipes
- Prisma integration

Verify every frontend requirement has a corresponding API.

---

## Missing APIs

If frontend functionality requires APIs that do not exist:

Create them using the existing project architecture.

Requirements:

- Follow existing coding style
- Follow NestJS best practices
- Use DTO validation
- Use proper guards
- Use proper exception handling
- Use proper HTTP status codes
- Use Prisma best practices

Do not create unnecessary APIs.

Only create APIs required by the frontend.

---

## Validation

Verify:

- Request validation
- DTO validation
- Zod compatibility
- Input sanitization

Fix vulnerabilities.

---

## Security Audit

Perform a complete security review.

Check for:

- Broken authentication
- Broken authorization
- Missing guards
- Missing validation
- Injection risks
- XSS risks
- CSRF risks
- Insecure file uploads
- Sensitive data exposure
- Improper error leakage
- Rate limiting issues
- CORS issues
- JWT issues
- Privilege escalation risks

Fix issues without changing database structure.

---

## Code Quality Review

Review:

- Type safety
- Unused code
- Dead code
- Duplicate logic
- Circular dependencies
- Memory leaks
- Performance issues
- Query inefficiencies
- Prisma misuse

Fix all identified issues.

---

# Deliverables

1. Full architecture audit report.
2. List of all discovered issues.
3. List of all fixes applied.
4. List of APIs mapped between frontend and server.
5. List of newly created APIs (if required).
6. RTK Query migration summary.
7. Security audit report.
8. Final verification checklist.

Before finishing:

- Verify frontend builds successfully.
- Verify server builds successfully.
- Verify all TypeScript errors are resolved.
- Verify all Redux Toolkit Query integrations work.
- Verify all news functionality works.
- Verify all career functionality works.
- Verify all account opening functionality works.
- Verify all admin functionality works.
- Verify chatbot functionality remains untouched.
- Verify database schema remains unchanged.
- Verify backend folder remains untouched.

Do not stop until the entire audit, refactor, verification, and remediation process is complete.
