"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
});

async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem("sb-users") ?? "[]");
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem("sb-users", JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sb-session");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("sb-session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const hash = await hashPassword(password);
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    const sessionUser: User = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem("sb-session", JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }
    const hash = await hashPassword(password);
    const newUser: StoredUser = { id: generateId(), name, email, passwordHash: hash };
    saveStoredUsers([...users, newUser]);
    const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem("sb-session", JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sb-session");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
