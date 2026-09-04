# Requirements Specification: Pillar 2 — Personalized Training Recommendations

## 1. Problem Statement Clause
> *"...recommends personalized training..."*

---

## 2. Theoretical & Conceptual Definition

### A. The Prescriptive Engine Concept
While Pillar 1 serves as the **Diagnostic Engine** (identifying the specific deficiency), Pillar 2 serves as the **Prescriptive Engine** (formulating the targeted developmental intervention). 

A personalized training recommendation system is fundamentally distinct from a generic course catalog or search index:
* **Catalog Search (Pull-Based)**: The user manually types keywords and browses unranked listings based on self-perceived interest.
* **Personalized Recommendation (Push-Based / Algorithmic)**: The system analyzes the user's objective diagnostic data, computes deficits, and dynamically constructs an individualized learning prescription tailored to that specific officer's needs.

---

### B. Pedagogical Grounding: Zone of Proximal Development (ZPD) & Scaffolding
In adult learning theory (andragogy) and instructional design, effective skill acquisition adheres to the **Zone of Proximal Development (ZPD)**:
* **The Cognitive Overload Risk**: Assigning a Level 4 or Level 5 (Advanced / Policy) course to an officer who demonstrated a Level 1 (Basic Awareness) capability creates cognitive overload, low completion rates, and learning fatigue.
* **The Under-Challenge Risk**: Assigning a Level 1 introductory module to an officer already operating at Level 3 wastes administrative resources.
* **Algorithmic Level-Stepping**:
  $$\text{Target Recommended Course Level} = \text{Assessed Proficiency Level} + 1$$
  The algorithm must systematically scaffold the officer from their current baseline toward the mandatory role benchmark in incremental stages.

---

### C. Multi-Factor Recommendation Mechanics
The recommendation algorithm computes a composite suitability score across four distinct analytical vectors:

$$\text{Suitability Score} = (W_{\text{gap}} \cdot S_{\text{gap}}) + (W_{\text{level}} \cdot S_{\text{level}}) + (W_{\text{role}} \cdot S_{\text{role}}) + (W_{\text{pacing}} \cdot S_{\text{pacing}})$$

1. **Deficit Priority ($S_{\text{gap}}$)**: Prioritizes competencies displaying the largest negative gap ($\text{Target Level} - \text{Assessed Level}$).
2. **Pedagogical Alignment ($S_{\text{level}}$)**: Enforces level-stepping ($L_{\text{current}} + 1$) so that prerequisite foundations precede advanced modules.
3. **Role & Cadre Context ($S_{\text{role}}$)**: Matches training content to the operational domain of the officer (e.g., *Field Operations Division [FOD]* vs. *National Accounts Division [NAD]*).
4. **Learning Granularity & Pacing ($S_{\text{pacing}}$)**: Prioritizes modular, micro-learning units (1–3 hours) for critical operational deficiencies before assigning long-form certifications.

---

## 3. Evaluator & Ministry Expectations

When evaluated by MoSPI capacity-building directorates or technical evaluators, Pillar 2 must satisfy five explicit criteria:

### 1. Direct Gap Causality (Traceability)
* The recommendation cannot operate as an opaque "black box."
* Every prescribed course must carry an explicit, transparent justification linked directly to diagnostic test evidence:
  * Example: *"Prescribed Course: Applied Survey Stratification is assigned because Officer demonstrated a Level 1 proficiency in Sub-Skill: FSU Selection."*

### 2. Structured Learning Pathways (Progression over Isolation)
* Recommendations must not be presented as disjointed, standalone links.
* Evaluators expect an ordered **Learning Pathway**:
  * **Step 1 (Remedial Focus)**: Targeted micro-module addressing the specific failed concept.
  * **Step 2 (Comprehensive Application)**: Full accredited competency course.
  * **Step 3 (Validation Milestone)**: Scheduled post-training reassessment to verify gap closure.

### 3. Role-Aware Contextualization
* Recommendations must adapt to operational duties.
* For an identical gap in "Data Quality & Validation":
  * A field investigator must receive *Field Data Scrubbing & CAPI Validation Protocols*.
  * A headquarters national accounts officer must receive *National Accounts Discrepancy Reconciliation*.

### 4. De-Duplication & Prerequisite Integrity
* The engine must verify an officer's historical learning record to avoid re-recommending modules already completed.
* It must enforce logical prerequisites, ensuring core mathematical/statistical principles precede specialized analytical tools.

### 5. Frictionless Actionability
* Recommendations must carry actionable deep links directly integrated into the government learning platform, allowing one-click enrollment without manual catalog hunting.
