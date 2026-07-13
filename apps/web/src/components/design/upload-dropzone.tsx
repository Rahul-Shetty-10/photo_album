"use client";

import * as React from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/design/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type UploadDropzoneProps = {
  id?: string;
  title?: string;
  description?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
};

function validateFile(file: File) {
  const hasAcceptedType = ACCEPTED_TYPES.includes(file.type);
  const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((extension) =>
    file.name.toLowerCase().endsWith(extension)
  );

  if (!hasAcceptedType && !hasAcceptedExtension) {
    return "Upload a JPG, JPEG, or PNG image.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image must be 10MB or smaller.";
  }

  return null;
}

export function UploadDropzone({
  id = "photo-upload",
  title = "Upload couple photos",
  description = "Add clear portraits and let ALANKAR preserve faces while composing a cinematic wedding frame.",
  value = null,
  onChange,
}: UploadDropzoneProps) {
  const inputId = id;
  const titleId = `${inputId}-title`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(value);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [value]);

  const selectFile = React.useCallback(
    (file?: File) => {
      if (!file) {
        return;
      }

      const validationError = validateFile(file);
      setError(validationError);

      if (!validationError) {
        onChange?.(file);
      }
    },
    [onChange]
  );

  const openFilePicker = () => inputRef.current?.click();

  const removeFile = () => {
    setError(null);
    onChange?.(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <GlassCard className="p-5">
      <motion.div
        animate={{ scale: isDragging ? 1.01 : 1 }}
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] border border-dashed border-primary/30 bg-background/45 p-6 text-center transition-colors",
          isDragging && "border-primary/70 bg-primary/10"
        )}
        onClick={() => {
          if (!value) {
            openFilePicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }}
        role="group"
        aria-labelledby={titleId}
      >
        <input
          ref={inputRef}
          id={inputId}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        {previewUrl ? (
          <div className="grid gap-5">
            <img
              src={previewUrl}
              alt={`${title} preview`}
              className="h-72 w-full rounded-[1.25rem] object-cover"
            />
            <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3
                  id={titleId}
                  className="font-serif text-2xl text-foreground"
                >
                  {title}
                </h3>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {value?.name}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" type="button" variant="outline" onClick={openFilePicker}>
                  <ImagePlus aria-hidden="true" />
                  Replace
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={removeFile}
                >
                  <Trash2 aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
              <UploadCloud className="size-6" aria-hidden="true" />
            </div>
            <h3 id={titleId} className="mt-5 font-serif text-3xl text-foreground">
              {title}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {description}
            </p>
            <Button
              className="mt-5"
              size="sm"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
            >
              <ImagePlus aria-hidden="true" />
              Select photo
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Drag and drop, or click to upload. JPG, JPEG, PNG up to 10MB.
            </p>
          </>
        )}

        {error && (
          <p className="mt-4 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </motion.div>
    </GlassCard>
  );
}
