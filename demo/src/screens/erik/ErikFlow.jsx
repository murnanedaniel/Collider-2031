import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import CreditCounter from '@/components/ui/CreditCounter';
import WorkflowDAG from '@/components/autoana/WorkflowDAG';
import PublicationFlow from '@/screens/shared/PublicationFlow';
import Defense from '@/screens/erik/Defense';
import Epilogue from '@/screens/erik/Epilogue';
import HumanBlindingDoc from '@/screens/erik/HumanBlindingDoc';
import ErikHistogram from '@/screens/erik/ErikHistogram';
import { ERIK_DAG, ERIK_NODE_CONFIG, ERIK_NODE_PLOTS } from '@/screens/erik/erikWorkflow';
import { useAgent } from '@/contexts/AgentContext';
import { CHARACTERS, ROUTES } from '@/utils/constants';
import { formatNumber } from '@/utils/formatting';

// ---------------------------------------------------------------------------
// Per-era configuration. 2028 is the rich human-in-the-loop cycle; 2029/2030
// are the deprecated-but-functional era where agents run analyses autonomously.
// ---------------------------------------------------------------------------
const ERA = {
  2028: { next: 2029, months: 10, members: 5200, deprecated: false },
  2029: { next: 2030, months: 16, members: 3100, deprecated: true },
  2030: { next: 2031, months: 12, members: 1500, deprecated: true },
};

const TEMPLATES = [
  { id: 'dijet', title: 'Heavy resonance search (dijet)', tags: ['Run-3', 'Jets', 'BSM'] },
  { id: 'monojet', title: 'Mono-jet + MET', tags: ['Run-3', 'DM'] },
  { id: 'ttbar-res', title: 'tt̄ resonance', tags: ['Run-3', 'Top', 'BSM'] },
];

const ARTIFACT = {
  2028: { type: 'paper', id: 'arXiv:2028.11942', title: 'Search for heavy dijet resonances at √s = 14 TeV', summary: 'Search for heavy resonances decaying to two jets in 140 fb⁻¹ of pp collisions. No significant excess over the Standard Model background is observed; 95% CL exclusion limits are set.' },
  2029: { type: 'paper', id: 'arXiv:2029.04817', title: 'Updated dijet resonance search with autonomous systematics', summary: 'Updated search using the full Run-3 dataset with autonomously derived systematic uncertainties. No significant excess is observed.' },
  2030: { type: 'paper', id: 'arXiv:2030.00731', title: 'Dijet resonance search on the combined HL-LHC dataset', summary: 'Combined-dataset dijet resonance search. No significant excess is observed; limits improve on the previous result.' },
};

// 2028 the human signs off; 2029/2030 the analysis is published autonomously.
const APPROVAL = {
  2028: { mode: 'human', approver: 'You — supervisor sign-off', note: 'Review the systematic-uncertainty treatment and approve to publish.' },
  2029: { mode: 'agent', approver: 'AutoAna', note: 'The analysis ran, validated, and was approved autonomously.' },
  2030: { mode: 'agent', approver: 'AutoAna', note: 'The analysis ran, validated, and was approved autonomously.' },
};

const AGENTS = [
  { name: 'Scout', desc: 'Explores selection variations' },
  { name: 'Skeptic', desc: 'Flags systematic risks' },
  { name: 'Scribe', desc: 'Drafts analysis notes' },
];

const SELF_TALK = [
  'Scout: enumerating 240 selection variants…',
  'Skeptic: JES correlation in SR looks unstable — reverting',
  'Scout: ATLAS-X3 score > 0.88 improves S/√B by 6%',
  'Skeptic: tail overfits on the unblinded subset — tightening prior',
  'Scribe: drafting systematics section…',
  'Scout: background closure in sideband OK',
  'Skeptic: limit improves 8% vs. template',
  'Scribe: paper draft ready.',
];

