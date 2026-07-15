"use client";

import { authTokenKey } from "@/features/auth/api";

export type ProjectStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
export type ProjectStep = "EVENT" | "SUBJECTS" | "RELATIONSHIPS" | "THEME" | "TEMPLATE" | "REVIEW" | "GENERATE";

export type Project = {
  createdAt: string;
  currentStep: ProjectStep;
  eventCategory: string;
  id: string;
  name: string;
  status: ProjectStatus;
  updatedAt: string;
  userId: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001/api/v1";

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
};

const projectFetch = async <T>(path: string, options: RequestInit = {}) => {
  const token = window.localStorage.getItem(authTokenKey);

  if (!token) {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    throw new Error("Authentication required");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.localStorage.removeItem(authTokenKey);
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }

    throw new Error(await getErrorMessage(response, `Request failed with status ${response.status}`));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const listProjects = () => projectFetch<{ projects: Project[] }>("/projects");

export const createProject = (payload: { eventCategory: string; name: string }) =>
  projectFetch<{ project: Project }>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProject = (id: string) => projectFetch<{ project: Project }>(`/projects/${id}`);

export const renameProject = (id: string, payload: { name: string }) =>
  projectFetch<{ project: Project }>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const archiveProject = (id: string) =>
  projectFetch<{ project: Project }>(`/projects/${id}/archive`, {
    method: "PATCH",
  });

export const deleteProject = (id: string) =>
  projectFetch<void>(`/projects/${id}`, {
    method: "DELETE",
  });
