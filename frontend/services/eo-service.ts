export interface Location {
  id: string;
  name: string;
  region: string;
  // X and Y are percentage values (0-100) representing positions on our mock map canvas
  x: number;
  y: number;
  availableDates: string[];
}

export interface ImageryDate {
  id: string;
  label: string;
  isAvailable: boolean;
}

export interface ImageryMetadata {
  locationId: string;
  dateId: string;
  imageUrl: string;
  resolution: string;
  sensor: string;
}

// Mock dataset
const mockLocations: Location[] = [
  {
    id: "kolhapur",
    name: "Kolhapur",
    region: "Maharashtra",
    x: 42,
    y: 78,
    availableDates: ["may-2022", "may-2025"]
  },
  {
    id: "pune",
    name: "Pune",
    region: "Maharashtra",
    x: 35,
    y: 52,
    availableDates: ["may-2022", "may-2025"]
  },
  {
    id: "nashik",
    name: "Nashik",
    region: "Maharashtra",
    x: 32,
    y: 30,
    availableDates: ["may-2022", "may-2025"]
  },
  {
    id: "nagpur",
    name: "Nagpur",
    region: "Maharashtra",
    x: 82,
    y: 28,
    availableDates: ["may-2022", "may-2025"]
  }
];

const mockDates: ImageryDate[] = [
  { id: "may-2022", label: "May 2022", isAvailable: true },
  { id: "may-2025", label: "May 2025", isAvailable: true },
  { id: "oct-2018", label: "October 2018", isAvailable: false } // Unavailable in demo
];

