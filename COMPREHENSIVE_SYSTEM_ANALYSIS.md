# StatSkill AI — Exhaustive System Specification & Master Technical Blueprint

> **Institutional Stakeholders**: Ministry of Statistics and Programme Implementation (MoSPI) · National Statistical Systems Training Academy (NSSTA) · Mission Karmayogi (Capacity Building Commission - CBC)  
> **Applicable Cadres**: Indian Statistical Service (ISS), Subordinate Statistical Service (SSS / JSO / SSO), State Directorates of Economics and Statistics (DES), and Field Survey Enumerators  
> **Compliance & Standards**: Framework for Roles, Activities, and Competencies (FRAC v3.0) · ADL xAPI v1.0.3 / CMI-5 · Digital Personal Data Protection (DPDP) Act, 2023 · Guidelines for Indian Government Websites (GIGW 3.0) · W3C WCAG 2.2 Level AAA

---

## 1. Executive Summary & System Topology

StatSkill AI is a sovereign, role-based capacity-building and competency-diagnostic platform engineered for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India, in alignment with Mission Karmayogi (NPCSCB) and the Framework for Roles, Activities and Competencies (FRAC v3.0).

The platform addresses two operational constraints:
1. **Low-Bandwidth, Offline Edge Execution**: Operates in remote Field Operations Division (FOD-NSSO) regional offices and Computer Assisted Personal Interviewing (CAPI) survey stations without continuous network connectivity.
2. **Precision "Rule-to-Role" Competency Remediation**: Powered by asynchronous Large Language Model (LLM) question generation, cognitive distractor analysis, and a 4-tier Zone of Proximal Development (ZPD) learning pathway.

### Architectural Decision Records (ADRs)
* **Frontend Architecture**: Single-Page Application built with React 19, Vite, TypeScript, and Tailwind CSS. The decoupled Vite bundle downloads entirely to browser memory, enabling seamless zero-latency execution in offline rural field modes.
* **Backend Architecture**: Node.js, Express, TypeScript, `pdf-parse`, and `multer`. Employs non-blocking asynchronous job queues (`/api/quiz/generate-async`) with polling (`/api/quiz/status/:jobId`) to prevent timeout terminations during heavy document processing.
* **AI Engine & Multi-Tier Fallback**: Hybrid routing pipeline supporting Google Gemini (`gemini-1.5-flash`), Groq (`qwen/qwen3.8-27b`), and an Edge Offline Question Bank (`question_bank.json`) randomized via the `AntiCopyEngine` (Fisher-Yates shuffling).
* **Telemetry & Interoperability**: Implements ADL xAPI v1.0.3 and CMI-5 standards, dispatching JSON-LD completion statements to the national iGOT Karmayogi Learning Record Store (LRS).
* **Statutory Compliance**: Fully compliant with the Digital Personal Data Protection (DPDP) Act 2023, GIGW 3.0, and WCAG 2.2 AAA accessibility criteria.

---

## 2. High-Level Architecture & Component Map

```
+--------------------------------------------------------------------------------------------------+
|                                    STATSKILL AI CLIENT (REACT 19 SPA)                             |
|                                                                                                  |
|   +-------------------+  +-------------------+  +-------------------+  +---------------------+   |
|   |  Public Gateway   |  | Jan Parichay SSO  |  | Officer Dashboard |  |  FRAC Diagnostic    |   |
|   |  Landing Page (/) |  |   Portal (/login) |  |   Hub (/overview) |  |  Engine (/dashboard)|   |
|   +-------------------+  +-------------------+  +-------------------+  +---------------------+   |
|   |  Course Discover  |  | Competency Profile|  |  MoSPI Analytics  |  | Secret Admin Command|   |
|   |  Catalog(/discover|  | Pathway(/competenc|  |  Console(/analytic|  |  Center (/admin)    |   |
|   +-------------------+  +-------------------+  +-------------------+  +---------------------+   |
|                                                                                                  |
|   [Service Worker & IndexedDB CAPI Offline Cache] <---> [Hardware Capability Auto-Detector]       |
+-------------------------------------------------+------------------------------------------------+
                                                  | REST API (HTTP / JSON)
                                                  v
+-------------------------------------------------+------------------------------------------------+
|                                     STATSKILL AI BACKEND (NODE.JS / EXPRESS)                      |
|                                                                                                  |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+ |
|   | Auth & Demo SSO    |  | Quiz Generator &   |  | Multilingual Search|  | Course Matcher &   | |
|   | Controller (JWT)   |  | Anti-Copy Engine   |  | (Bhashini Lexicon) |  | Progression Engine | |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+ |
|   | xAPI / CMI-5       |  | Competency Engine  |  | Admin ACBP Dossier |  | Security Shield &  | |
|   | Statement Pipeline |  | (FRAC Matrix)      |  | Aggregator         |  | Input Sanitizers   | |
|   +--------------------+  +--------------------+  +--------------------+  +--------------------+ |
|                                                                                                  |
|   [Prisma ORM / PostgreSQL / Local Encrypted JSON Storage / 884 iGOT Course Vector Catalog]      |
+--------------------------------------------------------------------------------------------------+
```

