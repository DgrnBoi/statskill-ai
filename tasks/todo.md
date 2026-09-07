# Task List: StatSkill AI Rework & Scale Enhancements

---

## Phase 1: Document Ingestion Studio & Live Source Citations

### Task 1: Document Inspection Endpoint
**Description:** Implement `POST /api/quiz/inspect-document` in backend to parse uploaded PDF/TXT manuals, detect section headings, word counts, and statistical keyword density without immediately triggering quiz generation.

**Acceptance criteria:**
- [x] Returns structured metadata: total characters, estimated page count, detected section/chapter list, top statistical keywords.
- [x] Accepts `.pdf`, `.txt`, `.md` files up to 15MB with strict input sanitization.

**Verification:**
- [x] Tests pass: `npm test` in `backend/`
- [x] Manual check: `curl.exe -F "document=@test.pdf" http://localhost:5000/api/quiz/inspect-document` returns 200 JSON.

**Dependencies:** None  
**Files touched:**
- `backend/src/routes/quizRoutes.ts`
- `backend/src/services/ai/DocumentChunker.ts`
- `backend/tests/rag_optimization.test.ts`

---

### Task 2: Document Ingestion Studio UI
**Description:** Build a modal/card in the frontend Assessment view that displays parsed document metrics and enables the officer to pick target chapters and Bloom's difficulty level before generating questions.

**Acceptance criteria:**
- [x] Shows file name, detected chapters (e.g. *Sampling Design*, *Multipliers*), and word count.
- [x] Allows selecting specific chapter focus or "Entire Document".
- [x] Allows selecting question count (5, 10) and Bloom's level (Recall, Understanding, Application, Analysis).

**Verification:**
- [x] Tests pass: `npx vitest run` in `frontend/`
- [x] Build succeeds: `npm run build` in `frontend/`

**Dependencies:** Task 1  
**Files touched:**
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/assessment/DocumentIngestionStudio.tsx`
- `frontend/src/test/DocumentIngestionStudio.test.tsx`

---

### Task 3: Live Document Source Citation Slide-Over Inspector
**Description:** Build an interactive slide-over drawer in the Assessment question/result view that renders the exact grounding excerpt from the uploaded manual whenever an officer clicks a "Source Citation" badge.

**Acceptance criteria:**
- [x] Clicking a source citation tag opens a slide-over panel displaying the exact original sentence/paragraph and chapter name.
- [x] Supports keyboard navigation (`Escape` to close, focus trapping).
- [x] Works seamlessly for both cloud-generated and local-extracted assessments.

**Verification:**
- [x] Tests pass: `npx vitest run` in `frontend/`

**Dependencies:** Task 2  
**Files touched:**
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/assessment/SourceCitationDrawer.tsx`
- `frontend/src/components/assessment/AssessmentAnalysisReport.tsx`

---

### Checkpoint: Phase 1
- [x] Backend tests pass (`npm test`)
- [x] Frontend tests pass (`npx vitest run`)
- [x] Uploading a PDF displays chapter breakdown, generates focused questions, and clicking source citations highlights original excerpts.

---

## Phase 2: AI Model Selector & Inference Gateway

### Task 4: AI Model & Key Configuration Modal
**Description:** Add an "AI Engine Settings" modal accessible from the header allowing officers/admins to toggle between Google Gemini 1.5 Flash, Groq Cloud, and Sovereign On-Device Extractor, with local API key storage.

**Acceptance criteria:**
- [x] Allows selecting active engine: Gemini 1.5 Flash, Groq Llama 3.3, or Sovereign Local Extractor (Offline).
- [x] Securely saves client keys in `localStorage` under `statskill_api_key`.
- [x] Displays live status indicator: "Cloud RAG Active" or "Sovereign Offline Active".

**Verification:**
- [x] Tests pass: `npx vitest run` in `frontend/`

**Dependencies:** None  
**Files touched:**
- `frontend/src/components/layout/Navbar.tsx`
- `frontend/src/components/ui/AiModelModal.tsx`

---

