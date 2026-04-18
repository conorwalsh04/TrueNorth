# TrueNorth 🧭

**Student Number:** 122395056  
**Option:** A — Habit Tracker  
**GitHub Repository:** [TO BE ADDED]  
**Expo Link:** [TO BE ADDED]

TrueNorth is a production-style habit tracker built with **React Native (Expo SDK 54)**, **Expo Router**, **Drizzle ORM** on **expo-sqlite**, and **AsyncStorage** for session and preferences. Branding follows a compass / north-star theme (navy, gold accent, light and dark palettes).

**Tagline:** Find Your True North.

## Features

- **Auth:** Register, login, logout, delete account (passwords hashed with **expo-crypto** SHA-256).
- **Habits & categories:** CRUD, filters, streaks from logs, seed data for new users.
- **Logging:** Per-habit daily logs (count, notes, completed).
- **Targets:** Weekly/monthly goals (global or per habit) with progress bars.
- **Insights:** Bar and pie charts (**react-native-chart-kit**), streak leaderboard, period filters, **CSV export** (expo-file-system legacy + expo-sharing).
- **Settings:** Dark mode (persisted), daily 8pm local reminder (**expo-notifications**), manage categories.
- **Quotes:** Motivational quote on the Habits tab via **API Ninjas** when `EXPO_PUBLIC_API_NINJAS_KEY` is set; otherwise a built-in fallback.

## Tech stack

| Area | Packages |
|------|-----------|
| App & routing | expo, expo-router, react-native 0.81 |
| Data | drizzle-orm, expo-sqlite |
| Session / prefs | @react-native-async-storage/async-storage |
| Navigation UI | @react-navigation/native, native-stack, bottom-tabs |
| Charts | react-native-chart-kit, react-native-svg |
| Other | expo-crypto, expo-file-system, expo-sharing, expo-notifications |

## Project layout (high level)

- `app/` — Expo Router routes (auth, tabs, modals).
- `screens/` — Shared form and list screens.
- `components/` — Reusable UI (FormField, HabitCard, QuoteCard, etc.).
- `context/` — Auth and theme providers.
- `db/` — Drizzle schema, SQLite client, seed.
- `hooks/` — Data hooks (`useHabits`, `useCategories`, `useLogs`, `useTargets`).
- `utils/` — Hashing, API quote, streaks, CSV export, notifications, insights helpers.

## Setup

```bash
cd 4447122395056
npm install
cp .env.example .env
# Optional: set EXPO_PUBLIC_API_NINJAS_KEY in .env for live quotes (api-ninjas.com)
npx expo start
```

Run the dev server from this folder so Metro resolves the correct `app/` root.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Expo dev server |
| `npm test` | Jest + Testing Library |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

## Testing

Tests live under `__tests__/`. They cover seed logic, `FormField`, Habits list wiring, quote API fallbacks, streak math, and insights date helpers.

```bash
npm test
npm run typecheck
```

## Drizzle Kit

Schema file: `db/schema.ts`. Example Kit config: `drizzle.config.ts` (local SQLite file for tooling).

---

_Checkpoint 8: documentation, scripts, and expanded unit tests._