---

## 3. Exhaustive Screen-by-Screen Technical Specification

### Screen 1: Public Gateway & National Landing Page
* **Route**: `/` or `/home`
* **Primary File**: [`LandingPage.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/pages/LandingPage.tsx)
* **Purpose**: Official ministerial portal presenting national Mission Karmayogi onboarding milestones, showcased MoSPI courses, rule-to-role cadre analytics, institutional hubs, and administrative drawers.

#### Subcomponents & Layout Structure
1. **`LandingHeader.tsx`**:
   * Top ministerial bar with tricolor accent line, Indian flag emblem, and bilingual language toggle (`English / हिंदी`).
   * Font scale controls (`A-`, `A`, `A+`) supporting 90% to 140% dynamic browser zoom.
   * Action triggers for `AccessibilityModal` (`Alt+A`), `KarmayogiSahayakModal` (`Alt+H`), and Jan Parichay SSO Login.
   * Triple-tap detector on the MoSPI Emblem to launch the `SecretAdminGatewayModal`.
   * Desktop and mobile responsive navigation drawers mapping to 6 informational modals (`about`, `newsroom`, `career`, `tenders`, `notifications`, `help`).
2. **`LandingHero.tsx`**:
   * Sovereign dispatch announcement bar highlighting NSSTA Cadre Session 2026-27 and DPDP Act 2023 compliance.
   * Left-anchored sovereign title block with Saffron-Gold accent line.
   * Primary Action Buttons: *Launch Diagnostic Assessment* (navigates to `/dashboard`) and *Browse 880+ MoSPI Courses* (navigates to `/discover`).
   * Dynamic milestone card featuring 60fps easing counter (`1.72 Crore+` civil servants onboarded nationally, 94.2% NSS CAPI proficiency, 36 States/UTs integration).
3. **`NationalMetricsBar.tsx`**:
   * 5-column statistical KPI bar rendering animated `CountUpNumber` metrics for Total Karmayogis Onboarded (17,228,635), Cataloged Courses (6,707), Learning Completions (152,381,557), Monthly Active Learners (1,640,920), and Certificates Issued Yesterday (212,042).
4. **`RuleToRoleAnalytics.tsx`**:
   * Interactive SVG Donut chart displaying competency distribution across Domain (1,290), Functional (3,113), and Behavioural (1,140) areas.
   * Civil service cadre participation breakdown across Group A (ISS), Group B (SSS), and Group C/D Enumerators.
   * MoSPI Divisions Competency Leaderboard (FOD 94%, DPD 91%, NAD 88%, DIID 86%, State DES 82%).
   * 36 States and UTs 7x4 intensity heatmap grid with colour thresholding.
   * e-HRMS 2.0 electronic service book integration banner.
5. **`ShowcasedCoursesCarousel.tsx`**:
   * Smooth-scrolling horizontal course carousel presenting 6 official NSSTA modules with domain tags, durations, competency tiers, and gradient badges.
   * "Start Diagnostic Assessment" direct launcher transferring the selected course title into the assessment generator context.
6. **`KarmayogiHubsOrbit.tsx`**:
   * Continuous 35-second CSS revolving orbit animation visualizing the 6 Karmayogi gateways (Career, Learn, Competency, Discussion, Events, Network Hubs) orbiting the Government of India emblem.
   * Video orientation card detailing Jan Parichay SSO, cadre selection, and offline paper set cycling.
7. **`LandingFooter.tsx`**:
   * 4-column ministerial directory (Quick Links, Statistical Cadres, The Mission, Legal/Accessibility notices).
   * Copyright 2026-2027 MoSPI notice with GIGW 3.0 and WCAG 2.2 AAA accreditation badges.
8. **`LandingInfoModal.tsx`**:
   * Dedicated modal rendering tabbed governmental content:
     * `about`: Mandate of StatSkill AI, NSSTA headquarters in Greater Noida, and CBC partnerships.
     * `newsroom`: Press releases on PLFS 2025-26, SUT modules, and CAPI paradata protocols.
     * `career`: ISS, SSS, and DIID career progression tracks with UPSC/SSC entry criteria.
     * `tenders`: Central Public Procurement Portal (CPPP) notices with GeM integration.
     * `notifications`: Office memorandums on mandatory 40-hour ACBP training.
     * `help`: 24x7 toll-free helpline (`1800-11-2026`), support email, and expandable accordion FAQs.

---

### Screen 2: Jan Parichay National Single Sign-On (`/login`)
* **Route**: `/login`
* **Primary File**: [`LoginPage.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/pages/LoginPage.tsx)
* **Purpose**: Simulates the authentic National Informatics Centre (NIC) "Jan Parichay" Single Sign-On authentication gateway for government officers.
* **Key Features**:
  * **1-Click Fast SSO Role Selector**:
    * *Junior Statistical Officer (JSO)*: Eshaan Sunthankar (FOD, NSSO — `PARICHAY_1042_NSSO`)
    * *Senior Statistical Officer (SSO)*: Ananya Mehta (DPD, NSSO — `PARICHAY_2088_NSSO`)
    * *Assistant Director (ISS)*: Rohan Iyer (NAD — `PARICHAY_3612_ISS`)
    * *Director (ISS)*: Kavita Rao (DIID — `PARICHAY_4820_ISS`)
  * **Dual Authentication Modes**:
    * **Gov ID / Password Login**: Validates government credentials against `/api/auth/demo-login` and stores a cryptographically signed JWT token in `localStorage`.
    * **Mobile OTP Authentication**: Simulates a 6-digit one-time password flow with a 30-second resend timer and visual input boxes.

