import React from 'react';

export default function Geant5Doc() {
  return (
    <div>
      <h1 className="text-3xl font-light mb-6">Geant5 Differentiable Simulation</h1>
      
      <h2 className="text-xl font-medium mt-6 mb-3">Overview</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Geant5 is the successor to Geant4, introducing full differentiability and GPU acceleration. 
        Released in 2029, it revolutionized detector simulation by making it fast enough for 
        real-time applications and enabling gradient-based optimization.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Key Innovations</h2>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Differentiability</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Traditional detector simulation involves stochastic processes (quantum interactions, 
        thermal noise) that break differentiability. Geant5 offers two modes:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li><strong>Gold Standard</strong>: Full physics fidelity with stochastic processes</li>
        <li><strong>Differentiable</strong>: Replaces stochastic steps with learned generative models</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        In differentiable mode, gradients can flow through the entire simulation chain, enabling:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Gradient-based detector optimization</li>
        <li>Adversarial training for calibration</li>
        <li>Mapping of Standard Model surface in Foundation Space</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">GPU Acceleration</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Full port to GPU architecture achieved ~100× speedup over Geant4:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
        <div className="space-y-1 text-gray-700">
          <div>Geant4 (CPU): ~10⁴ events/hour/core</div>
          <div>Geant5 (GPU): ~10⁶ events/hour/GPU</div>
          <div>Typical simulation: 10⁸ events in ~3 minutes (100 GPUs)</div>
        </div>
      </div>

      <h2 className="text-xl font-medium mt-6 mb-3">Use Cases</h2>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Fast Simulation</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        For standard physics channels, Geant5 fast sim is effectively free (&lt;1 credit per 
        million events) and indistinguishable from full sim within quantum uncertainty.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Detector Optimization</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Maja uses Geant5's differentiability to optimize detector parameters for sensitivity 
        to specific signals. Parameters can be tuned via gradient descent rather than grid search.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Calibration & Unfolding</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Adversarial unfolding (Chen et al., 2027) uses differentiable simulation to learn 
        mappings between detector-level observables and Foundation Space representations.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Integration</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Geant5 integrates seamlessly with:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>MadGraph 6 (matrix element calculation)</li>
        <li>Pythia 9 (parton showering)</li>
        <li>ATHENA/CMSSW (reconstruction frameworks)</li>
        <li>ColliderLab modular simulation builder</li>
      </ul>
    </div>
  );
}

