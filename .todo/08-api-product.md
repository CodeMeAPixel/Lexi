# 08 — API Productization

Priority: Medium
Estimated effort: Variable (depends on billing / infra)

Goal
- Offer a public API for rephrasing with API keys, rate limits, and usage tracking.

Acceptance criteria
- API keys can be created, revoked, and used against a documented endpoint.
- Billing or quota enforcement (stripe integration optional for paid tiers).
- Documentation (OpenAPI / Postman collection).

Implementation notes / next steps
1. Add API key management and simple usage table in DB.
2. Add rate-limiting middleware and usage counters.
3. Provide docs and example clients.

Security
- Ensure keys are hashed in storage and allow per-key restrictions.
