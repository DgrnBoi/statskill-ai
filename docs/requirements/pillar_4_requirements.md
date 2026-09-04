# Requirements Specification: Pillar 4 — Automated AI Question Generation

## 1. Problem Statement Clause
> *"...capable of generating Quizzes and Multiple Choice Questions (MCQs) from uploaded learning materials..."*

---

## 2. Theoretical & Conceptual Definition

### A. The Document-to-Assessment RAG Pipeline
In the Official Statistical System, administrative and methodology guidelines are continually updated (e.g., *National Sample Survey [NSS] Round Instructions*, *Consumer Price Index [CPI] Base-Year Revisions*, *Periodic Labour Force Survey [PLFS] Field Manuals*). Manually authoring assessment banks for hundreds of specialized circulars is economically unfeasible and introduces human authoring latency.

This pillar requires an automated, AI-driven **Retrieval-Augmented Generation (RAG)** pipeline capable of ingesting unstructured, domain-heavy government training materials and converting them into psychometrically sound assessment instruments.

---

### B. Psychometric & Pedagogical Standards for Generated MCQs
Valid civil service assessment demands strict adherence to educational measurement standards (Bloom's Revised Taxonomy):
1. **Cognitive Depth Continuum**:
   * **Recall (Level 1)**: Tests definitions, survey terminology, legal acronyms (e.g., *"What is an FSU?"*).
   * **Comprehension & Application (Level 2–3)**: Tests procedural execution and survey rule application (e.g., *"Given a rural hamlet group selection rule, which household is sampled?"*).
   * **Analysis (Level 4)**: Tests error diagnosis, sampling bias detection, and methodology trade-offs.
2. **Plausible Distractor Engineering**:
   * Distractors (incorrect options) must not be obviously absurd. They must reflect common real-world errors made by survey investigators (e.g., confusing *Simple Random Sampling* with *Systematic Sampling*, or mixing up *Laspeyres* and *Paasche* index formulas).
3. **Deterministic Answer Grounding & Zero Hallucination**:
   * The correct option must be strictly verifiable against the source text.
   * Every question must carry a **verifiable citation** referencing the specific chapter, section, or paragraph of the uploaded document.
4. **Pedagogical Feedback (Explanations)**:
   * Every generated item must include a detailed explanation articulating *why* the correct answer is valid and *why* specific distractors fail.

---

### C. Technical Pipeline Specifications
1. **Document Ingestion**: Parsing complex PDFs, extracting text while preserving statistical tables, mathematical formulas, and hierarchical headings.
2. **Structured JSON Output Schema**: Generating deterministic, machine-readable question objects conforming to:
   * `question`: The interrogative stem.
   * `options`: An array of exactly 4 distinct choices.
   * `correctAnswer`: The unambiguous correct string.
   * `explanation`: Contextual pedagogical reasoning.
   * `sourceCitation`: Direct reference to the source document.
3. **Caching & Token Efficiency**: Preventing redundant LLM inference costs by indexing and caching generated questions per document fingerprint (SHA-256 hash or canonical module ID).

---

## 3. Evaluator & Ministry Expectations

When evaluated by technical reviewers, Pillar 4 must satisfy four explicit criteria:

### 1. Zero Hallucination & Strict Groundedness
* Evaluators will upload official MoSPI circulars and verify whether questions fabricate non-existent rules or numbers. The AI must remain strictly grounded in the uploaded context.

### 2. Live Document Processing Capability
* The system cannot rely solely on pre-packaged quizzes. Evaluators expect to upload an arbitrary statistical PDF during the demonstration and watch the engine parse and formulate new questions in real time.

### 3. Edge / Low-Bandwidth Resilience
* Field offices in remote statistical zones may experience severe connectivity constraints. Evaluators expect a fallback architecture (local caching / offline generation modes) so officers can complete assessments even under degraded network conditions.

### 4. Psychometric Integrity
* Questions must follow proper MCQ formatting: grammatically parallel options, unambiguous keys, and absence of clues in the question stem.
