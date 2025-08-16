# 99 — Developer Tasks & Engineering Debt

Priority: High (foundational)

Top tasks

- Add Zod validation to server routes (`/api/rephraser`) and return informative 4xx errors.
- Add unit tests for `buildPrompt` and `RephraseSettings` behavior.
- Add a small CI (GitHub Actions) to run lint, typecheck, and tests on PRs.
- Add a `docs/ENV.md` describing required environment variables and how to run locally (Bun vs Node).
- Add rate-limiting middleware for public API endpoints.
- Run an accessibility audit on `RephraseSettings` Listbox and fix ARIA usage.

Quick wins
- Improve error messages surfaced to the user when streaming fails.
- Add a local-history (client-side) of last 20 rephrases.
- Extract `buildPrompt` into a pure util and add unit tests.

Security reminders
- Keep OpenAI keys server-side only.
- Avoid logging full prompts in production logs.

*** End Patch
