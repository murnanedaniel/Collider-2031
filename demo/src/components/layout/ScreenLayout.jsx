import React from 'react';
import { useLocation } from 'react-router-dom';
import FloatingAgentButton from '@/components/ui/FloatingAgentButton';
import AgentModal from '@/components/ui/AgentModal';
import { useAgent } from '@/contexts/AgentContext';

export default function ScreenLayout({ children, title, subtitle }) {
  const location = useLocation();
  const { isAgentOpen, currentPage, openAgent, closeAgent, handleAgentSubmit } = useAgent();
  
  // Map routes to page identifiers
  const getPageId = () => {
    const path = location.pathname;
    if (path.includes('/foundation')) return 'foundationSpace';
    if (path.includes('/members')) return 'memberHeatmap';
    if (path.includes('/analysis')) return 'analysis';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/calibration')) return 'calibration';
    if (path.includes('/solar')) return 'solar';
    return 'general';
  };

  const pageId = getPageId();

  return (
    <div className="screen-container">
      {title && (
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-lg">{subtitle}</p>
          )}
        </div>
      )}
      {children}
      
      {/* Global Agent Button */}
      <FloatingAgentButton onClick={() => openAgent(pageId)} />
      
      {/* Global Agent Modal */}
      <AgentModal
        isOpen={isAgentOpen && currentPage === pageId}
        onClose={closeAgent}
        onSubmit={(query) => handleAgentSubmit(query, pageId)}
        placeholder="Ask the ColliderLab AI agent anything..."
      />
    </div>
  );
}

