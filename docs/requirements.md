# Requirements

This document describes requirements reflected by the current implementation plus future requirements that are intentionally out of scope. See [Phase scope](./phase_scope.md) for milestone status.

## Implemented Functional Requirements

### Image Upload

| ID | Requirement |
|---|---|
| FR-01 | Users can upload a bride portrait image. |
| FR-02 | Users can upload a groom portrait image. |
| FR-03 | Uploads accept JPEG, PNG, and WebP files. |
| FR-04 | Each uploaded image is stored in Cloudinary under `viwaah/uploads`. |
| FR-05 | Upload metadata is persisted in PostgreSQL. |
| FR-06 | Successful uploads return an `uploadId`. |
| FR-07 | Uploaded images can be deleted by upload ID. |

### Image Generation

| ID | Requirement |
|---|---|
| FR-08 | Users can create a generation job with bride and groom upload IDs. |
| FR-09 | The backend supports the canonical themes `South Indian`, `Royal Palace`, and `Beach Wedding`. |
| FR-10 | The backend supports aliases for common theme labels. |
| FR-11 | Unknown theme labels fall back to `South Indian`. |
| FR-12 | Users can specify one of the supported aspect ratios. |
| FR-13 | Users can request 1 to 8 images per job. |
| FR-14 | Users can provide an optional custom prompt. |
| FR-15 | Users can provide an optional non-negative integer seed. |
| FR-16 | The system creates sequential seeds from the base seed. |
| FR-17 | The system builds a full wedding prompt from theme attributes and custom prompt text. |
| FR-18 | Generated images are uploaded to Cloudinary under `viwaah/generated`. |
| FR-19 | Generated image metadata is persisted in PostgreSQL. |

### Job Management

| ID | Requirement |
|---|---|
| FR-20 | Each generation request creates a `GenerationJob` with status `Queued`. |
| FR-21 | Jobs are processed asynchronously through BullMQ. |
| FR-22 | The worker updates status, progress, and lifecycle timestamps. |
| FR-23 | The status endpoint returns progress, status, error message, and completed image URLs. |
| FR-24 | Jobs retry up to 3 attempts with exponential backoff. |
| FR-25 | OpenAI provider errors with status `401` or `403` are not retried. |
| FR-26 | The frontend polls active jobs every 2.5 seconds after an initial 500 ms delay. |
| FR-27 | The frontend restores the last generation job from `localStorage`. |

### Health Monitoring

| ID | Requirement |
|---|---|
| FR-28 | The API exposes `GET /health`. |
| FR-29 | Health checks include PostgreSQL connectivity. |
| FR-30 | Health checks include queue connectivity. |
| FR-31 | Health checks include AI provider configuration. |
| FR-32 | Overall health is `ok` or `degraded`. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Upload file size is limited to 10 MB. |
| NFR-02 | Upload file count is limited to 1. |
| NFR-03 | Upload URLs used for generation must be HTTPS Cloudinary URLs. |
| NFR-04 | API responses include or propagate `x-request-id`. |
| NFR-05 | The Express app disables `x-powered-by`. |
| NFR-06 | The Express app uses Helmet. |
| NFR-07 | CORS is configured from `CORS_ORIGIN`. |
| NFR-08 | Completed BullMQ jobs are removed from the queue. |
| NFR-09 | Failed BullMQ jobs are retained. |
| NFR-10 | The worker concurrency is 2. |
| NFR-11 | Worker lock duration is 10 minutes. |
| NFR-12 | The Prisma client is singleton-scoped in development. |
| NFR-13 | The API handles `SIGINT` and `SIGTERM` by closing the server and workers. |
| NFR-14 | Unhandled promise rejections and uncaught exceptions trigger shutdown handling. |

## AI Requirements

| ID | Requirement |
|---|---|
| AIR-01 | The AI provider is selected through `GeneratorService` and the `ImageGenerationProvider` interface. |
| AIR-02 | The implemented provider is `OpenAIProvider`. |
| AIR-03 | The provider default model is `gpt-image-1`, configurable through `OPENAI_IMAGE_MODEL`. |
| AIR-04 | The provider sends both source images as references to the OpenAI Images edit endpoint. |
| AIR-05 | The provider maps aspect ratios to OpenAI image sizes. |
| AIR-06 | The provider returns a generated image data URL and seed. |

## Theme Requirements

| ID | Requirement |
|---|---|
| WTR-01 | `South Indian` uses a red Kanjeevaram saree, ivory veshti, temple setting, golden hour light, and luxury wedding photography style. |
| WTR-02 | `Royal Palace` uses a regal bridal lehenga, ivory sherwani, palace courtyard, cinematic evening light, and editorial luxury style. |
| WTR-03 | `Beach Wedding` uses a pastel bridal saree, cream linen kurta, beach mandap, sunset light, and natural destination wedding style. |
| WTR-04 | Prompts instruct the provider to preserve identity, facial features, skin tone, age, expression, and likeness. |

## Not Implemented Yet

The current codebase does not implement:

- Authentication or authorization.
- User-scoped request handling.
- Payments, credits, or subscription tiers.
- Album creation or sharing.
- Admin dashboards.
- Email or push notifications.
- Rate limiting.
- Automated tests.
- Dedicated production deployment infrastructure.
- Separate deployed worker process.
- Multiple active AI providers or provider failover.
- Quality scoring despite the reserved `GeneratedImage.score` field.
