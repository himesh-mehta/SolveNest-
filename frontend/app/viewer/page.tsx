"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Calendar, ImageIcon, ChevronDown, ChevronUp, AlertCircle, HelpCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { eoService, Location, ImageryDate } from '@/services/eo-service';
import { analysisService, AnalysisResult, Finding } from '@/services/analysis-service';
import { AnalysisProgress } from '@/components/analysis/analysis-progress';
import { FindingsList } from '@/components/analysis/findings-list';

function ViewerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaId = searchParams.get('area');

  // State variables from Phase 2
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isChangingDate, setIsChangingDate] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [dates, setDates] = useState<ImageryDate[]>([]);
  const [selectedDateId, setSelectedDateId] = useState<string>('');
  const [imageryUrl, setImageryUrl] = useState<string | null>(null);
  const [imgZoom, setImgZoom] = useState(1);

  // New Phase 3 State variables
  const [viewMode, setViewMode] = useState<'viewer' | 'progress' | 'results'>('viewer');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  
  // Q&A States
  const [questionText, setQuestionText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Technical Details Toggle
  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState(false);

  // Fetch location metadata and dates list on load
  useEffect(() => {
    if (!areaId) {
      router.push('/select-area');
      return;
    }

    const initViewer = async () => {
      try {
        const loc = await eoService.getLocationById(areaId);
        if (!loc) {
          setLocation(null);
          setIsLoadingLocation(false);
          return;
        }

        setLocation(loc);
        
        // Fetch all dates (available and unavailable)
        const dateOptions = await eoService.getAvailableDates(areaId);
        setDates(dateOptions);

        // Select the first available date by default
        const defaultDate = dateOptions.find(d => d.isAvailable) || dateOptions[0];
        if (defaultDate) {
          setSelectedDateId(defaultDate.id);
        }
      } catch (err) {
        console.error("Failed to load viewer data", err);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    initViewer();
  }, [areaId, router]);

  // Fetch imagery when selected date changes
  useEffect(() => {
    if (!location || !selectedDateId) return;

    const fetchImagery = async () => {
      setIsChangingDate(true);
      setImgZoom(1); // Reset zoom on image switch
      
      // Reset analysis results if date is changed (forces user to re-analyze for new dates)
      setViewMode('viewer');
      setAnalysisResult(null);
      setSelectedFinding(null);
      setAiResponse(null);
      setQuestionText('');
      
      try {
        const url = await eoService.getImagery(location.id, selectedDateId);
        setImageryUrl(url);
      } catch (err) {
        console.error("Failed to fetch imagery", err);
        setImageryUrl(null);
      } finally {
        setIsChangingDate(false);
      }
    };

    fetchImagery();
  }, [location, selectedDateId]);

  const handleZoomIn = () => {
    setImgZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImgZoom(prev => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setImgZoom(1);
  };

  // Run mock analysis
  const handleStartAnalysis = async () => {
    if (!location) return;
    setViewMode('progress');
    setAnalysisStep(0);
    setSelectedFinding(null);
    setAiResponse(null);

    try {
      const result = await analysisService.runAnalysis(location.id, (stepIndex) => {
        setAnalysisStep(stepIndex);
      });
      setAnalysisResult(result);
      setViewMode('results');
    } catch (err) {
      console.error("Analysis failed", err);
      setViewMode('viewer');
    }
  };

  // Handle Q&A conversational queries
  const handleAskQuestion = async (q: string) => {
    if (!location || !q.trim() || isAiLoading) return;
    setQuestionText(q);
    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const response = await analysisService.getMockChatResponse(location.id, q);
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
          message="Loading Earth Observation viewer..." 
          description="Retrieving catalog indices and date lists..." 
          size="lg"
        />
      </div>
    );
  }

  // Location not found error
  if (!location) {
    return (
      <div className="py-8">
        <ErrorState
          title="Location not found"
          message="We couldn't retrieve information for the selected area ID. It may not exist in this demo."
          onRetry={() => router.push('/select-area')}
        />
      </div>
    );
  }

  // Define suggested questions list
  const suggestedQuestions = [
    "What changed here?",
    "Where did vegetation decrease?",
    "Where are the new built-up areas?"
  ];

  // Progressive highlights bounding box color resolver
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
      case 'vegetation': return 'rgba(22, 163, 74, 0.06)';
      case 'built-up': return 'rgba(124, 88, 237, 0.06)';
      case 'water': return 'rgba(2, 132, 199, 0.06)';
      default: return 'transparent';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2 md:py-4">
      {/* Back Button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/select-area')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Change area
          </Button>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">
              {viewMode === 'results' ? 'Analysis Results' : 'EO Viewer'} — {location.name}, {location.region}
            </h3>
            <p className="text-xs md:text-sm text-brand-neutral-700">
              {viewMode === 'results' ? 'Comparing May 2022 to May 2025' : 'Earth Observation Imagery'}
            </p>
          </div>
        </div>

        {/* Date Selector (disabled in results mode to prevent inconsistencies) */}
        {viewMode !== 'progress' && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-brand-neutral-750" />
            <select
              value={selectedDateId}
              disabled={viewMode === 'results'}
              onChange={(e) => setSelectedDateId(e.target.value)}
              className="border border-brand-neutral-200 bg-white rounded-brand-md px-3 py-1.5 text-sm font-semibold text-brand-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-green-700 focus:border-transparent cursor-pointer disabled:opacity-50"
            >
              {dates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} {!d.isAvailable && "(Unavailable)"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {viewMode === 'progress' ? (
        // Loading Analysis Processing State
        <div className="py-8">
          <AnalysisProgress currentStep={analysisStep} />
        </div>
      ) : (
        // Main Grid Layout for Viewer / Results
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main EO Image Viewer Container - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden relative bg-brand-neutral-100 border border-brand-neutral-200">
              {/* Viewer Controls Layer */}
              {imageryUrl && !isChangingDate && (
                <div className="absolute bottom-4 right-4 z-10 flex gap-1 bg-white p-1 rounded-brand-md border border-brand-neutral-200 shadow-brand-sm">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-brand-neutral-100 rounded text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-brand-neutral-100 rounded text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="h-4.5 w-4.5" />
                  </button>
                  <div className="border-l border-brand-neutral-200 mx-1" />
                  <button
                    onClick={handleResetZoom}
                    className="p-2 hover:bg-brand-neutral-100 rounded text-brand-neutral-700 hover:text-brand-neutral-900 transition-colors"
                    title="Reset Zoom"
                    aria-label="Reset Zoom"
                  >
                    <RotateCcw className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}

              {/* Content Display (Image Area) */}
              <div className="w-full h-[350px] md:h-[500px] flex items-center justify-center overflow-hidden">
                {isChangingDate ? (
                  <LoadingState
                    message="Loading satellite imagery..."
                    description="Downloading and aligning multispectral bands..."
                  />
                ) : imageryUrl ? (
                  <div 
                    className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center relative"
                    style={{ transform: `scale(${imgZoom})` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageryUrl}
                      alt={`Satellite Observation of ${location.name}`}
                      className="object-cover w-full h-full max-w-full max-h-full"
                      draggable={false}
                    />

                    {/* Bounding box vector highlight overlay */}
                    {viewMode === 'results' && selectedFinding && selectedFinding.highlight && (
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <rect
                            x={selectedFinding.highlight.x}
                            y={selectedFinding.highlight.y}
                            width={selectedFinding.highlight.w}
                            height={selectedFinding.highlight.h}
                            fill={getHighlightFillColor(selectedFinding.category)}
                            stroke={getHighlightStrokeColor(selectedFinding.category)}
                            strokeWidth="2"
                            strokeDasharray="4,4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 w-full">
                    <ErrorState
                      title="No imagery available"
                      message="No imagery is available for this date."
                      details={`Location ID: ${location.id}\nSelected Date ID: ${selectedDateId}\nReason: Date is out of sensor bounds in the mock database.`}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Desktop Only bottom sections (Selected Finding Details, Q&A, Technical Details) */}
            <div className="hidden lg:block space-y-6">
              {viewMode === 'results' && (
                <>
                  {/* Selected Finding Detail Description */}
                  {selectedFinding && (
                    <Card className="border-l-4 border-l-brand-green-700 bg-brand-green-50/10">
                      <CardContent className="p-5 space-y-2">
                        <h5 className="font-bold text-brand-neutral-900 text-base">
                          {selectedFinding.title} — {selectedFinding.statusLabel} Details
                        </h5>
                        <p className="text-sm text-brand-neutral-700 leading-relaxed">
                          {selectedFinding.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ask about this area Card */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-brand-purple-700" />
                        <h4 className="font-bold text-brand-neutral-900 text-base">Ask about this area</h4>
                      </div>

                      {/* Question suggestion pills */}
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

                      {/* Custom Question Form */}
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

                      {/* Conversational Output Box */}
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
                                <span>Scanning spatial data...</span>
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

                  {/* Technical details collapsed disclosure card */}
                  {analysisResult?.technicalDetails && (
                    <Card>
                      <button
                        onClick={() => setIsTechDetailsOpen(!isTechDetailsOpen)}
                        className="w-full px-5 py-4 flex items-center justify-between text-sm font-semibold text-brand-neutral-700 hover:text-brand-neutral-950 transition-colors focus:outline-none"
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
                              <span className="text-brand-neutral-950 font-medium">{analysisResult.technicalDetails.sensor}</span>
                            </div>
                            <div>
                              <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Resolution</span>
                              <span className="text-brand-neutral-950 font-medium">{analysisResult.technicalDetails.resolution}</span>
                            </div>
                            <div>
                              <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Coordinates</span>
                              <span className="text-brand-neutral-950 font-medium">{analysisResult.technicalDetails.coordinates}</span>
                            </div>
                            <div>
                              <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Imagery Source</span>
                              <span className="text-brand-neutral-950 font-medium">{analysisResult.technicalDetails.source}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[9px]">Pipeline Processing</span>
                              <span className="text-brand-neutral-950 font-medium">{analysisResult.technicalDetails.processing}</span>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar Column (Findings & Controls) - Stacks below image on mobile */}
          <div className="space-y-6">
            {viewMode === 'results' && analysisResult ? (
              // Results mode sidebar contents
              <>
                <Card>
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <h4 className="font-bold text-brand-neutral-950 text-base border-b border-brand-neutral-100 pb-2">
                      What we found
                    </h4>
                    <p className="text-xs text-brand-neutral-700 leading-normal">
                      Select a finding below to view the highlighted region on the satellite image.
                    </p>
                    <FindingsList
                      findings={analysisResult.findings}
                      selectedFindingId={selectedFinding?.id || null}
                      onSelectFinding={(f) => setSelectedFinding(f)}
                    />
                  </CardContent>
                </Card>

                {/* Reset / Compare analysis buttons */}
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push(`/compare?area=${location.id}`)}
                  >
                    See what changed
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setViewMode('viewer');
                      setAnalysisResult(null);
                      setSelectedFinding(null);
                      setAiResponse(null);
                    }}
                  >
                    Clear results
                  </Button>
                </div>
              </>
            ) : (
              // Default Viewer mode sidebar contents
              <>
                {/* Analyze Area Button Card */}
                {imageryUrl && !isChangingDate && (
                  <Card className="bg-brand-green-50/10 border-brand-green-100">
                    <CardContent className="p-4 md:p-5 space-y-4 text-center">
                      <h4 className="font-bold text-brand-green-800 text-sm md:text-base">Ready to analyze?</h4>
                      <p className="text-xs text-brand-neutral-900 leading-normal">
                        Click below to look for land changes between May 2022 and May 2025.
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleStartAnalysis}
                        >
                          Analyze this area
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => router.push(`/compare?area=${location.id}`)}
                        >
                          Compare images
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Metadata Details Card */}
                <Card>
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <h4 className="font-semibold text-brand-neutral-950 text-sm md:text-base border-b border-brand-neutral-100 pb-2">
                      Imagery Details
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-brand-neutral-700 tracking-wider">
                          Location Name
                        </span>
                        <p className="text-sm font-semibold text-brand-neutral-900 mt-0.5">
                          {location.name}, {location.region}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-brand-neutral-700 tracking-wider">
                          Observation Date
                        </span>
                        <p className="text-sm font-semibold text-brand-neutral-900 mt-0.5">
                          {dates.find(d => d.id === selectedDateId)?.label || selectedDateId}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-brand-neutral-700 tracking-wider">
                          Availability Status
                        </span>
                        <div className="mt-1">
                          {imageryUrl ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-green-50 text-brand-green-700 border border-brand-green-100 text-[10px] font-semibold">
                              Imagery Loaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-status-error-bg text-status-error-text border border-status-error-border text-[10px] font-semibold">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Simple Explanation Card */}
                <Card className="bg-brand-green-50/30 border-brand-green-100">
                  <CardContent className="p-4 md:p-5 flex items-start gap-3">
                    <div className="p-2 bg-brand-green-50 text-brand-green-700 rounded-brand-md flex-shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-semibold text-brand-green-800 text-xs md:text-sm">
                        What are you viewing?
                      </h5>
                      <p className="text-xs text-brand-neutral-900 leading-relaxed">
                        This panel displays the raw multispectral satellite bands compiled for analysis. Use the zoom tools to inspect the field boundaries.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Mobile Only Stacking Panels (What We Found details, Q&A, Tech details) */}
          <div className="lg:hidden col-span-1 space-y-6">
            {viewMode === 'results' && (
              <>
                {/* Selected Finding Detail Description */}
                {selectedFinding && (
                  <Card className="border-l-4 border-l-brand-green-700 bg-brand-green-50/10">
                    <CardContent className="p-4 space-y-2">
                      <h5 className="font-bold text-brand-neutral-900 text-sm md:text-base">
                        {selectedFinding.title} — {selectedFinding.statusLabel} Details
                      </h5>
                      <p className="text-xs md:text-sm text-brand-neutral-700 leading-relaxed">
                        {selectedFinding.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Ask about this area Card */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-brand-purple-700" />
                      <h4 className="font-bold text-brand-neutral-900 text-sm md:text-base">Ask about this area</h4>
                    </div>

                    {/* Question suggestion pills */}
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleAskQuestion(q)}
                          className="px-2.5 py-1 bg-brand-neutral-100 hover:bg-brand-neutral-200 border border-brand-neutral-200 text-[10px] font-medium text-brand-neutral-950 rounded-brand-full transition-colors cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Custom Question Form */}
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

                    {/* Conversational Output Box */}
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
                              <span>Scanning spatial data...</span>
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

                {/* Technical details collapsed disclosure card */}
                {analysisResult?.technicalDetails && (
                  <Card>
                    <button
                      onClick={() => setIsTechDetailsOpen(!isTechDetailsOpen)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-xs md:text-sm font-semibold text-brand-neutral-700 hover:text-brand-neutral-950 transition-colors focus:outline-none"
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
                            <span className="text-brand-neutral-955 font-medium">{analysisResult.technicalDetails.sensor}</span>
                          </div>
                          <div>
                            <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Resolution</span>
                            <span className="text-brand-neutral-955 font-medium">{analysisResult.technicalDetails.resolution}</span>
                          </div>
                          <div>
                            <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Coordinates</span>
                            <span className="text-brand-neutral-955 font-medium">{analysisResult.technicalDetails.coordinates}</span>
                          </div>
                          <div>
                            <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Imagery Source</span>
                            <span className="text-brand-neutral-955 font-medium">{analysisResult.technicalDetails.source}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="font-bold text-brand-neutral-700 block uppercase tracking-wider text-[8px]">Pipeline Processing</span>
                            <span className="text-brand-neutral-955 font-medium">{analysisResult.technicalDetails.processing}</span>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState 
          message="Loading Earth Observation viewer..." 
          description="Preparing render context..." 
          size="lg"
        />
      </div>
    }>
      <ViewerContent />
    </Suspense>
  );
}
