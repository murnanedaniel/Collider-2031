import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import ConvergenceWidget from '@/components/viz/ConvergenceWidget';
import PublicationFlow from '@/screens/shared/PublicationFlow';
import EfficiencyPlot from '@/screens/sofia/EfficiencyPlot';
import { useAgent } from '@/contexts/AgentContext';
import { CHARACTERS, ROUTES } from '@/utils/constants';

const SUBSYSTEMS = ['ITk', 'HGTD', 'Calorimeters', 'Foundation Space embedding'];

export default function SofiaFlow() {
  const sofia = CHARACTERS.sofia;
  const navigate = useNavigate();
  const { activeCharacter, enterCharacter } = useAgent();

  // beat: green -> alert -> investigate -> fixed ; plus publishing / done
  const [beat, setBeat] = useState('green');
  const [stage, setStage] = useState('workspace');
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (activeCharacter !== 'sofia') enterCharacter('sofia');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const degraded = beat !== 'green';
  const isRed = (s) => degraded && (s === 'ITk' || s === 'Foundation Space embedding');

  const returnToPresent = () => {
    enterCharacter('maja');
    navigate(ROUTES.DASHBOARD);
  };

  // Guard against a one-frame flash before the mount effect makes Sofia active.
  if (activeCharacter !== 'sofia') return null;

  if (stage === 'done') {
    return (
      <ScreenLayout title={`Validation · ${sofia.name}`} subtitle="2031 · certified">
        <div className="max-w-xl mx-auto text-center space-y-5 py-10 animate-fade-in">
          <div className="text-4xl">🌙</div>
          <p className="text-gray-700 leading-relaxed">
            At 5 AM, she goes back to sleep. No one will thank her. The physics will simply work.
          </p>
          <p className="text-sm text-gray-500">
            Thesis: "Validation of Track Reconstruction for the HL-LHC Inner Tracker." Essential.
            Rigorous. Not glamorous. The physics couldn't happen without her.
          </p>
          <button onClick={returnToPresent} className="btn-primary">Return to the present →</button>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <>
      <ScreenLayout title={`Validation Dashboard · ${sofia.name}`} subtitle="HL-LHC commissioning · 2030">
        <div className="space-y-6">
          {/* Alert banner */}
          {beat !== 'green' && (
            <Card className="border-l-4 border-red-500 bg-red-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <div>
                  <div className="font-medium text-red-900">Foundation Space embedding divergence — forward region</div>
                  <div className="text-sm text-red-800">Affected analyses: 847. Flagged 03:14 local.</div>
                </div>
              </div>
            </Card>
          )}

          {/* Subsystem health grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUBSYSTEMS.map((s) => {
              const red = isRed(s);
              return (
                <Card key={s} className={red ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s}</div>
                  <div className={`text-sm font-medium ${red ? 'text-red-700' : 'text-green-700'}`}>
                    {red ? '● Anomaly' : '● Nominal'}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* BEAT: green */}
          {beat === 'green' && (
            <Card>
              <p className="text-sm text-gray-700 mb-4">
                Everything is green. Your job is invisible when it works — you ensure that anyone
                who does analysis, human or agent, can trust the inputs.
              </p>
              <button onClick={() => setBeat('alert')} className="btn-primary">Run nightly validation</button>
            </Card>
          )}

          {/* BEAT: alert */}
          {beat === 'alert' && (
            <Card>
              <p className="text-sm text-gray-700 mb-4">
                Your phone buzzes at 3 AM. The dashboard glows red. The agents didn't catch it —
                the effect is subtle, buried in the tails.
              </p>
              <button onClick={() => setBeat('investigate')} className="btn-primary">Drill down →</button>
            </Card>
          )}

          {/* BEAT: investigate */}
          {(beat === 'investigate' || beat === 'fixed') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-medium mb-4 text-sm">ITk efficiency vs η</h3>
                <EfficiencyPlot />
                <p className="text-xs text-gray-500 mt-2">
                  Efficiency drops in η ∈ [2.1, 2.3]. Root cause: a firmware update three weeks ago
                  introduced a timing offset. The agents treated the resulting data as valid.
                </p>
              </Card>
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded bg-white border border-gray-200">
                      <div className="text-xs text-gray-500">Agents</div>
                      <div className="text-green-600 font-medium">NOMINAL ✓</div>
                    </div>
                    <div className="p-3 rounded bg-white border border-red-200">
                      <div className="text-xs text-gray-500">Sofia</div>
                      <div className="text-red-600 font-medium">ANOMALY ✗</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Only the human validation caught the discrepancy.
                  </p>
                </Card>

                {beat === 'investigate' && (
                  <Card>
                    <h3 className="font-medium mb-3 text-sm">Push calibration fix</h3>
                    <ConvergenceWidget
                      label="Embedding divergence"
                      startValue={1.0}
                      endValue={0.002}
                      duration={6000}
                      startLabel="Push fix & re-validate"
                      runningLabel="Re-validating…"
                      completeText="Embedding re-validated — green again"
                      accent="#8b5cf6"
                      onComplete={() => { setFixed(true); setBeat('fixed'); }}
                    />
                  </Card>
                )}

                {beat === 'fixed' && (
                  <Card className="border-l-4 border-green-500">
                    <div className="text-sm text-green-800 font-medium">Data certified for physics.</div>
                    <p className="text-xs text-gray-600 mt-1">The embedding has stabilized; the 847 analyses can proceed.</p>
                    <button onClick={() => setStage('publishing')} className="btn-primary w-full mt-3">
                      Certify &amp; publish →
                    </button>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </ScreenLayout>

      <PublicationFlow
        isOpen={stage === 'publishing'}
        character={sofia}
        work={{ title: 'Certify the data', summary: 'You traced the divergence the agents missed and corrected it. Certify the run for physics.' }}
        approval={{ mode: 'human', approver: 'You — data quality sign-off', note: 'Validation complete. Data certified for physics.' }}
        artifact={{
          type: 'certification',
          id: 'VALID-2030-1144',
          title: 'Validation of Track Reconstruction for the HL-LHC Inner Tracker',
          summary: 'ITk forward-region calibration drift caught and corrected. Run certified.',
        }}
        monthsLater={10}
        nextEra={2031}
        worldChange="The physics proceeds on data only you knew to trust."
        onComplete={() => setStage('done')}
        onCancel={() => setStage('workspace')}
      />
    </>
  );
}
