import React from 'react';

export default function CreditEconomyDoc() {
    return (
        <div>
            <h1 className="text-3xl font-light mb-6">Credit Economy \u0026 Marketplace</h1>

            <p className="lead">
                ColliderLab operates on a credit-based economy where computational resources, storage, and analysis
                services are traded using a unified currency. This creates a self-sustaining marketplace for HEP research.
            </p>

            <h2 className="text-xl font-medium mt-6 mb-3">How Credits Work</h2>
            <p>
                <strong>Credits</strong> are the fundamental unit of exchange on ColliderLab. They represent purchasing
                power for computational resources, storage, and premium services. Unlike traditional currency, credits are:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3">
                <li>Non-transferable outside the platform (no cash-out)</li>
                <li>Generated through contribution (storage, compute, data quality)</li>
                <li>Consumed through usage (GPU hours, simulation, analysis)</li>
                <li>Tradeable between users for services</li>
            </ul>

            <h2 className="text-xl font-medium mt-6 mb-3">Earning Credits</h2>

            <h3 className="text-lg font-medium mt-4 mb-2">Storage Contribution</h3>
            <p className="mt-2">
                Provide unused disk space to the distributed storage network. Rate: <strong>~750 credits/TB/month</strong>.
                Maja contributes 3.2 TB, earning her ~2,400 credits monthly.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">Compute Contribution</h3>
            <p className="mt-2">
                Run overnight simulations on your GPU during idle time. Rate: <strong>~100 credits/GPU-hour</strong>
                (varies by GPU performance). A modern consumer GPU running 8 hours/night earns ~24,000 credits/month.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">Data Quality Validation</h3>
            <p className="mt-2">
                Participate in detector calibration, event classification, and data quality checks. Rate: <strong>Variable,
                    typically 50-500 credits per task</strong> depending on complexity.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">Discovery Bounties</h3>
            <p className="mt-2">
                Claim bounties for finding specific physics signatures or solving community-posed challenges.
                Maja's solar anomaly bounty paid <strong>15,000 credits</strong>.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">Publications \u0026 Recognition</h3>
            <p className="mt-2">
                Authors of high-impact analyses receive credit grants from institutional sponsors. A paper in a major
                journal might earn 5,000-10,000 credits from supporting institutions.
            </p>

            <h2 className="text-xl font-medium mt-6 mb-3">Spending Credits</h2>

            <div className="bg-gray-50 p-4 rounded-lg my-4">
                <h3 className="font-medium mb-3">Common Costs</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>GPU Simulation (A100, 1 hour)</span>
                        <span className="font-medium">~47 credits</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Foundation Space embedding (100k events)</span>
                        <span className="font-medium">~120 credits</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Geant5 simulation (1M events)</span>
                        <span className="font-medium">~850 credits</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Storage retrieval (1 TB)</span>
                        <span className="font-medium">~25 credits</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Priority compute queue (per job)</span>
                        <span className="font-medium">+20% surcharge</span>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-medium mt-6 mb-3">Credit Betting Market</h2>
            <p>
                Users can wager credits on physics measurement outcomes (e.g., \"Higgs vacuum will be found stable\" at
                8.5x odds). This creates a prediction market that:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3">
                <li>Aggregates community expertise into probability estimates</li>
                <li>Incentivizes careful analysis review</li>
                <li>Provides entertainment and community engagement</li>
                <li>All bets settled by eventual experimental results (no house advantage)</li>
            </ul>

            <h2 className="text-xl font-medium mt-6 mb-3">Institutional Sponsors</h2>
            <p>
                Large institutions and companies can sponsor research by purchasing credit pools. For example:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3">
                <li><strong>Apex AI:</strong> Donated 1M GPU-hours (~4.7M credits) to Higgs vacuum stability analysis</li>
                <li><strong>CERN:</strong> Provides baseline credits to all new users (500 credits/month)</li>
                <li><strong>University Grants:</strong> Graduate students receive 2,000-5,000 credits/month from advisors</li>
            </ul>

            <h2 className="text-xl font-medium mt-6 mb-3">Economic Sustainability</h2>
            <p>
                The system is designed to be zero-sum: total credits earned equals total credits spent (plus a small
                inflation to account for platform growth). This ensures:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3">
                <li>No artificial scarcity or hoarding incentives</li>
                <li>Contributors are fairly compensated by consumers</li>
                <li>Resource allocation matches community priorities</li>
                <li>No central authority controls pricing (pure market dynamics)</li>
            </ul>

            <h2 className="text-xl font-medium mt-6 mb-3">Comparison to Traditional Model</h2>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <h4 className="font-medium mb-2">Traditional Grid Computing</h4>
                        <ul className="space-y-1 text-gray-700">
                            <li>• Fixed allocation per institution</li>
                            <li>• Long queue times (days/weeks)</li>
                            <li>• Underutilized hardware</li>
                            <li>• Political resource battles</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">ColliderLab Credit Economy</h4>
                        <ul className="space-y-1 text-gray-700">
                            <li>• Dynamic allocation by need</li>
                            <li>• Instant priority with credits</li>
                            <li>• High utilization (~80%)</li>
                            <li>• Merit-based via contributions</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> The credit economy was controversial upon introduction in 2029. Critics argued
                    it would exclude researchers without resources to contribute. In practice, CERN's baseline grant
                    (500 credits/month) plus institutional sponsorships have made the platform more accessible than
                    traditional computing allocation systems.
                </p>
            </div>
        </div>
    );
}
