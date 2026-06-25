import React from 'react';
import Card from '@/components/ui/Card';

// The in-world paper behind Erik beat 8 — a (fictional) controlled study
// showing humans-in-the-loop reduce sensitivity and creativity (introduce bias),
// which is why analyses are human-blinded until unblinding by 2029.
// Self-contained component; rendered inside Erik's flow (not the shared Docs
// registry) so nothing in Maja's machinery is touched.
export default function HumanBlindingDoc() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-400">arXiv:2028.14792 [hep-ex]</div>
        <h1 className="text-2xl font-light mt-1">
          Human-in-the-loop bias in collider analyses: a controlled study
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          S. Chen, A. Lindqvist, V. Novak, and the AutoAna Collaboration
        </p>
        <p className="text-xs text-gray-400 mt-1">Submitted 14 November 2028 · HiLumi Metacollaboration</p>
      </div>

      <Card className="bg-gray-50">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Abstract</div>
        <p className="text-sm text-gray-700 leading-relaxed">
          We report a two-year controlled study comparing fully autonomous analysis pipelines
          against pipelines with human interaction at the selection, systematics, and modelling
          stages. Across 1,284 blinded benchmark analyses, human-guided pipelines showed a
          mean sensitivity reduction of (7.4 ± 0.9)% and a measurable narrowing of the explored
          configuration space. We attribute the effect to confirmation bias in cut optimisation
          and to premature convergence on familiar channels. We conclude that, for standard
          analyses, restricting human interaction to analysis definition and unblinding improves
          both sensitivity and the diversity of discovered channels.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { k: 'Benchmark analyses', v: '1,284' },
          { k: 'Mean sensitivity loss (human-guided)', v: '7.4 ± 0.9 %' },
          { k: 'Recommendation', v: 'Human-blind until unblinding' },
        ].map((s) => (
          <Card key={s.k}>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.k}</div>
            <div className="text-lg font-light">{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-gray-900">
        <p className="text-sm text-gray-700">
          Following this result, the metacollaborations adopted human-blinding for standard
          analyses in 2029: physicists define which analyses run and set overall strategy, but do
          not interact with the analysis machinery until unblinding.
        </p>
      </Card>
    </div>
  );
}
