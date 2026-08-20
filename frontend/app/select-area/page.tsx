"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { MockMap } from '@/components/map/mock-map';
import { eoService, Location } from '@/services/eo-service';

export default function SelectAreaPage() {
  const router = useRouter();
  
  // State variables
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Load locations on mount and simulate map loading
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const allLocs = await eoService.getAllLocations();
        setLocations(allLocs);
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setIsLoadingMap(false);
      }
    };
    
    // Simulate map loading delay
    const timer = setTimeout(() => {
      fetchLocations();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle location search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await eoService.searchLocation(searchQuery);
      if (result) {
        setSelectedLocation(result);
      } else {
        setSearchError("We couldn't find that place in this demo.");
        setSelectedLocation(null);
      }
    } catch (err) {
      setSearchError("An error occurred during search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Continue to EO Viewer
  const handleConfirmSelection = () => {
    if (selectedLocation) {
      router.push(`/viewer?area=${selectedLocation.id}`);
    }
  };

  if (isLoadingMap) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState 
          message="Loading map visualization..." 
          description="Fetching local district map vectors..." 
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2 md:py-4">
      {/* Back Button and Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push('/')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">Choose an Area</h3>
          <p className="text-xs md:text-sm text-brand-neutral-700">Choose the place you want to explore.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 space-y-4">
          <MockMap
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setSearchError(null);
            }}
            locations={locations}
          />
          <p className="text-xs text-brand-neutral-700 italic">
            Tip: You can pan by dragging the map, zoom using the controls on the top left, or tap directly on a pin to select.
          </p>
        </div>

        {/* Search & Action Panel Column */}
        <div className="space-y-6">
          {/* Search Card */}
          <Card>
            <CardContent className="p-4 md:p-6 space-y-4">
              <h4 className="font-semibold text-brand-neutral-900 text-sm md:text-base">Search for a place</h4>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Type city name (e.g. Kolhapur)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-brand-neutral-200 rounded-brand-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-700 focus:border-transparent text-brand-neutral-900"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 text-brand-neutral-700 hover:text-brand-neutral-900 disabled:opacity-50"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              {/* Search Feedback / Errors */}
              {isSearching && (
                <p className="text-xs text-brand-neutral-700">Searching location coordinates...</p>
              )}

              {searchError && (
                <div className="flex items-start gap-2 text-status-warning-text bg-status-warning-bg/10 p-3 rounded-brand-md border border-status-warning-border">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{searchError}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Place Details Card */}
          <Card className="bg-white">
            <CardContent className="p-4 md:p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-brand-neutral-700 text-xs uppercase tracking-wider">
                  Selected Area
                </h4>
                {selectedLocation ? (
                  <div className="mt-3 flex items-start gap-3">
                    <div className="p-2 bg-brand-green-50 text-brand-green-700 rounded-brand-md">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-neutral-900 text-base md:text-lg">
                        {selectedLocation.name}, {selectedLocation.region}
                      </h5>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-green-50 text-brand-green-700 border border-brand-green-100 text-[10px] font-semibold mt-1">
                        Area selected
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-brand-neutral-700 mt-2">
                    No area selected yet. Search for a location or click on any map pin to choose.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-brand-neutral-100">
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!selectedLocation}
                  onClick={handleConfirmSelection}
                >
                  View this area
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Change area
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
