"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const eventCategories = ["Wedding", "Engagement", "Anniversary", "Birthday", "Housewarming", "Corporate"];

type ProjectCreateModalProps = {
  isCreating: boolean;
  onClose: () => void;
  onCreate: (payload: { eventCategory: string; name: string }) => Promise<void>;
};

export function ProjectCreateModal({ isCreating, onClose, onCreate }: ProjectCreateModalProps) {
  const [name, setName] = React.useState("");
  const [eventCategory, setEventCategory] = React.useState(eventCategories[0]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate({ eventCategory, name });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 px-4 backdrop-blur-xl">
      <form
        className="animate-modal-in w-full max-w-lg rounded-[1.5rem] border border-border bg-card p-6 shadow-2xl shadow-black/20"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary">New Project</p>
            <h2 className="mt-2 font-serif text-4xl leading-none">Begin an album</h2>
          </div>
          <Button aria-label="Close" onClick={onClose} size="icon-sm" type="button" variant="ghost">
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-7 grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            Project Name
            <Input
              autoFocus
              disabled={isCreating}
              onChange={(event) => setName(event.target.value)}
              placeholder="Riya and Arjun Sangeet"
              required
              value={name}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Event Category
            <select
              className="h-12 w-full rounded-2xl border border-border/70 bg-background/55 px-4 text-sm text-foreground shadow-inner shadow-black/5 transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isCreating}
              onChange={(event) => setEventCategory(event.target.value)}
              value={eventCategory}
            >
              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <Button disabled={isCreating} onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isCreating || name.trim().length === 0} type="submit">
            {isCreating ? "Creating" : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
