# SIH25170 — Frontend UI/UX Specification
## GPT-OSS Multimodal Vision for Earth Observation Data
### Master Frontend Brief for Antigravity

---

## 0. PURPOSE

Build a polished, professional Earth Observation intelligence web application for SIH 2025 problem statement SIH25170.

The website must NOT look like a generic chatbot, generic admin dashboard, or AI wrapper.

The product should communicate this workflow immediately:

**Select an area → select time period → retrieve EO data → analyze change → inspect maps/statistics → ask GPT-OSS → receive evidence-backed explanation → export report.**

The frontend should feel like a combination of:

- Earth Observation / satellite intelligence platform
- Modern scientific dashboard
- GIS map application
- AI analyst workspace

The primary users are:
- SIH judges
- students/researchers
- environmental analysts
- agriculture/urban planning users
- beginners who do not understand remote sensing deeply

The interface must therefore be visually advanced but simple to understand.

---

# 1. IMPORTANT PROJECT CONTEXT

Project:
**SIH 2025 — SIH25170**

Problem:
Enhance GPT-OSS with multimodal vision capabilities and make the architecture extensible to ISRO Earth Observation data.

Important technical fact:

**GPT-OSS is text-only.**

Do NOT design the frontend or documentation as if GPT-OSS directly receives a raw image.

The actual pipeline is:

User image / satellite imagery
→ EO preprocessing
→ Vision Encoder
→ Visual Embeddings
→ Multimodal Projection / Alignment
→ GPT-OSS reasoning
→ EO/GIS tools
→ Evidence + explanation
→ Frontend visualization

The frontend must make this pipeline understandable to judges.

---

# 2. RECOMMENDED FRONTEND STACK

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts
- MapLibre GL JS or Leaflet
- Framer Motion for restrained animations

Use reusable components instead of creating every page independently.

Suggested project structure:

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── analysis/
│   ├── results/
│   ├── analyst/
│   ├── history/
│   └── reports/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── map/
│   ├── analysis/
│   ├── charts/
│   ├── ai/
│   ├── reports/
│   └── common/
│
├── lib/
├── hooks/
├── services/
├── types/
└── public/
```

---

# 3. VISUAL DESIGN DIRECTION

## Overall style

Use a premium dark scientific / space-tech interface.

Do NOT make it overly futuristic or gaming-like.

Recommended visual language:

- Deep navy / charcoal background
- White and light-gray typography
- Cyan / electric blue primary accent
- Green for vegetation
- Blue for water
- Orange for warnings
- Red for detected change
- Subtle gradients
- Thin borders
- Soft shadows
- Moderate glass/blur effects
- Large clean maps
- Minimal decorative elements

## Typography

Preferred:
- Geist
- Inter

Use:
- Large bold headings
- Medium-weight labels
- Small uppercase metadata labels
- Comfortable line height

## UI philosophy

Every screen should answer:

1. Where am I?
2. What data am I looking at?
3. What happened?
4. What can I do next?

Do not overcrowd screens.

---

# 4. GLOBAL APPLICATION LAYOUT

After login, use this structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Logo / Product       Search       Notifications   User      │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Dashboard    │                                              │
│              │              MAIN CONTENT                     │
│ New Analysis │                                              │
│              │                                              │
│ Results      │                                              │
│              │                                              │
│ AI Analyst   │                                              │
│              │                                              │
│ History      │                                              │
│ Reports      │                                              │
│              │                                              │
│ Settings     │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

Desktop:
- Fixed sidebar
- Top header
- Scrollable main content

Tablet:
- Collapsible sidebar

Mobile:
- Bottom navigation or hamburger drawer

Main navigation:

1. Dashboard
2. New Analysis
3. Results
4. AI Analyst
5. History
6. Reports
7. Settings

---

# 5. SCREEN 01 — LANDING PAGE

Route:

`/`

Purpose:
Explain the product in less than 10 seconds.

## Hero

Headline:

**Understand What Changed on Earth.**

Subheading:

**Satellite imagery + geospatial intelligence + GPT-OSS reasoning in one workspace.**

Primary CTA:

**Start Analysis**

Secondary CTA:

**Explore Demo**

Hero visual:
- Satellite map
- Animated AOI outline
- Before/after imagery
- Small AI insight card

## Feature cards

Three or four cards:

### Multimodal Vision
Understand satellite imagery using a dedicated vision pipeline.

### Change Detection
Compare different dates and quantify land-cover changes.

### AI Analyst
Ask natural-language questions about your selected region.

### Evidence-Based Reports
Export maps, statistics and AI explanations.

## Architecture preview

Show a simplified horizontal flow:

```text
Satellite Data
      ↓
