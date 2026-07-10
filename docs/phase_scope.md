# Phase Scope

This document records what is implemented today and what remains future work. It avoids timeline claims that are not represented in the repository.

Related docs: [Requirements](./requirements.md), [Architecture](./architecture.md), [Data API](./data_api.md).

## Implemented MVP Scope

| Area | Implemented components |
|---|---|
| Nx workspace | Root Nx config, API project, web project, workspace package setup |
| API server | Express app, middleware stack, API router, global error handling |
| Configuration | Zod environment parsing and typed config |
| Database | Prisma schema, migrations, Prisma client singleton |
| Uploads | Multer memory upload, Cloudinary upload/delete, upload repository/service/controller/routes |
| Generation jobs | Create/status service, repository, controller, routes, legacy aliases |
| Queue | BullMQ queue, Redis URL parsing, retry/backoff options |
| Worker | In-process generation worker, progress updates, resume by missing seed, final failure handling |
| AI provider | `ImageGenerationProvider` interface and OpenAI image edit provider |
| Themes | Three canonical themes, aliases, prompt builder |
| Health | Database, queue, and generator health response |
| Frontend landing | Marketing page with process, themes, gallery, features, testimonials, pricing, and FAQ sections |
| Frontend workspace | Photo selection, upload on generate, style/aspect/quality options, generation status, image grid |
| Polling restore | Status polling and last job restore from `localStorage` |

## Current Boundaries

In scope:

- Unauthenticated source image upload.
- Cloudinary-backed image storage.
- Three backend-supported wedding themes with alias fallback.
- OpenAI-backed image generation.
- Asynchronous job processing with BullMQ.
- Status polling and generated image display.
- Health endpoint.

Out of scope:

- Login, registration, sessions, and user-specific history.
- Payment or credit management.
- Album management.
- Dedicated download/export workflow.
- Admin operations.
- Notifications.
- Production deployment manifests.
- Automated test suite.

## Implementation Gaps

| Gap | Current behavior |
|---|---|
| Frontend theme labels exceed backend themes | Unsupported labels fall back to `South Indian` in the backend. |
| Quality selector is not a true provider quality setting | The UI maps `Ultra` to 6 images and other qualities to 4 images. |
| Download wording appears on the landing page | The workspace displays generated images but has no dedicated download button. |
| `User` model exists without auth | `userId` fields are nullable and not populated by request code. |
| `GeneratedImage.score` exists without evaluator | No quality evaluator writes this field. |
| Worker scaling is not separate yet | Workers start in the API process via `main.ts`. |
| Tests are not present | No unit, integration, or E2E tests were found in the current file tree. |

## Future Work

| Area | Examples |
|---|---|
| Authentication | Registration, login, sessions, user-scoped uploads/jobs |
| Payments | Stripe, credits, subscriptions, invoices |
| Generation UX | Real download buttons, history, reruns, negative prompts, custom themes |
| AI operations | Provider failover, quality scoring, cost tracking |
| Albums | Saved collections, sharing links, privacy controls |
| Admin | Queue monitoring, user management, usage metrics |
| Infrastructure | Docker, CI/CD, production worker deployment, observability, rate limiting |
| Testing | Service tests, API integration tests, Playwright E2E tests |
