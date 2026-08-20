"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Upload, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

export default function HomePage() {
  const router = useRouter();

  const handleSelectArea = () => {
    router.push("/select-area");
  };

  const handleUploadImage = () => {
    alert("Upload Image feature will be implemented in the next phase.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 md:py-8">
      {/* Welcome & Simple Explanation */}
      <section className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-neutral-900">
          Welcome to SolveNest
        </h3>
        <p className="text-base md:text-lg text-brand-neutral-700 max-w-2xl leading-relaxed">
          Understand what is changing in your area using satellite imagery. No technical knowledge required.
        </p>
      </section>

      {/* Explore Your Area - Two Primary Actions */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-brand-neutral-900">
          Explore your area
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-brand-md transition-shadow">
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-green-50 text-brand-green-700 rounded-brand-md">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-semibold text-brand-neutral-900 text-base md:text-lg">
                    Select an Area
                  </h5>
                  <p className="text-sm text-brand-neutral-700 mt-1">
                    Choose a region on the map to monitor vegetation, water, or building changes.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  variant="primary" 
                  onClick={handleSelectArea}
                  className="w-full sm:w-auto"
                >
                  Choose from map
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-brand-md transition-shadow">
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-blue-50 text-brand-blue-700 rounded-brand-md">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="font-semibold text-brand-neutral-900 text-base md:text-lg">
                    Upload an Image
                  </h5>
                  <p className="text-sm text-brand-neutral-700 mt-1">
                    Upload an image to understand what's happening in your area.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  variant="secondary" 
                  onClick={handleUploadImage}
                  className="w-full sm:w-auto"
                >
                  Upload files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Areas Placeholder using Card & EmptyState */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-brand-neutral-900">
          Recent Areas
        </h4>
        <EmptyState
          icon={<History className="h-8 w-8 text-brand-neutral-300" />}
          title="No recent areas monitored yet"
          description="Your recently searched or uploaded areas will appear here for quick access."
          actionText="Select an area now"
          onAction={handleSelectArea}
        />
      </section>
    </div>
  );
}
