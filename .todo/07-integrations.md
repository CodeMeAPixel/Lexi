# 07 — Integrations (Slack, Notion, Google Docs)

Priority: Medium
Estimated effort: 1–3 days per integration (MVP)

Goal
- Allow users to rephrase from external apps or send results to tools like Notion or Slack.

Acceptance criteria
- Slack: a slash command or bot that accepts a sentence and returns a rephrase.
- Notion/Google Docs: a simple add-on or copy-paste integration flow.

Implementation notes / next steps
1. Start with a Slack slash command prototype using server endpoint + token validation.
2. Build a Notion integration using their API to create or update pages with rephrases.
3. Add OAuth flows and manage tokens securely server-side.

Security
- Store integration tokens server-side and offer per-user connectivity management.
