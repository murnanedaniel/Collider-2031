import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ULTRA SIMPLE: One dot on a line. It moves down. At center, it branches right.

export default function BranchTest() {
  const [dotY, setDotY] = useState(0); // 0 = top, 100 = bottom

  // Move dot down
  useEffect(() => {
    const interval = setInterval(() => {
      setDotY(y => (y + 0.5) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Center of screen is 50%
  // Dot should be at x=50% until it reaches y=50%, then move to x=65%
  const centerX = 50;
  const branchX = 65;

  // Simple logic: before center, stay at center. After center, go to branch.
  // Smooth transition over 20% of screen height (from y=40 to y=60)
  let dotX = centerX;
  if (dotY > 40) {
    const progress = Math.min(1, (dotY - 40) / 20); // 0 at y=40, 1 at y=60
    dotX = centerX + (branchX - centerX) * progress;
  }

  return (
    <div className="fixed inset-0 bg-white">
      {/* Back link */}
      <Link to="/" className="fixed top-4 left-4 text-sm text-gray-400 hover:text-gray-600 z-50">
        ← Back
      </Link>

      {/* Debug info */}
      <div className="fixed top-4 right-4 text-sm text-gray-500 font-mono z-50">
        dotY: {dotY.toFixed(0)}% | dotX: {dotX.toFixed(0)}%
      </div>

      {/* Main vertical line */}
      <div
        className="fixed top-0 bottom-0 w-0.5 bg-gray-300"
        style={{ left: '50%' }}
      />

      {/* Branch line - appears after dot passes center */}
      {dotY > 50 && (
        <div
          className="fixed w-0.5 bg-orange-400"
          style={{
            left: '65%',
            top: '50%',
            bottom: 0,
          }}
        />
      )}

      {/* The dot */}
      <div
        className="fixed w-4 h-4 rounded-full bg-orange-500 -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
        style={{
          left: `${dotX}%`,
          top: `${dotY}%`,
        }}
      />

      {/* Center marker */}
      <div className="fixed left-0 right-0 h-px bg-gray-200" style={{ top: '50%' }} />
      <div className="fixed text-xs text-gray-400" style={{ top: '50%', left: '10px' }}>
        center (50%)
      </div>
    </div>
  );
}
