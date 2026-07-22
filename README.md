# AfriGate AI

AfriGate AI is an AI-native trade and logistics operations platform built for African supply chains. The application combines shipment visibility, customer operations, trade-document control, analytics, and explainable operational recommendations in one responsive workspace.

## What is included

- Public product landing page with a direct demo entry point
- Responsive operations dashboard with KPIs, shipment volume, trade corridors, and activity
- Shipment control tower with status, progress, mode, ETA, and customer context
- Customer portfolio, document library, AI insight queue, analytics, and settings modules
- Multi-tenant Prisma schema for workspaces, users, customers, shipments, events, documents, and insights
- Idempotent demo seed and local SQLite development database
- Health and shipment JSON endpoints
- Strict TypeScript configuration, standalone production build, and GitHub Actions validation

## Technology

- Next.js App Router
- React and TypeScript
- Prisma ORM with SQLite for local development
- Lucide icons and a custom responsive CSS design system

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

Open [http://localhost:3000](http://localhost:3000). The operations workspace is available at `/dashboard`.

## Validation

```bash
npm run prisma:generate
npm run typecheck
npm run build
```

The same validation runs automatically on pushes and pull requests through `.github/workflows/ci.yml`.

## API

- `GET /api/health` — service health response
- `GET /api/shipments` — demo shipment collection
- `POST /api/shipments` — validates and returns a newly booked shipment payload

Required POST fields are `customer`, `cargo`, `origin`, `destination`, and `mode`.

## Data and production deployment

SQLite keeps local onboarding simple. For production, change the Prisma datasource provider and `DATABASE_URL` to a managed PostgreSQL database, run a migration, then deploy the standalone Next.js build. Authentication, object storage, carrier integrations, and background AI processing can be connected behind the existing workspace and domain boundaries without restructuring the UI.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run build` | Create a production build |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run db:push` | Apply the schema to the local database |
| `npm run db:seed` | Load the idempotent demo dataset |
| `npm run db:setup` | Generate, create, and seed in one command |
