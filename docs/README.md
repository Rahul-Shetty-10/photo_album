# ALANKAAR Documentation

This folder documents the current implementation of ALANKAAR. The codebase is the source of truth; these documents are kept aligned with the repository structure, API code, Prisma schema, queue worker, provider abstraction, and frontend flows.

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

ALANKAAR is an Nx monorepo with a Next.js frontend in `apps/web` and an Express API in `apps/api`.

The frontend presentation has been rebranded from a wedding-only studio to an AI-powered photography workflow platform for photographers, studios, and creative professionals. The landing page now emphasizes personal photography, professional event coverage, AI-assisted editing, album direction, and export workflows.

The backend stores metadata in PostgreSQL through Prisma, uploads source and generated images to Cloudinary, enqueues generation jobs with BullMQ, and generates images through an `ImageGenerationProvider` abstraction. The only implemented provider is Pollinations image generation, using `POLLINATIONS_IMAGE_MODEL` with `flux` as the default. Some backend prompt and generation internals still reflect the MVP wedding portrait implementation and are intentionally out of scope for this presentation-only phase.

The frontend includes:

- `/`: editorial ALANKAAR landing page.
- `/choose-style`: photography style, event category, participant, theme, and template selection flow.
- `/generate`: existing upload and generation workspace.
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

## Presentation Rebrand Scope

This phase changes frontend presentation only:

- Rebrands public copy from wedding-only positioning to ALANKAAR as a professional photography workflow platform.
- Communicates support for personal photography: portraits, couple shoots, traditional weddings, family events, and parties.
- Communicates support for professional photography: conferences, seminars, expert visits, corporate events, cultural events, and sports events.
- Adds a visual future workflow: Create Project, Choose Event, Add Subjects, Define Relationships, Choose Theme, Choose Template, Generate, Review, Export.
- Does not implement authentication, projects, new generation behavior, backend APIs, database changes, or business-logic changes.

## Public README

The root [README](../README.md) is written for a public GitHub repository and includes setup, environment variables, commands, API overview, and documentation links.
