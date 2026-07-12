# Data API Reference

Base URL: `/api/v1` by default. The version segment is controlled by `API_VERSION`.

Related docs: [Architecture](./architecture.md), [Application flow](./appflow.md), [Schema](./schema.md).

## Common Behavior

Error responses are produced by `globalErrorHandler`:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "requestId": "request-id"
}
```

The API attaches or propagates an `x-request-id` header.

## Health

### `GET /health`

Checks database, queue, and generator configuration.

Response:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-07-10T18:30:00.000Z",
  "environment": "development",
  "version": "0.0.1",
  "database": {
    "status": "ok"
  },
  "queue": {
    "status": "ok"
  },
  "generator": {
    "status": "ok",
    "provider": "pollinations",
    "model": "flux"
  }
}
```

Overall `status` is `ok` only when all three checks return `ok`; otherwise it is `degraded`.

## Upload

### `POST /upload`

Uploads one source image to Cloudinary and saves metadata in the `Upload` table.

Content type: `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `image` | File | Yes |

Validation:

| Rule | Value |
|---|---|
| MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Max size | 10 MB |
| Max files | 1 |
| Storage | Multer memory storage |

Success response: `201 Created`

```json
{
  "uploadId": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
  "secureUrl": "https://res.cloudinary.com/example/image/upload/v1/alankar/uploads/image.jpg",
  "width": 1024,
  "height": 768,
  "format": "jpg",
  "publicId": "alankar/uploads/image"
}
```

Errors:

| Status | Message |
|---|---|
| 400 | `Image file is required` |
| 400 | `Only JPEG, PNG, and WebP images are allowed` |
| 400 | `Only one image file is allowed` |
| 413 | `Image file must be 10MB or smaller` |

### `DELETE /upload/:id`

Deletes the Cloudinary image and upload metadata.

Success response: `204 No Content`

Errors:

| Status | Message |
|---|---|
| 400 | `Invalid upload id` |
| 404 | `Upload not found` |

## Generation

### `POST /generate`

Creates a `GenerationJob`, builds its prompt and seeds, and enqueues a BullMQ job.

Content type: `application/json`

| Field | Type | Required | Default |
|---|---|---|---|
| `brideUploadId` | UUID string | Yes | None |
| `groomUploadId` | UUID string | Yes | None |
| `theme` | string | No | `South Indian` |
| `style` | string | No | Canonical theme name |
| `aspectRatio` | string | No | `3:4` |
| `numberOfImages` | integer | No | `1` |
| `customPrompt` | string | No | None |
| `seed` | integer | No | Random base seed |

Valid aspect ratios:

```text
21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21
```

Canonical themes:

```text
South Indian, Royal Palace, Beach Wedding
```

Theme aliases:

| Alias | Canonical theme |
|---|---|
| `Temple` | `South Indian` |
| `Traditional` | `South Indian` |
| `Palace` | `Royal Palace` |
| `Royal` | `Royal Palace` |
| `Reception` | `Royal Palace` |
| `Beach` | `Beach Wedding` |

Unknown theme names are not rejected; they fall back to `South Indian`.

Success response: `201 Created`

```json
{
  "jobId": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
  "status": "Queued"
}
```

Errors:

| Status | Message |
|---|---|
| 400 | `brideUploadId must be a valid upload id` |
| 400 | `groomUploadId must be a valid upload id` |
| 400 | `aspectRatio must be one of: ...` |
| 400 | `numberOfImages must be an integer from 1 to 8` |
| 400 | `seed must be a non-negative integer` |
| 400 | `customPrompt must be a string` |
| 400 | `brideUpload must reference a valid Cloudinary HTTPS image URL` |
| 400 | `groomUpload must reference a valid Cloudinary HTTPS image URL` |
| 404 | `Bride upload not found` |
| 404 | `Groom upload not found` |

### `GET /generate/:id`

Returns the current job state and any completed generated images.

Success response: `200 OK`

```json
{
  "id": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
  "status": "Completed",
  "progress": 100,
  "theme": "Royal Palace",
  "model": "flux",
  "provider": "pollinations",
  "prompt": "Create a photorealistic wedding portrait...",
  "aspectRatio": "3:4",
  "numberOfImages": 1,
  "seeds": [123],
  "errorMessage": null,
  "createdAt": "2026-07-10T18:30:00.000Z",
  "updatedAt": "2026-07-10T18:31:30.000Z",
  "generatedImageUrls": [
    "https://res.cloudinary.com/example/image/upload/v1/alankar/generated/image.jpg"
  ],
  "generatedImages": [
    {
      "id": "image-id",
      "url": "https://res.cloudinary.com/example/image/upload/v1/alankar/generated/image.jpg",
      "seed": 123,
      "width": 512,
      "height": 768
    }
  ]
}
```

Errors:

| Status | Message |
|---|---|
| 400 | `Invalid generation job id` |
| 404 | `Generation job not found` |

### `GET /generate/:id/status`

Alias for `GET /generate/:id`. The frontend uses this route for polling.

## Legacy Aliases

| Method | Path | Current target |
|---|---|---|
| `POST` | `/generation-jobs` | `POST /generate` |
| `GET` | `/generation-jobs/:id` | `GET /generate/:id` |

## Route Summary

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/upload` | Upload one source image |
| `DELETE` | `/upload/:id` | Delete one uploaded image |
| `POST` | `/generate` | Create a generation job |
| `GET` | `/generate/:id` | Read job status and results |
| `GET` | `/generate/:id/status` | Polling alias |
| `POST` | `/generation-jobs` | Legacy create alias |
| `GET` | `/generation-jobs/:id` | Legacy read alias |
