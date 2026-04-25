import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

// ============================================================================
// SIMPLIFIED PROTOTYPE - Focus on Core Visualization Behavior
// ============================================================================

// Branch definitions - when each branch forks from center
const BRANCHES = {
  center: { id: 'center', name: 'Main Timeline', color: '#1f2937', forkYear: null, xOffset: 0 },
  erik: { id: 'erik', name: 'Erik', color: '#f59e0b', forkYear: 2028, xOffset: -0.25 },
  sofia: { id: 'sofia', name: 'Sofia', color: '#8b5cf6', forkYear: 2029, xOffset: -0.15 },
  elena: { id: 'elena', name: 'Elena', color: '#10b981', forkYear: 2029, xOffset: 0.15 },
  hllhc: { id: 'hllhc', name: 'HL-LHC', color: '#ef4444', forkYear: 2030, xOffset: 0.25 },
};

// Simplified event list - just enough to demonstrate the viz
const TIMELINE_EVENTS = [
  // 2027 - Main events only
  { year: 2027, month: 1, branch: 'center', title: 'Swiss Parliament Debate', description: 'Debate on Federal Data Transparency Act begins' },
  { year: 2027, month: 3, branch: 'center', title: 'DATA MANDATE PASSES', description: 'All CERN data must be public by 2030', importance: 'critical' },
  { year: 2027, month: 6, branch: 'center', title: 'Emergency CERN Meeting', description: 'Council meets on post-LS3 data architecture' },

  // 2028 - Erik branches off
  { year: 2028, month: 1, branch: 'center', title: 'LS3 Halfway Point', description: 'HL-LHC installation on schedule' },
  { year: 2028, month: 4, branch: 'erik', title: 'Erik Starts PhD', description: 'Begins traditional dijet analysis at ATLAS', importance: 'high' },
  { year: 2028, month: 6, branch: 'center', title: 'Viktor Meets Apex CEO', description: 'A meeting in Geneva changes everything', importance: 'high' },
  { year: 2028, month: 9, branch: 'erik', title: 'Erik: Year 1 Review', description: 'Managing Scout/Skeptic pipeline, feeling productive but detached' },
  { year: 2028, month: 11, branch: 'center', title: 'ColliderLab Demo', description: 'Platform prototype shown at CERN' },

  // 2029 - Sofia & Elena branch off
  { year: 2029, month: 2, branch: 'sofia', title: 'Sofia Joins', description: 'Starts PhD in detector validation', importance: 'high' },
  { year: 2029, month: 3, branch: 'elena', title: 'Elena Joins', description: 'Begins MACE theory & design phase', importance: 'high' },
  { year: 2029, month: 5, branch: 'center', title: 'Foundation Space v1.0', description: '50,000 dimensions, 10¹¹ events', importance: 'critical' },
  { year: 2029, month: 6, branch: 'erik', title: 'Erik: Agents Improve', description: 'Self-critique capability emerges. Erik\'s value-add shrinks.' },
  { year: 2029, month: 7, branch: 'center', title: 'HiLumi M.C. Official', description: 'ATLAS and CMS restructure', importance: 'critical' },
  { year: 2029, month: 9, branch: 'sofia', title: 'Sofia: ITk Anomaly', description: 'Catches calibration drift that agents missed' },
  { year: 2029, month: 10, branch: 'elena', title: 'Elena: TDR Complete', description: 'Technical Design Report approved' },

  // 2030 - HL-LHC branches off
  { year: 2030, month: 2, branch: 'erik', title: 'Erik: Defense', description: '"What did YOU contribute?" He can\'t answer.', importance: 'high' },
  { year: 2030, month: 3, branch: 'erik', title: 'Erik Leaves Physics', description: 'Takes job in quantitative finance' },
  { year: 2030, month: 5, branch: 'hllhc', title: 'HL-LHC Dry Runs', description: 'Final beam tests before physics' },
  { year: 2030, month: 6, branch: 'hllhc', title: 'HL-LHC FIRST BEAM', description: '14 TeV at unprecedented luminosity!', importance: 'critical' },
  { year: 2030, month: 7, branch: 'elena', title: 'Elena: Construction', description: 'Building the MACE apparatus' },
  { year: 2030, month: 8, branch: 'sofia', title: 'Sofia: Thesis', description: '"Validation of Track Reconstruction for HL-LHC"' },
  { year: 2030, month: 12, branch: 'hllhc', title: '150 fb⁻¹ Collected', description: 'Trilinear coupling at 18% precision' },

  // 2031 - Convergence
  { year: 2031, month: 1, branch: 'center', title: 'Foundation Space v2.0', description: 'Maps 99.97% of events', importance: 'high' },
  { year: 2031, month: 3, branch: 'center', title: 'Maja Joins', description: 'Climate scientist enters HiLumi M.C.', importance: 'high' },
  { year: 2031, month: 6, branch: 'center', title: 'THE DISCOVERY', description: 'Solar flare correlation confirmed!', importance: 'critical' },
  { year: 2031, month: 6, branch: 'elena', title: 'Elena: Physics Run', description: 'MACE taking data' },
  { year: 2031, month: 6, branch: 'hllhc', title: '18M Higgs Events', description: 'vs 3M in all of Run 2+3' },
];

