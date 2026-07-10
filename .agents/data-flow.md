# Data Flow

## Milestone 7: FAL.ai Integration Layer

Date: 2026-07-09

### Scope

This document describes the currently implemented API data flow for database health checks, image upload infrastructure, upload persistence, basic GenerationJob management, BullMQ queue infrastructure, and the FAL.ai provider integration layer. Authentication, image generation execution, history, evaluator logic, and business workflows are intentionally not implemented yet.

### Configuration Flow

1. API configuration loads environment variables through `apps/api/src/config/env.ts`.
2. `DATABASE_URL` is required and must be a cloud PostgreSQL connection string.
3. Cloudinary credentials are required:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Prisma reads `DATABASE_URL` through `prisma.config.ts`.
5. Cloudinary is configured in `apps/api/src/storage/cloudinary.ts`.
6. BullMQ reads the Upstash Redis protocol URL from `UPSTASH_REDIS_URL`.
7. Queue connection options are configured in `apps/api/src/queues/config.ts`.
8. FAL configuration is required:
   - `FAL_API_KEY`
   - `FAL_MODEL`
9. The FAL provider initializes the SDK client with the configured API key and keeps the configured model ID for future generation calls.

Relevant files:

- `.env.example`
- `prisma.config.ts`
- `apps/api/src/config/env.ts`
- `apps/api/src/config/index.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/storage/cloudinary.ts`
- `apps/api/src/queues/config.ts`
- `apps/api/src/ai/providers/fal.provider.ts`
- `apps/api/src/ai/generator.service.ts`

### AI Provider Flow

1. `apps/api/src/ai/providers/provider.interface.ts` defines the provider contract used by the API.
2. `apps/api/src/ai/providers/fal.provider.ts` implements the contract for FAL.ai.
3. The FAL provider reads:
   - `config.fal.apiKey`
   - `config.fal.model`
4. The provider constructs a FAL SDK client with the configured API key.
5. `apps/api/src/ai/generator.service.ts` wraps the active provider.
6. Future workers should depend on `GeneratorService` rather than importing FAL directly.
7. The current service exposes only `healthCheck()`.
8. No image generation, prompt construction, evaluator logic, GenerationJob updates, or GeneratedImage persistence is implemented.

Relevant files:

- `apps/api/src/ai/providers/provider.interface.ts`
- `apps/api/src/ai/providers/fal.provider.ts`
- `apps/api/src/ai/providers/index.ts`
- `apps/api/src/ai/generator.service.ts`

### Prisma Client Flow

1. Prisma Client is generated from `apps/api/prisma/schema.prisma`.
2. The API imports a singleton Prisma Client from `apps/api/src/database`.
3. `apps/api/src/database/prisma.ts` creates one shared `PrismaClient` instance.
4. In non-production environments, the singleton is cached on `globalThis` to avoid extra clients during reloads.

Relevant files:

- `apps/api/src/database/prisma.ts`
- `apps/api/src/database/index.ts`

### Upload Create Flow

1. Client sends `POST /api/v1/upload` as `multipart/form-data`.
2. The expected file field name is `image`.
3. `apps/api/src/middleware/upload.ts` runs Multer with `memoryStorage()`.
4. Multer validates:
   - MIME type is `image/jpeg`, `image/png`, or `image/webp`
   - file size is 10MB or smaller
   - only one file is accepted
5. `apps/api/src/controllers/upload.controller.ts` rejects requests without a file.
6. `createUploadFromImage` in `apps/api/src/services/upload.service.ts` streams the in-memory file buffer to Cloudinary through `uploadImageBuffer`.
7. After Cloudinary succeeds, `apps/api/src/repositories/upload.repository.ts` saves the image metadata to the Prisma `Upload` table.
8. If Prisma persistence fails after Cloudinary succeeds, `deleteImage(publicId)` deletes the uploaded Cloudinary asset as rollback.
9. The API returns:
   - `uploadId`
   - `publicId`
   - `secureUrl`
   - `width`
   - `height`
   - `format`