Vision Encoder
      ↓
Multimodal Adapter
      ↓
GPT-OSS
      ↓
EO Analysis
      ↓
Human-readable Insights
```

## Landing page design rule

Do not put a huge amount of technical text here.

The technical depth belongs inside the product and documentation.

---

# 6. SCREEN 02 — LOGIN

Route:

`/login`

Minimal professional authentication page.

Layout:

Left:
- Product logo
- Short statement
- Satellite image / abstract EO visual

Right:
- Email
- Password
- Remember me
- Login button
- Forgot password
- Register link

Include:
- loading state
- validation errors
- incorrect password state
- network error

After login:

`/dashboard`

Do not expose technical implementation details.

---

# 7. SCREEN 03 — REGISTER

Route:

`/register`

Fields:

- Full name
- Email
- Password
- Confirm password

Optional:
- Organization / institution

Password requirements should be shown clearly.

Success:
Redirect to dashboard.

---

# 8. SCREEN 04 — DASHBOARD

Route:

`/dashboard`

This is the user's home screen.

## Header

Greeting:

**Good evening, Himesh**

Subtitle:

**Analyze Earth's changes using satellite data and AI.**

Primary button:

**+ New Analysis**

## KPI cards

Show:

- Total Analyses
- Saved AOIs
- Total Changed Area
- Reports Generated

Example:

```text
ANALYSES
24

SAVED AOIs
8

CHANGED AREA
18.4 km²

REPORTS
12
```

## Recent analyses

Each card:

- analysis name
- location
- before date
- after date
- sensor
- status
- changed area
- thumbnail
- open button

Example:

**Mumbai Urban Expansion**

2020 → 2025

Sentinel-2

18.4 km² changed

Status: Completed

## Quick actions

- New Analysis
- Upload EO Image
- Open AI Analyst
- View Reports

## Dashboard map preview

Show a small India/world map with:
- saved AOIs
- recent analysis locations

Clicking an AOI opens its analysis.

---

# 9. SCREEN 05 — NEW ANALYSIS / ANALYSIS WORKSPACE

Route:

`/analysis/new`

This is the most important frontend screen.

Use a split layout:

```text
┌──────────────────────┬───────────────────────────────────────┐
│ ANALYSIS SETTINGS    │                                       │
│                      │                                       │
│ Location             │                                       │
│ AOI tools            │               LARGE MAP               │
│ Dates                │                                       │
│ Sensor               │                                       │
│ Analysis options     │                                       │
│                      │                                       │
│                      │                                       │
│ RUN ANALYSIS         │                                       │
└──────────────────────┴───────────────────────────────────────┘
```

## Left panel

### Step 1 — Select AOI

Options:

- Search location
- Draw polygon
- Draw rectangle
- Upload GeoJSON

Display:
- area in km²
- coordinates
- bounding box

### Step 2 — Select dates

Two selectors:

**Before**
2020

**After**
2025

Allow date range instead of only year if backend supports it.

### Step 3 — Select sensor

Dropdown:

- Sentinel-2
- Sentinel-1
- Landsat
- ISRO EO
- Uploaded Image

For MVP, Sentinel-2 should be the primary option.

### Step 4 — Analysis options

Checkboxes:

- Cloud masking
- NDVI
- NDWI
- NDBI
- Change detection
- Land-cover classification
- Time-series analysis

Do not overwhelm the user.

Recommended defaults:
- Cloud masking ON
- NDVI ON
- Change detection ON

### Step 5 — Run

Large CTA:

**Run EO Analysis**

Secondary:
**Save as Project**

---

# 10. MAP COMPONENT

The map is the visual heart of the application.

Use MapLibre or Leaflet.

Controls:

- Zoom in/out
- Locate
- Fullscreen
- Layers
- Satellite/base map toggle
- AOI drawing
- Reset AOI

## Layer panel

```text
MAP LAYERS

☑ Satellite
☑ AOI
☐ Before
☐ After
☐ Change
☐ NDVI
☐ NDWI
☐ NDBI
```

Each layer should support:
- visibility
- opacity

## AOI appearance

Selected AOI:
- thin cyan/blue outline
- subtle translucent fill
- corner/vertex handles when editing

## Important

The map must not be a static image.

It should be interactive.

---

# 11. SCREEN 06 — ANALYSIS PROCESSING

After clicking Run Analysis, navigate to:

`/analysis/[id]/processing`

Do not show a generic spinner.

Show a real processing pipeline.

Example:

```text
ANALYSIS IN PROGRESS

