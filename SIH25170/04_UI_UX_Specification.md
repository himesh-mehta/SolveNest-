# SIH25170 — UI/UX Specification

This document defines the visual guidelines, design systems, and page-by-page screen specifications for the **GPT-OSS Multimodal Vision for Earth Observation Data** platform.

---

## 1. Design System & Visual Tokens

The frontend must convey a premium **dark scientific/space-tech** vibe, avoiding over-designed gaming styles or generic SaaS layouts.

### 1.1 Color Palette
*   **Backgrounds:** Deep Space Charcoal (`#09090b`), Dark Navy (`#020817`), Slate Border (`#1e293b`)
*   **Text:** Crisp White (`#f8fafc`), Muted Gray (`#94a3b8`), Slate Text (`#64748b`)
*   **Primary Accents:** Cyan / Electric Blue (`#06b6d4` / `#3b82f6`)
*   **Geospatial / Semantic Colors:**
    *   **Vegetation:** Forest Green (`#10b981`)
    *   **Water:** Deep Blue (`#3b82f6`)
    *   **Built-up / Urban:** Earthy Orange (`#f97316`)
    *   **Detected Change / Loss:** Vivid Red (`#ef4444`)

### 1.2 Typography
*   **Typefaces:** Geist Sans (headings & numbers), Inter (body copy), JetBrains Mono (metadata and coordinate text).
*   **Hierarchy:**
    *   *Headings:* Large, bold, tracking-tight.
    *   *Labels:* Semibold, high-contrast.
    *   *Metadata:* Small, uppercase, letter-spaced.

### 1.3 Micro-Animations (Framer Motion)
*   **Page Transitions:** Fade in + vertical slide-up (duration: `0.3s`, ease-out).
*   **Interactions:** Hover scaling on cards (`scale: 1.02`), smooth sliding drawer transitions.
*   **AI Chat:** Message bubbles expand and slide up smoothly as they stream in.
*   **Map Controls:** Smooth layer fade in/out during base map toggle.

---

## 2. Global Shell Layout

The workspace utilizes a two-column desktop grid configuration.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✦ TerraVision  [Search AOIs...]  🔔 Notifications   [User Avatar] Himesh    │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ 📊 Dashboard │                                                              │
│ ⚙️ Analyze    │                                                              │
│ 🗺️ Workspace │                    MAIN VIEWFINDER CONTENT                   │
│ 💬 AI Analyst│                                                              │
│ 📜 History   │                                                              │
│ 📄 Reports   │                                                              │
│ 🛠️ Settings  │                                                              │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

*   **Sidebar (Width: 260px):** Fixed left navigation. Muted text styling with active cyan indicators.
*   **Topbar (Height: 64px):** Global search, notifications, user settings dropdown, and quick workspace access.
*   **Main Container:** Responsive grid container featuring scroll lock on mapping workspaces.

---

## 3. Detailed Screen Breakdown

### Screen 01: Landing Page (`/`)
*   **Hero Section:**
    *   *Heading:* "Understand What Changed on Earth."
    *   *Subheading:* "Satellite imagery, geospatial change analysis, and GPT-OSS reasoning inside a single scientific workspace."
    *   *CTA Buttons:* "Start Analysis" (primary cyan) and "Explore Live Demo" (secondary slate outline).
    *   *Hero Asset:* Vector-designed satellite orbit animation overlaid on a topographic mesh.
*   **Horizontal Pipeline Preview:**
    A visually engaging stepper component showing:
    `Satellite Scene -> Vision Encoder -> Multimodal Adapter -> GPT-OSS LLM -> Decoded Insights`
*   **Core Value Cards:**
    *   *Multimodal adapter:* Explains how we translate pixels to visual tokens.
    *   *Index calculation:* Describes NDVI, NDWI, and NDBI processing.
    *   *Evidence grounding:* Shows how GPT-OSS queries python calculators instead of guessing.

### Screen 02: Login (`/login`) & Screen 03: Register (`/register`)
*   **Left Split Panel (60%):** Large satellite render of a delta region with an overlaid false-color change mask.
*   **Right Login Panel (40%):** Authentication form (Email, Password, Remember Me, Submit button, forgot password). Includes validation states for password length and server auth errors.

