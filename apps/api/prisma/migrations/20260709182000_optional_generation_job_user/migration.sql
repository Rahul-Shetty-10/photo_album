ALTER TABLE "GenerationJob" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "GenerationJob" ADD COLUMN "brideUploadId" UUID NOT NULL;
ALTER TABLE "GenerationJob" ADD COLUMN "groomUploadId" UUID NOT NULL;
ALTER TABLE "GenerationJob" ADD COLUMN "style" TEXT NOT NULL;

ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_brideUploadId_fkey" FOREIGN KEY ("brideUploadId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_groomUploadId_fkey" FOREIGN KEY ("groomUploadId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "GenerationJob_brideUploadId_idx" ON "GenerationJob"("brideUploadId");
CREATE INDEX "GenerationJob_groomUploadId_idx" ON "GenerationJob"("groomUploadId");
