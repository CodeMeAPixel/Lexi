# Changelog

All notable changes to this project will be documented in this file.

The format is based on "Keep a Changelog" and this project adheres to Semantic Versioning.

For more information, see:

- https://keepachangelog.com/en/1.0.0/
- https://semver.org/

---

## [v1.0.0-beta.2] - 2025-08-17

### Added

- Global Sidebar context and layout wrapper for unified sidebar state and responsive content shifting.
- Sidebar overlays and shrinks main content on desktop; mobile layout remains full width.
- Navbar now renders on all pages and uses shared sidebar logic.
- Sidebar links grouped: main site links always visible, dashboard links and sign out button for authenticated users.
- Created a global loading spinner (`GlobalLoader`) shown for all pages during suspense/loading.
- Changelog API and `/changelog` page: fetches and displays GitHub releases with full metadata, author, assets, and badges latest release.
- User and global stats APIs: `/api/stats/user` and `/api/stats/lexicon` for dashboard and homepage stats.
- Dashboard now shows user stats (definitions, rephraser results, activities, quiz attempts, tests created, public results).
- Homepage now displays live Lexicon stats (totals, recent public definitions, popular terms).
- Public sharing for Definer and Rephraser results: users can make results public and copy/share links.
- Latest release badge in changelog page.
- Expanded Tailwind color palette: blue, orange, purple, etc.
- Spellcheck tool: AI-powered spell/grammar correction with API endpoints (`/api/spellcheck/generate`, `/api/spellcheck/store`, `/api/spellcheck/public`), dashboard UI, and Prisma `Spellcheck` model for saved results and public sharing.
- OpenAI helpers: added `src/lib/openai/spellcheck.ts` and `src/lib/openai/rephraser.ts` to centralize model prompts and streaming logic for increased maintainability.
- Centralized NextAuth options in `src/lib/auth.ts` to provide a typed, single source of truth for server-side authentication config.

### Changed

- Dashboard layout refactored to remove duplicate header/sidebar; now relies on global Navbar/sidebar.
- `SidebarLayoutWrapper` uses margin and max-width to shrink content when sidebar is open (desktop).
- Hydration mismatch fixed by using mobile padding on SSR and switching to desktop after client mount.
- Navbar sidebar footer shows sign out for authenticated users and social links for guests.
- Updated server API routes to import `authOptions` from `@/lib/auth` instead of exporting them from the NextAuth app route; this prevents runtime route module types from leaking into other compiled route modules.
- Dashboard: gate stats, activity and verification checks on auth `status` and prefer `session.user.emailVerified` when present to avoid unnecessary roundtrips and UI flicker on initial load.

- Rephraser and Definer pages now use unified result panel UX: input panel becomes result panel after generation, with public sharing and link copy.
- Changelog client and API now expose full release metadata and latest-release detection.
- Improved homepage and dashboard layouts for stats and activity cards.
- Rephraser API now delegates OpenAI streaming to `src/lib/openai/rephraser.ts` (keeps route slim and centralizes model logic).
- Spellcheck generation moved to `src/lib/openai/spellcheck.ts` to ensure consistent extraction of model output and avoid leaking SDK objects to clients.
- Authentication: added NextAuth `redirect` callback to default post-auth navigation to `/dashboard` (honors explicit callbackUrl when provided).

### Fixed

- Build error in `SidebarLayoutWrapper` due to missing function declaration.
- Hydration mismatch caused by inconsistent SSR/client padding logic.

- Build error in changelog API route (missing export async function GET).
- Parsing error in changelog API route (misplaced closing brace).
- Minor UI bugs in stats and changelog pages.
- Fixed spellcheck endpoint returning raw SDK payloads by normalizing OpenAI responses to plain corrected text.
- Resolved Next.js build-time type error caused by exporting `authOptions` from the NextAuth app route.
- Fixed verification banner sometimes appearing during initial page load by ensuring the banner only shows when the user is authenticated and explicitly unverified.
- Minor TypeScript/ESLint fixes (replaced `any` with `unknown`/`Record<string, unknown>` and fixed unused catch variables) in API routes.

### Removed

- Old dashboard-specific sidebar/header logic.
- Old dashbaord and public pages layout
- ignore eslint errors on build
- ignore typescript errors on build
