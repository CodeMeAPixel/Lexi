# 02 — Profiles & User Preferences

Priority: Medium
Estimated effort: 4–8 hours (local prefs) / 1–2 days (profiles + auth)

Goal
- Persist user preferences (default tone, length, preservation toggles) and allow simple profiles.

Acceptance criteria
- Preferences persist between sessions (localStorage or cookies).
- UI to set default preferences in a small `Preferences` modal or page.
- When authenticated (optional), preferences sync to server.

Implementation notes / next steps
1. Add a `Preferences` modal in `Rephraser` to store defaults.
2. Use a small abstraction over localStorage so later it can be swapped for server persistence.
3. Provide `Reset to defaults` and `Import/Export` of preferences.
