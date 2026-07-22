# AfriGate AI

AfriGate AI is a multi-tenant project and investment management application for teams developing African ventures. It combines project execution, structured feasibility assessment, financial records, stakeholders and governed documents in one authenticated workspace.

This repository contains working database-backed screens and APIs for the implemented project and investment lifecycle.

## Implemented modules

- **Dashboard** — live organization metrics and recent project, feasibility and financial activity.
- **Project Management** — create, search, update and delete projects; track budgets, dates, locations, sectors, clients and lifecycle status.
- **AI Feasibility Studies** — CRUD studies linked to projects, with market, technical, financial and risk scoring plus a server-side weighted analysis and recommendation workflow.
- **Financial Module** — CRUD budgets, revenue, expenses and investments, optionally linked to projects.
- **Document Center** — upload, list, edit metadata, download through short-lived signed URLs and delete private project or organization documents in Supabase Storage.
- **CRM** — CRUD client pipeline records and project associations.
- **Supplier Management** — CRUD supplier records, approval status and ratings.
- **Investor Management** — CRUD investor pipeline records, investment ranges, focus areas and contact history.
- **Settings** — update organization details and manage member roles while preventing removal of the final owner.

## Security model

- Supabase Auth email/password login, logout, PKCE callback, cookie-backed server sessions and middleware session refresh.
- Every workspace route is protected; unauthenticated users are redirected to `/login`.
- Server authorization verifies the Supabase user with `auth.getUser()` and resolves the matching Prisma profile.
- Every application query and mutation is scoped to the authenticated user's `organizationId`.
- Strict Zod request schemas reject unknown fields and invalid input.
- Mutations require same-origin requests and enforce role permissions before database or storage access.
- Private Storage objects use organization-prefixed paths, RLS policies and 60-second signed download URLs.
- Database changes are recorded in organization-scoped audit logs.
- Baseline PostgreSQL migration enables RLS on tenant tables and provisions the private `project-documents` bucket and Storage policies.

Role behavior:

| Role | Access |
| --- | --- |
| `OWNER` | All modules, organization settings and roles |
| `ADMIN` | All modules, organization settings and roles |
| `MEMBER` | Read all modules; manage operational records and documents |
| `ANALYST` | Read all modules; manage feasibility and financial records |
| `VIEWER` | Read-only access |

## Technology

- Next.js 15 App Router, React 19 and TypeScript
- Supabase Auth, PostgreSQL and private Storage
- Prisma ORM 6 with PostgreSQL migrations
- Zod validation

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and replace every placeholder with the project's values.
3. In Supabase Database Settings, use the transaction pooler on port `6543` for `DATABASE_URL` and the session pooler/direct connection on port `5432` for `DIRECT_URL`.
4. Create a dedicated `prisma` database role with `bypassrls`, as recommended for Prisma's server connection. Do not expose that role or password to the browser. The public Supabase publishable key is the only key used client-side.
5. Apply the committed migration. It creates the application schema, auth profile trigger, tenant RLS policies, private Storage bucket and object policies:

```bash
npm run db:migrate
```

6. In Supabase Auth URL Configuration, set the Site URL to the deployed application URL and add `http://localhost:3000/auth/callback` for local development. Create users through Supabase Auth. On first login, the user completes organization onboarding and becomes its owner.

The default Storage bucket is `project-documents`. If `SUPABASE_STORAGE_BUCKET` is changed, provision an equivalent private bucket and update the Storage policies in the migration.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL pooled application URL used by Prisma |
| `DIRECT_URL` | PostgreSQL direct/session URL used by Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key |
| `SUPABASE_STORAGE_BUCKET` | Private document bucket; defaults to `project-documents` |
| `NEXT_PUBLIC_APP_URL` | Application origin |

No `.env` file is committed. Keep production values in the hosting platform's encrypted environment configuration.

## Local development

Node.js 20.9 or newer is required.

```bash
npm install
npm run prisma:generate
npm run db:migrate
npm run dev
```

Open `http://localhost:3000` and sign in with a Supabase Auth user.

## Validation and production build

```bash
npm run prisma:generate
npm run typecheck
npm run build
npm start
```

The GitHub Actions workflow runs install, Prisma generation, strict TypeScript checking and the production build on pushes to `main` and on pull requests.

## API surface

All routes except health require an authenticated session. Resource endpoints derive tenant and actor identity from the session; clients cannot submit either value.

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/projects` | `GET`, `POST` | Project collection |
| `/api/projects/:id` | `PATCH`, `DELETE` | Project record |
| `/api/feasibility` | `GET`, `POST` | Feasibility study collection |
| `/api/feasibility/:id` | `PATCH`, `DELETE` | Feasibility study record |
| `/api/feasibility/:id/analyze` | `POST` | Calculate overall score and recommendation |
| `/api/financial` | `GET`, `POST` | Financial record collection |
| `/api/financial/:id` | `PATCH`, `DELETE` | Financial record |
| `/api/crm`, `/api/suppliers`, `/api/investors` | `GET`, `POST` | Stakeholder collections |
| `/api/{crm,suppliers,investors}/:id` | `PATCH`, `DELETE` | Stakeholder records |
| `/api/documents` | `GET`, `POST` | Document list and upload |
| `/api/documents/:id` | `PATCH`, `DELETE` | Document metadata and deletion |
| `/api/documents/:id/download` | `GET` | Short-lived private download redirect |
| `/api/settings` | `GET`, `PATCH` | Organization settings |
| `/api/settings/members/:id` | `PATCH` | Member role management |
| `/api/health` | `GET` | Public process health check |

## Deployment

Set the environment variables in the target platform, run `npm run db:migrate` as a release step, then build with `npm run build` and serve with `npm start`. Deploy migrations using `DIRECT_URL`; runtime traffic uses `DATABASE_URL`.