// Animation config
const CONFIG = {
  minYear: 2027,
  maxYear: 2031.5,
  phases: {
    opening: 2500,
    rewind: 2000,
    forward: 40000,
  }
};

const yearToProgress = (year) => (year - CONFIG.minYear) / (CONFIG.maxYear - CONFIG.minYear);
const progressToYear = (progress) => CONFIG.minYear + progress * (CONFIG.maxYear - CONFIG.minYear);

export default function TimelinePrototype() {
  const navigate = useNavigate();

  // Animation state
  const [phase, setPhase] = useState('opening');
  const [progress, setProgress] = useState(1); // 0-1, maps to year range
  const [userControlled, setUserControlled] = useState(false);
  const [showCTAs, setShowCTAs] = useState(false);

  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Skip animation for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('interactive');
      setProgress(1);
      setUserControlled(true);
      setShowCTAs(true);
    }
  }, [prefersReducedMotion]);

  // Main animation loop
  useEffect(() => {
    if (phase === 'interactive' || prefersReducedMotion) return;

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;

      if (phase === 'opening') {
        if (elapsed >= CONFIG.phases.opening) {
          setPhase('rewind');
          startTimeRef.current = Date.now();
        }
      } else if (phase === 'rewind') {
        const t = Math.min(elapsed / CONFIG.phases.rewind, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setProgress(1 - eased);

        if (elapsed >= CONFIG.phases.rewind) {
          setPhase('forward');
          setShowCTAs(true);
          startTimeRef.current = Date.now();
        }
      } else if (phase === 'forward') {
        const t = Math.min(elapsed / CONFIG.phases.forward, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setProgress(eased);

        if (elapsed >= CONFIG.phases.forward) {
          setPhase('interactive');
          setUserControlled(true);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [phase, prefersReducedMotion]);

  // User scroll control
  useEffect(() => {
    if (!userControlled) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setProgress(p => Math.max(0, Math.min(1, p + e.deltaY * 0.0005)));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [userControlled]);

  const currentYear = progressToYear(progress);
  const isRewinding = phase === 'rewind';

  // Calculate which event is "active" (closest to center)
  const getActiveEvent = () => {
    let closest = null;
    let closestDist = Infinity;

    for (const event of TIMELINE_EVENTS) {
      const eventYear = event.year + event.month / 12;
      const dist = Math.abs(eventYear - currentYear);
      if (dist < closestDist && dist < 0.3) {
        closest = event;
        closestDist = dist;
      }
    }
    return closest;
  };

  const activeEvent = getActiveEvent();

  // Opening phase - just show 2031
  if (phase === 'opening') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center animate-fade-in">
          <h1 className="text-9xl font-extralight text-gray-800 mb-4">2031</h1>
          <p className="text-xl text-gray-400">The Future of Physics</p>
          <p className="text-sm text-gray-300 mt-8 animate-pulse">
            How did we get here?
          </p>
        </div>
        <Link
          to="/"
          className="fixed top-4 left-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ← Back to main
        </Link>
      </div>
    );
  }

  // Calculate branch positions (returns percentage 0-100)
  const getBranchX = (branch, year) => {
    const b = BRANCHES[branch];
    if (!b.forkYear || year < b.forkYear) return 50; // Center

    // Animate the fork over 0.5 years
    const forkProgress = Math.min((year - b.forkYear) / 0.5, 1);
    const eased = forkProgress * forkProgress; // Ease-in
    // Use 40 spread to match SVG (keeps branches more centered)
    return 50 + b.xOffset * 40 * eased;
  };

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Back link */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 text-sm text-gray-400 hover:text-gray-600"
      >
        ← Back to main
      </Link>

      {/* Rewind overlay */}
      {isRewinding && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="text-8xl font-extralight text-gray-300 animate-pulse">
            ⏪ {Math.floor(currentYear)}
          </div>
        </div>
      )}

      {/* CTAs */}
      {showCTAs && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <Button
            onClick={() => navigate('/login')}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
          >
            Enter ColliderLab →
          </Button>
        </div>
      )}

      {/* Year indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 text-center">
        <div className="text-6xl font-extralight text-gray-300">
          {Math.floor(currentYear)}
        </div>
      </div>

      {/* Branch labels - appear when branches fork */}
      <div className="fixed bottom-8 w-full flex justify-center gap-8 z-30">
        {Object.values(BRANCHES).filter(b => b.id !== 'center').map(branch => {
          const isActive = currentYear >= branch.forkYear;
          const x = getBranchX(branch.id, currentYear);

          return (
            <div
              key={branch.id}
              className="absolute transition-all duration-500"
              style={{
                left: `${x}%`,
                transform: 'translateX(-50%)',
                opacity: isActive ? 1 : 0,
              }}
            >
              <div
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${branch.color}15`,
                  color: branch.color,
                  border: `1px solid ${branch.color}40`,
                }}
              >
                {branch.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG for branch lines - uses viewBox for percentage-like behavior */}
      <svg
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 5 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Center line - always visible */}
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          stroke="#1f2937"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />

        {/* Branch lines - fork paths */}
        {Object.values(BRANCHES).filter(b => b.forkYear).map(branch => {
          const forkProgress = yearToProgress(branch.forkYear);
          const forkY = (1 - (forkProgress - progress + 0.5)) * 100;

          // Only show if we've passed the fork point
          if (currentYear < branch.forkYear - 0.2) return null;

          // Target X position (0-100 scale)
          const targetX = 50 + branch.xOffset * 40; // Reduced spread for better visibility

          return (
            <g key={branch.id}>
              {/* Fork curve using quadratic bezier */}
              <path
                d={`M 50 ${forkY} Q ${(50 + targetX) / 2} ${forkY + 8} ${targetX} ${forkY + 15}`}
                stroke={branch.color}
                strokeWidth="0.3"
                fill="none"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Continuing line down */}
              <line
                x1={targetX}
                y1={forkY + 15}
                x2={targetX}
                y2="100"
                stroke={branch.color}
                strokeWidth="0.3"
                opacity="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      {/* Events - ONE expanded at a time */}
      {TIMELINE_EVENTS.map((event, idx) => {
        const eventYear = event.year + event.month / 12;
        const eventProgress = yearToProgress(eventYear);

        // Position: viewport-relative
        const yProgress = (eventProgress - progress + 0.5);
        const yPos = yProgress * 100;

        // Only render if in viewport
        if (yPos < -10 || yPos > 110) return null;

        const branch = BRANCHES[event.branch];
        const xPos = getBranchX(event.branch, eventYear);

        const isActive = activeEvent === event;
        const isCritical = event.importance === 'critical';
        const isHigh = event.importance === 'high';

        // Distance from center determines size/opacity
        const distFromCenter = Math.abs(yPos - 50);
        const proximity = Math.max(0, 1 - distFromCenter / 40);

        return (
          <div
            key={idx}
            className="fixed transition-all duration-300"
            style={{
              left: `${xPos}%`,
              top: `${yPos}%`,
              transform: `translate(-50%, -50%) scale(${0.4 + proximity * 0.6})`,
              opacity: 0.3 + proximity * 0.7,
              zIndex: isActive ? 100 : Math.round(proximity * 50),
              willChange: 'transform, opacity, left, top',
            }}
          >
            {/* Event dot */}
            <div
              className="mx-auto mb-2"
              style={{
                width: isCritical ? '16px' : isHigh ? '12px' : '8px',
                height: isCritical ? '16px' : isHigh ? '12px' : '8px',
                borderRadius: '50%',
                backgroundColor: branch.color,
                boxShadow: isActive ? `0 0 20px ${branch.color}60` : 'none',
                transition: 'box-shadow 0.3s',
              }}
            />

            {/* Event card - only show for active event */}
            {isActive && (
              <div
                className="w-64 p-4 bg-white rounded-lg shadow-xl animate-fade-in"
                style={{
                  border: `2px solid ${branch.color}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${branch.color}15`, color: branch.color }}
                  >
                    {branch.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {event.year}.{String(event.month).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={`font-semibold text-gray-900 mb-1 ${isCritical ? 'text-lg' : ''}`}>
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {event.description}
                </p>
              </div>
            )}

            {/* Small label for non-active events */}
            {!isActive && proximity > 0.3 && (
              <div className="text-center mt-1">
                <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {event.title}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Scroll hint */}
      {userControlled && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 animate-bounce">
          Scroll to explore
        </div>
      )}

      {/* Phase indicator */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-300">
        Phase: {phase} | Year: {currentYear.toFixed(2)}
      </div>
    </div>
  );
}
