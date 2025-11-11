import React from 'react';

export default function FoundationSpaceDoc() {
  return (
    <div>
      <h1 className="text-3xl font-light mb-6">Foundation Space</h1>
      
      <h2 className="text-xl font-medium mt-6 mb-3">Overview</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Foundation Space is a 100,000-dimensional learned latent space where every collision
        event at the HL-LHC is embedded. Developed through years of training on differentiable
        simulation and real detector data, it serves as the universal coordinate system for
        particle physics events.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">The Standard Model Surface</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Through adversarial training with Geant5 differentiable simulation, the "Standard Model
        surface" was mapped in Foundation Space. This represents all events predicted by the SM
        with known detector effects. Approximately 99.97% of recorded events fall within 3σ of
        this surface.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Anomaly Detection</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Events that fall outside the SM surface are flagged as anomalies. These can arise from:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Detector calibration issues (most common)</li>
        <li>Long-tail SM processes requiring higher-order corrections</li>
        <li>Systematic effects (pile-up, radiation damage)</li>
        <li>Potential new physics (rare)</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">Technical Details</h2>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
        <div className="space-y-1 text-gray-700">
          <div>Dimensionality: 100,000</div>
          <div>Training data: 10¹² simulated events + 10¹¹ real events</div>
          <div>Architecture: Transformer-based variational autoencoder</div>
          <div>Update frequency: Continuous (real-time fine-tuning)</div>
          <div>Inference latency: &lt;1ms per event</div>
        </div>
      </div>

      <h2 className="text-xl font-medium mt-6 mb-3">Credits & Citations</h2>
      <p className="text-gray-700 text-sm">
        Initial development: ATLAS/CMS Joint ML Working Group (2028-2030)<br/>
        Differentiable simulation: Geant5 Collaboration (2029)<br/>
        Current maintainer: HiLumi Metacollaboration Foundation Space Task Force
      </p>
    </div>
  );
}

