import React, { useMemo, useState } from 'react';
import { GLOSSARY } from '@/components/ui/InfoTerm';

// Empirical probability tree: branch thickness = share of the 10,000 simulated
// histories taking that branch. Indigo path = the modal (most likely) route.

const COL_W = 205;
const X0 = 70;
const HEIGHT = 660;
const PAD = 14;

const ENDING_COLORS = {
  pivoted: '#d97706', 'muddle-through': '#64748b',
  disorderly: '#ef4444', hollowed: '#f59e0b',
};

function layout(root) {
  const nodes = [], links = [];
  function walk(node, depth, y0, y1, parent, onModal) {
    const y = (y0 + y1) / 2;
    const x = X0 + depth * COL_W;
    const n = { ...node, x, y, depth, onModal };
    nodes.push(n);
    if (parent) links.push({ from: parent, to: n, p: node.p, onModal });
    const kids = node.children || [];
    if (!kids.length) return;
    const total = kids.reduce((s, c) => s + c.p, 0);
    const maxP = Math.max(...kids.map((c) => c.p));
    let cy = y0;
    for (const c of kids) {
      const span = (y1 - y0) * (c.p / total);
      walk(c, depth + 1, cy + Math.min(4, span * 0.04), cy + span - Math.min(4, span * 0.04),
        n, onModal && c.p === maxP);
      cy += span;
    }
  }
  walk(root, 0, PAD, HEIGHT - PAD, null, true);
  return { nodes, links };
}

export default function FutureTree({ tree }) {
  const { nodes, links } = useMemo(() => layout(tree.root), [tree]);
  const [sel, setSel] = useState(null);
  const width = X0 + tree.levels.length * COL_W + 40;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg width={width} height={HEIGHT + 30} className="select-none">
          {/* column headers */}
          {tree.levels.map((lv, i) => (
            <text key={lv} x={X0 + (i + 1) * COL_W} y={14} textAnchor="middle"
              className="fill-gray-400" fontSize="11" fontFamily="monospace">{lv}</text>
          ))}
          {/* links */}
          {links.map((l, i) => {
            const mx = (l.from.x + l.to.x) / 2;
            const w = Math.max(1.2, l.p * 70);
            return (
              <path key={i}
                d={`M ${l.from.x} ${l.from.y} C ${mx} ${l.from.y}, ${mx} ${l.to.y}, ${l.to.x} ${l.to.y}`}
                fill="none"
                stroke={l.onModal ? '#6366f1' : '#cbd5e1'}
                strokeWidth={w} strokeOpacity={l.onModal ? 0.9 : 0.55} strokeLinecap="round" />
            );
          })}
          {/* nodes */}
          {nodes.map((n, i) => {
            const isLeafLevel = n.depth === tree.levels.length;
            const color = isLeafLevel ? (ENDING_COLORS[n.name] || '#64748b')
              : n.onModal ? '#6366f1' : '#94a3b8';
            return (
              <g key={i} onMouseEnter={() => setSel(n)} onClick={() => setSel(n)}
                className="cursor-pointer">
                <circle cx={n.x} cy={n.y} r={n.depth === 0 ? 6 : 4.5} fill={color} />
                <text x={n.x + 8} y={n.y - 3} fontSize="10.5"
                  className={n.onModal ? 'fill-gray-800 font-medium' : 'fill-gray-500'}>
                  {n.name}
                </text>
                {n.depth > 0 && (
                  <text x={n.x + 8} y={n.y + 9} fontSize="9.5" fontFamily="monospace"
                    className="fill-gray-400">
                    {(n.p * 100).toFixed(1)}%{n.cp != null ? ` · ${Math.round(n.cp * 100)}% of branch` : ''}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {/* hover panel */}
      <div className="mt-2 min-h-[64px] border-t border-gray-100 pt-3">
        {sel ? (
          <div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            <span className="font-medium text-gray-700">{sel.name}</span>
            <span className="font-mono text-gray-400">{(sel.p * 100).toFixed(1)}% of all histories</span>
            {sel.endings && (
              <span className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">endings from here:</span>
                {Object.entries(sel.endings).map(([k, v]) => (
                  <span key={k} className="text-xs font-mono"
                    style={{ color: ENDING_COLORS[k] || '#64748b' }}>
                    {k} {Math.round(v * 100)}%
                  </span>
                ))}
              </span>
            )}
          </div>
          {(() => {
            const key = { 'muddle-through': 'muddle-through', pivoted: 'pivoted', disorderly: 'disorderly',
              hollowed: 'hollowed', 'approved (gated)': 'approved (gated)', 'approved (full)': 'fcc',
              'never approved': 'fcc', 'built, intact': 'fcc', 'built, descoped': 'descope', paused: 'paused',
              'converts BEFORE cuts': 'conversion', 'converts after cuts': 'conversion', 'no conversion': 'conversion',
              'redesign demanded': 'consultations', 'delay demanded': 'consultations',
              'consultation passes': 'consultations', blocked: 'consultations' }[sel.name];
            const g = key && GLOSSARY[key];
            return g ? <p className="text-xs text-gray-500 mt-2 max-w-2xl leading-relaxed">{g.body}</p> : null;
          })()}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            Hover any node to see how the endings redistribute from that point.
            Branch thickness is the share of 10,000 histories; the indigo path is the most likely route.
          </p>
        )}
      </div>
    </div>
  );
}
