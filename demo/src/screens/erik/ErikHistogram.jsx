import React from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

// Small analysis histogram for Erik's intermediate/sanity plots.
// data: [{ x, sm, data, bsm? }]. Bars = SM expectation, black line = data,
// optional red line = BSM signal MC.
export default function ErikHistogram({ data, xLabel = '', height = 200, showBsm = false }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" tick={{ fontSize: 11 }} label={{ value: xLabel, position: 'insideBottom', offset: -2, style: { fontSize: 10 } }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="sm" name="SM expectation" fill="#9ca3af" isAnimationActive={false} />
          <Line type="monotone" dataKey="data" name="Data" stroke="#111827" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
          {showBsm && <Line type="monotone" dataKey="bsm" name="Signal MC" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={false} isAnimationActive={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
