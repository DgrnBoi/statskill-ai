# Requirements Specification: Pillar 3 — iGOT Karmayogi Ecosystem Integration

## 1. Problem Statement Clause
> *"...through integration with the iGOT Karmayogi ecosystem..."*

---

## 2. Theoretical & Conceptual Definition

### A. The National Learning Infrastructure
**iGOT Karmayogi** (*Integrated Government Online Training*) is the flagship digital platform under India’s National Programme for Civil Services Capacity Building (NPCSCB). Architecturally anchored on the open-source **Sunbird** digital public infrastructure, iGOT operates as a federated learning ecosystem for civil servants across central ministries, state departments, and field directorates.

Integration with this ecosystem demands compliance with national and international public digital learning standards rather than maintaining a disconnected, siloed database.

---

### B. The xAPI (Experience API / CMI-5) Standard
In the iGOT architecture, decentralized learning activities report back to a centralized **Learning Record Store (LRS)** using the **xAPI (IEEE 9274.1.1)** specification. 

Every assessment activity, question interaction, and competency milestone generates a standardized **xAPI JSON-LD Statement** composed of four immutable elements:
1. **Actor**: The unique digital identity of the civil servant (linked to their government employee code, Parichay ID, and `@gov.in` / `@nic.in` account).
2. **Verb**: The standardized action token defining the interaction (e.g., `http://adlnet.gov/expapi/verbs/attempted`, `.../completed`, `.../passed`, `.../failed`).
3. **Object**: The exact learning asset or assessment URI (e.g., `https://statskill.mospi.gov.in/assessments/sampling-101`).
4. **Result**: The quantitative performance metrics, including:
   * `score.scaled`: Normalized score between $0.0$ and $1.0$.
   * `score.raw`: Absolute points achieved.
   * `success`: Boolean indicating whether the score met the official competency passing threshold ($\ge 60\%$).
   * `duration`: ISO 8601 formatted time spent.
5. **Context**: Administrative metadata tying the activity to MoSPI, the officer's cadre (ISS/SSS), and specific FRAC competency tags.

---

### C. Authentication Alignment: Jan Parichay (National SSO)
Civil service digital public goods do not maintain independent username/password databases. Interoperability demands alignment with **Jan Parichay**—the Government of India’s centralized Single Sign-On (SSO) gateway managing multi-factor, role-verified authentication across `gov.in` and `nic.in` credentials.

---

## 3. Evaluator & Ministry Expectations

When evaluated by government architects or hackathon judges, Pillar 3 must satisfy four explicit criteria:

### 1. Verifiable xAPI Telemetry Transmission
* The platform must not just calculate scores in client-side React memory.
* It must generate syntactically valid xAPI / CMI-5 statements upon assessment completion and dispatch them via standard HTTP POST payloads to an LRS endpoint.

### 2. Live Telemetry Observability (The LRS Inspector)
* Evaluators expect to inspect the emitted telemetry payload.
* The system must provide a mechanism to view the raw generated JSON-LD statement to verify correct Actor, Verb, Object, and Score formatting.

### 3. Canonical Course & Competency Referencing
* Recommendations and deep links must resolve to valid canonical iGOT course identifier schemas rather than dummy placeholder links.

### 4. Resilient Store-and-Forward Sync
* Recognizing that statistical field officers frequently operate in low-bandwidth or offline rural environments, the integration layer must support a **Store-and-Forward** mechanism: queuing xAPI statements in local edge storage and auto-syncing with the national LRS when connectivity restores.
