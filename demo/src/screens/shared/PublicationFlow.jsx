import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';

// ============================================================================
// PublicationFlow — the shared, app-native time mechanic.
//
// Finishing a unit of work runs this sequence:
//   Submit -> Review/approval (era-dependent) -> Published artifact
//          -> "N months later -> {year}" interstitial -> onComplete()
//
// The review step is where each character's thesis lives and mutates by era:
//   mode 'human'   -> the human signs off (2028 Erik)
//   mode 'agent'   -> agents self-approve, sign-off auto-fills (2029)
//   mode 'skipped' -> no human review at all (2030)
//
// The world-clock is shown ONLY here (workspaces stay clean). onComplete is
// where the caller advances the character's era and mutates workspace state.
// ============================================================================

const ARTIFACT_LABEL = {
  paper: 'Preprint published',
  commit: 'Committed to Foundation Space',
  thesis: 'Thesis submitted',
  certification: 'Data certified for physics',
};

export default function PublicationFlow({
  isOpen,
  character,
  work, // { title, summary }
  approval, // { mode: 'human'|'agent'|'skipped', approver, note }
  artifact, // { type, id, title, summary }
  monthsLater = 18,
  nextEra,
  worldChange, // optional string/node describing what changed in the world
  onComplete,
  onCancel,
}) {
  const [step, setStep] = useState('submit');

  // Reset to first step whenever the flow (re)opens.
  useEffect(() => {
    if (isOpen) setStep('submit');
  }, [isOpen]);

  // Agent self-approval auto-advances after a brief beat.
  useEffect(() => {
    if (step === 'review' && approval?.mode === 'agent') {
      const t = setTimeout(() => setStep('published'), 1600);
      return () => clearTimeout(t);
    }
  }, [step, approval]);

  if (!isOpen) return null;

  const accent = character?.color ?? '#111827';
  const artifactType = artifact?.type ?? 'paper';

  return (
    <div className="fixed inset-0 z-[10001] bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* SUBMIT */}
        {step === 'submit' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-xs uppercase tracking-wide text-gray-400">Finish &amp; publish</div>
            <h1 className="text-3xl font-light">{work?.title ?? 'Submit your work'}</h1>
            {work?.summary && <p className="text-gray-600 leading-relaxed">{work.summary}</p>}
            <Card className="bg-gray-50">
              <div className="text-sm text-gray-700">
                Submitting to the collaboration for review and publication.
              </div>
            </Card>
            <div className="flex justify-between pt-2">
              {onCancel && (
                <button onClick={onCancel} className="btn-secondary">Not yet</button>
              )}
              <button onClick={() => setStep('review')} className="btn-primary ml-auto">
                Submit to collaboration →
              </button>
            </div>
          </div>
        )}

        {/* REVIEW / APPROVAL — the thesis-bearing step */}
        {step === 'review' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-xs uppercase tracking-wide text-gray-400">Review</div>
            {approval?.mode === 'human' && (
              <>
                <h1 className="text-3xl font-light">Awaiting your sign-off</h1>
                <Card className="border-l-4" style={{ borderColor: accent }}>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-1">{approval.approver ?? 'You (supervisor)'}</div>
                    {approval.note ?? 'Review the agent’s choices and approve to publish.'}
                  </div>
                </Card>
                <button onClick={() => setStep('published')} className="btn-primary w-full">
                  Approve &amp; publish
                </button>
              </>
            )}
            {approval?.mode === 'agent' && (
              <>
                <h1 className="text-3xl font-light">Agents reviewing…</h1>
                <Card className="bg-gray-50">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-1">{approval.approver ?? 'Skeptic agent'}</div>
                    {approval.note ?? 'The Skeptic agent reviewed and approved this itself. Your sign-off was auto-filled.'}
                  </div>
                </Card>
                <div className="text-xs text-gray-400">Auto-approving…</div>
              </>
            )}
            {approval?.mode === 'skipped' && (
              <>
                <h1 className="text-3xl font-light">No human review required</h1>
                <Card className="bg-gray-50">
                  <div className="text-sm text-gray-700">
                    {approval.note ?? 'Human review is no longer required for standard analyses. The pipeline publishes autonomously.'}
                  </div>
                </Card>
                <button onClick={() => setStep('published')} className="btn-primary w-full">
                  Continue →
                </button>
              </>
            )}
          </div>
        )}

        {/* PUBLISHED ARTIFACT */}
        {step === 'published' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              {ARTIFACT_LABEL[artifactType] ?? 'Published'}
            </div>
            <Card className="border-l-4" style={{ borderColor: accent }}>
              <div className="space-y-2">
                {artifact?.id && (
                  <div className="font-mono text-xs text-gray-500">{artifact.id}</div>
                )}
                <div className="text-xl font-light">{artifact?.title ?? 'Published record'}</div>
                {artifact?.summary && (
                  <p className="text-sm text-gray-600 leading-relaxed">{artifact.summary}</p>
                )}
              </div>
            </Card>
            <button onClick={() => setStep('timepass')} className="btn-primary w-full">
              Continue →
            </button>
          </div>
        )}

        {/* TIME PASSES — the ONLY place the world-clock appears */}
        {step === 'timepass' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="text-5xl">⏳</div>
              <p className="text-2xl font-light text-gray-500">{monthsLater} months later</p>
            </div>
            <p className="text-6xl font-extralight tracking-tight text-gray-900">
              It is now {nextEra}
            </p>
            {worldChange && (
              <div className="text-sm text-gray-500 max-w-md mx-auto">{worldChange}</div>
            )}
            <button onClick={onComplete} className="btn-primary">
              Return to your work →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
