# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
