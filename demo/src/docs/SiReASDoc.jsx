import React from 'react';

export default function SiReAsDoc() {
  return (
    <div>
      <h1 className="text-3xl font-light mb-6">SiReAs Platform</h1>
      
      <h2 className="text-xl font-medium mt-6 mb-3">Overview</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        SiReAs (Simulation, Reconstruction, and Analysis as a Service) is the unified 
        infrastructure platform for HL-LHC computing. Introduced in 2029, it replaced the 
        patchwork of experiment-specific frameworks with a single, scalable, GPU-native system.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Architecture</h2>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Microservices Design</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        SiReAs decomposes traditional monolithic frameworks into containerized microservices:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li><strong>Event Generation</strong>: MadGraph, Pythia, custom generators</li>
        <li><strong>Detector Simulation</strong>: Geant5 full/fast sim</li>
        <li><strong>Digitization</strong>: Detector response modeling</li>
        <li><strong>Reconstruction</strong>: Track finding, calorimetry, particle flow</li>
        <li><strong>Analysis</strong>: Selection, ML inference, statistics</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Auto-scaling</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Services scale automatically based on demand across millions of nodes. Pre-compiled 
        containers for common configurations sit idle, ready to respond to API calls within seconds.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Speed & Efficiency</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        GPU-native implementation achieves unprecedented performance:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
        <div className="space-y-1 text-gray-700">
          <div>Simulation: 100M events in ~3 minutes</div>
          <div>Reconstruction: Real-time at 1 MHz trigger rate</div>
          <div>Analysis: Interactive queries on PB-scale datasets</div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4">
        The transition to GPU eliminated the CPU/GPU heterogeneity problem—everything now runs 
        on homogeneous GPU infrastructure, dramatically simplifying workflows.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Credit-Based Access</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        SiReAs integrates with the metacollaboration credit economy:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Jobs are paid for with credits</li>
        <li>Common operations (standard fast sim) are heavily subsidized</li>
        <li>Custom/expensive operations (full sim, large training jobs) cost more</li>
        <li>Priority queuing available for urgent analyses</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">ColliderLab Integration</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        ColliderLab provides a user-friendly interface to SiReAs:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Modular simulation builder compiles to SiReAs workflows</li>
        <li>Real-time monitoring of job progress and costs</li>
        <li>Automatic result caching and provenance tracking</li>
        <li>One-click deployment of custom analyses</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">Funding</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        SiReAs infrastructure is primarily funded by Mistral's 10 GW data center, with ~10% 
        idle capacity (1M GPUs) dedicated to HL-LHC computing. This supports Maurizio Pierini's 
        2028 initiative to measure Higgs vacuum stability.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Current Work: Phdaas - PhD as a Service</h2>
      PhD-as-a-Service is a new endpoing that allows researchers to submit a study that is expected
      to take around 2 years of full-time work. They should expect a result to be returned asynchronously
      in 6-8 hours.
    </div>
  );
}

