---
name: backend-api
description: "Backend API for campus placement platform. Covers Express/Fastify server, PostgreSQL or MongoDB database, JWT plus OTP authentication for students, password auth for admins, API routes for job CRUD, student profiles, college config, and analytics. Includes Google Sheets integration and Razorpay billing. Use when user says 'create API endpoint', 'add database table', 'fix auth', 'connect database', 'add middleware', 'billing integration', or 'backend bug'. Do NOT use for scraper logic or frontend UI."
---

# ⚙️ Backend API Skill

This skill governs the evolution from a static file-based system to a robust, multi-tenant API. It handles data persistence, authentication, and external integrations.

## 1. Current vs Target State
- **Current**: `server.js` (Express) serves `jobs.json` as a static file.
- **Target**: RESTful API with PostgreSQL/MongoDB and JWT-based authentication.

## 2. Server Architecture
- **Framework**: Express.js (Transitioning to Fastify for performance).
- **Core Middleware**:
    - `helmet`: Enhances security headers (CSP).
    - `cors`: Manages cross-origin access.
    - `rate-limit`: Prevents API abuse.
    - `auth`: Custom JWT verification middleware.

## 3. Core Database Tables
Definitions in `references/database-schema.md`:
- `jobs`: Stores all scraped and approved postings.
- `students`: Central repository for student profiles and applications.
- `colleges`: Multi-tenant configuration for white-labeling.

## 4. Authentication Flow
Detailed in `references/auth-flow.md`.
- **Students**: Passwordless login using Email OTP.
- **Admins**: Email/Password login.
- **JWT**: Issued on successful login, containing `userId`, `role`, and `collegeId`.

## 5. External Integrations
- **Google Sheets**: Existing `googleapis` integration for backup/export.
- **Razorpay**: Planned for college subscription management.
- **Postmark/Resend**: For OTP delivery.

## Examples
- "Add a student application endpoint" -> Define `POST /api/jobs/:id/apply` and update the `applications` join table.
- "Implement a college-specific filter in the API" -> Add `college_id` filter to `GET /api/jobs`.
- "Log a job click for analytics" -> Create a hit counter in the `analytics` table.

## Troubleshooting
- **CORS Errors**: Check `app.use(cors())` configuration.
- **JWT Expired**: Ensure client-side logic handles token refresh or re-login.
- **Database Connection Failure**: Verify `DATABASE_URL` in `.env`.
