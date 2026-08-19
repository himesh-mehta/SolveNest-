# SIH25170 — AI & ML Architecture

This document describes the Machine Learning (ML) architecture designed to bridge Earth Observation (EO) imagery with OpenAI's open-weight text-only reasoning model, `GPT-OSS` (e.g., `gpt-oss-20b` or `gpt-oss-120b`).

---

## 1. The Multimodal Vision Pathway

**Core Constraint:** `GPT-OSS` is a text-only reasoning model. It cannot directly process raw, high-dimensional multi-band satellite raster images.

To solve this, we construct a modular vision pipeline that transforms raster tiles into visual embeddings, maps those embeddings into the language model's representation space, and injects them alongside textual EO indicators and questions.

### 1.1 Conceptual Pipeline
```
┌──────────────┐      ┌────────────────┐      ┌───────────────────┐
│ Satellite /  ├─────►│ Vision Encoder ├─────►│ Visual Embeddings │
│ EO Image Tile│      │ (ViT / ResNet) │      │ (e.g., dim=1024)  │
└──────────────┘      └────────────────┘      └─────────┬─────────┘
                                                        │
                                                        ▼
┌──────────────┐      ┌────────────────┐      ┌───────────────────┐
│ Language     │      │ GPT-OSS Agent  │      │ Projection MLP    │
│ Space Tokens ├◄─────┤  (Text LLM)    │◄─────┤ (Aligns Visual to │
│ + EO Stats   │      │                │      │  Language Space)  │
└──────────────┘      └────────────────┘      └───────────────────┘
```

---

## 2. Component Specifications

### 2.1 Vision Encoder Options
We evaluate four main architectures for encoding satellite image patches:
1.  **Vision Transformer (ViT):** Good baseline for general image patch encoding. Splits patches into sequences of linear projections.
2.  **ResNet-50:** A standard CNN baseline. Performs well when GPU memory and compute resources are limited.
3.  **CLIP-style Encoder:** Excellent starting point for aligning visual representations with natural language features, utilizing text-image contrastive training.
4.  **EO-Specific Foundation Model (Advanced):** Leveraging weights from pre-trained remote-sensing models (e.g., Prithvi, SatMAE) to process non-RGB bands (e.g., Near-Infrared, Shortwave Infrared).

### 2.2 Multimodal Adapter (Projection Layer)
*   **Architecture:** Multi-Layer Perceptron (MLP) with GELU activation functions and Layer Normalization.
*   **Task:** Maps visual feature vectors of size $D_v$ (e.g., 768 or 1024 from ViT) to the LLM token embedding dimension $D_t$ (e.g., 4096 or 5120 for a 20B LLM).
*   **Result:** Visual embeddings are treated by the LLM as a sequence of "visual tokens," which are concatenated with standard text prompt tokens.

---

## 3. Hackathon Training Strategy

Due to the limited GPU compute and time constraints typical of a hackathon, training a huge vision-language model from scratch is impractical. We utilize a phased training and integration approach:

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Vision Baseline                              │
│ • Freeze Vision Encoder weights.                       │
│ • Extract static embeddings to cache.                  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: Projection Alignment                           │
│ • Train the Projection MLP only.                       │
│ • Learn mapping from visual features to token space.  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Parameter-Efficient Fine-Tuning (PEFT)        │
│ • Keep LLM weights frozen.                             │
│ • Apply LoRA adapters to LLM attention layers.         │
│ • Fine-tune on EO instruction datasets (e.g., GeoChat).│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 4: Downstream Evaluation                         │
│ • Run validation on Visual Question Answering (VQA).   │
│ • Assess prediction groundedness and accuracy.         │
└────────────────────────────────────────────────────────┘
```

---

## 4. GPT-OSS Agent & Tool Calling Framework

The LLM is structured to act as the reasoning and orchestration layer, rather than a GIS numerical calculator. Hard calculations must be delegated to deterministic Python libraries.

### 4.1 Prompt Context Structure
When a user asks a question, the system constructs a context block:

```text
[SYSTEM INSTRUCTION]
You are a multimodal Earth Observation analyst. You are given:
1. Visual tokens representing the pre/post satellite comparison.
2. Structured geospatial features computed by the Python EO Data Engine.
You must answer the user's question. Ground all claims in the provided features.
If you need additional statistics, call the available tools. Do not invent numbers.

[CONTEXT DATA]
AOI: Polygon ((18.96, 72.82, ...))
Dates: 2020-06-12 (Before) vs. 2025-06-18 (After)
Sensor: Sentinel-2

[DETERMINISTIC STATS]
Calculated Indices:
- Mean NDVI Before: 0.61
- Mean NDVI After: 0.44
- Vegetation Delta: -27.9%
- Total Changed Area: 18.4 km²
- Classification Confidence: 87%

[VISUAL TOKENS]
<visual_token_1> <visual_token_2> ... <visual_token_16>

[USER QUESTION]
"Explain the vegetation loss and show me the evidence."
```

### 4.2 Available Agent Tools
The agent can decide to trigger the following tools:

| Tool Name | Parameters | Output |
| :--- | :--- | :--- |
| `get_eo_scene` | `AOI, dates, sensor` | Scene IDs, Cloud Cover % |
| `calculate_indices` | `raster_bands` | Tabular NDVI, NDWI, NDBI statistics |
| `detect_change` | `before_raster, after_raster` | Change Mask URL, calculated delta area |
| `summarize_map` | `change_mask, class_labels` | Land-cover change statistics per category |
| `get_timeseries` | `AOI, date_range, index` | Date/Value array for trend plotting |

### 4.3 Output Grounding & Evidence Verification
By forcing the model to refer to tool outputs (e.g., "Vegetation changed area is $18.4\text{ km}^2$ based on tool `detect_change`"), we prevent hallucination. The response includes an `evidence` JSON metadata tag:

```json
{
  "explanation": "Urban sprawl has replaced forest cover, resulting in an 18.7% reduction in vegetation.",
  "evidence": {
    "sensor": "Sentinel-2",
    "indices_used": ["NDVI", "NDBI"],
    "computed_change_area_km2": 18.4,
    "confidence": 0.87
  }
}
```
The frontend reads this block to display the **"View Evidence"** badge, ensuring transparency for judges and experts.
