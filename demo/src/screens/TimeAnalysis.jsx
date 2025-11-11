import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

export default function TimeAnalysis() {
  const [timeOfDay, setTimeOfDay] = useState(16);
  const [showATLAS, setShowATLAS] = useState(true);
  const [showCMS, setShowCMS] = useState(true);

  return (
    <ScreenLayout 
      title="Time Series Analysis"
      subtitle="Anomaly score variation over 24-hour period"
    >
      <div className="space-y-8">
        {/* Chart Placeholder */}
        <Card className="h-[500px]">
          <div className="h-full flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center space-y-4">
              <div className="text-6xl">📊</div>
              <div className="text-gray-500">
                <div className="font-medium mb-2">Time Series Plot</div>
                <div className="text-sm">
                  Anomaly Score vs. Time of Day
                </div>
                <div className="text-xs mt-4 text-gray-400">
                  (Recharts visualization to be implemented)
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="font-medium mb-4">Time of Day</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="24"
                step="0.1"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>00:00</span>
                <span className="font-medium text-gray-900">
                  {Math.floor(timeOfDay)}:{Math.floor((timeOfDay % 1) * 60).toString().padStart(2, '0')}
                </span>
                <span>24:00</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium mb-4">Detector Visibility</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showATLAS}
                  onChange={(e) => setShowATLAS(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm flex items-center">
                  <span className="w-3 h-3 rounded-full bg-atlas-red mr-2"></span>
                  ATLAS
                </span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCMS}
                  onChange={(e) => setShowCMS(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm flex items-center">
                  <span className="w-3 h-3 rounded-full bg-cms-blue mr-2"></span>
                  CMS
                </span>
              </label>
            </div>
          </Card>
        </div>

        {/* Observations */}
        <Card className="bg-gray-50">
          <h3 className="font-medium mb-3">Key Observations</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <p>
                The anomaly score shows a clear <strong>diurnal pattern</strong>, with baseline 
                levels (~0.02) most of the day.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <p>
                A sharp peak appears between <strong>16:03 and 16:09 UTC</strong>, reaching 
                anomaly scores of ~0.4.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <p>
                Both ATLAS and CMS show <strong>highly correlated</strong> behavior (r = 0.94), 
                confirming this is not a detector-specific artifact.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <p>
                The timing and duration suggest an <strong>external source</strong> affecting 
                both detectors simultaneously.
              </p>
            </div>
          </div>
        </Card>

        {/* Hypothesis */}
        <Card className="border-l-4 border-gray-900">
          <h3 className="font-medium mb-3">Hypothesis</h3>
          <p className="text-gray-700 leading-relaxed">
            The diurnal pattern and simultaneous detection across both detectors suggests 
            an external, time-varying source. Given the timing correlation with solar activity, 
            Maja hypothesizes this could be related to <strong>solar flare events</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            To test this hypothesis, she needs to simulate solar radiation effects on the 
            detector systems and compare with the observed anomaly pattern.
          </p>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link to={ROUTES.FOUNDATION}>
            <button className="btn-secondary">
              ← Back to Foundation Space
            </button>
          </Link>
          <Link to={ROUTES.SIMULATION}>
            <button className="btn-primary">
              Build Simulation →
            </button>
          </Link>
        </div>
      </div>
    </ScreenLayout>
  );
}

