# EchoHire AI

An AI-powered mock interview platform. Paste a job description, choose a difficulty, and conduct a fully voice-driven interview. The AI asks questions, listens to your spoken answers, evaluates them with Groq (LLaMA 3.3), and generates a detailed performance report.

---

## Documentation

| Document | Description |
|---|---|
| [Architecture](./docs/architecture.md) | System diagram, data flow, auth flow with Mermaid charts |
| [Interview Flow](./docs/interview-flow.md) | Step-by-step walkthrough of a complete session |
| [API Reference](./docs/api.md) | Every endpoint, request shape, and response shape |
| [Folder Structure](./docs/folder-structure.md) | Annotated file tree with purpose of every folder and file |

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
| Auth | JWT in httpOnly cookies + bcrypt |
| Speech Input | Web Speech API (SpeechRecognition) |
| Speech Output | Web Speech Synthesis API |

---

## Folder Structure

```
EchoHire_AI/
├── client/
│   └── src/
│       ├── components/
│       │   ├── auth/          Login, Signup, ForgetPassword
│       │   ├── common/        LoadingScreen, ThemeToggle, PrivateRoutes
│       │   ├── home/          Hero, Plan, PlanCard, Testimonials, JDs, JDCard
│       │   ├── interview/     AiPreview, CameraPreview, InterviewHeader,
│       │   │                  InterviewMeta, InterviewControls, TranscriptPanel
│       │   └── layout/        Navbar, Footer
│       ├── context/           AuthContext.js, AuthProvider.jsx
│       ├── hooks/             useInterview.js, useSpeechRecognition.js
│       ├── pages/             Home, NewInterview, Interview, Profile, Contact, Page404
│       └── utils/             speechToText.js, textToSpeech.js, toast.js
│
├── server/
│   ├── lib/                   prisma.js (singleton)
│   ├── prisma/                schema.prisma, migrations/
│   └── src/
│       ├── controller/        interview.controller.js, dashboard.controller.js
│       ├── middlewares/       auth.middleware.js
│       ├── routes/            auth.routes.js, interview.routes.js, dashboard.routes.js
│       ├── services/          interview.service.js, groq.service.js, dashboard.service.js
│       ├── utils/             planLimit.js
│       └── server.js
│
└── docs/
    ├── architecture.md
    ├── interview-flow.md
    ├── api.md
    └── folder-structure.md
```

See [docs/folder-structure.md](./docs/folder-structure.md) for the full annotated tree.

---

## Architecture

```
Browser (React SPA)
  │
  │  useInterview hook ← all interview logic
  │  ├── useSpeechRecognition ← mic + transcript only
  │  └── textToSpeech.js     ← AI voice only
  │
  │  HTTP + httpOnly cookie (JWT)
  │
Express Server
  ├── /api/auth       → auth.routes.js
  ├── /api/interview  → interview.routes.js → authMiddleware
  └── /api/dashboard  → dashboard.routes.js → authMiddleware
        │
        ├── interview.service.js  (DB + AI orchestration)
        ├── groq.service.js       (all LLM calls)
        └── prisma.js             (PostgreSQL)
```

See [docs/architecture.md](./docs/architecture.md) for full Mermaid diagrams.

---

## Interview Flow (Short)

1. User pastes job description → `POST /start` creates session
2. `useInterview` fetches details → calls `/question`
3. Server returns first question (generates via Groq if new, resumes if refresh)
4. TTS speaks question → mic opens automatically when speech ends
5. User speaks → live transcript updates in `TranscriptPanel`
6. User clicks Submit → `POST /process` evaluates answer → returns next question
7. Repeat until question 10 → server generates final report → navigate away

See [docs/interview-flow.md](./docs/interview-flow.md) for the complete flow with code references.

---

## Database Schema

### Interview
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String | FK → User |
| conversation | Json? | `[{question, expectedAnswer, answer, score, feedback}]` |
| jobDescription | String | |
| currentQuestion | Int | Default 1, incremented per answer |
| maxQuestions | Int | Default 10 |
| difficulty | Enum | EASY / MEDIUM / HARD |
| status | Enum | IN_PROGRESS / COMPLETED |

**Indexes:** `@@index([userId])`, `@@index([status])`, `@@index([userId, status])`

### Report
Generated after the final question. Stores: `score`, `technical`, `communication`, `confidence`, `problemSolving`, `strengths`, `weaknesses`, `recommendations`, `summary`.

---

## Environment Variables

### `server/.env`
```env
DATABASE_URL=postgresql://user:password@host:5432/echohire
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
Frontend_URL=http://localhost:5173
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
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone
```bash
git clone https://github.com/your-username/EchoHire_AI.git
cd EchoHire_AI
```

### 2. Server
```bash
cd server
npm install
# create server/.env with variables above
npx prisma migrate deploy
npx prisma generate
npm run dev
```

### 3. Client
```bash
cd ../client
npm install
# create client/.env with VITE_BACKEND_URL
npm run dev
```

App runs at `http://localhost:5173`.

### Browser Requirements
- **Speech Recognition** — Chrome or Edge only (Web Speech API)
- **Speech Synthesis** — all modern browsers (falls back gracefully if unsupported)

---

## SaaS Plans

Limits are defined in `server/src/utils/planLimit.js`:

```js
export const PLAN_LIMITS = {
  FREE:     20,
  GOLD:     50,
  PLATINUM: 100,
};
```

Enforced atomically in `startInterview()` using a Prisma `$transaction`.

---

## Known Limitations / TODOs

- `Profile.jsx` — static placeholder data, no API integration
- `Contact.jsx` — form has no submit handler
- `ForgetPassword.jsx` — no backend route implemented
- `JDs.jsx` / `JDCard.jsx` — hardcoded past interviews
- No `/report/:id` page — `endInterview()` navigates to `/interview` for now
- `generateRole()` is called on every `GET /interview/:id` — no caching
- `OverallReport` model defined in schema but has no service/controller yet

---

## Future Roadmap

- [ ] Report page at `/report/:id`
- [ ] Real interview history from DB in `JDs.jsx`
- [ ] Profile page connected to `/api/dashboard`
- [ ] Password reset flow
- [ ] Google OAuth
- [ ] Rate limiting on auth and AI endpoints
- [ ] Role caching (avoid extra LLM call per page load)
- [ ] Resume upload + analysis