---

### Screen 3: Officer Overview & Learner Dashboard (`/overview`)
* **Route**: `/overview`
* **Primary File**: [`OfficerDashboard.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/dashboard/OfficerDashboard.tsx)
* **Purpose**: Serves as the officer's personalized workbench, featuring an interactive 6-axis SVG Spider Radar chart, recent diagnostic assessment mistake ledger, division benchmarks, and active peer capacity cohorts.
* **Core Capabilities**:
  1. **6-Axis Polar Coordinate Spider Radar**:
     * Coordinates computed using trigonometry:
       $$x = \text{center} + r \times \cos(\theta), \quad y = \text{center} + r \times \sin(\theta)$$
     * 6 statistical axes: *Survey Design*, *CAPI Enumeration*, *Data Privacy*, *Field Ethics*, *Macro Indices*, *Data Analytics*.
     * 5 concentric web polygons (20%, 40%, 60%, 80%, 100% capacity levels).
     * Dashed benchmark polygon showing official MoSPI target standards.
     * Gradient-filled assessed proficiency polygon with vertex glowing nodes and hover tooltips showing exact score, FRAC level, and target gap.
  2. **MoSPI Capacity Cohorts Panel**: Peer learning groups (e.g., *NSSO 79th Round Household Survey*, *SNA 2008 Working Group*, *AI & Big Data*, *DPDPA 2023 Taskforce*) dynamically prioritized based on the officer's lowest competency scores.
  3. **Recent Diagnostic Assessments & Mistake Analysis Ledger**: Tabular history detailing assessment title, category, date, duration, score, and pass/remedial status.
  4. **Misconception Diagnostic Inspector Modal**: Itemized question audit highlighting the officer's chosen distractor, the statutory correct key, and the underlying conceptual root cause citing exact MoSPI manual clauses.

---

### Screen 4: Sovereign Edge-AI Assessment Engine (`/dashboard` or `/assessment`)
* **Route**: `/dashboard` or `/assessment`
* **Primary File**: `Dashboard.tsx` (Tab: `dashboard`)
* **Purpose**: Conducts timed or untimed competency evaluations mapped to Bloom's taxonomy and FRAC Levels 1 to 5.
* **Key Features**:
  1. **4-Set Paper Reshuffle Engine**: Supports balanced papers (**Set A, Set B, Set C, Set D**) with up to 3 reshuffles per session.
  2. **Adaptive Exam Timer**: 150-second countdown bar with visual warnings transitioning to Amber at 60s and pulsing Red at 30s.
  3. **Anti-Spam Rapid-Click Shield**: Enforces a 5-second cooldown if more than 5 rapid clicks occur in a 2-second burst via [`useAntiSpam.ts`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/hooks/useAntiSpam.ts).
  4. **Instant Diagnostic Feedback & Citations**: Answering an option provides instant affirmative or corrective feedback with official manual citations (e.g., *NSSO Survey Design Manual Vol. 78, Chapter 3*).
  5. **Post-Assessment Performance Report ([`AssessmentAnalysisReport.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/assessment/AssessmentAnalysisReport.tsx))**: Comprehensive scorecard displaying score percentage, time taken, readiness rating, and itemized question audit.

