# TalentForge API 🚀

> A high-performance, production-ready RESTful API for asset and application tracking built with **Node.js**, **Express**, **TypeScript**, and **Prisma v7**.

This backend serves as the core orchestration layer for TalentForge, managing relational data structures across PostgreSQL/Supabase, enforcing request schema compliance, and providing a centralized error-handling runtime environment.

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** Node.js with TypeScript (`ts-node-dev` compilation)
- **Web Framework:** Express.js
- **Database ORM:** Prisma v7 (Relational PostgreSQL hosted on Supabase)
- **Request Validation:** Zod v3+ (Runtime payload sanitization)
- **Security:** JSON Web Tokens (JWT) & bcryptjs hashing
- **Error Architecture:** Custom Operational Global Error Middleware Interceptor

---

## 🏗️ System Architecture & Features

### 1. Relational Database Modeling

A completely mapped transactional schema linking entities with strict database integrity constraints:

- **User:** Manages authentication profiles, hashed credentials, and role tracking.
- **Property/Listing:** Operational items mapped to a specific creator (`ownerId`).
- **Application:** Cross-linked mapping connecting an applicant with a specific property asset. Implements automated cascade deletion (`onDelete: Cascade`) to handle systemic database pruning.

### 2. Request Validation Gatekeepers

Utilizes **Zod schemas** to intercept incoming requests at the router level. Ensures body payloads, route params, and query strings are perfectly structured before firing controller handlers. Prevents dirty database execution and handled type errors.

### 3. Centralized Operational Error Framework

Employs a unified custom extension class (`AppError`) combined with an Express global interceptor. It dynamically toggles between verbose stack traces for **Development** environments and clean, non-leaking error responses for **Production** builds.

---

## 🚦 API Endpoints Blueprint

### Auth Module (`/api/auth`)

- `POST /register` - Provision a new user account profile.
- `POST /login` - Verify credentials and sign a signed secure state JWT token.

### Property Listings Module (`/api/properties`)

- `GET /` - Public route to fetch all structural property listings.
- `POST /` - _Protected._ Provision a new property listing asset (bound to active bearer session).
- `DELETE /delete/:id` - _Protected._ Permanently wipe an asset row. Enforces strict creator resource checks.

### Applications Engine (`/api/applications`)

- `POST /apply` - _Protected._ Submit a unique application/cover letter instance. Blocks duplicate applications.
- `GET /my-submissions` - _Protected._ Returns application rows submitted by the active candidate.
- `GET /incoming` - _Protected._ Returns applications pointing directly to assets owned by the recruiter.
- `PATCH /status` - _Protected._ Update an application status tracking code (`pending`, `accepted`, `rejected`).
