import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommitModal from '@/components/ui/CommitModal';
import MaceApparatus3D from '@/components/viz/MaceApparatus3D';
import FoundationSpaceViewer from '@/components/viz/FoundationSpaceViewer';
import PublicationFlow from '@/screens/shared/PublicationFlow';
import { useAgent } from '@/contexts/AgentContext';
import { useData } from '@/hooks/useData';
import { CHARACTERS, ROUTES } from '@/utils/constants';

const PHASE_BY_ERA = { 2029: 1, 2030: 2, 2031: 3, 2032: 4 };
const PHASES = {
  1: { era: 2029, next: 2030, months: 12, name: 'Design', title: 'Design in Foundation Space' },
  2: { era: 2030, next: 2031, months: 14, name: 'Build', title: 'Build & Commission' },
  3: { era: 2031, next: 2032, months: 16, name: 'Run', title: 'Physics Run' },
  4: { era: 2032, next: null, months: 0, name: 'Commit', title: 'Unblind & Commit' },
};
const ARTIFACT = {
  1: { type: 'paper', id: 'arXiv:2029.10233', title: 'MACE: design of a tabletop millicharge search', summary: 'Design report for a tabletop search for millicharged particles, optimised against the dark-photon sector of Foundation Space.' },
  2: { type: 'paper', id: 'arXiv:2030.05519', title: 'First commissioning of the MACE accumulator', summary: 'First trapped ion and commissioning of the MACE apparatus.' },
  3: { type: 'paper', id: 'arXiv:2031.07744', title: 'MACE long-integration run', summary: 'A year of blind data with the MACE apparatus; systematic studies and unblinding plan.' },
};
const APPROVAL = { mode: 'human', approver: 'MACE collaboration · you', note: 'You and the collaboration reviewed and approved.' };

const GEOMETRIES = [
  { id: 'sphere', name: 'Spherical accumulator', radius: 6, scale: [1.2, 0.7, 1.2] },
  { id: 'cyl', name: 'Cylindrical shell', radius: 8, scale: [1.0, 1.4, 1.0] },
  { id: 'planar', name: 'Planar electrode array', radius: 9, scale: [1.6, 0.6, 1.2] },
  { id: 'opt', name: 'Topology-optimized shell', radius: 13, scale: [1.3, 1.1, 1.3] },
];

const PAPERS = [
  'Holdom (1986) — Two U(1)’s and ε charge shifts',
  'Berlin et al. (2025) — Millicharge accumulator concept',
  'Budker et al. (2022) — Ion traps for mCP detection',
  'Moore, Rider & Gratta (2014) — Levitated microspheres',
  'ArgoNeuT (2020) — LArTPC millicharge search',
  'FORMOSA (2025) — Forward scintillator search',
];

// Streaming "literature review" agent sidebar.
function LiteratureStream() {
  const [shown, setShown] = useState([]);
  const ref = useRef(null);
  useEffect(() => {
    let i = 0;
    ref.current = setInterval(() => {
      setShown((p) => (i < PAPERS.length ? [...p, PAPERS[i++]] : p));
      if (i >= PAPERS.length) { clearInterval(ref.current); ref.current = null; }
    }, 700);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, []);
  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Literature review · agent</div>
      <div className="px-4 py-3 space-y-2 max-h-56 overflow-y-auto text-sm">
        {shown.length === 0 && <div className="text-gray-400 text-xs">searching arXiv…</div>}
        {shown.map((p, i) => <div key={i} className="text-gray-700">• {p}</div>)}
      </div>
    </Card>
  );
}

// Foundation Space viewer wrapper — module-level so its identity is stable
// (defining it inside the screen would remount the Three.js scene every render).
// FoundationSpaceViewer is keyed by projectionMode so it only re-initialises
// when the projection changes; blob changes update in place.
function FSViewer({ loading, events, surfaces, projectionMode, constraintBlobs }) {
  return (
    <div className="h-[440px]">
      {loading ? (
        <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>
      ) : (
        <FoundationSpaceViewer
          key={projectionMode}
          events={events}
          surfaces={surfaces}
          timeOfDay={24}
          showSM={true}
          showProcesses={false}
          detectorFilter="all"
          showATLAS
          showCMS
          projectionMode={projectionMode}
          constraintBlobs={constraintBlobs}
        />
      )}
    </div>
  );
}

