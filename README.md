# ViWaah

ViWaah is an AI wedding portrait studio. Users upload separate bride and groom portraits, choose a wedding style, and create generated wedding portraits through an asynchronous API pipeline.

## Current Status

This repository is an Nx monorepo with:

- `apps/web`: Next.js 16 frontend with a landing page and generation workspace.
- `apps/api`: Express 5 API with PostgreSQL persistence, Cloudinary uploads, BullMQ job processing, and a Pollinations image-generation provider.
- `docs`: implementation-aligned project documentation.

The app currently has no authentication, payment, album, admin, or production deployment code.

## Tech Stack

| Area | Technology |
|---|---|
| Monorepo | Nx 23 |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui-style components, Framer Motion |
| Backend | Express 5, TypeScript, CommonJS |
| Database | PostgreSQL, Prisma 7, `@prisma/adapter-pg` |
| Queue | BullMQ, Redis/Upstash-compatible URL |
| Storage | Cloudinary |
| AI provider | Pollinations image API, `flux` by default |
| Logging | Pino, Pino HTTP |

## Repository Structure

```text
viwaah/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── ai/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── database/
│   │       ├── middleware/
│   │       ├── queues/
│   │       ├── repositories/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── storage/
│   │       ├── utils/
│   │       └── workers/
│   └── web/
│       └── src/
│           ├── app/
│           ├── components/
│           ├── features/
│           └── lib/
├── docs/
├── nx.json
├── package.json
├── prisma.config.ts
└── tsconfig.base.json
```

## Setup

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database URL
- Redis URL for BullMQ
- Cloudinary account
- Pollinations API key with image generation access

### Install

```bash
npm install
cp .env.example apps/api/.env
```

Fill `apps/api/.env` with your database, Redis, Cloudinary, and Pollinations credentials.

### Environment Variables

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | API port, default `4001` |
| `API_VERSION` | API prefix version, default `v1` |
| `APP_VERSION` | Version returned by health checks |
| `LOG_LEVEL` | Pino log level |
| `CORS_ORIGIN` | Allowed CORS origin |
| `DATABASE_URL` | PostgreSQL connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `UPSTASH_REDIS_URL` | Redis URL used by BullMQ |
| `POLLINATIONS_API_KEY` | Pollinations API key |
| `POLLINATIONS_IMAGE_MODEL` | Image model, default `flux`; `kontext` supports image references only on Pollinations accounts/endpoints that expose it |

The frontend reads `NEXT_PUBLIC_API_BASE_URL`; when unset it uses `http://localhost:4001/api/v1`.

## Development

```bash
npx nx serve api
npx nx dev web
```

The API listens on `http://localhost:4001` by default and the frontend runs on `http://localhost:3000`.

## Database

```bash
npm run --workspace @viwaah/api db:generate
npm run --workspace @viwaah/api db:migrate
npm run --workspace @viwaah/api db:migrate:deploy
```

## API Overview

All routes are mounted under `/api/v1` by default.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Check database, queue, and AI provider health |
| `POST` | `/upload` | Upload one JPEG, PNG, or WebP image |
| `DELETE` | `/upload/:id` | Delete an uploaded image |
| `POST` | `/generate` | Create and enqueue a generation job |
| `GET` | `/generate/:id` | Get generation status and results |
| `GET` | `/generate/:id/status` | Status polling alias |
| `POST` | `/generation-jobs` | Backward-compatible create alias |
| `GET` | `/generation-jobs/:id` | Backward-compatible read alias |

See [docs/data_api.md](./docs/data_api.md) for request and response details.

## Documentation

- [Documentation index](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Data API](./docs/data_api.md)
- [Database schema](./docs/schema.md)
- [Application flow](./docs/appflow.md)
- [Requirements](./docs/requirements.md)
- [Phase scope](./docs/phase_scope.md)

## License

MIT
