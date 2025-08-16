# 04 — Grammar Corrections + Explain Edits

Priority: High
Estimated effort: 1–3 days

Goal
- For educational value, show grammar corrections and a short explanation of what changed and why.

Acceptance criteria
- Provide a `Suggest grammar fixes` mode that returns corrected text plus a short explanation for each change.
- UI allows toggling `Show explanations` on/off and highlights changes in-line.
- Explanations are concise and suitable for ESL learners.

Implementation notes / next steps
1. Update prompts to ask the model for a structured response (JSON or delimiting tokens) containing corrected text and an explanation list.
2. Add highlighting UI for changed spans (diffing algorithm e.g., `diff-match-patch`).
3. Add test prompts and sample outputs to validate model reliability.

Privacy
- Corrections may include sensitive content; treat same as other inputs.