// ---- Neural SBI training ticker (beat 6) ----------------------------------
function SbiTraining({ onComplete }) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [gpuHours, setGpuHours] = useState(0);
  const [unc, setUnc] = useState(18);
  const ref = useRef(null);

  const start = () => {
    if (running || done) return;
    setRunning(true);
    let step = 0;
    const steps = 40;
    ref.current = setInterval(() => {
      step++;
      setGpuHours(Math.round((step / steps) * 18400));
      setUnc(Number((18 - (step / steps) * 14).toFixed(1))); // 18% → 4%
      if (step >= steps) {
        clearInterval(ref.current);
        ref.current = null;
        setRunning(false);
        setDone(true);
        if (onComplete) onComplete();
      }
    }, 120);
  };

  useEffect(() => () => { if (ref.current) clearInterval(ref.current); }, []);

  return (
    <Card>
      <h3 className="font-medium mb-3 text-sm">Neural SBI training · unbinned fit</h3>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div className="bg-gray-50 rounded p-3">
          <div className="text-2xl font-light">{formatNumber(gpuHours)}</div>
          <div className="text-xs text-gray-600">GPU-hours</div>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <div className="text-2xl font-light">{unc}%</div>
          <div className="text-xs text-gray-600">μ uncertainty</div>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <div className="text-2xl font-light">{done ? 'drafted' : running ? 'training' : 'idle'}</div>
          <div className="text-xs text-gray-600">status</div>
        </div>
      </div>
      {!done ? (
        <button onClick={start} disabled={running} className="btn-primary w-full">
          {running ? 'Training (weeks compressed)…' : 'Draft analysis (train SBI)'}
        </button>
      ) : (
        <div className="text-sm text-green-700">Training converged · final plots and paper draft ready.</div>
      )}
    </Card>
  );
}

// ---- Autonomous run: rapidly-evolving DAG + streaming self-talk (beat 10) --
function AutoRun({ onComplete }) {
  const [statuses, setStatuses] = useState({});
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tickRef = useRef(null);
  const logRef = useRef(null);

  const start = () => {
    if (running || done) return;
    setRunning(true);
    setLogs([]);

    // Rapidly churn node statuses to look like exploration/self-critique.
    let t = 0;
    tickRef.current = setInterval(() => {
      t++;
      setStatuses(() => {
        const next = {};
        ERIK_DAG.forEach((n, i) => {
          const r = (t + i) % 4;
          next[n.id] = t > 22 ? 'succeeded' : r === 0 ? 'running' : r === 1 ? 'succeeded' : r === 2 ? 'queued' : 'running';
        });
        return next;
      });
      if (t >= 24) {
        clearInterval(tickRef.current);
        tickRef.current = null;
        setStatuses(Object.fromEntries(ERIK_DAG.map((n) => [n.id, 'succeeded'])));
        setRunning(false);
        setDone(true);
        if (onComplete) onComplete();
      }
    }, 220);

    // Stream the self-talk.
    let li = 0;
    logRef.current = setInterval(() => {
      setLogs((prev) => (li < SELF_TALK.length ? [...prev, SELF_TALK[li++]] : prev));
      if (li >= SELF_TALK.length) { clearInterval(logRef.current); logRef.current = null; }
    }, 650);
  };

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (logRef.current) clearInterval(logRef.current);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-3">
        <WorkflowDAG nodes={ERIK_DAG} statuses={statuses} />
        {!done && (
          <button onClick={start} disabled={running} className="btn-primary w-full">
            {running ? 'Running…' : 'Run analysis'}
          </button>
        )}
        {done && <div className="text-sm text-green-700 font-medium">Analysis complete · paper drafted.</div>}
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
          Assistant · agent self-talk
        </div>
        <div className="px-4 py-3 h-56 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-xs space-y-1">
          {logs.length === 0 && <div className="text-gray-500">awaiting run…</div>}
          {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </Card>
    </div>
  );
}

