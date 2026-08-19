# SIH25170 — Development Roadmap

This document outlines the step-by-step 10-phase development plan, team responsibilities, and key engineering principles for building the **GPT-OSS Multimodal Vision for Earth Observation Data** platform.

---

## 1. 10-Phase Hackathon Build Plan

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ Phase 1: Foundation     ├────►│ Phase 2: Map            ├────►│ Phase 3: EO Engine      │
│ • Docker, FastAPI, Auth │     │ • Drawing, Date Picker  │     │ • GEE Sentinel-2, NDVI  │
└─────────────────────────┘     └─────────────────────────┘     └───────────┬─────────────┘
                                                                            │
                                                                            ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ Phase 6: GPT-OSS Agent  │◄────│ Phase 5: Vision Engine  │◄────│ Phase 4: Change Det.    │
│ • Quantized LLM, Tools  │     │ • Encoder Embeddings    │     │ • Threshold, Area km2   │
└───────────┬─────────────┘     └─────────────────────────┘     └─────────────────────────┘
            │
            ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ Phase 7: Multimodal     ├────►│ Phase 8: Chat Workspace ├────►│ Phase 9: Reports/Export │
│ • MLP Projector, Tokens │     │ • Threading, Citations  │     │ • PDF, CSV, GeoJSON     │
└─────────────────────────┘     └─────────────────────────┘     └───────────┬─────────────┘
                                                                            │
                                                                            ▼
                                                                ┌─────────────────────────┐
                                                                │ Phase 10: Polish & Demo │
                                                                │ • WS, Skeletons, Cache  │
                                                                └─────────────────────────┘
```

### Phase 1 — Foundation
*   **Target:** Setup code repositories, basic configurations, and containerization.
*   **Deliverables:** Unified Git monorepo, Docker Compose configuration, FastAPI skeleton, PostgreSQL base tables, signup/login APIs, and the Next.js shell with sidebar layout.

### Phase 2 — Map
*   **Target:** Create the interactive GIS interface.
*   **Deliverables:** Leaflet / MapLibre GL map container, drawing manager (Polygon/Rectangle tools), boundary calculator, location search geocoder, and date picker inputs.

### Phase 3 — EO Engine
*   **Target:** Establish Google Earth Engine integration.
*   **Deliverables:** Backend GEE client credentials connection, Sentinel-2 image query parser, cloud masking filter, and median composite processor.

### Phase 4 — Change Detection
*   **Target:** Implement image math calculations.
*   **Deliverables:** Computations of NDVI, NDWI, and NDBI indices. Pixel-wise differences, adaptive change threshold mask generator, and calculated change area in $\text{km}^2$.

### Phase 5 — Vision Engine
*   **Target:** Extract visual descriptors.
*   **Deliverables:** Pre-trained ViT/ResNet patch embedding scripts, feature caches for common coordinates, and image-resizing pipeline adapters.

### Phase 6 — GPT-OSS Agent
*   **Target:** Configure LLM reasoning.
*   **Deliverables:** Quantitative model deployment (20B parameters), prompting template framework, and deterministic API tools (`get_eo_scene`, `calculate_indices`).

### Phase 7 — Multimodal Connection
*   **Target:** Align vision features with language model.
*   **Deliverables:** MLP projection weights alignment, mapping visual descriptors to LLM token layers, and testing grounded question responses.

### Phase 8 — Chat Workspace
*   **Target:** Interactive QA interface.
*   **Deliverables:** UI chat layout panel, streaming text response loader, suggested chip prompts, and expandable "View Evidence" detail drawers.

### Phase 9 — Reports & Exports
*   **Target:** Output generation.
*   **Deliverables:** ReportLab compiler creating PDF sheets containing results and AI texts, CSV metrics, and GeoJSON change vector downloads.

### Phase 10 — Polish & Demo
*   **Target:** Final optimizations.
*   **Deliverables:** WebSocket connection for task progress bars, UI skeleton loaders, responsive CSS fixes, and the offline Demo Mode using cached Mumbai expansion assets.

---

## 2. Team Split & Ownership

We assume a team size of 4 to 6 members. If the team is smaller, tasks must be grouped according to matching disciplines.

| Role / Member | Responsibilities | Key Dependencies |
| :--- | :--- | :--- |
| **Member 1: Frontend Developer** | Next.js layout, state managers, Leaflet map coordinates drawn, custom UI controls, and chat panels. | Member 2 & 3 API outputs |
| **Member 2: Backend Developer** | FastAPI routes, Auth database models, Redis job broker, and WebSocket connections. | Member 1 layouts |
| **Member 3: Geospatial Specialist** | GEE client integrations, preprocessing functions, NDVI/NDWI calculation, and change coordinates. | Member 2 database models |
| **Member 4: Computer Vision Engineer**| Vision encoder (ViT) embeddings, image patch scaling, and MLP projection adapter. | Member 3 raster outputs |
| **Member 5: AI Agent Engineer** | GPT-OSS configuration, prompting models, and deterministic GIS tool calling. | Member 4 projection adapter |
| **Member 6: Integrator & Presenter** | System testing, ReportLab PDF script, pitch deck slides, and the Demo Mode setup. | All members |

### Collaboration Rule
> **Contract-First Development:** Developers must not edit the same files simultaneously. Establish clear API endpoint contracts (endpoints, payloads, responses) and database schemas first. Mock the data interfaces so the frontend and AI agent can progress in parallel while the background engines are still being coded.
