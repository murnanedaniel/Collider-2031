import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { useAgent } from '@/contexts/AgentContext';
import { ROUTES } from '@/utils/constants';
import { generateMembers, getMembersNearATLAS, getMembersByAngularSector } from '@/utils/generateMembers';

export default function MemberHeatmap() {
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Use agent context
  const {
    isAgentOpen,
    currentPage,
    agentResponse,
    openAgent,
    closeAgent,
    handleAgentSubmit,
    clearAgentResponse,
    memberHeatmapState,
  } = useAgent();

  // Generate members once
  const allMembers = useMemo(() => generateMembers(1247, 42), []);
  const nearbyMembers = useMemo(() => getMembersNearATLAS(allMembers, 50), [allMembers]);
  const angularMembers = useMemo(() => getMembersByAngularSector(allMembers, 90, 120), [allMembers]);
  
  // Update filter when agent applies angular filter
  useEffect(() => {
    if (memberHeatmapState.filterApplied) {
      setFilterRegion('angular');
    }
  }, [memberHeatmapState.filterApplied]);
  
  // Reset local filter when global state is reset
  useEffect(() => {
    if (!memberHeatmapState.filterApplied && !memberHeatmapState.proposalVisible) {
      setFilterRegion('all');
    }
  }, [memberHeatmapState]);
  
  // Clear agent response after 5 seconds
  useEffect(() => {
    if (agentResponse && currentPage === 'memberHeatmap') {
      const timer = setTimeout(() => {
        clearAgentResponse();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [agentResponse, currentPage, clearAgentResponse]);
  
  const displayMembers = filterRegion === 'nearby' 
    ? nearbyMembers 
    : filterRegion === 'angular'
    ? angularMembers
    : allMembers;
  
  // Calculate total storage
  const totalStorage = useMemo(() => {
    const totalTB = allMembers.reduce((sum, m) => sum + m.storage_tb, 0);
    return (totalTB / 1000).toFixed(1); // Convert to PB
  }, [allMembers]);

  return (
    <ScreenLayout 
      title="HiLumi M.C. Member Network"
      subtitle="Distributed computing and storage across global physics community"
    >
      <div className="space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-light">{allMembers.length.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">Active members</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-light">~{totalStorage} PB</div>
              <div className="text-xs text-gray-600 mt-1">Total storage</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-light">1M GPUs</div>
              <div className="text-xs text-gray-600 mt-1">Compute capacity</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-light">24/7</div>
              <div className="text-xs text-gray-600 mt-1">Simulation uptime</div>
            </div>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="h-[500px] overflow-hidden">
          <MapContainer
            center={[46.2333, 6.0557]} // CERN coordinates
            zoom={filterRegion === 'nearby' ? 10 : 2}
            style={{ height: '100%', width: '100%' }}
            className="rounded"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {displayMembers.map((member) => (
              <CircleMarker
                key={member.id}
                center={[member.lat, member.lon]}
                radius={4}
                fillColor="#3498db"
                color="#2980b9"
                weight={1}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{member.name}</div>
                    {member.institution && (
                      <div className="text-gray-600 text-xs">{member.institution}</div>
                    )}
                    <div className="mt-2 space-y-1 text-xs">
                      <div>Storage: {member.storage_tb} TB</div>
                      <div>Credits: {member.credits.toLocaleString()}</div>
                      {member.distance !== undefined && (
                        <div className="text-gray-500">
                          {member.distance.toFixed(1)} km from ATLAS
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            
            {/* ATLAS marker */}
            <CircleMarker
              center={[46.2333, 6.0557]}
              radius={8}
              fillColor="#e74c3c"
              color="#c0392b"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">ATLAS Detector</div>
                  <div className="text-gray-600 text-xs">CERN, Geneva</div>
                </div>
              </Popup>
            </CircleMarker>
          </MapContainer>
        </Card>

        {/* Agent Response Banner */}
        {agentResponse && currentPage === 'memberHeatmap' && (
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium text-sm text-blue-900">Agent Response</div>
                <div className="text-sm text-blue-700 mt-1">{agentResponse}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Filter:</span>
          <button
            onClick={() => setFilterRegion('all')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              filterRegion === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Members
          </button>
          <button
            onClick={() => setFilterRegion('nearby')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              filterRegion === 'nearby' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Near ATLAS (&lt;50km)
          </button>
          {/* Angular filter button - only visible after agent interaction */}
          {memberHeatmapState.filterApplied && (
            <button
              onClick={() => setFilterRegion('angular')}
              className={`px-4 py-2 rounded text-sm transition-colors animate-fade-in ${
                filterRegion === 'angular' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Angular Sector (90°-120°)
            </button>
          )}
        </div>

        {/* Member List */}
        <Card>
          <h3 className="font-medium mb-4">
            {filterRegion === 'nearby' 
              ? 'Members Near ATLAS Detector' 
              : filterRegion === 'angular'
              ? 'Members in Angular Sector (90°-120° from CERN)'
              : 'All Members'} 
            <span className="text-sm text-gray-500 ml-2">({displayMembers.length})</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {displayMembers.slice(0, 20).map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-4 border border-gray-200 rounded hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{member.name}</div>
                    {member.institution && (
                      <div className="text-sm text-gray-600">{member.institution}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Lat: {member.lat.toFixed(4)}°, Lon: {member.lon.toFixed(4)}°
                      {member.distance !== undefined && ` • ${member.distance.toFixed(1)}km from ATLAS`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="text-gray-600">Storage:</span> {member.storage_tb} TB
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Credits:</span> {member.credits.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {displayMembers.length > 20 && (
              <div className="text-center text-sm text-gray-500 py-2">
                Showing first 20 of {displayMembers.length} members
              </div>
            )}
          </div>
        </Card>

        {/* Phone Camera Detector Proposal - Only visible when agent triggers it */}
        {memberHeatmapState.proposalVisible && (
          <Card className="border-l-4 border-blue-500 animate-fade-in">
            <h3 className="text-xl font-light mb-4">Maja's Idea: Phone Camera Detector Network</h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              What if we could use the smartphone cameras of nearby members as a distributed detector 
              array? Members already run simulations overnight—why not face their cameras toward 
              ATLAS and use the silicon sensors for data collection?
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-sm">Advantages</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>No dedicated detector construction needed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Distributed array similar to optimized CCD design</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Commercial sensors (smartphone cameras)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Can be deployed for weeks-long campaigns</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-sm">Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{nearbyMembers.length} members within 50km of ATLAS</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Credit incentive for participation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Overnight data collection (minimal disruption)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Tobias Golling sponsorship needed</span>
                  </li>
                </ul>
              </div>
            </div>

            <Card className="bg-blue-50 border border-blue-200">
              <div className="space-y-3">
                <div className="font-medium">Proposed Campaign</div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-2xl font-light">2-4 weeks</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light">{nearbyMembers.length} devices</div>
                    <div className="text-xs text-gray-600">Participants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light">+500 credits</div>
                    <div className="text-xs text-gray-600">Per participant</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic">
                  Sensitivity equivalent to one large multi-layer detector, but much cheaper and 
                  faster to deploy using existing infrastructure.
                </p>
              </div>
            </Card>
          </div>
        </Card>
        )}

        {/* Next Steps - Also only visible with proposal */}
        {memberHeatmapState.proposalVisible && (
          <Card>
            <h3 className="font-medium mb-4">Next Steps</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-700">Discuss proposal with Tobias at anomaly plenary</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-700">Request credit sponsorship for participant incentives</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-700">Develop mobile app for automated data collection</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">○</span>
              <span className="text-gray-700">Run sensitivity simulations with Geant5</span>
            </div>
          </div>
        </Card>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <Card className="max-w-lg w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-light">{selectedMember.name}</h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium">{selectedMember.name}</div>
                  {selectedMember.institution && (
                    <div className="text-xs text-gray-500">{selectedMember.institution}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-medium">
                    Lat: {selectedMember.lat.toFixed(4)}°, Lon: {selectedMember.lon.toFixed(4)}°
                  </div>
                  {selectedMember.distance !== undefined && (
                    <div className="text-xs text-gray-500">
                      {selectedMember.distance.toFixed(1)} km from ATLAS
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Storage</div>
                    <div className="font-medium">{selectedMember.storage_tb} TB</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Credits</div>
                    <div className="font-medium">{selectedMember.credits.toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Compute Hours Contributed</div>
                  <div className="font-medium">{selectedMember.compute_hours.toLocaleString()} hours</div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Compute Contribution</div>
                  <div className="text-xs text-gray-500">
                    Runs simulations overnight, contributing GPU-hours to HiLumi M.C. workloads
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Link to={ROUTES.DASHBOARD}>
            <button className="btn-secondary">← Back to Dashboard</button>
          </Link>
        </div>
      </div>
    </ScreenLayout>
  );
}


