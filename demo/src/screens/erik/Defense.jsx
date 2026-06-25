import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgent } from '@/contexts/AgentContext';
import { ROUTES } from '@/utils/constants';
import Card from '@/components/ui/Card';

// Capstone scene (doc §6.1). The committee probes; the only answers the UI
// offers Erik defer to the agent. There is no "your physical intuition" option.
export default function Defense({ onContinue }) {
  const navigate = useNavigate();
  const { enterCharacter } = useAgent();
  const [step, setStep] = useState(0);

  const returnToPresent = () => {
    enterCharacter('maja');
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="fixed inset-0 z-[10001] bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-xs uppercase tracking-wide text-gray-400">2030 · Thesis defense</div>

        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Committee</div>
              <p className="text-lg text-gray-800">
                "Walk us through the choice of jet energy scale uncertainty."
              </p>
            </Card>
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wide text-gray-400">Your answer</div>
              {[
                'The Skeptic agent flagged three options. I approved the conservative one.',
                'The agent’s explanation was convincing.',
              ].map((ans) => (
                <button
                  key={ans}
                  onClick={() => setStep(1)}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-500 transition-colors text-gray-700"
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Committee</div>
              <p className="text-lg text-gray-800">
                "But what's <em>your</em> physical intuition? If the agent were wrong, how would you know?"
              </p>
            </Card>
            <div className="text-xs uppercase tracking-wide text-gray-400">Your answer</div>
            <button
              onClick={() => setStep(2)}
              className="w-full text-left px-4 py-6 border border-gray-200 rounded-lg text-gray-400 italic hover:border-gray-300 transition-colors"
            >
              ( silence )
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center animate-fade-in">
            <p className="text-2xl font-light text-gray-800">Erik passes. Barely.</p>
            <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
              He understood the result — but he didn't generate the understanding through struggle.
              He's not bitter, exactly. Just dislocated. He takes a job in quantitative finance,
              where his skill at managing complex automated systems is valued.
            </p>
            <p className="text-sm text-gray-400">He still reads the arXiv, sometimes.</p>
            <div className="pt-4">
              <button onClick={onContinue ?? returnToPresent} className="btn-primary">
                {onContinue ? 'Continue →' : 'Return to the present →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
