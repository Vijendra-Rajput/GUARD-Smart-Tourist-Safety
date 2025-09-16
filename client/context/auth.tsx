import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  phone: string;
  consent: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  register: (payload: {
    name: string;
    phone: string;
    consent: boolean;
  }) => User;
  login: (payload: {
    id?: string;
    name: string;
    phone: string;
    consent: boolean;
  }) => User;
  logout: () => void;
};

const STORAGE_KEY = "guard_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
  }, [user]);

  const register = (payload: {
    name: string;
    phone: string;
    consent: boolean;
  }) => {
    const created: User = {
      id: crypto.randomUUID(),
      name: payload.name,
      phone: payload.phone,
      consent: payload.consent,
    };
    setUser(created);
    return created;
  };

  const login = (payload: {
    id?: string;
    name: string;
    phone: string;
    consent: boolean;
  }) => {
    const existing: User = {
      id: payload.id ?? crypto.randomUUID(),
      name: payload.name,
      phone: payload.phone,
      consent: payload.consent,
    };
    setUser(existing);
    return existing;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
