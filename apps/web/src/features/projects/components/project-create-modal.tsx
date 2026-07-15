"use client";

import * as React from "react";
import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProjectCreateModalProps = {
  isCreating: boolean;
  onClose: () => void;
  onCreate: (payload: { eventCategory: string; name: string }) => Promise<void>;
};

export function ProjectCreateModal({ isCreating, onClose, onCreate }: ProjectCreateModalProps) {
  const [name, setName] = React.useState("");
  const [eventCategory, setEventCategory] = React.useState("");
  const [step, setStep] = React.useState<"name" | "event">("name");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "name") {
      setStep("event");
      return;
    }

    await onCreate({ eventCategory, name });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 px-4 backdrop-blur-xl">
      <form
        className="animate-modal-in w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-2xl shadow-black/20 sm:p-8"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">New Project</p>
            <h2 className="mt-3 font-sans text-5xl leading-none">
              {step === "name" ? "What is this project called?" : "What kind of shoot is it?"}
            </h2>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-8">
          {step === "name" ? (
            <Input
              autoFocus
              className="h-16 text-lg"
              disabled={isCreating}
              onChange={(event) => setName(event.target.value)}
              placeholder="Rahul and Sneha"
              required
              value={name}
            />
          ) : (
            <Input
              autoFocus
              className="h-16 text-lg"
              disabled={isCreating}
              onChange={(event) => setEventCategory(event.target.value)}
              placeholder="Wedding, family portrait, conference..."
              required
              value={eventCategory}
            />
          )}
        </div>
        <div className="mt-8 flex items-center justify-between gap-3">
          {step === "event" ? (
            <Button disabled={isCreating} onClick={() => setStep("name")} type="button" variant="outline">
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button
            disabled={isCreating || name.trim().length === 0 || (step === "event" && eventCategory.trim().length === 0)}
            type="submit"
          >
            {step === "name" ? "Continue" : isCreating ? "Creating" : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
