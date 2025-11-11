import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import AgentModal from '@/components/ui/AgentModal';
import FloatingAgentButton from '@/components/ui/FloatingAgentButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FoundationSpaceViewer from '@/components/viz/FoundationSpaceViewer';
import { useAgent } from '@/contexts/AgentContext';
import { useData } from '@/hooks/useData';
import { ROUTES } from '@/utils/constants';

export default function FoundationSpace() {
  const { events, surfaces, simulatedEvents, loading, error } = useData();
  
  // Use agent context
  const {
    isAgentOpen,
    currentPage,
    agentResponse,
    openAgent,
    closeAgent,
    handleAgentSubmit,
    clearAgentResponse,
    foundationSpaceState,
    setFoundationSpaceState,
  } = useAgent();
  
  const [showSM, setShowSM] = useState(true);
  const [showProcesses, setShowProcesses] = useState(false);
  const [detectorFilter, setDetectorFilter] = useState('all');
  const [showSimulation, setShowSimulation] = useState(false);
  const [showAgentInModal, setShowAgentInModal] = useState(false);
  
  // Time series controls (main page)
  const [timeOfDay, setTimeOfDay] = useState(0);
  const [showATLAS, setShowATLAS] = useState(true);
  const [showCMS, setShowCMS] = useState(true);
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eventsGenerated, setEventsGenerated] = useState(0);
  const [flareClass, setFlareClass] = useState('M5.4');
  const [eventRate, setEventRate] = useState(1000);
  const [simulationIntervalRef, setSimulationIntervalRef] = useState(null);
  
  // Calibration state
  const [showSimulatedEvents, setShowSimulatedEvents] = useState(false);
  const [calibrationRotation, setCalibrationRotation] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [adversarialLoss, setAdversarialLoss] = useState(1.0);
  const [lossHistory, setLossHistory] = useState([]);
  
  // Solar flare modal state
  const [showSolarFlareModal, setShowSolarFlareModal] = useState(false);
  
  // Git commit modal state
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [commitSuccess, setCommitSuccess] = useState(false);
  
  const blocks = [
    { id: 'sun', name: 'Sun Model', icon: '☀️', color: 'bg-yellow-100 border-yellow-300', library: 'Solaris 7.5' },
    { id: 'flare', name: 'Solar Flare', icon: '💥', color: 'bg-orange-100 border-orange-300', library: 'Solaris 7.5' },
    { id: 'collider', name: 'LHC Collisions', icon: '⚛️', color: 'bg-blue-100 border-blue-300', library: 'MadGraph 6' },
    { id: 'detector', name: 'Detector Digitization', icon: '📡', color: 'bg-purple-100 border-purple-300', library: 'Geant5' },
  ];
  const [activeBlocks, setActiveBlocks] = useState(['collider', 'detector']);
  
  const toggleBlock = (blockId) => {
    setActiveBlocks(prev => 
      prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  };

  // Watch for agent-triggered solar flare modal
  useEffect(() => {
    if (foundationSpaceState.showSolarFlareModal) {
      setShowSolarFlareModal(true);
      // Reset the trigger
      setFoundationSpaceState(prev => ({
        ...prev,
        showSolarFlareModal: false,
      }));
    }
  }, [foundationSpaceState.showSolarFlareModal, setFoundationSpaceState]);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (!events) return {
      totalAnomalies: 0,
      atlasCount: 0,
      cmsCount: 0,
      correlation: 0.94
    };
    
    const anomalies = events.filter(e => e.is_solar);
    return {
      totalAnomalies: anomalies.length,
      atlasCount: anomalies.filter(e => e.detector === 'ATLAS').length,
      cmsCount: anomalies.filter(e => e.detector === 'CMS').length,
      correlation: 0.94 // Pre-calculated correlation coefficient
    };
  }, [events]);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setEventsGenerated(0);

    // 1 minute = 60 seconds = 60,000ms
    // Update every 100ms, so 600 steps
    const totalTime = 60000; // 1 minute in ms
    const updateInterval = 100; // Update every 100ms
    const totalSteps = totalTime / updateInterval;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / totalSteps) * 100;
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setProgress(100);
        setIsRunning(false);
        setSimulationIntervalRef(null);
        // Show simulated events after simulation completes
        setShowSimulatedEvents(true);
        setShowSimulation(false); // Close modal
      } else {
        setProgress(newProgress);
      }
      
      // Generate events at realistic rate (~100M total over 1 min)
      setEventsGenerated(prev => prev + Math.floor(Math.random() * 160000 + 140000));
    }, updateInterval);
    
    setSimulationIntervalRef(interval);
  };

  const handleSkipSimulation = () => {
    if (simulationIntervalRef) {
      clearInterval(simulationIntervalRef);
      setSimulationIntervalRef(null);
    }
    setProgress(100);
    setIsRunning(false);
    setEventsGenerated(100000000); // Set to ~100M events
    setShowSimulatedEvents(true);
    setShowSimulation(false);
  };

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setLossHistory([1.0]); // Start with high loss
    
    // Animate rotation from 0 to 1 over 12 seconds
    const duration = 12000; // 12 seconds
    const updateInterval = 50; // Update every 50ms
    const totalSteps = duration / updateInterval;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newRotation = currentStep / totalSteps;
      
      // Calculate adversarial loss - decreases as rotation approaches alignment
      // Using exponential decay with some noise for realism
      const baseLoss = Math.exp(-5 * newRotation); // Exponential decay
      const noise = (Math.random() - 0.5) * 0.05; // Small random fluctuations
      const currentLoss = Math.max(0.001, Math.min(1.0, baseLoss + noise));
      
      setAdversarialLoss(currentLoss);
      setLossHistory(prev => [...prev, currentLoss]);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setCalibrationRotation(1);
        setAdversarialLoss(0.001); // Converged to near-zero
        setIsCalibrating(false);
      } else {
        setCalibrationRotation(newRotation);
      }
    }, updateInterval);
  };

  const handleCommitSubmit = () => {
    if (!commitMessage.trim()) return;
    
    // Simulate git commit
    setCommitSuccess(true);
    
    // Reset after showing success message
    setTimeout(() => {
      setShowCommitModal(false);
      setCommitMessage('');
      setTimeout(() => setCommitSuccess(false), 300);
    }, 3000);
  };

  const handleSimulationAgentSubmit = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if requesting solar simulation
    if ((lowerQuery.includes('solar') || lowerQuery.includes('solaris')) &&
        (lowerQuery.includes('simulation') || lowerQuery.includes('sim'))) {
      // Add sun and flare blocks
      setActiveBlocks(['sun', 'flare', 'collider', 'detector']);
      setShowAgentInModal(false);
      
      // Set flare class if specified
      if (lowerQuery.includes('m5.4')) {
        setFlareClass('M5.4');
      }
    }
  };

  return (
    <ScreenLayout 
      title="Foundation Space"
      subtitle="100,000-dimensional latent space of HL-LHC events"
    >
      {/* Agent Response Banner */}
      {agentResponse && currentPage === 'foundationSpace' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-start">
          <p className="text-sm text-gray-800">{agentResponse}</p>
          <button
            onClick={clearAgentResponse}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content: 3D Viewport + Time Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* 3D Viewport */}
          <Card className="h-[600px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-600">
                Error loading data: {error.message}
              </div>
            ) : (
              <FoundationSpaceViewer
                events={events}
                surfaces={surfaces}
                simulatedEvents={simulatedEvents}
                showSimulatedEvents={showSimulatedEvents}
                calibrationRotation={calibrationRotation}
                timeOfDay={timeOfDay}
                showSM={showSM}
                showProcesses={showProcesses}
                detectorFilter={detectorFilter}
                showATLAS={showATLAS}
                showCMS={showCMS}
              />
            )}
          </Card>

          {/* Time Series Controls */}
          <Card>
            <h3 className="font-medium mb-4">Time Analysis</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Time of Day</span>
                  <span className="font-medium">
                    {Math.floor(timeOfDay)}:{Math.floor((timeOfDay % 1) * 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.01"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>24:00</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showATLAS}
                    onChange={(e) => setShowATLAS(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="w-3 h-3 rounded-full bg-atlas-red"></span>
                  <span className="text-sm">ATLAS</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCMS}
                    onChange={(e) => setShowCMS(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="w-3 h-3 rounded-full bg-cms-blue"></span>
                  <span className="text-sm">CMS</span>
                </label>
              </div>

              <p className="text-sm text-gray-600 italic">
                Move the time slider to see how events drift from the SM surface over the course of the day.
              </p>
            </div>
          </Card>

          {/* Calibration Controls */}
          {showSimulatedEvents && (
            <Card className="bg-yellow-50 border-yellow-200">
              <h3 className="font-medium mb-4">Model Calibration</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Simulated events are now visible in the viewer (orange/yellow). 
                  {calibrationRotation === 0 && " They're currently misaligned with the real anomaly."}
                  {calibrationRotation > 0 && calibrationRotation < 1 && " Calibrating..."}
                  {calibrationRotation === 1 && " Calibration complete! The model now matches the observed pattern."}
                </p>
                
                {/* Adversarial Loss Display */}
                {isCalibrating && (
                  <div className="bg-white p-3 rounded border border-yellow-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600 font-medium">Adversarial Loss</span>
                      <span className="text-sm font-mono">{adversarialLoss.toFixed(4)}</span>
                    </div>
                    {/* Mini loss curve */}
                    <div className="h-16 bg-gray-50 rounded relative overflow-hidden">
                      <svg width="100%" height="100%" className="absolute inset-0">
                        <polyline
                          points={lossHistory.map((loss, i) => 
                            `${(i / Math.max(lossHistory.length - 1, 1)) * 100},${(1 - loss) * 100}`
                          ).join(' ')}
                          fill="none"
                          stroke="#DC2626"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <div className="absolute inset-x-0 bottom-0 text-xs text-gray-400 px-2 pb-1 flex justify-between">
                        <span>Start</span>
                        <span>Convergence</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {calibrationRotation === 1 && (
                  <div className="bg-white p-3 rounded border border-green-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 font-medium">Final Loss</span>
                      <span className="text-sm font-mono text-green-700">{adversarialLoss.toFixed(4)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Model converged successfully</div>
                  </div>
                )}
                
                {calibrationRotation < 1 && (
                  <button
                    onClick={handleCalibrate}
                    disabled={isCalibrating}
                    className="w-full btn-primary bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isCalibrating ? 'Calibrating...' : 'Calibrate Model'}
                  </button>
                )}
                {calibrationRotation === 1 && (
                  <>
                    <div className="text-sm text-green-700 font-medium flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Model aligned with observed anomaly</span>
                    </div>
                    <button
                      onClick={() => setShowCommitModal(true)}
                      className="w-full btn-primary bg-gray-800 hover:bg-gray-900 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Git Commit</span>
                    </button>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Narrative Text */}
          <Card className="bg-gray-50">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong>Foundation Space</strong> is a 100,000-dimensional learned latent space where 
                all HL-LHC events are embedded. The Standard Model surface contains 99.97% of events. 
                This anomalous bubble sits outside—and it's correlated across detectors.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                The temporal pattern is clear: events drift from the SM surface during specific time 
                windows, then return. Both ATLAS and CMS see this behavior simultaneously.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Controls + Tools */}
        <div className="space-y-6">
          {/* Display Controls */}
          <Card>
            <h3 className="font-medium mb-4">Display Controls</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSM}
                  onChange={(e) => setShowSM(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">SM Surface</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProcesses}
                  onChange={(e) => setShowProcesses(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Process Surfaces</span>
              </label>
            </div>
          </Card>

          {/* Detector Filter */}
          <Card>
            <h3 className="font-medium mb-4">Detector Filter</h3>
            <div className="space-y-2">
              {['all', 'ATLAS', 'CMS'].map((filter) => (
                <label key={filter} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={detectorFilter === filter}
                    onChange={() => setDetectorFilter(filter)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{filter === 'all' ? 'All Detectors' : filter}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Statistics */}
          <Card>
            <h3 className="font-medium mb-4">Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Anomalous events</span>
                <span className="font-medium">{stats.totalAnomalies.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ATLAS</span>
                <span className="font-medium">{stats.atlasCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CMS</span>
                <span className="font-medium">{stats.cmsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Correlation</span>
                <span className="font-medium">{stats.correlation.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Simulation Tool Button */}
          <button
            onClick={() => setShowSimulation(true)}
            className="w-full btn-primary"
          >
            Build Simulation
          </button>

          {/* Documentation Link */}
          <Card className="bg-gray-50">
            <Link 
              to={ROUTES.DOCS + '/foundation-space'} 
              className="text-sm text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              Learn about Foundation Space →
            </Link>
          </Card>
        </div>
      </div>

      {/* Simulation Modal */}
      <Modal isOpen={showSimulation} onClose={() => setShowSimulation(false)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-light mb-2">Simulation Builder</h2>
            <p className="text-sm text-gray-500">Modular event generation with custom physics</p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {/* Agent Interface */}
            <div className="col-span-2">
              <h3 className="font-medium mb-4 text-sm">AI Agent</h3>
              <Card className="bg-gray-50">
                <div className="space-y-4">
                  <p className="text-xs text-gray-600">
                    Describe the simulation you want to run. The agent will configure the pipeline automatically.
                  </p>
                  <button
                    onClick={() => setShowAgentInModal(true)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="text-sm text-gray-500">Click to describe simulation...</span>
                    </div>
                  </button>
                  <div className="text-xs text-gray-500 italic">
                    Example: "solar simulation using Solaris 7.5, with flare class M5.4"
                  </div>
                </div>
              </Card>
              
              {/* Show current modules */}
              <div className="mt-4">
                <h3 className="font-medium mb-3 text-sm">Active Modules</h3>
                <div className="space-y-2">
                  {blocks.filter(b => activeBlocks.includes(b.id)).map(block => (
                    <div
                      key={block.id}
                      className={`p-3 rounded border-2 ${block.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{block.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{block.name}</div>
                            <div className="text-xs text-gray-600">{block.library}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline + Controls */}
            <div className="col-span-3 space-y-6">
              <div>
                <h3 className="font-medium mb-4 text-sm">Simulation Pipeline</h3>
                <div className="space-y-2">
                  {activeBlocks.map((blockId, index) => {
                    const block = blocks.find(b => b.id === blockId);
                    return (
                      <div key={blockId}>
                        <div className={`p-4 rounded border-2 ${block.color}`}>
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{block.icon}</span>
                            <span className="font-medium">{block.name}</span>
                          </div>
                        </div>
                        {index < activeBlocks.length - 1 && (
                          <div className="flex justify-center py-1">
                            <div className="text-2xl text-gray-400">↓</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Parameters */}
              <Card>
                <h3 className="font-medium mb-4 text-sm">Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Flare Class</label>
                    <select
                      value={flareClass}
                      onChange={(e) => setFlareClass(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                      disabled={!activeBlocks.includes('flare')}
                    >
                      <option value="C1.0">C1.0 (Weak)</option>
                      <option value="M5.4">M5.4 (Moderate)</option>
                      <option value="X2.0">X2.0 (Strong)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
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

              {/* Progress */}
              {(isRunning || progress > 0) && (
                <Card>
                  <h3 className="font-medium mb-4 text-sm">Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-600">Running simulation...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gray-900 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-xs">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xl font-light">{eventsGenerated.toLocaleString()}</div>
                        <div className="text-gray-600">Events</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xl font-light">
                          {Math.floor(progress * 0.6 / 60)}:{String(Math.floor(progress * 0.6 % 60)).padStart(2, '0')}
                        </div>
                        <div className="text-gray-600">Elapsed</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xl font-light">{(progress * 0.47).toFixed(0)}</div>
                        <div className="text-gray-600">Credits</div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Action Button */}
              <button
                onClick={isRunning ? handleSkipSimulation : handleRunSimulation}
                disabled={activeBlocks.length === 0 || progress === 100}
                className="btn-primary w-full"
              >
                {isRunning ? 'Running...' : progress === 100 ? 'Simulation Complete' : 'Run Simulation'}
              </button>
            </div>
          </div>

          {/* Info */}
          <Card className="bg-gray-50">
            <p className="text-xs text-gray-600 leading-relaxed">
              Modular simulation powered by SiReAaaS. Geant5 differentiable mode enables 
              fast GPU-accelerated generation at ~100M events/hour.
            </p>
          </Card>
        </div>
      </Modal>

      {/* Agent Modal for Simulation Builder */}
      <AgentModal
        isOpen={showAgentInModal}
        onClose={() => setShowAgentInModal(false)}
        onSubmit={handleSimulationAgentSubmit}
        placeholder="Describe your simulation..."
      />

      {/* Solar Flare Data Modal */}
      <Modal isOpen={showSolarFlareModal} onClose={() => setShowSolarFlareModal(false)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-light mb-2">Solar Flare Event Match</h2>
            <p className="text-sm text-gray-500">Correlated with observed anomaly</p>
          </div>

          <Card className="bg-orange-50 border-orange-200">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">💥</span>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">M5.4 Solar Flare</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Date: <span className="font-mono">2031-06-14 16:08 UTC</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flare Class</span>
                  <span className="font-medium">M5.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Time</span>
                  <span className="font-medium">16:08 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">~12 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Region</span>
                  <span className="font-medium">AR 3742</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correlation</span>
                  <span className="font-medium text-green-700">0.94</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2">Reference</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>NOAA/SWPC Solar Event Report</strong><br/>
                Event #2031-0614-M54<br/>
                <a href="#" className="text-blue-600 hover:underline">
                  https://swpc.noaa.gov/products/solar-event-report/2031/06/14/M5.4
                </a>
              </p>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong>Analysis:</strong> Temporal correlation with LHC anomaly events suggests 
                solar particle flux may be affecting detector response. The timing matches within 
                2 minutes of anomaly onset across both ATLAS and CMS.
              </p>
            </Card>
          </div>

          <button
            onClick={() => setShowSolarFlareModal(false)}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Git Commit Modal */}
      <Modal isOpen={showCommitModal} onClose={() => !commitSuccess && setShowCommitModal(false)}>
        <div className="space-y-6">
          {!commitSuccess ? (
            <>
              <div>
                <h2 className="text-2xl font-light mb-2">Commit Model Updates</h2>
                <p className="text-sm text-gray-500">Save your calibrated Foundation Space model</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Commit Message</label>
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g., Fine-tune Foundation Space for solar anomaly detection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Describe the changes made to the model calibration
                </p>
              </div>

              <Card className="bg-gray-50">
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-gray-600">Changes to be committed:</div>
                  <div className="text-green-700">+ models/foundation_space_calibrated.pt</div>
                  <div className="text-blue-700">M models/foundation_space.config</div>
                  <div className="text-gray-600 mt-2">Adversarial loss: 1.000 → 0.001</div>
                </div>
              </Card>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCommitModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitSubmit}
                  disabled={!commitMessage.trim()}
                  className="flex-1 btn-primary"
                >
                  Commit
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light mb-3">🎉 Congratulations!</h2>
              <p className="text-lg text-gray-700 mb-2">Your first commit to Foundation Space</p>
              <p className="text-sm text-gray-500 mb-6">Model calibration successfully saved to the repository</p>
              <Card className="bg-gray-50 text-left">
                <div className="space-y-1 text-sm font-mono">
                  <div className="text-gray-600">[main {Math.random().toString(36).substr(2, 7)}] {commitMessage}</div>
                  <div className="text-green-700">2 files changed, 1847 insertions(+)</div>
                  <div className="text-gray-600">create mode 100644 models/foundation_space_calibrated.pt</div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Modal>

      {/* Global Agent Button */}
      <FloatingAgentButton onClick={() => openAgent('foundationSpace')} />

      {/* Global Agent Modal */}
      {isAgentOpen && currentPage === 'foundationSpace' && (
        <AgentModal
          isOpen={isAgentOpen}
          onClose={closeAgent}
          onSubmit={(query) => handleAgentSubmit(query, 'foundationSpace')}
          placeholder="Ask about Foundation Space, simulations, or calibration..."
        />
      )}
    </ScreenLayout>
  );
}
