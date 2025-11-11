import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import BettingCard from '@/components/ui/BettingCard';
import { ROUTES } from '@/utils/constants';

export default function Analysis() {
  // Event counters that increase over time
  const [higgsEvents, setHiggsEvents] = useState(4200752);
  const [topEvents, setTopEvents] = useState(9945204943);
  const [diHiggsEvents, setDiHiggsEvents] = useState(1634);
  const [fisherInfo, setFisherInfo] = useState(842.3);

  // Update counters at specified rates
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaTime = 0.1; // 100ms interval
      // Add noise: ±20% variation
      const noise = () => 0.2 + Math.random() * 1.8;
      setHiggsEvents(prev => prev + 10 * deltaTime * noise()); // 10 Hz ± 20%
      setTopEvents(prev => prev + 700 * deltaTime * noise()); // 700 Hz ± 20%
      setDiHiggsEvents(prev => prev + 0.3 * deltaTime * noise()); // 0.3 Hz ± 20%
      setFisherInfo(prev => prev + 0.02 * deltaTime * noise()); // 0.02 Hz ± 20%
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const measurements = [
    {
      id: 'trilinear',
      name: 'Higgs trilinear coupling',
      symbol: 'λ₃',
      value: '1.02 ± 0.04',
      sm: '1.0',
      significance: '0.5σ excess',
      events: 234891,
      updated: '2 hours ago',
      status: 'active',
    },
    {
      id: 'top-mass',
      name: 'Top quark mass',
      symbol: 'm_t',
      value: '172.76 ± 0.12 GeV',
      sm: '172.76 GeV',
      significance: 'World best precision',
      events: 892433,
      updated: '3 hours ago',
      status: 'active',
    },
    {
      id: 'w-mass',
      name: 'W boson mass',
      symbol: 'm_W',
      value: '80.379 ± 0.008 GeV',
      sm: '80.377 GeV',
      significance: '0.25σ',
      events: 1200000,
      updated: '1 hour ago',
      status: 'active',
    },
    {
      id: 'higgs-width',
      name: 'Higgs width',
      symbol: 'Γ_H',
      value: '4.1 ± 0.3 MeV',
      sm: '4.07 MeV',
      significance: '0.1σ',
      events: 4234891,
      updated: '5 hours ago',
      status: 'active',
    },
    {
      id: 'tau-coupling',
      name: 'Higgs-tau coupling',
      symbol: 'y_τ',
      value: '1.01 ± 0.03',
      sm: '1.0',
      significance: '0.3σ',
      events: 567234,
      updated: '4 hours ago',
      status: 'active',
    },
  ];

  return (
    <ScreenLayout 
      title="Physics Analysis"
      subtitle="Real-time measurements from HL-LHC data"
    >
      <div className="space-y-8">
        {/* Higgs Stability Tracker - Pinned at Top */}
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Primary Goal</div>
              <h2 className="text-2xl font-light">Higgs Vacuum Stability Measurement</h2>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
              Live
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Phase Space Diagram */}
            <div>
              <h3 className="text-sm font-medium mb-3">Parameter Space</h3>
              <div className="relative bg-white border border-gray-200 rounded-lg p-4" style={{ height: '320px' }}>
                {/* SVG Phase Diagram */}
                <svg width="100%" height="100%" viewBox="0 0 300 280" preserveAspectRatio="xMidYMid meet">
                  {/* Define coordinate system: 
                      X: 115-135 GeV Higgs mass (20 GeV range)
                      Y: 165-180 GeV Top mass (15 GeV range, inverted)
                      Margins: left=40, right=20, top=20, bottom=40
                      Plot area: 240 wide, 220 tall
                  */}
                  
                  {/* Boundary line 1: [115, 175] to [130, 180] - extends to [135, 180] */}
                  {/* X: 115→40, 130→220, 135→280 | Y: 175→73, 180→20 */}
                  
                  {/* Boundary line 2: [115, 165] to [135, 173] */}
                  {/* X: 115→40, 135→280 | Y: 165→240, 173→117 */}
                  
                  {/* Unstable region (top, red) - above first boundary, extending the line to right edge */}
                  <polygon
                    points="40,20 280,20 280,73 220,20 40,73"
                    fill="#fca5a5"
                    opacity="0.4"
                  />
                  
                  {/* Metastable region (middle, yellow) - between the two boundaries */}
                  <polygon
                    points="40,73 220,20 280,73 280,117 40,240"
                    fill="#fde047"
                    opacity="0.4"
                  />
                  
                  {/* Stable region (bottom-right, green) - below second boundary */}
                  <polygon
                    points="40,240 280,117 280,240"
                    fill="#86efac"
                    opacity="0.4"
                  />
                  
                  {/* Boundary lines - dashed, extended to edges */}
                  {/* Line 1: from [115, 175] through [130, 180] to right edge */}
                  <line x1="40" y1="73" x2="280" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
                  
                  {/* Line 2: [115, 165] to [135, 173] */}
                  <line x1="40" y1="240" x2="280" y2="117" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
                  
                  {/* Axes */}
                  <line x1="40" y1="240" x2="280" y2="240" stroke="#374151" strokeWidth="2" />
                  <line x1="40" y1="20" x2="40" y2="240" stroke="#374151" strokeWidth="2" />
                  
                  {/* Current measurement point: m_H = 125.1 GeV, m_t = 172.76 GeV */}
                  {/* X: 125.1 → 40 + (125.1-115)/20 * 240 = 40 + 0.505 * 240 = 161 */}
                  {/* Y: 172.76 → 240 - (172.76-165)/15 * 220 = 240 - 0.517 * 220 = 126 */}
                  {/* 5-sigma ellipse: rx stays ~25, ry increased to ~54 to just reach stable boundary at y=147 */}
                  <ellipse
                    cx="161"
                    cy="126"
                    rx="25"
                    ry="54"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    opacity="0.7"
                  />
                  <circle cx="161" cy="126" r="4" fill="#3b82f6" />
                  
                  {/* Axis labels */}
                  <text x="160" y="270" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="500">
                    Higgs mass (GeV)
                  </text>
                  <text x="15" y="130" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="500" transform="rotate(-90, 15, 130)">
                    Top mass (GeV)
                  </text>
                  
                  {/* Tick labels - X axis (Higgs mass: 115, 125, 135) */}
                  <text x="40" y="258" textAnchor="middle" fontSize="10" fill="#6b7280">115</text>
                  <text x="160" y="258" textAnchor="middle" fontSize="10" fill="#6b7280">125</text>
                  <text x="280" y="258" textAnchor="middle" fontSize="10" fill="#6b7280">135</text>
                  
                  {/* Tick labels - Y axis (Top mass: 165, 172.5, 180) */}
                  <text x="35" y="244" textAnchor="end" fontSize="10" fill="#6b7280">165</text>
                  <text x="35" y="133" textAnchor="end" fontSize="10" fill="#6b7280">172.5</text>
                  <text x="35" y="24" textAnchor="end" fontSize="10" fill="#6b7280">180</text>
                  
                  {/* Region labels */}
                  <text x="160" y="50" fontSize="13" fill="#b91c1c" fontWeight="600" textAnchor="middle">Unstable</text>
                  <text x="160" y="135" fontSize="13" fill="#a16207" fontWeight="600" textAnchor="middle">Metastable</text>
                  <text x="220" y="215" fontSize="13" fill="#15803d" fontWeight="600" textAnchor="middle">Stable</text>
                </svg>
                
                {/* Current measurement caption */}
                <div className="absolute bottom-3 left-4 right-4 text-center">
                  <div className="inline-block bg-white/95 border border-gray-300 rounded px-3 py-1.5 text-xs shadow-sm">
                    <span className="font-medium">Current:</span> m<sub>H</sub> = 125.1 ± 0.2 GeV, m<sub>t</sub> = 172.76 ± 0.12 GeV
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Event Counts and Statistics */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-light font-mono">{Math.floor(higgsEvents).toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">Higgs events</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-light font-mono">{Math.floor(topEvents).toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">Top events</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-light font-mono">{Math.floor(diHiggsEvents).toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">Di-Higgs</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-light font-mono">{fisherInfo.toFixed(1)}</div>
                  <div className="text-xs text-gray-600 mt-1">Fisher info</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Probability Assessment</h3>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-sm mr-2 inline-block"></span>
                      Stable
                    </span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{ width: '12%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-sm mr-2 inline-block"></span>
                      Metastable
                    </span>
                    <span className="font-medium">84%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all" style={{ width: '84%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-sm mr-2 inline-block"></span>
                      Unstable
                    </span>
                    <span className="font-medium">4%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full transition-all" style={{ width: '4%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>m_H:</span>
                    <span className="font-mono">125.10 ± 0.20 GeV</span>
                  </div>
                  <div className="flex justify-between">
                    <span>m_t:</span>
                    <span className="font-mono">172.76 ± 0.12 GeV</span>
                  </div>
                  <div className="flex justify-between">
                    <span>λ₃:</span>
                    <span className="font-mono">1.02 ± 0.04</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              Updated in real-time as new data arrives. Current measurements favor metastability with 84% probability. 
              Error ellipse shrinking as Fisher information accumulates. Definitive answer expected by 2035. 
              This measurement is the primary funding justification for Apex AI's 1M GPU contribution to HL-LHC computing.
            </p>
          </div>
        </Card>

        {/* All Measurements */}
        <div>
          <h3 className="text-xl font-light mb-4">All Measurements</h3>
          <div className="space-y-3">
            {measurements.map((measurement) => (
              <Link
                key={measurement.id}
                to={measurement.id === 'trilinear' ? `${ROUTES.ANALYSIS}/trilinear` : '#'}
              >
                <Card className={`hover:shadow-md transition-all cursor-pointer ${
                  measurement.id === 'trilinear' ? 'border-l-4 border-gray-900' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{measurement.name}</h4>
                        <span className="text-xs text-gray-500">{measurement.symbol}</span>
                        {measurement.id === 'trilinear' && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            View details →
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <span className="text-gray-600">Measured: </span>
                          <span className="font-medium">{measurement.value}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">SM: </span>
                          <span>{measurement.sm}</span>
                        </div>
                        <div className="text-gray-500">{measurement.significance}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {measurement.events.toLocaleString()} events • Updated {measurement.updated}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Credit Betting */}
        <BettingCard />

        {/* Info Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-medium mb-2">About These Measurements</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            All measurements are updated in real-time using the full L1 trigger output from 
            ATLAS and CMS. The combination of complete data storage, advanced ML-based 
            reconstruction, and cross-detector synchronization has achieved unprecedented 
            precision in Standard Model measurements.
          </p>
        </Card>
      </div>
    </ScreenLayout>
  );
}

