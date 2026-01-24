import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { ROUTES } from '@/utils/constants';
import DeprecatedBanner from '@/components/autoana/DeprecatedBanner';
import AutoAnaChatSidebar from '@/components/autoana/AutoAnaChatSidebar';
import WorkflowDAG from '@/components/autoana/WorkflowDAG';
import JobCard from '@/components/autoana/JobCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ResultsPlots from '@/components/autoana/ResultsPlots';
import { useAutoAnaResults, useAutoAnaWorkflow } from '@/hooks/useAutoAnaData';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AutoAnaDashboard() {
  const { analysisId } = useParams();
  const query = useQuery();
  const runId = query.get('run') || 'demo-run';

  const { workflow, loading: workflowLoading, error: workflowError } = useAutoAnaWorkflow(analysisId);
  const { results, loading: resultsLoading, error: resultsError } = useAutoAnaResults(analysisId);

  const [activeTab, setActiveTab] = useState('overview');
  const [config, setConfig] = useState(() => ({
    metCutGeV: 200,
    jetPtMinGeV: 50,
    rapidityMax: 2.4,
  }));
  const [reviewQueue, setReviewQueue] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobStatuses, setJobStatuses] = useState({});

  const [isAckOpen, setIsAckOpen] = useState(false);

  useEffect(() => {
    const key = 'autoana_deprecated_ack_v1';
    const ok = localStorage.getItem(key) === 'true';
    if (!ok) setIsAckOpen(true);
  }, []);

  const acknowledge = () => {
    localStorage.setItem('autoana_deprecated_ack_v1', 'true');
    setIsAckOpen(false);
  };

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'configuration', label: 'Configuration' },
      { id: 'running', label: 'Running' },
      { id: 'results', label: 'Results' },
    ],
    [],
  );

  const applyProposal = (p) => {
    if (p.kind === 'set_config') {
      setConfig((prev) => ({ ...prev, [p.field]: p.value }));
    }
    if (p.kind === 'navigate_tab') {
      setActiveTab(p.tab);
    }
  };

  const onPropose = (proposals) => {
    setReviewQueue((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      const next = proposals.filter((p) => !seen.has(p.id));
      return [...next, ...prev].slice(0, 10);
    });
  };

  useEffect(() => {
    const nodes = workflow?.nodes ?? [];
    if (!nodes.length) return;
    // Initialize statuses when workflow loads
    setJobStatuses((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const init = {};
      for (const n of nodes) init[n.id] = 'queued';
      // Start first runnable nodes
      for (const n of nodes) {
        if ((n.depends_on ?? []).length === 0) init[n.id] = 'running';
      }
      return init;
    });
    setSelectedJobId((prev) => prev ?? nodes[0].id);
  }, [workflow]);

  useEffect(() => {
    if (activeTab !== 'running') return;
    const nodes = workflow?.nodes ?? [];
    if (!nodes.length) return;

    const tickMs = 1200;
    const interval = setInterval(() => {
      setJobStatuses((prev) => {
        const next = { ...prev };

        // If something is running, randomly complete one running job
        const running = nodes.filter((n) => next[n.id] === 'running');
        if (running.length > 0) {
          const pick = running[Math.floor(Math.random() * running.length)];
          next[pick.id] = 'succeeded';
        }

        // Start any queued jobs whose deps succeeded
        for (const n of nodes) {
          if (next[n.id] !== 'queued') continue;
          const deps = n.depends_on ?? [];
          const ready = deps.every((d) => next[d] === 'succeeded');
          if (ready) next[n.id] = 'running';
        }

        return next;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [activeTab, workflow]);

  return (
    <div className="screen-container">
      <Modal isOpen={isAckOpen} onClose={() => {}}>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Deprecated / legacy</div>
            <h2 className="text-2xl font-light">AutoAna is deprecated</h2>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
            <div>
              This is a legacy demo preserved for historical reference. Outputs are simulated and may be wrong.
            </div>
            <div className="text-yellow-900 bg-yellow-50 border border-yellow-200 rounded p-3">
              Do not cite or rely on these results.
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Link to={ROUTES.DASHBOARD} className="btn-secondary">
              Leave
            </Link>
            <button onClick={acknowledge} className="btn-primary">
              I understand, continue
            </button>
          </div>
        </div>
      </Modal>

      <div className="mb-10">
        <h1 className="text-4xl font-light tracking-tight mb-2">AutoAna</h1>
        <p className="text-gray-500 text-lg">
          Analysis: <span className="font-mono text-gray-700">{analysisId}</span> · Run:{' '}
          <span className="font-mono text-gray-700">{runId}</span>
        </p>
      </div>

      <div className="mb-6">
        <DeprecatedBanner>
          Deprecation notice (2029): <span className="font-medium">Human review is now optional for standard analyses.</span>
        </DeprecatedBanner>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                      activeTab === t.id
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <Link to={ROUTES.DEPRECATED_AUTOANA} className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to catalog
              </Link>
            </div>

            <div className="px-6 py-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Scout', desc: 'Explores selection variations', status: 'Active' },
                      { name: 'Skeptic', desc: 'Flags systematic risks', status: 'Watching' },
                      { name: 'Scribe', desc: 'Drafts analysis notes', status: 'Idle' },
                    ].map((a) => (
                      <Card key={a.name} className="p-4">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Agent</div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{a.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{a.desc}</div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {a.status}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="border border-gray-200">
                    <div className="text-sm text-gray-700">
                      Use the mock chATLAS sidebar to request plots, propose cut changes, and queue supervisor approvals.
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'configuration' && (
                <div className="space-y-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Parameters</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">MET cut (GeV)</label>
                      <input
                        type="number"
                        value={config.metCutGeV}
                        onChange={(e) => setConfig((p) => ({ ...p, metCutGeV: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Jet pT min (GeV)</label>
                      <input
                        type="number"
                        value={config.jetPtMinGeV}
                        onChange={(e) => setConfig((p) => ({ ...p, jetPtMinGeV: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">|y| max</label>
                      <input
                        type="number"
                        step="0.1"
                        value={config.rapidityMax}
                        onChange={(e) => setConfig((p) => ({ ...p, rapidityMax: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'running' && (
                <div className="space-y-6">
                  {workflowLoading && (
                    <div className="py-10">
                      <LoadingSpinner />
                      <div className="text-center text-sm text-gray-600 mt-3">Loading workflow...</div>
                    </div>
                  )}

                  {workflowError && (
                    <Card className="border border-red-200 bg-red-50">
                      <div className="text-sm text-red-800">
                        Failed to load workflow: <span className="font-mono">{String(workflowError.message ?? workflowError)}</span>
                      </div>
                    </Card>
                  )}

                  {!workflowLoading && workflow && (
                    <>
                      <WorkflowDAG
                        nodes={workflow.nodes}
                        statuses={jobStatuses}
                        selectedNodeId={selectedJobId}
                        onSelect={(id) => setSelectedJobId(id)}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Jobs</div>
                              <div className="font-medium">Workflow steps</div>
                            </div>

                            <div className="space-y-2">
                              {workflow.nodes.map((n) => (
                                <JobCard
                                  key={n.id}
                                  job={n}
                                  status={jobStatuses[n.id] ?? 'queued'}
                                  isSelected={selectedJobId === n.id}
                                  onClick={() => setSelectedJobId(n.id)}
                                />
                              ))}
                            </div>
                          </div>
                        </Card>

                        <Card>
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Job details</div>
                              <div className="font-medium">Logs (simulated)</div>
                            </div>

                            {(() => {
                              const n = workflow.nodes.find((x) => x.id === selectedJobId) ?? workflow.nodes[0];
                              if (!n) return <div className="text-sm text-gray-600">Select a job to view details.</div>;
                              const st = jobStatuses[n.id] ?? 'queued';
                              return (
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="font-medium">{n.name}</div>
                                      <div className="text-xs text-gray-500 font-mono mt-1">{n.id}</div>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded border border-gray-200">
                                      {st}
                                    </span>
                                  </div>

                                  <div className="text-xs text-gray-600">
                                    Depends on: {(n.depends_on ?? []).length > 0 ? (n.depends_on ?? []).join(', ') : '—'}
                                  </div>

                                  <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap">
                                    {(n.logs ?? []).join('\n')}
                                    {st === 'running' ? '\n...\n' : '\n'}
                                    <span className="text-gray-400">
                                      {st === 'succeeded'
                                        ? 'Exit code: 0'
                                        : st === 'failed'
                                          ? 'Exit code: 1'
                                          : st === 'queued'
                                            ? 'Waiting for dependencies...'
                                            : 'Running...'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-6">
                  {resultsLoading && (
                    <div className="py-10">
                      <LoadingSpinner />
                      <div className="text-center text-sm text-gray-600 mt-3">Loading results...</div>
                    </div>
                  )}

                  {resultsError && (
                    <Card className="border border-red-200 bg-red-50">
                      <div className="text-sm text-red-800">
                        Failed to load results: <span className="font-mono">{String(resultsError.message ?? resultsError)}</span>
                      </div>
                    </Card>
                  )}

                  {!resultsLoading && results && (
                    <>
                      <ResultsPlots results={results} config={config} />

                      <Card>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Outputs</div>
                            <div className="font-medium">Run artifacts (simulated)</div>
                          </div>
                          <div className="space-y-2">
                            {(results.outputs ?? []).map((o) => (
                              <div key={o.name} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                                <div className="min-w-0">
                                  <div className="font-mono text-sm">{o.name}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {o.type} · {o.size_kb} KB
                                  </div>
                                </div>
                                <button
                                  className="btn-secondary py-2 px-4 text-sm"
                                  onClick={() => alert('Simulated download.')}
                                >
                                  Download
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      <Card className="bg-gray-50 border border-gray-200">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Interpretation (mock)</div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            The dijet mass spectrum is broadly smooth and consistent with the background-only hypothesis in this simulated demo.
                            Tightening the MET cut reduces the overall yield and can change the apparent significance by sculpting backgrounds.
                            Use the chATLAS sidebar to request follow-up checks (e.g., “show dijet mass”, “tighten MET cut”).
                          </div>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>

          {reviewQueue.length > 0 && (
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Supervisor review queue</div>
                    <div className="font-medium">Pending proposals</div>
                  </div>
                  <button onClick={() => setReviewQueue([])} className="text-xs text-gray-500 hover:text-gray-900">
                    Clear
                  </button>
                </div>

                <div className="space-y-2">
                  {reviewQueue.map((p) => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{p.rationale}</div>
                      <div className="flex gap-2 mt-3">
                        <button
                          className="btn-primary py-2 px-4 text-sm"
                          onClick={() => {
                            applyProposal(p);
                            setReviewQueue((prev) => prev.filter((x) => x.id !== p.id));
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-secondary py-2 px-4 text-sm"
                          onClick={() => setReviewQueue((prev) => prev.filter((x) => x.id !== p.id))}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="xl:col-span-1">
          <AutoAnaChatSidebar tab={activeTab} analysisId={analysisId} config={config} onPropose={onPropose} />
        </div>
      </div>
    </div>
  );
}

