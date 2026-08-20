import { GeoJSONGeometry, HighlightBox } from './analysis-service';

export interface ChangeFinding {
  id: string;
  category: 'vegetation' | 'built-up' | 'water';
  title: string;
  statusLabel: string;
  status: 'success' | 'info' | 'warning' | 'error';
  subtitle: string;
  description: string;
  highlight?: HighlightBox;
  confidence?: number;
  geometry?: GeoJSONGeometry;
  statistics?: {
    before: string | number;
    after: string | number;
    change: string | number;
  };
}

export interface ComparisonTechnicalDetails {
  sensor: string;
  resolution: string;
  coordinates: string;
  source: string;
  processing: string;
}

export interface ComparisonResult {
  comparisonId: string;
  locationId: string;
  beforeDateId: string;
  afterDateId: string;
  summary: string;
  changes: ChangeFinding[];
  statistics?: Record<string, string | number>;
  technicalDetails?: ComparisonTechnicalDetails;
  references?: string[];
}

const mockComparisons: Record<string, ComparisonResult> = {
  kolhapur: {
    comparisonId: "kolhapur_may-2022_may-2025",
    locationId: "kolhapur",
    beforeDateId: "may-2022",
    afterDateId: "may-2025",
    summary: "From May 2022 to May 2025, Kolhapur experienced a decrease in vegetation canopy and a noticeable expansion of built-up areas. Water bodies remained stable.",
    changes: [
      {
        id: "comp-kh-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Vegetation canopy density has declined in localized areas.",
        description: "Vegetation cover shows a localized decline in the northern plots, primarily corresponding to changes in crop cycle rotations and field fallow patterns.",
        highlight: { x: 8, y: 10, w: 32, h: 28 },
        statistics: {
          before: "62%",
          after: "51%",
          change: "-11%"
        }
      },
      {
        id: "comp-kh-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "Developed surfaces have expanded along boundary roads.",
        description: "New road surfaces, concrete pavement, and residential outbuildings are visible in the southern expansion corridor.",
        highlight: { x: 70, y: 60, w: 20, h: 25 },
        statistics: {
          before: "21%",
          after: "28%",
          change: "+7%"
        }
      },
      {
        id: "comp-kh-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "Surface water levels remain stable.",
        description: "Primary irrigation channels and local community reservoirs show stable surface boundaries with no major shrinkage detected."
        // statistics is omitted to test optional rendering
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI Dual-Date Stack",
      resolution: "10 meters spatial",
      coordinates: "16.7050° N, 74.2433° E",
      source: "ESA Copernicus Orthorectified Sentinel-2 Imagery",
      processing: "SolveNest Change Core Engine v1.0"
    }
  },
  pune: {
    comparisonId: "pune_may-2022_may-2025",
    locationId: "pune",
    beforeDateId: "may-2022",
    afterDateId: "may-2025",
    summary: "Significant urban sprawl is highlighted along eastern highway corridors. Corresponding tree cover has decreased.",
    changes: [
      {
        id: "comp-pn-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Tree canopy and crop density decreased.",
        description: "Suburban tree clearing has been detected on the western hill slopes to make way for transportation access routes.",
        highlight: { x: 8, y: 10, w: 32, h: 28 },
        statistics: {
          before: "45%",
          after: "38%",
          change: "-7%"
        }
      },
      {
        id: "comp-pn-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "Significant residential construction growth.",
        description: "Multiple high-density housing blocks and industrial parks have been built on former barren scrub lands in the east.",
        highlight: { x: 70, y: 60, w: 20, h: 25 },
        statistics: {
          before: "38%",
          after: "46%",
          change: "+8%"
        }
      },
      {
        id: "comp-pn-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "Water reservoir levels are stable.",
        description: "The municipal reservoir limits remain consistent with the May 2022 baseline records."
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI Dual-Date Stack",
      resolution: "10 meters spatial",
      coordinates: "18.5204° N, 73.8567° E",
      source: "ESA Copernicus Orthorectified Sentinel-2 Imagery",
      processing: "SolveNest Change Core Engine v1.0"
    }
  },
  nashik: {
    comparisonId: "nashik_may-2022_may-2025",
    locationId: "nashik",
    beforeDateId: "may-2022",
    afterDateId: "may-2025",
    summary: "The area shows a decrease in vegetation and an increase in built-up regions. Water areas appear mostly unchanged.",
    changes: [
      {
        id: "comp-nk-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Some parts of the area have less vegetation than in the earlier image.",
        description: "Compared to May 2022, vineyard canopy cover has decreased in the northern plots. This is primarily caused by early seasonal pruning and harvesting schedules.",
        highlight: { x: 8, y: 10, w: 32, h: 28 },
        statistics: {
          before: "64%",
          after: "52%",
          change: "-12%"
        }
      },
      {
        id: "comp-nk-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "More developed areas are visible in the recent image.",
        description: "New agricultural sorting structures, farm storage warehouses, and expanded road accesses have been erected on the eastern boundary.",
        highlight: { x: 70, y: 60, w: 20, h: 25 },
        statistics: {
          before: "18%",
          after: "26%",
          change: "+8%"
        }
      },
      {
        id: "comp-nk-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "No major change was detected in visible water areas.",
        description: "The central riverbed flow and surface boundary remain stable, matching typical dry-season records."
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI Dual-Date Stack",
      resolution: "10 meters spatial",
      coordinates: "19.9975° N, 73.7898° E",
      source: "ESA Copernicus Orthorectified Sentinel-2 Imagery",
      processing: "SolveNest Change Core Engine v1.0"
    }
  },
  nagpur: {
    comparisonId: "nagpur_may-2022_may-2025",
    locationId: "nagpur",
    beforeDateId: "may-2022",
    afterDateId: "may-2025",
    summary: "Orchard tree cover has decreased in localized plots, while logistics depots have expanded on highway access points. Lakes are stable.",
    changes: [
      {
        id: "comp-ng-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Orchard tree density shows localized reduction.",
        description: "Orange plantation tracts have experienced pruning cycles, reducing active canopy signatures in the northern sectors.",
        highlight: { x: 8, y: 10, w: 32, h: 28 },
        statistics: {
          before: "58%",
          after: "50%",
          change: "-8%"
        }
      },
      {
        id: "comp-ng-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "Expansion of freight structures and depots.",
        description: "Logistics facilities, warehouse parking yards, and concrete depots have expanded near the ring road intersection.",
        highlight: { x: 70, y: 60, w: 20, h: 25 },
        statistics: {
          before: "24%",
          after: "32%",
          change: "+8%"
        }
      },
      {
        id: "comp-ng-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "Water body margins are stable.",
        description: "Central lake levels show stable boundaries compared to the baseline season."
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI Dual-Date Stack",
      resolution: "10 meters spatial",
      coordinates: "21.1458° N, 79.0882° E",
      source: "ESA Copernicus Orthorectified Sentinel-2 Imagery",
      processing: "SolveNest Change Core Engine v1.0"
    }
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const comparisonService = {
  /**
   * Run comparison steps
   */
  runComparison: async (
    locationId: string,
    beforeDateId: string,
    afterDateId: string,
    onProgress: (stepIndex: number) => void
  ): Promise<ComparisonResult> => {
    // 4 progress steps
    onProgress(0);
    await delay(700);
    onProgress(1);
    await delay(700);
    onProgress(2);
    await delay(700);
    onProgress(3);
    await delay(700);

    // If dates are identical or one of them is invalid, we can throw an error to simulate error state!
    if (beforeDateId === afterDateId) {
      throw new Error("Dates must be different to perform a comparison.");
    }

    // Only allow may-2022 and may-2025 in the demo database
    if (
      (beforeDateId !== "may-2022" && beforeDateId !== "may-2025") ||
      (afterDateId !== "may-2022" && afterDateId !== "may-2025")
    ) {
      throw new Error("No imagery available for comparison for the selected dates.");
    }

    const result = mockComparisons[locationId] || mockComparisons.kolhapur;
    return {
      ...result,
      beforeDateId,
      afterDateId
    };
  },

  /**
   * Mock QA response for comparison
   */
  getMockComparisonChatResponse: async (locationId: string, question: string): Promise<string> => {
    await delay(500);
    const q = question.toLowerCase();
    const locName = locationId.charAt(0).toUpperCase() + locationId.slice(1);

    if (q.includes("vegetation") || q.includes("forest") || q.includes("crops")) {
      return `Comparing the two dates in ${locName}, vegetation cover dropped from 64% in May 2022 to 52% in May 2025, primarily due to pruning cycles in the northern plots.`;
    }
    
    if (q.includes("built-up") || q.includes("buildings") || q.includes("urban") || q.includes("construction")) {
      return `Built-up developed areas in ${locName} increased from 18% in May 2022 to 26% in May 2025. This expansion consists of sorting warehouses on the eastern sector.`;
    }
    
    if (q.includes("water") || q.includes("river") || q.includes("lake")) {
      return `Water body levels in ${locName} remained stable at around 8% of total area with no significant change or shrinkage detected.`;
    }

    if (q.includes("biggest") || q.includes("most") || q.includes("largest")) {
      return `The biggest change in ${locName} was the decrease in vegetation cover (-12%), followed by a +8% increase in developed built-up surfaces.`;
    }

    if (q.includes("explain") || q.includes("what changed") || q.includes("summary")) {
      return `Between May 2022 and May 2025 in ${locName}, the landscape experienced vegetation loss in fields (-12%) and warehouse construction in the east (+8%). Water remained stable.`;
    }

    return `Spatial change detection in ${locName} indicates major shifts in vegetation and built-up areas. Water bodies show stable surfaces.`;
  }
};