### Task 5: Client Key Forwarding & Backend Health Check
**Description:** Ensure frontend requests pass `apiKey` in headers/body, and add a lightweight `/api/quiz/model-health` endpoint to test API keys with zero token waste.

**Acceptance criteria:**
- [x] Backend checks validity of passed Gemini/Groq key with minimal ping.
- [x] Frontend displays green checkmark if key is valid, or fallback warning if invalid.

**Verification:**
- [x] Tests pass: `npm test` in `backend/`

**Dependencies:** Task 4  
**Files touched:**
- `backend/src/routes/quizRoutes.ts`
- `frontend/src/pages/Dashboard.tsx`

---

### Checkpoint: Phase 2
- [x] Switching between Gemini, Groq, and Sovereign On-Device Extractor works instantly in the UI with live status indicators.

---

## Phase 3: Multi-Document Knowledge Hub (*Amrit Gyaan Kosh*)

### Task 6: Knowledge Store Backend Endpoints
**Description:** Create `/api/knowledge` routes to list pre-bundled official MoSPI training circulars (*NSS 78th Round*, *ASI 2024*, *CPI Manual*, *DPDPA 2023*) and allow uploading persistent new circulars into the repository.

**Acceptance criteria:**
- [x] `GET /api/knowledge`: Returns list of official manuals with division tags, page counts, and summary.
- [x] `POST /api/knowledge/upload` & dynamic loading: Serves official manuals with division categorization.

**Verification:**
- [x] Tests pass: `npm test` in `backend/`
- [x] Manual check: `curl.exe http://localhost:5000/api/knowledge` returns pre-bundled circulars.

**Dependencies:** None  
**Files touched:**
- `backend/src/routes/knowledgeRoutes.ts`
- `backend/src/data/amrit_gyaan_kosh.json`
- `backend/src/index.ts`

---

### Task 7: Document Library Browser & One-Click Launcher
**Description:** Build a dedicated "Amrit Gyaan Kosh" library browser in the frontend where officers can search circulars by division and launch immediate assessments with a single click.

**Acceptance criteria:**
- [x] Renders circular cards categorized by MoSPI division (NAD, ESD, FOD, CPD).
- [x] Search filter for instant manual lookup.
- [x] "Start Assessment" button triggers dynamic question generation from the selected circular.

**Verification:**
- [x] Tests pass: `npx vitest run` in `frontend/`

**Dependencies:** Task 6  
**Files touched:**
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/knowledge/KnowledgeLibrary.tsx`

---

### Checkpoint: Phase 3
- [x] Pre-bundled and uploaded circulars render in the Knowledge Library and launch instant assessments.

---

## Phase 4: Official Competency Certificate & Dossier Export

### Task 8: Official MoSPI Assessment Certificate Modal
**Description:** Build an official, print-ready "MoSPI Competency Assessment Certificate & Dossier" modal that generates after an assessment attempt, featuring national emblem, officer rank, score, radar chart, and SHA-256 verification code.

**Acceptance criteria:**
- [x] Renders official certificate layout with Print/Save PDF action via `window.print()`.
- [x] Displays officer name, cadre designation, assessment date, score percentage, and anti-copy verification hash.
- [x] Formats dedicated `@media print` CSS so printed pages look clean and professional without dashboard navigation chrome.

**Verification:**
- [x] Tests pass: `npx vitest run` in `frontend/`
- [x] Manual check: Clicking "Export Official Dossier" opens the printable certificate modal.

**Dependencies:** None  
**Files touched:**
- `frontend/src/components/assessment/AssessmentCertificateModal.tsx`
- `frontend/src/pages/Dashboard.tsx`

---

### Final Checkpoint: Complete Regression & Verification
- [x] All backend Jest tests pass (`npm test`) -> 42 tests passing.
- [x] All frontend Vitest tests pass (`npx vitest run`) -> 62 tests passing.
- [x] Total automated test count exceeds 100 tests with 100% pass rate (104 tests total).
- [x] Production build succeeds cleanly (`npm run build` in `frontend/`).
