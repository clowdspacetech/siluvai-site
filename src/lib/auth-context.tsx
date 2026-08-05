"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ADMIN_PASSWORD, ADMIN_USERNAME, AUTH_KEY } from "./data-store";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(sessionStorage.getItem(AUTH_KEY) === "true");
    }
  }, []);

  const login = useCallback((username: string, password: string) => {
    const valid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (valid) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
    }
    return valid;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
