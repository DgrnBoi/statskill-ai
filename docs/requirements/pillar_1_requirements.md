# Requirements Specification: Pillar 1 — Competency Gap Identification

## 1. Problem Statement Clause
> *"...identifies competency gaps..."*

---

## 2. Theoretical & Conceptual Definition

### A. The FRAC Framework Foundation
In the Indian civil service and the iGOT Karmayogi ecosystem, competency management is anchored in the **FRAC Framework** (*Framework for Roles, Activities, and Competencies*). A competency represents a measurable cluster of knowledge, skills, and attitudes required to perform a specific government function.

Competencies are categorized into three core domains:
1. **Domain Competencies**: Specialized, technical knowledge and operational capabilities specific to the ministry or cadre (e.g., *Stratified Multi-Stage Sampling*, *Consumer Price Index [CPI] Compilation*, *Data Anonymization under DPDPA 2023*).
2. **Functional Competencies**: Operational, managerial, and administrative processes required across government units (e.g., *Official Report Drafting*, *Field Team Supervision*, *Public Procurement via GeM*).
3. **Behavioral Competencies**: Value-driven behavioral standards governing civil servants (e.g., *Data Integrity & Impartiality*, *Analytical Problem-Solving*, *Public-First Ethical Conduct*).

---

### B. Standardized 5-Tier Proficiency Scale
Under the FRAC standard, every competency is calibrated against a standardized 5-level proficiency continuum:

| Level | Designation | Operational Definition |
|---|---|---|
| **Level 1** | **Basic / Awareness** | Understands core definitions, concepts, and terminology. |
| **Level 2** | **Working / Practitioner** | Executes standard routine tasks under guidance/supervision. |
| **Level 3** | **Proficient / Autonomous** | Operates independently, handles edge cases, and enforces compliance. |
| **Level 4** | **Advanced / Leader** | Diagnoses systemic issues, designs new methodology, and mentors personnel. |
| **Level 5** | **Expert / Authority** | National/international domain specialist driving macro policy formulation. |

---

### C. Mathematical Formulation of a Competency Gap
A **Competency Gap** is the quantitative deficit between the required baseline for a designated post and the demonstrated capability of the incumbent officer:

$$\text{Competency Gap} = \text{Target Level (Required for Role)} - \text{Assessed Level (Demonstrated)}$$

* **$\text{Gap} \le 0$**: Proficiency meets or exceeds organizational benchmark; competency is satisfied.
* **$\text{Gap} > 0$**: Active performance deficit detected; triggers priority intervention.

---

## 3. Evaluator & Ministry Expectations

When evaluated by Ministry of Statistics and Programme Implementation (MoSPI) stakeholders or hackathon judges, Pillar 1 must satisfy five explicit criteria:

### 1. Role-to-Competency Mapping
* The platform must not assume generic, uniform standards across officers.
* Distinct cadres and designations (e.g., *Junior Statistical Officer [JSO]*, *Senior Statistical Officer [SSO]*, *Assistant Director*, *Director*) must possess distinct competency matrices with tailored target proficiency levels.

### 2. Evidence-Based Diagnostic Assessment
* Gaps cannot rely on subjective self-reporting or unverified claims.
* The system must evaluate officers through objective, diagnostic instruments (MCQs, scenario-based evaluations, practical exercises) to calculate demonstrated proficiency based on performance evidence.

### 3. Granular Sub-Skill Diagnosis
* Diagnostic output must isolate granular sub-competencies rather than issuing a binary overall score.
* If an officer passes 80% of a module but consistently fails questions related to *Non-Sampling Error Variance*, the system must isolate that specific concept as an active gap.

### 4. Quantified Gap Metrics
* Every identified gap must produce explicit, numerical metrics:
  * Role / Cadre of the officer.
  * Target Competency & required FRAC level.
  * Assessed proficiency level.
  * Quantitative deficit value (e.g., $-2$ levels) and priority tier (Critical vs. Moderate).

### 5. Persistent Competency State Tracking
* The competency record must function as an enduring "Skill Passport."
* Identified gaps must persist in the officer’s active profile until subsequent assessment evidence or validated learning completion proves that the gap has been resolved.
