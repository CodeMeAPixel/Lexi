# 05 — Practice & Scored Tests

Priority: Large / Product feature
Estimated effort: 2–4+ weeks (MVP)

Goal
- Provide interactive exercises to help users practice English: rewriting prompts, fill-the-gap, multiple-choice, and scored mini-tests.

Acceptance criteria (MVP)
- A single `Practice` flow with: prompt, user input area, instant feedback, and score tracking.
- Basic levels (Beginner / Intermediate / Advanced) with adjustable difficulty.
- Track recent scores in `History`.

Implementation notes / next steps
1. Design a simple exercise schema (question, expected answers, hints) and a basic scorer.
2. Provide server-side content generation for exercises using the model.
3. Add progress tracking and level-up logic.
4. Later: spaced repetition, leaderboards, and achievements.
