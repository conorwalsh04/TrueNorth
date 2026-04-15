import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq, inArray } from 'drizzle-orm';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { categories, habitLogs, habits, targets, users } from '../db/schema';
import { hashPassword } from '../utils/hash';

const STORAGE_KEY = 'truenorth_user';

export type AuthUser = {
  id: number;
  username: string;
};

type StoredUser = AuthUser;

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function getDb() {
  const { db } = await import('../db/client');
  return db;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as StoredUser;
          if (typeof parsed.id === 'number' && typeof parsed.username === 'string') {
            setUser(parsed);
          }
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistUser = useCallback(async (next: AuthUser | null) => {
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
    setUser(next);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const trimmed = username.trim();
      if (!trimmed || !password) {
        throw new Error('Please enter username and password.');
      }
      const db = await getDb();
      const rows = await db.select().from(users).where(eq(users.username, trimmed)).limit(1);
      const row = rows[0];
      if (!row) {
        throw new Error('Invalid credentials.');
      }
      const hashed = await hashPassword(password);
      if (hashed !== row.password) {
        throw new Error('Invalid credentials.');
      }
      await persistUser({ id: row.id, username: row.username });
    },
    [persistUser],
  );

  const register = useCallback(
    async (username: string, password: string) => {
      const trimmed = username.trim();
      if (!trimmed || !password) {
        throw new Error('Please enter username and password.');
      }
      const db = await getDb();
      const existing = await db.select().from(users).where(eq(users.username, trimmed)).limit(1);
      if (existing.length > 0) {
        throw new Error('Username is already taken.');
      }
      const hashed = await hashPassword(password);
      const createdAt = new Date().toISOString();
      await db.insert(users).values({
        username: trimmed,
        password: hashed,
        createdAt,
      });
      const inserted = await db.select().from(users).where(eq(users.username, trimmed)).limit(1);
      const row = inserted[0];
      if (!row) {
        throw new Error('Could not complete registration.');
      }
      const { seedIfEmpty } = await import('../db/seed');
      await seedIfEmpty(row.id);
      await persistUser({ id: row.id, username: row.username });
    },
    [persistUser],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    const current = user;
    if (!current) {
      return;
    }
    const uid = current.id;
    const db = await getDb();
    const habitRows = await db.select({ id: habits.id }).from(habits).where(eq(habits.userId, uid));
    const ids = habitRows.map((h) => h.id);
    if (ids.length > 0) {
      await db.delete(habitLogs).where(inArray(habitLogs.habitId, ids));
    }
    await db.delete(targets).where(eq(targets.userId, uid));
    await db.delete(habits).where(eq(habits.userId, uid));
    await db.delete(categories).where(eq(categories.userId, uid));
    await db.delete(users).where(eq(users.id, uid));
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      login,
      register,
      logout,
      deleteAccount,
    }),
    [user, isReady, login, register, logout, deleteAccount],
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
