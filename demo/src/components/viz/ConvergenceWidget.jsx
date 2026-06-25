import React, { useEffect, useRef, useState } from 'react';

// Generic adversarial-loss / divergence convergence animation, lifted from the
// calibration block in FoundationSpace.jsx so Sofia (embedding re-stabilizes)
// and Elena (live run / blind analysis) can reuse it. Exponential decay from
// startValue toward endValue with small noise, plotted as a mini loss curve.
export default function ConvergenceWidget({
  label = 'Adversarial Loss',
  startValue = 1.0,
  endValue = 0.001,
  duration = 8000,
  startLabel = 'Run',
  runningLabel = 'Running...',
  completeText = 'Converged successfully',
  accent = '#DC2626',
  autoStart = false,
  onProgress,
  onComplete,
  children,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [value, setValue] = useState(startValue);
  const [history, setHistory] = useState([startValue]);
  const intervalRef = useRef(null);
  const startedRef = useRef(false);

  const run = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setIsRunning(true);
    setHistory([startValue]);

    const updateInterval = 50;
    const totalSteps = Math.max(1, duration / updateInterval);
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const t = step / totalSteps;
      const decay = Math.exp(-5 * t);
      const noise = (Math.random() - 0.5) * 0.05;
      const v = Math.max(endValue, Math.min(startValue, startValue * decay + noise));

      setValue(v);
      setHistory((prev) => [...prev, v]);
      if (onProgress) onProgress(Math.min(1, t));

      if (step >= totalSteps) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setValue(endValue);
        setIsRunning(false);
        setDone(true);
        if (onProgress) onProgress(1);
        if (onComplete) onComplete();
      }
    }, updateInterval);
  };

  useEffect(() => {
    if (autoStart) run();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className="space-y-3">
      {(isRunning || done) && (
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 font-medium">{label}</span>
            <span className="text-sm font-mono" style={{ color: done ? '#15803d' : accent }}>
              {value.toFixed(4)}
            </span>
          </div>
          <div className="h-16 bg-gray-50 rounded relative overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              <polyline
                points={history
                  .map((v, i) => `${(i / Math.max(history.length - 1, 1)) * 100},${(1 - v) * 100}`)
                  .join(' ')}
                fill="none"
                stroke={accent}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-xs text-gray-400 px-2 pb-1 flex justify-between">
              <span>Start</span>
              <span>Convergence</span>
            </div>
          </div>
        </div>
      )}

      {!done && (
        <button
          onClick={run}
          disabled={isRunning}
          className="w-full btn-primary"
        >
          {isRunning ? runningLabel : startLabel}
        </button>
      )}

      {done && (
        <>
          <div className="text-sm text-green-700 font-medium flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{completeText}</span>
          </div>
          {children}
        </>
      )}
    </div>
  );
}
