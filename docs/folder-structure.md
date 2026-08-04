# Folder Structure

Complete annotated file tree for the EchoHire AI project.

```
EchoHire_AI/
│
├── client/                              # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── loading.gif                 # Used by LoadingScreen component
│   │
│   └── src/
│       ├── components/
│       │   ├── auth/                   # Authentication form modals
│       │   │   ├── Login.jsx           # Login form — POST /api/auth/login
│       │   │   ├── Signup.jsx          # Register form — POST /api/auth/register
│       │   │   └── ForgetPassword.jsx  # Forgot password form (UI only, TODO)
│       │   │
│       │   ├── common/                 # Shared UI used across multiple pages
│       │   │   ├── LoadingScreen.jsx   # Full-screen loading spinner
│       │   │   ├── ThemeToggle.jsx     # Dark/light mode toggle button
│       │   │   └── PrivateRoutes.jsx   # Route guard — redirects unauthenticated users
│       │   │
│       │   ├── home/                   # Components used only on the Home page
│       │   │   ├── Hero.jsx            # Landing hero: headline, CTA, stats
│       │   │   ├── Plan.jsx            # Pricing section container
│       │   │   ├── PlanCard.jsx        # Individual pricing card
│       │   │   ├── Testimonials.jsx    # Infinite-scroll testimonial carousel
│       │   │   ├── JDs.jsx             # Past job descriptions list
│       │   │   └── JDCard.jsx          # Individual job description card
│       │   │
│       │   ├── interview/              # Components used only on the Interview page
│       │   │   ├── AiPreview.jsx       # AI avatar + question display + status badge
│       │   │   ├── CameraPreview.jsx   # Webcam feed + camera/mic toggle buttons
│       │   │   ├── InterviewHeader.jsx # Page title + error banner
│       │   │   ├── InterviewMeta.jsx   # Role / difficulty / question counter
│       │   │   ├── InterviewControls.jsx # Pause, Submit Answer, End Interview buttons
│       │   │   └── TranscriptPanel.jsx # Live transcript + listening indicator
│       │   │
│       │   └── layout/                 # Persistent layout components
│       │       ├── Navbar.jsx          # Fixed top nav + auth modal system
│       │       └── Footer.jsx          # Site footer
│       │
│       ├── context/                    # React Context — global state
│       │   ├── AuthContext.js          # Creates AuthContext + useAuth() hook
│       │   └── AuthProvider.jsx        # Wraps app, restores session via /me
│       │
│       ├── hooks/                      # Custom React hooks — business logic
│       │   ├── useInterview.js         # ALL interview logic (fetch, TTS, mic, submit)
│       │   └── useSpeechRecognition.js # Microphone access + live transcript only
│       │
│       ├── pages/                      # Route-level components (one per URL)
│       │   ├── Home.jsx                # / — assembles Hero + Plan + Testimonials
│       │   ├── NewInterview.jsx        # /interview — create interview form
│       │   ├── Interview.jsx           # /interview/:id — live session (pure UI)
│       │   ├── Profile.jsx             # /profile/:id — user stats (protected)
│       │   ├── Contact.jsx             # /contact
│       │   └── Page404.jsx             # * — 404 not found
│       │
│       ├── utils/                      # Pure utility functions (no React)
│       │   ├── speechToText.js         # SpeechRecognition factory + browser check
│       │   ├── textToSpeech.js         # SpeechSynthesis wrapper + browser check
│       │   └── toast.js                # successToast / errorToast / loadingToast
│       │
│       ├── App.jsx                     # All route definitions
│       ├── main.jsx                    # Entry point — provider tree + render
│       └── index.css                   # Global styles + Tailwind base
│
└── server/                             # Express backend (Node.js, ES Modules)
    ├── prisma/
    │   ├── schema.prisma               # All data models + indexes
    │   └── migrations/                 # Prisma migration history
    │
    ├── generated/
    │   └── prisma/                     # Auto-generated Prisma client (do not edit)
    │
    ├── lib/
    │   └── prisma.js                   # PrismaClient singleton (shared across app)
    │
    └── src/
        ├── controller/
        │   ├── interview.controller.js # Handlers for /api/interview routes
        │   └── dashboard.controller.js # Handler for /api/dashboard
        │
        ├── middlewares/
        │   └── auth.middleware.js      # JWT verification — attaches req.user
        │
        ├── routes/
        │   ├── auth.routes.js          # /api/auth (login, logout, register, me)
        │   ├── interview.routes.js     # /api/interview (start, question, process)
        │   └── dashboard.routes.js     # /api/dashboard
        │
        ├── services/
        │   ├── interview.service.js    # Core interview logic (DB + AI orchestration)
        │   ├── groq.service.js         # All Groq LLM calls
        │   └── dashboard.service.js    # Stats aggregation
        │
        ├── utils/
        │   └── planLimit.js            # FREE / GOLD / PLATINUM interview limits
        │
        └── server.js                   # Express app setup + global error handler
```

## Key Rules

| Folder | Allowed to contain |
|---|---|
| `pages/` | Route components only — no business logic |
| `hooks/` | State + API calls + side effects |
| `context/` | React Context only |
| `components/` | Pure UI — receives props, renders JSX |
| `utils/` | Pure functions — no React imports |
| `services/` (server) | DB queries + AI calls — no req/res |
| `controller/` (server) | Extract from req → call service → send res |
