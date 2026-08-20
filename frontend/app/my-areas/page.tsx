"use client";

import React from 'react';
import { Map } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function MyAreasPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-6">
      <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">My Areas</h3>
      <EmptyState
        icon={<Map className="h-8 w-8 text-brand-neutral-300" />}
        title="No saved areas"
        description="You haven't saved any areas yet. Once you choose and monitor an area from the Home screen, it will be saved here."
        actionText="Monitor an area"
        onAction={() => window.location.href = "/"}
      />
    </div>
  );
}