### Screen 04: User Dashboard (`/dashboard`)
*   **Header Greeting:** "Good evening, Himesh. Analyze Earth's changes using satellite data and AI."
*   **KPI Scorecard:**
    *   *Analyses Run:* `24`
    *   *Saved Areas:* `8`
    *   *Total Changed Area:* `18.4 km²`
    *   *Reports Generated:* `12`
*   **Recent Projects Grid:** Hoverable cards showing a map thumbnail, analysis title, date range (e.g., `2020 → 2025`), satellite type, and action buttons ("Inspect Results", "Re-run Job").

### Screen 05: New Analysis Workspace (`/analysis/new`)
*   **Left Configuration Sidebar (30%):**
    *   *Step 1 (AOI):* Input search or draw tool button (Polygon/Rectangle). Display bounding coordinates and area.
    *   *Step 2 (Dates):* Year range selectors (Before Year vs. After Year).
    *   *Step 3 (Sensor):* Dropdown (Sentinel-2, Sentinel-1, Landsat, ISRO Bhoonidhi).
    *   *Step 4 (Calculations):* Checkbox list (Cloud Masking [x], NDVI [x], NDWI [ ], Change Detection [x]).
    *   *Step 5 (Action):* Large "Run EO Analysis" button.
*   **Right Map Viewport (70%):**
    Interactive leaflet map. Drawing toolbar enables clicking points to create a custom search polygon.

### Screen 06: Analysis Processing Screen (`/analysis/[id]/processing`)
*   **Task checklist:** Shows progress status of background worker stages (e.g., `✓ Cloud masking completed`, `● Detecting change...`, `○ Running AI reasoning...`).
*   **Visual progress:** A clean cyan progress bar showing completion percentage, alongside active job ID metadata.

### Screen 07: Results Workspace (`/results/[id]`)
This is the central view presenting analyzed data.
*   **Result Card KPI Metrics:**
    *   *Vegetation:* `-18.7%` (Red, loss)
    *   *Water:* `-4.2%` (Muted Blue, slight drop)
    *   *Built-up:* `+23.4%` (Orange, urban growth)
    *   *Changed Area:* `18.4 km²` (Vivid Red)
*   **Main Map Viewer:**
    Features a Before/After comparison slider. Sliding left reveals 2020 true-color bands, sliding right reveals 2025 false-color change mask.
*   **Index Tab Panel:**
    Switchable tabs: "NDVI", "NDWI", "NDBI". Each page displays its delta values, mini maps, and a Recharts line graph detailing annual index trends.

### Screen 08: Chat Analyst Panel (`/analyst` or Results Drawer)
*   **Two-Column Split Workspace:**
    *   *Left:* Results map remains fully interactive.
    *   *Right:* Dark chatbot workspace.
*   **AI Message Bubble:**
    Includes a markdown description of changes, confidence score badge (e.g., `Confidence: 87%`), and an expandable accordion titled **"View Evidence Used"** listing indices and scene IDs.
*   **Suggested Prompt Chips:**
    Clickable quick-prompt buttons: `"What changed?"`, `"Why did vegetation decrease?"`, `"Export this context"`.

### Screen 09: History (`/history`) & Screen 10: Reports (`/reports`)
*   **History Table:** Sortable database list of past runs with status tags.
*   **Report Previewer:** Renders a clean print layout of the report containing the maps and AI summaries before initiating the download.

### Screen 11: Settings (`/settings`)
*   **Sections:** Profile, appearance theme (dark/light), default sensor preferences, and **AI Explanation Level** slider (choices: `Simple`, `Standard`, `Technical`).

---

## 4. UI/UX Rules & Best Practices

1.  **Map Dominance:** The interactive map remains the primary spatial reference. Sidebar panels should slide over it or crop it clean, maintaining viewport focus.
2.  **No Hallucinated Data:** AI text must highlight values directly computed by Python GIS libraries. If values mismatch, the raw statistics override LLM text.
3.  **Real-Time Stepping:** Never show an empty loader. Use animated skeleton loaders or specific text telling the user exactly which worker queue step is running.
4.  **Graceful API Fallbacks:** If the GEE API fails, a prompt must show: *"Demo Cache Active. Displaying preloaded Mumbai region statistics."*
5.  **Touch Accessibility:** Ensure the slider map and drawing tools work on tablet screens for presentation flexibility.
