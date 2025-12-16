import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

// Available detector block types for the palette (LEGO-style)
const DETECTOR_BLOCK_TYPES = [
    {
        id: 'tracker_block',
        name: 'Tracker Module',
        color: 0x3b82f6,
        size: { x: 4, y: 4, z: 2 },
        interactionLength: 50, // Radiation lengths - low interaction
        showerMultiplicity: [1, 2],
        energyLoss: 0.02,
        showerType: 'tracking'
    },
    {
        id: 'ecal_block',
        name: 'ECal Crystal',
        color: 0x10b981,
        size: { x: 3, y: 3, z: 6 },
        interactionLength: 1.0, // Short - dense material, high interaction
        showerMultiplicity: [3, 6],
        energyLoss: 0.5,
        showerType: 'em'
    },
    {
        id: 'hcal_block',
        name: 'HCal Tile',
        color: 0xf59e0b,
        size: { x: 5, y: 5, z: 8 },
        interactionLength: 1.5, // Medium interaction length
        showerMultiplicity: [2, 5],
        energyLoss: 0.6,
        showerType: 'hadronic'
    },
    {
        id: 'muon_block',
        name: 'Muon Chamber',
        color: 0x8b5cf6,
        size: { x: 6, y: 6, z: 3 },
        interactionLength: 20, // Long - only muons interact
        showerMultiplicity: [1, 2],
        energyLoss: 0.05,
        showerType: 'muon'
    },
    {
        id: 'magnet_block',
        name: 'Magnet Coil',
        color: 0xef4444,
        size: { x: 4, y: 4, z: 4 },
        interactionLength: 1000, // No particle interaction
        showerMultiplicity: [0, 0],
        energyLoss: 0,
        showerType: 'none',
        bendCharged: true
    }
];

const PARTICLES = [
    { id: 'electron', name: 'Electron', symbol: 'e⁻', color: 0x3b82f6, charge: -1, mass: 0.511, showerIn: ['em'], passesMuon: false },
    { id: 'photon', name: 'Photon', symbol: 'γ', color: 0x10b981, charge: 0, mass: 0, showerIn: ['em'], passesMuon: false },
    { id: 'muon', name: 'Muon', symbol: 'μ⁻', color: 0x8b5cf6, charge: -1, mass: 105.7, showerIn: [], passesMuon: true },
    { id: 'pion', name: 'Pion', symbol: 'π⁺', color: 0xf59e0b, charge: 1, mass: 139.6, showerIn: ['hadronic'], passesMuon: false },
    { id: 'proton', name: 'Proton', symbol: 'p', color: 0xec4899, charge: 1, mass: 938.3, showerIn: ['hadronic'], passesMuon: false },
    { id: 'neutron', name: 'Neutron', symbol: 'n', color: 0x6b7280, charge: 0, mass: 939.6, showerIn: ['hadronic'], passesMuon: false },
];

// Physics logging utility
const PhysicsLog = {
    enabled: true,
    interactions: [],

    log(message, data = {}) {
        if (!this.enabled) return;
        const entry = { time: Date.now(), message, ...data };
        this.interactions.push(entry);
        console.log(`[Physics] ${message}`, data);
    },

    summary() {
        console.log('\n=== PHYSICS SIMULATION SUMMARY ===');
        console.log(`Total interactions: ${this.interactions.length}`);

        const byType = {};
        this.interactions.forEach(i => {
            const key = `${i.particleType || 'unknown'} → ${i.blockType || 'unknown'}`;
            byType[key] = (byType[key] || 0) + 1;
        });
        console.log('Interactions by type:', byType);
        console.log('===================================\n');
    },

    clear() {
        this.interactions = [];
    }
};

// 3D Particle with realistic physics
class Particle3D {
    constructor({ position, velocity, energy, generation, colorHue, particleType, maxLifetime, id }) {
        this.id = id || Math.random().toString(36).substr(2, 9);
        this.position = position.clone();
        this.origin = position.clone();
        this.velocity = velocity.clone();
        this.energy = energy;
        this.generation = generation;
        this.colorHue = colorHue;
        this.particleType = particleType;
        this.maxLifetime = maxLifetime;
        this.lifetime = maxLifetime;
        this.dead = false;
        this.trail = [position.clone()];
        this.pathLengthInMaterial = {}; // Track path length per block
        this.hasShoweredIn = new Set(); // Blocks where showered
        this.enteredBlocks = new Set(); // Track which blocks we've entered for logging
    }

