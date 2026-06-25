import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea,
} from 'recharts';

// ITk efficiency vs pseudorapidity η. The agents see "nominal"; the real data
// drifts down in η ∈ [2.1, 2.3] — the dip Sofia catches.
const DATA = Array.from({ length: 11 }, (_, i) => {
  const eta = (i * 0.25).toFixed(2);
  const x = i * 0.25;
  const nominal = 0.98;
  const drift = x >= 2.1 && x <= 2.35 ? 0.72 : 0.975 - (x > 1.8 ? (x - 1.8) * 0.01 : 0);
  return { eta, nominal, actual: drift };
});

export default function EfficiencyPlot() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="eta" tick={{ fontSize: 12 }} label={{ value: 'η', position: 'insideBottom', offset: -2, style: { fontSize: 12 } }} />
          <YAxis domain={[0.6, 1.0]} tick={{ fontSize: 12 }} label={{ value: 'ITk efficiency', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
          <Tooltip />
          <Legend />
          <ReferenceArea x1="2.00" x2="2.50" fill="#ef4444" fillOpacity={0.08} />
          <Line type="monotone" dataKey="nominal" name="Agents (nominal)" stroke="#9ca3af" strokeWidth={2} strokeDasharray="4 3" dot={false} />
          <Line type="monotone" dataKey="actual" name="Sofia (measured)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