✓ AOI validated
✓ Satellite scenes found
✓ Cloud masking completed
✓ EO indices calculated
● Detecting changes
○ Extracting visual features
○ GPT-OSS reasoning
○ Preparing report
```

Progress bar:

`67%`

Show:
- current stage
- estimated time if available
- analysis ID
- sensor
- AOI
- date range

Allow:
**View Map**

If a stage fails:

```text
Analysis paused

Could not retrieve one satellite scene.

[Retry]
[Use available scenes]
```

---

# 12. SCREEN 07 — RESULTS

Route:

`/results/[id]`

This should be the strongest screen for the SIH demo.

## Header

Example:

**Mumbai Urban Change Analysis**

2020 → 2025

Sentinel-2

Status: Completed

Actions:
- Ask AI
- Export Report
- Share
- Re-run

---

# 13. RESULTS KPI CARDS

Show four main metrics:

### Vegetation

`-18.7%`

### Water

`-4.2%`

### Built-up

`+23.4%`

### Changed Area

`18.4 km²`

Use semantic colors carefully.

Green:
positive vegetation/water increase

Red:
loss/change

Blue:
water

Orange:
built-up/urban

---

# 14. BEFORE / AFTER / CHANGE MAP

Main result visualization.

Three modes:

### Before

Satellite imagery from earlier date.

### After

Satellite imagery from later date.

### Change

Detected change layer.

Allow:

- side-by-side
- slider comparison
- opacity comparison

Preferred default:

**Before | After | Change**

Add:
- legend
- scale
- north indicator
- layer controls

---

# 15. CHANGE SUMMARY

Below map:

```text
CHANGE SUMMARY

Vegetation Loss       12.8 km²
Vegetation Gain        3.2 km²
Urban Expansion        8.6 km²
Water Change           1.7 km²
Other Change           2.1 km²
```

Use horizontal bars or compact cards.

---

# 16. EO INDEX SECTION

Tabs:

**NDVI | NDWI | NDBI**

Each shows:

- before value
- after value
- percentage change
- mini map
- chart

Example:

```text
NDVI

2020     0.61
2025     0.44

Change   -27.9%

[time-series chart]
```

Add a small explanation:

**NDVI measures vegetation health/greenness.**

This is especially useful for beginners.

---

# 17. TIME SERIES

Route can remain part of results:

`/results/[id]?view=timeseries`

Chart:

- X axis = date
- Y axis = index value

Controls:

- NDVI
- NDWI
- NDBI
- monthly
- quarterly
- yearly

Hovering over a point should show:
- date
- value
- scene/source

---

# 18. LAND-COVER CLASSIFICATION

Show detected classes:

- Vegetation
- Water
- Built-up
- Bare land
- Other

Visualization:
- donut/bar chart
- classification map
- area table

Example:

```text
LAND COVER — 2025

Vegetation     46.2%
Built-up       31.7%
Water           8.4%
Bare land      10.8%
Other           2.9%
```

Always show:
**Classification confidence**

---

# 19. AI INSIGHTS PANEL

The AI Analyst should be visible directly inside Results.

Example:

```text
✦ GPT-OSS EO ANALYST

What changed?

The analysis indicates significant
urban expansion between 2020 and 2025.

Built-up area increased by 23.4%.
Vegetation decreased by 18.7%.

Evidence:
✓ NDVI comparison
✓ Change detection
✓ Sentinel-2 imagery
✓ Area statistics

Confidence: 87%
```

Buttons:

- Ask follow-up
- Explain simply
- Show evidence
- Copy answer

Important:
The AI response must show evidence sources.

---

# 20. SCREEN 08 — AI ANALYST

Route:

`/analyst`

This is the full chatbot workspace.

Do NOT make it look like normal ChatGPT.

The map and analysis context should remain visible.

Layout:

```text
┌──────────────────────────────┬─────────────────────────────┐
│                              │                             │
│          MAP                 │       AI ANALYST            │
│                              │                             │
│      Current AOI             │ User: What changed?         │
│                              │                             │
│      Change layer            │ AI: ...                     │
│                              │                             │
│                              │ User: Why vegetation loss?  │
│                              │ AI: ...                     │
│                              │                             │
├──────────────────────────────┴─────────────────────────────┤
│ Ask about this analysis...                         ➤        │
└────────────────────────────────────────────────────────────┘
```

## Suggested questions

Display clickable chips:

- What changed?
- Why did vegetation decrease?
- Where is the biggest change?
- Explain this simply
- What does NDVI mean?
- Is the change significant?
- Compare 2020 and 2025

---

# 21. AI EVIDENCE PANEL

Every important AI answer can have an expandable:

**View Evidence**

When opened:

```text
Evidence used

