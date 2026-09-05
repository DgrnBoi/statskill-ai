# StatSkill AI 🇮🇳
### Sovereign Competency-Based Learning & Active Recall Platform
**Ministry of Statistics and Programme Implementation (MoSPI) | Smart India Hackathon 2026 (Problem Statement: SIH26101)**

---

StatSkill AI is an edge-first, sovereign competency evaluation and micro-learning platform engineered specifically for statistical officers and field investigators across India's National Statistical System (NSS). Built in alignment with the Mission Karmayogi Framework for Roles, Activities, and Competencies (FRAC), the platform replaces passive slide-reading with continuous active recall, psychometric misconception diagnosis, and personalized zone-of-proximal-development learning pathways.

---

## Key System Capabilities

- **Hybrid Cloud-Edge AI Architecture**: We combine Google Gemini 1.5 Flash and Groq Qwen 2.5 for deep document RAG against technical statistical manuals, backed by a local 200+ question verified bank with Fisher-Yates anti-copy shuffling that executes 100% offline in low-connectivity field environments.
- **Competency-to-Curriculum Alignment (FRAC)**: We map cadre designations (Junior Statistical Officer, Senior Statistical Officer, Field Investigator, Deputy Director) directly to required proficiency benchmarks across survey design, sampling weights, national accounts, and price indices.
- **Misconception-Level Distractor Analysis**: Rather than scoring answers as a binary pass/fail, our diagnostic engine identifies specific conceptual errors (such as confusing SRSWOR with PPS, or conflating CPI-U with CFPI) and presents actionable pedagogical guidance.
- **Multilingual Course Discovery (Bhashini-Ready)**: We indexed 884 authentic government statistical courses with a phonetic Indic search lexicon supporting English, Hindi, and regional script transliterations.
- **iGOT-Ready xAPI / CMI-5 Telemetry**: Every assessment formats structured JSON-LD statements compliant with ADL xAPI v1.0.3 and CMI-5 standards, providing real-time store-and-forward local buffering and automated HTTP dispatch to the National Learning Record Store (LRS).
- **Universal Accessibility Console (WCAG 2.2 AAA)**: We built a native accessibility drawer offering high-contrast monochrome themes, OpenDyslexic typography, keyboard shortcut navigation, and bilingual Web Speech audio readouts.

---

## Architectural Reality & System Design

```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|  React 19 + TypeScript + Vite | Tailwind CSS | Radix UI | Service Worker CAPI     |
+-----------------------------------------+-----------------------------------------+
                                          |
                        REST APIs / JSON-LD Payloads
                                          |
+-----------------------------------------v-----------------------------------------+
|                                EXPRESS BACKEND                                    |
|   Rate Limiters | Input Sanitizer | JWT Auth | Telemetry & Competency Controllers |
+-------------------+-------------------------------------+-------------------------+
                    |                                     |
       +------------v------------+           +------------v------------+
       |     AI RAG PIPELINE     |           |   DATA & PERSISTENCE    |
       |  Google Gemini 1.5      |           |  PostgreSQL via Prisma  |
       |  Groq Qwen 2.5          |           |  Zero-Downtime Fallback |
       |  Multi-Span Windowing   |           |  (mospi_frac_matrix &   |
       |  Prompt-Injection XML   |           |   question_bank.json)   |
       +------------+------------+           +-------------------------+
                    |
       +------------v------------+
       |   ANTI-COPY & EDGE BANK |
       |  Fisher-Yates Shuffler  |
       |  200+ Verified Items    |
       |  Store-and-Forward LRS  |
       +-------------------------+
```

### 1. Document Ingestion & Anti-Prompt-Injection Security
When trainers upload technical PDF manuals (such as NSS 78th Round guidelines or ASI schedules), the system parses the document, samples representative windows across its full breadth (0%, 25%, 50%, 75%, 100%), and wraps all extracted text inside strict `<document_content>` XML boundaries. The prompt instructions strictly isolate this content, preventing prompt injection attacks from manipulating the assessment generation.

### 2. Zero-Downtime Database Resilience
The backend connects to PostgreSQL via Prisma ORM for persistent competency tracking. If a database instance is unconfigured or offline during local evaluation, the engine automatically falls back to an embedded JSON FRAC matrix (`mospi_frac_matrix.json`) and local catalogs, ensuring the system runs immediately without setup hurdles.

---

## Verification & Automated Test Suites

We enforce rigorous test coverage across both frontend and backend layers. The monorepo contains **83 automated tests with a 100% pass rate**.

| Test Suite | Framework | Total Tests | Status | Coverage Areas |
|:---|:---|:---:|:---:|:---|
| **Frontend Unit & Integration** | Vitest + RTL | 54 | Passing | Tab switching, Cadre benchmarks, Shuffling, Radar math, Telemetry drawer, Modals, Audio synthesis |
| **Backend Integration & APIs** | Jest + Supertest | 29 | Passing | xAPI formatting, Course recommendation math, Search transliteration, Security sanitization, RAG fallback |
| **Total Automated Tests** | — | **83** | **100% Pass** | Full end-to-end regression verification |

---

## Quickstart Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Set Up Backend
```bash
cd backend
npm install
npm test
npm run dev
```
*The backend API will start on `http://localhost:5000`. If `DATABASE_URL` is omitted, the server automatically boots with local fallback matrices.*

### 2. Set Up Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npx vitest run
npm run dev
```
*The frontend application will start on `http://localhost:5173`.*

---

## Environment Configuration (`backend/.env`)

To enable cloud AI generation or connect to a live database, create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/statskill?schema=public"
JWT_SECRET="your-development-secret-key"

# Optional Cloud AI API Keys (System uses verified local question bank if unset)
GEMINI_API_KEY=""
GROQ_API_KEY=""

# Optional Learning Record Store Endpoint
IGOT_LRS_ENDPOINT=""
```

---

## Repository Structure

```
statskill-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Competency, Telemetry & Admin API handlers
│   │   ├── services/
│   │   │   ├── ai/           # QuizGenerator, AntiCopyEngine & RAG pipelines
│   │   │   ├── recommendation/# 4-Tier ZPD CourseMatcher algorithm
│   │   │   └── search/       # Multilingual Bhashini search engine
│   │   ├── routes/           # Express route definitions
│   │   └── data/             # Local FRAC matrices and question bank backups
│   ├── tests/                # 29 Jest integration and security tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # UI modules, Assessment cards, Radar charts, Drawers
│   │   ├── pages/            # LandingPage, LoginPage, Dashboard
│   │   ├── hooks/            # Anti-spam, Debounce, Audio and Telemetry hooks
│   │   └── test/             # 54 Vitest unit and integration test specs
│   └── package.json
├── COMPREHENSIVE_SYSTEM_ANALYSIS.md # Detailed architecture and screen breakdown
└── README.md
```

---

## License

Built for the Ministry of Statistics and Programme Implementation (MoSPI) under Smart India Hackathon 2026.
