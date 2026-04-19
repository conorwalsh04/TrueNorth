# TrueNorth 🧭

**Student Number:** 122395056  
**Option:** A — Habit Tracker  
**GitHub Repository:** [TO BE ADDED]  
**Expo Link:** [TO BE ADDED]

TrueNorth is a production-style habit tracker built with **React Native (Expo SDK 54)**, **Expo Router**, **Drizzle ORM** on **expo-sqlite**, and **AsyncStorage** for session and preferences. Branding follows a compass / north-star theme (navy, gold accent, light and dark palettes).

**Tagline:** Find Your True North.

## Features

- **Auth:** Register, login, logout, delete account (passwords hashed with **expo-crypto** SHA-256).
- **Habits & categories:** CRUD, **text + category + optional log date-range** filters, streaks from logs, seed data for new users.
- **Logging:** Per-habit daily logs (count, notes, completed).
- **Targets:** Weekly/monthly goals (**global, per habit, or per category**) with progress, **remaining count**, status (met / below / exceeded), and progress bars.
- **Insights:** Bar and pie charts (**react-native-chart-kit**), streak leaderboard, period filters, **CSV export** (expo-file-system legacy + expo-sharing).
- **Settings:** Dark mode (persisted), daily 8pm local reminder (**expo-notifications**), manage categories.
- **Quotes:** Motivational quote on the Habits tab via **API Ninjas** when `EXPO_PUBLIC_API_NINJAS_KEY` is set; loading state, **error banner** when the network fails (offline fallback), and built-in fallback when no key is configured.

## How this maps to the brief (Option A)

| Requirement | Implementation |
|-------------|------------------|
| **Records** (date, metric, category, notes) | `habit_logs` (date, count, completed, notes) + each habit requires a `categoryId`. Add/edit/delete via habit and log screens. |
| **Categories** (name, colour, icon) | Full CRUD; all habits reference a category. |
| **Targets** (weekly/monthly, global or per-category) | `targets` supports `habitId` and/or `categoryId`; progress from SQLite logs only. |
| **Insights** (periods + chart) | Insights tab: week / month / all-time, bar + pie charts from stored logs. |
| **Search & filter** | Habits: text search, category pills, **optional log activity date range**. |
| **Persistence + seed** | Drizzle + `expo-sqlite`; `seedIfEmpty` fills categories, habits, logs, targets. |
| **UX / accessibility** | Flexbox layouts, `accessibilityLabel` / roles, empty and error states, TrueNorth palette. |
| **Privacy** | Local-only data; API key via `.env` (not committed). |
| **Auth** | Register, login, logout, delete account. |
| **Tests** | Unit (seed), component (`FormField`), integration (habits list + mocks), plus API / streak / insights helpers. |
| **Advanced** | Theme persistence, API + error UI, local notifications, streaks, CSV export. |

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

## App icon (store builds)

For App Store / Play Store or **EAS Submit**, use a **1024×1024** pixel app icon (PNG). iOS requires a solid background (no transparency). Point `expo.icon` (or your EAS build profile) at that asset so release builds ship the correct artwork.

## Before you submit

1. Replace **[TO BE ADDED]** at the top with your GitHub repository URL and any Expo / EAS / demo link your brief requires.
2. From `4447122395056`, run **`npm test`** and **`npm run typecheck`** after your final changes.
3. Never commit `.env` (only `.env.example`); the app runs without an API key using the built-in quote fallback.

---

_All assignment checkpoints (1–8) are implemented in this tree: scaffolding through insights, persistence, notifications, quote API, tests, and README._
