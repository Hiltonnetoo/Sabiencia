# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- RLS: policies recursed infinitely on `usuarios`, `matriculas` and `professor_disciplinas`
  (every read failed); views bypassed RLS; teachers could edit/delete other teachers' materials,
  announcements, video lessons, lives and notes, and grade students outside their class; the
  sensitive-field trigger also blocked the service role (`005_fix_rls_recursion_and_scope.sql`).
- "New student" / "New teacher" pages crashed on open (`useBlocker` requires a data router).
- Student form rejected valid submissions unless the optional address was fully filled.
- Supabase login by CPF called the RPC with the wrong parameter name; profile is now looked up
  by `auth_id` instead of e-mail.
- Grade/attendance forms listed every class and subject; teachers now only see their own.

### Added
- `npm run test:db` and CI job "Database RLS Tests": migrations + 42 allow/deny assertions
  against Postgres 15.
- Supabase-backed academic journey (`src/services/academicRepository.ts`, migration 006).
- Cross-role E2E journey (manager enrolls → teacher grades → student sees the grade).

### Removed
- Unused `services/supabaseData.ts` / `hooks/useSupabaseData.ts` (queried tables that do not
  exist) and the standalone `supabase/rls_policies.sql` / `fix-usuarios-rls-policies.sql`.
- Test-only bypass of the session signature check in `AuthContext`.

### Added (earlier)
- **English-first internationalization** (`react-i18next`) with a one-click PT/EN switcher
  (persisted). Landing, demo and login surfaces plus the app chrome (top bar, sidebar) are
  translated.
- `docs/ARCHITECTURE.md` documenting data layer, RBAC, routing, theming, i18n and tooling.
- Unit tests for RBAC permissions and media-thumbnail helpers; README test/coverage docs.
- Appearance settings (light/dark/system theme + font scale) with a theme toggle in the top bar.
- Reusable `Callout` component (info/warning/success/error) using design-system icons.
- "Demo Mode" badge shown across the authenticated app when `VITE_DEMO_MODE=true`.
- One-click demo login ("Entrar como Gestor/Professor/Aluno").
- "Ver Demonstração" entry point in the desktop landing header.
- Real PDF export for the financial report (Gestor).
- Branded, self-contained thumbnails for the virtual library (no external image services).
- Deploy configuration for Vercel and Netlify (SPA rewrites + `build` output directory).
- `type-check` script and CI steps for type-checking and production build.

### Changed
- Reworded session-security documentation to accurately describe client-side HMAC as
  local-state integrity only, with Supabase RLS as the real security boundary.
- Replaced placeholder/meme demo videos with stable educational content (TED-Ed).
- Demo landing copy moved from internal phase language to product-oriented wording.
- Standardized notices on the `Callout` component (icon + position).

### Fixed
- Mobile navigation dead zone between 768px–1024px (sidebar hidden with no hamburger).
- Mobile landing menu content clipped against the edge (missing padding).
- Broken demo routes: "Ver Dashboard Professor/Aluno" no longer redirect to the demo home.
- Resolved all TypeScript errors so `tsc --noEmit` passes; ESLint runs clean.

### Removed
- Internal/duplicated Markdown notes and dead `globals.css` reference cleanup.

## [1.0.0]

### Added
- Initial Sabiencia EAD platform: role-based experiences for Manager/CEO, Teacher and Student.
- Authentication (CPF/e-mail) with RBAC and protected routes; Supabase integration with a
  mock-data fallback (demo mode).
- Academic management (courses, classes, subjects), grades, attendance, announcements,
  virtual library, financial control, reports and global search.
- Component system based on shadcn/ui + Tailwind CSS v4; accessibility features
  (skip links, focus indicators, reduced-motion and high-contrast support); PWA support.
- Unit/integration tests (Vitest, Testing Library) and E2E/visual tests (Playwright); CI pipeline.

[Unreleased]: https://github.com/Hiltonnetoo/Sabiencia/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Hiltonnetoo/Sabiencia/releases/tag/v1.0.0