---

### Screen 5: 880+ Government Course Discovery Catalog (`/discover`)
* **Route**: `/discover`
* **Primary File**: `Dashboard.tsx` (Tab: `discover`)
* **Purpose**: Multilingual, Indic-phonetic search directory indexing 884 authentic training courses from iGOT Karmayogi, NSSTA TPAC, and ISTM.
* **Key Features**:
  1. **Bhashini-Aligned Multilingual Search**: Real-time search bar with 250ms debounce supporting English, Hindi (Devanagari), and Romanized Indic terms (e.g., *pratichayan*, *प्रतिचयन*, *mudrasphiti*).
  2. **Domain Category Filter Pills**: *All*, *Statistical Competencies*, *Technical Competencies*, *Digital Governance*, and *Behavioural and Managerial Competencies*.
  3. **Guaranteed Zero-Blank Offline Catalog**: Pre-populates 9 authentic MoSPI fallback courses (`FALLBACK_COURSES`) ensuring instant visibility even during offline or low-connectivity states.

---

### Screen 6: FRAC Competency Profile & 4-Tier ZPD Pathway (`/competency`)
* **Route**: `/competency`
* **Primary File**: [`PersonalisedPathway.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/recommendation/PersonalisedPathway.tsx)
* **Purpose**: Displays the officer's Framework for Roles, Activities and Competencies (FRAC) matrix alongside an automated 4-Tier Zone of Proximal Development prescriptive learning roadmap.
* **4-Tier Progression Architecture**:
  * **Tier 1: Foundation & Prerequisite (Level 1–2)**: Core statistical principles and data literacy.
  * **Tier 2: Operational Reinforcement (Level 3)**: CAPI protocols, field data scrubbing, and survey scrutiny.
  * **Tier 3: Core Cadre Benchmark (Level 4)**: Mandated curriculum for cadre accreditation (e.g., National Accounts, SUT Balancing).
  * **Tier 4: Strategic Leadership & Policy (Level 5)**: Big data architecture, AI/ML nowcasting, and DPDP Act compliance.

---

### Screen 7: xAPI Telemetry & MoSPI Analytics Console (`/analytics`)
* **Route**: `/analytics`
* **Primary File**: `Dashboard.tsx` (Tab: `analytics`) & [`XApiTelemetryDrawer.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/ui/XApiTelemetryDrawer.tsx)
* **Purpose**: Inspects learning analytics, national completion metrics, and real-time xAPI/CMI-5 statement payloads.
* **Key Elements**:
  * Metric KPI Cards: *Assessments Logged*, *Average FRAC Proficiency*, and *Primary Training Need*.
  * Slide-Out Telemetry Drawer: Displays raw JSON-LD xAPI statement payloads containing `actor`, `verb`, `object`, and `result` parameters dispatched to `https://igotkarmayogi.gov.in/lrs/v1/statements`.

