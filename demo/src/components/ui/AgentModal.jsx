import React, { useState } from 'react';
import Modal from './Modal';

export default function AgentModal({ isOpen, onClose, onSubmit, placeholder = "Ask the agent..." }) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Call the submission handler
    onSubmit(query);
    
    // Clear and close
    setIsProcessing(false);
    setQuery('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-light mb-2">ColliderLab AI Agent</h2>
          <p className="text-sm text-gray-500">
            Ask the agent to help with analysis, filtering, or data exploration
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            What would you like to do?
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            rows={4}
            disabled={isProcessing}
          />
          <div className="text-xs text-gray-400 mt-2">
            Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to submit
          </div>
        </div>

        {isProcessing && (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              <span className="text-sm text-gray-600">Processing request...</span>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!query.trim() || isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
