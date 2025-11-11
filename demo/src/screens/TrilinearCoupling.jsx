import React from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

export default function TrilinearCoupling() {
  return (
    <ScreenLayout>
      <div className="mb-6">
        <Link to={ROUTES.ANALYSIS} className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to All Measurements
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-light mb-2">Higgs Trilinear Coupling</h1>
          <p className="text-gray-500">Measurement of λ₃ / λ₃^SM</p>
        </div>

        {/* Current Measurement */}
        <Card className="border-l-4 border-gray-900">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-4xl font-light">1.02</div>
              <div className="text-xs text-gray-600 mt-1">Measured value</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-4xl font-light">± 0.04</div>
              <div className="text-xs text-gray-600 mt-1">Uncertainty</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-4xl font-light">0.5σ</div>
              <div className="text-xs text-gray-600 mt-1">Excess over SM</div>
            </div>
          </div>
        </Card>

        {/* Measurement Progress */}
        <Card>
          <h3 className="font-medium mb-4">Measurement Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Uncertainty evolution</span>
                <span className="text-gray-500">Target: &lt; 2% by 2035</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <span className="w-20 text-gray-600">2029:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="w-16 text-right">±50%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-20 text-gray-600">2030:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="w-16 text-right">±25%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-20 text-gray-600">2031:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-700 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="w-16 text-right font-medium">±4%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Event Breakdown */}
        <Card>
          <h3 className="font-medium mb-4">Event Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-2xl font-light mb-1">234,891</div>
              <div className="text-sm text-gray-600">Total events used</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-2xl font-light mb-1">HH → bbγγ</div>
              <div className="text-sm text-gray-600">Primary channel</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-2xl font-light mb-1">89,234</div>
              <div className="text-sm text-gray-600">ATLAS contribution</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-2xl font-light mb-1">145,657</div>
              <div className="text-sm text-gray-600">CMS contribution</div>
            </div>
          </div>
        </Card>

        {/* Why This Matters */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-medium mb-3">Why This Matters</h3>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              The Higgs trilinear self-coupling (λ₃) governs the shape of the Higgs potential 
              and is crucial for understanding the stability of the electroweak vacuum.
            </p>
            <p>
              A measurement significantly different from the SM prediction (1.0) would indicate 
              new physics in the Higgs sector and could have profound implications for the fate 
              of the universe.
            </p>
            <p>
              The current 0.5σ excess is intriguing but not yet significant. With full HL-LHC 
              dataset, we expect to achieve ~2% precision, enough to distinguish between various 
              BSM scenarios.
            </p>
          </div>
        </Card>

        {/* Key Improvements */}
        <Card>
          <h3 className="font-medium mb-4">Key Improvements Enabling This Measurement</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <span className="text-gray-400 mt-1">•</span>
              <div>
                <div className="font-medium">Complete L1 trigger data storage</div>
                <div className="text-gray-600">No HLT bias; all events available for analysis</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-400 mt-1">•</span>
              <div>
                <div className="font-medium">ML-based pile-up reconstruction</div>
                <div className="text-gray-600">Near-perfect event reconstruction even at ⟨μ⟩ = 200</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-400 mt-1">•</span>
              <div>
                <div className="font-medium">Hidden Higgs channel recovery</div>
                <div className="text-gray-600">ML models identify previously inaccessible decay modes</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-400 mt-1">•</span>
              <div>
                <div className="font-medium">Cross-detector event synchronization</div>
                <div className="text-gray-600">ATLAS and CMS see hints of each other's events</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Update */}
        <Card className="bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Live measurement</span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: 2 hours ago • Next update in ~30 min
            </div>
          </div>
        </Card>
      </div>
    </ScreenLayout>
  );
}


