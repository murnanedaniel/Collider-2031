import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

export default function SimulationBuilder() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eventsGenerated, setEventsGenerated] = useState(0);
  const [flareClass, setFlareClass] = useState('M5.4');
  const [eventRate, setEventRate] = useState(1000);

  const blocks = [
    { id: 'sun', name: 'Sun Model', icon: '☀️', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'flare', name: 'Solar Flare', icon: '💥', color: 'bg-orange-100 border-orange-300' },
    { id: 'collider', name: 'LHC Collisions', icon: '⚛️', color: 'bg-blue-100 border-blue-300' },
    { id: 'detector', name: 'Detector Digitization', icon: '📡', color: 'bg-purple-100 border-purple-300' },
  ];

  const [activeBlocks, setActiveBlocks] = useState(['collider', 'detector']);

  const toggleBlock = (blockId) => {
    setActiveBlocks(prev => 
      prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setEventsGenerated(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 2;
      });
      setEventsGenerated(prev => prev + Math.floor(Math.random() * 5000 + 5000));
    }, 100);
  };

  return (
    <ScreenLayout 
      title="Simulation Builder"
      subtitle="Modular event generation with custom physics modules"
    >
      <div className="space-y-8">
        {/* Main Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Block Palette */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-medium mb-4">Available Modules</h3>
              <div className="space-y-2">
                {blocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => toggleBlock(block.id)}
                    className={`w-full p-3 rounded border-2 transition-all ${
                      activeBlocks.includes(block.id)
                        ? block.color + ' shadow-sm'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{block.icon}</span>
                      <span className="text-sm font-medium">{block.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-medium mb-4 text-sm text-gray-600">Documentation</h3>
              <div className="space-y-2 text-xs">
                <Link to={ROUTES.DOCS + '/madgraph'} className="block text-gray-600 hover:text-gray-900">
                  → MadGraph 6 (ME calc)
                </Link>
                <Link to={ROUTES.DOCS + '/geant5'} className="block text-gray-600 hover:text-gray-900">
                  → Geant5 (detector sim)
                </Link>
                <Link to={ROUTES.DOCS + '/sireaas'} className="block text-gray-600 hover:text-gray-900">
                  → SiReAaaS platform
                </Link>
              </div>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="min-h-[400px]">
              <h3 className="font-medium mb-4">Simulation Pipeline</h3>
              <div className="space-y-4">
                {activeBlocks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">🧩</div>
                    <p>Add modules from the palette to build your simulation</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {activeBlocks.map((blockId, index) => {
                      const block = blocks.find(b => b.id === blockId);
                      return (
                        <React.Fragment key={blockId}>
                          <div className={`p-4 rounded border-2 ${block.color}`}>
                            <div className="text-3xl mb-2">{block.icon}</div>
                            <div className="text-sm font-medium">{block.name}</div>
                          </div>
                          {index < activeBlocks.length - 1 && (
                            <div className="flex items-center text-2xl text-gray-400">
                              →
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Parameters */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <h3 className="font-medium mb-4">Solar Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Flare Class</label>
                    <select
                      value={flareClass}
                      onChange={(e) => setFlareClass(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                      disabled={!activeBlocks.includes('flare')}
                    >
                      <option value="C1.0">C1.0 (Weak)</option>
                      <option value="M5.4">M5.4 (Moderate)</option>
                      <option value="X2.0">X2.0 (Strong)</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-medium mb-4">Simulation Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Event Rate: {eventRate.toLocaleString()} Hz
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={eventRate}
                      onChange={(e) => setEventRate(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Progress */}
            {(isRunning || progress > 0) && (
              <Card>
                <h3 className="font-medium mb-4">Simulation Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-light">{eventsGenerated.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Events Generated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-light">{Math.floor(progress * 30)}s</div>
                      <div className="text-xs text-gray-500">Elapsed Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-light">{(progress * 47).toFixed(0)}</div>
                      <div className="text-xs text-gray-500">Credits Used</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Button */}
            <div className="flex justify-between">
              <Link to={ROUTES.ANALYSIS}>
                <button className="btn-secondary">← Back</button>
              </Link>
              {progress < 100 ? (
                <button
                  onClick={handleRunSimulation}
                  disabled={isRunning || activeBlocks.length === 0}
                  className="btn-primary"
                >
                  {isRunning ? 'Running...' : 'Run Simulation'}
                </button>
              ) : (
                <Link to={ROUTES.SOLAR}>
                  <button className="btn-primary">
                    View Results →
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <Card className="bg-gray-50">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Modular Simulation:</strong> ColliderLab's simulation system uses composable 
            building blocks. Maja adds solar physics modules to the standard collider simulation 
            pipeline. The differentiable Geant5 backend enables fast, GPU-accelerated event 
            generation at ~100M events/hour.
          </p>
        </Card>
      </div>
    </ScreenLayout>
  );
}

