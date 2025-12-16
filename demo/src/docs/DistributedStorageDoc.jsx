import React from 'react';

export default function DistributedStorageDoc() {
    return (
        <div>
            <h1 className="text-3xl font-light mb-6">Distributed Storage Architecture</h1>

            <p className="lead">
                The ColliderLab platform stores all HL-LHC hit-level data across millions of consumer devices,
                creating a 200+ exabyte distributed storage network without dedicated data centers.
            </p>

            <h2 className="text-xl font-medium mt-6 mb-3">Overview</h2>
            <p>
                After the <strong>Swiss Data Transparency Act (2028)</strong>, CERN was mandated to make all LHC
                data publicly accessible. Traditional data center storage at this scale (200+ EB) would cost billions.
                Instead, ColliderLab implements a distributed storage protocol where participants contribute unused
                storage on their personal devices in exchange for GPU credits.
            </p>

            <h2 className="text-xl font-medium mt-6 mb-3">Technical Architecture</h2>

            <h3 className="text-lg font-medium mt-4 mb-2">Storage Protocol</h3>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong>Redundancy:</strong> Each data chunk is replicated across 5 geographic regions (N=5 Reed-Solomon encoding)</li>
                <li><strong>Erasure Coding:</strong> Can reconstruct data from any 3 of 5 replicas</li>
                <li><strong>Chunk Size:</strong> 100 MB per chunk (optimal for consumer bandwidth)</li>
                <li><strong>Verification:</strong> Cryptographic hashes ensure data integrity</li>
                <li><strong>Access Pattern:</strong> DHT-based lookup with less than 1s average retrieval time</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Participant Requirements</h3>
            <ul className="list-disc ml-6 space-y-2">
                <li>Minimum 1 TB of contributed storage</li>
                <li>95% uptime guarantee (monitored automatically)</li>
                <li>10 Mbps upload bandwidth</li>
                <li>Encrypted storage client (open-source, verified builds)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Credit Economy</h3>
            <p className="mt-2">
                Storage contributors earn ~750 credits per TB per month. These credits can be spent on GPU compute,
                simulation time, or traded with other users. The system creates a self-sustaining economy where
                participants with excess storage subsidize those running intensive analyses.
            </p>

            <h2 className="text-xl font-medium mt-6 mb-3">Scale</h2>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600">Total Participants</div>
                        <div className="text-2xl font-light">1.2M devices</div>
                    </div>
                    <div>
                        <div className="text-gray-600">Total Storage</div>
                        <div className="text-2xl font-light">~200 EB</div>
                    </div>
                    <div>
                        <div className="text-gray-600">Data Availability</div>
                        <div className="text-2xl font-light">99.97%</div>
                    </div>
                    <div>
                        <div className="text-gray-600">Avg. Retrieval Time</div>
                        <div className="text-2xl font-light">0.8 seconds</div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-medium mt-6 mb-3">Security \u0026 Privacy</h2>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong>End-to-end encryption:</strong> Data encrypted before leaving CERN (AES-256)</li>
                <li><strong>Zero-knowledge storage:</strong> Participants cannot decrypt stored chunks</li>
                <li><strong>Anonymous contribution:</strong> Storage nodes identified only by cryptographic ID</li>
                <li><strong>GDPR compliance:</strong> No personal data stored in physics events</li>
            </ul>

            <h2 className="text-xl font-medium mt-6 mb-3">Environmental Impact</h2>
            <p>
                By leveraging existing consumer hardware, the distributed model avoids the massive energy consumption
                of traditional data centers. Estimates suggest this reduces the carbon footprint of HL-LHC data storage
                by 85% compared to centralized alternatives.
            </p>

            <h2 className="text-xl font-medium mt-6 mb-3">Historical Context</h2>
            <p>
                This architecture was inspired by blockchain storage networks and academic P2P systems like Filecoin
                and IPFS, but optimized specifically for scientific data with different access patterns. The first
                prototype was deployed in 2029 for ATLAS data only, then expanded to all LHC experiments in 2030.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Fun fact:</strong> If you stacked all 200 EB of data on Blu-ray discs, the stack would
                    reach 2,400 km high—about 300 times the altitude of the ISS.
                </p>
            </div>
        </div>
    );
}