Relevant files:

- `apps/api/src/routes/upload.routes.ts`
- `apps/api/src/middleware/upload.ts`
- `apps/api/src/controllers/upload.controller.ts`
- `apps/api/src/services/upload.service.ts`
- `apps/api/src/repositories/upload.repository.ts`
- `apps/api/src/storage/cloudinary.ts`

### Delete Flow

1. Client sends `DELETE /api/v1/upload/:id`.
2. `deleteUpload` validates that `:id` is a UUID.
3. The Upload repository looks up the Upload record by ID.
4. If the record does not exist, the API returns `404`.
5. The Upload service deletes the Cloudinary image using the stored `cloudinaryPublicId`.
6. The Upload repository deletes the Prisma Upload record.
7. The API returns `204 No Content`.

Relevant files:

- `apps/api/src/routes/upload.routes.ts`
- `apps/api/src/controllers/upload.controller.ts`
- `apps/api/src/services/upload.service.ts`
- `apps/api/src/repositories/upload.repository.ts`
- `apps/api/src/storage/cloudinary.ts`
- `apps/api/src/storage/index.ts`

### Generation Job Create Flow

1. Client sends `POST /api/v1/generation-jobs` as JSON.
2. The request body must include:
   - `brideUploadId`
   - `groomUploadId`
   - `style`
3. `apps/api/src/controllers/generation-job.controller.ts` passes the body to the GenerationJob service.
4. `apps/api/src/services/generation-job.service.ts` validates:
   - `brideUploadId` is a valid UUID string
   - `groomUploadId` is a valid UUID string
   - `style` is a non-empty string
5. The service looks up both Upload records through `findUploadById`.
6. If either Upload record is missing, the API returns `404`.
7. If both Upload records exist, `apps/api/src/repositories/generation-job.repository.ts` creates a `GenerationJob` with:
   - `brideUploadId`
   - `groomUploadId`
   - `style`
   - `status: "PENDING"`
   - `progress: 0`
8. The service enqueues the new `jobId` in the BullMQ Generation Queue.
9. After enqueue succeeds, the GenerationJob status is updated to `QUEUED`.
10. The API returns:
   - `jobId`

Relevant files:

- `apps/api/src/routes/generation-job.routes.ts`
- `apps/api/src/controllers/generation-job.controller.ts`
- `apps/api/src/services/generation-job.service.ts`
- `apps/api/src/repositories/generation-job.repository.ts`
- `apps/api/src/repositories/upload.repository.ts`
- `apps/api/src/queues/generation.queue.ts`

### Generation Queue Worker Flow

1. API startup calls `startWorkers` from `apps/api/src/workers`.
2. The Generation Worker subscribes to the BullMQ Generation Queue.
3. Each queued job contains:
   - `jobId`
4. When the worker receives a job, it logs:
   - `Processing GenerationJob <jobId>`
5. The worker updates the GenerationJob status to `PROCESSING`.
6. The worker does not call AI, generate images, evaluate output, or run business logic.

Relevant files:

- `apps/api/src/main.ts`
- `apps/api/src/workers/index.ts`
- `apps/api/src/workers/generation.worker.ts`
- `apps/api/src/queues/generation.queue.ts`
- `apps/api/src/repositories/generation-job.repository.ts`

### Generation Job Status Flow

1. Client sends `GET /api/v1/generation-jobs/:id`.
2. The GenerationJob service validates `:id` as a UUID.
3. The GenerationJob repository looks up the job by ID.
4. If the job does not exist, the API returns `404`.
5. The API returns:
   - `id`
   - `status`
   - `progress`
   - `createdAt`
   - `updatedAt`

Relevant files:

- `apps/api/src/routes/generation-job.routes.ts`
- `apps/api/src/controllers/generation-job.controller.ts`
- `apps/api/src/services/generation-job.service.ts`
- `apps/api/src/repositories/generation-job.repository.ts`