---

### Screen 8: Secret HQ Admin Command Center (`/admin` or `Ctrl+Shift+A`)
* **Route**: `/admin` (PIN: `1042` or `MOSPI2026`)
* **Primary File**: [`AdminCommandCenter.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/admin/AdminCommandCenter.tsx) & [`SecretAdminGatewayModal.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/admin/SecretAdminGatewayModal.tsx)
* **Purpose**: Restricted administrative dashboard for MoSPI leadership, NSSTA administrators, and the Capacity Building Commission (CBC).
* **Core Capabilities**:
  1. **Macro KPI Cards**: Total Cadre Strength (3,220 officers), System Readiness Score (78.4%), ACBP Compliance Score (84.2%), and Active Bottlenecks (3 flagged).
  2. **Division Selector & Deep-Dive Heatmap Cards**: Breakdown across FOD-NSSO, DPD-NSSO, NAD-CSO, and DIID-MoSPI.
  3. **Regional Circles Geographical Distribution**: 5 operational circles (Northern, Western, Southern, Eastern, North-Eastern).
  4. **CBC ACBP Dossier Generator ([`AcbpDossierModal.tsx`](file:///c:/Users/Eshaan%20Sunthankar/Documents/SIH/statskill-ai/frontend/src/components/admin/AcbpDossierModal.tsx))**: Formats and generates an official audit report with executive summary, division allocations, and statutory compliance certifications.

---

## 4. Backend Services & Recommendation Mathematical Formula

### Multi-Factor Course Suitability Score
$$\text{Score} = (0.35 \times \text{DomainMatch}) + (0.30 \times \text{TopicOverlap}) + (0.20 \times \text{ZPDLevelProximity}) + (0.15 \times \text{ProviderPrestige})$$

### Two-Tier Rate Limiting Policy
* **Global API Limiter**: 120 requests/minute, 30 burst limit, 10s quarantine cooldown.
* **Quiz Generator Limiter**: 20 requests/minute, 5 burst limit, 10s quarantine cooldown.

---

## 5. Automated Verification Test Suite Summary

```
================================================================================
Frontend Integration & Unit Tests (Vitest + React Testing Library): 54 / 54 PASS
================================================================================
  ✓ AdminDashboard.test.tsx          - Division KPIs, ACBP modal, refresh
  ✓ AntiSpam.test.tsx                - Rapid click lockouts and cooldowns
  ✓ AssessmentAnalysisReport.test.tsx - Scorecard calculations, itemized audit
  ✓ Dashboard.integration.test.tsx    - Full end-to-end user workflows
  ✓ GuideAndAccessibility.test.tsx    - Speech synthesis, contrast modes
  ✓ OfficerDashboard.test.tsx        - SVG Spider Radar, mistake modal
  ✓ OfflineStatusBar.test.tsx        - Offline banner, reconnection toasts
  ✓ PersonalisedPathway.test.tsx     - 4-Tier ZPD pathway rendering
  ✓ Routing.test.tsx                 - Route parsing and history navigation
  ✓ XApiTelemetryDrawer.test.tsx     - JSON-LD syntax, clipboard copy

================================================================================
Backend Integration & Security Tests (Jest + Supertest): 29 / 29 PASS
================================================================================
  ✓ admin.test.ts                    - Division metrics and ACBP dossier synthesis
  ✓ auth.test.ts                     - Jan Parichay JWT authentication
  ✓ recommendation.test.ts           - 4-Tier ZPD pathway and cluster chains
  ✓ security_audit.test.ts           - XSS sanitization, null byte protection
  ✓ security_ratelimit.test.ts       - Burst quarantine and rate limits
  ✓ telemetry.test.ts                - xAPI CMI-5 schema validation
================================================================================
Total Test Pass Rate: 83 / 83 Tests (100% Green Across Stack)
================================================================================
```
