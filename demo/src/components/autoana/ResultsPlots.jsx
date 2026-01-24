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
  const pulls = results?.plots?.pulls;

  const scale = useMemo(() => {
    // Simple, visible effect for the demo: tighter MET reduces event yields.
    const met = Number(config?.metCutGeV ?? 200);
    const s = met <= 200 ? 1.0 : Math.max(0.65, 1.0 - (met - 200) / 600);
    return s;
  }, [config]);

  const mjjData = useMemo(() => scaleBins(mjj?.bins, scale), [mjj?.bins, scale]);

  return (
    <div className="space-y-6">
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
    </div>
  );
}

