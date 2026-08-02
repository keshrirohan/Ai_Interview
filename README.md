# EchoHire AI

An AI-powered mock interview platform. Users paste a job description, choose a difficulty level, and conduct a fully voice-driven interview with an AI interviewer. The AI asks questions, listens to spoken answers via the browser's Speech Recognition API, evaluates responses using Groq (LLaMA 3.3), and generates a detailed performance report at the end.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Client — Pages](#client--pages)
7. [Client — Components](#client--components)
8. [Client — Hooks](#client--hooks)
9. [Client — Utils](#client--utils)
10. [Server — Services](#server--services)
11. [Server — Middleware](#server--middleware)
12. [Interview Flow — End-to-End Logic](#interview-flow--end-to-end-logic)
13. [Auth Flow](#auth-flow)
14. [SaaS Plan System](#saas-plan-system)
15. [Environment Variables](#environment-variables)
16. [Getting Started](#getting-started)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Animation | GSAP + @gsap/react |
| Icons | Lucide React, React Icons |
| Toasts | React Hot Toast |
| Backend | Node.js, Express 5 |
| AI / LLM | Groq SDK (LLaMA 3.3 70B) |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (httpOnly cookies) + bcrypt |
| Speech Input | Web Speech API (SpeechRecognition) |
| Speech Output | Web Speech Synthesis API |


---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│                                                         │
│  React SPA (Vite)                                       │
│  ├── AuthProvider  (global auth state via Context API)  │
│  ├── BrowserRouter (React Router DOM)                   │
│  │   ├── Public routes  → Home, Contact, 404            │
│  │   └── Private routes → Interview, Profile            │
│  │                                                      │
│  ├── useInterview hook  (all interview business logic)  │
│  │   ├── useSpeechRecognition  (mic + transcript)       │
│  │   ├── textToSpeech util     (AI voice output)        │
│  │   └── fetch → Express REST API                       │
│  └── Interview.jsx  (pure presentation layer)           │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP + httpOnly cookies
┌────────────────────────────▼────────────────────────────┐
│                   Express Server (Node.js)               │
│                                                         │
│  Routes                                                 │
│  ├── /api/auth       → auth.routes.js                   │
│  ├── /api/interview  → interview.routes.js              │
│  └── /api/dashboard  → dashboard.routes.js              │
│                                                         │
│  Services                                               │
│  ├── interview.service.js  (core interview logic)       │
│  ├── groq.service.js       (LLM prompt engineering)     │
│  └── dashboard.service.js  (stats aggregation)         │
│                                                         │
│  Prisma ORM  ──────────────►  PostgreSQL                │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

- **Separation of concerns**: `useInterview.js` owns 100% of interview business logic. `Interview.jsx` only renders — it contains zero API calls, refs, or TTS imports.
- **Hook composition**: `useInterview` composes `useSpeechRecognition`, which itself is scoped only to mic + transcript. Each hook has a single responsibility.
- **Server-side conversation storage**: The full conversation array (questions, answers, scores, feedback) is stored as a JSON field in PostgreSQL. This enables browser refresh recovery with no client-side persistence.
- **Atomic DB operations**: Plan limit check + interview creation, and report creation + interview status update, both use Prisma `$transaction` to prevent partial writes.
- **httpOnly cookies**: JWTs are stored in httpOnly cookies only, never in `localStorage` or the response body.


---

## Project Structure

```
EchoHire_AI/
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── loading.gif              # Used by LoadingScreen component
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero.png
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── ForgetPassword.jsx
│   │   │   ├── AiPreview.jsx        # AI avatar + question card
│   │   │   ├── CameraPreview.jsx    # Candidate webcam + mic controls
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── JDCard.jsx           # Past interview card
│   │   │   ├── JDs.jsx              # Past interviews list
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Plan.jsx             # Pricing section container
│   │   │   ├── PlanCard.jsx         # Individual plan card
│   │   │   ├── Testimonials.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── hooks/
│   │   │   ├── useInterview.js      # All interview business logic
│   │   │   └── useSpeechRecognition.js  # Mic + transcript only
│   │   ├── pages/
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Interview.jsx        # Pure presentation — calls useInterview()
│   │   │   ├── NewInterview.jsx     # Create interview form
│   │   │   ├── Page404.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── authContextProvider.jsx  # AuthContext provider + /me check
│   │   │   ├── PrivateRoutes.jsx        # Route guard component
│   │   │   ├── speechToText.js          # SpeechRecognition factory
│   │   │   ├── textToSpeech.js          # Speech Synthesis wrapper
│   │   │   ├── toast.js                 # successToast / errorToast helpers
│   │   │   └── useContext.js            # AuthContext + useAuth hook
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # App entry point
│   │   ├── index.css
│   │   └── App.css
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── server/                          # Express backend
    ├── prisma/
    │   ├── schema.prisma            # Data models + indexes
    │   └── migrations/              # Prisma migration history
    ├── generated/
    │   └── prisma/                  # Auto-generated Prisma client
    ├── lib/
    │   └── prisma.js                # PrismaClient singleton (PrismaPg adapter)
    ├── src/
    │   ├── config/                  # (empty after DB.js removal)
    │   ├── controller/
    │   │   ├── dashboard.controller.js
    │   │   └── interview.controller.js
    │   ├── middlewares/
    │   │   └── auth.middleware.js   # JWT verification
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── dashboard.routes.js
    │   │   └── interview.routes.js
    │   ├── services/
    │   │   ├── dashboard.service.js
    │   │   ├── groq.service.js      # All Groq / LLM calls
    │   │   └── interview.service.js # Core interview logic
    │   ├── utils/
    │   │   └── planLimit.js         # FREE/GOLD/PLATINUM limits
    │   └── server.js                # Express app + global error handler
    ├── package.json
    ├── tsconfig.json
    └── prisma.config.ts
```


---

## Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | |
| email | String | Unique |
| password | String | bcrypt hash |
| plan | Enum (FREE/GOLD/PLATINUM) | Default FREE |
| interviewsUsed | Int | Incremented on each interview start |
| createdAt / updatedAt | DateTime | |

### Interview
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String | FK → User |
| conversation | Json? | Array of `{question, expectedAnswer, answer, score, feedback}` |
| jobDescription | String | Pasted JD text |
| currentQuestion | Int | 1-based, default 1 |
| maxQuestions | Int | Default 10 |
| difficulty | Enum (EASY/MEDIUM/HARD) | |
| status | Enum (IN_PROGRESS/COMPLETED) | |
| startedAt / completedAt | DateTime | |

**Indexes:** `@@index([userId])`, `@@index([status])`, `@@index([userId, status])`

### Report
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | |
| interviewId | String | Unique FK → Interview |
| score | Float | Overall 0–10 |
| communication | Float | |
| technical | Float | |
| confidence | Float | |
| problemSolving | Float | |
| strengths | Json | String array |
| weaknesses | Json | String array |
| recommendations | Json | String array |
| summary | String | Text paragraph |

### Other Models
- **OverallReport** — aggregated stats across all interviews per user
- **Resume** — uploaded resume (URL + parsed text)
- **Subscription** — plan + active flag + expiry
- **Payment** — payment records


---

## API Reference

All routes are prefixed with `/api`. Authenticated routes require a valid JWT in the `token` httpOnly cookie.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | No | Login. Sets httpOnly cookie. Returns `{ success, user }` |
| POST | `/register` | No | Register. Sets httpOnly cookie. Returns `{ success, user }` |
| POST | `/logout` | No | Clears the token cookie |
| GET | `/me` | No (reads cookie) | Returns the authenticated user or 401 |

### Interview — `/api/interview`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/start` | Yes | Create a new interview session. Checks plan limit atomically. Returns the new `Interview` record |
| GET | `/:interviewId` | Yes | Fetch interview details + AI-generated role label |
| POST | `/:interviewId/question` | Yes | Get or generate the first question. Resumes from saved conversation if one exists |
| POST | `/:interviewId/process` | Yes | Submit an answer. Returns `{ completed, nextQuestion, currentQuestion, score, feedback }` or `{ completed: true, report }` |

### Dashboard — `/api/dashboard`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Returns aggregated stats: plan, interviews used/remaining, average scores, best/lowest score |


---

## Client — Pages

### `Home.jsx`
Landing page. Composes `Hero`, `Plan`, and `Testimonials` sections. No data fetching.

### `NewInterview.jsx`
The interview creation form. Collects a job description (textarea) and difficulty level (select). On submit calls `POST /api/interview/start`, then navigates to `/interview/:id`. The Clear button resets form state. Errors are surfaced via `errorToast`.

### `Interview.jsx`
**Pure presentation component.** Calls `useInterview(id)` and renders:
- Interview metadata (role, difficulty, question counter)
- `AiPreview` — AI avatar + current question
- `CameraPreview` — candidate camera feed
- Live transcript panel with mic activity indicator
- Pause/Resume, Submit Answer, and End Interview buttons
- Error banner

Contains zero API calls, zero refs, zero TTS/speech imports.

### `Profile.jsx`
User profile page showing avatar, contact info, interview stats, skills, and social links. Currently uses static placeholder data — API integration is a pending TODO.

### `Contact.jsx`
Contact page with info cards and a contact form. Form submission is a pending TODO.

### `Page404.jsx`
404 not-found page with Home and Go Back navigation buttons.

---

## Client — Components

### `Navbar.jsx`
Fixed top navbar with:
- Logo linking to `/`
- Desktop nav links using React Router `<Link>` (Home, Interview, Contact)
- `ThemeToggle` button
- Auth-aware controls: Login/Get Started when logged out, User avatar/Logout when logged in
- Mobile hamburger menu with GSAP slide animation
- Auth modal system: renders `Login`, `Signup`, or `ForgetPassword` in a backdrop modal

### `AiPreview.jsx`
Displays the AI avatar with an animated pulse ring, a status badge ("AI is speaking…" / "Listening to you…" toggled by the `isListening` prop), and the current interview question in a card.

Props: `question: string`, `isListening: boolean`

### `CameraPreview.jsx`
Manages the user's webcam and microphone streams independently. Provides toggle buttons for camera on/off and mic on/off. Handles stream cleanup on unmount.

### `LoadingScreen.jsx`
Full-screen centered loading animation using `loading.gif`.

### `Testimonials.jsx`
Infinite horizontal scroll of testimonial cards animated with GSAP. The card data (`TESTIMONIALS`, `SCROLL_ITEMS`) is defined at module level — never recreated on re-render.

### `Plan.jsx` / `PlanCard.jsx`
Pricing section displaying FREE, GOLD, and PLATINUM plans. Plan limits (interviews per month) match `PLAN_LIMITS` on the server.

### `Hero.jsx`
Landing hero section with headline, CTA buttons, and hero image.

### `Footer.jsx`
Site footer.

### `ThemeToggle.jsx`
Toggles dark/light mode by manipulating `document.documentElement.classList`.

### `JDs.jsx` / `JDCard.jsx`
Previous job descriptions / interview history list. Currently uses placeholder data.

### `auth/Login.jsx`
Login form. Validates fields with `errorToast` (not `alert`). Checks `data.success` before calling `login()` or `successToast()` — a failed login never updates auth context.

### `auth/Signup.jsx`
Registration form. Follows the same success-check-first pattern as Login.

### `auth/ForgetPassword.jsx`
Forgot password form. Backend not yet implemented.


---

## Client — Hooks

### `useInterview(interviewId)`

The central hook for the entire interview experience. `Interview.jsx` calls this and only this — all logic lives here.

**State exposed:**

| Name | Type | Description |
|---|---|---|
| `interview` | object | Full interview record from the server |
| `loading` | boolean | True while fetching details + first question |
| `processing` | boolean | True while waiting for `/process` response |
| `currentQuestion` | number | 1-based question counter |
| `totalQuestions` | number | From `interview.maxQuestions` (default 10) |
| `question` | string | Text of the current interview question |
| `transcript` | string | Accumulated spoken answer text |
| `isListening` | boolean | True while microphone is active |
| `error` | string \| null | Any API error message |

**Functions exposed:**

| Name | Description |
|---|---|
| `startListening()` | Start the microphone manually (Pause → Resume) |
| `stopListening()` | Stop the microphone manually (Pause button) |
| `processCurrentAnswer()` | Stop mic, submit transcript to `/process`, advance question |
| `endInterview()` | Cancel TTS + mic, navigate to `/interview` |

**Internal logic:**

1. **Effect 1 — fetch interview details**: Calls `GET /api/interview/:id`. Uses `AbortController` to prevent state updates after unmount.
2. **Effect 2 — init question**: Runs once after interview loads (`hasInitialized` ref prevents Strict Mode double-call). Calls `POST /api/interview/:id/question`. If a conversation exists server-side, the saved question is returned (resume support). Sets `loading = false` in `finally`.
3. **Effect 3 — speak question**: Fires when `question` changes. `lastSpokenQuestion` ref prevents re-triggering TTS for the same string. Calls `speak(question, () => startListening())` — listening starts automatically when AI finishes.
4. **processCurrentAnswer**: Reads `transcript` via `transcriptRef` (not from the closure) so the `useCallback` dep array stays stable. Calls `POST /api/interview/:id/process`. On `completed: true`, calls `endInterview()`. Otherwise sets the next question and increments the counter.
5. **Cleanup effect**: Cancels TTS and stops mic on unmount.

---

### `useSpeechRecognition()`

Scoped exclusively to microphone access and transcript accumulation.

**Key design:**
- `isListeningRef` mirrors the `isListening` state so `startListening`/`stopListening` guards are never stale (solves the React stale-closure problem)
- `onresult` appends new speech segments with `setTranscript(prev => prev + newText)` — no text is lost across continuous utterances
- `startListening()` clears the transcript at the start of each new answer session
- `no-speech` error is suppressed — it is expected when the user pauses and is not a real failure
- Full cleanup on unmount: nulls all event handlers and calls `.abort()`

---

## Client — Utils

### `authContextProvider.jsx`
Provides `AuthContext` to the entire app. On mount, calls `GET /api/auth/me` with an `AbortController` to restore the session from the httpOnly cookie. Exposes `{ user, login, logout, loading }`.

### `useContext.js`
Exports `AuthContext` and the `useAuth()` convenience hook. Throws if used outside `AuthProvider`.

### `PrivateRoutes.jsx`
Route guard using React Router's `<Outlet>`. Shows `LoadingScreen` while auth is being checked. Redirects unauthenticated users to `/`.

### `speechToText.js`
Factory for `SpeechRecognition` instances. Uses lazy initialisation — the `SpeechRecognition` constructor is accessed inside the function body, not at module load time, making it safe to import in non-browser environments. Exports `isSpeechRecognitionSupported()`.

Config: `lang: en-US`, `continuous: true`, `interimResults: true`

### `textToSpeech.js`
Wrapper around the Web Speech Synthesis API. Uses a `getSynth()` lazy getter so `window.speechSynthesis` is never accessed at module load time. When synthesis is unsupported, `speak()` still calls `onEnd?.()` so the interview flow (start listening) is never blocked.

Exports: `speak(text, onEnd?)`, `cancelSpeak()`, `isSpeaking()`, `isSpeechSynthesisSupported()`, `stopSpeaking` (alias)

### `toast.js`
Thin wrappers around `react-hot-toast`: `successToast(msg)`, `errorToast(msg)`, `loadingToast(msg)`.


---

## Server — Services

### `interview.service.js`

**`startInterview(userId, { jobDescription, difficulty })`**
Checks the user's plan limit, then creates the `Interview` record and increments `interviewsUsed` in a single `$transaction` to ensure atomicity.

**`getFirstQuestion(interviewId)`**
Fetches the interview. If `conversation` is already populated, returns the last entry (resume support — no AI call made). Otherwise calls `generateFirstQuestion()` from Groq, saves it as the first conversation entry, and returns it.

**`processInterview(interviewId, answer)`**
1. Saves the answer on the last conversation slot
2. Calls `processAnswer()` from Groq — gets `score`, `feedback`, `nextQuestion`, `expectedAnswer`
3. If `conversation.length >= maxQuestions` → calls `generateFinalReport()`, saves the `Report`, marks interview `COMPLETED`, all in a `$transaction`
4. Otherwise pushes the next question onto the conversation array, increments `currentQuestion`, saves, and returns `{ completed: false, nextQuestion, currentQuestion, score, feedback }`

---

### `groq.service.js`

All LLM interactions. Uses `groq-sdk` with `model: llama-3.3-70b-versatile` and `response_format: { type: "json_object" }` on every call.

**`generateRole(jobDescription)`** — Derives a job title from a JD. Called on `GET /interview/:id`.

**`generateFirstQuestion(jobDescription, difficulty)`** — Returns `{ question, expectedAnswer }`.

**`processAnswer(jobDescription, difficulty, conversation)`** — Evaluates the latest answer and returns `{ score, feedback, nextQuestion, expectedAnswer }`. The full conversation history is included in the prompt so the AI never repeats questions.

**`generateFinalReport(jobDescription, difficulty, conversation)`** — Analyses the complete interview and returns `{ score, technical, communication, confidence, problemSolving, strengths, weaknesses, recommendations, summary }`.

---

### `dashboard.service.js`

**`getDashboard(userId)`** — Fetches the user record and runs a Prisma `aggregate` on all their `Report` records to compute averages, best/lowest scores, and count. Also calculates remaining interviews from `PLAN_LIMITS`.

---

## Server — Middleware

### `auth.middleware.js`
Extracts the JWT from `req.cookies.token` (or `Authorization` header as fallback). Verifies with `JWT_SECRET`. Attaches the decoded payload to `req.user`. Returns 401 on any failure. No `console.log` — sensitive payloads never appear in logs.

---

## Interview Flow — End-to-End Logic

```
User fills NewInterview form
        │
        ▼
POST /api/interview/start
  → Check plan limit
  → Create Interview record  ─── $transaction ───  Increment interviewsUsed
  → Navigate to /interview/:id
        │
        ▼
useInterview mounts
  → GET /api/interview/:id        (fetch details + role label)
  → POST /api/interview/:id/question
      ├── conversation exists?  → return last saved question  (RESUME)
      └── no conversation?      → Groq generates question 1   (NEW)
        │
        ▼
speak(question)  →  onEnd: startListening()
        │
  [ Candidate speaks ]
        │
        ▼
User clicks "Submit Answer"
  → stopListening()
  → POST /api/interview/:id/process  { answer: transcript }
      → Save answer on conversation[lastIndex]
      → Groq evaluates: score + feedback + nextQuestion
      ├── conversation.length >= maxQuestions (10)?
      │     → generateFinalReport()
      │     → Save Report  ─── $transaction ───  Mark COMPLETED
      │     → return { completed: true, report }
      │     → endInterview() → navigate("/interview")
      └── not complete?
            → push next question onto conversation
            → increment currentQuestion
            → return { completed: false, nextQuestion, currentQuestion }
            → setQuestion(nextQuestion)  →  speak()  →  startListening()
                                                (loop repeats)
```


---

## Auth Flow

```
Register / Login
  → bcrypt.hash / bcrypt.compare
  → jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  → res.cookie("token", token, { httpOnly: true, secure: prod, sameSite: "strict", maxAge: 7d })
  → Response body: { success, user: { id, name, email } }   ← no token in body

Every page load (AuthProvider mount)
  → GET /api/auth/me  (cookie sent automatically)
  → jwt.verify → prisma.user.findUnique (select: id/name/email only)
  → setUser(data.user)

Protected routes
  → authMiddleware reads req.cookies.token
  → Attaches decoded payload to req.user
  → req.user.userId used in all service calls

Logout
  → POST /api/auth/logout
  → res.clearCookie("token", same options)
  → logout() clears context state
```

---

## SaaS Plan System

Plan limits are defined in `server/src/utils/planLimit.js`:

```js
export const PLAN_LIMITS = {
  FREE:     20,
  GOLD:     50,
  PLATINUM: 100,
};
```

- Enforced in `startInterview()` before creating the interview record
- `interviewsUsed` is incremented atomically in the same `$transaction` as the interview create
- The dashboard returns `remainingInterviews = PLAN_LIMITS[user.plan] - user.interviewsUsed`
- The `Subscription` model tracks plan, active status, and optional expiry date

---

## Environment Variables

### `server/.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/echohire

# JWT
JWT_SECRET=your_jwt_secret_here

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# CORS
Frontend_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

### `client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/EchoHire_AI.git
cd EchoHire_AI
```

### 2. Set up the server

```bash
cd server
npm install
```

Create `server/.env` with the variables listed above, then run migrations:

```bash
npx prisma migrate deploy
npx prisma generate
```

Start the server:

```bash
npm run dev
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create `client/.env` with `VITE_BACKEND_URL=http://localhost:5000`, then start:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Browser requirements

The interview feature relies on two browser APIs:
- **Web Speech API (SpeechRecognition)** — Chrome and Edge only. Not supported in Firefox or Safari.
- **Web Speech Synthesis API** — Supported in all modern browsers. Falls back gracefully (listening starts immediately if unsupported).

---

## Known Limitations / TODOs

- `Profile.jsx` — static placeholder data, no API integration yet
- `Contact.jsx` — form has no submit handler
- `ForgetPassword.jsx` — no backend route implemented
- `JDs.jsx` / `JDCard.jsx` — hardcoded past interviews, no real data fetching
- No `/report/:id` page yet — `endInterview()` currently navigates to `/interview`
- No rate limiting on auth or AI endpoints
- `generateRole()` is called on every `GET /interview/:id` — no caching (one extra LLM call per page load)
- `OverallReport` model has no service/controller wired up yet

