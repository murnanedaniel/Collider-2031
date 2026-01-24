import React, { useMemo } from 'react';
import Card from '@/components/ui/Card';

function buildLayout(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const indeg = new Map(nodes.map((n) => [n.id, 0]));
  for (const n of nodes) {
    for (const d of n.depends_on ?? []) {
      indeg.set(n.id, (indeg.get(n.id) ?? 0) + 1);
      if (!byId.has(d)) {
        // ignore missing deps (shouldn't happen in fixtures)
      }
    }
  }

  const layers = [];
  const q = nodes.filter((n) => (indeg.get(n.id) ?? 0) === 0).map((n) => n.id);
  const remaining = new Set(nodes.map((n) => n.id));

  while (q.length > 0) {
    const layer = [];
    const layerSize = q.length;
    for (let i = 0; i < layerSize; i++) {
      const id = q.shift();
      if (!id || !remaining.has(id)) continue;
      remaining.delete(id);
      layer.push(id);
      for (const m of nodes) {
        if ((m.depends_on ?? []).includes(id)) {
          indeg.set(m.id, (indeg.get(m.id) ?? 0) - 1);
          if ((indeg.get(m.id) ?? 0) === 0) q.push(m.id);
        }
      }
    }
    if (layer.length > 0) layers.push(layer);
  }

  // fallback: any remaining nodes
  if (remaining.size > 0) layers.push([...remaining]);

  const positions = new Map();
  const xGap = 160;
  const yGap = 70;
  const x0 = 20;
  const y0 = 30;

  layers.forEach((layer, li) => {
    layer.forEach((id, idx) => {
      positions.set(id, { x: x0 + li * xGap, y: y0 + idx * yGap });
    });
  });

  const width = x0 + (layers.length - 1) * xGap + 220;
  const height = y0 + Math.max(...layers.map((l) => l.length)) * yGap + 40;

  return { positions, width, height };
}

function statusStyles(status) {
  const s = (status ?? '').toLowerCase();
  if (s === 'succeeded') return { fill: '#dcfce7', stroke: '#22c55e', text: '#14532d' };
  if (s === 'running') return { fill: '#dbeafe', stroke: '#3b82f6', text: '#1e3a8a' };
  if (s === 'failed') return { fill: '#fee2e2', stroke: '#ef4444', text: '#7f1d1d' };
  if (s === 'queued') return { fill: '#f3f4f6', stroke: '#9ca3af', text: '#374151' };
  return { fill: '#ffffff', stroke: '#d1d5db', text: '#111827' };
}

export default function WorkflowDAG({ nodes, statuses, selectedNodeId, onSelect }) {
  const layout = useMemo(() => buildLayout(nodes ?? []), [nodes]);

  if (!nodes || nodes.length === 0) {
    return (
      <Card>
        <div className="text-sm text-gray-600">No workflow nodes available.</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Workflow DAG</div>
      <div className="overflow-auto border border-gray-200 rounded">
        <svg width={layout.width} height={layout.height}>
          {/* edges */}
          {nodes.flatMap((n) =>
            (n.depends_on ?? []).map((d) => {
              const a = layout.positions.get(d);
              const b = layout.positions.get(n.id);
              if (!a || !b) return null;
              const x1 = a.x + 120;
              const y1 = a.y + 18;
              const x2 = b.x;
              const y2 = b.y + 18;
              return (
                <g key={`${d}->${n.id}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth="1.5" />
                  <circle cx={x2} cy={y2} r="3" fill="#9ca3af" />
                </g>
              );
            }),
          )}

          {/* nodes */}
          {nodes.map((n) => {
            const p = layout.positions.get(n.id);
            if (!p) return null;
            const st = statuses?.[n.id] ?? 'queued';
            const styles = statusStyles(st);
            const isSelected = selectedNodeId === n.id;
            return (
              <g key={n.id} transform={`translate(${p.x}, ${p.y})`}>
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="36"
                  rx="8"
                  fill={styles.fill}
                  stroke={isSelected ? '#111827' : styles.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelect?.(n.id)}
                />
                <text x="10" y="15" fontSize="11" fill={styles.text} fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
                  {n.id}
                </text>
                <text x="10" y="29" fontSize="10" fill={styles.text}>
                  {st}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