Satellite:
Sentinel-2

Before:
2020-06-12

After:
2025-06-18

NDVI:
0.61 → 0.44

Changed area:
18.4 km²

Confidence:
87%
```

This is critical for trust.

---

# 22. AI STATES

The chat must have:

### Thinking

`GPT-OSS is analyzing the evidence...`

### Tool calling

Show subtle status:

`Calculating NDVI...`

`Checking change map...`

`Reading EO metadata...`

### Final answer

Normal response.

### Insufficient evidence

If data is poor:

**I don't have enough reliable evidence to make that conclusion.**

This is better than hallucinating.

---

# 23. SCREEN 09 — HISTORY

Route:

`/history`

Show previous analyses.

Filters:

- location
- date
- sensor
- status
- project

Search:

`Search analyses...`

Each row/card:

```text
Mumbai Urban Expansion
2020 → 2025
Sentinel-2
18.4 km² changed
Completed
Aug 19, 2026
```

Actions:

- Open
- Continue AI chat
- Export
- Delete

---

# 24. SCREEN 10 — REPORTS

Route:

`/reports`

Show generated reports.

Columns:

- Report name
- Analysis
- Date
- Type
- Status

Types:

- PDF
- CSV
- GeoJSON
- Shapefile
- Map image

Actions:

**View | Download | Delete**

---

# 25. REPORT PREVIEW

When opening a report:

Show a web preview before download.

Sections:

1. Analysis title
2. AOI map
3. Before image
4. After image
5. Change map
6. Statistics
7. EO indices
8. Time series
9. AI interpretation
10. Data sources
11. Model/version information

Download buttons:

- PDF
- CSV
- GeoJSON

---

# 26. SCREEN 11 — SETTINGS

Route:

`/settings`

Sections:

### Account
- name
- email
- profile

### Appearance
- dark/light/system

### Data
- default sensor
- default map

### AI
- explanation level:
  - Simple
  - Standard
  - Technical

### Security
- change password
- logout

---

# 27. RESPONSIVE DESIGN

Desktop is the primary SIH presentation target.

Still support tablet/mobile.

## Desktop

Three-column layouts are acceptable:
- settings
- map
- AI

## Tablet

Collapse settings into drawer.

## Mobile

Stack:

1. Map
2. Controls
3. Results
4. AI

Never allow horizontal page scrolling.

Maps should have touch controls.

---

# 28. ANIMATIONS

Use Framer Motion only where it improves clarity.

Recommended:

- page transitions
- card hover
- sidebar transition
- analysis progress
- result reveal
- AI message appearance
- map layer fade

Do NOT:
- animate everything
- use excessive bouncing
- use distracting 3D effects

The product should feel scientific and professional.

---

# 29. LOADING STATES

Every async component needs a skeleton.

Examples:

Dashboard:
- KPI skeletons
- analysis card skeletons

Results:
- map loading overlay
- chart skeleton
- statistics skeleton

AI:
- typing/thinking indicator

Never show an empty white/black screen.

---

# 30. ERROR STATES

Every important failure needs a friendly message.

Examples:

### No imagery

"No suitable satellite imagery was found for this AOI and date range."

### GEE error

"Satellite data service is temporarily unavailable."

### Model unavailable

"AI analysis is temporarily unavailable. Your EO statistics are still available."

### Invalid AOI

"Please draw a valid area on the map."

### Upload failure

"Unsupported image format or file too large."

Every error should have:
- explanation
- retry
- fallback where possible

---

# 31. DEMO MODE / FALLBACK

The SIH presentation must not depend entirely on live external APIs.

Add a hidden or visible:

**Demo Mode**

Use one preconfigured AOI and cached results.

Example:

`Mumbai Urban Expansion — 2020 → 2025`

If GEE/model services fail during presentation, the UI can still demonstrate the complete workflow.

Do not fake live processing. Clearly label cached/demo data as demo data.

---

# 32. COMPONENT DESIGN SYSTEM

Create reusable components:

```text
Button
Card
Badge
Modal
Drawer
Tabs
Tooltip
Dropdown
DatePicker
SearchBox
ProgressBar
StatCard
MapContainer
MapLayerControl
AOIDrawer
AnalysisStepper
ChartCard
EvidenceCard
AIMessage
ChatInput
ReportCard
EmptyState
ErrorState
Skeleton
```

Map-specific:

```text
SatelliteMap
AOIDrawingTool
LayerControl
BeforeAfterSlider
ChangeLegend
MapScale
MapToolbar
```

AI-specific:

```text
AIAnalystPanel
AIMessage
ToolStatus
EvidencePanel
SuggestedQuestion
ConfidenceBadge
```

---

# 33. FRONTEND DATA TYPES

Create TypeScript interfaces for:

```ts
User
Project
AOI
Analysis
Scene
EOStatistics
ChangeResult
TimeSeriesPoint
AIMessage
Evidence
Report
JobStatus
MapLayer
```

Example:

```ts
interface Analysis {
  id: string;
  projectId: string;
  aoiId: string;
  startDate: string;
  endDate: string;
  sensor: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  modelVersion?: string;
}
```

Keep frontend types aligned with backend API schemas.

---

# 34. API INTEGRATION

Do not hard-code fake results inside components.

Create a service layer:

```text
services/
├── auth.ts
├── projects.ts
├── analyses.ts
├── eo.ts
├── chat.ts
├── reports.ts
└── websocket.ts
```

Frontend should call backend services through these modules.

Example:

```ts
createAnalysis()
getAnalysis()
getStatistics()
getLayers()
sendChatMessage()
generateReport()
```

Use environment variables:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_MAP_STYLE_URL=
```

