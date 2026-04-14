import React, { createContext, useContext, useMemo, useState } from 'react';

export type AuthUser = {
  id: number;
  username: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<AuthUser | null>(null);
  const [isReady] = useState(true);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
    }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
