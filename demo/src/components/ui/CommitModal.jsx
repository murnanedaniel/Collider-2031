import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';

// Generic git/Foundation-Space commit modal, generalized from the inline modal
// in FoundationSpace.jsx. Used by Elena's Foundation Space commit (and reusable
// when harmonizing Maja later).
export default function CommitModal({
  isOpen,
  onClose,
  title = 'Commit',
  subtitle = '',
  placeholder = 'Describe your changes',
  changes = [],
  footerNote = '',
  successTitle = '🎉 Committed',
  successMessage = '',
  successLines = [],
  onCommitted,
}) {
  const [commitMessage, setCommitMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const colorFor = (op) =>
    op === '+' ? 'text-green-700' : op === 'M' ? 'text-blue-700' : 'text-gray-600';

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    setSuccess(true);
    if (onCommitted) onCommitted(commitMessage);
    setTimeout(() => {
      setSuccess(false);
      setCommitMessage('');
      onClose();
    }, 3200);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !success && onClose()}>
      <div className="space-y-6">
        {!success ? (
          <>
            <div>
              <h2 className="text-2xl font-light mb-2">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Commit Message</label>
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                rows={4}
              />
            </div>

            {changes.length > 0 && (
              <Card className="bg-gray-50">
                <div className="space-y-1 text-sm font-mono">
                  <div className="text-gray-600">Changes to be committed:</div>
                  {changes.map((c, i) => (
                    <div key={i} className={colorFor(c.op)}>
                      {c.op} {c.text}
                    </div>
                  ))}
                  {footerNote && <div className="text-gray-600 mt-2">{footerNote}</div>}
                </div>
              </Card>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCommit}
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
            <h2 className="text-2xl font-light mb-3">{successTitle}</h2>
            {successMessage && <p className="text-lg text-gray-700 mb-2">{successMessage}</p>}
            {successLines.length > 0 && (
              <Card className="bg-gray-50 text-left mt-4">
                <div className="space-y-1 text-sm font-mono">
                  {successLines.map((line, i) => (
                    <div key={i} className="text-gray-600">{line}</div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
