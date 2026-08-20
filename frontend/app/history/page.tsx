"use client";

import React from 'react';
import { History } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-6">
      <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">Analysis History</h3>
      <EmptyState
        icon={<History className="h-8 w-8 text-brand-neutral-300" />}
        title="No history found"
        description="Your past analyses and reports will appear here once you run them."
        actionText="Start new analysis"
        onAction={() => window.location.href = "/"}
      />
    </div>
  );
}
