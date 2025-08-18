# 03 — Document / Paragraph Mode & Batch Processing

Priority: High
Estimated effort: Medium → High depending on queueing / backend work

Goal
- Allow users to rephrase multiple sentences, paragraphs, or full documents with configurable per-chunk behavior.

Acceptance criteria
- Users can paste multi-paragraph text into a `Document` mode input.
- The app splits text into paragraphs (or sentences) and processes them sequentially with streaming updates for each chunk.
- Users can select a global or per-chunk tone/length.
- Progress UI shows current chunk index and estimated remaining time.

Implementation notes / next steps
1. Add a document-input UI with simple chunking strategy (paragraph by blank lines or N sentences).
2. Implement a server endpoint that accepts multiple chunks or streams them in sequence.
3. Consider rate limits and batching for cost control; add a cap on max tokens or paragraph count.
4. For longer runs, persist results to history and offer download.

Edge cases
- Extremely long inputs (enforce reasonable limits).
- Handling of lists/code blocks and preserving formatting.
