# Process Log

## Database Foundation: Milestone 2

Date: 2026-07-09

### Goal

Implement only the database foundation for the API using Prisma and cloud PostgreSQL configuration.

### Completed Changes

- Installed Prisma CLI and Prisma Client.
- Added Prisma configuration at the repository root:
  - `prisma.config.ts`
- Configured the API Prisma schema under:
  - `apps/api/prisma/schema.prisma`
- Configured PostgreSQL as the datasource through `DATABASE_URL`.
- Added `.env.example` with a cloud PostgreSQL connection string shape and no local database default.
- Added the initial Prisma models:
  - `User`
  - `Upload`
  - `GenerationJob`
  - `GeneratedImage`
- Added the initial migration SQL under:
  - `apps/api/prisma/migrations/20260709160000_init/migration.sql`
- Added API database exports:
  - `apps/api/src/database/prisma.ts`
  - `apps/api/src/database/index.ts`
- Added API scripts:
  - `db:generate`
  - `db:migrate`
  - `db:migrate:deploy`
- Updated environment validation to require `DATABASE_URL`.
- Updated `GET /api/v1/health` to include database connectivity:
  - `database.status: "ok"` when `SELECT 1` succeeds
  - `database.status: "error"` and top-level `status: "degraded"` when the database check fails

### Explicitly Not Implemented

- Authentication
- Cloudinary
- Upload APIs
- Redis
- BullMQ
- AI
- Business logic

### Files Changed

- `.env.example`
- `package.json`
- `package-lock.json`
- `prisma.config.ts`
- `apps/api/package.json`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260709160000_init/migration.sql`
- `apps/api/src/config/env.ts`
- `apps/api/src/config/index.ts`
- `apps/api/src/controllers/health.controller.ts`
- `apps/api/src/database/prisma.ts`
- `apps/api/src/database/index.ts`
- `apps/api/src/services/health.service.ts`

### Notes

- Prisma 7 requires datasource URL configuration in `prisma.config.ts`; the schema keeps only the PostgreSQL provider.
- Prisma generation and schema validation were run with a placeholder cloud-style `DATABASE_URL` because generation does not connect to the database.
- A real cloud PostgreSQL `DATABASE_URL` is required before running `npm.cmd --workspace @viwaah/api run db:migrate` or `db:migrate:deploy`.
- No local database configuration was added.
- `npm install` reported 5 audit findings after Prisma install: 4 moderate and 1 high. No audit fix was run for this milestone.

### Verification

Commands run successfully:

```powershell
$env:DATABASE_URL='postgresql://user:password@example.com:5432/viwaah?sslmode=require'; npx.cmd prisma generate
$env:DATABASE_URL='postgresql://user:password@example.com:5432/viwaah?sslmode=require'; npx.cmd prisma validate
npm.cmd --workspace @viwaah/api run build
npx.cmd nx build @viwaah/api
```

Migration SQL was generated successfully with:

```powershell
$env:DATABASE_URL='postgresql://user:password@example.com:5432/viwaah?sslmode=require'; npx.cmd prisma migrate diff --from-empty --to-schema apps/api/prisma/schema.prisma --script -o apps/api/prisma/migrations/20260709160000_init/migration.sql
```

Not run:

```powershell
npm.cmd --workspace @viwaah/api run db:migrate
```

Reason: no real cloud PostgreSQL `DATABASE_URL` is present in the workspace.

## UX Refactor: Landing and Generate Workspace

Date: 2026-07-09

### Goal

Refactor the app UX so the landing page is marketing-only and all AI generation controls live on a dedicated `/generate` page.

### Completed Changes

- Removed generation controls from the landing page.
- Deleted the old landing `CreatePreview` component.
- Removed the floating upload card from the hero.
- Updated landing "Start Creating" CTAs to navigate to `/generate`.
- Added `/generate` route.
- Created a full AI workspace at `/generate`.
- Added two large upload cards:
  - Bride Photo
  - Groom Photo
- Added drag-and-drop and click-to-upload support.
- Added image preview, replace, and remove actions.
- Added file validation:
  - JPG
  - JPEG
  - PNG
  - Max 10MB
- Disabled the Generate button until both photos are uploaded.
- Added visual selectable wedding style cards:
  - Royal
  - Traditional
  - Temple
  - Palace
  - Beach
  - Reception
  - South Indian
  - North Indian
  - Christian
  - Muslim
  - Custom
- Added collapsed-by-default Advanced Options accordion with:
  - Additional prompt
  - Aspect ratio
  - Quality
- Used existing UI/design components where possible:
  - `Button`
  - `Card`
  - `Textarea`
  - `Badge`
  - `AnimatedGradient`
  - `GlassCard`
  - `UploadDropzone`
- Added Framer Motion animations to the workspace and upload interactions.
- Fixed a hydration mismatch caused by `React.useId()` in the upload cards by passing stable IDs from the generate workspace.

### Files Changed

- `web/src/features/landing/components/landing-page.tsx`
- `web/src/features/landing/components/hero.tsx`
- `web/src/features/landing/components/navbar.tsx`
- `web/src/features/landing/components/create-preview.tsx`
- `web/src/components/design/upload-dropzone.tsx`
- `web/src/app/generate/page.tsx`
- `web/src/features/generate/components/generate-workspace.tsx`

### Notes

- No backend or mock API was implemented.
- `/generate` is frontend-only and prepares generation inputs.
- Next build may temporarily rewrite `web/next-env.d.ts` from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts`; that generated verification noise was restored after builds.
- On Windows PowerShell, `npx` was blocked by execution policy, so checks were run with `npx.cmd`.