---

# 35. REAL-TIME JOB PROGRESS

Use WebSocket where available.

Frontend receives:

```json
{
  "analysisId": "abc123",
  "stage": "change_detection",
  "progress": 67,
  "message": "Detecting land-cover changes"
}
```

Update:
- progress bar
- analysis stepper
- current status

If WebSocket disconnects:
fallback to polling.

---

# 36. MAP + AI INTERACTION

This is a key differentiator.

The AI should be able to refer to map evidence.

Example:

User:
"Where is the largest vegetation loss?"

Frontend:
- receives structured region/feature from backend
- highlights it on map
- opens evidence card

Example:

```text
AI identified 3 major vegetation-loss zones.

[Show on Map]
```

Clicking:
**Show on Map**

should change map state.

Do not let GPT-OSS directly manipulate the browser.

The backend should return structured actions such as:

```json
{
  "action": "highlight_regions",
  "regionIds": ["r1", "r2", "r3"]
}
```

Frontend interprets the safe structured action.

---

# 37. ACCESSIBILITY

Implement:

- keyboard navigation
- visible focus states
- proper labels
- sufficient contrast
- alt text
- ARIA labels where necessary
- reduced-motion support

Do not rely on color alone.

For example:
Change map should have:
- color
- legend
- label

---

# 38. PERFORMANCE

Important because satellite maps can be heavy.

Rules:

- lazy load maps
- lazy load charts
- compress thumbnails
- avoid loading full-resolution rasters into browser
- use tile layers
- virtualize long history lists if needed
- memoize expensive components
- avoid unnecessary React re-renders
- show thumbnails instead of huge source images
- use server-side processing for large raster work

---

# 39. SECURITY FRONTEND RULES

Never put:
- database passwords
- GEE service-account secrets
- GPT-OSS private credentials
- object storage secrets

inside frontend environment variables.

Only expose variables that are genuinely public.

Frontend authorization is not sufficient.

Backend must enforce ownership and permissions.

---

# 40. IMPORTANT UX RULES

1. The map is the primary visual object.
2. AI should explain analysis, not replace the analysis.
3. Statistics should always have units.
4. Dates and sensors should always be visible.
5. Evidence should be one click away.
6. Long operations must show progress.
7. Errors must have recovery options.
8. Avoid unnecessary pages.
9. Never fake model confidence.
10. Never show fake live satellite data.
11. Keep beginner-friendly explanations.
12. Provide technical details only when requested.

---

# 41. RECOMMENDED FINAL NAVIGATION

```text
/
├── Landing
│
├── login
├── register
│
└── app
    ├── dashboard
    ├── analysis
    │   └── new
    ├── results
    │   └── [id]
    ├── analyst
    ├── history
    ├── reports
    └── settings
```

