# SIH25170 — Testing & Evaluation Plan

This document specifies the software testing targets, machine learning evaluation metrics, security guidelines, and fallback verification procedures to ensure the platform performs reliably under stress.

---

## 1. Testing Targets by Module

To verify the integrity of the monorepo, each core module is evaluated against specific tests:

| Module / Feature | Target Test Coverage | Validation Criteria |
| :--- | :--- | :--- |
| **Authentication** | Sign-up, Sign-in, Session expiration, Unauthorized project access. | JWT invalid token rejection, SQL injection protection on email fields. |
| **AOI Drawing** | Rectangles, multi-point polygons, self-intersecting lines. | Rejection of self-intersecting geometry, warning on areas $> 50\text{ km}^2$. |
| **EO Retrieval** | Valid sensors, custom date boundaries, cloud masking. | Error handling for dates with zero satellite coverage. |
| **Preprocessing** | Band selection, normalization, cropping, re-projection. | Output raster dimensions ($C \times H \times W$) and UTM projection correctness. |
| **Land Cover Class.**| Land classification (5 classes). | Average accuracy, confusion matrix, macro-F1 score on EuroSAT. |
| **Change Detection** | Pixel-wise delta difference calculations. | Precision, Recall, and IoU (Intersection over Union) on validation sets. |
| **Multimodal VQA** | Natural language reasoning over visual features. | Answer groundedness (no hallucinations), and "insufficient evidence" triggers. |
| **Chat Session** | Context preservation over multiple turns. | Thread ID matching; verifying the agent recalls previous questions. |
| **Performance** | API endpoint load times under concurrent queries. | Average API response $< 200\text{ms}$ (excluding asynchronous processing). |
| **Reports** | Compilation of PDFs, CSVs, and GeoJSONs. | Valid PDF generation and GeoJSON polygon coordinates parsing. |

---

## 2. Judge-Friendly Demo Metrics

These metrics are highlighted on the developer documentation page and dashboard to show the technical rigor of the project to SIH judges.

*   **Average AOI Processing Time:** Time taken from clicking "Run" to retrieving maps (Target: $< 15\text{ seconds}$).
*   **Change Detection IoU / F1-Score:** Quantitative validation score of the change mask against ground-truth change data (Target: F1 $> 0.82$).
*   **Groundedness Score:** Percentage of AI-generated claims directly linked to GIS facts in the evidence drawer (Target: $100\%$ grounding rate).
*   **Linked Evidence Citation Rate:** Percentage of assistant responses displaying an expandable evidence dropdown (Target: $> 90\%$).
*   **Successful Analysis Job Rate:** Percentage of Celery worker tasks completing without failure states (Target: $> 99\%$).
*   **Land-Cover Classification Accuracy:** Model performance on standard benchmarks (Target: $> 95\%$ on EuroSAT).

---

## 3. Security, Privacy & Reliability Guidelines

*   **Secrets Prevention:** API keys, database credentials, and GEE service account JSON keys must be loaded exclusively via environment variables (`.env`) on the backend server. Scanning tools (e.g., GitGuardian) will block commits containing secret strings.
*   **Upload Filtering:** Custom image upload routes must restrict files to GeoTIFF, PNG, and JPG formats. File size limits are capped at $20\text{MB}$ for MVP testing to prevent server memory exhaustion.
*   **Database Partitioning:** Every SQL query fetching projects, AOIs, or chats must validate ownership:
    ```sql
    SELECT * FROM projects WHERE user_id = :current_user_id AND id = :project_id;
    ```
*   **API Rate Limiting:** Apply rate limiters (e.g., Slowapi) restricting authentication routes to 5 requests/minute and LLM chat to 20 requests/minute to prevent denial-of-service attempts.

---

## 4. Live Hackathon Fallback Pathway

Live presentations during hackathons are prone to network degradation and third-party API service failures (e.g., GEE quotas or LLM downtime). The platform utilizes a robust fallback design to ensure the presentation succeeds under any circumstances.

```
                  ┌───────────────────────────────┐
                  │   User initiates Analysis     │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                     /───────────────────────\
                    <   Are APIs responding?  >
                     \───────────────────────/
                                 │
                    ┌────────────┴────────────┐
                YES │                         │ NO
                    ▼                         ▼
        ┌───────────────────────┐ ┌───────────────────────┐
        │  Fetch Live Imagery   │ │ Activate Demo Cache   │
        │  & Run GPU Inference  │ │ • Load Mumbai 2020  │
        │                       │ │ • Load Mumbai 2025  │
        │                       │ │ • Load Pre-comp.    │
        │                       │ │   Stats & AI Text   │
        └───────────────────────┘ └───────────────────────┘
```

### Cached Demo Configuration (Mumbai Expansion)
*   **AOI Name:** Mumbai Urban Expansion.
*   **Coordinates:** Bounding Box `[72.80, 18.95, 73.00, 19.10]`.
*   **Before/After Timestamps:** Year 2020 vs. Year 2025.
*   **Sensor:** Sentinel-2.
*   **Pre-computed Assets:**
    *   `mumbai_2020_rgb.png` & `mumbai_2025_rgb.png`
    *   `mumbai_change_mask.png` & `mumbai_ndvi_chart.json`
    *   *Pre-cached AI Answers:* Complete conversation trees for common questions like: *"Why did the vegetation decrease?"*, *"What is the urban growth rate?"*.
*   **UX Implementation:** If GEE or model endpoints time out (toggled via a hidden keyboard shortcut or visible "Demo Mode" header banner), the frontend automatically injects these pre-calculated assets and updates the step status checklists normally, maintaining the appearance of active processing.
