# Folder Structure

Complete annotated file tree for the EchoHire AI project.

```
EchoHire_AI/
│
├── client/                              # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── loading.gif                 # Served at /loading.gif — used by LoadingScreen
│   │
│   └── src/
│       ├── components/
│       │   ├── auth/                   # Authentication form modals
│       │   │   ├── Login.jsx           # Login form — POST /api/auth/login
│       │   │   ├── Signup.jsx          # Register form — POST /api/auth/register
│       │   │   └── ForgetPassword.jsx  # Forgot password form (UI + toast, endpoint TODO)
│       │   │
│       │   ├── common/                 # Shared UI used across multiple pages
│       │   │   ├── LoadingScreen.jsx   # Full-screen loading spinner (/loading.gif)
│       │   │   ├── ThemeToggle.jsx     # Dark/light mode toggle button
│       │   │   └── PrivateRoutes.jsx   # Route guard — redirects unauthenticated users
│       │   │
│       │   ├── home/                   # Components used only on the Home page
│       │   │   ├── Hero.jsx            # Landing hero: headline, CTA, stats
│       │   │   ├── Plan.jsx            # Pricing section — opens PaymentModal on upgrade
│       │   │   ├── PlanCard.jsx        # Individual pricing card
│       │   │   ├── Testimonials.jsx    # Infinite-scroll testimonial carousel
│       │   │   ├── JDs.jsx             # Past job descriptions list (placeholder data)
│       │   │   └── JDCard.jsx          # Individual job description card
│       │   │
│       │   ├── interview/              # Components used only on the Interview page
│       │   │   ├── AiPreview.jsx       # AI avatar + question display + status badge
│       │   │   ├── CameraPreview.jsx   # Webcam feed + camera/mic toggle buttons
│       │   │   ├── InterviewHeader.jsx # Page title + error banner
│       │   │   ├── InterviewMeta.jsx   # Role / difficulty / question counter
│       │   │   ├── InterviewControls.jsx # Record, pause, submit, end buttons
│       │   │   └── TranscriptPanel.jsx # Live transcript panel
│       │   │
│       │   ├── payment/                # Payment UI
│       │   │   └── PaymentModal.jsx    # Checkout modal (card / UPI / Stripe)
│       │   │
│       │   └── layout/                 # Persistent layout components
│       │       ├── Navbar.jsx          # Fixed top nav + auth modal system
│       │       └── Footer.jsx          # Site footer
│       │
│       ├── context/                    # React Context — global auth state
│       │   ├── AuthContext.js          # Creates AuthContext + useAuth() hook
│       │   └── AuthProvider.jsx        # Wraps app, restores session via /me
│       │
│       ├── hooks/                      # Custom React hooks — business logic
│       │   ├── useInterview.js         # ALL interview logic (fetch, TTS, recording, submit)
│       │   ├── useCamera.js            # Camera + microphone stream management
│       │   └── useMediaRecorder.js     # Audio recording — returns Blob via stopRecording()
│       │
│       ├── pages/                      # Route-level components (one per URL)
│       │   ├── Home.jsx                # / — assembles Hero + Plan + Testimonials
│       │   ├── NewInterview.jsx        # /interview — create interview form
│       │   ├── Interview.jsx           # /interview/:id — live session (pure UI)
│       │   ├── Profile.jsx             # /profile/:id — user stats (protected)
│       │   ├── AdminDashboard.jsx      # /admin — admin control panel (protected, ADMIN role)
│       │   ├── Contact.jsx             # /contact
│       │   └── Page404.jsx             # * — 404 not found
│       │
│       ├── services/                   # Client-side API helpers (non-React)
│       │   └── speech.service.js       # uploadAudio(blob) → POST /api/speech/transcribe
│       │
│       ├── utils/                      # Pure utility functions (no React)
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
        │   ├── dashboard.controller.js # Handler for /api/dashboard
        │   ├── admin.controller.js     # Handlers for /api/admin routes
        │   ├── contact.controller.js   # Handler for /api/contact
        │   ├── payment.controller.js   # Handlers for /api/payment routes
        │   └── speech.controller.js    # Handler for /api/speech/transcribe
        │
        ├── middlewares/
        │   ├── auth.middleware.js      # JWT verification — attaches req.user
        │   ├── admin.middleware.js     # ADMIN role check for admin-only routes
        │   └── upload.middleware.js    # Multer config for audio file uploads
        │
        ├── routes/
        │   ├── auth.routes.js          # /api/auth (login, logout, register, me)
        │   ├── interview.routes.js     # /api/interview (start, question, process)
        │   ├── dashboard.routes.js     # /api/dashboard
        │   ├── admin.routes.js         # /api/admin (users, contacts, overview)
        │   ├── contact.routes.js       # /api/contact
        │   ├── payment.routes.js       # /api/payment (create-order, verify)
        │   └── speech.routes.js        # /api/speech/transcribe
        │
        ├── services/
        │   ├── interview.service.js    # Core interview logic (DB + AI orchestration)
        │   ├── groq.service.js         # All Groq LLM calls (questions, evaluation, report)
        │   ├── dashboard.service.js    # Stats aggregation for profile/dashboard
        │   ├── admin.service.js        # Admin analytics + user management
        │   ├── cloudinary.service.js   # Audio upload/delete via Cloudinary
        │   ├── contact.service.js      # Save contact message + send admin email
        │   ├── payment.service.js      # Stripe PaymentIntents + plan upgrade
        │   └── speech.service.js       # Upload to Cloudinary → Groq Whisper transcription
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
