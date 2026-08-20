"use client";

import React from 'react';
import { Columns } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-6">
      <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">Compare Observations</h3>
      <EmptyState
        icon={<Columns className="h-8 w-8 text-brand-neutral-300" />}
        title="No comparison active"
        description="Select two different acquisition dates or image files to compare land cover changes side-by-side."
        actionText="Back to Home"
        onAction={() => window.location.href = "/"}
      />
    </div>
  );
}
