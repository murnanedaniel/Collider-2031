import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';
import DetectorViewer3D, { DETECTOR_BLOCK_TYPES, PARTICLES } from '@/components/viz/DetectorViewer3D';

export default function DetectorDesign() {
    const [placedBlocks, setPlacedBlocks] = useState([]);
    const [selectedParticle, setSelectedParticle] = useState(PARTICLES[0]);
    const [beamEnergy, setBeamEnergy] = useState(100);
    const [beamTheta, setBeamTheta] = useState(45);
    const [beamPhi, setBeamPhi] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [hits, setHits] = useState([]);
    const [editMode, setEditMode] = useState(true);
    const [simulationKey, setSimulationKey] = useState(0);
    const [numParticles, setNumParticles] = useState(1);
    const [randomDirection, setRandomDirection] = useState(false);

    // Add a block to the scene
    const addBlock = (blockTypeId) => {
        const blockType = DETECTOR_BLOCK_TYPES.find(t => t.id === blockTypeId);
        if (!blockType) return;

        // Place at random position near origin
        const newBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            typeId: blockTypeId,
            position: {
                x: Math.round((Math.random() - 0.5) * 10) * 2,
                y: 4 + Math.round(Math.random() * 3) * 2,
                z: Math.round((Math.random() - 0.5) * 10) * 2
            }
        };

        setPlacedBlocks(prev => [...prev, newBlock]);
    };

    // Remove a block
    const removeBlock = (blockId) => {
        setPlacedBlocks(prev => prev.filter(b => b.id !== blockId));
    };

    // Clear all blocks
    const clearBlocks = () => {
        setPlacedBlocks([]);
        setHits([]);
    };

    // Load a default detector config
    const loadDefaultDetector = () => {
        // Create a simple barrel detector
        const blocks = [];

        // Inner tracker ring
        for (let angle = 0; angle < 360; angle += 60) {
            const rad = (angle * Math.PI) / 180;
            blocks.push({
                id: `tracker-${angle}`,
                typeId: 'tracker_block',
                position: {
                    x: Math.round(Math.cos(rad) * 6),
                    y: 4,
                    z: Math.round(Math.sin(rad) * 6)
                }
            });
        }

        // ECal ring
        for (let angle = 0; angle < 360; angle += 45) {
            const rad = (angle * Math.PI) / 180;
            blocks.push({
                id: `ecal-${angle}`,
                typeId: 'ecal_block',
                position: {
                    x: Math.round(Math.cos(rad) * 10),
                    y: 4,
                    z: Math.round(Math.sin(rad) * 10)
                }
            });
        }

        // HCal ring
        for (let angle = 0; angle < 360; angle += 40) {
            const rad = (angle * Math.PI) / 180;
            blocks.push({
                id: `hcal-${angle}`,
                typeId: 'hcal_block',
                position: {
                    x: Math.round(Math.cos(rad) * 16),
                    y: 4,
                    z: Math.round(Math.sin(rad) * 16)
                }
            });
        }

        // Magnet
        blocks.push({
            id: 'magnet-1',
            typeId: 'magnet_block',
            position: { x: 0, y: 8, z: 0 }
        });

        setPlacedBlocks(blocks);
    };

    const shootBeam = () => {
        if (isSimulating || placedBlocks.length === 0) return;
        setEditMode(false);
        setHits([]);
        setSimulationKey(prev => prev + 1);
        setTimeout(() => setIsSimulating(true), 100);
    };

    const handleSimulationComplete = useCallback(() => {
        setIsSimulating(false);
    }, []);

    const handleHitsUpdate = useCallback((newHits) => {
        setHits(newHits);
    }, []);

    const totalEnergy = hits.reduce((sum, h) => sum + h.energy, 0);

    return (
        <ScreenLayout
            title="Detector Design Studio"
            subtitle="Build your detector and simulate particles"
        >
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-180px)]">
                {/* Left sidebar */}
                <div className="lg:w-72 flex-shrink-0 space-y-3 overflow-y-auto">

                    {/* Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditMode(true)}
                            disabled={isSimulating}
                            className={`flex-1 py-2 rounded text-xs font-medium transition-all ${editMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            🔧 Build
                        </button>
                        <button
                            onClick={() => setEditMode(false)}
                            disabled={isSimulating}
                            className={`flex-1 py-2 rounded text-xs font-medium transition-all ${!editMode
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            ⚡ Simulate
                        </button>
                    </div>

                    {/* Block Palette - shown in build mode */}
                    {editMode && (
                        <Card className="bg-gradient-to-br from-gray-50 to-white">
                            <h3 className="font-medium mb-3 text-sm flex items-center gap-2">
                                🧱 Detector Blocks
                            </h3>
                            <p className="text-[10px] text-gray-500 mb-3">
                                Click to add blocks. Drag them in 3D to position.
                            </p>
                            <div className="space-y-2">
                                {DETECTOR_BLOCK_TYPES.map(block => (
                                    <button
                                        key={block.id}
                                        onClick={() => addBlock(block.id)}
                                        className="w-full flex items-center gap-3 p-2 rounded border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                                    >
                                        <div
                                            className="w-6 h-6 rounded shadow-sm"
                                            style={{ backgroundColor: `#${block.color.toString(16).padStart(6, '0')}` }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium truncate">{block.name}</div>
                                            <div className="text-[10px] text-gray-500">
                                                {block.showerType === 'em' ? 'EM showers' :
                                                    block.showerType === 'hadronic' ? 'Hadronic showers' :
                                                        block.showerType === 'none' ? 'Bends charged' : 'Tracking'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                <button
                                    onClick={loadDefaultDetector}
                                    className="w-full py-2 rounded text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                    Load Example Detector
                                </button>
                                <button
                                    onClick={clearBlocks}
                                    disabled={placedBlocks.length === 0}
                                    className="w-full py-2 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Clear All
                                </button>
                            </div>
                        </Card>
                    )}

                    {/* Particle Selection */}
                    {!editMode && (
                        <Card>
                            <h3 className="font-medium mb-2 text-sm">Particle Gun</h3>
                            <div className="grid grid-cols-3 gap-1 mb-3">
                                {PARTICLES.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedParticle(p)}
                                        disabled={isSimulating}
                                        className={`py-2 rounded text-xs font-medium transition-all ${selectedParticle.id === p.id
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {p.symbol}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Energy</span>
                                        <span className="font-medium">{beamEnergy} GeV</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="500"
                                        value={beamEnergy}
                                        onChange={(e) => setBeamEnergy(parseInt(e.target.value))}
                                        className="w-full"
                                        disabled={isSimulating}
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>θ (polar)</span>
                                        <span className="font-medium">{beamTheta}°</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="90"
                                        value={beamTheta}
                                        onChange={(e) => setBeamTheta(parseInt(e.target.value))}
                                        className="w-full"
                                        disabled={isSimulating || randomDirection}
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>φ (azimuthal)</span>
                                        <span className="font-medium">{beamPhi}°</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={beamPhi}
                                        onChange={(e) => setBeamPhi(parseInt(e.target.value))}
                                        className="w-full"
                                        disabled={isSimulating || randomDirection}
                                    />
                                </div>
                            </div>

                            {/* Multi-particle options */}
                            <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
                                <div>
                                    <label className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Number of Particles</span>
                                        <span className="font-medium">{numParticles}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={numParticles}
                                        onChange={(e) => setNumParticles(parseInt(e.target.value))}
                                        className="w-full"
                                        disabled={isSimulating}
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={randomDirection}
                                        onChange={(e) => setRandomDirection(e.target.checked)}
                                        disabled={isSimulating}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-xs text-gray-600">Random directions</span>
                                </label>
                            </div>

                            <button
                                onClick={shootBeam}
                                disabled={isSimulating || placedBlocks.length === 0}
                                className={`w-full mt-4 py-3 rounded-lg font-medium text-sm transition-all ${isSimulating
                                    ? 'bg-yellow-400 text-yellow-900 cursor-wait'
                                    : placedBlocks.length === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                                    }`}
                            >
                                {isSimulating ? '⚡ Simulating...' : `🎯 Fire ${numParticles}× ${selectedParticle.symbol}`}
                            </button>
                        </Card>
                    )}

                    {/* Placed Blocks List */}
                    {editMode && placedBlocks.length > 0 && (
                        <Card>
                            <h3 className="font-medium mb-2 text-sm">Placed Blocks ({placedBlocks.length})</h3>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {placedBlocks.slice(-8).map(block => {
                                    const blockType = DETECTOR_BLOCK_TYPES.find(t => t.id === block.typeId);
                                    return (
                                        <div key={block.id} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded"
                                                    style={{ backgroundColor: blockType ? `#${blockType.color.toString(16).padStart(6, '0')}` : '#888' }}
                                                />
                                                <span className="text-gray-600 truncate">{blockType?.name}</span>
                                            </div>
                                            <button
                                                onClick={() => removeBlock(block.id)}
                                                className="text-red-400 hover:text-red-600 px-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                                {placedBlocks.length > 8 && (
                                    <div className="text-[10px] text-gray-400 text-center">
                                        +{placedBlocks.length - 8} more...
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Results */}
                    {hits.length > 0 && !editMode && (
                        <Card className="bg-yellow-50 border-yellow-200">
                            <h3 className="font-medium mb-2 text-sm text-yellow-900">Energy Deposits</h3>
                            <div className="text-2xl font-light text-yellow-800 mb-2">
                                {totalEnergy.toFixed(1)} GeV
                            </div>
                            <div className="text-xs text-yellow-700">
                                {hits.length} interactions recorded
                            </div>
                            <div className="mt-2 text-[10px] text-yellow-600">
                                {hits.filter(h => h.generation === 0).length} primary •
                                {hits.filter(h => h.generation > 0).length} secondary
                            </div>
                        </Card>
                    )}
                </div>

                {/* Main 3D Viewer */}
                <div className="flex-1 min-h-[500px]">
                    <Card className="h-full p-0 overflow-hidden bg-black">
                        <DetectorViewer3D
                            key={simulationKey}
                            placedBlocks={placedBlocks}
                            setPlacedBlocks={setPlacedBlocks}
                            selectedParticle={selectedParticle}
                            beamEnergy={beamEnergy}
                            beamTheta={beamTheta}
                            beamPhi={beamPhi}
                            isSimulating={isSimulating}
                            onSimulationComplete={handleSimulationComplete}
                            onHitsUpdate={handleHitsUpdate}
                            editMode={editMode}
                            numParticles={numParticles}
                            randomDirection={randomDirection}
                        />
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Link to={ROUTES.DASHBOARD}>
                    <button className="btn-secondary">← Dashboard</button>
                </Link>
                <Link to={ROUTES.DOCS + '/geant5'}>
                    <button className="btn-secondary">Geant5 Docs →</button>
                </Link>
            </div>
        </ScreenLayout>
    );
}
