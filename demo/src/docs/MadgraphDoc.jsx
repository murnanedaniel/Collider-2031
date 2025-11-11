import React from 'react';

export default function MadgraphDoc() {
  return (
    <div>
      <h1 className="text-3xl font-light mb-6">MadGraph 6</h1>
      
      <h2 className="text-xl font-medium mt-6 mb-3">Overview</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        MadGraph 6 is the latest generation of automated matrix element calculators for 
        particle physics. Building on decades of development, version 6 introduced full 
        GPU support and differentiability for modern machine learning workflows.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Core Capabilities</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        MadGraph automates the calculation of scattering amplitudes for arbitrary processes 
        in the Standard Model and beyond:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Leading-order (LO) and next-to-leading-order (NLO) calculations</li>
        <li>Custom models and effective field theories</li>
        <li>Multi-leg processes with complex topologies</li>
        <li>Electroweak corrections and higher-order effects</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">GPU Acceleration</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Version 6 features complete GPU port of matrix element evaluation:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
        <div className="space-y-1 text-gray-700">
          <div>CPU performance: ~10³ events/second</div>
          <div>GPU performance: ~10⁶ events/second</div>
          <div>Speedup: ~1000× for complex processes</div>
        </div>
      </div>

      <h2 className="text-xl font-medium mt-6 mb-3">Differentiability</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        MadGraph 6 maintains full computational graphs, enabling:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Gradient-based parameter optimization</li>
        <li>Sensitivity analysis for theory systematics</li>
        <li>Integration with ML-based unfolding techniques</li>
        <li>Adversarial training for Foundation Space mapping</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">ColliderLab Integration</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        In ColliderLab's modular simulation builder, MadGraph 6 modules can be:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Combined with custom physics (e.g., solar radiation effects)</li>
        <li>Configured via YAML without coding</li>
        <li>Chained with Pythia 9 showering and Geant5 detector simulation</li>
        <li>Deployed at scale via SiReAaaS infrastructure</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">Usage in Maja's Project</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Maja uses MadGraph 6 to generate the hard scattering processes for her solar-enhanced 
        simulation. The standard collider physics (pp → X) is combined with solar radiation 
        modules to model the complete detector response during solar flare events.
      </p>
    </div>
  );
}

