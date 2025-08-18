# Lexi (Lexicon)

![Lexicon nameplate](./public//nameplate.png)

Lexi (a.k.a. Lexicon) is an AI-powered writing assistant focused on rephrasing, definitions, and small practice tools. It uses Next.js (App Router), TailwindCSS, Prisma (Postgres), NextAuth for authentication, and OpenAI integrations for AI features.

This README gives a short codebase review, setup steps, and commands to get the project running locally.

## Quick codebase review

- Framework: Next.js (App Router) + React + TypeScript.
- Styling: Tailwind CSS with custom palette in `tailwind.config.js`.
- Authentication: NextAuth centralized via `src/lib/auth.ts` (server routes call `getServerSession(authOptions as NextAuthOptions)`).
- DB: Prisma ORM, Postgres. Schema in `prisma/schema.prisma`.
- AI helpers: OpenAI streaming and helper code lives in `src/lib/openai/*`.
- App layout: Pages and API routes live under `src/app/` using the App Router pattern. API routes (server) are under `src/app/api/*`.
- Dashboard and tools: `src/app/dashboard/*` (Rephraser, Definer, Spellcheck pages and APIs).

Key files:

- `src/lib/auth.ts` — central NextAuth config used across server routes.
- `src/lib/prisma.ts` — Prisma client instance.
- `src/lib/openai/*` — AI helpers (rephraser, spellcheck).
- `src/app/api/stats/lexicon/route.ts` — site-wide stats endpoint used by the homepage.

Notes from a quick walkthrough:

- Server routes must guard `session.user.id` at runtime (see pattern `typeof (session.user as { id?: unknown }).id === 'string'`).
- Some App Router route handlers accept Promise-shaped `params` and `await params` — this is necessary to satisfy Next.js generated type checks.
- Prisma migrations are required locally after any schema changes (Spellcheck model additions etc.).

## Prerequisites

- Node.js 18+ or Bun (this repo uses Bun in local scripts). Use your preferred runtime. On Windows, PowerShell is supported.
- PostgreSQL database and a connection string (see `DATABASE_URL`).
- Prisma CLI for migrations.
- OpenAI API key (if you intend to run AI features locally).

## Environment variables

Create a `.env` file at the project root. Below is a comprehensive example (placeholders only) that mirrors the variables used in the project; replace values with your secrets locally.

```properties
# --- STORAGE (Postgres) ---
# Example: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://db_user:db_pass@db-host.example.com:5432/lexicon

# --- AUTHENTICATION / NEXTAUTH ---
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here

# --- AI / OpenAI ---
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FINETUNE_API_KEY=ft-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# --- EMAIL (sending) ---
DEFAULT_FROM_NAME=Lexicon
DEFAULT_FROM_EMAIL=accounts@your-domain.com

# Optional Microsoft / Azure fields (if using Graph or Azure email)
AZURE_APP_CLIENT_ID=00000000-0000-0000-0000-000000000000
AZURE_APP_CLIENT_SECRET=azure-client-secret-here
AZURE_APP_TENANT_ID=00000000-0000-0000-0000-000000000000

# --- S3 / Object storage (optional) ---
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.example.com         # optional custom endpoint
S3_ACCESS_KEY=AKIAEXAMPLEKEY
S3_SECRET_KEY=your_s3_secret_key_here
S3_BUCKET_NAME=your-bucket-name
S3_FORCE_PATH_STYLE=false                  # true for some S3-compatible endpoints

# Optional extras
# LOG_LEVEL=info
# NEXT_PUBLIC_FEATURE_FLAG=true
```

Do not commit `.env` or any secrets to source control. Add `.env` to `.gitignore` and prefer a secrets manager for production.

## Setup (local)

1. Install deps (using Bun):

```powershell
# from repo root (Windows PowerShell)
bun install
```

2. Generate Prisma client and run migrations (if schema changed):

```powershell
npx prisma generate
npx prisma migrate dev --name init
# or for a quick push without creating migrations:
npx prisma db push
```

3. Start dev server:

```powershell
bun dev
# or via npm / pnpm (if you prefer):
# npm run dev
```

4. Build for production:

```powershell
bun run build
bun run start
```

## Common tasks

- Run TypeScript checks & build: `bun run build` (the repo uses Next.js checks during build).
- Run tests (none included by default) — consider adding Jest / Vitest for unit tests.

## Adding a new Prisma model

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name your_migration_name`.
3. Run `npx prisma generate` if needed.

## Contributing

- See `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` in the repo for contribution guidelines.
- Keep server route signatures compatible with Next.js App Router expectations (Promise-shaped `params` where needed).
- Prefer runtime guards for session checks rather than `any` casts (example pattern in many API routes).

## Troubleshooting

- Type errors during `next build` often indicate a route signature or session typing mismatch. Check the Next.js generated types in `.next/types/app/*` when needed.
- If AI features fail, confirm `OPENAI_API_KEY` is set and that rate/usage limits are not hit.

## Where the logo/nameplate lives

- The repository includes image assets under `public/`. The nameplate used in this README is available at `/nameplate.png` (the repository also contains `public/nameplate.png` and other images like `public/logo.png`).

## License

This project includes a `LICENSE` file at the repository root. Follow the terms listed there when contributing or distributing.

## Final notes

If you'd like, I can:

- Add a small startup script to automate `.env` copying and local DB creation.
- Add a lightweight health probe and make a tiny `makefile` or `package.json` scripts mapping for common tasks.
- Generate a short CONTRIBUTING checklist for PRs and local dev.

---

Generated by the repository assistant — let me know which of the follow-ups above you'd like next.
