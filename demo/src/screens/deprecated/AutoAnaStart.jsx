import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ROUTES } from '@/utils/constants';
import { useAutoAnaCatalog } from '@/hooks/useAutoAnaData';

export default function AutoAnaStart() {
  const navigate = useNavigate();
  const { catalog, loading, error } = useAutoAnaCatalog();
  const [selectedId, setSelectedId] = useState('dijet-resonance');
  const [paperName, setPaperName] = useState('');

  const analyses = useMemo(() => catalog?.analyses ?? [], [catalog]);

  const startRun = () => {
    const runId = `demo-${Date.now().toString(36)}`;
    navigate(`${ROUTES.DEPRECATED_AUTOANA}/${selectedId}?run=${encodeURIComponent(runId)}`);
  };

  return (
    <div className="screen-container">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight mb-2">AutoAna (Deprecated)</h1>
        <p className="text-gray-500 text-lg">
          Legacy analysis-management demo. Outputs are simulated and must not be used for real work.
        </p>
      </div>

      <Card className="border-l-4 border-yellow-500 bg-yellow-50">
        <div className="space-y-4">
          <div className="text-sm text-yellow-900">
            <div className="font-medium mb-1">Deprecated warning</div>
            <div className="text-yellow-800">
              This interface is kept for historical reference and may be incomplete or inconsistent with the rest of the site.
            </div>
          </div>
          <div className="text-xs text-yellow-800">
            Do not cite outputs. Do not use for real analyses. This is a simulated demo.
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Start an analysis</div>
                <h2 className="text-2xl font-light">Analysis catalog</h2>
              </div>

              {loading && (
                <div className="py-8">
                  <LoadingSpinner text="Loading AutoAna catalog..." />
                </div>
              )}

              {error && (
                <Card className="border border-red-200 bg-red-50">
                  <div className="text-sm text-red-800">
                    Failed to load catalog: <span className="font-mono">{String(error.message ?? error)}</span>
                  </div>
                </Card>
              )}

              {!loading && !error && (
                <div className="space-y-2">
                  {analyses.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`w-full text-left p-4 rounded border-2 transition-all ${
                        selectedId === a.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium">{a.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{a.subtitle}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(a.tags ?? []).map((t) => (
                              <span
                                key={t}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                          <div className="font-mono">{a.id}</div>
                          {a.last_updated && <div className="mt-1">Updated {new Date(a.last_updated).toLocaleString()}</div>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-5">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Context (optional)</div>
                <h3 className="text-lg font-medium">Attach paper</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Simulated only. The file isn’t uploaded; we just display the filename for context.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Paper PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPaperName(e.target.files?.[0]?.name ?? '')}
                  className="block w-full text-sm text-gray-700"
                />
                {paperName && (
                  <div className="text-xs text-gray-500 mt-2">
                    Selected: <span className="font-mono">{paperName}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <button onClick={startRun} className="btn-primary w-full" disabled={loading || !!error}>
                  Start simulated run →
                </button>
                <Link to={ROUTES.DOCS} className="btn-secondary w-full inline-flex items-center justify-center">
                  Back to Docs
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

