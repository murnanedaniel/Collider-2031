import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/ui/Button';
import VideoModal from '@/components/ui/VideoModal';

// ============================================================================
// COMPREHENSIVE TIMELINE DATA - All events from timeline.md (~100 items)
// ============================================================================

const TRACKS = {
  main: { id: 'main', name: 'Main Timeline', color: '#1f2937', position: 0.5 },
  ml: { id: 'ml', name: 'Machine Learning', color: '#8b5cf6', position: 0.15 },
  simulation: { id: 'simulation', name: 'Simulation', color: '#06b6d4', position: 0.28 },
  data: { id: 'data', name: 'Data Infrastructure', color: '#10b981', position: 0.38 },
  computing: { id: 'computing', name: 'Computing', color: '#f59e0b', position: 0.62 },
  organization: { id: 'organization', name: 'Organization', color: '#ec4899', position: 0.72 },
  physics: { id: 'physics', name: 'Physics Results', color: '#ef4444', position: 0.85 },
  characters: { id: 'characters', name: 'Characters', color: '#3b82f6', position: 0.95 },
};

// When does each track START (fork from main) and END (merge back or fade)
const TRACK_LIFESPANS = {
  main: { start: 2025, end: 2034 },
  ml: { start: 2025.8, end: 2034 },
  simulation: { start: 2025.9, end: 2034 },
  data: { start: 2026.5, end: 2034 },
  computing: { start: 2028.0, end: 2034 },
  organization: { start: 2027.2, end: 2034 },
  physics: { start: 2030.4, end: 2034 },
  characters: { start: 2025.7, end: 2034 },
};

