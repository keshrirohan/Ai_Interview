# EchoHire AI — Comprehensive Developer Technical Manual

Welcome to the **EchoHire AI Developer Guide**. This document provides an end-to-end technical reference for developers, software architects, and maintainers. It explains the system architecture, database models, upgrade-only subscription business logic, payment gateway mechanics, API routes, and environment configuration using structured reference tables.

---

## 📌 Table of Contents
1. [Architectural Overview & System Layers](#1-architectural-overview--system-layers)
2. [Technology Stack Reference](#2-technology-stack-reference)
3. [Database Schema & Entity Relationship Model](#3-database-schema--entity-relationship-model)
4. [SaaS Plan Matrix & Upgrade-Only Business Rules](#4-saas-plan-matrix--upgrade-only-business-rules)
5. [Complete API Endpoint Registry](#5-complete-api-endpoint-registry)
6. [Stripe Payment Gateway Workflow](#6-stripe-payment-gateway-workflow)
7. [Frontend Architecture & Component Mapping](#7-frontend-architecture--component-mapping)
8. [Environment Variables Matrix](#8-environment-variables-matrix)

---

## 1. Architectural Overview & System Layers

| Layer | Primary Responsibility | Key Files / Entry Points | Communication Method |
|---|---|---|---|
| **Client SPA** | User interface, state management, speech recognition & synthesis, payment popups | `client/src/App.jsx`<br>`client/src/main.jsx` | HTTP REST API with credentials (`include`) |
| **Authentication** | JWT verification, HTTP-only cookie parsing, password hashing | `server/src/middlewares/auth.middleware.js`<br>`server/src/routes/auth.routes.js` | Express middleware attached to protected routes |
| **API Server** | Request validation, business logic, transaction management | `server/src/server.js`<br>`server/src/routes/*.js` | Express 5 controllers & service functions |
| **AI LLM Engine** | Dynamic question generation, answer evaluation, performance scoring | `server/src/services/groq.service.js` | Async HTTPS calls to Groq API (`openai/gpt-oss-20b`) |
| **Database & ORM** | Data persistence, atomic transactions, plan limit checks | `server/src/lib/prisma.js`<br>`server/prisma/schema.prisma` | Prisma Client 7 over PostgreSQL connection pool |
| **Payment Gateway** | PaymentIntent creation, payment authorization, transaction verification | `server/src/services/payment.service.js`<br>`client/src/components/payment/PaymentModal.jsx` | Stripe SDK & REST API |

---

## 2. Technology Stack Reference

| Ecosystem | Tool / Library | Version | Purpose & Description |
|---|---|---|---|
| **Frontend** | React | `^19.0.0` | UI rendering framework with concurrent features |
| **Frontend** | Vite | `^6.0.0` | Lightning-fast build tool & HMR dev server |
| **Frontend** | Tailwind CSS | `^4.0.0` | Utility-first styling engine with glassmorphism support |
| **Frontend** | React Router DOM | `^7.0.0` | Client-side page navigation & route protection |
| **Frontend** | GSAP | `^3.12.0` | Professional micro-animations and smooth page transitions |
| **Frontend** | Lucide React | `^0.460.0` | Modern vector icons |
| **Frontend** | Web Speech API | Native Browser | Client-side Speech Recognition & Speech Synthesis |
| **Backend** | Node.js | `>= 18.0.0` | Server runtime executing ES Modules (`import/export`) |
| **Backend** | Express.js | `^5.2.1` | Web framework for HTTP routes and controller handling |
| **Backend** | Groq SDK | `^1.3.0` | Ultra-fast AI LLM inference engine driver |
| **Backend** | Stripe SDK | `^17.0.0` | Stripe PaymentIntents & payment verification driver |
| **Backend** | Prisma ORM | `^7.9.0` | Type-safe PostgreSQL database client & schema migrations |
| **Backend** | jsonwebtoken | `^9.0.3` | JWT generation and cookie decoding |
| **Backend** | bcrypt | `^6.0.0` | Secure password hashing (10 salt rounds) |

---

## 3. Database Schema & Entity Relationship Model

### 3.1 Data Models Table

| Model Name | Field | Data Type | Attributes | Description & Relationships |
|---|---|---|---|---|
| **User** | `id` | `String` | `@id @default(cuid())` | Unique user identifier |
| | `name` | `String` | | User full name |
| | `email` | `String` | `@unique` | User login email |
| | `password` | `String` | | Hashed password (`bcrypt`) |
| | `role` | `Role` | `@default(USER)` | System role (`USER` or `ADMIN`) |
| | `plan` | `Plan` | `@default(FREE)` | Subscription plan (`FREE`, `GOLD`, `PLATINUM`) |
| | `createdAt` | `DateTime` | `@default(now())` | Account creation timestamp |
| | `interviews` | `Interview[]` | Relation | One-to-many relation with `Interview` |
| | `payments` | `Payment[]` | Relation | One-to-many relation with `Payment` |
| | `subscription`| `Subscription?` | Relation | One-to-one relation with `Subscription` |
| **Interview** | `id` | `String` | `@id @default(cuid())` | Unique interview session ID |
| | `userId` | `String` | Foreign Key | References `User.id` |
| | `conversation` | `Json?` | Optional JSON Array | Stores history of `[{question, expectedAnswer, answer, score, feedback}]` |
| | `jobDescription`| `String` | `@db.Text` | Target job description provided by candidate |
| | `currentQuestion`| `Int` | `@default(1)` | Active question counter (1 to `maxQuestions`) |
| | `maxQuestions` | `Int` | `@default(10)` | Maximum questions per session |
| | `difficulty` | `Difficulty` | `@default(MEDIUM)` | Session difficulty (`EASY`, `MEDIUM`, `HARD`) |
| | `status` | `Status` | `@default(IN_PROGRESS)` | Session status (`IN_PROGRESS`, `COMPLETED`) |
| | `createdAt` | `DateTime` | `@default(now())` | Interview creation date |
| **Subscription** | `id` | `String` | `@id @default(cuid())` | Unique subscription ID |
| | `userId` | `String` | `@unique` | References `User.id` |
| | `plan` | `Plan` | | Active plan tier (`GOLD`, `PLATINUM`) |
| | `active` | `Boolean` | `@default(true)` | Subscription active flag |
| | `expiresAt` | `DateTime` | | Plan expiration timestamp (1 year from payment) |
| **Payment** | `id` | `String` | `@id @default(cuid())` | Internal payment ID |
| | `userId` | `String` | Foreign Key | References `User.id` |
| | `amount` | `Float` | | Transaction amount in INR |
| | `status` | `PaymentStatus` | `@default(PENDING)` | Status (`PENDING`, `SUCCESS`, `FAILED`) |
| | `paymentId` | `String` | `@unique` | Stripe PaymentIntent ID (`pi_...`) |
| | `createdAt` | `DateTime` | `@default(now())` | Payment record timestamp |

---

## 4. SaaS Plan Matrix & Upgrade-Only Business Rules

EchoHire AI implements an **upgrade-only subscription hierarchy**. Users cannot downgrade or re-subscribe to their existing plan tier.

### 4.1 Subscription Plan Comparison Table

| Feature / Metric | FREE Tier | GOLD Tier | PLATINUM Tier |
|---|---|---|---|
| **Tier Rank** | `0` | `1` | `2` |
| **Price** | ₹0 / forever | ₹499 / year | ₹999 / year |
| **Max Interview Sessions** | 20 Interviews | 50 Interviews | 100 Interviews |
| **AI Question Engine** | Groq LLaMA 3.3 | Groq LLaMA 3.3 | Groq LLaMA 3.3 |
| **AI Model Expected Answers** | 🔒 Locked / Hidden | ✅ Full Access | ✅ Full Access |
| **Competency Analytics** | Standard | Advanced Competency Breakdown | Advanced Skill Analytics & Trends |
| **Performance Reports** | Basic | Exportable PDF/Report | Exportable PDF/Report |
| **Support** | Community | Priority Email | 24/7 Priority Support |

### 4.2 Upgrade State Engine & UI Rules Table

| Current User Plan | Target Selected Plan | Allowed? | UI Button State | Server Response |
|---|---|---|---|---|
| `FREE` | `FREE` | ❌ No | Disabled (`"Active Plan"`) | N/A |
| `FREE` | `GOLD` | ✅ **Yes** | Active (`"Upgrade to Gold"`) | `200 OK` (Intent Created) |
| `FREE` | `PLATINUM` | ✅ **Yes** | Active (`"Upgrade to Platinum"`) | `200 OK` (Intent Created) |
| `GOLD` | `FREE` | ❌ **No (Downgrade)** | Disabled (`"Included in Your Plan"`) | `400 Bad Request` |
| `GOLD` | `GOLD` | ❌ **No (Same Plan)** | Disabled (`"Active Plan"`) | `400 Bad Request` |
| `GOLD` | `PLATINUM` | ✅ **Yes** | Active (`"Upgrade to Platinum"`) | `200 OK` (Intent Created) |
| `PLATINUM` | `FREE` | ❌ **No (Downgrade)** | Disabled (`"Included in Your Plan"`) | `400 Bad Request` |
| `PLATINUM` | `GOLD` | ❌ **No (Downgrade)** | Disabled (`"Included in Your Plan"`) | `400 Bad Request` |
| `PLATINUM` | `PLATINUM` | ❌ **No (Same Plan)** | Disabled (`"Active Plan"`) | `400 Bad Request` |

---

## 5. Complete API Endpoint Registry

### 5.1 Authentication Endpoints (`/api/auth`)

| Endpoint | Method | Auth Required | Request Payload | Success Response | Status |
|---|---|---|---|---|---|
| `/api/auth/register` | `POST` | Public | `{ name, email, password }` | `{ success: true, user }` | `201 Created` |
| `/api/auth/login` | `POST` | Public | `{ email, password }` | `{ success: true, user }` | `200 OK` |
| `/api/auth/logout` | `POST` | Public | None | `{ success: true }` | `200 OK` |
| `/api/auth/me` | `GET` | Cookie JWT | None | `{ success: true, user }` | `200 OK` |

### 5.2 Interview Endpoints (`/api/interview`)

| Endpoint | Method | Auth Required | Request Payload | Purpose & Description |
|---|---|---|---|---|
| `/api/interview/start` | `POST` | User JWT | `{ jobDescription, difficulty }` | Enforces plan limits atomically and spawns session |
| `/api/interview/:id` | `GET` | User JWT | None | Retrieves session details and AI role label |
| `/api/interview/:id/question` | `POST` | User JWT | None | Fetches active question or generates new via Groq |
| `/api/interview/:id/process` | `POST` | User JWT | `{ answer }` | Evaluates candidate answer and advances counter |

### 5.3 Payment Endpoints (`/api/payment`)

| Endpoint | Method | Auth Required | Request Payload | Purpose & Description |
|---|---|---|---|---|
| `/api/payment/create-order` | `POST` | User JWT | `{ plan: "GOLD" \| "PLATINUM" }` | Validates upgrade hierarchy and creates Stripe PaymentIntent |
| `/api/payment/verify` | `POST` | User JWT | `{ orderId, paymentId, clientSecret, plan, amount }` | Verifies Stripe PaymentIntent and upgrades user plan in DB |
| `/api/payment/history` | `GET` | User JWT | None | Fetches candidate transaction logs |

### 5.4 Dashboard & Admin Endpoints (`/api/dashboard`, `/api/admin`)

| Endpoint | Method | Auth Required | Request Payload | Purpose & Description |
|---|---|---|---|---|
| `/api/dashboard` | `GET` | User JWT | None | Computes average scores, radar stats, and remaining plan interview quota |
| `/api/admin/overview` | `GET` | Admin JWT | None | System-wide statistics and plan user distribution |
| `/api/admin/users` | `GET` | Admin JWT | None | List all registered users |
| `/api/admin/users/:id/plan` | `PATCH` | Admin JWT | `{ plan: "FREE" \| "GOLD" \| "PLATINUM" }` | Manual override of user subscription tier |

---

## 6. Stripe Payment Gateway Workflow

```
[Candidate UI] ──(Selects Upgrade Plan)──> [PaymentModal.jsx]
       │
       ├── 1. POST /api/payment/create-order { plan: "PLATINUM" }
       │      │
       │      ├──> Backend checks: PLAN_RANKS[target] > PLAN_RANKS[current]
       │      ├──> Stripe SDK creates PaymentIntent (or test fallback)
       │      └──> Returns { orderId: "pi_xyz", clientSecret: "pi_xyz_secret_...", amount: 999 }
       │
       ├── 2. Displays Stripe Checkout Card / Instant Authorization Form
       │      │
       │      └──> User authorizes payment (Card/UPI/Stripe Express)
       │
       └── 3. Completes payment with PaymentIntent ID
              │
              ├──> POST /api/payment/verify
              ├──> Server verifies PaymentIntent status via Stripe SDK
              ├──> Atomic DB Transaction:
              │    ├── create Payment log
              │    ├── update User.plan = "PLATINUM"
              │    └── upsert Subscription record
              └──> Returns success response & refreshes user session
```

---

## 7. Frontend Architecture & Component Mapping

| Component | File Path | Responsibilities |
|---|---|---|
| `AuthProvider` | `client/src/context/AuthProvider.jsx` | Global user state, login/logout functions, session restoration |
| `Plan` | `client/src/components/home/Plan.jsx` | Subscription section rendering `PlanCard` components |
| `PlanCard` | `client/src/components/home/PlanCard.jsx` | Pricing card with upgrade-only button states & tier indicators |
| `PaymentModal` | `client/src/components/payment/PaymentModal.jsx` | Multi-tab responsive checkout modal supporting Card, UPI, and Stripe |
| `useInterview` | `client/src/hooks/useInterview.js` | Main interview state machine handling speech sync, Groq calls, & timers |
| `TranscriptPanel` | `client/src/components/interview/TranscriptPanel.jsx` | Real-time speech transcript visualizer |
| `Profile` | `client/src/pages/Profile.jsx` | User dashboard, performance charts, model answer locks & upgrade triggers |

---

## 8. Environment Variables Matrix

| Variable Name | Environment | Required? | Default Value | Purpose |
|---|---|---|---|---|
| `DATABASE_URL` | Server | Yes | N/A | PostgreSQL connection string |
| `JWT_SECRET` | Server | Yes | N/A | Secret key for signing session JWT tokens |
| `GROQ_API_KEY` | Server | Yes | N/A | Groq API key for LLaMA 3.3 inference |
| `PORT` | Server | No | `5000` | Express server HTTP port |
| `NODE_ENV` | Server | No | `development` | Environment mode (`development` / `production`) |
| `Frontend_URL` | Server | Yes | `http://localhost:5173` | CORS allowed origin for client requests |
| `STRIPE_SECRET_KEY` | Server | Optional | `sk_test_echohire` | Stripe API Secret Key for PaymentIntents |
| `STRIPE_PUBLISHABLE_KEY` | Server | Optional | `pk_test_echohire` | Stripe API Publishable Key |
| `VITE_BACKEND_URL` | Client | Yes | `http://localhost:5000` | Backend API base URL for fetch requests |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client | Optional | `pk_test_echohire` | Client Stripe Publishable Key |

---

*End of Developer Technical Manual. Updated for EchoHire AI Upgrade-Only Architecture & Stripe Payment Integration.*

