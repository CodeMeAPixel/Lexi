# 01 — User History (Save & Manage Rewrites)

Priority: High
Estimated effort: 3–6 hours (client-side local history) / 1–2 days (server-backed)

Goal
- Let users save rephrased results for later reference, copy, export, and comparison.

Acceptance criteria
- Users can save a generated rephrase from the result screen.
- A simple `History` UI lists the last N (configurable) saved items with timestamp, tone, and length.
- Each history entry can be copied, re-opened in the editor, or deleted.
- Data persists between sessions (localStorage for anonymous users). Server-side persistence is optional.

Implementation notes / next steps
1. Implement a small client-side store (IndexedDB/localStorage) to push/pop history items.
2. Add a `History` button or side panel on the `Rephraser` page.
3. Add an export option (CSV/TXT) for selected items.
4. Later: add server persistence behind authentication.

Edge cases
- Very long texts (truncate for list view).
- Privacy: make storing opt-in or clearly explain data scope.
