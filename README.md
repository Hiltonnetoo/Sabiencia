# Sabiencia — EAD Learning Management System

![CI](https://github.com/Hiltonnetoo/Sabiencia/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict%20type--check-blue.svg)
![i18n](https://img.shields.io/badge/i18n-EN%20%2F%20PT-informational.svg)

A modern, role-based learning management platform (LMS) for online education, built as a
single-page application with React, TypeScript and Vite. Sabiencia covers the full academic
workflow — students, teachers, classes, content, grades, attendance, announcements and
finance — with a tailored experience for each of its three user roles.

> **Internationalization:** the app is **English-first** with a one-click Portuguese toggle
> (persisted per browser). The entry surfaces (landing, demo, login) and the authenticated
> chrome (top bar, sidebar navigation) are translated; deeper page bodies are being migrated
> incrementally. See [ARCHITECTURE.md](docs/ARCHITECTURE.md).
>
> **Project origin:** the visual scaffold started from a Figma Make export; the engineering
> (RBAC, auth/session, routing, mock data layer, theming, i18n, exports, tests, CI) was built
> on top. Details in [ARCHITECTURE.md §8](docs/ARCHITECTURE.md#8-project-origin--honest-notes).

---

## Table of contents

- [Highlights](#highlights)
- [Live demo](#live-demo)
- [Roles & features](#roles--features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Theming & accessibility](#theming--accessibility)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Highlights

- **Three role-based experiences** — Manager/CEO, Teacher and Student, each with its own
  navigation, dashboards and permissions enforced by route guards (RBAC).
- **Runs 100% on realistic mock data out of the box** — no backend required to explore the
  product. The Supabase data layer is implemented and can be enabled via environment
  variables (see [Architecture](#architecture)).
- **Production-minded foundations** — protected routes, signed/expiring client sessions,
  lazy-loaded route bundles, global search (`Cmd/Ctrl + K`), data export (PDF/Excel/CSV),
  light/dark theming, and accessibility features (skip links, focus rings, reduced-motion
  and high-contrast support).
- **Typed end to end** with TypeScript, validated forms with React Hook Form + Zod, and a
  shadcn/ui + Tailwind CSS v4 component system.

## Live demo

The app ships with a **demo mode** that signs you in instantly with seeded data — no
credentials to type.

| Entry point | Path |
| --- | --- |
| Demo home (choose a role) | `/demo` |
| Manager dashboard | `/demo/gestor` |
| Teacher dashboard | `/demo/professor` |
| Student dashboard | `/demo/aluno` |
| Student login screen | `/demo/loginaluno` |
| Manager login screen | `/demo/logingestor` |

From the landing page, use **“Ver Demonstração”** (top bar) to open the role chooser, or
**“Login”** to reach a login screen. On any demo login screen, the **“Entrar como …”** button
authenticates with one click.

While demo mode is active, a discreet **Demo** badge is shown in the top bar.

## Roles & features

### Manager / CEO
Full administrative access: student & teacher management, courses, classes and subjects;
financial control with PDF report export; managerial reports; system audit; institution and
academic settings.

### Teacher
Pedagogical workspace: assigned classes and students, grade entry, attendance tracking,
teaching materials upload, lesson content, announcements and student observations.

### Student
Learning area: video lessons (YouTube), downloadable materials, grades, attendance history,
announcements, financial status, events and certificates.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI primitives) |
| Routing | React Router v6 (lazy-loaded, role-guarded routes) |
| Forms & validation | React Hook Form + Zod |
| Internationalization | react-i18next (English-first, PT toggle) |
| Charts | Recharts |
| Data export | jsPDF, jspdf-autotable, SheetJS (xlsx) |
| Backend (optional) | Supabase (Auth, Postgres, Storage) |
| Testing | Vitest, Testing Library, Playwright (E2E + visual) |
| PWA | vite-plugin-pwa |

## Architecture

**Data layer (mock-first, backend-ready).** The application is designed around a data layer
that defaults to a rich, in-memory mock dataset (`src/data/`, exposed through
`MockDataContext`). This makes the product fully explorable with zero setup and ideal for
demos and portfolio review. The same authentication flow integrates with **Supabase**
(`signInWithPassword`, profile lookup, RLS-protected reads): when valid Supabase credentials
are provided via `.env`, real authentication is used, with a demo fallback gated behind
`VITE_DEMO_MODE`.

**Authentication & RBAC.** Login accepts CPF or e-mail. Sessions are persisted with a local integrity signature (HMAC) and a fixed expiry. Note that client-side HMAC signatures validate state consistency in local storage to prevent naive UI role tampering, while the true database security and API protection are handled through Supabase Row-Level Security (RLS) policies. `ProtectedRoute` enforces per-role access and redirects each role to its default dashboard.

**Routing.** Routes are split by role (`src/routes/`) and lazy-loaded so each area ships its
own bundle.

**Theming.** A custom `ThemeProvider` (`src/contexts/ThemeContext.tsx`) toggles light/dark/
system themes and font scale, persisted to `localStorage` and applied via a `.dark` class and
`data-font-size` attribute on `<html>`.

## Getting started

### Prerequisites
- Node.js 20+ (developed on Node 22)
- npm

### Install & run
```bash
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev            # start the dev server (Vite)
```

The app runs at the URL printed by Vite (default `http://localhost:3000`). With
`VITE_DEMO_MODE=true`, you can use the demo entry points above without any backend.

### Production build
```bash
npm run build      # outputs to build/
npm run preview    # serve the production build locally
```

## Environment variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | for production | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | for production | Supabase public anon key |
| `VITE_AUTH_SECRET` | yes | 32-byte hex secret used to sign client sessions for local state integrity validation |
| `VITE_DEMO_MODE` | optional | `true` enables passwordless demo login (development only) |

> Only the public Supabase **anon** key is used on the client. Never commit `.env` — it is
> already git-ignored.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint over `src` |
| `npm test` | Unit/integration tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run test:visual` | Visual regression tests |
| `npm run test:coverage` | Test coverage report |

## Project structure

```
src/
├── components/      # UI: ui/ (shadcn), layout/, shared/, and feature components
├── contexts/        # AuthContext, MockDataContext, ThemeContext, …
├── pages/           # Route pages grouped by role: gestor/, professor/, aluno/, demo/
├── routes/          # Lazy, role-guarded route definitions
├── data/            # Seeded mock dataset
├── hooks/           # Custom hooks (incl. Supabase hooks)
├── lib/             # Supabase client and low-level helpers
├── schemas/         # Zod schemas for forms/validation
├── utils/           # Formatters, export service, media thumbnails, permissions
├── styles/          # theme.css (dark mode & font scaling)
└── design-system/   # Brand & design tokens (see SABIENCIA_BRAND.md)
```

## Theming & accessibility

- **Light / dark / system** themes plus a font-size scale, configurable in
  **Settings → Appearance** and via the theme toggle in the top bar.
- **Accessibility:** skip-to-content links, visible focus indicators, ARIA landmarks/labels,
  and respect for `prefers-reduced-motion` and `prefers-contrast`.

## Testing

The project uses Vitest + Testing Library for unit/integration tests and Playwright for E2E
and visual regression.

- `npm test` — unit/integration suite (includes RBAC/permissions, formatters, calculations).
- `npm run test:coverage` — coverage report (output in `coverage/`, uploaded as a CI artifact).
- `npm run test:e2e` — end-to-end flows, including the three role login journeys.

## Roadmap

- Extend i18n coverage to all deep page bodies (entry surfaces + app chrome already done).
- Storage-backed material uploads via Supabase Storage.
- Payment integration (invoices/receipts).
- Re-tighten `tsconfig` to `strict: true` across the codebase (currently relaxed; see
  [ARCHITECTURE.md](docs/ARCHITECTURE.md)).

## License

MIT
