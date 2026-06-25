import React, { useState } from 'react';
import Card from '@/components/ui/Card';

// Erik beat 15 — the balanced coda. Agentic analysis is genuinely good: it
// sped up precision measurements and discovery potential, run transparently
// and efficiently. Erik's bad experience isn't its fault — it's that the
// student→physicist pipeline of the big collaborations is incompatible with
// the new paradigm. Self-contained; ErikFlow passes onReturn later.
const AGENT_ANALYSES = [
  { id: 'dijet-resonance', title: 'Heavy dijet resonance search', detail: '95% CL limits, 3.1σ look-elsewhere corrected', delta: '4× faster than 2026' },
  { id: 'hh-bbtautau', title: 'HH → bbττ trilinear coupling', detail: 'κλ precision 12% → 4%', delta: 'unbinned SBI' },
  { id: 'vbf-invisible', title: 'VBF H → invisible', detail: 'BR < 0.06 at 95% CL', delta: 'auto-systematics' },
  { id: 'displaced-llp', title: 'Displaced LLP scan', detail: '11 new channels explored', delta: 'no human prior' },
];

export default function Epilogue({ onReturn }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="screen-container max-w-4xl mx-auto py-10 space-y-8">
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wide text-gray-400">Epilogue</div>
        <h1 className="text-3xl font-light">It isn't the analysis that failed Erik.</h1>
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          Agentic analysis has been genuinely transformative — it has sped up precision
          measurements and widened discovery potential, and it runs transparently and
          efficiently. Every analysis below was defined by a physicist and executed end-to-end
          by agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENT_ANALYSES.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelected(a.id)}
            className={`text-left transition-shadow ${selected === a.id ? 'ring-2 ring-gray-900 rounded-lg' : ''}`}
          >
            <Card className="h-full hover:shadow-md">
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-600 mt-1">{a.detail}</div>
              <div className="text-xs text-green-700 mt-2">● agent-managed · {a.delta}</div>
            </Card>
          </button>
        ))}
      </div>

      <Card className="border-l-4 border-gray-900">
        <p className="text-gray-700 leading-relaxed">
          What broke for Erik was the <strong>student→physicist pipeline</strong> of the major
          collaborations — the apprenticeship of learning physics by doing the analysis by hand.
          That pipeline is incompatible with a paradigm where the machinery no longer needs a
          trainee at the controls. The physics is thriving. The path into it has to be rebuilt.
        </p>
      </Card>

      {onReturn && (
        <div className="pt-2">
          <button onClick={onReturn} className="btn-primary">Return to the present →</button>
        </div>
      )}
    </div>
  );
}
