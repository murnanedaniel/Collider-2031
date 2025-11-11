import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

export default function SolarConfirmation() {
  const [showCommunication, setShowCommunication] = useState(false);

  return (
    <ScreenLayout 
      title="Solar Correlation Confirmed"
      subtitle="Perfect temporal match between detector anomalies and solar activity"
    >
      <div className="space-y-8">
        {/* Success Banner */}
        <Card className="border-l-4 border-green-500 bg-green-50">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">✓</div>
            <div>
              <h2 className="text-2xl font-light mb-2">Hypothesis Confirmed</h2>
              <p className="text-gray-700 leading-relaxed">
                The anomalous events in Foundation Space are caused by <strong>solar radiation effects</strong> during 
                the M5.4 solar flare. The temporal correlation is nearly perfect (r = 0.98).
              </p>
            </div>
          </div>
        </Card>

        {/* Dual Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-medium mb-4">Detector Anomaly Score</h3>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center space-y-3">
                <div className="text-5xl">📊</div>
                <div className="text-gray-600">
                  <div className="font-medium">ATLAS + CMS Combined</div>
                  <div className="text-2xl font-light mt-2">16:03 - 16:09 UTC</div>
                  <div className="text-sm text-gray-500 mt-1">Peak anomaly window</div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium mb-4">Solar Flare Activity</h3>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center space-y-3">
                <div className="text-5xl">☀️</div>
                <div className="text-gray-600">
                  <div className="font-medium">M5.4 Class Solar Flare</div>
                  <div className="text-2xl font-light mt-2">16:03 - 16:09 UTC</div>
                  <div className="text-sm text-gray-500 mt-1">Exact time match</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Correlation Metrics */}
        <Card>
          <h3 className="font-medium mb-4">Correlation Analysis</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">6 min</div>
              <div className="text-xs text-gray-600 mt-1">Event duration</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">0.98</div>
              <div className="text-xs text-gray-600 mt-1">Correlation coef.</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">&lt;10s</div>
              <div className="text-xs text-gray-600 mt-1">Timing offset</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-light">97.3%</div>
              <div className="text-xs text-gray-600 mt-1">Simulation accuracy</div>
            </div>
          </div>
        </Card>

        {/* Solar Flare Database */}
        <Card>
          <h3 className="font-medium mb-4">Solar Flare Database Records</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium">GOES Solar X-ray Monitor</div>
                <div className="text-sm text-gray-600">M5.4 flare confirmed at 16:03 UTC</div>
              </div>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                View Record →
              </a>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium">NOAA Space Weather Prediction Center</div>
                <div className="text-sm text-gray-600">Geomagnetic storm alert issued</div>
              </div>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                View Alert →
              </a>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium">Solar Dynamics Observatory</div>
                <div className="text-sm text-gray-600">High-resolution imaging data available</div>
              </div>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                View Images →
              </a>
            </div>
          </div>
        </Card>

        {/* Validation Summary */}
        <Card>
          <h3 className="font-medium mb-4">Validation Summary</h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Maja's solar-enhanced simulation reproduces the observed anomaly pattern with high fidelity. 
              The simulated events, when embedded in Foundation Space using adversarial unfolding, align 
              perfectly with the real anomaly bubble.
            </p>
            <div className="bg-gray-50 rounded p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Simulation events generated</span>
                <span className="font-medium">100M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calibration accuracy</span>
                <span className="font-medium">97.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credits spent</span>
                <span className="font-medium">4,700</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total analysis time</span>
                <span className="font-medium">~6 hours</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="border-l-4 border-gray-900">
          <h3 className="font-medium mb-4">Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">Hypothesis validated with high confidence</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">Simulation successfully reproduces observations</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <button 
                onClick={() => setShowCommunication(true)}
                className="text-gray-900 hover:text-gray-600 underline font-medium"
              >
                Message PI (Dr. Elena Vasquez)
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Prepare presentation for anomaly plenary</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Submit merge request to Foundation Space model</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Claim 15,000 credit bounty</span>
            </div>
          </div>
        </Card>

        {/* Communication Modal */}
        {showCommunication && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <Card className="max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-light">Message to Dr. Elena Vasquez</h3>
                <button
                  onClick={() => setShowCommunication(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-sm text-gray-600 mb-2">To: Dr. Elena Vasquez (HiLumi M.C. PI)</div>
                  <div className="text-sm">
                    <p className="mb-3">Hi Elena,</p>
                    <p className="mb-3">
                      I've completed the investigation of bounty #943 (time-correlated anomaly in Foundation Space). 
                      The anomalies are caused by solar radiation effects during an M5.4 solar flare on Oct 22, 16:03-16:09 UTC.
                    </p>
                    <p className="mb-3">
                      My simulation (combining solar physics modules with standard collider sim) reproduces the pattern 
                      with 97.3% accuracy. The temporal correlation is 0.98.
                    </p>
                    <p>
                      Would love to present this at the next anomaly plenary. Happy to share details.
                    </p>
                    <p className="mt-3">Best,<br/>Maja</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCommunication(false);
                    alert('Message sent! Elena responds: "Excellent work Maja! Let\'s schedule you for next week\'s plenary. Please prepare a 15-min presentation."');
                  }}
                  className="btn-primary w-full"
                >
                  Send Message
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Link to={ROUTES.FOUNDATION}>
            <button className="btn-secondary">← Back to Foundation Space</button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <button className="btn-primary">Complete Investigation</button>
          </Link>
        </div>
      </div>
    </ScreenLayout>
  );
}
