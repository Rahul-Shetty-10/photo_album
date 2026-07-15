"use client";

export type AuthUser = {
  createdAt: string;
  email: string;
  id: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001/api/v1";

export const authTokenKey = "alankar:auth-token";

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
};

const authFetch = async <T>(path: string, options: RequestInit = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new AuthApiError(await getErrorMessage(response, `Request failed with status ${response.status}`), response.status);
  }

  return response.json() as Promise<T>;
};

export const register = (payload: { email: string; password: string }) =>
  authFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const login = (payload: { email: string; password: string }) =>
  authFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCurrentUser = (token: string) =>
  authFetch<{ user: AuthUser }>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const logout = (token: string) =>
  authFetch<{ status: string }>("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
