# SIH25170 — Hackathon Demo & Pitch Guide

This document outlines the presentation timeline, slide deck structure, and narrative strategy designed to pitch the **GPT-OSS Multimodal Vision for Earth Observation Data** platform to SIH judges.

---

## 1. Golden Demo Principle

> **Show one AOI extremely well rather than showing ten unfinished features.**
> The judges must see a complete, unbroken chain of execution:
> **Map → Satellite Data → Vision Encoder → Preprocessing → GPT-OSS Reasoning → Visual Evidence → PDF Report**

---

## 2. 5-Minute Presentation Script Timeline

Every second of a 5-minute hackathon demo is valuable. This breakdown coordinates screen actions with verbal talking points:

### 0:00 – 0:30 | The Hook & Problem Statement
*   **Action:** Show the Landing Page. Toggle through the visual pipeline card.
*   **Speech:** "Satellite data is highly complex, multi-spectral, and hard for non-experts to interpret. Large language models like `GPT-OSS` are excellent reasoning agents, but they are text-only. Today, we present TerraVision—a platform that bridges this gap. We do not pretend the language model sees raw images; instead, we have built a vision encoder and projection layer that translates satellite pixels into visual tokens that `GPT-OSS` can natively understand."

### 0:30 – 1:15 | Action Initiation
*   **Action:** Click "Start Analysis", login, locate Mumbai on the interactive map, draw a custom polygon over the urban boundary, select date ranges `2020` vs. `2025`, and click "Run EO Analysis".
*   **Speech:** "Let's run a live analysis. We select an Area of Interest over Mumbai, choose a five-year window, select Sentinel-2 imagery, and start our processing job. The backend immediately returns a tracking ID and schedules our tasks."

### 1:15 – 2:00 | Asynchronous Progress
*   **Action:** Display the Processing Stepper. Highlight each status checklist step as it updates.
*   **Speech:** "Rather than freezing the browser, our system processes the data in the background using Celery. We can see our worker fetching Sentinel-2 bands from Google Earth Engine, applying QA-band cloud masking, calculating vegetation indices, and running our vision encoder. Everything is processed asynchronously."

### 2:00 – 2:45 | Quantitative Results
*   **Action:** Reveal the Results Page. Slide the slider left and right to compare Before (2020) and After (2025) true-color imagery. Highlight the red Change Mask. Hover over the NDVI charts.
*   **Speech:** "The analysis is complete. Our dashboard reveals a $23.4\%$ increase in built-up area and an $18.7\%$ drop in forest coverage. The map slider visually aligns these changes, displaying a calculated changed area of $18.4\text{ km}^2$. The charts below plot the declining NDVI trend over time."

### 2:45 – 3:45 | Multimodal AI Reasoning & Grounding
*   **Action:** Open the AI Analyst. Click the suggested prompt: *"What changed and why does it matter?"*. Show the CoT thinking spinner, then display the streamed response. Expand the **"View Evidence"** accordion.
*   **Speech:** "Let's consult our AI analyst. We ask what changed. Our alignment layer translates the change rasters into visual tokens. `GPT-OSS` reasons over these tokens and our calculated GIS metrics. The response identifies major deforestation zones. Most importantly, we click 'View Evidence'—showing that the AI grounded its answer in our calculated NDVI statistics, avoiding hallucinations."

### 3:45 – 4:20 | Map Integration & Interaction
*   **Action:** Click the AI action button: *"Highlight Change Zones on Map"*. Observe the map zooming in and highlighting three red polygon overlays.
*   **Speech:** "The AI does not just output text. When it mentions specific change zones, it outputs structured actions. By clicking 'Highlight Change Zones', the map automatically highlights and zooms to the exact coordinates identified by the AI, showing the synergy between map and model."

### 4:20 – 4:45 | Generating the Report
*   **Action:** Click "Export Report", select "PDF", show the print preview, and click download.
*   **Speech:** "Finally, we can package this entire analysis. With one click, the system compiles our statistics, map layers, and the AI's explanation into an official PDF report for field investigators, alongside GeoJSON vector data for QGIS."

### 4:45 – 5:00 | Extensibility & Close
*   **Action:** Show the System Architecture overview slide.
*   **Speech:** "Because our EO engine is modular, this same pipeline is extensible to ISRO Bhuvan datasets. We have built a complete, evidence-grounded bridge between pixels and reasoning. Thank you, we are open to questions."

---

## 3. Slide Deck Structure

*   **Slide 1: Title & The Hook:** TerraVision: Bridging the Gap between Satellite Pixels and Language Reasoning.
*   **Slide 2: The Core Challenge:** Why text-only models fail at Earth Observation. Introducing the Multimodal Alignment Layer.
*   **Slide 3: System Architecture:** Decoupling GIS calculations from LLM text generation. The role of GEE and Celery workers.
*   **Slide 4: Verification & Metrics:** Land-cover classification accuracy and our VQA groundedness scores.
*   **Slide 5: Business Value & Extensibility:** Use cases (urban planning, crop monitoring) and connecting to ISRO Bhuvan/Bhoonidhi platforms.

---

## 4. Technical Narrative Strategy

The central story that must remain consistent across the pitch slides, README, and live demo is:

> **"We did not simply put a chatbot on a satellite map. We built a multimodal bridge that converts EO imagery into visual representations, combines them with geospatial evidence, lets GPT-OSS reason over that evidence, and turns the result back into measurable maps, statistics and human-readable explanations."**
