# ViWaah Documentation

This folder documents the current implementation of ViWaah. The codebase is the source of truth; these documents were reviewed against the repository structure, API code, Prisma schema, queue worker, provider abstraction, and frontend flows.

## Document Map

| Document | Purpose |
|---|---|
| [Architecture](./architecture.md) | System boundaries, backend/frontend structure, provider abstraction, queue flow, and deployment notes |
| [Data API](./data_api.md) | HTTP endpoints, request validation, response shapes, and errors |
| [Database schema](./schema.md) | Prisma models, relationships, indexes, and lifecycle fields |
| [Application flow](./appflow.md) | User journey, upload flow, generation flow, polling, and error handling |
| [Requirements](./requirements.md) | Functional and non-functional requirements implemented today, plus future requirements |
| [Phase scope](./phase_scope.md) | Completed MVP capabilities and known future work |

## Current Implementation Summary

ViWaah is an Nx monorepo with a Next.js frontend in `apps/web` and an Express API in `apps/api`.

The backend stores metadata in PostgreSQL through Prisma, uploads source and generated images to Cloudinary, enqueues generation jobs with BullMQ, and generates wedding portraits through an `ImageGenerationProvider` abstraction. The only implemented provider is OpenAI image edits, using `OPENAI_IMAGE_MODEL` with `gpt-image-1` as the default.

The frontend includes:

- `/`: marketing landing page.
- `/generate`: upload and generation workspace.
- Client-side polling of `/api/v1/generate/:id/status`.
- `localStorage` restore for the last active generation job.

## Current Gaps

The following are referenced as future work only and are not implemented:

- Authentication and user sessions.
- Payments or credits.
- Album management.
- Admin dashboard.
- Email or push notifications.
- Automated tests.
- Production deployment manifests.
- Multiple active AI providers.

## Public README

The root [README](../README.md) is written for a public GitHub repository and includes setup, environment variables, commands, API overview, and documentation links.
