"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/src/services/api";

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  updateSessionUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("@SOSHealth:user");
      return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
    }
    return null;
  });
  const router = useRouter();

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem("@SOSHealth:user", JSON.stringify(userData));

    if (userData.role === "profissional") {
      router.push("/profissional/dashboard");
    } else {
      router.push("/paciente/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("@SOSHealth:user");
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
    <AuthContext.Provider value={{ user, login, logout, updateSessionUser }}>
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