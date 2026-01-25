import React, { useMemo } from 'react';
import Card from '@/components/ui/Card';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

function scaleBins(bins, scale) {
  return (bins ?? []).map((b) => ({
    ...b,
    sm: Math.max(0, Math.round((b.sm ?? 0) * scale)),
    data: Math.max(0, Math.round((b.data ?? 0) * scale)),
    bsm: Math.max(0, Math.round((b.bsm ?? 0) * scale)),
  }));
}

function tooltipFormatter(value, name) {
  return [value, name.toUpperCase()];
}

export default function ResultsPlots({ results, config }) {
  const mjj = results?.plots?.mjj;
  const m4l = results?.plots?.m4l;
  const pulls = results?.plots?.pulls;
  const channelBreakdown = results?.plots?.channel_breakdown;
  const zMasses = results?.plots?.z_masses;
  const analysisResults = results?.results;

  const scale = useMemo(() => {
    // Simple, visible effect for the demo: tighter MET reduces event yields.
    const met = Number(config?.metCutGeV ?? 200);
    const s = met <= 200 ? 1.0 : Math.max(0.65, 1.0 - (met - 200) / 600);
    return s;
  }, [config]);

  const mjjData = useMemo(() => scaleBins(mjj?.bins, scale), [mjj?.bins, scale]);

  // Determine if this is H->ZZ analysis
  const isHZZAnalysis = !!m4l;

  return (
    <div className="space-y-6">
      {/* H->ZZ 4-lepton invariant mass plot */}
      {isHZZAnalysis && (
        <>
          <Card>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Primary Result</div>
                <div className="font-medium">{m4l?.title ?? '4-lepton invariant mass'}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Following ATLAS Open Data H→ZZ*→4l discovery methodology
                </div>
              </div>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={m4l?.bins ?? []} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      tick={{ fontSize: 12 }} 
                      label={{ value: m4l?.x_label ?? 'm₄ₗ (GeV)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: m4l?.y_label ?? 'Events', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Bar dataKey="background" name="Background (ZZ*)" fill="#9ca3af" stackId="stack" />
                    <Bar dataKey="signal" name="Signal (H→ZZ*)" fill="#10B981" stackId="stack" />
                    <Line type="monotone" dataKey="data" name="Data" stroke="#111827" strokeWidth={2} dot={{ r: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Analysis results summary */}
          {analysisResults && (
            <Card className="bg-blue-50 border border-blue-200">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Discovery Results</div>
                  <div className="font-medium text-lg">H→ZZ*→4l Analysis Summary</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Higgs Mass</div>
                    <div className="text-xl font-medium">
                      {analysisResults.higgs_mass?.value} ± {analysisResults.higgs_mass?.stat_error} ± {analysisResults.higgs_mass?.syst_error} GeV
                    </div>
                    <div className="text-xs text-gray-500 mt-1">(stat) (syst)</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Significance</div>
                    <div className="text-xl font-medium text-green-600">
                      {analysisResults.significance?.local}σ local
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {analysisResults.significance?.global}σ global
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Signal Strength</div>
                    <div className="text-xl font-medium">
                      μ = {analysisResults.signal_strength?.mu} ± {analysisResults.signal_strength?.error}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Consistent with SM</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pt-3 border-t border-blue-200">
                  <strong>Discovery:</strong> Clear excess observed at m_H = 125 GeV with 5.9σ local significance.
                  The Higgs boson decays to two Z bosons (one off-shell), which subsequently decay to four leptons.
                  Same-flavor, opposite-charge lepton pairs are required. This analysis reproduces the 2012 ATLAS
                  discovery methodology using open data.
                </div>
              </div>
            </Card>
          )}

          {/* Z mass distribution */}
          {zMasses && (
            <Card>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Quality Check</div>
                  <div className="font-medium">{zMasses?.title ?? 'Z mass distribution'}</div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={zMasses?.bins ?? []} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" tick={{ fontSize: 12 }} label={{ value: zMasses?.x_label ?? 'm_Z (GeV)', position: 'insideBottom', offset: -5 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Dijet analysis plots */}
      {mjj && !isHZZAnalysis && (
        <>
          <Card>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plot</div>
                <div className="font-medium">{mjj?.title ?? 'Dijet mass distribution'}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Demo scaling applied from config: MET cut = <span className="font-mono">{config?.metCutGeV}</span> GeV
                </div>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mjjData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Bar dataKey="sm" name="SM" fill="#9ca3af" />
                    <Line type="monotone" dataKey="data" name="Data" stroke="#111827" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="bsm" name="BSM (toy)" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plot</div>
                <div className="font-medium">{pulls?.title ?? 'Pulls'}</div>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={pulls?.points ?? []} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[-3, 3]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pull" name="Pull (σ)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

