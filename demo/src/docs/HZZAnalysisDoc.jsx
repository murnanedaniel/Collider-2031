import React from 'react';

export default function HZZAnalysisDoc() {
    return (
        <div className="space-y-6 text-gray-800">
            <div>
                <h2 className="text-3xl font-light mb-2">H→ZZ*→4l Analysis</h2>
                <p className="text-sm text-gray-600">
                    Realistic Higgs boson discovery following ATLAS Open Data methodology
                </p>
            </div>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">Overview</h3>
                <p className="leading-relaxed">
                    The H→ZZ*→4l (Higgs to two Z bosons to four leptons) analysis is one of the 
                    "golden channels" for Higgs boson discovery. In this decay mode, the Higgs 
                    boson decays to two Z bosons (one on-shell, one off-shell Z*), which 
                    subsequently decay to four leptons (electrons or muons).
                </p>
                <p className="leading-relaxed">
                    This channel was crucial in the 2012 discovery of the Higgs boson at the LHC, 
                    providing a clear peak in the 4-lepton invariant mass distribution at 
                    approximately 125 GeV.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">Analysis Strategy</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">1. Event Selection</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Select events with exactly 4 leptons (electrons or muons)</li>
                        <li>Require leptons to pass quality identification criteria</li>
                        <li>Apply isolation requirements to suppress backgrounds</li>
                        <li>Verify trigger matching for data events</li>
                    </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">2. Z Candidate Reconstruction</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Group leptons into same-flavor, opposite-charge pairs</li>
                        <li>Assign pairs to Z₁ (closest to m_Z = 91 GeV) and Z₂ candidates</li>
                        <li>Require Z₁ mass: 66-116 GeV</li>
                        <li>Allow Z₂ mass: 0-116 GeV (off-shell Z*)</li>
                        <li>Total charge must sum to zero (charge conservation)</li>
                    </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">3. Invariant Mass Calculation</h4>
                    <p className="text-sm mb-2">
                        Compute the 4-lepton invariant mass using:
                    </p>
                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm">
                        m₄ₗ = √(E²_tot - p²_tot)
                    </div>
                    <p className="text-sm mt-2">
                        where E_tot is the sum of lepton energies and p_tot is the total momentum vector.
                    </p>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">Decay Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="font-medium text-lg mb-2">4μ</div>
                        <p className="text-sm text-gray-600">
                            Four muons. Clean signature with excellent momentum resolution.
                        </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="font-medium text-lg mb-2">2e2μ</div>
                        <p className="text-sm text-gray-600">
                            Two electrons and two muons. Largest branching ratio among channels.
                        </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="font-medium text-lg mb-2">4e</div>
                        <p className="text-sm text-gray-600">
                            Four electrons. Good energy resolution but higher backgrounds.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">Background Processes</h3>
                <div className="space-y-2">
                    <div>
                        <strong>Irreducible background:</strong>
                        <span className="text-sm ml-2">
                            ZZ* continuum production (non-Higgs) has identical final state
                        </span>
                    </div>
                    <div>
                        <strong>Reducible backgrounds:</strong>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                            <li>Z+jets: Jets misidentified as leptons</li>
                            <li>tt̄: Semi-leptonic decays producing extra leptons</li>
                            <li>WZ: Events with undetected leptons</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">Key Results</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="font-medium mb-2">Discovery Significance</div>
                    <p className="text-sm leading-relaxed">
                        The H→ZZ*→4l channel contributed significantly to the 5σ discovery 
                        of the Higgs boson in 2012. The clean signature and excellent mass 
                        resolution make it ideal for precise mass measurements, despite the 
                        small branching ratio (~0.01%).
                    </p>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">ColliderLab Implementation</h3>
                <p className="leading-relaxed">
                    In ColliderLab's automated analysis system (AutoAna), the H→ZZ*→4l analysis 
                    follows the methodology established by ATLAS Open Data. The workflow includes:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
                    <li>Pre-skimmed events with exactly 4 leptons</li>
                    <li>Lepton quality and isolation cuts following ATLAS recommendations</li>
                    <li>Z candidate pairing using same-flavor opposite-charge requirements</li>
                    <li>4-lepton invariant mass calculation using vector arithmetic</li>
                    <li>Background estimation from ZZ* continuum and reducible sources</li>
                    <li>Statistical significance evaluation of the Higgs signal</li>
                </ol>
            </section>

            <section className="space-y-3">
                <h3 className="text-xl font-medium">References</h3>
                <div className="space-y-2 text-sm">
                    <div>
                        <a 
                            href="https://opendata.atlas.cern/docs/13TeV25Doc/StandardModel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            ATLAS Open Data: Standard Model Documentation
                        </a>
                    </div>
                    <div>
                        <a 
                            href="https://github.com/atlas-outreach-data-tools/notebooks-collection-opendata/blob/master/13-TeV-examples/uproot_python/HZZAnalysis.ipynb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            ATLAS Open Data: H→ZZ Analysis Notebook
                        </a>
                    </div>
                    <div>
                        <a 
                            href="https://www.sciencedirect.com/science/article/pii/S037026931200857X"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            ATLAS Collaboration: "Observation of a new particle..." (2012)
                        </a>
                    </div>
                </div>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-700 space-y-2">
                    <div>
                        <strong>Note:</strong> This implementation uses simulated data and results 
                        based on the ATLAS Open Data methodology. The analysis workflow, cuts, and 
                        mass distribution are representative of the actual discovery analysis but 
                        are provided for educational and demonstration purposes.
                    </div>
                </div>
            </section>
        </div>
    );
}