// Helper to generate dynamic, top-down satellite/EO-style mock SVGs
function generateDemoSatelliteSvg(locationName: string, dateLabel: string, type: '2022' | '2025'): string {
  const is2022 = type === '2022';
  const vegColor = is2022 ? '#059669' : '#b45309'; // Lush green in 2022, dried amber/orange in 2025
  const vegLabel = is2022 ? 'Lush Vegetation' : 'Dry/Sparse Vegetation';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <!-- Background Land -->
      <rect width="600" height="400" fill="#f8fafc" />
      
      <!-- Grid Overlay to look like satellite scan -->
      <defs>
        <pattern id="scan-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="none" stroke="#cbd5e1" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#scan-grid)" />
      
      <!-- Water body (River / Lake) -->
      <path d="M 0,180 C 150,170 250,220 350,200 T 600,230" fill="none" stroke="#0ea5e9" stroke-width="${is2022 ? '24' : '16'}" stroke-linecap="round" opacity="0.8" />
      
      <!-- Forest / Vegetation Polygons -->
      <path d="M 50,50 L 200,40 L 180,120 L 70,140 Z" fill="${vegColor}" opacity="0.6" stroke="${vegColor}" stroke-width="2" />
      <path d="M 400,60 L 520,80 L 480,150 L 380,110 Z" fill="${vegColor}" opacity="0.6" stroke="${vegColor}" stroke-width="2" />
      ${is2022 ? `
      <path d="M 280,80 L 350,70 L 340,130 L 260,110 Z" fill="${vegColor}" opacity="0.6" stroke="${vegColor}" stroke-width="2" />
      <path d="M 100,260 L 220,280 L 190,350 L 80,330 Z" fill="${vegColor}" opacity="0.6" stroke="${vegColor}" stroke-width="2" />
      ` : ''}
      
      <!-- Built-up Urban Areas (Grey blocks) -->
      <!-- Cluster 1 -->
      <rect x="55" y="225" width="40" height="30" fill="#64748b" rx="2" opacity="0.8" />
      <rect x="105" y="215" width="30" height="35" fill="#64748b" rx="2" opacity="0.8" />
      
      <!-- Cluster 2 -->
      <rect x="420" y="240" width="50" height="40" fill="#64748b" rx="2" opacity="0.8" />
      <rect x="480" y="250" width="35" height="30" fill="#64748b" rx="2" opacity="0.8" />
      ${!is2022 ? `
      <!-- Additional buildings in 2025 -->
      <rect x="370" y="260" width="40" height="30" fill="#475569" rx="2" opacity="0.9" stroke="#94a3b8" stroke-width="1" />
      <rect x="440" y="295" width="45" height="35" fill="#475569" rx="2" opacity="0.9" stroke="#94a3b8" stroke-width="1" />
      <rect x="145" y="205" width="35" height="30" fill="#475569" rx="2" opacity="0.9" stroke="#94a3b8" stroke-width="1" />
      ` : ''}
      
      <!-- HUD / Satellite Overlay Watermark Details -->
      <rect x="15" y="15" width="220" height="75" fill="#0f172a" rx="4" opacity="0.85" />
      <text x="25" y="32" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold">SOLVENEST EO PLATFORM</text>
      <text x="25" y="47" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">DEMO SATELLITE DATA</text>
      <text x="25" y="65" fill="#94a3b8" font-family="sans-serif" font-size="10">Area: ${locationName}</text>
      <text x="25" y="78" fill="#94a3b8" font-family="sans-serif" font-size="10">Acquired: ${dateLabel}</text>
      
      <!-- Scale indicator -->
      <line x1="480" y1="370" x2="580" y2="370" stroke="#0f172a" stroke-width="2" />
      <line x1="480" y1="365" x2="480" y2="375" stroke="#0f172a" stroke-width="2" />
      <line x1="580" y1="365" x2="580" y2="375" stroke="#0f172a" stroke-width="2" />
      <text x="530" y="360" fill="#0f172a" font-family="sans-serif" font-size="9" text-anchor="middle" font-weight="semibold">100 m</text>
      
      <!-- Legend -->
      <g transform="translate(15, 305)">
        <rect width="180" height="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="4" />
        <text x="10" y="18" fill="#0f172a" font-family="sans-serif" font-size="10" font-weight="bold">Legend</text>
        
        <circle cx="15" cy="35" r="5" fill="${vegColor}" opacity="0.7" />
        <text x="28" y="38" fill="#334155" font-family="sans-serif" font-size="9">${vegLabel}</text>
        
        <rect x="10" y="48" width="10" height="10" fill="#64748b" opacity="0.8" />
        <text x="28" y="56" fill="#334155" font-family="sans-serif" font-size="9">Built-up / Buildings</text>
        
        <rect x="10" y="63" width="10" height="6" fill="#0ea5e9" opacity="0.8" />
        <text x="28" y="70" fill="#334155" font-family="sans-serif" font-size="9">Water Body</text>
      </g>
    </svg>
  `;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Mock imagery lookup
const mockImagery: Record<string, Record<string, string>> = {
  kolhapur: {
    "may-2022": generateDemoSatelliteSvg("Kolhapur", "May 2022", "2022"),
    "may-2025": generateDemoSatelliteSvg("Kolhapur", "May 2025", "2025")
  },
  pune: {
    "may-2022": generateDemoSatelliteSvg("Pune", "May 2022", "2022"),
    "may-2025": generateDemoSatelliteSvg("Pune", "May 2025", "2025")
  },
  nashik: {
    "may-2022": generateDemoSatelliteSvg("Nashik", "May 2022", "2022"),
    "may-2025": generateDemoSatelliteSvg("Nashik", "May 2025", "2025")
  },
  nagpur: {
    "may-2022": generateDemoSatelliteSvg("Nagpur", "May 2022", "2022"),
    "may-2025": generateDemoSatelliteSvg("Nagpur", "May 2025", "2025")
  }
};

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eoService = {
  /**
   * Search for a location in the mock database
   */
  searchLocation: async (query: string): Promise<Location | null> => {
    await delay(600); // Simulate network latency
    const cleanQuery = query.trim().toLowerCase();
    
    if (!cleanQuery) return null;
    
    // Find location where name contains search query
    const found = mockLocations.find(
      loc => loc.name.toLowerCase().includes(cleanQuery) || 
             loc.region.toLowerCase().includes(cleanQuery)
    );
    
    return found || null;
  },

  /**
   * Get a location by its ID
   */
  getLocationById: async (id: string): Promise<Location | null> => {
    await delay(300);
    const found = mockLocations.find(loc => loc.id === id);
    return found || null;
  },

  /**
   * Get all defined mock locations
   */
  getAllLocations: async (): Promise<Location[]> => {
    await delay(300);
    return [...mockLocations];
  },

  /**
   * Get available imagery dates list
   */
  getAvailableDates: async (locationId: string): Promise<ImageryDate[]> => {
    await delay(400);
    const location = mockLocations.find(loc => loc.id === locationId);
    if (!location) return [];
    
    // Map of dates, marking whether they exist in location's dataset
    return mockDates.map(date => ({
      ...date,
      isAvailable: location.availableDates.includes(date.id)
    }));
  },

  /**
   * Get the imagery URL/path for a location and date
   */
  getImagery: async (locationId: string, dateId: string): Promise<string | null> => {
    await delay(500);
    const locationImages = mockImagery[locationId];
    if (!locationImages) return null;
    
    return locationImages[dateId] || null;
  }
};
