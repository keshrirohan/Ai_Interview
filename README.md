# EchoHire AI — AI-Powered Mock Interview & Career Platform

EchoHire AI is a state-of-the-art voice-driven AI mock interview application designed to simulate real candidate screening sessions. Candidates specify job descriptions and target difficulty levels to undergo dynamic 10-question AI interviews powered by Groq LLaMA 3.3. EchoHire AI features real-time speech-to-text, text-to-speech AI feedback, detailed competency analytics, performance reports, and an upgrade-only tier subscription model integrated with Stripe payments.

---

## 📚 Core Developer Documentation

| Document | Purpose & Content |
|---|---|
| 📖 [Developer Guide](./docs/DEVELOPER_GUIDE.md) | **Complete technical manual** featuring Markdown tables for DB schemas, API endpoints, payment workflows, and environment variables |
| 🏗️ [Architecture](./docs/architecture.md) | System overview, component breakdown, and Mermaid data flows |
| 🔄 [Interview Flow](./docs/interview-flow.md) | Step-by-step state engine walkthrough (Web Speech API → Server → Groq LLaMA 3.3) |
| 🔌 [API Reference](./docs/api.md) | Full REST API endpoint specification with payloads and status codes |
| 📂 [Folder Structure](./docs/folder-structure.md) | Comprehensive tree breakdown of client, server, and database modules |

---

## 🛠️ Technology Stack

| Tier | Technologies & Libraries |
|---|---|
| **Frontend Core** | React 19, Vite, Vanilla & Tailwind CSS v4, JavaScript (ESNext) |
| **Routing & State** | React Router DOM v7, React Context API (`AuthContext`) |
| **UI Components & Icons** | Lucide React, Custom Dark/Light Glassmorphism Theme |
| **Animations & Notifications** | GSAP (`@gsap/react`), React Hot Toast |
| **Voice & Speech Engines** | Web Speech API (`SpeechRecognition` & Speech Synthesis) |
| **Backend Core** | Node.js (ES Modules), Express.js 5 |
| **AI LLM Inference** | Groq SDK (`llama-3.3-70b-versatile`) |
| **Database & ORM** | PostgreSQL, Prisma ORM 7 (`@prisma/client`) |
| **Authentication** | JWT stored in secure `httpOnly` cookies + `bcrypt` hashing |
| **Payment Gateway** | Stripe SDK (PaymentIntents & Express Checkout Verification) |

---

## 💳 SaaS Subscription Model (Strict Upgrade-Only)

EchoHire AI enforces a **strict upgrade-only plan hierarchy**:

```
FREE (Rank 0) ──> GOLD (Rank 1) ──> PLATINUM (Rank 2)
```

### 🚫 Anti-Downgrade & Re-subscribe Protection
- **No Downgrades Allowed**: Users on `GOLD` or `PLATINUM` cannot downgrade to a lower tier. Lower tier plan cards display `"Included in Your Plan"` and disable checkout buttons.
- **No Re-subscribing to Current Tier**: Active subscribers cannot purchase their current tier again. Current tier cards display `"Active Plan"` with disabled buttons.
- **Strict Server Validation**: `payment.service.js` compares `PLAN_RANKS[targetPlan]` against `PLAN_RANKS[user.plan]`. Any attempt to request an order or verify a payment for an equal or lower plan returns `400 Bad Request`.

---

## 💳 Payment Gateway Integration (Stripe)

EchoHire AI supports **Stripe PaymentIntents Checkout** with server-side authorization and automatic test simulator fallback:

### Live / Test Mode Setup
1. Sign up on [Stripe Dashboard](https://dashboard.stripe.com).
2. Obtain API Publishable & Secret Keys under **Developers -> API keys**.
3. Add keys to `server/.env` and `client/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
   ```
4. When keys are present, the backend creates official Stripe PaymentIntents (`pi_...`) and verifies transaction completion via the Stripe SDK. In development mode without credentials, an automated test simulator fallback is enabled.

---

## 📁 Repository Structure

```
EchoHire_AI/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Auth, Home, Interview, Payment, Admin components
│   │   ├── context/            # AuthContext.jsx
│   │   ├── hooks/              # useInterview.js, useSpeechRecognition.js
│   │   ├── pages/              # Home, NewInterview, Profile, AdminDashboard, etc.
│   │   └── utils/              # speechToText.js, textToSpeech.js, toast.js
│   └── package.json
│
├── server/                     # Express.js API Server
│   ├── prisma/                 # schema.prisma, migrations/
│   ├── lib/                    # prisma.js singleton
│   └── src/
│       ├── controller/         # auth, interview, payment, admin, dashboard controllers
│       ├── middlewares/        # auth.middleware.js, admin.middleware.js
│       ├── routes/             # auth, interview, payment, admin, dashboard routes
│       ├── services/           # groq, interview, payment, admin, dashboard services
│       └── server.js
│
└── docs/                       # Developer Documentation & Architecture
    ├── DEVELOPER_GUIDE.md      # Comprehensive Developer Technical Manual
    ├── architecture.md
    ├── api.md
    ├── folder-structure.md
    └── interview-flow.md
```

---

## ⚙️ Environment Configuration

### `server/.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/echohire"
JWT_SECRET="your-super-secret-jwt-key"
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxx"
PORT=5000
NODE_ENV="development"
Frontend_URL="http://localhost:5173"
STRIPE_SECRET_KEY="sk_test_xxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxx"
```

### `client/.env`
```env
VITE_BACKEND_URL="http://localhost:5000"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxx"
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ & npm
- PostgreSQL database
- Groq API Key (Free at [console.groq.com](https://console.groq.com))

### 1. Initialize Server
```bash
cd server
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

### 2. Initialize Client
```bash
cd ../client
npm install
npm run dev
```

Visit application at `http://localhost:5173`.
