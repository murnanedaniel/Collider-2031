import React from 'react';

export default function OpenDataDoc() {
  return (
    <div>
      <h1 className="text-3xl font-light mb-6">Open Data Mandate</h1>
      
      <h2 className="text-xl font-medium mt-6 mb-3">The 2027 Swiss Open Science Law</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        In 2027, the Swiss government passed landmark legislation requiring immediate public 
        release of all data entering software systems for publicly-funded research. For the 
        HL-LHC, this meant Level-1 trigger data (1 MHz across all detectors) must be stored 
        and made accessible in real-time.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Initial Challenges</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The law created an immediate crisis:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Traditional high-level trigger reduced 1 MHz to ~10 kHz for storage</li>
        <li>Storing full L1 output required ~100× more capacity</li>
        <li>Existing WLCG infrastructure insufficient</li>
        <li>Estimated cost: billions in new data centers</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">The Distributed Solution</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The physics community responded with an innovative distributed storage model:
      </p>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Android Storage Network</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Partnership with Google mobilized ~50 EB of android device storage worldwide:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Each event stored on ≥2 devices for redundancy</li>
        <li>Cryptographic hashing ensures data integrity</li>
        <li>Automatic replication when devices go offline</li>
        <li>Efficient retrieval via distributed hash tables</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Member Contributions</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Individuals contribute storage and earn credits:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
        <div className="space-y-1 text-gray-700">
          <div>Personal laptop (1 TB): ~750 credits/month</div>
          <div>Desktop workstation (4 TB): ~3,000 credits/month</div>
          <div>Institutional server (100 TB): ~75,000 credits/month</div>
        </div>
      </div>

      <h2 className="text-xl font-medium mt-6 mb-3">Impact on Physics</h2>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Unprecedented Access</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Full L1 data availability enables:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Model-independent searches (no trigger bias)</li>
        <li>Long-lived particle detection</li>
        <li>Cross-detector coincidence studies</li>
        <li>Complete event context for anomalies</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Cross-Detector Correlation</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Real-time hit-level data from all collaborations enabled discoveries like Maja's 
        solar correlation study. Previously, such cross-detector analyses required months 
        of coordination and partial data sharing.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-3">Privacy & Security</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        While data is open, access patterns and member identities are protected:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 ml-4">
        <li>Queries are anonymized and aggregated</li>
        <li>Individual device locations remain private</li>
        <li>Cryptographic proofs verify data without exposing sources</li>
        <li>Rate limiting prevents targeted data harvesting</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-3">Legacy</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        What seemed like a crisis in 2027 became a revolution in open science. The distributed 
        model proved more resilient, democratic, and efficient than centralized alternatives. 
        By 2031, other fields (astronomy, genomics, climate science) have adopted similar 
        approaches.
      </p>
    </div>
  );
}