### Verification

Commands run successfully:

```powershell
npx.cmd nx lint @viwaah/web
npx.cmd nx build @viwaah/web
```

The build route table included:

```text
/
/_not-found
/api/hello
/generate
```

## Backend Foundation: Milestone 1

Date: 2026-07-09

### Goal

Implement only the backend foundation in `apps/api` with Express, TypeScript, API versioning, core middleware, structured logging, error handling, environment validation, graceful shutdown, and a health endpoint.

### Completed Changes

- Added `apps/api` as a workspace project and Nx application target.
- Added Express + TypeScript backend entry files:
  - `apps/api/src/app.ts`
  - `apps/api/src/main.ts`
- Added required backend folder structure:
  - `config`
  - `controllers`
  - `middleware`
  - `routes`
  - `services`
  - `validators`
  - `utils`
  - `types`
  - `workers`
  - `queues`
  - `ai`
- Added `/api/v1` API versioning.
- Added Helmet, CORS, Compression, Pino, and Pino HTTP request logging.
- Added request ID middleware with `x-request-id` response propagation.
- Added async error wrapper.
- Added global JSON error handler.
- Added JSON 404 handler.
- Added graceful shutdown for `SIGINT`, `SIGTERM`, unhandled rejections, and uncaught exceptions.
- Added environment validation with Zod and a typed config loader.
- Added `GET /api/v1/health` returning:
  - `status`
  - `uptime`
  - `timestamp`
  - `environment`
  - `version`
- Added backend dependencies and TypeScript types to the workspace package manifests and lockfile.

### Explicitly Not Implemented

- Prisma
- PostgreSQL
- Authentication
- Cloudinary
- Redis
- BullMQ
- Upload APIs
- AI
- Business logic

### Files Changed

- `package.json`
- `package-lock.json`
- `apps/api/package.json`
- `apps/api/project.json`
- `apps/api/tsconfig.json`
- `apps/api/tsconfig.app.json`
- `apps/api/src/app.ts`
- `apps/api/src/main.ts`
- `apps/api/src/config/env.ts`
- `apps/api/src/config/index.ts`
- `apps/api/src/controllers/health.controller.ts`
- `apps/api/src/middleware/error-handler.ts`
- `apps/api/src/middleware/not-found.ts`
- `apps/api/src/middleware/request-id.ts`
- `apps/api/src/routes/health.routes.ts`
- `apps/api/src/routes/index.ts`
- `apps/api/src/services/health.service.ts`
- `apps/api/src/types/express.d.ts`
- `apps/api/src/utils/app-error.ts`
- `apps/api/src/utils/async-handler.ts`
- `apps/api/src/utils/logger.ts`
- `apps/api/src/ai/.gitkeep`
- `apps/api/src/queues/.gitkeep`
- `apps/api/src/validators/.gitkeep`
- `apps/api/src/workers/.gitkeep`

### Notes

- The backend uses direct workspace dependencies for runtime packages instead of relying on transitive Nx packages.
- On Windows PowerShell, `npm` may be blocked by execution policy; use `npm.cmd` and `npx.cmd`.
- `npm install` reported existing audit findings: 1 moderate and 1 high vulnerability. No audit fix was run for this milestone.

### Verification

Commands run successfully:

```powershell
npm.cmd --workspace @viwaah/api run build
npx.cmd nx build @viwaah/api
```

Runtime checks passed on port `4100`:

```text
GET /api/v1/health -> 200
GET /api/v1/missing -> 404
```

## Repository Refactor: Move Frontend to apps/web

Date: 2026-07-09

### Goal

Refactor the repository structure so the Next.js frontend lives at `apps/web` as a proper Nx application without changing frontend or backend behavior.

### Completed Changes

- Moved the frontend application structure from `web` to `apps/web`.
- Added explicit Nx project metadata for the frontend at `apps/web/project.json`.
- Updated the root npm workspaces so the frontend is discovered through `apps/*`.
- Updated the root TypeScript project reference from `./web` to `./apps/web`.
- Updated the frontend TypeScript config to extend the root config from its new depth and to point generated type includes at `apps/web/.next` and `dist/apps/web`.
- Updated the frontend ESLint config import path to the root flat config from its new depth.
- Updated lockfile workspace metadata and the local workspace resolution for `@viwaah/web`.
- Updated repository documentation to reflect the new monorepo structure.
- Removed the obsolete source/config copy under `web`; only generated legacy build artifacts may remain if held by the local file lock during the move.

### Files Changed

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `README.md`
- `.agents/process.md`
- `apps/web/project.json`
- `apps/web/tsconfig.json`
- `apps/web/eslint.config.mjs`

### Notes

- The backend in `apps/api` was left structurally unchanged.
- `git mv` could not be used in this environment because creating `.git/index.lock` was denied, so the frontend was copied into `apps/web` and then validated there. Git should still detect the rename from content similarity.
- The old `web/.next` and `web/dist` directories were generated artifacts and initially held a lock on the directory during the move.

### Verification

Commands to run for this refactor:

```powershell
npx.cmd nx show projects
npx.cmd nx build @viwaah/web
npx.cmd nx build @viwaah/api
```
