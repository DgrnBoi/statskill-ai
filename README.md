# StatSkill AI 🇮🇳 (MoSPI Edition)

**Smart India Hackathon 2026 - Problem Statement SIH26101**

StatSkill AI is a sovereign, edge-first active recall learning platform built for the Ministry of Statistics and Programme Implementation (MoSPI). It identifies competency gaps using the FRAC matrix and generates highly rigorous MCQs from technical statistical manuals using a **100% offline, local AI inference engine.**

## Why This Architecture Wins
Most learning platforms are built as cloud-dependent web apps. For a nodal officer in rural India, this breaks the moment the Wi-Fi drops. We engineered this platform specifically for Indian government realities:
1. **Zero Data Leakage:** Generates quizzes locally via `Ollama` (Llama-3.1). No government data touches OpenAI.
2. **CAPI Offline Mode:** The PWA Service Worker (`sw.js`) caches the UI and locally queues quiz scores when the internet goes down.
3. **iGOT xAPI Integration:** When online, it syncs telemetry directly to the national iGOT Karmayogi LRS.
4. **Bhashini Guardrails:** A strict dictionary (`BhashiniLexicon.json`) prevents the AI from hallucinating translations of complex economic terms.

## Quick Start (Run Locally)

### Prerequisites
1. Node.js (v18+)
2. Install [Ollama](https://ollama.com/) on your host machine.
3. Pull the required edge model: `ollama run llama3.1`

### 1. Boot the Backend (API + AI Engine + SQLite)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
*(The backend will start on `http://localhost:5000`)*

### 2. Boot the Frontend (React + PWA)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will start on `http://localhost:5173`)*

## Commands
| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | `backend/` | Starts the Express API and Telemetry Router |
| `npm test` | `backend/` | Runs the 90-case Jest integration suite |
| `npm run dev` | `frontend/` | Starts the Vite React dashboard |
| `npm run build` | `frontend/` | Builds the production PWA assets |

## Architecture Decisions (ADRs)
We have formally documented our architectural decisions in the `.gemini/antigravity/brain` artifact directory. Key decisions include:
* **ADR-001 (Edge-AI Migration):** Deprecation of `@langchain/openai` in favor of `@langchain/community` + `Ollama`.
* **ADR-002 (Store-and-Forward):** Intercepting network requests via `sw.js` to simulate CAPI offline synchronization.
* **ADR-003 (IndEA Auth):** Structuring the React header to accept OpenID Connect (OIDC) tokens for Jan Parichay mock integration.

## Testing & Evaluation
We have provided a comprehensive 90-case backend test suite that evaluates:
- xAPI Telemetry compliance
- Bhashini Lexicon strictness
- Zod JSON-schema guardrails on the LLM output

Run `npm test` in the `backend/` directory to evaluate the system.