### Health Check Flow

1. Client calls `GET /api/v1/health`.
2. Express routes the request through `apps/api/src/routes/health.routes.ts`.
3. `getHealth` calls `getHealthStatus`.
4. `getHealthStatus` checks PostgreSQL with Prisma, Redis through the BullMQ queue client, and the AI provider through `GeneratorService`.
5. The AI provider health check validates provider configuration and SDK client initialization without generating images.
6. If all checks succeed:
   - top-level `status` is `ok`
   - `database.status` is `ok`
   - `queue.status` is `ok`
   - `generator.status` is `ok`
7. If any check fails:
   - top-level `status` is `degraded`
   - the failed dependency status is `error`

Relevant files:

- `apps/api/src/controllers/health.controller.ts`
- `apps/api/src/services/health.service.ts`
- `apps/api/src/services/queue-health.service.ts`
- `apps/api/src/ai/generator.service.ts`

### Current Data Model

`User`

- Stores the account identity fields needed later by authentication.
- Owns uploads and generation jobs.

`Upload`

- Stores uploaded image metadata persisted after a successful Cloudinary upload.
- Stores:
  - Cloudinary public ID
  - secure URL
  - width
  - height
- Optionally references `User` through `userId`; this remains nullable because authentication is not implemented yet.

`GenerationJob`

- Stores generation job state fields only.
- Optionally references `User` through `userId`; this remains nullable because authentication is not implemented yet.
- References the bride input Upload through `brideUploadId`.
- References the groom input Upload through `groomUploadId`.
- Stores:
  - bride upload ID
  - groom upload ID
  - style
  - status
  - progress
  - created timestamp
  - updated timestamp
- Queue creation moves the status from `PENDING` to `QUEUED`.
- The worker moves the status from `QUEUED` to `PROCESSING`.
- AI execution is not implemented yet. The FAL provider abstraction exists for future worker use through `GeneratorService`.

`GeneratedImage`

- Stores generated image result metadata only.
- References `GenerationJob` through `jobId`.
- Image creation and scoring logic are not implemented yet.

### Relationship Flow

```text
User
  -> Upload[]
  -> GenerationJob[]

Upload
  -> GenerationJob[] as bride input
  -> GenerationJob[] as groom input

GenerationJob
  -> GeneratedImage[]
```

All child records currently use cascading deletes at the database relation level:

- Deleting a `User` deletes related `Upload` records.
- Deleting a `User` deletes related `GenerationJob` records.
- Deleting an `Upload` is restricted while related `GenerationJob` records reference it as a bride or groom input.
- Deleting a `GenerationJob` deletes related `GeneratedImage` records.

### Migration Flow

1. Edit `apps/api/prisma/schema.prisma`.
2. Generate Prisma Client:

```powershell
npm.cmd --workspace @viwaah/api run db:generate
```

3. Run migrations against the configured cloud PostgreSQL database:

```powershell
npm.cmd --workspace @viwaah/api run db:migrate
```

4. Deploy migrations in deployed environments:

```powershell
npm.cmd --workspace @viwaah/api run db:migrate:deploy
```

### Current Limitation

The initial migration SQL and the upload-owner nullability migration exist, Prisma Client generation succeeds, and the API builds. A real migration run requires a valid cloud PostgreSQL `DATABASE_URL`; no local database fallback is configured.

Image upload and delete require real Cloudinary credentials. End-to-end persistence verification also requires a real cloud PostgreSQL database.

GenerationJob creation validates the submitted Upload IDs, persists a pending job with bride upload ID, groom upload ID, and style, enqueues the job ID in BullMQ, and updates the status to queued. The worker receives queued job IDs and updates them to processing. The FAL.ai SDK is configured behind `GeneratorService`, and the provider health check can initialize the configured provider. The worker does not call AI, generate images, evaluate results, store generated images, or update progress.
