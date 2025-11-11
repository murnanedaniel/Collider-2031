import React from 'react';

export default function MetacollaborationDoc() {
  return (
    <div>
      <h1 className="text-3xl font-light mb-6">Metacollaborations</h1>
      
      <h2 className="text-xl font-medium mt-6 mb-3">Overview</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Metacollaborations (MCs) are cross-detector communities that emerged after the 2027 
        EU Open Science Mandate. Unlike traditional experiment collaborations (ATLAS, CMS, etc.), 
        MCs focus on physics themes and enable resource sharing across the entire HL-LHC program.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Structure</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The HiLumi M.C. (Maja's affiliation) focuses on anomaly detection and model-independent 
        searches. Other major MCs include:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Precision SM M.C. (electroweak, Higgs measurements)</li>
        <li>BSM Search M.C. (SUSY, extra dimensions, etc.)</li>
        <li>Heavy Flavor M.C. (B-physics, flavor anomalies)</li>
        <li>Long-Lived Particle M.C. (exotic signatures)</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">Credit Economy</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Members earn credits by contributing:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li><strong>Storage</strong>: ~750 credits/TB/month</li>
        <li><strong>Compute</strong>: Overnight simulation and training runs</li>
        <li><strong>Data curation</strong>: Labeling, validation, cleaning</li>
        <li><strong>Code contributions</strong>: Algorithms, models, tools</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        Credits are spent on GPU hours for simulation, training, and analysis. The credit 
        system ensures fair resource allocation and incentivizes contribution.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Distributed Infrastructure</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Following the 2027 mandate requiring all L1 trigger data to be stored (1 MHz across 
        ATLAS+CMS), the physics community adopted distributed storage across member devices. 
        This includes smartphones, personal computers, and institutional servers.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Thanks to partnership with Google, ~50 EB of android device storage became available. 
        Each event is stored on ≥2 devices with cryptographic hashing for integrity.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Governance</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Each MC has a PI, conveners, and working groups. Decisions are made democratically 
        with voting weighted by credit balance. This ensures those who contribute most have 
        proportional influence.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Publication rights follow traditional collaboration rules, but preprints and data 
        releases are immediate and open by mandate.
      </p>
    </div>
  );
}

