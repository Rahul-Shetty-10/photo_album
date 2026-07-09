# Process Log

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
