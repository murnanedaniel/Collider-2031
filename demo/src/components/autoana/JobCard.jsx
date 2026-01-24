import React from 'react';

function badge(status) {
  const s = (status ?? '').toLowerCase();
  if (s === 'succeeded') return 'bg-green-50 text-green-700 border-green-200';
  if (s === 'running') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s === 'failed') return 'bg-red-50 text-red-700 border-red-200';
  if (s === 'queued') return 'bg-gray-50 text-gray-700 border-gray-200';
  return 'bg-white text-gray-700 border-gray-200';
}

export default function JobCard({ job, status, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded border-2 transition-all ${
        isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">{job.name}</div>
          <div className="text-xs text-gray-500 font-mono mt-1">{job.id}</div>
          <div className="text-xs text-gray-600 mt-2 line-clamp-2">
            Depends on: {(job.depends_on ?? []).length > 0 ? job.depends_on.join(', ') : '—'}
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs px-2 py-1 rounded border ${badge(status)}`}>{status}</span>
        </div>
      </div>
    </button>
  );
}

