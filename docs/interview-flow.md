# Interview Flow

Complete walkthrough of a single interview session from start to finish.

## 1. Create Interview

```
User fills NewInterview.jsx form:
  - Pastes job description
  - Selects difficulty (EASY / MEDIUM / HARD)
  - Clicks "Generate Interview"

POST /api/interview/start
  → interview.service.startInterview(userId, { jobDescription, difficulty })
      1. Fetch user from DB
      2. Check interviewsUsed < PLAN_LIMITS[user.plan]
      3. $transaction:
           prisma.interview.create(...)
           prisma.user.update({ interviewsUsed: increment(1) })
      4. Return new Interview record

Client navigates to /interview/:id
```

## 2. Load Interview Page

```
useInterview(id) mounts:

Effect 1 — Fetch details
  GET /api/interview/:id
    → findFirst({ id, userId })       ← null-check BEFORE AI call
    → generateRole(jobDescription)    ← AI derives job title
    → return { ...interview, role }
  → setInterview(data)

Effect 2 — Init first question (runs once, guarded by hasInitialized ref)
  POST /api/interview/:id/question
    → interview.service.getFirstQuestion(id)
        if conversation exists:
          return last saved question   ← RESUME support
        else:
          generateFirstQuestion(jd, difficulty) via Groq
          save conversation[0] to DB
          return { question, currentQuestion: 1 }
  → setQuestion(question)
  → setLoading(false)
```

## 3. AI Speaks the Question

```
Effect 3 — fires when `question` changes
  Guard: if question === lastSpokenQuestion.current → skip (prevents re-trigger)

  speak(question, onEnd callback)
    → window.speechSynthesis.speak(utterance)
    → onEnd fires when speech completes
    → startListening()   ← mic opens automatically
```

## 4. Candidate Answers

```
useSpeechRecognition:
  recognition.onresult fires as user speaks
  → setTranscript(prev => prev + newSegment)
  → transcript updates live in TranscriptPanel
```

## 5. Submit Answer

```
User clicks "Submit Answer" (InterviewControls)
  → processCurrentAnswer()
      1. stopListening()
      2. Capture: candidateAnswer = transcriptRef.current.trim()
      3. resetTranscript()

POST /api/interview/:id/process  { answer: candidateAnswer }
  → interview.service.processInterview(id, answer)
      1. Load interview from DB
      2. conversation[lastIndex].answer = answer
      3. processAnswer(jd, difficulty, conversation) via Groq
         returns { score, feedback, nextQuestion, expectedAnswer }
      4. conversation[lastIndex].score    = score
      4. conversation[lastIndex].feedback = feedback

      if conversation.length >= maxQuestions:
        → generateFinalReport(jd, difficulty, conversation) via Groq
        → $transaction:
             prisma.report.create(reportData)
             prisma.interview.update({ status: COMPLETED })
        → return { completed: true, report }

      else:
        → conversation.push({ question: nextQuestion, ... })
        → prisma.interview.update({ conversation, currentQuestion: nextCount })
        → return { completed: false, nextQuestion, currentQuestion }
```

## 6. Next Question or End

```
If completed: true
  → endInterview()
      stopListening()
      cancelSpeak()
      navigate("/interview")
      TODO: navigate to /report/:id once Report page is built

If completed: false
  → setQuestion(nextQuestion)      ← triggers Effect 3 again
  → TTS speaks next question
  → mic opens after speech ends
  → loop continues from step 4
```

## 7. Browser Refresh / Resume

```
If user refreshes /interview/:id:

  Effect 2 calls POST /api/interview/:id/question
  Server: getFirstQuestion(id)
    → interview.conversation is NOT empty (has saved entries)
    → returns last saved question
    → currentQuestion from interview.currentQuestion

  No new AI call is made — interview resumes exactly where it left off.
```

## State Guards

| Guard | Purpose |
|---|---|
| `hasInitialized` ref | Prevents Effect 2 from calling `/question` twice in React Strict Mode |
| `lastSpokenQuestion` ref | Prevents TTS re-firing for the same question on re-render |
| `isListeningRef` | Prevents stale-closure bugs in `startListening`/`stopListening` |
| `transcriptRef` | Lets `processCurrentAnswer` read current transcript without being in its dep array |
| `processing` state | Prevents double-submit if button clicked twice |
| `AbortController` | Cancels in-flight fetches when component unmounts |