// ===========================================================================
export default function ErikFlow() {
  const erik = CHARACTERS.erik;
  const navigate = useNavigate();
  const { activeCharacter, enterCharacter, currentEra, advanceEra } = useAgent();

  const [stage, setStage] = useState('workspace'); // workspace | publishing | defense | epilogue
  const [showDoc, setShowDoc] = useState(false);

  // 2028 guided cycle state
  const [template, setTemplate] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [step, setStep] = useState(1);     // 1 build · 2 sanity · 3 iterate · 4 supervisor · 5 sbi · 6 ready
  const [metCut, setMetCut] = useState(200);
  const [chat, setChat] = useState([]);
  const [draft, setDraft] = useState('');
  const [fitIter, setFitIter] = useState(0); // iterate-to-fix
  const [sbiDone, setSbiDone] = useState(false);

  // deprecated-era run state
  const [autoDone, setAutoDone] = useState(false);

  useEffect(() => {
    if (activeCharacter !== 'erik') enterCharacter('erik');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset the per-cycle workspace on era change.
  useEffect(() => {
    setTemplate(null); setSelectedNode(null); setStep(1); setMetCut(200);
    setChat([]); setFitIter(0); setSbiDone(false); setAutoDone(false);
  }, [currentEra]);

  if (activeCharacter !== 'erik') return null;
  if (stage === 'defense') return <Defense onContinue={() => setStage('epilogue')} />;
  if (stage === 'epilogue') return <Epilogue onReturn={() => { enterCharacter('maja'); navigate(ROUTES.DASHBOARD); }} />;

  const era = ERA[currentEra] ?? ERA[2028];

  const sendChat = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setChat((p) => [...p, { role: 'user', text }]);
    const p = text.toLowerCase();
    if (p.includes('met') || p.includes('tighten') || p.includes('cut')) {
      setMetCut(250);
      setChat((prev) => [...prev, { role: 'assistant', text: 'Updated selection: MET cut → 250 GeV (reduces W+jets). Config refreshed.' }]);
    } else {
      setChat((prev) => [...prev, { role: 'assistant', text: 'Try: "tighten the MET cut", or click a DAG node to edit its config.' }]);
    }
  };

  const startPublish = () => setStage('publishing');
  const finishPublish = () => {
    if (currentEra >= 2030) { setStage('defense'); return; }
    advanceEra('erik', era.next);
    setStage('workspace');
  };

  // ---- DOC overlay (Human-blinding paper) ----
  if (showDoc) {
    return (
      <ScreenLayout title="Docs · Human-blinding">
        <button onClick={() => setShowDoc(false)} className="btn-secondary mb-6">← Back to AutoAna</button>
        <HumanBlindingDoc />
      </ScreenLayout>
    );
  }

  // ---- Selection config (YAML) with live MET cut for the selection node ----
  const nodeConfig = (id) => {
    if (id === 'selection') {
      return `cuts:\n  met_gev: ${metCut}\n  jet_pt_min_gev: 50\n  rapidity_max: 2.4\n  mjj_min_gev: 1500`;
    }
    return ERIK_NODE_CONFIG[id] ?? '# (no editable config)';
  };

  // Iterate-to-fix: chi2/ndf improves over 3 refits.
  const chi2 = [2.4, 1.7, 1.2, 0.98][Math.min(fitIter, 3)];

  return (
    <>
      <ScreenLayout title={`AutoAna · ${erik.name}`} subtitle={`Dijet resonance search · ${currentEra}`}>
        <div className="space-y-6">
          {/* Deprecation banner (inline; Erik-owned — does not touch shared DeprecatedBanner) */}
          {era.deprecated && (
            <Card className="border-l-4 border-yellow-500 bg-yellow-50">
              <div className="text-sm text-yellow-900 font-medium">AutoAna · deprecated ({currentEra})</div>
              <div className="text-sm text-yellow-800 mt-1">
                Human review is no longer part of standard analyses. AutoAna remains fully functional.
              </div>
              <button onClick={() => setShowDoc(true)} className="text-sm text-yellow-900 underline mt-2">
                Read: Human-in-the-loop bias in collider analyses (arXiv:2028.14792) →
              </button>
            </Card>
          )}

          {/* Era + collaboration size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Year</div>
              <div className="text-4xl font-light">{currentEra}</div>
            </Card>
            <Card className="md:col-span-2">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">ATLAS membership</div>
              <CreditCounter value={era.members} />
              {currentEra >= 2029 && (
                <div className="text-sm text-gray-500 mt-1">Down from 5,200 in 2028.</div>
              )}
            </Card>
          </div>

          {/* Agents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENTS.map((a) => (
              <Card key={a.name} className="p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Agent</div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600 mt-1">{a.desc}</div>
              </Card>
            ))}
          </div>

          {/* ============ DEPRECATED ERA (2029/2030): autonomous run ============ */}
          {era.deprecated ? (
            <>
              <AutoRun onComplete={() => setAutoDone(true)} />
              <div className="flex justify-end pt-2">
                <button onClick={startPublish} disabled={!autoDone} className="btn-primary">
                  Finish &amp; publish →
                </button>
              </div>
            </>
          ) : (
            /* ============ 2028: guided human-in-the-loop cycle ============ */
            <>
              {/* Beat 2 — template */}
              {!template ? (
                <Card>
                  <h3 className="font-medium mb-3 text-sm">Start from a template analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {TEMPLATES.map((t) => (
                      <button key={t.id} onClick={() => { setTemplate(t.id); setStep(1); }} className="text-left">
                        <Card className="h-full hover:shadow-md">
                          <div className="font-medium text-sm">{t.title}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {t.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded">{tag}</span>
                            ))}
                          </div>
                        </Card>
                      </button>
                    ))}
                  </div>
                </Card>
              ) : (
                <>
                  {/* Beat 2 — DAG builds; click node → YAML; chat to change cuts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2">
                      <WorkflowDAG nodes={ERIK_DAG} statuses={{}} selectedNodeId={selectedNode} onSelect={setSelectedNode} />
                    </div>
                    <div className="space-y-4">
                      <Card>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          {selectedNode ? `Config · ${selectedNode}` : 'Config'}
                        </div>
                        <pre className="bg-gray-900 text-gray-100 rounded p-3 text-xs whitespace-pre-wrap min-h-[88px]">
{selectedNode ? nodeConfig(selectedNode) : 'Click a DAG node to view/edit its config.'}
                        </pre>
                      </Card>
                      <Card className="p-0 overflow-hidden">
                        <div className="border-b border-gray-200 px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">chATLAS</div>
                        <div className="px-4 py-3 space-y-2 max-h-40 overflow-y-auto">
                          {chat.length === 0 && <div className="text-xs text-gray-400">Ask to change cuts, or click a node.</div>}
                          {chat.map((m, i) => (
                            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                              <span className={`inline-block text-xs rounded-lg px-2 py-1 border ${m.role === 'user' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200'}`}>{m.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 px-3 py-2 flex gap-2">
                          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }} className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" placeholder="tighten the MET cut" />
                          <button onClick={sendChat} className="btn-primary py-1 px-3 text-xs">Send</button>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Beat 3 — run on unblinded subset → sanity histograms */}
                  {step >= 2 && (
                    <Card>
                      <h3 className="font-medium mb-3 text-sm">Sanity check · unblinded subset</h3>
                      <ErikHistogram data={ERIK_NODE_PLOTS.selection.bins} xLabel={ERIK_NODE_PLOTS.selection.x_label} />
                      <div className="text-sm text-green-700 mt-2">Background closure OK on the unblinded subset.</div>
                    </Card>
                  )}
                  {step === 1 && (
                    <div className="flex justify-end">
                      <button onClick={() => setStep(2)} className="btn-primary">Run on unblinded subset →</button>
                    </div>
                  )}

                  {/* Beat 4 — iterate to fix a poorly-fit plot */}
                  {step >= 3 && (
                    <Card>
                      <h3 className="font-medium mb-3 text-sm">Intermediate plot · fit quality</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">χ²/ndf</span>
                        <span className={`text-sm font-mono ${chi2 < 1.3 ? 'text-green-700' : 'text-red-600'}`}>{chi2.toFixed(2)}</span>
                      </div>
                      {fitIter < 3 ? (
                        <button onClick={() => setFitIter((n) => n + 1)} className="btn-secondary w-full">
                          Ask assistant to inspect &amp; refit ({fitIter}/3)
                        </button>
                      ) : (
                        <div className="text-sm text-green-700">Fit improved — cuts adjusted, χ²/ndf within tolerance.</div>
                      )}
                    </Card>
                  )}
                  {step === 2 && (
                    <div className="flex justify-end">
                      <button onClick={() => setStep(3)} className="btn-primary">Inspect intermediate plots →</button>
                    </div>
                  )}

                  {/* Beat 5 — supervisor / ATLAS-X3 tagging */}
                  {step >= 4 && (
                    <Card>
                      <h3 className="font-medium mb-3 text-sm">Event-level tagging · ATLAS-X3</h3>
                      <ErikHistogram data={ERIK_NODE_PLOTS.tagging.bins} xLabel={ERIK_NODE_PLOTS.tagging.x_label} showBsm />
                      <div className="text-sm text-gray-600 mt-2">Correlating ATLAS-X3 scores across jets isolates a clean signal region.</div>
                    </Card>
                  )}
                  {step === 3 && fitIter >= 3 && (
                    <div className="flex justify-end">
                      <button onClick={() => setStep(4)} className="btn-primary">Take to supervisor meeting →</button>
                    </div>
                  )}

                  {/* Beat 6 — neural SBI training */}
                  {step >= 5 && <SbiTraining onComplete={() => setSbiDone(true)} />}
                  {step === 4 && (
                    <div className="flex justify-end">
                      <button onClick={() => setStep(5)} className="btn-primary">Draft final analysis →</button>
                    </div>
                  )}

                  {/* Beat 7 — publish */}
                  {step >= 5 && (
                    <div className="flex justify-end pt-2">
                      <button onClick={startPublish} disabled={!sbiDone} className="btn-primary">Finish &amp; publish →</button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </ScreenLayout>

      <PublicationFlow
        isOpen={stage === 'publishing'}
        character={erik}
        work={{ title: 'Publish the dijet resonance search' }}
        approval={APPROVAL[currentEra] ?? APPROVAL[2028]}
        artifact={ARTIFACT[currentEra] ?? ARTIFACT[2028]}
        monthsLater={era.months}
        nextEra={era.next}
        worldChange={currentEra >= 2028 ? `ATLAS membership: ${formatNumber(era.members)} → ${formatNumber(ERA[era.next]?.members ?? 847)}` : undefined}
        onComplete={finishPublish}
        onCancel={() => setStage('workspace')}
      />
    </>
  );
}
