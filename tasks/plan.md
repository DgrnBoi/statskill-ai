# Implementation Plan: StatSkill AI Production Rework & Scale Enhancements

## Overview
This implementation plan breaks down the next phase of StatSkill AI into small, verifiable, vertically sliced tasks. It introduces an interactive **Document Ingestion Studio with live source citation viewing**, a **Multi-Document Knowledge Repository (*Amrit Gyaan Kosh*)**, an **AI Model & Inference Gateway Switcher**, and an **Official MoSPI Competency Certificate & PDF Dossier Export**.

---

## Architecture Decisions

- **ADR-004 (Sovereign Document Inspection Before Generation)**: Introduce an asynchronous document inspection endpoint that extracts chapter trees and keyword densities before generation, giving officers control over topic focus and Bloom's cognitive depth.
- **ADR-005 (Interactive Excerpt Grounding & Source Citations)**: Attach exact paragraph text and chapter citations to generated questions so officers can verify question answers against the source manual in a live slide-over panel.
- **ADR-006 (Zero-Setup API Key Management)**: Support client-configured Google Gemini and Groq API keys in `localStorage`, passed via request headers with automatic fallback to the on-device sovereign extractor when unset.
- **ADR-007 (Pre-Loaded National Knowledge Library)**: Bundle verified official MoSPI circulars (*NSS 78th Round*, *ASI Guidelines*, *CPI Manual*, *DPDPA 2023*) in `backend/src/data/amrit_gyaan_kosh.json` for one-click instant testing.

---

## Dependency Graph

```
Document Inspection & Storage API
    │
    ├── Local & Cloud Question Synthesis (QuizGenerator + LocalExtractor)
    │       │
    │       ├── Frontend Document Ingestion Studio & Topic Picker
    │       │       │
    │       │       ├── Assessment Engine with Live Source Citation Inspector
    │       │       │
    │       │       └── AI Model & Key Configuration Modal
    │       │
    │       └── Knowledge Library UI (Amrit Gyaan Kosh)
    │
    └── Official MoSPI Competency Certificate & Dossier Export
```

---

## Task Breakdown by Phase

### Phase 1: Document Ingestion Studio & Live Source Citations
- **Task 1: Document Inspection Endpoint (`/api/quiz/inspect-document`)**
- **Task 2: Document Ingestion Studio & Topic Selector UI**
- **Task 3: Live Document Source Citation Slide-Over Inspector**
- **Checkpoint 1: Ingestion & Citation Flow Verification**

### Phase 2: AI Model Selector & Inference Gateway
- **Task 4: AI Model & Key Configuration Modal (`AiModelModal.tsx`)**
- **Task 5: Secure Client Key Forwarding & Live Health Check Endpoint**
- **Checkpoint 2: Multi-Model Switching Verification**

### Phase 3: Multi-Document Knowledge Hub (*Amrit Gyaan Kosh*)
- **Task 6: Knowledge Store Backend Endpoints (`/api/knowledge`)**
- **Task 7: Document Library Browser & One-Click Assessment Launcher**
- **Checkpoint 3: Knowledge Library Flow Verification**

### Phase 4: Official Competency Certificate & Dossier Export
- **Task 8: Official MoSPI Assessment Certificate Modal & Print Styling**
- **Checkpoint 4: Complete System Regression & Verification (95+ Automated Tests)**

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|:---|:---:|:---|
| **Large PDF upload timeouts** | High | Multi-section windowing, 15MB size limits, and asynchronous 202 background job processing. |
| **Missing API keys on demo machine** | High | Default to `LocalQuestionExtractor.ts` for 100% offline, zero-API bespoke extraction directly from document text. |
| **Token cost spikes during multi-user testing** | Medium | SHA-256 semantic hash caching and pre-computed question banks for standard syllabus circulars. |
| **Browser printing layout inconsistencies** | Low | Dedicated `@media print` CSS rules and clean standalone modal container. |