---

# 42. SIH DEMO FLOW

The entire frontend should optimize for this flow:

```text
LOGIN
  ↓
DASHBOARD
  ↓
NEW ANALYSIS
  ↓
DRAW AOI
  ↓
SELECT 2020 + 2025
  ↓
SELECT SENTINEL-2
  ↓
RUN ANALYSIS
  ↓
PROCESSING STEPPER
  ↓
RESULTS
  ↓
BEFORE / AFTER / CHANGE MAP
  ↓
NDVI + LAND COVER + AREA STATISTICS
  ↓
ASK GPT-OSS
  ↓
EVIDENCE-BACKED ANSWER
  ↓
HIGHLIGHT CHANGE ON MAP
  ↓
GENERATE REPORT
```

A judge should be able to understand the entire product by watching this flow.

---

# 43. VISUAL HIERARCHY FOR THE RESULTS PAGE

Priority order:

1. Change map
2. AI explanation
3. Main statistics
4. Before/after imagery
5. EO indices
6. Time series
7. Land-cover classification
8. Technical metadata

Do not make technical metadata more visually prominent than the actual result.

---

# 44. WHAT ANTIGRAVITY SHOULD BUILD FIRST

Build in this exact order:

### Phase 1
Design system + global layout

### Phase 2
Landing + login/register

### Phase 3
Dashboard

### Phase 4
New Analysis + interactive map

### Phase 5
Processing screen

### Phase 6
Results page

### Phase 7
AI Analyst

### Phase 8
History + Reports

### Phase 9
Settings

### Phase 10
Responsive + accessibility + animations

### Phase 11
Backend integration

### Phase 12
Final polish + SIH demo mode

Do not start by building every page at once.

---

# 45. ANTIGRAVITY IMPLEMENTATION INSTRUCTIONS

You are building a production-quality SIH hackathon frontend.

Do not create a generic dashboard.

The product must visually communicate:

**Earth Observation + GIS + Multimodal AI + Change Detection.**

Use the architecture and frontend specification in this document.

Before coding:
1. Inspect the existing repository.
2. Do not delete working code without checking it.
3. Determine whether a frontend already exists.
4. If it exists, improve/restructure it rather than blindly replacing it.
5. Identify the backend API contract.
6. Create reusable UI components.
7. Establish the design system before page-by-page implementation.

During implementation:
- TypeScript strict mode.
- Reusable components.
- No duplicated UI code.
- No hard-coded fake production data.
- Use mock/demo data only through a clearly separated mock service.
- Use loading/error/empty states.
- Keep map state and analysis state separate.
- Keep API calls in service modules.
- Use environment variables.
- Keep responsive design.
- Test each page before moving to the next.
- Do not invent backend endpoints; if an endpoint is not ready, create a typed service interface/mock adapter and document it.
- Do not make claims that GPT-OSS directly sees raw images.
- Preserve the ability to connect the UI to real GEE/EO/GPT-OSS services later.

---

# 46. ACCEPTANCE CRITERIA

The frontend is considered successful when:

- A new user can understand the product within 10 seconds.
- User can register/login.
- User can create an analysis.
- User can draw an AOI.
- User can select two dates.
- User can select a sensor.
- User can start an analysis.
- User can see processing progress.
- User can inspect before/after/change layers.
- User can view statistics.
- User can view NDVI/NDWI/NDBI.
- User can view time-series charts.
- User can open the AI Analyst.
- AI conversation is linked to the current analysis.
- Evidence is visible.
- Map can react to AI-generated structured actions.
- User can generate/view reports.
- History works.
- Errors are handled gracefully.
- Demo mode works.
- Desktop presentation looks polished.
- Mobile layout does not break.
- No secrets are exposed.
- No raw image is incorrectly sent directly to GPT-OSS.

---

# 47. FINAL PRODUCT FEEL

The finished product should make a judge think:

> "This is an actual Earth Observation analysis platform with AI built into it."

Not:

> "This is ChatGPT with an image upload."

The visual story should be:

**Satellite → Vision → EO Analysis → GPT-OSS Reasoning → Evidence → Decision**

That is the identity of SIH25170.

---

# 48. ONE-SENTENCE PRODUCT DESCRIPTION

**An AI-powered Earth Observation platform that combines satellite imagery, geospatial change analysis and GPT-OSS reasoning to help users understand what changed on Earth and why.**
