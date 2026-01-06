import React from 'react';

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) return null;

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Dark backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-90 transition-opacity z-[9998]"
          onClick={onClose}
        />

        {/* Video container */}
        <div className="relative w-full max-w-6xl z-[10000]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Responsive 16:9 video container */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Collider 2031 Video Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
