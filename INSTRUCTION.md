# Account Opening System Implementation Instructions

## ROLE

You are a Senior Staff Software Engineer, Senior Next.js Architect, Senior Database Engineer, Senior Security Engineer, Senior Prisma Expert, and Senior Code Reviewer.

Your responsibility is to review the entire codebase, understand the existing implementation, identify weaknesses, and implement a production-grade solution.

---

# PROJECT STRUCTURE

The repository contains two main folders:

```txt
root/
├── frontend/
└── backend/
```

### frontend/

Contains:

* Next.js App Router application
* TypeScript
* Prisma ORM
* Supabase PostgreSQL Database
* Existing server-side functionality

### backend/

Contains:

* FastAPI application
* Chatbot-related functionality

---

# IMPORTANT RESTRICTIONS

## DO NOT TOUCH THE BACKEND

You must NOT:

* Modify anything inside the `backend` folder
* Create new dependencies on the FastAPI backend
* Move code between frontend and backend
* Use FastAPI APIs for this task

The chatbot backend is unrelated to this feature.

Everything must be implemented only inside the frontend application.

---

# DATABASE RESTRICTIONS

The project already contains an existing Prisma schema.

You MUST NOT modify database tables, models, relations, indexes, or fields that are unrelated to the Account Opening feature.

### Allowed

You MAY modify:

* Account-related models
* Account application models
* Fields directly related to the account opening process
* Relations directly connected to account opening

### NOT Allowed

You MUST NOT modify:

* Existing unrelated models
* Existing unrelated relations
* Existing unrelated business logic
* Existing unrelated tables

Unless there is a critical issue that makes the Account Opening functionality impossible to implement correctly.

If schema changes are necessary:

* Limit changes strictly to account-related models.
* Explain every schema change.
* Explain why each change is required.

---

# CURRENT STATUS

An Account Opening feature has already been started.

Location:

```txt
frontend/app/open-account
```

Some frontend and server-side code already exists.

The implementation is currently incomplete.

Your task is to:

1. Analyze the current implementation.
2. Identify missing functionality.
3. Identify bugs.
4. Identify security issues.
5. Identify architecture issues.
6. Complete the feature professionally.

---

# FEATURE REQUIREMENTS

## 1. Account Opening Submission

Users must be able to:

* Open a new account
* Complete all required information
* Submit their application

### Requirements

Implement:

* Client-side validation
* Server-side validation
* Zod validation
* Input sanitization
* Error handling
* Secure database insertion
* Duplicate submission prevention
* Proper loading states
* Success states
* Failure states

### After Submission

Generate a unique Application ID.

Requirements:

* Unique
* Non-sequential
* Difficult to enumerate
* Safe for public usage

Store the application in the database.

Display the Application ID to the user.

Allow the user to:

* Copy the ID
* Save the ID

---

## 2. Application Status Tracking

Create a status tracking system.

Users should be able to:

* Enter Application ID
* Check application status

Supported statuses:

```txt
Pending
Under Review
Approved
Rejected
More Information Required
```

### Security Requirements

Prevent:

* Enumeration attacks
* Brute-force lookups
* Data leakage
* Unauthorized access

Only display information appropriate for the applicant.

---

## 3. Admin Portal

Create a secure admin experience.

Admins must be able to:

### Dashboard

View:

* Total applications
* Pending applications
* Approved applications
* Rejected applications
* Applications requiring additional information

### Applications Management

View:

* All applications
* Search applications
* Filter applications
* Application details

### Status Management

Admins must be able to:

* Approve applications
* Reject applications
* Request more information
* Update statuses

Changes must immediately persist in the database.

---

## 4. Prisma Review

Review the existing Prisma schema.

### Rules

Do NOT modify unrelated tables.

Only modify account-related models if improvements are necessary.

Review:

* Relations
* Indexes
* Constraints
* Naming
* Scalability
* Performance

Provide explanations for all changes.

---

# SECURITY REQUIREMENTS

Treat this as a production banking or microfinance system.

Protect against:

* SQL Injection
* XSS
* CSRF
* IDOR
* Parameter Tampering
* Sensitive Data Exposure
* Mass Assignment
* Broken Access Control
* Authentication Bypass
* Authorization Issues
* Enumeration Attacks
* Brute Force Attacks

Implement:

* Zod validation
* Input sanitization
* Proper authorization
* Least privilege principle
* Secure Server Actions
* Secure API Routes
* Secure error handling

Never expose:

* Internal IDs
* Database details
* Stack traces
* Sensitive metadata

---

# PERFORMANCE REQUIREMENTS

Optimize for:

* Scalability
* Query efficiency
* Database indexing
* Server performance
* Client performance

Avoid:

* N+1 queries
* Unnecessary re-renders
* Duplicate requests
* Inefficient database access

---

# CODE QUALITY REQUIREMENTS

Follow:

* Clean Architecture
* SOLID Principles
* Type Safety
* Reusability
* Maintainability
* Scalability

Avoid:

* Quick fixes
* Temporary hacks
* Code duplication

Build as if this system will be used by thousands of users.

---

# UI/UX REQUIREMENTS

Create a professional financial institution experience.

Requirements:

* Responsive Design
* Mobile Friendly
* Loading States
* Empty States
* Error States
* Success States
* Accessibility Support
* Professional Design

---

# ANALYSIS REQUIREMENT

Before writing code:

Analyze the entire frontend codebase.

Identify:

* Existing architecture
* Existing implementation
* Bugs
* Missing functionality
* Security issues
* Performance issues
* Schema issues

Then create the best implementation plan.

---

# OUTPUT REQUIREMENT

For every modified file provide:

```txt
FILE: path/to/file
```

Then provide the COMPLETE updated file.

Do NOT provide:

* Partial snippets
* Truncated code
* Placeholder sections

Provide full production-ready code.

---

# NEW FILES

If additional files are required:

1. Create them.
2. Explain why they are needed.
3. Provide complete code.

---

# FINAL REPORT

After implementation provide:

## Architecture Summary

Explain:

* Overall design
* Folder structure
* Data flow

## Database Changes

List:

* Schema changes
* Reasons for changes

## Security Improvements

Explain:

* Risks identified
* Fixes applied

## Performance Improvements

Explain:

* Query optimizations
* Rendering optimizations
* Scalability improvements

## Deployment Considerations

Explain:

* Environment variables
* Production requirements
* Security considerations

## Testing Checklist

Provide:

* Functional tests
* Security tests
* Validation tests
* Admin workflow tests
* User workflow tests

---

# ENGINEERING STANDARD

Act as a Senior Staff Engineer reviewing and implementing a production-grade banking/microfinance application.

Prioritize:

1. Security
2. Correctness
3. Reliability
4. Scalability
5. Maintainability
6. User Experience

Do not make assumptions.

Read and understand the existing codebase first, then implement the best solution.