    get momentum() {
        return this.velocity.length();
    }

    update() {
        this.position.add(this.velocity);
        this.lifetime--;
        this.trail.push(this.position.clone());

        if (this.trail.length > 80) {
            this.trail.shift();
        }

        if (this.lifetime <= 0 || this.energy <= 0.5) {
            this.dead = true;
        }
    }
}

export default function DetectorViewer3D({
    placedBlocks,
    setPlacedBlocks,
    selectedParticle,
    beamEnergy,
    beamTheta,
    beamPhi,
    isSimulating,
    onSimulationComplete,
    onHitsUpdate,
    editMode,
    numParticles = 1,
    randomDirection = false
}) {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const dragControlsRef = useRef(null);
    const animationFrameRef = useRef(null);
    const simulationFrameRef = useRef(null);
    const blockMeshesRef = useRef([]);
    const particleObjectsRef = useRef([]);
    const trailLinesRef = useRef([]);
    const hitMarkersRef = useRef([]);
    const particlesRef = useRef([]);

    // Initialize scene
    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            60,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(30, 25, 30);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 15;
        controls.maxDistance = 100;
        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(20, 30, 20);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Ground grid
        const gridHelper = new THREE.GridHelper(60, 30, 0x333333, 0x1a1a1a);
        scene.add(gridHelper);

        // Beam line indicator
        const beamGeom = new THREE.CylinderGeometry(0.1, 0.1, 60, 8);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
        const beam = new THREE.Mesh(beamGeom, beamMat);
        beam.rotation.x = Math.PI / 2;
        scene.add(beam);

        // Interaction point sphere
        const ipGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const ipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const ip = new THREE.Mesh(ipGeom, ipMat);
        scene.add(ip);

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (simulationFrameRef.current) cancelAnimationFrame(simulationFrameRef.current);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    // Update block meshes when placedBlocks change
    useEffect(() => {
        if (!sceneRef.current) return;

        // Clear old meshes
        blockMeshesRef.current.forEach(mesh => {
            sceneRef.current.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        blockMeshesRef.current = [];

        // Create meshes for placed blocks
        placedBlocks.forEach(block => {
            const blockType = DETECTOR_BLOCK_TYPES.find(t => t.id === block.typeId);
            if (!blockType) return;

            const geometry = new THREE.BoxGeometry(blockType.size.x, blockType.size.y, blockType.size.z);
            const material = new THREE.MeshPhongMaterial({
                color: blockType.color,
                transparent: true,
                opacity: 0.7,
                shininess: 50
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(block.position.x, block.position.y, block.position.z);
            mesh.userData = { blockId: block.id, blockType: blockType };
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Add edges for LEGO look
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            const wireframe = new THREE.LineSegments(edges, lineMaterial);
            mesh.add(wireframe);

            sceneRef.current.add(mesh);
            blockMeshesRef.current.push(mesh);
        });

        // Setup drag controls in edit mode
        if (editMode && dragControlsRef.current) {
            dragControlsRef.current.dispose();
        }

        if (editMode && rendererRef.current && cameraRef.current && blockMeshesRef.current.length > 0) {
            const dragControls = new DragControls(
                blockMeshesRef.current,
                cameraRef.current,
                rendererRef.current.domElement
            );

            dragControls.addEventListener('dragstart', () => {
                controlsRef.current.enabled = false;
            });

            dragControls.addEventListener('dragend', (event) => {
                controlsRef.current.enabled = true;
                const mesh = event.object;
                const blockId = mesh.userData.blockId;

                // Snap to grid
                const snappedPos = {
                    x: Math.round(mesh.position.x / 2) * 2,
                    y: Math.max(2, Math.round(mesh.position.y / 2) * 2),
                    z: Math.round(mesh.position.z / 2) * 2
                };
                mesh.position.set(snappedPos.x, snappedPos.y, snappedPos.z);

                // Update placed blocks
                setPlacedBlocks(prev => prev.map(b =>
                    b.id === blockId ? { ...b, position: snappedPos } : b
                ));
            });

            dragControlsRef.current = dragControls;
        }

    }, [placedBlocks, editMode, setPlacedBlocks]);

    // Spawn shower particles with proper physics
    const spawnShower = useCallback((parent, block, interactionPoint) => {
        const blockType = block;
        const [minDaughters, maxDaughters] = blockType.showerMultiplicity;
        if (maxDaughters === 0) return [];

        const count = Math.floor(minDaughters + Math.random() * (maxDaughters - minDaughters + 1));
        const daughters = [];

        const baseDir = parent.velocity.clone().normalize();
        const parentEnergy = parent.energy;
        const spreadAngle = Math.PI / 4; // 45 degree cone

        PhysicsLog.log(`Shower created: ${count} daughters`, {
            particleType: parent.particleType.name,
            blockType: blockType.name,
            parentEnergy,
            generation: parent.generation
        });

        for (let i = 0; i < count; i++) {
            // Random direction within cone
            const theta = Math.random() * spreadAngle;
            const phi = Math.random() * Math.PI * 2;

            // Create rotation axis perpendicular to base direction
            const up = new THREE.Vector3(0, 1, 0);
            const axis = up.clone().cross(baseDir);
            if (axis.length() < 0.01) axis.set(1, 0, 0);
            axis.normalize();

            const direction = baseDir.clone()
                .applyAxisAngle(axis, theta)
                .applyAxisAngle(baseDir, phi)
                .normalize();

            // Energy fraction decreases with each daughter
            const energyFraction = (0.1 + Math.random() * 0.4) * parentEnergy / count;
            const speed = parent.momentum * (0.3 + Math.random() * 0.4);

            daughters.push(new Particle3D({
                position: interactionPoint.clone(),
                velocity: direction.multiplyScalar(speed),
                energy: energyFraction,
                generation: parent.generation + 1,
                colorHue: (parent.colorHue + 0.1 + Math.random() * 0.1) % 1,
                particleType: parent.particleType,
                maxLifetime: 150 + Math.random() * 100
            }));
        }

        return daughters;
    }, []);

    // Create initial particles (supports multiple particles with random directions)
    const createInitialParticles = useCallback(() => {
        const particles = [];

        for (let i = 0; i < numParticles; i++) {
            let thetaRad, phiRad;

            if (randomDirection) {
                // Random direction in hemisphere (theta: 20-80 degrees, phi: 0-360)
                thetaRad = (20 + Math.random() * 60) * Math.PI / 180;
                phiRad = Math.random() * 2 * Math.PI;
            } else {
                thetaRad = (beamTheta * Math.PI) / 180;
                phiRad = (beamPhi * Math.PI) / 180;
            }

            const dirX = Math.sin(thetaRad) * Math.cos(phiRad);
            const dirY = Math.sin(thetaRad) * Math.sin(phiRad);
            const dirZ = Math.cos(thetaRad);

            const direction = new THREE.Vector3(dirX, dirY, dirZ).normalize();
            const speed = 0.4 + beamEnergy / 300;

            particles.push(new Particle3D({
                position: new THREE.Vector3(0, 0, 0),
                velocity: direction.multiplyScalar(speed),
                energy: beamEnergy,
                generation: 0,
                colorHue: (i / numParticles + Math.random() * 0.1) % 1, // Different colors for each
                particleType: selectedParticle,
                maxLifetime: 350
            }));

            PhysicsLog.log(`Primary particle ${i + 1}/${numParticles} created`, {
                particleType: selectedParticle.name,
                energy: beamEnergy,
                theta: randomDirection ? 'random' : beamTheta,
                phi: randomDirection ? 'random' : beamPhi
            });
        }

        return particles;
    }, [numParticles, randomDirection, beamTheta, beamPhi, beamEnergy, selectedParticle]);

    // Run simulation with path-length-based physics
    useEffect(() => {
        if (!isSimulating || !sceneRef.current) return;

        // Clear physics log
        PhysicsLog.clear();
        PhysicsLog.log('=== SIMULATION STARTED ===', {
            particleType: selectedParticle.name,
            energy: beamEnergy,
            numParticles,
            randomDirection,
            numBlocks: placedBlocks.length
        });

        // Clear previous vis
        [...particleObjectsRef.current, ...trailLinesRef.current, ...hitMarkersRef.current].forEach(obj => {
            sceneRef.current.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        particleObjectsRef.current = [];
        trailLinesRef.current = [];
        hitMarkersRef.current = [];

        // Create initial particles
        const initialParticles = createInitialParticles();
        particlesRef.current = initialParticles;

        // Track ALL particles for trail rendering (including dead ones)
        const allParticlesHistory = [...initialParticles];

        const allHits = [];
        let frameCount = 0;

        const createVisual = (particle) => {
            const size = Math.max(0.12, 0.35 - particle.generation * 0.08);
            const geom = new THREE.SphereGeometry(size, 10, 10);
            const color = new THREE.Color().setHSL(particle.colorHue, 0.95, 0.6);
            const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(particle.position);
            sceneRef.current.add(mesh);
            particleObjectsRef.current.push(mesh);
        };

        const createTrail = (particle, permanent = false) => {
            if (particle.trail.length < 2) return;
            const pts = [...particle.trail]; // Use full trail
            const geom = new THREE.BufferGeometry().setFromPoints(pts);
            const color = new THREE.Color().setHSL(particle.colorHue, 0.85, 0.55);
            const mat = new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity: permanent ? 0.8 : 0.5 // Permanent trails are more visible
            });
            const line = new THREE.Line(geom, mat);
            sceneRef.current.add(line);
            trailLinesRef.current.push(line);
        };

        const createHit = (pos, energy) => {
            const size = Math.min(1.2, 0.2 + energy / 50);
            const geom = new THREE.SphereGeometry(size, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.75 });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(pos);
            sceneRef.current.add(mesh);
            hitMarkersRef.current.push(mesh);
        };

        const simulationLoop = () => {
            if (frameCount >= 400 || particlesRef.current.filter(p => !p.dead).length === 0) {
                // Create final permanent trails for ALL particles (including dead ones)
                // First clear temporary trails
                trailLinesRef.current.forEach(obj => {
                    sceneRef.current.remove(obj);
                    obj.geometry.dispose();
                    obj.material.dispose();
                });
                trailLinesRef.current = [];

                // Create permanent visible trails for every particle that was tracked
                allParticlesHistory.forEach(p => createTrail(p, true));

                onHitsUpdate(allHits);
                PhysicsLog.log('=== SIMULATION COMPLETE ===', {
                    totalHits: allHits.length,
                    framesRun: frameCount,
                    totalParticles: allParticlesHistory.length
                });
                PhysicsLog.summary();
                onSimulationComplete();
                return;
            }

            frameCount++;
            const newParticles = [];

            // Clear particle visuals for update
            particleObjectsRef.current.forEach(obj => {
                sceneRef.current.remove(obj);
                obj.geometry.dispose();
                obj.material.dispose();
            });
            particleObjectsRef.current = [];

            // Update trails periodically
            if (frameCount % 8 === 0) {
                trailLinesRef.current.forEach(obj => {
                    sceneRef.current.remove(obj);
                    obj.geometry.dispose();
                    obj.material.dispose();
                });
                trailLinesRef.current = [];
                particlesRef.current.filter(p => !p.dead).forEach(p => createTrail(p));
            }

            particlesRef.current.forEach(particle => {
                particle.update();
                if (particle.dead) return;

                createVisual(particle);

                // Check intersection with each placed block
                placedBlocks.forEach(block => {
                    const blockType = DETECTOR_BLOCK_TYPES.find(t => t.id === block.typeId);
                    if (!blockType) return;
                    if (particle.hasShoweredIn.has(block.id)) return;

                    // AABB collision check
                    const halfX = blockType.size.x / 2;
                    const halfY = blockType.size.y / 2;
                    const halfZ = blockType.size.z / 2;

                    const inBlock =
                        particle.position.x >= block.position.x - halfX &&
                        particle.position.x <= block.position.x + halfX &&
                        particle.position.y >= block.position.y - halfY &&
                        particle.position.y <= block.position.y + halfY &&
                        particle.position.z >= block.position.z - halfZ &&
                        particle.position.z <= block.position.z + halfZ;

                    if (inBlock) {
                        // Log first entry into block
                        if (!particle.enteredBlocks.has(block.id)) {
                            particle.enteredBlocks.add(block.id);
                            PhysicsLog.log(`Particle entered block`, {
                                particleType: particle.particleType.name,
                                blockType: blockType.name,
                                blockShowerType: blockType.showerType,
                                particleShowerIn: particle.particleType.showerIn,
                                canShowerHere: particle.particleType.showerIn.includes(blockType.showerType),
                                isMuon: particle.particleType.passesMuon,
                                generation: particle.generation
                            });
                        }

                        // Track path length through this block
                        const pathKey = block.id;
                        particle.pathLengthInMaterial[pathKey] =
                            (particle.pathLengthInMaterial[pathKey] || 0) + particle.momentum;

                        // Probability increases with path length (exponential absorption)
                        const pathLength = particle.pathLengthInMaterial[pathKey];
                        const interactionProb = 1 - Math.exp(-pathLength / blockType.interactionLength);

                        // Check if particle type should shower in this block type
                        const canShower = particle.particleType.showerIn.includes(blockType.showerType);

                        // Muons pass through almost everything
                        const isMuon = particle.particleType.passesMuon;
                        const effectiveProb = isMuon ? interactionProb * 0.01 : interactionProb;

                        // Log probability periodically
                        if (frameCount % 20 === 0 && pathLength > 0.5) {
                            PhysicsLog.log(`Interaction check`, {
                                particleType: particle.particleType.name,
                                blockType: blockType.name,
                                pathLength: pathLength.toFixed(2),
                                interactionLength: blockType.interactionLength,
                                rawProb: interactionProb.toFixed(3),
                                effectiveProb: effectiveProb.toFixed(3),
                                canShower,
                                isMuon
                            });
                        }

                        if (canShower && particle.generation < 3 && Math.random() < effectiveProb) {
                            particle.hasShoweredIn.add(block.id);

                            PhysicsLog.log(`*** SHOWER OCCURRED ***`, {
                                particleType: particle.particleType.name,
                                blockType: blockType.name,
                                pathLength: pathLength.toFixed(2),
                                probability: effectiveProb.toFixed(3),
                                energy: particle.energy.toFixed(1)
                            });

                            // Create shower
                            const daughters = spawnShower(particle, blockType, particle.position);
                            newParticles.push(...daughters);

                            // Energy deposit
                            const depositedEnergy = particle.energy * blockType.energyLoss;
                            createHit(particle.position.clone(), depositedEnergy);

                            allHits.push({
                                x: particle.position.x,
                                y: particle.position.y,
                                z: particle.position.z,
                                blockType: blockType.name,
                                particleType: particle.particleType.name,
                                energy: depositedEnergy,
                                generation: particle.generation
                            });

                            particle.energy *= (1 - blockType.energyLoss);
                            particle.lifetime = Math.min(particle.lifetime, 50);

                            // Kill low energy particles
                            if (particle.energy < 1) {
                                particle.dead = true;
                            }
                        }

                        // Magnetic field bends charged particles
                        if (blockType.bendCharged && particle.particleType.charge !== 0) {
                            const bendStrength = 0.02 * particle.particleType.charge;
                            const perpendicular = new THREE.Vector3(-particle.velocity.z, 0, particle.velocity.x).normalize();
                            particle.velocity.add(perpendicular.multiplyScalar(bendStrength));
                            particle.velocity.normalize().multiplyScalar(particle.momentum);
                        }
                    }
                });

                // Escape check
                if (particle.position.length() > 40) {
                    particle.dead = true;
                }
            });

            // Add new particles to history (for permanent trails)
            allParticlesHistory.push(...newParticles);

            particlesRef.current = particlesRef.current.filter(p => !p.dead).concat(newParticles);
            simulationFrameRef.current = requestAnimationFrame(simulationLoop);
        };

        simulationLoop();

        return () => {
            if (simulationFrameRef.current) cancelAnimationFrame(simulationFrameRef.current);
        };
    }, [isSimulating, selectedParticle, beamEnergy, beamTheta, beamPhi, placedBlocks, numParticles, randomDirection, spawnShower, createInitialParticles, onSimulationComplete, onHitsUpdate]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }} />

            {/* Mode indicator */}
            <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: editMode ? 'rgba(59, 130, 246, 0.9)' : 'rgba(0, 0, 0, 0.85)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#ffffff'
            }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {editMode ? '🔧 Build Mode' : '⚡ Simulation Mode'}
                </div>
                <div style={{ opacity: 0.7 }}>
                    {editMode ? 'Drag blocks to position' : `${numParticles}× ${selectedParticle.symbol}`}
                </div>
            </div>

            {/* Block count */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#9ca3af'
            }}>
                {placedBlocks.length} blocks • Check console for physics logs
            </div>

            {/* Simulation indicator */}
            {isSimulating && (
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(251, 191, 36, 0.9)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#000'
                }}>
                    <div style={{ fontWeight: 600 }}>⚡ Simulating</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                        {numParticles}× {selectedParticle.symbol} @ {beamEnergy} GeV
                    </div>
                </div>
            )}
        </div>
    );
}

export { DETECTOR_BLOCK_TYPES, PARTICLES };
