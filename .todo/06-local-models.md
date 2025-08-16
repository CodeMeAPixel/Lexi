# 06 — Local-first / Offline Model Option

Priority: Medium (strategic)
Estimated effort: Medium → High (integration + build tooling)

Goal
- Offer a privacy-first option that runs inference locally (browser or small local server) using LLMs compatible with browser execution or local runtimes.

Acceptance criteria
- Provide a toggle `Local model` that, when available, uses a bundled or user-provided model to rephrase.
- Fallback to cloud API when local is unavailable.

Implementation notes / next steps
1. Research WebLLM / WebLLM-like options, WebGPU runtimes, or lightweight quantized models.
2. Provide a clear onboarding UX for installing local runtimes or selecting models.
3. Clearly show tradeoffs in latency and quality.

Privacy & licensing
- Be mindful of model licenses and large asset sizes; document user responsibilities.
