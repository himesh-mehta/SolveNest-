# SIH 2025 — SIH25170: GPT-OSS Multimodal Vision for Earth Observation Data

Welcome to the Technical Specification Suite for the Smart India Hackathon (SIH 2025) Problem Statement **SIH25170**.

This directory contains a complete, decoupled blueprint designed to guide full-stack developers, ML engineers, and automated coding agents (such as Antigravity) through the development, testing, and presentation of the Earth Observation (EO) analysis and reasoning platform.

---

## 1. Directory Map & Document Indexes

To navigate the technical layers of the project, refer to the following specification documents:

*   **[01. Project Overview](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/01_Project_Overview.md):** High-level summary of the problem, the core value proposition, the connected goals (multimodal adapter + EO intelligence), and the end-to-end user journey.
*   **[02. Requirements & SRS](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/02_Requirements_SRS.md):** Software Requirements Specification listing MVP vs. Advanced feature matrices, target user personas, detailed functional rules, and core acceptance criteria.
*   **[03. System Architecture](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/03_System_Architecture.md):** Modular layered blueprints (UI, API, Data, ML, LLM), sequence diagrams tracing analysis calls, proposed monorepo folder layout, and production infrastructure setups.
*   **[04. UI/UX Specification](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/04_UI_UX_Specification.md):** Dark-scientific visual design tokens (colors, typography), micro-animation rules, responsive grids, and screen-by-screen navigation diagrams.
*   **[05. AI & ML Architecture](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/05_AI_ML_Architecture.md):** Details of the multimodal vision encoder, the projection adapter MLP configuration, training/alignment stages, and the GPT-OSS agent tool-calling framework.
*   **[06. Earth Observation Data & Datasets](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/06_EO_Data_Datasets.md):** Specifications for the EO Data Engine (GEE, Landsat, ISRO Bhoonidhi), standard scene metadata schemas, image preprocessing chains, and machine learning dataset split constraints.
*   **[07. Backend API & Database](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/07_Backend_API_Database.md):** FastAPI REST endpoints, WebSocket event structures, PostgreSQL SQLAlchemy schema layout, and Redis-Celery job broker queues.
*   **[08. Development Roadmap](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/08_Development_Roadmap.md):** A structured 10-phase build timeline detailing development priorities and team task delegations.
*   **[09. Testing & Evaluation](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/09_Testing_Evaluation.md):** Unit and integration testing targets, validation metrics (IoU, groundedness scores), security precautions, and live presentation fallback cached databases.
*   **[10. Hackathon Demo & Pitch Guide](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/10_Demo_Pitch.md):** A detailed 5-minute presentation script timeline, slide deck structure, and narrative strategy designed to succeed in front of judges.

---

## 2. Core Implementation Strategy

This project is built around one central design truth:

> **GPT-OSS is a text-only reasoning model.** It cannot directly process raw images. The platform uses a separate vision encoder and projection layer to translate satellite pixels into visual tokens that GPT-OSS can natively understand, combining them with deterministic GIS statistics to formulate evidence-backed explanations.

### Best Practices for Coding Agents & Developers
1.  **Contract-First Coding:** Rely on the API schemas in [07_Backend_API_Database.md](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/07_Backend_API_Database.md) and the TypeScript models in [04_UI_UX_Specification.md](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/04_UI_UX_Specification.md) to build in parallel. Mock database and external API services first.
2.  **Modular Decoupling:** Keep ML models, dataset pipelines, backend endpoints, and frontend views isolated in their respective folders as described in [03_System_Architecture.md](file:///c:/SEM/sem-4/mini_project/college/SolveNest-/SIH25170/03_System_Architecture.md).
3.  **Failsafe Demo First:** Implement the mock Demo Mode cache early. Ensure that the entire frontend user flow works perfectly using static local assets before integrating live GEE or LLM API calls.
