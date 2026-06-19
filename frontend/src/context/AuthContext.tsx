"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/src/services/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (userData: AuthUser, token: string) => void;
  logout: () => void;
  updateSessionUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("@SOSHealth:user");
      const storedToken = localStorage.getItem("@SOSHealth:token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser) as AuthUser);
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem("@SOSHealth:user");
      localStorage.removeItem("@SOSHealth:token");
    }
  }, []);

  const login = (userData: AuthUser, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("@SOSHealth:user", JSON.stringify(userData));
    localStorage.setItem("@SOSHealth:token", authToken);

    if (userData.role === "profissional") {
      router.push("/profissional/dashboard");
    } else {
      router.push("/paciente/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@SOSHealth:user");
    localStorage.removeItem("@SOSHealth:token");
    router.push("/");
  };

  const updateSessionUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, ...patch };
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    localStorage.setItem("@SOSHealth:user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateSessionUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}