// "Take data for a year" progress widget.
function DataTaking({ onComplete }) {
  const [pct, setPct] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const start = () => {
    if (running || done) return;
    setRunning(true);
    let p = 0;
    ref.current = setInterval(() => {
      p += 4;
      setPct(Math.min(100, p));
      if (p >= 100) { clearInterval(ref.current); ref.current = null; setRunning(false); setDone(true); onComplete && onComplete(); }
    }, 120);
  };
  useEffect(() => () => { if (ref.current) clearInterval(ref.current); }, []);
  return (
    <Card>
      <h3 className="font-medium mb-3 text-sm">Data taking · 2031</h3>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-gray-500 mb-3">{Math.round(pct)}% of a year integrated · signal region blind</div>
      {!done ? (
        <button onClick={start} disabled={running} className="btn-primary w-full">{running ? 'Integrating…' : 'Take data for a year'}</button>
      ) : (
        <div className="text-sm text-green-700">A full year of blind data collected.</div>
      )}
    </Card>
  );
}

export default function ElenaFlow() {
  const elena = CHARACTERS.elena;
  const navigate = useNavigate();
  const { activeCharacter, enterCharacter, currentEra, advanceEra } = useAgent();
  const { events, surfaces, loading } = useData();

  const [stage, setStage] = useState('workspace'); // workspace | publishing
  const [phaseDone, setPhaseDone] = useState(false);
  // phase 1
  const [projection, setProjection] = useState('3d');
  const [geom, setGeom] = useState(null);
  // phase 4
  const [unblinded, setUnblinded] = useState(false);
  const [showCommit, setShowCommit] = useState(false);
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    if (activeCharacter !== 'elena') enterCharacter('elena');
    // Deep-link a phase from the URL: ?era=2029|2030|2031|2032.
    const p = new URLSearchParams(window.location.search);
    const e = parseInt(p.get('era'), 10);
    if ([2029, 2030, 2031, 2032].includes(e)) advanceEra('elena', e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setPhaseDone(false); setProjection('3d'); setGeom(null);
    setUnblinded(false); setShowCommit(false);
  }, [currentEra]);

  if (activeCharacter !== 'elena') return null;

  const phase = PHASE_BY_ERA[currentEra] ?? 1;
  const cfg = PHASES[phase];

  // Constraint blobs shown in the viewer.
  const designBlob = geom ? [{ position: [0, 0, 0], radius: geom.radius, color: 0x3b82f6, opacity: 0.3, scale: geom.scale }] : [];
  const exclusionBlob = unblinded ? [{ position: [0, 0, 0], radius: 5, color: 0x3b82f6, opacity: 0.45, scale: [1.2, 0.9, 1.2] }] : [];

  const finishPublish = () => {
    setStage('workspace');
    if (cfg.next) advanceEra('elena', cfg.next);
  };
  const returnToPresent = () => { enterCharacter('maja'); navigate(ROUTES.DASHBOARD); };

  return (
    <>
      <ScreenLayout title={`MACE · ${elena.name}`} subtitle={`${cfg.title} · ${currentEra}`}>
        {/* phase strip */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((p) => (
            <div key={p} className="flex-1">
              <div className={`h-1.5 rounded-full ${p < phase ? 'bg-blue-400' : p === phase ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`text-xs mt-1 ${p === phase ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{PHASES[p].name}</div>
            </div>
          ))}
        </div>

        <div className={`space-y-6 transition-opacity duration-1000 ${committed ? 'opacity-40' : ''}`}>
          {/* PHASE 1 — DESIGN IN FOUNDATION SPACE */}
          {phase === 1 && (
            <>
              <Card className="bg-gray-50">
                <p className="text-sm text-gray-700">
                  Your advisor suggests building your own experiment — a tabletop search for
                  millicharged particles from a dark-photon sector. Start in Foundation Space.
                </p>
              </Card>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">Foundation Space</h3>
                      <select
                        value={projection}
                        onChange={(e) => setProjection(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="3d">3D latent space</option>
                        <option value="dark_photon">Dark photon projection (2D)</option>
                      </select>
                    </div>
                    <FSViewer loading={loading} events={events} surfaces={surfaces} projectionMode={projection} constraintBlobs={designBlob} />
                    {projection === 'dark_photon' && (
                      <p className="text-xs text-gray-500 mt-2">
                        Flattened to the two dimensions most correlated with dark-photon searches —
                        most of this space is unexplored.
                      </p>
                    )}
                  </Card>
                </div>
                <div className="space-y-4">
                  <LiteratureStream />
                  <Card>
                    <h3 className="font-medium mb-3 text-sm">Detector geometry</h3>
                    <div className="space-y-2">
                      {GEOMETRIES.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => { setGeom(g); setProjection('dark_photon'); if (g.id === 'opt') setPhaseDone(true); }}
                          className={`w-full text-left px-3 py-2 rounded border text-sm ${geom?.id === g.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}`}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Each geometry reshapes the constrained region in the projection. The optimized
                      shell settles into a large sensitivity blob.
                    </p>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* PHASE 2 — BUILD: MACE versions */}
          {phase === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-medium mb-3 text-sm">MACE apparatus</h3>
                <div className="h-[320px]"><MaceApparatus3D /></div>
              </Card>
              <Card>
                <h3 className="font-medium mb-3 text-sm">3D-printed iterations</h3>
                <div className="space-y-2 text-sm">
                  {['v0.1 — first accumulator shell', 'v0.2 — HV feedthroughs', 'v0.3 — Paul trap integrated', 'v0.4 — laser cooling + optics'].map((v) => (
                    <div key={v} className="flex items-center gap-2"><span className="text-green-600">✓</span><span className="text-gray-700">{v}</span></div>
                  ))}
                </div>
                <button onClick={() => setPhaseDone(true)} className="btn-primary w-full mt-4">Commission apparatus</button>
                {phaseDone && <div className="text-sm text-green-700 mt-3">First trapped ion achieved.</div>}
              </Card>
            </div>
          )}

          {/* PHASE 3 — RUN */}
          {phase === 3 && <DataTaking onComplete={() => setPhaseDone(true)} />}

          {/* PHASE 4 — UNBLIND & COMMIT */}
          {phase === 4 && (
            <div className="space-y-6">
              <Card>
                <h3 className="font-medium mb-3 text-sm">Foundation Space · dark photon sector</h3>
                <FSViewer loading={loading} events={events} surfaces={surfaces} projectionMode="dark_photon" constraintBlobs={exclusionBlob} />
                {!unblinded ? (
                  <button onClick={() => { setUnblinded(true); setPhaseDone(true); }} className="btn-primary w-full mt-4">Unblind</button>
                ) : !committed ? (
                  <div className="mt-4 border-l-4 border-blue-500 pl-4">
                    <div className="font-medium">Consistent with background — a clean exclusion.</div>
                    <p className="text-sm text-gray-600">The excluded region extends well below previous experiments at low mass. Commit it to Foundation Space.</p>
                  </div>
                ) : null}
              </Card>
              {unblinded && !committed && (
                <div className="flex justify-end">
                  <button onClick={() => setShowCommit(true)} className="btn-primary">Commit to Foundation Space →</button>
                </div>
              )}
            </div>
          )}

          {phase < 4 && (
            <div className="flex justify-end pt-2">
              <button onClick={() => setStage('publishing')} disabled={!phaseDone} className="btn-primary">Finish {cfg.name} &amp; publish →</button>
            </div>
          )}
        </div>

        {committed && (
          <div className="mt-10 text-center space-y-4 animate-fade-in">
            <p className="text-gray-700 max-w-lg mx-auto">
              Your first commit to Foundation Space — a permanent exclusion every physicist can now
              build on, alongside ATLAS.
            </p>
            <button onClick={returnToPresent} className="btn-primary">Return to the present →</button>
          </div>
        )}
      </ScreenLayout>

      <PublicationFlow
        isOpen={stage === 'publishing'}
        character={elena}
        work={{ title: `Publish: ${cfg.title}`, summary: ARTIFACT[phase]?.summary }}
        approval={APPROVAL}
        artifact={ARTIFACT[phase]}
        monthsLater={cfg.months}
        nextEra={cfg.next}
        onComplete={finishPublish}
        onCancel={() => setStage('workspace')}
      />

      <CommitModal
        isOpen={showCommit}
        onClose={() => setShowCommit(false)}
        title="Commit to Foundation Space"
        subtitle="Add the MACE exclusion to the dark photon sector"
        placeholder="e.g., Add MACE millicharge exclusion"
        changes={[
          { op: '+', text: 'foundation_space/dark_photon/mace_2032.likelihood' },
          { op: 'M', text: 'foundation_space/dark_photon/combined_limits.json' },
        ]}
        footerNote="Integrated alongside ATLAS, milliQan, FORMOSA."
        successTitle="🎉 Result integrated"
        successMessage="Dark photon sector updated"
        successLines={['Your exclusion now appears in Foundation Space.', 'Your contribution is permanent.']}
        onCommitted={() => setCommitted(true)}
      />
    </>
  );
}
