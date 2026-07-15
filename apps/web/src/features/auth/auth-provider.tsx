"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthApiError, authTokenKey, getCurrentUser, login, logout, register, type AuthUser } from "./api";

type AuthContextValue = {
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (payload: { email: string; password: string; rememberMe: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: { email: string; password: string; rememberMe: boolean }) => Promise<void>;
  token: string | null;
  user: AuthUser | null;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

const getSafeReturnTo = () => {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo");

  if (!returnTo?.startsWith("/") || returnTo.startsWith("//")) {
    return "/dashboard";
  }

  return returnTo;
};

const decodeUserFromToken = (storedToken: string): AuthUser | null => {
  try {
    const encodedPayload = storedToken.split(".")[1];
    if (!encodedPayload) {
      return null;
    }

    const paddedPayload = encodedPayload.padEnd(encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4), "=");
    const payload = JSON.parse(window.atob(paddedPayload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      email?: string;
      exp?: number;
      sub?: string;
    };

    if (!payload.sub || !payload.email) {
      return null;
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      createdAt: new Date(0).toISOString(),
      email: payload.email,
      id: payload.sub,
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isRestoring, setIsRestoring] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    let isMounted = true;
    const storedToken = window.localStorage.getItem(authTokenKey);

    if (!storedToken) {
      setIsRestoring(false);
      return;
    }

    const restore = async () => {
      try {
        const result = await getCurrentUser(storedToken);

        if (!isMounted) {
          return;
        }

        setToken(storedToken);
        setUser(result.user);
      } catch (error) {
        if (error instanceof AuthApiError && error.status === 401) {
          window.localStorage.removeItem(authTokenKey);
          return;
        }

        const decodedUser = decodeUserFromToken(storedToken);

        if (decodedUser && isMounted) {
          setToken(storedToken);
          setUser(decodedUser);
        }
      } finally {
        if (isMounted) {
          setIsRestoring(false);
        }
      }
    };

    void restore();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistSession = React.useCallback((nextToken: string) => {
    setToken(nextToken);
    window.localStorage.setItem(authTokenKey, nextToken);
  }, []);

  const handleLogin = React.useCallback(
    async (payload: { email: string; password: string; rememberMe: boolean }) => {
      const result = await login(payload);
      persistSession(result.token);
      setUser(result.user);
      toast.success("Welcome back to ALANKAAR");
      router.replace(getSafeReturnTo());
    },
    [persistSession, router],
  );

  const handleRegister = React.useCallback(
    async (payload: { email: string; password: string; rememberMe: boolean }) => {
      const result = await register(payload);
      persistSession(result.token);
      setUser(result.user);
      toast.success("Your account is ready");
      router.replace(getSafeReturnTo());
    },
    [persistSession, router],
  );

  const handleLogout = React.useCallback(async () => {
    const currentToken = token;
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(authTokenKey);

    if (currentToken) {
      try {
        await logout(currentToken);
      } catch {
        // Client state is already cleared; server logout is stateless for JWTs.
      }
    }

    if (pathname?.startsWith("/account") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/projects")) {
      router.replace("/login");
    } else {
      router.refresh();
    }
  }, [pathname, router, token]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user && token),
      isRestoring,
      login: handleLogin,
      logout: handleLogout,
      register: handleRegister,
      token,
      user,
    }),
    [handleLogin, handleLogout, handleRegister, isRestoring, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
