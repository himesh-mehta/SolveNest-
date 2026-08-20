"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Columns, Calendar, Sparkles, Loader2, HelpCircle, AlertCircle, ChevronUp, ChevronDown, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { eoService, Location, ImageryDate } from '@/services/eo-service';
import { comparisonService, ComparisonResult, ChangeFinding } from '@/services/comparison-service';
import { FindingsList } from '@/components/analysis/findings-list';
import { Finding } from '@/services/analysis-service';

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaId = searchParams.get('area');

  // Core Data States
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [dates, setDates] = useState<ImageryDate[]>([]);
  
  // Date Picker selections
  const [beforeDateId, setBeforeDateId] = useState<string>('may-2022');
  const [afterDateId, setAfterDateId] = useState<string>('may-2025');

  // Mode and Comparison States
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'swipe'>('side-by-side');
  const [compareState, setCompareState] = useState<'setup' | 'progress' | 'results' | 'error'>('setup');
  const [compareStep, setCompareStep] = useState(0);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [selectedChange, setSelectedChange] = useState<ChangeFinding | null>(null);
  const [imgZoom, setImgZoom] = useState(1);
  const [swipePosition, setSwipePosition] = useState(50);

  // Q&A / Chat States
  const [questionText, setQuestionText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Technical Details Expanded
  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState(false);

  // Image URLs resolved from service
  const [beforeImageUrl, setBeforeImageUrl] = useState<string | null>(null);
  const [afterImageUrl, setAfterImageUrl] = useState<string | null>(null);

  // Load location and available dates list
  useEffect(() => {
    if (!areaId) {
      setIsLoadingLocation(false);
      return;
    }

    const initCompare = async () => {
      try {
        const loc = await eoService.getLocationById(areaId);
        if (!loc) {
          setLocation(null);
          setIsLoadingLocation(false);
          return;
        }
        setLocation(loc);

        const dateOptions = await eoService.getAvailableDates(areaId);
        setDates(dateOptions);

        // Verify we have at least 2 dates
        const availableList = dateOptions.filter(d => d.isAvailable);
        if (availableList.length >= 2) {
          setBeforeDateId(availableList[0].id);
          setAfterDateId(availableList[1].id);
        }
      } catch (err) {
        console.error("Failed to initialize comparison", err);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    initCompare();
  }, [areaId]);

  // Run the comparison whenever dates change (automatically runs comparison logic)
  useEffect(() => {
    if (!location || !beforeDateId || !afterDateId) return;

    const executeComparison = async () => {
      setCompareState('progress');
      setCompareStep(0);
      setSelectedChange(null);
      setAiResponse(null);
      setQuestionText('');

      try {
        // Resolve target image URLs
        const beforeUrl = await eoService.getImagery(location.id, beforeDateId);
        const afterUrl = await eoService.getImagery(location.id, afterDateId);
        setBeforeImageUrl(beforeUrl);
        setAfterImageUrl(afterUrl);

        // Run mock comparison service logic
        const result = await comparisonService.runComparison(
          location.id,
          beforeDateId,
          afterDateId,
          (stepIndex) => setCompareStep(stepIndex)
        );
        
        setComparisonResult(result);
        setCompareState('results');
      } catch (err) {
        console.error("Comparison failed", err);
        setCompareState('error');
      }
    };

    executeComparison();
  }, [location, beforeDateId, afterDateId]);

  // Handle Q&A conversational queries
  const handleAskQuestion = async (q: string) => {
    if (!location || !q.trim() || isAiLoading) return;
    setQuestionText(q);
    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const response = await comparisonService.getMockComparisonChatResponse(location.id, q);
      setAiResponse(response);
    } catch (err) {
      setAiResponse("I encountered an issue retrieving the details. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(questionText);
  };

  if (isLoadingLocation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState 
          message="Loading comparison module..." 
          description="Retrieving observation history records..." 
          size="lg"
        />
      </div>
    );
  }

  // Empty state: No area selected
  if (!areaId || !location) {
    return (
      <div className="max-w-md mx-auto py-8">
        <ErrorState
          title="No area selected"
          message="Please select an observation area first to compare historical images."
          onRetry={() => router.push('/select-area')}
          retryText="Select Area"
        />
      </div>
    );
  }

  // Empty state: Less than 2 observation dates available
  const availableDates = dates.filter(d => d.isAvailable);
  if (availableDates.length < 2) {
    return (
      <div className="max-w-md mx-auto py-8">
        <ErrorState
          title="Not enough images to compare"
          message="This observation area does not have enough historical scans to compute change detection."
          onRetry={() => router.push('/select-area')}
          retryText="Choose another area"
        />
      </div>
    );
  }

  // Suggested questions list
  const suggestedQuestions = [
    "What changed here?",
    "Where did vegetation decrease?",
    "Which change was the biggest?"
  ];

  // Helper colors
  const getHighlightStrokeColor = (category: string) => {
    switch (category) {
      case 'vegetation': return '#16a34a'; // Green
      case 'built-up': return '#7c3aed';  // Purple
      case 'water': return '#0284c7';     // Blue
      default: return '#cbd5e1';
    }
  };

  const getHighlightFillColor = (category: string) => {
    switch (category) {
      case 'vegetation': return 'rgba(22, 163, 74, 0.05)';
      case 'built-up': return 'rgba(124, 88, 237, 0.05)';
      case 'water': return 'rgba(2, 132, 199, 0.05)';
      default: return 'transparent';
    }
  };

  const beforeDateLabel = dates.find(d => d.id === beforeDateId)?.label || beforeDateId;
  const afterDateLabel = dates.find(d => d.id === afterDateId)?.label || afterDateId;

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2 md:py-4">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/viewer?area=${location.id}`)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Viewer
          </Button>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">
              Compare Observations — {location.name}
            </h3>
            <p className="text-xs md:text-sm text-brand-neutral-700">
              Change detection over time
            </p>
          </div>
        </div>

        {/* Date Selectors (disabled during loading progress) */}
        {compareState !== 'progress' && (
          <div className="flex items-center gap-3 bg-white p-2 rounded-brand-md border border-brand-neutral-200 shadow-brand-sm">
            {/* Earlier Select */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-brand-neutral-700 tracking-wider">Earlier Date</span>
              <select
                value={beforeDateId}
                onChange={(e) => setBeforeDateId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-brand-neutral-950 focus:outline-none cursor-pointer mt-0.5"
              >
                {dates.map((d) => (
                  <option key={d.id} value={d.id} disabled={!d.isAvailable}>
                    {d.label} {!d.isAvailable && "(Unavailable)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-l border-brand-neutral-200 h-6 self-center" />

            {/* Recent Select */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-brand-neutral-700 tracking-wider">Recent Date</span>
              <select
                value={afterDateId}
                onChange={(e) => setAfterDateId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-brand-neutral-955 focus:outline-none cursor-pointer mt-0.5"
              >
                {dates.map((d) => (
                  <option key={d.id} value={d.id} disabled={!d.isAvailable}>
                    {d.label} {!d.isAvailable && "(Unavailable)"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {compareState === 'progress' ? (
        // Loading Steps checklist
        <Card className="max-w-md mx-auto my-12 border-brand-neutral-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-10 w-10 text-brand-green-700 animate-spin mb-4" />
              <h4 className="text-base md:text-lg font-bold text-brand-neutral-900">Preparing comparison...</h4>
              <p className="text-xs md:text-sm text-brand-neutral-700 mt-1">Downloading observation pairs</p>
            </div>

            <div className="border-t border-brand-neutral-100" />

            <ul className="space-y-4">
              {[
                "Loading earlier image",
                "Loading recent image",
                "Checking changes",
                "Preparing results"
              ].map((step, index) => {
                const isCompleted = index < compareStep;
                const isActive = index === compareStep;

                return (
                  <li key={step} className="flex items-center gap-3 transition-colors duration-200">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-green-700 flex-shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-brand-green-700 animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-brand-neutral-300 flex-shrink-0" />
                    )}
                    <span className={
                      isCompleted
                        ? "text-sm font-medium text-brand-neutral-900"
                        : isActive
                        ? "text-sm font-semibold text-brand-green-700"
                        : "text-sm text-brand-neutral-700"
                    }>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ) : compareState === 'error' ? (
        // Error state: E.g. identical dates selected
        <div className="py-8 max-w-md mx-auto">
          <ErrorState
            title="We couldn't compare these images"
            message={
              beforeDateId === afterDateId
                ? "Please choose two different dates to run the comparison engine."
                : "One or both images could not be processed due to a loading error."
            }
            onRetry={() => {
              // Reset to valid defaults
              const availableList = dates.filter(d => d.isAvailable);
              if (availableList.length >= 2) {
                setBeforeDateId(availableList[0].id);
                setAfterDateId(availableList[1].id);
              }
            }}
            retryText="Choose different dates"
          />
        </div>
      ) : (
        // Results Dashboard Grid
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Columns: Comparison Views (Takes 3 columns on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            {/* View Mode Toolbar */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex bg-brand-neutral-100 p-1 rounded-brand-md border border-brand-neutral-250 shadow-brand-sm">
                <button
                  onClick={() => setCompareMode('side-by-side')}
                  className={`px-3 py-1.5 rounded-brand-md text-xs font-semibold cursor-pointer transition-all ${
                    compareMode === 'side-by-side'
                      ? 'bg-white text-brand-neutral-950 shadow-brand-sm'
                      : 'text-brand-neutral-700 hover:text-brand-neutral-950'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setCompareMode('swipe')}
                  className={`px-3 py-1.5 rounded-brand-md text-xs font-semibold cursor-pointer transition-all ${
                    compareMode === 'swipe'
                      ? 'bg-white text-brand-neutral-955 shadow-brand-sm'
                      : 'text-brand-neutral-700 hover:text-brand-neutral-955'
                  }`}
                >
                  Swipe Compare
                </button>
              </div>

              {/* Reset Zoom button */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setImgZoom(prev => Math.min(prev + 0.25, 3))}
                  className="p-1.5 bg-white border border-brand-neutral-200 rounded text-brand-neutral-700 hover:text-brand-neutral-950 shadow-brand-sm text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Zoom +
                </button>
                <button
                  onClick={() => setImgZoom(prev => Math.max(prev - 0.25, 1))}
                  className="p-1.5 bg-white border border-brand-neutral-200 rounded text-brand-neutral-700 hover:text-brand-neutral-955 shadow-brand-sm text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Zoom -
                </button>
                <button
                  onClick={() => setImgZoom(1)}
                  className="p-1.5 bg-white border border-brand-neutral-200 rounded text-brand-neutral-700 hover:text-brand-neutral-955 shadow-brand-sm text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Map Frame */}
            {compareMode === 'side-by-side' ? (
              // Side by Side Mode View
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Earlier Image Panel */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-neutral-700 uppercase tracking-wide">
                    Earlier ({beforeDateLabel})
                  </span>
                  <Card className="overflow-hidden bg-brand-neutral-100 border border-brand-neutral-200 relative h-[250px] md:h-[420px]">
                    <div 
                      className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center relative"
                      style={{ transform: `scale(${imgZoom})` }}
                    >
                      {beforeImageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={beforeImageUrl}
                          alt={`Observation on ${beforeDateLabel}`}
                          className="object-cover w-full h-full max-w-full max-h-full"
                          draggable={false}
                        />
                      )}

                      {/* SVG highlight overlay on Earlier */}
                      {selectedChange && selectedChange.highlight && (
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <rect
                              x={selectedChange.highlight.x}
                              y={selectedChange.highlight.y}
                              width={selectedChange.highlight.w}
                              height={selectedChange.highlight.h}
                              fill={getHighlightFillColor(selectedChange.category)}
                              stroke={getHighlightStrokeColor(selectedChange.category)}
                              strokeWidth="2"
                              strokeDasharray="4,4"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Recent Image Panel */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-neutral-750 uppercase tracking-wide">
                    Recent ({afterDateLabel})
                  </span>
                  <Card className="overflow-hidden bg-brand-neutral-100 border border-brand-neutral-200 relative h-[250px] md:h-[420px]">
                    <div 
                      className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center relative"
                      style={{ transform: `scale(${imgZoom})` }}
                    >
                      {afterImageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={afterImageUrl}
                          alt={`Observation on ${afterDateLabel}`}
                          className="object-cover w-full h-full max-w-full max-h-full"
                          draggable={false}
                        />
                      )}

                      {/* SVG highlight overlay on Recent */}
                      {selectedChange && selectedChange.highlight && (
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <rect
                              x={selectedChange.highlight.x}
                              y={selectedChange.highlight.y}
                              width={selectedChange.highlight.w}
                              height={selectedChange.highlight.h}
                              fill={getHighlightFillColor(selectedChange.category)}
                              stroke={getHighlightStrokeColor(selectedChange.category)}
                              strokeWidth="2"
                              strokeDasharray="4,4"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              // Draggable Swipe Mode View
              <Card className="overflow-hidden bg-brand-neutral-100 border border-brand-neutral-200 relative h-[350px] md:h-[500px] select-none">
                {/* Floating Date Badges */}
                <span className="absolute top-4 left-4 z-20 px-2 py-1 bg-white/95 border border-brand-neutral-200 shadow-brand-sm text-[10px] uppercase font-bold text-brand-neutral-900 rounded select-none">
                  Earlier ({beforeDateLabel})
                </span>
                <span className="absolute top-4 right-4 z-20 px-2 py-1 bg-white/95 border border-brand-neutral-200 shadow-brand-sm text-[10px] uppercase font-bold text-brand-neutral-900 rounded select-none">
                  Recent ({afterDateLabel})
                </span>

                <div 
                  className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center relative"
                  style={{ transform: `scale(${imgZoom})` }}
                >
                  {/* Bottom Image (Earlier Date - May 2022) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {beforeImageUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={beforeImageUrl} 
                        className="object-cover w-full h-full" 
                        alt="Earlier Observation" 
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* Top Image (Recent Date - May 2025) with dynamic clip path */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none" 
                    style={{ clipPath: `polygon(${swipePosition}% 0, 100% 0, 100% 100%, ${swipePosition}% 100%)` }}
                  >
                    {afterImageUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={afterImageUrl} 
                        className="object-cover w-full h-full" 
                        alt="Recent Observation" 
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* SVG highlight overlay over the entire zoomed frame */}
                  {selectedChange && selectedChange.highlight && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <rect
                          x={selectedChange.highlight.x}
                          y={selectedChange.highlight.y}
                          width={selectedChange.highlight.w}
                          height={selectedChange.highlight.h}
                          fill={getHighlightFillColor(selectedChange.category)}
                          stroke={getHighlightStrokeColor(selectedChange.category)}
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Vertical separator line at slider pos */}
                  <div 
                    className="absolute top-0 bottom-0 z-20 pointer-events-none w-[2px] bg-brand-green-700 flex items-center justify-center"
                    style={{ left: `${swipePosition}%` }}
                  >
                    {/* Drag slider handle pill */}
                    <div className="absolute p-2 bg-brand-green-700 text-white rounded-brand-full border border-white shadow-brand-lg pointer-events-auto cursor-ew-resize flex items-center justify-center">
                      <Columns className="h-4.5 w-4.5 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Draggable transparent range slider covering image */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={swipePosition} 
                  onChange={(e) => setSwipePosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-ew-resize z-30"
                />
              </Card>
            )}

            {/* Desktop Only Bottom layout content */}
            <div className="hidden lg:block space-y-6">
              {/* Selected Finding Detail Description */}
              {selectedChange && (
                <Card className="border-l-4 border-l-brand-green-700 bg-brand-green-50/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h5 className="font-bold text-brand-neutral-900 text-base">
                        {selectedChange.title} — {selectedChange.statusLabel} Details
                      </h5>
                      {/* Optional statistics list */}
                      {selectedChange.statistics && (
                        <div className="flex gap-4 text-xs bg-white px-3 py-1 rounded-brand-md border border-brand-neutral-200">
                          <div>
                            <span className="text-brand-neutral-700 font-medium">Before:</span>{' '}
                            <span className="font-bold text-brand-neutral-900">{selectedChange.statistics.before}</span>
                          </div>
                          <div>
                            <span className="text-brand-neutral-700 font-medium">After:</span>{' '}
                            <span className="font-bold text-brand-neutral-900">{selectedChange.statistics.after}</span>
                          </div>
                          <div>
                            <span className="text-brand-neutral-700 font-medium">Change:</span>{' '}
                            <span className="font-bold text-brand-green-700">{selectedChange.statistics.change}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-brand-neutral-700 leading-relaxed">
                      {selectedChange.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Ask about this change Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-brand-purple-700" />
                    <h4 className="font-bold text-brand-neutral-900 text-base">Ask about this change</h4>
                  </div>

                  {/* Suggestion pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAskQuestion(q)}
                        className="px-3 py-1.5 bg-brand-neutral-100 hover:bg-brand-neutral-200 border border-brand-neutral-200 text-xs font-medium text-brand-neutral-950 rounded-brand-full transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Form input */}
                  <form onSubmit={handleCustomQuestionSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="What would you like to know?"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-brand-neutral-200 rounded-brand-md bg-white text-brand-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-green-700"
                    />
                    <Button 
                      type="submit" 
                      variant="secondary"
                      disabled={isAiLoading || !questionText.trim()}
                    >
                      Ask
                    </Button>
                  </form>

                  {/* Chat reply */}
                  {(isAiLoading || aiResponse) && (
                    <div className="p-4 bg-brand-purple-50/40 border border-brand-purple-100 rounded-brand-md flex items-start gap-3">
                      <div className="p-1.5 bg-brand-purple-100 text-brand-purple-700 rounded-brand-md flex-shrink-0 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold text-brand-purple-700 uppercase tracking-wider">Assistant Response</span>
                        {isAiLoading ? (
                          <div className="flex items-center gap-2 text-sm text-brand-neutral-700 mt-1">
                            <Loader2 className="h-4 w-4 animate-spin text-brand-purple-700" />
                            <span>Processing spatial comparison...</span>
                          </div>
                        ) : (
                          <p className="text-sm text-brand-neutral-900 leading-relaxed mt-0.5">
                            {aiResponse}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical Details */}
              {comparisonResult?.technicalDetails && (
                <Card>
                  <button
                    onClick={() => setIsTechDetailsOpen(!isTechDetailsOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between text-sm font-semibold text-brand-neutral-700 hover:text-brand-neutral-955 transition-colors focus:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4.5 w-4.5 text-brand-neutral-700" />
                      Technical details
                    </span>
                    {isTechDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {isTechDetailsOpen && (
                    <CardContent className="px-5 pb-5 border-t border-brand-neutral-100 pt-4 bg-brand-neutral-50/50">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Sensor Mode</span>
                          <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.sensor}</span>
                        </div>
                        <div>
                          <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Resolution</span>
                          <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.resolution}</span>
                        </div>
                        <div>
                          <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Coordinates</span>
                          <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.coordinates}</span>
                        </div>
                        <div>
                          <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Imagery Source</span>
                          <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.source}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Change Analysis Engine</span>
                          <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.processing}</span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>
          </div>

          {/* Right Column: Change Summary & Findings List (Takes 1 column on desktop) */}
          <div className="space-y-6">
            {comparisonResult && (
              <Card>
                <CardContent className="p-4 md:p-5 space-y-4">
                  <h4 className="font-bold text-brand-neutral-955 text-base border-b border-brand-neutral-100 pb-2">
                    What changed?
                  </h4>
                  <p className="text-xs text-brand-neutral-700 leading-relaxed italic">
                    {comparisonResult.summary}
                  </p>
                  
                  {/* Reuse Findings List but with comparison categories */}
                  <div className="border-t border-brand-neutral-100 pt-3" />
                  <FindingsList
                    findings={comparisonResult.changes as unknown as Finding[]}
                    selectedFindingId={selectedChange?.id || null}
                    onSelectFinding={(f) => setSelectedChange(f as unknown as ChangeFinding)}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mobile Stacking Panels (What Changed Details, Ask AI, Tech Details) */}
          <div className="lg:hidden col-span-1 space-y-6">
            {/* Selected Finding Detail Description */}
            {selectedChange && (
              <Card className="border-l-4 border-l-brand-green-700 bg-brand-green-50/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h5 className="font-bold text-brand-neutral-900 text-sm">
                      {selectedChange.title} — {selectedChange.statusLabel} Details
                    </h5>
                    {selectedChange.statistics && (
                      <div className="flex gap-3 text-[10px] bg-white px-2 py-0.5 rounded border border-brand-neutral-200">
                        <div>
                          <span className="text-brand-neutral-700">Before:</span>{' '}
                          <span className="font-bold">{selectedChange.statistics.before}</span>
                        </div>
                        <div>
                          <span className="text-brand-neutral-700">After:</span>{' '}
                          <span className="font-bold">{selectedChange.statistics.after}</span>
                        </div>
                        <div>
                          <span className="font-bold text-brand-green-700">{selectedChange.statistics.change}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-brand-neutral-700 leading-relaxed">
                    {selectedChange.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ask about this change Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-brand-purple-700" />
                  <h4 className="font-bold text-brand-neutral-900 text-sm">Ask about this change</h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleAskQuestion(q)}
                      className="px-2.5 py-1 bg-brand-neutral-100 hover:bg-brand-neutral-200 border border-brand-neutral-200 text-[10px] font-medium text-brand-neutral-955 rounded-brand-full transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomQuestionSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="What would you like to know?"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-brand-neutral-200 rounded-brand-md bg-white text-brand-neutral-900 focus:outline-none"
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    size="sm"
                    disabled={isAiLoading || !questionText.trim()}
                  >
                    Ask
                  </Button>
                </form>

                {(isAiLoading || aiResponse) && (
                  <div className="p-3 bg-brand-purple-50/40 border border-brand-purple-100 rounded-brand-md flex items-start gap-2.5">
                    <div className="p-1.5 bg-brand-purple-100 text-brand-purple-700 rounded-brand-md flex-shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[9px] font-bold text-brand-purple-700 uppercase tracking-wider">Assistant Response</span>
                      {isAiLoading ? (
                        <div className="flex items-center gap-1.5 text-xs text-brand-neutral-700 mt-1">
                          <Loader2 className="h-3 w-3 animate-spin text-brand-purple-700" />
                          <span>Processing spatial comparison...</span>
                        </div>
                      ) : (
                        <p className="text-xs text-brand-neutral-900 leading-relaxed mt-0.5">
                          {aiResponse}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technical details collapsed */}
            {comparisonResult?.technicalDetails && (
              <Card>
                <button
                  onClick={() => setIsTechDetailsOpen(!isTechDetailsOpen)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-semibold text-brand-neutral-700 hover:text-brand-neutral-950 transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-brand-neutral-700" />
                    Technical details
                  </span>
                  {isTechDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isTechDetailsOpen && (
                  <CardContent className="px-4 pb-4 border-t border-brand-neutral-100 pt-3 bg-brand-neutral-50/50">
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div>
                        <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Sensor Mode</span>
                        <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.sensor}</span>
                      </div>
                      <div>
                        <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Resolution</span>
                        <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.resolution}</span>
                      </div>
                      <div>
                        <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Coordinates</span>
                        <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.coordinates}</span>
                      </div>
                      <div>
                        <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Imagery Source</span>
                        <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.source}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Change Analysis Engine</span>
                        <span className="text-brand-neutral-955 font-medium">{comparisonResult.technicalDetails.processing}</span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState 
          message="Loading comparison module..." 
          description="Preparing render context..." 
          size="lg"
        />
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
