export type Category = 'vegetation' | 'built-up' | 'water';

export type GeoJSONGeometry =
  | {
      type: 'Point';
      coordinates: [number, number];
    }
  | {
      type: 'Polygon';
      coordinates: [number, number][][];
    }
  | {
      type: 'MultiPolygon';
      coordinates: [number, number][][][];
    };

export interface HighlightBox {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  w: number; // width percentage (0-100)
  h: number; // height percentage (0-100)
}

export interface Finding {
  id: string;
  category: Category;
  title: string;
  statusLabel: string;
  status: 'success' | 'info' | 'warning' | 'error';
  subtitle: string;
  description: string;
  highlight?: HighlightBox;
  confidence?: number;
  geometry?: GeoJSONGeometry;
  statistics?: Record<string, number | string>;
  references?: string[];
}

export interface TechnicalDetails {
  sensor: string;
  resolution: string;
  coordinates: string;
  source: string;
  processing: string;
}

export interface AnalysisResult {
  locationId: string;
  summary: string;
  findings: Finding[];
  technicalDetails?: TechnicalDetails;
  confidence?: number;
  statistics?: Record<string, number | string>;
  references?: string[];
}

// Mock analysis database
const mockResults: Record<string, AnalysisResult> = {
  kolhapur: {
    locationId: "kolhapur",
    summary: "The area shows a decrease in vegetation and an increase in built-up regions. Water areas appear mostly unchanged.",
    findings: [
      {
        id: "kh-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Vegetation appears lower in some parts of the selected area.",
        description: "Crop density has decreased in the northern sectors, likely due to seasonal harvest patterns or crop rotation.",
        highlight: { x: 8, y: 10, w: 32, h: 28 }
      },
      {
        id: "kh-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "More developed areas are visible compared with the earlier observation.",
        description: "New residential and commercial structures have expanded along the southern boundary roads.",
        highlight: { x: 70, y: 60, w: 20, h: 25 }
      },
      {
        id: "kh-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "No major change was detected in the visible water area.",
        description: "The primary canal and irrigation reservoirs show stable surface water levels.",
        highlight: { x: 0, y: 40, w: 100, h: 20 }
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI",
      resolution: "10 meters",
      coordinates: "16.7050° N, 74.2433° E",
      source: "ESA Copernicus Open Access Hub",
      processing: "SolveNest EO Pipeline v1.2"
    }
  },
  pune: {
    locationId: "pune",
    summary: "Significant urban expansion is detected along roads, with corresponding forest clearing in suburban fringes. Reservoirs remain stable.",
    findings: [
      {
        id: "pn-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Vegetation appears lower in some parts of the selected area.",
        description: "Forest cover in the western hills has experienced localized clearing for infrastructure development.",
        highlight: { x: 8, y: 10, w: 32, h: 28 }
      },
      {
        id: "pn-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "More developed areas are visible compared with the earlier observation.",
        description: "New housing complexes and concrete infrastructure are visible in the eastern suburban zone.",
        highlight: { x: 70, y: 60, w: 20, h: 25 }
      },
      {
        id: "pn-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "No major change was detected in the visible water area.",
        description: "Water levels in the main municipal storage lake are within typical seasonal limits.",
        highlight: { x: 0, y: 40, w: 100, h: 20 }
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI",
      resolution: "10 meters",
      coordinates: "18.5204° N, 73.8567° E",
      source: "ESA Copernicus Open Access Hub",
      processing: "SolveNest EO Pipeline v1.2"
    }
  },
  nashik: {
    locationId: "nashik",
    summary: "The area shows a decrease in vegetation and an increase in built-up regions. Water areas appear mostly unchanged.",
    findings: [
      {
        id: "nk-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Vegetation appears lower in some parts of the selected area.",
        description: "Compared to May 2022, vineyard foliage density has decreased in the northern tracts due to early harvest cycles.",
        highlight: { x: 8, y: 10, w: 32, h: 28 }
      },
      {
        id: "nk-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "More developed areas are visible compared with the earlier observation.",
        description: "New agricultural sorting warehouses and farm outbuildings have been erected on the eastern boundary.",
        highlight: { x: 70, y: 60, w: 20, h: 25 }
      },
      {
        id: "nk-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "No major change was detected in the visible water area.",
        description: "The main river channel width remains consistent with normal seasonal flows.",
        highlight: { x: 0, y: 40, w: 100, h: 20 }
      },
      {
        id: "nk-nohighlight",
        category: "vegetation",
        title: "Fallow land (Stable)",
        statusLabel: "Stable",
        status: "success",
        subtitle: "General landscape features are stable.",
        description: "General background plots across the municipality are stable. This finding has no highlight box geometry."
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI",
      resolution: "10 meters",
      coordinates: "19.9975° N, 73.7898° E",
      source: "ESA Copernicus Open Access Hub",
      processing: "SolveNest EO Pipeline v1.2"
    }
  },
  nagpur: {
    locationId: "nagpur",
    summary: "The area shows a decrease in agricultural orchards and a slight expansion of logistics warehouse structures. Central lake levels are stable.",
    findings: [
      {
        id: "ng-veg",
        category: "vegetation",
        title: "Vegetation",
        statusLabel: "Decreased",
        status: "warning",
        subtitle: "Vegetation appears lower in some parts of the selected area.",
        description: "Orange plantation groves show localized decrease in foliage density, matching seasonal pruning.",
        highlight: { x: 8, y: 10, w: 32, h: 28 }
      },
      {
        id: "ng-built",
        category: "built-up",
        title: "Built-up areas",
        statusLabel: "Increased",
        status: "info",
        subtitle: "More developed areas are visible compared with the earlier observation.",
        description: "Logistics facilities and storage hubs have expanded near the main transit corridor.",
        highlight: { x: 70, y: 60, w: 20, h: 25 }
      },
      {
        id: "ng-water",
        category: "water",
        title: "Water",
        statusLabel: "No major change",
        status: "success",
        subtitle: "No major change was detected in the visible water area.",
        description: "The surface area of the central reservoir remains stable compared to the baseline year.",
        highlight: { x: 0, y: 40, w: 100, h: 20 }
      }
    ],
    technicalDetails: {
      sensor: "Sentinel-2 MSI",
      resolution: "10 meters",
      coordinates: "21.1458° N, 79.0882° E",
      source: "ESA Copernicus Open Access Hub",
      processing: "SolveNest EO Pipeline v1.2"
    }
  }
};

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analysisService = {
  /**
   * Run a mock analysis, firing progress steps
   */
  runAnalysis: async (
    locationId: string,
    onProgress: (stepIndex: number) => void
  ): Promise<AnalysisResult> => {
    // 4 progress steps, each taking 800ms
    onProgress(0);
    await delay(850);
    onProgress(1);
    await delay(850);
    onProgress(2);
    await delay(850);
    onProgress(3);
    await delay(850);

    const result = mockResults[locationId] || mockResults.kolhapur;
    return {
      ...result,
      locationId
    };
  },

  /**
   * Contextual chatbot response builder (mocked)
   */
  getMockChatResponse: async (locationId: string, question: string): Promise<string> => {
    await delay(600); // Simulate network roundtrip
    const q = question.toLowerCase();
    const locName = locationId.charAt(0).toUpperCase() + locationId.slice(1);

    if (q.includes("vegetation") || q.includes("forest") || q.includes("crops")) {
      return `Vegetation decreased mainly in the northern plots of the ${locName} area, primarily due to seasonal harvests and grape vineyard management cycles.`;
    }
    
    if (q.includes("built-up") || q.includes("buildings") || q.includes("urban") || q.includes("construction")) {
      return `Developed areas increased along the eastern sectors of ${locName}, showing new agricultural storage sheds and warehouse construction.`;
    }
    
    if (q.includes("water") || q.includes("river") || q.includes("lake") || q.includes("canal")) {
      return `Water body extents in the ${locName} area are stable. The riverbed and irrigation canals show no significant shrinkage compared to May 2022.`;
    }

    if (q.includes("explain") || q.includes("what changed") || q.includes("summary")) {
      return `Comparing May 2022 to May 2025 in ${locName} shows: vegetation foliage decreased slightly (-8%), built-up developed structures expanded (+12%), and water body areas remained stable (0% change).`;
    }

    return `In the selected ${locName} area, our analysis detected localized vegetation changes in agricultural sectors and minor construction growth. Please let me know if you would like details on vegetation, built-up areas, or water.`;
  }
};
