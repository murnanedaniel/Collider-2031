import React from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

export default function CalibrationResults() {
  return (
    <ScreenLayout 
      title="Calibration Results"
      subtitle="Adversarial unfolding and Foundation Space alignment"
    >
      <div className="space-y-8">
        {/* Status Banner */}
        <Card className="border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h2 className="text-2xl font-light mb-2">Calibration Complete</h2>
              <p className="text-gray-700 leading-relaxed">
                Simulated events successfully aligned with observed anomaly data using adversarial unfolding. 
                The Foundation Space model has been fine-tuned to match detector response during solar events.
              </p>
            </div>
          </div>
        </Card>

        {/* Alignment Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-medium mb-4">Before Calibration</h3>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3">🌌</div>
                  <div className="text-sm text-gray-600">
                    <div>Simulated events</div>
                    <div className="text-red-600 font-medium mt-2">Misaligned</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium mb-4">After Calibration</h3>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3">✨</div>
                  <div className="text-sm text-gray-600">
                    <div>Simulated + Real events</div>
                    <div className="text-green-600 font-medium mt-2">97.3% aligned</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Adversarial Unfolding */}
        <Card>
          <h3 className="font-medium mb-4">Adversarial Unfolding Process</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Adversarial unfolding</strong> (Chen et al., 2027) uses differentiable simulation 
              to learn mappings between detector-level observables and Foundation Space representations. 
              This technique allows us to project simulated events into the same latent space as real data.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded text-center">
                <div className="text-2xl mb-2">⚛️</div>
                <div className="text-xs font-medium mb-1">1. Generate</div>
                <div className="text-xs text-gray-600">Simulate 100M solar+collider events</div>
              </div>
              <div className="p-4 bg-gray-50 rounded text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-xs font-medium mb-1">2. Train</div>
                <div className="text-xs text-gray-600">Adversarial network learns transformation</div>
              </div>
              <div className="p-4 bg-gray-50 rounded text-center">
                <div className="text-2xl mb-2">✓</div>
                <div className="text-xs font-medium mb-1">3. Align</div>
                <div className="text-xs text-gray-600">Project into Foundation Space</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics */}
        <Card>
          <h3 className="font-medium mb-4">Calibration Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">97.3%</div>
              <div className="text-xs text-gray-600 mt-1">Alignment accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">100M</div>
              <div className="text-xs text-gray-600 mt-1">Events simulated</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">~3h</div>
              <div className="text-xs text-gray-600 mt-1">Training time</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">4,200</div>
              <div className="text-xs text-gray-600 mt-1">Credits used</div>
            </div>
          </div>
        </Card>

        {/* Time Series Validation */}
        <Card>
          <h3 className="font-medium mb-4">Sanity Check: Time Series Alignment</h3>
          <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center space-y-3">
              <div className="text-5xl">📈</div>
              <div className="text-gray-600">
                <div className="font-medium">Simulated vs Observed Over Time</div>
                <div className="text-sm mt-2">
                  Both curves show identical drift pattern:<br/>
                  SM surface → anomaly (16:00-16:10) → SM surface
                </div>
                <div className="text-xs text-gray-400 mt-4">(Recharts time series to be implemented)</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Fine-Tuning Details */}
        <Card>
          <h3 className="font-medium mb-4">LORA Fine-Tuning</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Using <strong>Low-Rank Approximation (LORA)</strong> fine-tuning, the Foundation Space 
              model was adapted to handle solar radiation effects without full retraining. This approach 
              is computationally efficient and preserves the model's general physics knowledge.
            </p>
            <div className="bg-gray-50 rounded p-4 space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600">Rank:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Learning rate:</span>
                <span className="font-medium">1e-4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Epochs:</span>
                <span className="font-medium">50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Validation loss:</span>
                <span className="font-medium">0.023</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Credit Breakdown */}
        <Card>
          <h3 className="font-medium mb-4">Credit Usage Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-sm">Event Generation (Geant5)</div>
                <div className="text-xs text-gray-500">100M events @ 3 minutes</div>
              </div>
              <div className="text-right">
                <div className="font-medium">500</div>
                <div className="text-xs text-gray-500">credits</div>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-sm">Adversarial Training</div>
                <div className="text-xs text-gray-500">3 hours on 100 GPUs</div>
              </div>
              <div className="text-right">
                <div className="font-medium">3,500</div>
                <div className="text-xs text-gray-500">credits</div>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-sm">LORA Fine-Tuning</div>
                <div className="text-xs text-gray-500">50 epochs</div>
              </div>
              <div className="text-right">
                <div className="font-medium">200</div>
                <div className="text-xs text-gray-500">credits</div>
              </div>
            </div>
            <div className="flex justify-between py-2 pt-3 border-t-2 border-gray-300">
              <div className="font-medium">Total</div>
              <div className="font-medium text-lg">4,200 credits</div>
            </div>
          </div>
        </Card>

        {/* Success Message */}
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-medium mb-2">Calibration Successful</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                The simulated events now match the observed anomaly pattern. You're ready to 
                confirm the solar correlation and present your findings.
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Link to={ROUTES.FOUNDATION}>
            <button className="btn-secondary">← Back to Foundation Space</button>
          </Link>
          <Link to="/solar">
            <button className="btn-primary">Confirm Solar Correlation →</button>
          </Link>
        </div>
      </div>
    </ScreenLayout>
  );
}


