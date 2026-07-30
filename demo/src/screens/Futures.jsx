import React, { useState, useEffect } from 'react';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import FutureTree from '@/components/viz/FutureTree';
import { Term, TermChips } from '@/components/ui/InfoTerm';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const FIELD_COLORS = {
  intact: '#94a3b8', cutting: '#f59e0b', converting: '#38bdf8',
  converted: '#22c55e', disorderly: '#ef4444',
};
const FCC_COLORS = {
  pre: '#cbd5e1', approved: '#a5b4fc', construction: '#6366f1',
  descope: '#f59e0b', paused: '#ef4444', rejected: '#7f1d1d',
};
const ENDING_LABELS = {
  pivoted: 'Pivots (late; succession)', deniable: 'Muddles through',
  disorderly: 'Disorderly', hollowed: 'Hollows out',
};

function toChartData(quarters, seriesObj) {
  return quarters.map((q, i) => {
    const row = { quarter: q, year: q.endsWith('Q1') ? q.slice(0, 4) : '' };
    for (const [cat, vals] of Object.entries(seriesObj)) row[cat] = vals[i];
    return row;
  });
}

function StackChart({ quarters, data, colors }) {
  const rows = toChartData(quarters, data.series);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={rows} stackOffset="expand" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="quarter" tickFormatter={(q) => (q.endsWith('Q1') ? q.slice(0, 4) : '')}
          interval={0} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
        <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false} axisLine={false} width={36} />
        <Tooltip formatter={(v, name) => [`${(v * 100).toFixed(1)}%`, name]}
          labelStyle={{ fontFamily: 'monospace', fontSize: 12 }} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {data.categories.map((cat) => (
          <Area key={cat} type="monotone" dataKey={cat} stackId="1"
            stroke={colors[cat]} fill={colors[cat]} fillOpacity={0.85} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function eventColor(label) {
  if (/trim|deep/.test(label)) return 'text-amber-600';
  if (/rescope|conversion/.test(label)) return 'text-green-600';
  if (/pause|squeeze|shock|demand/.test(label)) return 'text-red-500';
  if (/FCC|consult|CEPC|muon|RRB/.test(label)) return 'text-indigo-600';
  return 'text-gray-600';
}

export default function Futures() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/futures.json`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <ScreenLayout title="Futures of the Field">
        <Card><p className="text-red-500">Failed to load simulation data: {error}</p></Card>
      </ScreenLayout>
    );
  }
  if (!data) {
    return (
      <ScreenLayout title="Futures of the Field">
        <Card><p className="text-gray-400 animate-pulse">Loading 10,000 histories…</p></Card>
      </ScreenLayout>
    );
  }

  const exemplar = data.exemplars[tab] || data.exemplars[0];

  return (
    <ScreenLayout title="Futures of the Field">
      <p className="text-sm text-gray-500 mb-6 max-w-3xl">
        {data.meta.runs.toLocaleString()} simulated histories of European particle-physics funding,
        2026–2041, from the <span className="font-medium">{data.meta.source}</span>.{' '}
        <span className="italic">{data.meta.note}</span>{' '}
        <Term k="structured judgments" className="not-italic">What does that mean?</Term>
      </p>

      {/* 1. Ending tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(data.endings).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
          <Card key={k}>
            <div className="text-3xl font-bold" style={{ color: k === 'pivoted' ? '#d97706' : k === 'disorderly' ? '#ef4444' : k === 'hollowed' ? '#f59e0b' : '#64748b' }}>
              {Math.round(v * 100)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <Term k={k === 'deniable' ? 'muddle-through' : k}>{ENDING_LABELS[k] || k}</Term>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. The tree */}
      {data.tree && (
        <Card className="mb-8">
          <h2 className="text-lg font-semibold mb-1">The tree of futures</h2>
          <p className="text-xs text-gray-400 mb-3">
            Every branch counted from the simulated histories themselves:
            the 2027 <Term k="consultations">consultations</Term>,
            the <Term k="fcc">FCC decision</Term>,
            whether the funding <Term k="conversion">conversion</Term> comes before
            or after <Term k="cuts">the cuts</Term>, the machine's fate, and the ending.
            Branches carrying less than 0.8% are pruned. Click any underlined word for a plain-language explanation.
          </p>
          <FutureTree tree={data.tree} />
        </Card>
      )}

      {/* 3. Field occupancy */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Where the field is, quarter by quarter</h2>
        <p className="text-xs text-gray-400 mb-3">
          Share of histories in each condition. Watch the cutting wave (amber) arrive ~2029
          and the conversion wave (green) follow ~2037 — the modal future is cut-then-convert.
        </p>
        <StackChart quarters={data.quarters} data={data.field} colors={FIELD_COLORS} />
        <TermChips colors={FIELD_COLORS} items={[
          ['intact', 'intact'], ['cutting', 'cutting'], ['converting', 'converting'],
          ['converted', 'converted'], ['disorderly', 'disorderly'],
        ]} />
      </Card>

      {/* 3. FCC status */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold mb-1">The machine itself</h2>
        <p className="text-xs text-gray-400 mb-3">
          FCC status across histories. Construction (indigo), once begun, is the most
          shock-proof object in the model: contracts are armored, people are soft.
        </p>
        <StackChart quarters={data.quarters} data={data.fcc} colors={FCC_COLORS} />
        <TermChips colors={FCC_COLORS} items={[
          ['fcc|pre', 'awaiting decision'], ['approved (gated)|approved', 'approved'],
          ['fcc|construction', 'under construction'], ['descope|descope', 'descoped'],
          ['paused|paused', 'paused'], ['fcc|rejected', 'never approved'],
        ]} />
      </Card>

      {/* 4. Forks */}
      <h2 className="text-lg font-semibold mb-3">The forks in the road</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {data.forks.map((f) => (
          <Card key={f.id}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{f.date}</span>
              <span className="font-medium">
                <Term k={{consult:'consultations', fcc:'fcc', muon:'muon demonstrator',
                          rrb:'rrb', conversion:'conversion'}[f.id]}>{f.title}</Term>
              </span>
            </div>
            {f.options.map((o) => (
              <div key={o.label} className="flex items-center gap-2 mb-1">
                <div className="text-xs text-gray-600 w-44 shrink-0">{o.label}</div>
                <div className="flex-1 bg-gray-100 rounded h-3">
                  <div className="h-3 rounded bg-indigo-400" style={{ width: `${o.p * 100}%` }} />
                </div>
                <div className="text-xs font-mono text-gray-500 w-10 text-right">{Math.round(o.p * 100)}%</div>
              </div>
            ))}
            {f.note && <p className="text-xs italic text-gray-400 mt-2">{f.note}</p>}
          </Card>
        ))}
      </div>

      {/* 5. Exemplars */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Walk one history</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.exemplars.map((e, i) => (
            <button key={e.name} onClick={() => setTab(i)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                i === tab ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'}`}>
              {e.name}
            </button>
          ))}
        </div>
        <div className="border-l-2 border-gray-200 pl-4 space-y-1">
          {exemplar.events.map(([y, q, label], i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="font-mono text-gray-400 w-16 shrink-0">{y}Q{q}</span>
              <span className={eventColor(label)}>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </ScreenLayout>
  );
}
