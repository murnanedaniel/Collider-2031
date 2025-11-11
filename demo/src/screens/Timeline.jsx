import React from 'react';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';

export default function Timeline() {
  const timelineData = [
    {
      year: '2025',
      title: 'Foundation Year',
      current: true,
      events: [
        { month: 'October', description: 'Starting Point - LHC Run 3 at 13.6 TeV, GPT-4 class models, Kyle Cranmer moves to UW-Madison' },
        { month: 'November', description: 'CERN publishes ML for trigger systems whitepaper, first learned event representations' },
        { month: 'December', description: 'FASER sees hints of long-lived particles, compute bottleneck discussions' },
      ]
    },
    {
      year: '2026',
      title: 'Seeds of Change',
      milestone: true,
      events: [
        { month: 'June', description: '🎤 Kyle Cranmer\'s viral TED talk "The AI Revolution in Particle Physics" (5M views)', highlight: true },
        { month: 'July', description: 'LHC Run 3 ends, Long Shutdown 3 (LS3) begins' },
        { month: 'December', description: 'LS3 work underway - collaborations debate future data policies' },
      ]
    },
    {
      year: '2027',
      title: 'The Great Opening',
      milestone: true,
      events: [
        { month: 'March', description: '⚖️ LANDMARK - Swiss Federal Data Transparency Act passes', highlight: true },
        { month: 'June', description: 'First ATLAS-CMS joint ML paper (Dr. Sarah Chen co-author)' },
        { month: 'July', description: 'Dr. Sarah Chen\'s breakthrough "Adversarial Unfolding" at NeurIPS' },
        { month: 'October', description: 'First "HiLumi Metacollaboration" meeting (200 attendees)' },
      ]
    },
    {
      year: '2028',
      title: 'Building Infrastructure',
      milestone: true,
      events: [
        { month: 'June', description: '🍺 Maurizio Pierini takes Mistral AI CEO drinking in Geneva - discusses Higgs vacuum stability', highlight: true },
        { month: 'September', description: 'Mistral announces 10 GW datacenter construction in southern France' },
        { month: 'October', description: 'Mistral commits idle GPU capacity to particle physics (1M GPU-hours/year)', highlight: true },
        { month: 'November', description: 'ColliderLab platform prototype demonstrated at CERN' },
      ]
    },
    {
      year: '2029',
      title: 'The Differentiable Revolution',
      events: [
        { month: 'January', description: 'Geant5 alpha release - GPU-native, 60% differentiable' },
        { month: 'March', description: 'Foundation Space v1.0 (50,000 dimensions, 10¹¹ simulated events)' },
        { month: 'April', description: 'SiReAaaS (Simulation, Reconstruction, Analysis as a Service) launches' },
        { month: 'July', description: 'ATLAS and CMS restructure as "HiLumi M.C."' },
        { month: 'August', description: 'Geant5 beta - 85% differentiable, 50× faster' },
      ]
    },
    {
      year: '2030',
      title: 'The High-Luminosity Era Begins',
      milestone: true,
      events: [
        { month: 'February', description: 'Geant5 v1.0 - fully differentiable, 100× faster than Geant4' },
        { month: 'March', description: 'Foundation Space upgraded to 100,000 dimensions' },
        { month: 'June', description: '🎉 HL-LHC FIRST BEAM - Run 4 begins at 14 TeV!', highlight: true },
        { month: 'July', description: 'Standard Model surface mapping project launches' },
        { month: 'December', description: 'Year 1 review: 150 fb⁻¹ collected, trilinear coupling 18% precision' },
      ]
    },
    {
      year: '2031',
      title: 'Discovery Enablement',
      current: true,
      events: [
        { month: 'January', description: 'Foundation Space v2.0 with SM surface v1.0 (99.97% coverage)' },
        { month: 'February', description: 'First major unexplained anomaly bubble appears (~2000 events, both detectors)' },
        { month: 'March', description: 'Climate scientist Maja Andersen joins HiLumi M.C., notices diurnal pattern' },
        { month: 'June 14', description: '⭐ Maja discovers solar correlation using custom simulation (8,400 credits, 3 minutes)', highlight: true },
        { month: 'June 15', description: 'Standing ovation at plenary - solar correlation prevents future false positives' },
      ]
    },
  ];

  const milestones = [
    { year: '2026', event: 'Kyle\'s TED Talk', probability: '30%' },
    { year: '2027', event: 'Swiss Data Act', probability: '20%' },
    { year: '2028', event: 'Mistral Partnership', probability: '5%' },
    { year: '2029', event: 'Geant5 Differentiable', probability: '60%' },
    { year: '2030', event: 'HL-LHC Success', probability: '95%' },
    { year: '2030', event: 'SM Surface Mapping', probability: '40%' },
  ];

  return (
    <ScreenLayout 
      title="Timeline to ColliderLab"
      subtitle="The path from today to Maja's discovery (2025-2031)"
    >
      <div className="space-y-6">
        {/* Current Status Banner */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">You are here: October 2025</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                This demo shows what particle physics could look like in 2031. The timeline below traces
                the technological, political, and cultural shifts required to get from today's traditional
                collaborations to Maja's interdisciplinary, AI-enabled discovery workflow.
              </p>
              <p className="text-sm text-blue-800 mt-2">
                <strong>Overall probability of this exact timeline:</strong> ~0.2% (requires multiple
                low-probability events to align perfectly)
              </p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-8">
            {timelineData.map((period, periodIdx) => (
              <div key={period.year} className="relative">
                {/* Year marker */}
                <div className={`flex items-center space-x-4 mb-4 ${period.current ? 'animate-pulse' : ''}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 ${
                    period.current ? 'bg-blue-600' : period.milestone ? 'bg-gray-900' : 'bg-gray-600'
                  }`}>
                    '{period.year.slice(2)}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-light ${period.current ? 'text-blue-600' : ''}`}>
                      {period.year}: {period.title}
                    </h2>
                    {period.current && <span className="text-sm text-blue-600 font-medium">← We are here</span>}
                  </div>
                </div>

                {/* Events */}
                <div className="ml-24 space-y-3">
                  {period.events.map((event, idx) => (
                    <Card 
                      key={idx}
                      className={`${event.highlight ? 'bg-yellow-50 border-yellow-300' : 'bg-white'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-sm font-medium text-gray-500 min-w-[80px]">
                          {event.month}
                        </span>
                        <p className={`text-sm ${event.highlight ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {event.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Dependencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
            <h3 className="font-medium mb-4">Critical Inflection Points</h3>
            <div className="space-y-3">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{milestone.year}:</span> {milestone.event}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    parseFloat(milestone.probability) < 20 ? 'bg-red-100 text-red-700' :
                    parseFloat(milestone.probability) < 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {milestone.probability}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">
              Combined probability ≈ 0.2% (0.30 × 0.20 × 0.05 × 0.60 × 0.95 × 0.40)
            </p>
          </Card>

          <Card>
            <h3 className="font-medium mb-4">Technology Requirements</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Transformer scaling continues through 2029</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>GPU efficiency improves 10× by 2031</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">⚠</span>
                <span>Differentiable programming matures for physics</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">⚠</span>
                <span>Real-time ML inference &lt;1ms latency</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">⚠</span>
                <span>Distributed systems handle EB-scale reliably</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cultural Shifts */}
        <Card className="bg-gray-50">
          <h3 className="font-medium mb-4">Cultural Shifts Required (2025-2031)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">From Secrecy → Openness</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Collaboration authorship → individual contribution</li>
                <li>• Embargo periods → real-time sharing</li>
                <li>• Proprietary analysis → open methods</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">From Institution → Individual</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• University affiliation → personal identity</li>
                <li>• Grant-based → credit-based research</li>
                <li>• Hierarchical → flat structures</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">From Discipline → Interdisciplinary</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Physics PhDs only → domain experts welcome</li>
                <li>• Theory/experiment divide → unified analysis</li>
                <li>• Human-only → human-AI collaboration</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">From Competition → Cooperation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Racing for discovery → shared investigation</li>
                <li>• Hoarding data → contributing to commons</li>
                <li>• Individual glory → collective progress</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 2031 Snapshot */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-medium mb-4 text-lg">Mid-2031: State of the Field</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Technology</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 100k-dim Foundation Space</li>
                <li>• Geant5: 100× speedup</li>
                <li>• 100M events in 3 minutes</li>
                <li>• Real-time anomaly detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Organization</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 150,000 M.C. members</li>
                <li>• 40% interdisciplinary</li>
                <li>• 500+ bounties claimed</li>
                <li>• Credit betting markets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Physics Results</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 250 fb⁻¹ in Year 1</li>
                <li>• λ₃: 1.02 ± 0.08 (8%)</li>
                <li>• 18M Higgs events</li>
                <li>• 150 di-Higgs events</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <Card className="bg-gray-50 border-gray-200">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Note:</strong> This timeline represents an optimistic but plausible scenario requiring
            multiple low-probability events to align. More likely outcomes include gradual opening of data
            over 2026-2035, incremental compute improvements, and Geant5 arriving 2031-2032 with partial
            differentiability. Maja-like discoveries would still be possible, but would take years instead
            of hours. See <code className="bg-white px-1 rounded">docs/timeline.md</code> for full analysis
            including alternative scenarios.
          </p>
        </Card>
      </div>
    </ScreenLayout>
  );
}
