"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { authTokenKey, getCurrentUser, login, logout, register, type AuthUser } from "./api";

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
      } catch {
        window.localStorage.removeItem(authTokenKey);
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

  const persistSession = React.useCallback((nextToken: string, rememberMe: boolean) => {
    setToken(nextToken);

    if (rememberMe) {
      window.localStorage.setItem(authTokenKey, nextToken);
    } else {
      window.localStorage.removeItem(authTokenKey);
    }
  }, []);

  const handleLogin = React.useCallback(
    async (payload: { email: string; password: string; rememberMe: boolean }) => {
      const result = await login(payload);
      persistSession(result.token, payload.rememberMe);
      setUser(result.user);
      toast.success("Welcome back to ALANKAAR");
      router.replace("/projects");
    },
    [persistSession, router],
  );

  const handleRegister = React.useCallback(
    async (payload: { email: string; password: string; rememberMe: boolean }) => {
      const result = await register(payload);
      persistSession(result.token, payload.rememberMe);
      setUser(result.user);
      toast.success("Your account is ready");
      router.replace("/projects");
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

    if (pathname?.startsWith("/account") || pathname?.startsWith("/projects")) {
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