// All events organized by track
const TIMELINE_EVENTS = [
  // ============= 2025 =============
  // Main Timeline
  { year: 2025, month: 10, track: 'main', title: 'LHC Run 3', description: 'LHC Run 3 in full swing at 13.6 TeV', importance: 'high' },
  { year: 2025, month: 10, track: 'main', title: 'GPT-4 Era', description: 'GPT-4 class models standard in research', importance: 'medium' },

  // ML Track
  { year: 2025, month: 11, track: 'ml', title: 'CERN ML Whitepaper', description: 'CERN publishes whitepaper on ML for trigger systems', importance: 'medium' },
  { year: 2025, month: 11, track: 'ml', title: 'Foundation Model Studies', description: 'First studies on scaling foundation models to billion-event datasets', importance: 'medium' },

  // Simulation
  { year: 2025, month: 12, track: 'simulation', title: 'FASER LLP Search', description: 'FASER continues searching for long-lived particles', importance: 'low' },

  // Characters
  { year: 2025, month: 10, track: 'characters', title: 'Marcus Reed', description: 'Dr. Marcus Reed moves to UW-Madison as Data Science Institute Director', importance: 'high' },

  // Computing
  { year: 2025, month: 11, track: 'computing', title: 'Blackwell B200', description: 'Nvidia Blackwell B200 clusters begin deployment at major labs', importance: 'low' },
  { year: 2025, month: 12, track: 'computing', title: 'Compute Bottlenecks', description: 'End-of-year funding discussions highlight compute bottlenecks', importance: 'low' },

  // ============= 2026 =============
  // Main Timeline
  { year: 2026, month: 1, track: 'main', title: '8th IML Workshop', description: 'Cross-detector foundation model training plans agreed upon at CERN', importance: 'medium' },
  { year: 2026, month: 7, track: 'main', title: 'LS3 Begins', description: 'LHC Run 3 ends, Long Shutdown 3 begins', importance: 'high' },

  // ML Track
  { year: 2026, month: 2, track: 'ml', title: 'Anthropic Science Models', description: 'Anthropic releases improved foundation models for scientific text', importance: 'low' },
  { year: 2026, month: 4, track: 'ml', title: 'ATLAS Higgs ML', description: 'First Run 3 analyses using foundation model architectures published', importance: 'medium' },
  { year: 2026, month: 10, track: 'ml', title: 'AI Scientists Emerge', description: 'Multiple AI scientist systems emerge (Polymathic AI 5B params)', importance: 'medium' },
  { year: 2026, month: 11, track: 'ml', title: 'Autoencoder Triggers', description: 'ATLAS and CMS expand autoencoder trigger usage', importance: 'medium' },

  // Simulation
  { year: 2026, month: 5, track: 'simulation', title: 'GPU Acceleration', description: 'Graph-based GPU accelerator achieves 15× speedup over Geant4', importance: 'high' },
  { year: 2026, month: 8, track: 'simulation', title: 'Hadronic Showers', description: 'GPU accelerator extended to hadronic showers (8× speedup)', importance: 'medium' },
  { year: 2026, month: 9, track: 'simulation', title: 'MODE Workshop', description: '5th MODE Workshop showcases first end-to-end differentiable detector optimization', importance: 'medium' },

  // Data
  { year: 2026, month: 9, track: 'data', title: 'Infrastructure Review', description: 'CERN computing center reports LS3 presents opportunity to redesign data infrastructure', importance: 'medium' },

  // Organization
  { year: 2026, month: 4, track: 'organization', title: 'EU RAISE Initiative', description: 'EU RAISE initiative expands with €50M funding call', importance: 'medium' },
  { year: 2026, month: 3, track: 'organization', title: 'Collaboration Silos', description: 'Belle II and LHCb publish competing analyses, highlighting collaboration silos', importance: 'low' },

  // Characters
  { year: 2026, month: 4, track: 'characters', title: 'Reed Keynote', description: 'Dr. Marcus Reed gives keynote at major ML conference on simulation-based inference', importance: 'medium' },
  { year: 2026, month: 6, track: 'characters', title: 'Reed TED Talk', description: 'Viral TED talk "The AI Revolution in Particle Physics" - 5M views', importance: 'high' },

  // Politics
  { year: 2026, month: 9, track: 'main', title: 'Swiss Policy Review', description: 'Swiss government announces review of public research data policies', importance: 'high' },

  // ============= 2027 =============
  // Main Timeline
  { year: 2027, month: 1, track: 'main', title: 'Swiss Parliament Debate', description: 'Swiss Parliament debates "Federal Data Transparency Act"', importance: 'high' },
  { year: 2027, month: 3, track: 'main', title: 'DATA MANDATE PASSES', description: 'Swiss Federal Data Transparency Act passes - all CERN data must be public by 2030', importance: 'critical' },
  { year: 2027, month: 4, track: 'main', title: 'CERN Emergency Meeting', description: 'Emergency CERN Council meeting on post-LS3 data architecture', importance: 'high' },

  // ML Track
  { year: 2027, month: 7, track: 'ml', title: 'Adversarial Unfolding', description: 'Dr. Sarah Chen publishes breakthrough "Adversarial Unfolding" at NeurIPS', importance: 'high' },

  // Data
  { year: 2027, month: 5, track: 'data', title: 'Science Data Commons', description: 'Google announces "Science Data Commons" - distributed storage pilot', importance: 'high' },
  { year: 2027, month: 11, track: 'data', title: 'Distributed Storage', description: 'Distributed storage prototype launched - volunteers contribute 5 PB', importance: 'medium' },

  // Organization
  { year: 2027, month: 6, track: 'organization', title: 'Joint ML Paper', description: 'First ATLAS-CMS joint ML paper published (controversial)', importance: 'medium' },
  { year: 2027, month: 8, track: 'organization', title: 'Metacollaboration Proposed', description: 'Community proposes "Metacollaboration" model to address data mandate', importance: 'high' },
  { year: 2027, month: 10, track: 'organization', title: 'HiLumi M.C. Meeting', description: 'First "HiLumi Metacollaboration" organizational meeting (200 attendees)', importance: 'high' },

  // Characters
  { year: 2027, month: 6, track: 'characters', title: 'Sarah Chen', description: 'Dr. Sarah Chen co-authors paper on adversarial unfolding techniques', importance: 'high' },

  // Hardware
  { year: 2027, month: 2, track: 'main', title: 'HL-LHC Drilling', description: 'LS3 progressing - vertical cores being drilled for HL-LHC galleries', importance: 'low' },
  { year: 2027, month: 9, track: 'main', title: 'HL-LHC Magnets', description: 'HL-LHC magnet installation begins in tunnel', importance: 'medium' },

  // ============= 2028 =============
  // Main Timeline
  { year: 2028, month: 4, track: 'main', title: 'LS3 Halfway', description: 'LS3 halfway point - HL-LHC installation on schedule', importance: 'medium' },

  // Simulation
  { year: 2028, month: 1, track: 'simulation', title: 'Geant5 Roadmap', description: 'Geant4 team announces Geant5 development roadmap (2029 target)', importance: 'high' },
  { year: 2028, month: 7, track: 'simulation', title: 'Differentiable Geant4', description: 'First successful differentiable Geant4 prototype (limited processes)', importance: 'high' },

  // ML Track
  { year: 2028, month: 2, track: 'ml', title: 'EventGPT', description: 'Foundation model for particle physics events ("EventGPT") paper on arXiv', importance: 'high' },
  { year: 2028, month: 5, track: 'ml', title: 'Foundation Space Debate', description: 'Three separate "foundation space" models published, community debates standards', importance: 'medium' },

  // Data
  { year: 2028, month: 8, track: 'data', title: '20 PB Distributed', description: 'Google distributed storage hits 20 PB milestone', importance: 'medium' },

  // Computing
  { year: 2028, month: 3, track: 'computing', title: 'Credit Economy Proposed', description: 'First "credit economy" proposal for compute sharing circulates', importance: 'high' },
  { year: 2028, month: 9, track: 'computing', title: 'Apex AI Datacenter', description: 'Apex AI announces 10 GW datacenter construction in southern France', importance: 'high' },
  { year: 2028, month: 10, track: 'computing', title: 'APEX PARTNERSHIP', description: 'Apex AI commits 1M GPU-hours/year to Higgs vacuum stability program', importance: 'critical' },

  // Organization
  { year: 2028, month: 11, track: 'organization', title: 'ColliderLab Demo', description: '"ColliderLab" platform prototype demonstrated at CERN', importance: 'high' },
  { year: 2028, month: 12, track: 'organization', title: 'First Bounty', description: 'First metacollaboration bounty posted (1,000 credits for calibration bug)', importance: 'medium' },

  // Characters
  { year: 2028, month: 6, track: 'characters', title: 'Viktor Novak', description: 'Dr. Viktor Novak takes Apex AI CEO out drinking in Geneva - changes everything', importance: 'critical' },

  // ============= 2029 =============
  // Main Timeline
  { year: 2029, month: 6, track: 'main', title: 'LS3 Final Phase', description: 'LS3 nearing completion - final HL-LHC component installations', importance: 'medium' },
  { year: 2029, month: 10, track: 'main', title: 'HL-LHC Commissioning', description: 'HL-LHC hardware commissioning begins', importance: 'high' },

  // Simulation
  { year: 2029, month: 1, track: 'simulation', title: 'Geant5 Alpha', description: 'Geant5 alpha release (GPU-native, 60% differentiable)', importance: 'high' },
  { year: 2029, month: 8, track: 'simulation', title: 'Geant5 Beta', description: 'Geant5 beta - 85% differentiable, 50× faster than Geant4', importance: 'high' },

  // ML Track
  { year: 2029, month: 3, track: 'ml', title: 'Foundation Space v1.0', description: 'Foundation Space v1.0 released (50,000 dimensions, 10¹¹ events)', importance: 'critical' },
  { year: 2029, month: 9, track: 'ml', title: 'FS Architecture Finalized', description: 'Foundation Space model architecture finalized for HL-LHC era', importance: 'medium' },

  // Computing
  { year: 2029, month: 2, track: 'computing', title: 'Credit Allocation', description: 'CERN computing switches to credit-based resource allocation', importance: 'high' },
  { year: 2029, month: 3, track: 'computing', title: 'Apex AI Live', description: 'Apex AI datacenter goes live - begins providing idle GPU capacity', importance: 'high' },

  // Data
  { year: 2029, month: 4, track: 'data', title: 'SiReAs Beta', description: 'SiReAs (Simulation, Reconstruction, Analysis as a Service) platform launches', importance: 'high' },

  // Organization
  { year: 2029, month: 5, track: 'organization', title: 'First Unaffiliated Student', description: 'First student without institutional affiliation joins metacollaboration', importance: 'medium' },
  { year: 2029, month: 7, track: 'organization', title: 'HiLumi M.C. Official', description: 'ATLAS and CMS officially restructure as "HiLumi Metacollaboration"', importance: 'critical' },
  { year: 2029, month: 11, track: 'organization', title: '10K Members', description: 'Credit economy reaches 10,000 active participants', importance: 'medium' },
  { year: 2029, month: 12, track: 'organization', title: 'AI-Designed Detector', description: 'First "detector designed by AI" proposal approved (small prototype)', importance: 'medium' },

  // ============= 2030 =============
  // Main Timeline
  { year: 2030, month: 1, track: 'main', title: 'Final Commissioning', description: 'Final HL-LHC commissioning tests', importance: 'high' },
  { year: 2030, month: 4, track: 'main', title: 'Phase-2 Complete', description: 'All experiments complete Phase-2 upgrades', importance: 'medium' },
  { year: 2030, month: 5, track: 'main', title: 'HL-LHC Dry Runs', description: 'Final HL-LHC dry runs with beam', importance: 'medium' },
  { year: 2030, month: 6, track: 'main', title: 'HL-LHC FIRST BEAM', description: 'Run 4 begins! 14 TeV at unprecedented luminosity. 1 MHz L1 trigger. 1 PB/day.', importance: 'critical' },

  // Simulation
  { year: 2030, month: 2, track: 'simulation', title: 'Geant5 v1.0', description: 'Geant5 v1.0 release - fully differentiable, 100× faster than Geant4', importance: 'critical' },
  { year: 2030, month: 7, track: 'simulation', title: 'SM Surface Mapping', description: 'Standard Model surface mapping project launches on Apex AI GPUs', importance: 'high' },
  { year: 2030, month: 10, track: 'simulation', title: 'SM Surface v0.1', description: 'SM surface v0.1 released - covers 95% of phase space', importance: 'high' },

  // ML Track
  { year: 2030, month: 3, track: 'ml', title: 'Foundation Space 100K', description: 'Foundation Space upgraded to 100,000 dimensions for data deluge', importance: 'high' },
  { year: 2030, month: 6, track: 'ml', title: 'Real-time Embedding', description: 'Foundation Space embedding running in real-time at L1 trigger', importance: 'high' },

  // Physics
  { year: 2030, month: 6, track: 'physics', title: '140 Interactions', description: 'Pile-up much higher than Run 3 (140 interactions per crossing)', importance: 'medium' },
  { year: 2030, month: 8, track: 'physics', title: 'Cross-Detector Sync', description: 'Event-level detector synchronization demonstrated (ATLAS sees CMS muons)', importance: 'high' },
  { year: 2030, month: 9, track: 'physics', title: 'First HL-LHC Physics', description: 'First HL-LHC physics results: improved Higgs measurements', importance: 'high' },
  { year: 2030, month: 12, track: 'physics', title: '150 fb⁻¹ Collected', description: 'End of year: 150 fb⁻¹ collected, trilinear coupling 18% precision', importance: 'high' },
  { year: 2030, month: 12, track: 'physics', title: 'Higgs Stability Tracker', description: 'Real-time Higgs vacuum stability tracker goes live', importance: 'medium' },

  // Organization
  { year: 2030, month: 11, track: 'organization', title: 'First Interdisciplinary', description: 'First interdisciplinary researcher (bioinformatics) joins metacollaboration', importance: 'medium' },

  // ============= 2031 =============
  // Main Timeline
  { year: 2031, month: 1, track: 'main', title: 'Foundation Space v2.0', description: 'Foundation Space v2.0 with SM surface v1.0 - maps 99.97% of events', importance: 'high' },
  { year: 2031, month: 2, track: 'main', title: 'Anomaly Bubble', description: 'First major unexplained anomaly bubble - ~2000 events. Bounty: 15,000 credits.', importance: 'high' },

  // ML Track
  { year: 2031, month: 1, track: 'ml', title: 'Automated Anomaly Detection', description: 'Anomaly detection automated in trigger system', importance: 'high' },
  { year: 2031, month: 4, track: 'ml', title: 'LORA Fine-tuning', description: 'LORA fine-tuning enables rapid Foundation Space adaptations', importance: 'medium' },

  // Data
  { year: 2031, month: 6, track: 'data', title: '200 EB Distributed', description: '200 EB distributed storage operational - seamless infrastructure', importance: 'high' },

  // Computing
  { year: 2031, month: 6, track: 'computing', title: '3-min 100M Events', description: '3-minute turnaround for 100M event simulation', importance: 'high' },

  // Organization
  { year: 2031, month: 6, track: 'organization', title: '150K Members', description: 'HiLumi M.C.: 150,000 members globally, 40% interdisciplinary', importance: 'high' },

  // Physics
  { year: 2031, month: 6, track: 'physics', title: '250 fb⁻¹', description: 'Integrated luminosity: 250 fb⁻¹, 18M Higgs events (vs 3M Run 2+3)', importance: 'high' },
  { year: 2031, month: 6, track: 'physics', title: 'Di-Higgs Observed', description: '150 di-Higgs events observed (vs 0 in Run 3)', importance: 'high' },
  { year: 2031, month: 6, track: 'physics', title: 'Top Mass Precision', description: 'Top mass: 172.76 ± 0.06 GeV (factor 2 improvement)', importance: 'medium' },

  // Characters - Maja's Story
  { year: 2031, month: 3, track: 'characters', title: 'Maja Joins', description: 'Climate scientist Maja Andersen (ETH Zürich Masters) joins HiLumi M.C.', importance: 'high' },
  { year: 2031, month: 3, track: 'characters', title: 'Diurnal Pattern', description: 'Maja notices diurnal pattern in anomaly cluster', importance: 'medium' },
  { year: 2031, month: 5, track: 'characters', title: 'Solar Hypothesis', description: 'Maja develops solar correlation hypothesis', importance: 'high' },
  { year: 2031, month: 6, track: 'characters', title: 'THE DISCOVERY', description: 'June 14: Major solar flare. Maja runs 100M simulation. Perfect correlation confirmed!', importance: 'critical' },
  { year: 2031, month: 6, track: 'characters', title: 'Standing Ovation', description: 'Maja presents at anomaly plenary - standing ovation', importance: 'high' },
  { year: 2031, month: 6, track: 'characters', title: 'Solar Calibration', description: 'Solar correlation integrated into standard Foundation Space calibrations', importance: 'high' },
  { year: 2031, month: 6, track: 'characters', title: 'Phone Detectors', description: 'Distributed phone detector network proposal gets credit sponsorship', importance: 'medium' },
];

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

