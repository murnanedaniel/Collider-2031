import React, { createContext, useContext, useState } from 'react';
import { CHARACTERS } from '@/utils/constants';

const AgentContext = createContext();

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}

export function AgentProvider({ children }) {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);

  // ---- Active character + per-character world-clock (independent eras) ----
  const [activeCharacter, setActiveCharacter] = useState('maja');
  // Map of characterId -> current year. Defaults to the character's startYear.
  const [characterEra, setCharacterEra] = useState({});

  // Enter a character: make them active and reset their clock to their start year.
  const enterCharacter = (id) => {
    if (!CHARACTERS[id]) return;
    setActiveCharacter(id);
    setCharacterEra((prev) => ({ ...prev, [id]: CHARACTERS[id].startYear }));
  };

  // Advance (or set) a character's world-clock — called when work is published.
  const advanceEra = (id, year) => {
    setCharacterEra((prev) => ({ ...prev, [id]: year }));
  };

  const activeInfo = CHARACTERS[activeCharacter] ?? CHARACTERS.maja;
  const currentEra = characterEra[activeCharacter] ?? activeInfo.startYear;

  // Page-specific state
  const [memberHeatmapState, setMemberHeatmapState] = useState({
    filterApplied: false,
    proposalVisible: false,
  });
  
  const [foundationSpaceState, setFoundationSpaceState] = useState({
    simulationCompleted: false,
    simulatedPointsVisible: false,
    calibrated: false,
    showSolarFlareModal: false,
  });

  const openAgent = (page) => {
    setCurrentPage(page);
    setIsAgentOpen(true);
  };

  const closeAgent = () => {
    setIsAgentOpen(false);
    setAgentResponse(null);
  };

  const handleAgentSubmit = (query, page) => {
    // Route to appropriate handler based on page
    if (page === 'memberHeatmap') {
      handleMemberHeatmapAgent(query);
    } else if (page === 'foundationSpace') {
      handleFoundationSpaceAgent(query);
    }
  };

  const handleMemberHeatmapAgent = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if it's the angular filter query (more flexible matching)
    const isFilterQuery = lowerQuery.includes('filter') || lowerQuery.includes('show') || lowerQuery.includes('find');
    const hasAngleReference = lowerQuery.includes('theta') || lowerQuery.includes('beam') || 
                              lowerQuery.includes('90') || lowerQuery.includes('120') || 
                              lowerQuery.includes('angle') || lowerQuery.includes('sector');
    
    if (isFilterQuery && hasAngleReference) {
      setMemberHeatmapState(prev => ({
        ...prev,
        filterApplied: true,
        proposalVisible: false,
      }));
      setAgentResponse('Filtering to angular sector 90°-120° from CERN center.');
    }
    // Check if it's the camera/phone detector proposal
    else if (lowerQuery.includes('camera') || lowerQuery.includes('phone') || 
             lowerQuery.includes('detector') || lowerQuery.includes('smartphone') ||
             lowerQuery.includes('proposal') || lowerQuery.includes('idea')) {
      setMemberHeatmapState(prev => ({
        ...prev,
        proposalVisible: true,
      }));
      setAgentResponse('Analyzing phone camera detector feasibility. Proposal details updated below.');
    }
    else {
      setAgentResponse('I understand you want help, but I need more specific instructions. Try asking to filter by angular sector or show the camera detector proposal.');
    }
    
    closeAgent();
  };  const handleFoundationSpaceAgent = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if asking about solar flares
    if (lowerQuery.includes('solar flare') || lowerQuery.includes('flare') || 
        (lowerQuery.includes('solar') && (lowerQuery.includes('event') || lowerQuery.includes('data')))) {
      setFoundationSpaceState(prev => ({
        ...prev,
        showSolarFlareModal: true,
      }));
      setAgentResponse('Found matching solar flare event. Opening details...');
    }
    // Check if it's the solar simulation request
    else if (lowerQuery.includes('solar') || lowerQuery.includes('solaris')) {
      setFoundationSpaceState(prev => ({
        ...prev,
        // Will be updated when simulation completes
      }));
      setAgentResponse('Adding solar simulation modules to pipeline...');
    }
    else {
      setAgentResponse('Processing request...');
    }
    
    closeAgent();
  };

  const clearAgentResponse = () => {
    setAgentResponse(null);
  };

  const resetAllState = () => {
    setIsAgentOpen(false);
    setCurrentPage(null);
    setAgentResponse(null);
    setMemberHeatmapState({
      filterApplied: false,
      proposalVisible: false,
    });
    setFoundationSpaceState({
      simulationCompleted: false,
      simulatedPointsVisible: false,
      calibrated: false,
      showSolarFlareModal: false,
    });
    setActiveCharacter('maja');
    setCharacterEra({});
  };

  const value = {
    // Agent modal state
    isAgentOpen,
    currentPage,
    agentResponse,
    openAgent,
    closeAgent,
    handleAgentSubmit,
    clearAgentResponse,
    resetAllState,

    // Active character + per-character world-clock
    activeCharacter,
    setActiveCharacter,
    enterCharacter,
    activeInfo,
    currentEra,
    advanceEra,

    // Page-specific states
    memberHeatmapState,
    setMemberHeatmapState,
    foundationSpaceState,
    setFoundationSpaceState,
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}
