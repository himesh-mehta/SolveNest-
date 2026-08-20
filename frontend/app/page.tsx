"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Upload, ArrowRight, BarChart2, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { areasService, HistoryItem } from '@/services/areas-service';
import { useTranslation } from '@/lib/i18n';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const items = areasService.getHistory().slice(0, 3);
      setRecentHistory(items);
    } catch {
      // if localStorage is unavailable, show nothing
      setRecentHistory([]);
    }
  }, []);

  const handleSelectArea = () => {
    router.push("/select-area");
  };

  const handleUploadImage = () => {
    alert("Upload Image feature will be implemented in the next phase.");
  };

  const openHistoryItem = (item: HistoryItem) => {
    if (item.type === 'analysis') {
      router.push(`/viewer?area=${item.areaId}`);
    } else {
      router.push(`/compare?area=${item.areaId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 md:py-8">
      {/* Welcome & Simple Explanation */}
      <section className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-neutral-900">
          {t('home.welcome')}
        </h3>
        <p className="text-base md:text-lg text-brand-neutral-700 max-w-2xl leading-relaxed">
          {t('home.tagline')}
        </p>
      </section>

      {/* Explore Your Area - Two Primary Actions */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-brand-neutral-900">
          {t('home.exploreTitle')}
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
                    {t('home.selectAreaTitle')}
                  </h5>
                  <p className="text-sm text-brand-neutral-700 mt-1">
                    {t('home.selectAreaDesc')}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={handleSelectArea}
                  className="w-full sm:w-auto"
                >
                  {t('home.selectAreaBtn')}
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
                    {t('home.uploadTitle')}
                  </h5>
                  <p className="text-sm text-brand-neutral-700 mt-1">
                    {t('home.uploadDesc')}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Button
                  variant="secondary"
                  onClick={handleUploadImage}
                  className="w-full sm:w-auto"
                >
                  {t('home.uploadBtn')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity — only shown when there is history */}
      {recentHistory.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-brand-neutral-900">
              {t('home.recentActivity')}
            </h4>
            <Button
              variant="link"
              size="sm"
              onClick={() => router.push('/history')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {t('home.viewAllHistory')}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-brand-neutral-100">
                {recentHistory.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => openHistoryItem(item)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-brand-neutral-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={
                          item.type === 'analysis'
                            ? 'p-1.5 bg-brand-blue-50 text-brand-blue-700 rounded-brand-sm flex-shrink-0'
                            : 'p-1.5 bg-brand-purple-50 text-brand-purple-700 rounded-brand-sm flex-shrink-0'
                        }>
                          {item.type === 'analysis'
                            ? <BarChart2 className="h-3.5 w-3.5" />
                            : <GitCompare className="h-3.5 w-3.5" />
                          }
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-brand-neutral-900 block truncate">
                            {item.areaName}
                          </span>
                          <span className="text-xs text-brand-neutral-700">
                            {item.type === 'analysis' ? t('common.analysis') : t('common.comparison')}
                            {item.type === 'analysis' && item.date ? ` · ${item.date}` : ''}
                            {item.type === 'comparison' && item.beforeDate && item.afterDate
                              ? ` · ${item.beforeDate} → ${item.afterDate}`
                              : ''}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-brand-neutral-700 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
