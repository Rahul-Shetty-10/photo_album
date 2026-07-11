# Application Flow

This document describes the implemented user and job flows. See [Data API](./data_api.md) for endpoints and [Architecture](./architecture.md) for system boundaries.

## High-Level Flow

```mermaid
flowchart TD
    A[User opens landing page] --> B[User navigates to generate workspace]
    B --> C[User selects bride photo]
    B --> D[User selects groom photo]
    C --> E[User clicks Generate Portrait]
    D --> E
    E --> F[Frontend uploads missing source images]
    F --> G[API uploads buffers to Cloudinary]
    G --> H[API saves Upload records]
    H --> I[Frontend posts generation request]
    I --> J[API validates uploads and options]
    J --> K[API creates GenerationJob]
    K --> L[API enqueues BullMQ job]
    L --> M[Frontend polls status endpoint]
    L --> N[Worker processes queued job]
    N --> O[Pollinations generates one image per seed]
    O --> P[Worker uploads output to Cloudinary]
    P --> Q[Worker saves GeneratedImage]
    Q --> R{More seeds?}
    R -->|Yes| O
    R -->|No| S[Worker marks job Completed]
    M --> T[Frontend displays progress, generated images, and fullscreen image viewer]
```

## Upload Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Express API
    participant C as Cloudinary
    participant DB as PostgreSQL

    U->>FE: Select photo
    FE->>FE: Store File in component state
    FE->>API: POST /api/v1/upload
    API->>API: Multer validates MIME type, size, and file count
    API->>C: upload_stream to viwaah/uploads
    C-->>API: public_id, secure_url, width, height, format
    API->>DB: Create Upload
    DB-->>API: Upload row
    API-->>FE: uploadId and image metadata
```

Notes:

- The upload API accepts JPEG, PNG, and WebP.
- The limit is one file per request and 10 MB per file.
- If upload metadata cannot be saved after Cloudinary upload, the service deletes the uploaded Cloudinary image.

## Generation Request Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as Express API
    participant DB as PostgreSQL
    participant Q as BullMQ

    FE->>API: POST /api/v1/generate
    API->>API: Validate IDs, aspect ratio, count, seed, prompt
    API->>DB: Find bride and groom Upload rows
    DB-->>API: Upload rows
    API->>API: Resolve theme and build prompt
    API->>DB: Create GenerationJob with status Queued
    DB-->>API: GenerationJob
    API->>Q: Add process-generation-job
    Q-->>API: BullMQ job
    API-->>FE: jobId and status Queued
```

Theme resolution:

- Canonical themes are `South Indian`, `Royal Palace`, and `Beach Wedding`.
- Known aliases are mapped before saving.
- Unknown themes fall back to `South Indian`.
- The frontend currently offers additional labels that are not backend canonical themes; unsupported labels use the fallback behavior.

## Worker Flow

```mermaid
sequenceDiagram
    participant Q as BullMQ
    participant W as Worker
    participant DB as PostgreSQL
    participant POL as Pollinations image API
    participant C as Cloudinary

    Q->>W: process-generation-job
    W->>DB: Set status Running, progress 5, startedAt
    W->>DB: Load job with uploads and existing generated images
    loop For each missing seed
        W->>POL: GET /prompt/{prompt} with model, size, seed, and optional image reference
        POL-->>W: image response bytes
        W->>C: Upload data URL to viwaah/generated
        C-->>W: public_id, secure_url, width, height
        W->>DB: Create GeneratedImage
        W->>DB: Update progress
    end
    W->>DB: Set status Completed, progress 100, completedAt
```

Retry behavior:

- Queue jobs have 3 attempts.
- Backoff is exponential with a 30 second initial delay.
- Provider errors with status `401` or `403` are treated as non-retryable and mark the job `Failed`.
- Retryable failures set the database job back to `Queued` with progress `5`.

## Frontend Polling

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant LS as localStorage
    participant API as Express API

    FE->>LS: Save job ID
    loop Active job
        FE->>API: GET /api/v1/generate/:id/status
        API-->>FE: status, progress, generatedImageUrls, generatedImages
        FE->>FE: Update progress and image grid
    end
    FE->>FE: Stop when Completed or Failed
    FE->>FE: Open generated images in fullscreen viewer
```

Details:

- The key is `viwaah:last-generation-job-id`.
- Polling starts 500 ms after job creation and repeats every 2.5 seconds.
- On page load, the workspace tries to restore the last job from `localStorage`.
- Generated image thumbnails open a responsive fullscreen viewer with zoom controls, drag panning when zoomed, previous/next navigation, ESC/outside-click close, metadata, original Cloudinary download, and open-in-new-tab actions.

## Error Flow

```mermaid
flowchart TD
    A[Request] --> B{Valid input?}
    B -->|No| C[400 error]
    B -->|Yes| D{Resource exists?}
    D -->|No| E[404 error]
    D -->|Yes| F[Process request]
    F -->|Success| G[2xx response]
    F -->|Operational failure| H[Configured AppError status]
    F -->|Unknown failure| I[500 error]
    J[Worker error] --> K{Pollinations status 401 or 403?}
    K -->|Yes| L[Mark Failed]
    K -->|No| M{Attempts remain?}
    M -->|Yes| N[Mark Queued and retry]
    M -->|No| L
```
