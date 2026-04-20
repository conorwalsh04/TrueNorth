# TrueNorth 🧭

**Student Number:** 122395056  
**Option:** A — Habit Tracker  
**GitHub Repository:** [github.com/conorwalsh04/TrueNorth](https://github.com/conorwalsh04/TrueNorth)  
**Expo link (IS4447 — done):** [Project dashboard](https://expo.dev/accounts/conorwalsh04/projects/truenorth-122395056) · [EAS Update (build reference)](https://expo.dev/accounts/conorwalsh04/projects/truenorth-122395056/updates/87d6876a-1b40-4a52-a88b-1d5f8feb072f)

Use the project dashboard to open the app in **Expo Go** (QR code or deep link). If your course requires a link that works without signing in to Expo, use the public **Expo Go** URL or QR shown on that page after your last publish/update.

TrueNorth is a production-style habit tracker built with **React Native (Expo SDK 54)**, **Expo Router**, **Drizzle ORM** on **expo-sqlite**, and **AsyncStorage** for session and preferences. Branding follows a compass / north-star theme (navy, gold accent, light and dark palettes).

**Tagline:** Find Your True North.

## Features

- **Auth:** Register, login, logout, delete account (passwords hashed with **expo-crypto** SHA-256).
- **Onboarding:** First-run slides; completion is stored locally so returning users skip straight to the app.
- **Habits & categories:** CRUD, **text + category + optional log date-range** filters, streaks from logs, **+1 today** quick-add with light haptics, **last updated** time on the Habits tab, seed data for new users.
- **Logging:** Per-habit daily logs (count, notes, completed); success haptics on save.
- **Targets:** Weekly/monthly goals (**global, per habit, or per category**) with progress, **remaining count**, status (met / below / exceeded), and progress bars.
- **Goal celebrations:** When a **weekly or monthly** target is **met** (count ≥ goal) for the current period, the app shows a **congratulations modal** with **confetti** (native iOS/Android) and **success haptics**. Each target is celebrated **once per period** (week or month); the next period resets the celebration. Turn on **Reduce motion** in Settings to get the **modal without confetti** (same message and haptics).
- **Insights:** Bar and pie charts (**react-native-chart-kit**), streak leaderboard, period filters, **CSV export** scoped to the selected period (expo-file-system legacy + expo-sharing).
- **Settings:** Dark mode (persisted), **reduce motion** (charts + celebrations), **About** (version, privacy), daily 8pm local reminder (**expo-notifications**), manage categories.
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
| **UX / accessibility** | Flexbox layouts, `accessibilityLabel` / roles, empty and error states, TrueNorth palette, **SafeAreaProvider**, reduce-motion preference. |
| **Privacy** | Local-only data; API key via `.env` (not committed). In-app About explains no analytics. |
| **Auth** | Register, login, logout, delete account. |
| **Tests** | Unit (seed, target progress, streaks, insights), component (`FormField`), integration (habits list + mocks), plus API helpers. |
| **Advanced** | Theme persistence, API + error UI, local notifications, streaks, CSV export, onboarding, haptics, goal celebrations. |

## Tech stack

| Area | Packages |
|------|-----------|
| App & routing | expo, expo-router, react-native 0.81 |
| Data | drizzle-orm, expo-sqlite |
| Session / prefs | @react-native-async-storage/async-storage |
| Navigation UI | @react-navigation/native, native-stack, bottom-tabs |
| Charts | react-native-chart-kit, react-native-svg |
| Feedback & polish | expo-haptics, react-native-confetti-cannon |
| Other | expo-crypto, expo-file-system, expo-sharing, expo-notifications, expo-constants |

## Project layout (high level)

- `app/` — Expo Router routes (auth, tabs, modals, onboarding).
- `screens/` — Shared form and list screens.
- `components/` — Reusable UI (FormField, HabitCard, QuoteCard, `GoalCelebrationModal`, etc.).
- `context/` — Auth and theme providers.
- `db/` — Drizzle schema, SQLite client, seed.
- `hooks/` — Data hooks (`useHabits`, `useCategories`, `useLogs`, `useTargets`).
- `utils/` — Hashing, API quote, streaks, CSV export, notifications, insights helpers, **`targetProgress`**, **`goalCelebrationStorage`**.

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

Tests live under `__tests__/`. They cover seed logic, `FormField`, Habits list wiring, quote API fallbacks, streak math, insights date helpers, and **target progress** math used for goals.

```bash
npm test
npm run typecheck
```

## Drizzle Kit

Schema file: `db/schema.ts`. Example Kit config: `drizzle.config.ts` (local SQLite file for tooling).

## App icon (store builds)

For App Store / Play Store or **EAS Submit**, use a **1024×1024** pixel app icon (PNG). iOS requires a solid background (no transparency). Point `expo.icon` (or your EAS build profile) at that asset so release builds ship the correct artwork.

## Before you submit (IS4447)

### In this repository (code)

1. Keep **GitHub** and **Expo** links at the top in sync with your final submission; confirm **Expo Go** opens the expected build on **both iOS and Android** before the due date.
2. From `4447122395056`, run **`npm test`** and **`npm run typecheck`** after your final changes (should pass).
3. Never commit **`.env`** (only **`.env.example`**); the app runs without an API key using the built-in quote fallback.
4. **Zip:** Name the archive per the brief, e.g. **`IS4447_122395056_TrueNorth.zip`**, and ensure it matches what is on **GitHub** at submission time (match your course wording if it differs).

### Outside this repository (brief deliverables)

5. **Demo video (3–5 minutes)** — Screen recording: CRUD, categories, targets, insights/charts, search/filter (and optional extras if time).
6. **Short report (2–3 pages)** — Word or PDF: accessibility, UI/colour strategy, architecture, React Native vs native reflection, what went well / not well, learnings, limitations, future work.

### Demo tip (in-app)

7. To show a **goal celebration**, create a **weekly or monthly** target with a low goal, log enough activity in the **current** week or month to meet it, then open the **Targets** tab—the modal should appear once (dismiss with **Awesome!**).

---

_Core IS4447 requirements (records, categories, targets, insights, search/filter, persistence + seed, UX, privacy, auth, tests) and advanced features in the brief are implemented in this app tree._
