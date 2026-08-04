# Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│                                                                  │
│  React SPA (Vite + Tailwind)                                     │
│                                                                  │
│  AuthProvider                                                    │
│  └── BrowserRouter                                               │
│      ├── Navbar  (always visible)                                │
│      ├── App     (routes)                                        │
│      │   ├── Home           → Hero + Plan + Testimonials         │
│      │   ├── NewInterview   → form + JDs                        │
│      │   ├── Interview      → useInterview() + sub-components    │
│      │   │   ├── useInterview (all logic)                       │
│      │   │   │   ├── useSpeechRecognition (mic + transcript)    │
│      │   │   │   └── textToSpeech.js     (AI voice output)      │
│      │   │   ├── InterviewHeader                                 │
│      │   │   ├── InterviewMeta                                   │
│      │   │   ├── InterviewControls                               │
│      │   │   ├── AiPreview                                       │
│      │   │   ├── CameraPreview                                   │
│      │   │   └── TranscriptPanel                                 │
│      │   └── Profile  (private)                                  │
│      └── Footer (always visible)                                 │
└──────────────────┬───────────────────────────────────────────────┘
                   │  HTTP + httpOnly cookie (JWT)
┌──────────────────▼───────────────────────────────────────────────┐
│                      Express Server                              │
│                                                                  │
│  Middleware: cors → cookieParser → express.json                  │
│                                                                  │
│  Routes                                                          │
│  ├── /api/auth       auth.routes.js                              │
│  ├── /api/interview  interview.routes.js → authMiddleware         │
│  └── /api/dashboard  dashboard.routes.js → authMiddleware         │
│                                                                  │
│  Controllers → Services → Prisma ORM → PostgreSQL               │
│                        ↘                                         │
│                    groq.service.js → Groq API (LLaMA 3.3)        │
└──────────────────────────────────────────────────────────────────┘
```

## Separation of Concerns

```mermaid
graph TD
    A[Interview.jsx<br/>Pure UI] --> B[useInterview.js<br/>All logic]
    B --> C[useSpeechRecognition.js<br/>Mic only]
    B --> D[textToSpeech.js<br/>TTS only]
    B --> E[fetch API calls]
    E --> F[interview.routes.js]
    F --> G[interview.controller.js]
    G --> H[interview.service.js]
    H --> I[groq.service.js<br/>AI only]
    H --> J[prisma.js<br/>DB only]
```

## Data Flow — Interview Session

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Interview.jsx
    participant H as useInterview
    participant S as Server
    participant AI as Groq LLM

    U->>UI: navigates to /interview/:id
    UI->>H: useInterview(id)
    H->>S: GET /api/interview/:id
    S-->>H: interview record + role
    H->>S: POST /api/interview/:id/question
    S->>AI: generateFirstQuestion (if new)
    AI-->>S: { question, expectedAnswer }
    S-->>H: { question, currentQuestion }
    H->>H: speak(question)
    H->>H: onEnd → startListening()
    U->>H: speaks answer
    H->>UI: transcript updates live
    U->>UI: clicks Submit Answer
    UI->>H: processCurrentAnswer()
    H->>S: POST /api/interview/:id/process
    S->>AI: processAnswer(conversation)
    AI-->>S: { score, feedback, nextQuestion }
    S-->>H: { completed, nextQuestion }
    H->>H: setQuestion(nextQuestion) → speak() loop
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant DB as PostgreSQL

    U->>C: Submit login form
    C->>S: POST /api/auth/login { email, password }
    S->>DB: findUnique({ email })
    DB-->>S: user record
    S->>S: bcrypt.compare(password, hash)
    S->>S: jwt.sign({ userId }, JWT_SECRET)
    S-->>C: Set-Cookie: token=... (httpOnly)
    C->>C: login(user) → AuthContext
    Note over C: Token never stored in localStorage

    U->>C: Refresh page
    C->>S: GET /api/auth/me (cookie auto-sent)
    S->>S: jwt.verify(token)
    S->>DB: findUnique({ id })
    DB-->>S: user
    S-->>C: { success: true, user }
    C->>C: setUser(data.user)
```