const ANIMATION_CONFIG = {
  phases: {
    opening: { duration: 3000 },
    rewind: { duration: 2500 },
    forward: { duration: 55000 } // Longer for more events
  },
  minYear: 2025,
  maxYear: 2032,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const scrollToYear = (scroll) => {
  const { minYear, maxYear } = ANIMATION_CONFIG;
  return minYear + scroll * (maxYear - minYear);
};

const yearToScroll = (year, month = 0) => {
  const { minYear, maxYear } = ANIMATION_CONFIG;
  const yearWithMonth = year + (month / 12);
  return (yearWithMonth - minYear) / (maxYear - minYear);
};

const getEventState = (event, virtualScroll) => {
  const eventScroll = yearToScroll(event.year, event.month);
  const delta = virtualScroll - eventScroll;

  if (delta < -0.08) return 'hidden';
  else if (delta < -0.05) return 'entering';
  else if (delta < -0.02) return 'expanding';
  else if (delta < 0.02) return 'centered';
  else if (delta < 0.05) return 'collapsing';
  else if (delta < 0.08) return 'exiting';
  else return 'exited';
};

const isEventVisible = (event, virtualScroll) => {
  const eventScroll = yearToScroll(event.year, event.month);
  const delta = Math.abs(virtualScroll - eventScroll);
  return delta < 0.12;
};

const isTrackActive = (trackId, virtualScroll) => {
  const lifespan = TRACK_LIFESPANS[trackId];
  const currentYear = scrollToYear(virtualScroll);
  return currentYear >= lifespan.start && currentYear <= lifespan.end;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Landing() {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Animation state
  const [phase, setPhase] = useState('opening');
  const [virtualScroll, setVirtualScroll] = useState(1); // Start at 2031
  const [userScrollEnabled, setUserScrollEnabled] = useState(false);
  const [showCTAs, setShowCTAs] = useState(false);

  // Refs
  const animationStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('interactive');
      setVirtualScroll(1);
      setUserScrollEnabled(true);
      setShowCTAs(true);
    }
  }, [prefersReducedMotion]);

  // Main animation loop
  useEffect(() => {
    if (phase === 'interactive' || prefersReducedMotion) return;

    animationStartTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - animationStartTimeRef.current;

      if (phase === 'opening') {
        if (elapsed >= ANIMATION_CONFIG.phases.opening.duration) {
          setPhase('rewind');
          animationStartTimeRef.current = now;
        }
      }
      else if (phase === 'rewind') {
        const progress = Math.min(elapsed / ANIMATION_CONFIG.phases.rewind.duration, 1);
        const eased = easeInOut(progress);
        setVirtualScroll(1 - eased * 0.95); // Rewind to near 2025

        if (elapsed >= ANIMATION_CONFIG.phases.rewind.duration) {
          setPhase('forward');
          setShowCTAs(true);
          animationStartTimeRef.current = now;
        }
      }
      else if (phase === 'forward') {
        const progress = Math.min(elapsed / ANIMATION_CONFIG.phases.forward.duration, 1);
        const eased = easeInOut(progress);
        setVirtualScroll(0.05 + eased * 0.95);

        if (elapsed >= ANIMATION_CONFIG.phases.forward.duration) {
          setPhase('interactive');
          setUserScrollEnabled(true);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, prefersReducedMotion]);

  // User scroll handling
  useEffect(() => {
    if (!userScrollEnabled) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY / docHeight;
      setVirtualScroll(Math.max(0, Math.min(1, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userScrollEnabled]);

  const currentYear = scrollToYear(virtualScroll);
  const isRewinding = phase === 'rewind';

  // ============================================================================
  // RENDER: Opening Scene (2031 Present State) - LIGHT THEME
  // ============================================================================

  if (phase === 'opening') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white text-gray-900 z-50">
        <div className="max-w-5xl text-center space-y-8 p-8 animate-fade-in">
          <h1 className="text-8xl font-extralight tracking-tight mb-4 text-gray-800">2031</h1>
          <p className="text-2xl text-gray-500 font-light mb-12">The Present State</p>

          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-light text-gray-800">847</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">ATLAS Members</div>
              <div className="text-xs text-gray-400">(from 5,200)</div>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-light text-gray-800">150K</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">M.C. Members</div>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-light text-gray-800">100K</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Foundation Space Dims</div>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-light text-gray-800">200 EB</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Distributed</div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="font-medium text-green-600">Maja Andersen</span> discovers solar flare correlations
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="font-medium text-purple-600">Elena Kowalski</span> completes MACE prototype
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="font-medium text-blue-600">Erik Hansen</span> moved to quantitative finance
            </div>
          </div>

          <div className="text-sm text-gray-400 mt-8 animate-pulse">
            But how did we get here?
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: Timeline Animation - LIGHT THEME with FORKING TRACKS
  // ============================================================================

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* VCR Rewind Overlay - Lighter version */}
      {isRewinding && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)',
            }}
          />
          <div className="fixed top-8 left-8 text-gray-800 text-6xl font-extralight animate-pulse">
            ⏪ {Math.floor(currentYear)}
          </div>
        </div>
      )}

      {/* CTAs - Light glass effect */}
      {showCTAs && (
        <div className="fixed top-8 right-8 z-40 space-y-3 animate-fade-in">
          <Button
            onClick={() => setIsVideoOpen(true)}
            className="w-full backdrop-blur-sm bg-gray-100/90 hover:bg-gray-200/90 text-gray-800 border border-gray-300"
          >
            📹 Watch Video
          </Button>
          <Button
            onClick={() => window.open('https://github.com/murnanedaniel/Collider-2031', '_blank')}
            className="w-full backdrop-blur-sm bg-gray-100/90 hover:bg-gray-200/90 text-gray-800 border border-gray-300"
          >
            &lt;/&gt; GitHub
          </Button>
          <Button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full backdrop-blur-sm bg-gray-900 hover:bg-gray-800 text-white"
          >
            → Enter ColliderLab
          </Button>
        </div>
      )}

      {/* Year indicator - fixed at top */}
      <div className="fixed top-8 left-8 z-30">
        <div className="text-6xl font-extralight text-gray-300">
          {Math.floor(currentYear)}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Q{Math.ceil(((currentYear % 1) * 12) / 3) || 1}
        </div>
      </div>

      {/* Track labels - fixed on left */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 space-y-1">
        {Object.values(TRACKS).filter(t => t.id !== 'main').map(track => {
          const active = isTrackActive(track.id, virtualScroll);
          return (
            <div
              key={track.id}
              className="text-xs font-medium px-2 py-1 rounded transition-all duration-500"
              style={{
                color: active ? track.color : '#d1d5db',
                backgroundColor: active ? `${track.color}10` : 'transparent',
                opacity: active ? 1 : 0.4,
              }}
            >
              {track.name}
            </div>
          );
        })}
      </div>

      {/* Timeline Container */}
      <div className="relative w-full" style={{ height: userScrollEnabled ? '500vh' : '100vh' }}>
        {/* SVG Track Lines - Dynamic forking/merging */}
        <svg className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {Object.values(TRACKS).map(track => {
            const active = isTrackActive(track.id, virtualScroll);
            const lifespan = TRACK_LIFESPANS[track.id];

            // Calculate where this track should be on screen
            const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
            const trackX = viewportWidth * track.position;
            const mainX = viewportWidth * 0.5;

            // Calculate vertical positions for fork/merge points
            const startScroll = yearToScroll(lifespan.start);
            const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

            // Fork point (where track branches from main)
            const forkY = Math.max(0, (startScroll - virtualScroll + 0.5) * viewportHeight);

            if (track.id === 'main') {
              // Main timeline - straight vertical line
              return (
                <line
                  key={track.id}
                  x1={trackX}
                  y1="0"
                  x2={trackX}
                  y2="100%"
                  stroke={track.color}
                  strokeWidth="2"
                  opacity={active ? 0.6 : 0.1}
                />
              );
            }

            // Other tracks - fork from main
            const opacity = active ? 0.4 : 0.05;

            return (
              <g key={track.id}>
                {/* Fork curve from main to track position */}
                <path
                  d={`M ${mainX} ${forkY} Q ${(mainX + trackX) / 2} ${forkY + 50} ${trackX} ${forkY + 100}`}
                  stroke={track.color}
                  strokeWidth="2"
                  fill="none"
                  opacity={opacity}
                  style={{
                    transition: 'opacity 0.5s ease-out'
                  }}
                />
                {/* Vertical line continuing down */}
                <line
                  x1={trackX}
                  y1={forkY + 100}
                  x2={trackX}
                  y2="100%"
                  stroke={track.color}
                  strokeWidth="2"
                  opacity={opacity}
                  style={{
                    transition: 'opacity 0.5s ease-out'
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Events */}
        {TIMELINE_EVENTS.filter(e => isEventVisible(e, virtualScroll)).map((event, idx) => {
          const state = getEventState(event, virtualScroll);
          const track = TRACKS[event.track];
          const eventScroll = yearToScroll(event.year, event.month);

          const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const trackX = viewportWidth * track.position;

          // Position based on virtual scroll
          const yProgress = (eventScroll - virtualScroll + 0.5);
          const yPos = yProgress * 100;

          // State-based styling
          const stateStyles = {
            hidden: { scale: 0, opacity: 0 },
            entering: { scale: 0.4, opacity: 0.3 },
            expanding: { scale: 0.7, opacity: 0.6 },
            centered: { scale: 1, opacity: 1 },
            collapsing: { scale: 0.7, opacity: 0.6 },
            exiting: { scale: 0.4, opacity: 0.3 },
            exited: { scale: 0, opacity: 0 },
          };

          const style = stateStyles[state];
          const showContent = ['expanding', 'centered', 'collapsing'].includes(state);
          const isCritical = event.importance === 'critical';
          const isHigh = event.importance === 'high';

          return (
            <div
              key={`${event.track}-${event.year}-${event.month}-${idx}`}
              className="fixed"
              style={{
                left: `${trackX}px`,
                top: `${yPos}vh`,
                transform: `translate(-50%, -50%) scale(${style.scale})`,
                opacity: style.opacity,
                transition: userScrollEnabled ? 'all 0.3s ease-out' : 'none',
                width: isCritical ? '280px' : isHigh ? '240px' : '200px',
                zIndex: state === 'centered' ? 100 : 10,
                willChange: 'transform, opacity'
              }}
            >
              {/* Event dot */}
              <div
                className="mx-auto"
                style={{
                  width: isCritical ? '20px' : isHigh ? '14px' : '10px',
                  height: isCritical ? '20px' : isHigh ? '14px' : '10px',
                  borderRadius: '50%',
                  backgroundColor: track.color,
                  boxShadow: state === 'centered' ? `0 0 20px ${track.color}` : 'none',
                  transition: 'box-shadow 0.3s ease-out'
                }}
              />

              {/* Event card content */}
              {showContent && (
                <div
                  className="mt-3 p-3 bg-white rounded-lg shadow-lg"
                  style={{
                    border: `2px solid ${track.color}`,
                    borderColor: isCritical ? track.color : `${track.color}80`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${track.color}20`, color: track.color }}
                    >
                      {track.name}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {event.year}.{String(event.month).padStart(2, '0')}
                    </div>
                  </div>
                  <h3
                    className="font-medium mb-1 text-gray-900"
                    style={{ fontSize: isCritical ? '14px' : '12px' }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://youtu.be/NB5Pq1obTlY"
      />
    </div>
  );
}
