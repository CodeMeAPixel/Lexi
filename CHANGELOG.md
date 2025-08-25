# Changelog

All notable changes to this project will be documented in this file.

The format is based on "Keep a Changelog" and this project adheres to Semantic Versioning.

For more information, see:

- https://keepachangelog.com/en/1.0.0/
- https://semver.org/

---

# [v1.0.0-beta.4] - 2025-08-25

### Added

- Spellchecker now saves and displays both issues detected and words fixed for each result.
- Spellchecker API and results page updated to show counts and public sharing.
- Middleware and Navbar now gate dashboard/tools access for unverified users; only Overview is accessible until email is verified.
- NextAuth session callback now always includes emailVerified for reliable client checks.
- Health check API endpoints for all tools: `/api/definer/health`, `/api/rephraser/health`, `/api/spellcheck/health`, `/api/tldr/health`.

### Changed

- Navbar and middleware logic now use emailVerified as a date (not boolean) for verification checks.
- Improved spellchecker result logic and user activity payload to include wordsFixed and issuesCount.
- Settings page and API routes now properly handle user data directory in production.

### Fixed

- Fixed Prisma errors for spellchecker: correct model name, user relation, and added missing wordsFixed field.
- Fixed CORS error explanation for external analytics (Ackee): clarified that CORS must be set server-side, not in Next.js config.
- Fixed email verification logic to match NextAuth's use of a date for emailVerified.
- Fixed middleware to allow /auth/verify for logged-in users.

### Removed

- Broken and buggy multi domain support for auth redirects
- Removed legacy health check logic from individual tool implementations (now unified under `/health` endpoints)

# [v1.0.0-beta.3] - 2025-08-25

### Added

- Admin Panel: dashboard and API for user management, activity review, and moderation.
- New admin pages: user management, activities, audit logs, dashboard overview, moderation tools.
- API routes for admin actions and profile management: avatar removal, data download/view, account deletion.
- Settings page: tabs for profile/security, improved avatar uploader, username field, security section, and data viewer with sensitive info obfuscation.
- Tabs component: security tabs styled red for visual distinction.
- JSON viewer in settings: syntax highlighting and obfuscation of sensitive fields.
- UI consistency: custom button classes, toast system, and color tokens.
- Summarizer (TLDR) tool: AI-powered summary generation, dashboard UI, API endpoints, and Lucide icon integration.
- Moved all tools (Rephraser, Definer, Spellcheck, Summarizer) to unified `/tools` route for easier access and navigation.
- Dashboard Activity History page: tool icons/badges, expandable summary, skeleton loader, search/filter input, copy button, improved mobile layout.
- Custom toast system (`CustomToast` + `ToasterClient`): all feedback, confirmation, and error toasts now use the custom component, supporting icons, actions, and accessibility.
- Admin UI: confirmation/denial toasts via `CustomToast`, button color fixes.
- Lucide icons for tool avatars in dashboard and activity history.
- Accessibility improvements: aria-labels, large touch targets, screen reader support for dashboard actions.
- Design tokens for glass panels, buttons, and color classes for consistent styling.
- Improved logging to help debug missing relatedId cases in tool usage lookups.
- Metadata for all available pages.

### Changed

- Refactored dashboard history page for better UX and code consistency.
- All toast feedback now routed through `CustomToast` for unified styling and control.
- Improved mobile-first design for dashboard history and admin pages.
- Button color styling in toasts now respected via inline styles.
- Activity history: paginated, fetches `/api/activity/list`, shows activity items with summary, date, and view/copy actions.
- Tools navigation: all tools now accessible via `/tools` route, with unified UI and improved discoverability.
- Tool Usage Lookup
  - When `relatedId` is missing, now falls back to looking up the tool usage by user instead of incorrectly checking the payload.
- Settings page: security tab now shows/hides user data with sensitive info obfuscated by default, toggle to show all.
- Tabs component updated: any tab with "security" in its name is styled red.
- Improved JSON viewer in settings: syntax highlighting and obfuscation of sensitive fields.
- "Remove image" button now calls avatar removal API directly.
- UI consistency fixes: button classes, toast system, color tokens.

### Fixed

- Runtime errors: invalid toast usage, missing imports, syntax issues.
- Button color styling in toasts.
- Mobile layout clutter in dashboard history page.
- Ensured all feedback uses `CustomToast`.
- Tool Usage Resolution
  - Correctly resolves `shareId` and `slug` for tool results when a `relatedId` exists by looking up the corresponding tool usage.
  - Ensures results no longer default to `null` when valid values are present.
  - Removes incorrect fallback to `payload` for resolving identifiers, since this data will never exist there.
  - Ensure `relatedId` is always set on tool usage.
- Updated `middleware` and `authOptions` redirects and domain usage, redirects should now work regardless of the production domain that is used.
- Fixed formatting and build errors in settings page, tabs component, and admin pages.

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
