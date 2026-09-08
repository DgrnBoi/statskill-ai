# PROJECT_MEMORY.md (StatSkill AI Master Context & History)

> **FOR ALL AI ASSISTANTS & DEVELOPERS**: Read this file at the start of any new session to instantly understand the complete project architecture, past audit resolutions, current pass status, environment rules, and operational commands.

---

## 1. Quick Project Summary

- **Project Name**: StatSkill AI 🇮🇳
- **Target Domain**: Ministry of Statistics and Programme Implementation (MoSPI) / Smart India Hackathon 2026 (Problem Statement SIH26101).
- **Core Purpose**: Sovereign, edge-first competency-based evaluation and active-recall micro-learning platform for Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) officers.
- **Tech Stack**:
  - **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Vitest + React Testing Library.
  - **Backend**: Node.js, Express, TypeScript, Prisma ORM (SQLite default for zero-config demo / PostgreSQL production), Jest + Supertest.
  - **Data Catalogs**: 884 verified government courses, MoSPI FRAC matrix (JSO, SSO, AD, JD), local 100+ question bank backup.

---

## 2. Current System Status (As of Last Session)

- **Total Test Pass Status**: **213 Automated Tests Passing (100% Pass Rate)** across 33 test files.
  - **Frontend**: 88 / 88 tests passing (19 test files).
  - **Backend**: 125 / 125 tests passing (14 test suites).
- **Build Status**: Zero errors (`npm run build` compiles TS, generates Prisma client, and syncs 8 JSON data files to `dist/src/data/`).
- **Clean Setup Script**: Single-command installation (`npm run setup` -> `npm install && npm run build`).

---

## 3. Key Defect Resolution Log (Passed Jury Audit)

1. **Setup Automation**: Added `"postinstall": "npm --workspace backend run prisma:generate"` so clean clones work out-of-the-box without manual directory jumps.
2. **Backend Asset Sync**: Created `backend/scripts/copy-data.js` and `resolveDataPath()` so compiled execution (`dist/src/index.js`) loads the 884-course catalog and FRAC matrix without falling back.
3. **Environment-Driven API Configuration**: Created `frontend/src/lib/api.ts` (`apiUrl()`) and `frontend/.env` (`VITE_API_BASE_URL`). All hardcoded `http://localhost:5000` URLs were removed.
4. **Honest Framing**: Reframed Jan Parichay and iGOT as **Integration-Ready Adapters (Simulated Data)** across all documentation and UI badges.
5. **Security & Route Protection**:
   - Protected `/api/admin/*` with `requireAuth` and `requireRole(['ADMIN', 'SUPER_ADMIN'])`.
   - Protected `/api/auth/profile/:id` with `requireAuth`.
   - Enforced Zod payload validation (`RegisterUserSchema`, `DemoLoginSchema`, `LoginUserSchema`).
   - Stripped raw phone numbers and personal emails from `/api/auth/users` for DPDP Act 2023 compliance.
6. **API Key Isolation**: Client API keys are kept in memory only unless the user explicitly checks the opt-in persistence checkbox. Keys are never logged in console or sent back in HTTP responses.

---

## 4. Key Architectural Files & God Nodes

| Path | Purpose & Responsibility |
|---|---|
| [`frontend/src/pages/LandingPage.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/pages/LandingPage.tsx) | Public gateway, national statistics metrics bar, rule-to-role analytics |
| [`frontend/src/pages/LoginPage.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/pages/LoginPage.tsx) | Jan Parichay simulated SSO, 4-officer cadre preset switcher |
| [`frontend/src/pages/Dashboard.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/pages/Dashboard.tsx) | Primary officer workbench, polar SVG radar, paper set reshuffling |
| [`frontend/src/components/admin/AdminCommandCenter.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/admin/AdminCommandCenter.tsx) | MoSPI administrative control center, ACBP dossier generator |
| [`backend/src/routes/authRoutes.ts`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/backend/src/routes/authRoutes.ts) | Authentication endpoints, demo logins, PII sanitization |
| [`backend/src/routes/adminRoutes.ts`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/backend/src/routes/adminRoutes.ts) | Protected admin division metrics & dossier generation |
| [`backend/src/services/ai/QuizGenerator.ts`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/backend/src/services/ai/QuizGenerator.ts) | Async polling AI MCQ generation engine & anti-copy fallback |
| [`backend/src/services/recommendation/CourseMatcher.ts`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/backend/src/services/recommendation/CourseMatcher.ts) | 4-Tier ZPD learning pathway recommendation engine |
| [`backend/src/utils/dataPath.ts`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/backend/src/utils/dataPath.ts) | Dynamic path resolver ensuring JSON assets load in dev & dist mode |

---

## 5. Standard Commands

```bash
# 1-Command Setup (Clean Install + Build)
npm run setup

# Build Production Distribution
npm run build

# Run Full Test Suite (Frontend + Backend)
npm test

# Run Dev Servers Concurrently (Backend on 5000, Frontend on 5173)
npm run dev

# Run Backend Tests Only
npm --workspace backend run test

# Run Frontend Tests Only
npm --workspace frontend run test
```
