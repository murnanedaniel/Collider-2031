import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import CreditCounter from '@/components/ui/CreditCounter';
import EventDisplayViewer from '@/components/viz/EventDisplayViewer';
import { MAJA_INFO, ROUTES } from '@/utils/constants';
import { formatStorage } from '@/utils/formatting';

export default function Dashboard() {
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [eventDisplays, setEventDisplays] = useState([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [showAnomalyScores, setShowAnomalyScores] = useState(false);

  // Load event display data
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    fetch(`${baseUrl}data/event_displays.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setEventDisplays(data);
      })
      .catch(err => {
        console.error('Error loading event displays:', err);
      });
  }, []);

  return (
    <ScreenLayout>
      <div className="space-y-12">
        {/* Welcome Section */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <h2 className="text-3xl font-light">Welcome back, {MAJA_INFO.name}</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded border border-blue-200">
              HiLumi M.C.
            </span>
          </div>
          <p className="text-gray-500">
            {MAJA_INFO.institution} • {MAJA_INFO.field}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 uppercase tracking-wide">GPU Credits</div>
              <CreditCounter value={MAJA_INFO.credits} />
              <div className="text-sm text-gray-500">Available for simulation and analysis</div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 uppercase tracking-wide">Storage Contribution</div>
              <div className="text-4xl font-light tracking-tight">
                {formatStorage(MAJA_INFO.storage_tb)}
              </div>
              <div className="text-sm text-gray-500">Earning you ~2,400 credits/month</div>
            </div>
          </Card>
        </div>

        {/* Active Bounty */}
        <Card className="border-l-4 border-gray-900">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Active Bounty</div>
                <h3 className="text-2xl font-light mb-2">
                  Time-correlated anomaly in Foundation Space
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-light">15,000</div>
                <div className="text-xs text-gray-500">credits</div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              Investigate anomalous event cluster appearing with temporal pattern in ATLAS and CMS data.
              Cross-detector correlation coefficient: 0.94. Events drift from Standard Model 
              surface during specific time windows.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => setShowBountyModal(true)}
                className="text-sm text-gray-900 hover:text-gray-600 transition-colors font-medium"
              >
                Open Bounty →
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Navigation */}
        <div>
          <h3 className="text-lg font-medium mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={ROUTES.FOUNDATION}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Explore</div>
                <div className="font-medium">Foundation Space</div>
              </Card>
            </Link>
            
            <Link to={ROUTES.MEMBERS}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Network</div>
                <div className="font-medium">Member Heatmap</div>
              </Card>
            </Link>
            
            <Link to={ROUTES.DOCS}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">Learn</div>
                <div className="font-medium">Documentation</div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Analysis completed: Anomaly pattern study</span>
              <span className="text-gray-400">2 hours ago</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Data uploaded: 847 MB to distributed storage</span>
              <span className="text-gray-400">Yesterday</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Credits earned: +2,400 from overnight compute</span>
              <span className="text-gray-400">2 days ago</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bounty Modal with Event Displays */}
      <Modal isOpen={showBountyModal} onClose={() => setShowBountyModal(false)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-light mb-2">Anomalous Event Analysis</h2>
            <p className="text-sm text-gray-500">
              Time-correlated anomalies detected in both ATLAS and CMS
            </p>
          </div>

          {eventDisplays.length > 0 ? (
            <>
              {/* Event Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedEventIndex(Math.max(0, selectedEventIndex - 1))}
                    disabled={selectedEventIndex === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm font-medium">
                    Event {selectedEventIndex + 1} of {eventDisplays.length}
                  </span>
                  <button
                    onClick={() => setSelectedEventIndex(Math.min(eventDisplays.length - 1, selectedEventIndex + 1))}
                    disabled={selectedEventIndex === eventDisplays.length - 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>

                {/* Anomaly Score Toggle */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-sm text-gray-600">Show Anomaly Scores</span>
                  <input
                    type="checkbox"
                    checked={showAnomalyScores}
                    onChange={(e) => setShowAnomalyScores(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </label>
              </div>

              {/* Event Metadata */}
              <Card className="bg-gray-50">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Event ID</div>
                    <div className="font-medium">{eventDisplays[selectedEventIndex].event_id}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Detector</div>
                    <div className="font-medium">{eventDisplays[selectedEventIndex].detector}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Mean Anomaly Score</div>
                    <div className="font-medium">
                      {eventDisplays[selectedEventIndex].mean_anomaly_score.toFixed(3)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Event Display Viewer */}
              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                <EventDisplayViewer
                  event={eventDisplays[selectedEventIndex]}
                  colorMode={showAnomalyScores ? 'anomaly' : 'type'}
                  width={600}
                  height={600}
                />
              </div>

              {/* Analysis Notes */}
              <Card className="bg-blue-50 border-blue-200">
                <div className="text-sm space-y-2">
                  <div className="font-medium text-blue-900">Observation Notes:</div>
                  <ul className="text-blue-800 space-y-1 ml-4 list-disc">
                    <li>Elliptical streak of high-anomaly hits detected</li>
                    <li>Pattern appears during 16:03-16:09 time window</li>
                    <li>Correlated across both ATLAS and CMS detectors</li>
                    <li>Anomaly scores: 0.7-1.0 (vs. normal: 0.0-0.1)</li>
                  </ul>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Link to={ROUTES.FOUNDATION} className="flex-1">
                  <button className="btn-primary w-full">
                    Investigate in Foundation Space →
                  </button>
                </Link>
                <button
                  onClick={() => setShowBountyModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Loading event displays...
            </div>
          )}
        </div>
      </Modal>
    </ScreenLayout>
  );
}

