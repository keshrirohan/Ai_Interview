# API Reference

Base URL: `http://localhost:5000`

All authenticated routes require a valid JWT stored in the `token` httpOnly cookie.
The cookie is set automatically by the server on login/register and read on every request.

---

## Auth — `/api/auth`

### POST `/api/auth/login`
Authenticate with email and password.

**Body:**
```json
{ "email": "user@example.com", "password": "secret" }
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { "id": "...", "name": "Rohan", "email": "user@example.com" }
}
```
Sets `token` httpOnly cookie. JWT is never in the response body.

---

### POST `/api/auth/register`
Create a new account.

**Body:**
```json
{ "name": "Rohan", "email": "user@example.com", "password": "secret" }
```

**Response:** `201`
```json
{
  "success": true,
  "message": "Account created successfully.",
  "user": { "id": "...", "name": "Rohan", "email": "user@example.com" }
}
```

---

### POST `/api/auth/logout`
Clear the session cookie.

**Response:**
```json
{ "success": true, "message": "Logged out successfully." }
```

---

### GET `/api/auth/me`
Restore session from cookie. Called on every page load by `AuthProvider`.

**Response:**
```json
{ "success": true, "user": { "id": "...", "name": "Rohan", "email": "..." } }
```

---

## Interview — `/api/interview` 🔒

All routes require authentication.

### POST `/api/interview/start`
Create a new interview session. Enforces plan limits atomically.

**Body:**
```json
{ "jobDescription": "...", "difficulty": "MEDIUM" }
```

**Response:** `201`
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "jobDescription": "...",
    "difficulty": "MEDIUM",
    "status": "IN_PROGRESS",
    "currentQuestion": 1,
    "maxQuestions": 10
  }
}
```

---

### GET `/api/interview/:interviewId`
Fetch interview details plus an AI-generated role label.

**Response:**
```json
{
  "success": true,
  "data": { "...interview fields...", "role": "Frontend Developer" }
}
```

---

### POST `/api/interview/:interviewId/question`
Get or generate the first question.
- If `conversation` is already saved → returns the last question (resume support)
- If no conversation → calls Groq and saves it

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "Explain the virtual DOM.",
    "expectedAnswer": "...",
    "currentQuestion": 1
  }
}
```

---

### POST `/api/interview/:interviewId/process`
Submit an answer and receive the next question or final report.

**Body:**
```json
{ "answer": "The virtual DOM is a lightweight copy..." }
```

**Response (more questions):**
```json
{
  "success": true,
  "data": {
    "completed": false,
    "score": 8,
    "feedback": "Good. Mention reconciliation for full marks.",
    "nextQuestion": "Explain React Fiber.",
    "currentQuestion": 2
  }
}
```

**Response (interview complete):**
```json
{
  "success": true,
  "data": {
    "completed": true,
    "report": {
      "score": 8.5,
      "technical": 8, "communication": 9,
      "confidence": 8, "problemSolving": 8,
      "strengths": ["..."], "weaknesses": ["..."],
      "recommendations": ["..."], "summary": "..."
    }
  }
}
```

---

## Dashboard — `/api/dashboard` 🔒

### GET `/api/dashboard`
Returns aggregated stats for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": "FREE",
    "interviewsUsed": 3,
    "remainingInterviews": 17,
    "totalCompletedInterviews": 2,
    "averageScore": 7.5,
    "averageTechnical": 7.2,
    "averageCommunication": 8.1,
    "averageConfidence": 7.0,
    "averageProblemSolving": 7.8,
    "bestScore": 9.0,
    "lowestScore": 6.0
  }
}
```

---

## Error Responses

All error responses follow the same shape:

```json
{ "success": false, "message": "Human-readable error description." }
```

| Status | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Not authenticated or token expired |
| 404 | Resource not found |
| 500 | Server error |
