# Architecture

This document explains how Sabiencia is built and the engineering decisions behind it.
For product scope and requirements, see [PRD.md](./PRD.md). For setup, see the
[README](../README.md).

## 1. High-level overview

Sabiencia is a client-rendered **React + TypeScript SPA** built with **Vite**. It is a
role-based LMS with three experiences (Manager/CEO, Teacher, Student). The app is designed to
run **fully on mock data** for demos, while keeping a **Supabase** integration path for a real
backend.

```
┌──────────────────────────────────────────────────────────────┐
│                          React SPA (Vite)                      │
│                                                                │
│  Providers:  Theme → Auth → MockData → Videoaulas → Router     │
│                                                                │
│  Routing (react-router v6, lazy):                              │
│    /                → Landing                                  │
│    /demo/*          → Demo entry + role dashboards             │
│    /gestor/*    ┐                                              │
│    /professor/* ├─ ProtectedRoute (RBAC) → Role layouts        │
│    /aluno/*     ┘                                              │
│                                                                │
│  Data layer:  MockDataContext  ──(or)──►  Supabase client      │
│                  (seeded data)             (Auth/Postgres/RLS) │
└──────────────────────────────────────────────────────────────┘
```

## 2. Data layer (mock-first, backend-ready)

The single most important decision: **the UI depends on a data layer abstraction, not on a
specific backend.**

- **Mock mode (default).** `src/data/` holds a rich, internally consistent dataset (students,
  teachers, courses, classes, payments, materials, …) exposed through `MockDataContext`. The
  app is fully explorable with **zero setup** — ideal for portfolio review and demos.
- **Supabase mode.** `src/lib/supabase.ts` configures the client. `AuthContext` authenticates
  via Supabase (`signInWithPassword`, profile lookup) and the data hooks in
  `src/hooks/supabase/` read from Postgres with RLS. When valid `.env` credentials are
  present, real auth is used; otherwise a demo fallback (gated by `VITE_DEMO_MODE`) keeps the
  experience working.

**Why:** a portfolio reviewer can run it instantly, *and* the codebase demonstrates a
production path. Swapping the source is a layer change, not a rewrite.

## 3. Authentication & RBAC

- **Login** accepts CPF or e-mail (`AuthContext.login`). CPF is sanitized and resolved to an
  e-mail before authentication.
- **Sessions** are stored in `localStorage` with an expiry and an HMAC signature.
  - ⚠️ **Security boundary:** `VITE_AUTH_SECRET` is a `VITE_*` variable, so it is **embedded in
    the client bundle**. The client-side signature therefore only guards against *naive*
    local-state tampering (e.g. a user hand-editing their stored role). It is **not** a
    cryptographic barrier. The real security boundary is **Supabase Row-Level Security (RLS)**
    plus JWT validation on the server. This is intentional and documented rather than implied.
- **Authorization** is centralized in `src/utils/permissions.ts` (`isGestor`, `canEditAluno`,
  `canAccessRoute`, a `rolePermissions` table, …) and enforced at the routing layer by
  `ProtectedRoute`, which redirects each role to its default dashboard.

## 4. Routing

Routes are split by role in `src/routes/` (`gestorRoutes`, `professorRoutes`, `alunoRoutes`,
`demoRoutes`) and **lazy-loaded**, so each area ships its own JS chunk. `App.tsx` wires public
routes (landing, login, demo) and the three guarded role trees.

## 5. UI system & styling

- **Components:** shadcn/ui primitives (built on Radix UI) under `src/components/ui/`, plus
  feature components grouped by domain and shared building blocks (`Callout`, `ThemeToggle`,
  `DemoModeBadge`, …) under `src/components/shared/`.
- **Styling:** Tailwind CSS v4 utility classes. See the [origin note](#8-project-origin--honest-notes)
  about how the stylesheet is delivered.
- **Theming:** a custom `ThemeContext` toggles light/dark/system themes and a font scale,
  persisted to `localStorage` and applied via a `.dark` class + `data-font-size` attribute on
  `<html>`. Dark-mode overrides live in `src/styles/theme.css`.

## 6. Forms, validation & i18n

- **Forms:** React Hook Form + **Zod** schemas (`src/schemas/`) for typed, validated input.
- **i18n:** `react-i18next` initialized in `src/i18n/`, **English-first** with a Portuguese
  switch (persisted). A `LanguageSwitcher` is available on the landing header and the
  authenticated top bar. Entry surfaces (landing, demo, login) and the app chrome are
  translated; deeper page bodies are being migrated incrementally (see PRD roadmap).

## 7. Quality & tooling

- **Type safety:** `strict: true` TypeScript; `npm run type-check` (`tsc --noEmit`) is clean
  and gated in CI. Test files are validated by running them (Vitest) rather than by the app
  `tsconfig`.
- **Linting:** ESLint with `eslint-plugin-unused-imports` (auto-removes unused imports, reports
  unused vars); CI runs with `--max-warnings 0`.
- **Tests:** Vitest + Testing Library (unit/integration), Playwright (E2E + visual). Critical
  logic such as RBAC (`permissions.test.ts`), formatters and calculations is unit-tested; the
  three login flows are covered by E2E.
- **CI** (`.github/workflows/ci.yml`): lint → type-check → build → unit tests (coverage) → E2E.
- **Build/Deploy:** `vite build` outputs to `build/`; `vercel.json`/`netlify.toml` configure
  SPA rewrites and the output directory.

## 8. Styling delivery notes

- The repository ships a **pre-compiled Tailwind v4 stylesheet** (`src/index.css`) rather than
  a PostCSS/Tailwind build step. New runtime styles (e.g. dark-mode overrides and font scaling)
  are added in `src/styles/theme.css`, imported after `index.css`.
- The active design tokens live in `src/index.css` (`:root`); dark-mode token and utility
  overrides live in `src/styles/theme.css`.

## 9. Key directories

| Path | Responsibility |
| --- | --- |
| `src/contexts/` | Cross-cutting state: Auth, MockData, Theme, Videoaulas |
| `src/routes/` | Lazy, role-guarded route trees |
| `src/pages/` | Screens grouped by role (`gestor/`, `professor/`, `aluno/`, `demo/`) |
| `src/components/` | `ui/` primitives, `layout/`, `shared/`, and feature components |
| `src/data/` | Seeded mock dataset |
| `src/hooks/` | Custom hooks, incl. Supabase data hooks |
| `src/schemas/` | Zod validation schemas |
| `src/utils/` | Permissions (RBAC), formatters, export service, media thumbnails |
| `src/i18n/` | i18next config and locale resources |
| `src/styles/` | `theme.css` (dark mode & font scaling) |
