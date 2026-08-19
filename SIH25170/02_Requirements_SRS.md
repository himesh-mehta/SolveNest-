# SIH25170 — Software Requirements Specification (SRS)

## 1. Introduction

This document outlines the functional and non-functional requirements for the **GPT-OSS Multimodal Vision for Earth Observation Data** platform. It provides developers and evaluators with a detailed specification of what the system must accomplish.

---

## 2. Complete Feature Set Matrix (MVP vs. Advanced)

| Feature | MVP (Hackathon Core) | Advanced (Production Expansion) |
| :--- | :--- | :--- |
| **Authentication** | Email/password login with JWT sessions | OAuth2 integration, organization role-based access control |
| **Map AOI** | Interactive polygon/rectangle drawing on map | Multi-AOI projects, saved AOI library with folders |
| **EO Data Retrieval** | GEE Sentinel-2 optical data (fallback: Sentinel-1, Landsat) | ISRO Bhoonidhi/Bhuvan API connectors, STAC catalog support |
| **Image Upload** | Client-side PNG/JPG/GeoTIFF format & size validation | Large-scale multi-gigabyte tiled GeoTIFF ingestion |
| **Preprocessing** | Basic cloud masking, re-projection, scaling, tiling | Advanced sensor-specific radiometry/geometry calibration |
| **Vision Understanding** | Pre-trained ViT or ResNet base feature extractor | Specialized Remote Sensing/EO-specific foundation models |
| **Multimodal Alignment** | Linear or MLP projection mapping visual tokens to LLM | LoRA tuning of alignment layers, multi-temporal fusion |
| **GPT-OSS Reasoning** | Quantized 20B parameters hosted locally/on-premise | Full 120B model inference on cloud GPU clusters |
| **Change Detection** | Pixel-wise index differences + adaptive thresholding | Deep learning-based temporal change networks |
| **EO Indices** | NDVI (Vegetation), NDWI (Water), NDBI (Built-up) | Specialized indices (e.g., EVI, SAVI, BAI, NDSI) |
| **Natural Language Chat** | Question-answering over current analysis & statistics | Multi-turn contextual chat with interactive canvas hooks |
| **Visualization** | Before/After/Change map layers, dynamic opacity | Side-by-side split map window, raster time-series playback |
| **Reports** | PDF, CSV (statistics), and GeoJSON exports | ESRI Shapefiles, automated scheduled reporting |
| **History** | Local/User history panel of recent analyses | Global searchable project catalog with tags and sharing |
| **Real-time Status** | WebSocket connection for backend progress updates | Distributed job orchestrator, task queues (RabbitMQ/Celery) |

---

## 3. Target User Personas

1.  **SIH Hackathon Judges (Primary):** Need to verify that the system is fully functional, uses real data, and integrates `GPT-OSS` text reasoning with EO imagery instead of simply faking chatbot answers.
2.  **Beginner Analysts & Decision Makers:** Users who want to monitor environmental changes (e.g., deforestation or urbanization) but do not understand remote-sensing math. They rely on the AI to explain the maps and charts.
3.  **GIS Experts / Researchers:** Users who need quantitative evidence (exact NDVI differences, coordinates, confidence scores) and want to export files to external GIS tools like QGIS or ArcGIS.

---

## 4. Functional Requirements

### 4.1 User Account & Authentication
*   **Req-1.1:** Users must be able to sign up with name, email, password, and optional organization.
*   **Req-1.2:** Users must login securely, receiving a JWT token stored in secure HTTP-only cookies or state.
*   **Req-1.3:** Every request to projects, analyses, or chat history must validate token ownership.

### 4.2 Workspace & AOI Selection
*   **Req-2.1:** The user must see an interactive map (base-map satellite tiles).
*   **Req-2.2:** The user must be able to draw an Area of Interest (polygon or rectangle) directly on the map.
*   **Req-2.3:** The frontend must calculate and display the area of the drawn polygon in $\text{km}^2$. Bounding boxes larger than $50\text{ km}^2$ must prompt a warning/constraint check for MVP safety.
*   **Req-2.4:** The user must be able to search for locations using a geocoder search bar.

### 4.3 Temporal & Sensor Configuration
*   **Req-3.1:** The user must select two timestamps ("Before" date and "After" date/year).
*   **Req-3.2:** The user must choose the satellite sensor source (Sentinel-2 default, with placeholder configurations for Landsat, Sentinel-1, and ISRO).

### 4.4 Geospatial Processing & Analysis (The EO Engine)
*   **Req-4.1:** The system must automatically fetch Sentinel-2 imagery for the selected dates.
*   **Req-4.2:** The backend must run cloud masking to clean up cloudy scenes.
*   **Req-4.3:** The system must calculate:
    *   **NDVI:** Normalized Difference Vegetation Index:
        $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
    *   **NDWI:** Normalized Difference Water Index:
        $$\text{NDWI} = \frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR}}$$
    *   **NDBI:** Normalized Difference Built-up Index:
        $$\text{NDBI} = \frac{\text{SWIR} - \text{NIR}}{\text{SWIR} + \text{NIR}}$$
*   **Req-4.4:** The system must run pixel-difference thresholding between the "before" and "after" indices to produce a binary "change mask" image.

### 4.5 Multimodal AI Reasoning & Tool Calling
*   **Req-5.1:** GPT-OSS must receive the query along with the projected visual tokens and tabular EO features.
*   **Req-5.2:** The AI must only reason on values returned from verified GIS tool calls (e.g., `calculate_indices`). It must never hallucinate values.
*   **Req-5.3:** If the input imagery or data quality is poor, the AI must respond with an "insufficient evidence" state rather than generating a false answer.

### 4.6 Reporting & Exporting
*   **Req-6.1:** Users must be able to generate and download a PDF report containing maps, charts, and AI text.
*   **Req-6.2:** Users must be able to download statistics as CSV and the change coordinates/features as GeoJSON.

---

## 5. Non-Functional Requirements

*   **Performance:** Satellite imagery retrieval and visual encoder processing must run asynchronously. The server must return a Job ID immediately upon request, and the frontend should show real-time progress via WebSocket.
*   **Reliability (Hackathon Resilience):** A comprehensive "Demo Mode" containing pre-computed data for a key area (e.g., Mumbai Urban Expansion) must be available. If any external API (GEE or LLM) goes down during a live demo, the system must degrade gracefully to this cache.
*   **Security:** API keys, database credentials, and service accounts must remain on the backend server.
*   **Usability:** Page loads must never display blank screens. Skeleton screens must be shown during data fetches.
