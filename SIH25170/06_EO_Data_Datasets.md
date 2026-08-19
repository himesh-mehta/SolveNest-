# SIH25170 — Earth Observation Data & Datasets

This document specifies the Earth Observation (EO) data pipeline, image preprocessing steps, metadata schemas, and machine learning dataset strategies for training and evaluation.

---

## 1. The EO Data Engine

The **EO Data Engine** is designed as an abstraction layer to isolate the application logic from the quirks and specific APIs of different satellite data providers.

### 1.1 Core API Interface
The engine exposes a single unified method to request scenes:
```python
def get_scenes(aoi: Geometry, date_range: Tuple[str, str], sensor: str) -> List[SceneMetadata]:
    """
    Fetches available scene objects intersecting the AOI within the date range.
    Abstracts GEE, Sentinel Hub, Landsat, and ISRO Bhoonidhi APIs.
    """
```

### 1.2 Initial Data Sources
1.  **Google Earth Engine (GEE) API:** Main retrieval engine for public datasets. Provides fast, server-side scaling, cloud masking, and composite calculation.
2.  **Sentinel-2:** Main source for multi-spectral optical data (10m resolution). Useful for vegetation (NDVI), water (NDWI), and land-cover classification.
3.  **Sentinel-1:** Synthetic Aperture Radar (SAR) data. Independent of cloud cover; useful for soil moisture, building structure, and flood mapping.
4.  **Landsat (7/8/9):** Provides longer historical records (30m resolution) for multi-decade change analysis.
5.  **ISRO / Bhoonidhi:** Indian EO satellite datasets (e.g., Resourcesat, Cartosat). Integrated via Bhoonidhi STAC APIs as licensing permits.
6.  **User GeoTIFF Uploads:** Allows analyst uploads of custom drone/aerial imagery.

---

## 2. Common Scene Metadata Schema

To ensure that the downstream Vision Encoder and GPT-OSS Agent process unified properties, every retrieved scene must map to the following structure:

```json
{
  "scene_id": "S2A_MSIL2A_20250618T054641_N0500_R048_T43QCC_20250618T091215",
  "source": "Google Earth Engine",
  "sensor": "Sentinel-2 MSI",
  "acquisition_time": "2025-06-18T05:46:41Z",
  "processing_level": "Level-2A (Bottom-of-Atmosphere Reflectance)",
  "crs": "EPSG:32643 (UTM Zone 43N)",
  "bbox": [72.75, 18.85, 73.05, 19.15],
  "cloud_cover": 1.24,
  "bands": ["B2", "B3", "B4", "B8", "B11", "B12"],
  "resolution": "10 meters",
  "tile_id": "T43QCC",
  "download_uri": "s3://eo-raw-cache/S2A_MSIL2A_20250618.tif",
  "checksum": "d41d8cd98f00b204e9800998ecf8427e",
  "license_notes": "Copernicus Sentinel data, open access terms"
}
```

---

## 3. Image Preprocessing Pipeline

Before visual patches are passed to the ML models or indices are calculated, raw satellite bands undergo a nine-step preprocessing pipeline:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ 1. Validate  ├─────►│2. Reproject  ├─────►│3. Cloud Mask │
│ Format/Bands │      │ (Target CRS) │      │ (QA60 band)  │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                   │
                                                   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ 6. Normalize ├◄─────│5. Band Select├─────►│4. Composite  │
│ (Mean/StdDev)│      │(NIR/Red/SWIR)│      │(Median window)
└──────┬───────┘      └──────────────┘      └──────────────┘
       │
       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   7. Tile    ├─────►│  8. Resize   ├─────►│  9. Feature  │
│ (256x256 px) │      │ (224x224 px) │      │  Extraction  │
└──────────────┘      └──────────────┘      └──────────────┘
```

1.  **Validate:** Check dimensions, coordinate boundaries, and verify that red, green, blue, near-infrared, and shortwave infrared bands are present.
2.  **Reproject:** Convert differing coordinate projections to a consistent local UTM projection system (e.g., WGS84 UTM zone) to prevent spatial misalignment.
3.  **Cloud Masking:** Read the QA60 cloud mask band from Sentinel-2 to clear out or down-weight clouds and cloud shadows.
4.  **Temporal Compositing:** Create a median image composite from multiple scenes taken within a 30-day window to eliminate transient clouds or atmospheric haze.
5.  **Band Selection:** Extract the specific bands required for visual reasoning (RGB) and index math (NIR for NDVI/NDWI, SWIR for NDBI).
6.  **Normalization:** Consistently scale band values using dataset statistics (mean and standard deviation).
7.  **Tiling:** Crop massive satellite scenes into smaller patches (typically $256 \times 256$ pixels).
8.  **Resizing:** Scale patches down to $224 \times 224$ pixels to fit standard Vision Encoder input constraints.
9.  **Feature Extraction:** Output both high-dimensional visual embeddings (via ViT) and spatial numeric tables (NDVI/NDWI pixel averages).

---

## 4. Dataset Strategies for Training & Validation

We leverage five main datasets to build the multimodal components:

*   **BigEarthNet v2.0:** Contains 549,488 paired Sentinel-1 and Sentinel-2 patches. Excellent for pre-training/evaluating the vision feature extractor and land-cover classification heads.
*   **EuroSAT:** A clean Sentinel-2 dataset featuring 27,000 labeled patches across 10 land cover classes. Useful for fast baseline training and evaluation of the classification head.
*   **GeoChat-Instruct:** A specialized remote-sensing visual instruction dataset containing 318,000 image-instruction-answer triplets. Used as the main reference for training the multimodal adapter projection layer.
*   **ISRO Bhuvan/Bhoonidhi Data:** Localized Indian satellite scenes (e.g., Delhi, Mumbai, Bengaluru) to validate model performance on Indian terrain and agricultural layouts.
*   **Custom Paired-Year AOI Dataset:** A small, manually curated validation dataset containing before/after pairs of regions with known changes (urban expansion, reservoir shrinking, deforestation) to verify change-detection precision.

---

## 5. Machine Learning Dataset Split Rules

Spatial and temporal data leakage is a significant problem in satellite ML. We enforce the following split constraints:

*   **Distribution Split:** 70% Train, 15% Validation, 15% Test.
*   **Geographic Isolation:** Train and test patches must be extracted from different geographic tiles (e.g., train on South India tiles, test on North India tiles) to ensure the models generalize to unseen topography.
*   **Temporal Separation:** For temporal change-detection networks, before/after pairs from the same coordinates must not be split across train and test sets to prevent the network from memorizing specific landscape coordinates.
