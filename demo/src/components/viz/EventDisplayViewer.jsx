import React, { useRef, useEffect, useState } from 'react';

export default function EventDisplayViewer({ event, colorMode = 'type', width = 600, height = 600 }) {
  const canvasRef = useRef(null);
  const [hoveredHit, setHoveredHit] = useState(null);

  useEffect(() => {
    if (!event || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Center of canvas
    const centerX = width / 2;
    const centerY = height / 2;

    // Scale factor to fit detector in canvas
    const scale = Math.min(width, height) / 600; // 250cm radius + margin

    // Convert detector coordinates to canvas coordinates
    const toCanvas = (x, y) => ({
      x: centerX + x * scale,
      y: centerY - y * scale // Flip y-axis
    });

    // Draw detector layers
    if (event.layer_radii) {
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      event.layer_radii.forEach(radius => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, 2 * Math.PI);
        ctx.stroke();
      });

      ctx.setLineDash([]);
    }

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Group hits by type
    const hitsByType = {
      tracker: [],
      calorimeter_shower_1: [],
      calorimeter_shower_2: [],
      solar_flare: []
    };

    event.hits.forEach(hit => {
      hitsByType[hit.type]?.push(hit);
    });

    // Color schemes
    const typeColors = {
      tracker: 'rgba(59, 130, 246, 0.3)', // blue
      calorimeter_shower_1: 'rgba(239, 68, 68, 0.6)', // red
      calorimeter_shower_2: 'rgba(249, 115, 22, 0.6)', // orange
      solar_flare: 'rgba(234, 179, 8, 0.8)' // yellow
    };

    const getAnomalyColor = (score) => {
      // Blue (low) to Red (high)
      const r = Math.floor(255 * score);
      const g = Math.floor(255 * (1 - Math.abs(score - 0.5) * 2));
      const b = Math.floor(255 * (1 - score));
      return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };

    // Draw hits
    if (colorMode === 'anomaly') {
      // Color by anomaly score
      event.hits.forEach(hit => {
        const pos = toCanvas(hit.x, hit.y);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = getAnomalyColor(hit.anomaly_score);
        ctx.fill();
      });
    } else {
      // All hits same color and size - anomaly is hidden!
      event.hits.forEach(hit => {
        const pos = toCanvas(hit.x, hit.y);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(31, 41, 55, 0.4)'; // Dark gray, all the same
        ctx.fill();
      });
    }

    // Draw legend
    if (colorMode === 'type') {
      const legendX = 20;
      const legendY = 20;

      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';

      // Single legend entry for all hits
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY + 7, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(31, 41, 55, 0.4)';
      ctx.fill();

      ctx.fillStyle = '#1f2937';
      ctx.fillText('All Hits', legendX + 15, legendY + 12);
    }

  }, [event, colorMode, width, height]);

  const handleMouseMove = (e) => {
    if (!event || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 600;

    // Find closest hit
    let closestHit = null;
    let minDist = 10; // pixels

    event.hits.forEach(hit => {
      const x = centerX + hit.x * scale;
      const y = centerY - hit.y * scale;
      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      
      if (dist < minDist) {
        minDist = dist;
        closestHit = hit;
      }
    });

    setHoveredHit(closestHit);
  };

  const handleMouseLeave = () => {
    setHoveredHit(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      />
      
      {hoveredHit && (
        <div className="absolute bottom-4 left-4 bg-white border border-gray-300 rounded shadow-lg p-3 text-xs">
          <div className="font-medium mb-1">Hit Information</div>
          <div className="space-y-1 text-gray-600">
            <div>Type: {hoveredHit.type.replace(/_/g, ' ')}</div>
            <div>Position: ({hoveredHit.x.toFixed(1)}, {hoveredHit.y.toFixed(1)}) cm</div>
            <div>Anomaly Score: {hoveredHit.anomaly_score.toFixed(3)}</div>
          </div>
        </div>
      )}

      {colorMode === 'anomaly' && (
        <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded shadow-sm p-2">
          <div className="text-xs font-medium mb-2">Anomaly Score</div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4" style={{ backgroundColor: 'rgb(0, 127, 255)' }}></div>
              <span className="text-xs">0.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4" style={{ backgroundColor: 'rgb(255, 127, 0)' }}></div>
              <span className="text-xs">0.5</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4" style={{ backgroundColor: 'rgb(255, 0, 0)' }}></div>
              <span className="text-xs">1.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
