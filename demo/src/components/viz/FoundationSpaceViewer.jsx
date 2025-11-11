import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LoopSubdivision } from 'three-subdivide';

export default function FoundationSpaceViewer({ 
  events, 
  surfaces, 
  simulatedEvents,
  showSimulatedEvents,
  calibrationRotation,
  timeOfDay,
  showSM,
  showProcesses,
  detectorFilter,
  showATLAS,
  showCMS 
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const pointCloudRef = useRef(null);
  const simulatedPointCloudRef = useRef(null);
  const smSurfaceRef = useRef(null);
  const processSurfacesRef = useRef([]);
  const autoRotateRef = useRef(true);
  const animationFrameRef = useRef(null);

  // Filter events by time and detector
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(e => {
      // Time filter: show events from 0 to current timeOfDay
      if (e.time > timeOfDay) return false;
      
      // Detector filter
      if (detectorFilter !== 'all' && e.detector !== detectorFilter) return false;
      if (!showATLAS && e.detector === 'ATLAS') return false;
      if (!showCMS && e.detector === 'CMS') return false;
      
      return true;
    });
  }, [events, timeOfDay, detectorFilter, showATLAS, showCMS]);

  // Use all events without downsampling
  const downsampledEvents = filteredEvents;

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(30, 30, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    
    // Stop auto-rotation on interaction
    controls.addEventListener('start', () => {
      autoRotateRef.current = false;
    });
    
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Auto-rotation
      if (autoRotateRef.current) {
        scene.rotation.y += 0.002;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update point cloud when filtered events change
  useEffect(() => {
    if (!sceneRef.current || !downsampledEvents.length) return;

    // Remove old point cloud
    if (pointCloudRef.current) {
      sceneRef.current.remove(pointCloudRef.current);
      pointCloudRef.current.geometry.dispose();
      pointCloudRef.current.material.dispose();
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(downsampledEvents.length * 3);
    const colors = new Float32Array(downsampledEvents.length * 3);

    const atlasColor = new THREE.Color(0xE63946); // Red
    const cmsColor = new THREE.Color(0x457B9D);   // Blue

    downsampledEvents.forEach((event, i) => {
      positions[i * 3] = event.x;
      positions[i * 3 + 1] = event.y;
      positions[i * 3 + 2] = event.z;

      const color = event.detector === 'ATLAS' ? atlasColor : cmsColor;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    // Create point cloud
    const pointCloud = new THREE.Points(geometry, material);
    sceneRef.current.add(pointCloud);
    pointCloudRef.current = pointCloud;
  }, [downsampledEvents]);

  // Filter simulated events by time and detector
  const filteredSimulatedEvents = useMemo(() => {
    if (!simulatedEvents || !showSimulatedEvents) return [];
    
    return simulatedEvents.filter(e => {
      // Time filter: show events from 0 to current timeOfDay
      if (e.time > timeOfDay) return false;
      
      // Detector filter
      if (detectorFilter !== 'all' && e.detector !== detectorFilter) return false;
      if (!showATLAS && e.detector === 'ATLAS') return false;
      if (!showCMS && e.detector === 'CMS') return false;
      
      return true;
    });
  }, [simulatedEvents, showSimulatedEvents, timeOfDay, detectorFilter, showATLAS, showCMS]);

  // Render simulated point cloud with rotation
  useEffect(() => {
    if (!sceneRef.current || !filteredSimulatedEvents.length) {
      // Remove simulated point cloud if it exists
      if (simulatedPointCloudRef.current) {
        sceneRef.current.remove(simulatedPointCloudRef.current);
        simulatedPointCloudRef.current.geometry.dispose();
        simulatedPointCloudRef.current.material.dispose();
        simulatedPointCloudRef.current = null;
      }
      return;
    }

    // Remove old simulated point cloud
    if (simulatedPointCloudRef.current) {
      sceneRef.current.remove(simulatedPointCloudRef.current);
      simulatedPointCloudRef.current.geometry.dispose();
      simulatedPointCloudRef.current.material.dispose();
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(filteredSimulatedEvents.length * 3);
    const colors = new Float32Array(filteredSimulatedEvents.length * 3);

    // Orange/yellow colors for simulated events
    const atlasSimColor = new THREE.Color(0xF59E0B); // Orange
    const cmsSimColor = new THREE.Color(0xFBBF24);   // Yellow

    filteredSimulatedEvents.forEach((event, i) => {
      positions[i * 3] = event.x;
      positions[i * 3 + 1] = event.y;
      positions[i * 3 + 2] = event.z;

      const color = event.detector === 'ATLAS' ? atlasSimColor : cmsSimColor;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material - slightly larger and more visible
    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    // Create point cloud with rotation group
    const pointCloud = new THREE.Points(geometry, material);
    
    // Apply calibration rotation
    // Data was rotated by +45° in the notebook, so it starts misaligned
    // During calibration, we rotate it by -45° to bring it back to alignment
    // calibrationRotation goes from 0 (not calibrated, 0° applied = stays at +45° from data) 
    //                           to 1 (fully calibrated, -45° applied = back to 0°)
    const rotationAngle = -(Math.PI / 4) * calibrationRotation; // 0° → -45°
    pointCloud.rotation.z = rotationAngle;
    
    sceneRef.current.add(pointCloud);
    simulatedPointCloudRef.current = pointCloud;
  }, [filteredSimulatedEvents, calibrationRotation]);

  // Update SM surface mesh
  useEffect(() => {
    if (!sceneRef.current || !surfaces) {
      console.log('SM mesh: waiting for scene or surfaces', { hasScene: !!sceneRef.current, hasSurfaces: !!surfaces });
      return;
    }

    // Remove old surface
    if (smSurfaceRef.current) {
      sceneRef.current.remove(smSurfaceRef.current);
      smSurfaceRef.current.geometry.dispose();
      smSurfaceRef.current.material.dispose();
      smSurfaceRef.current = null;
    }

    if (!showSM) {
      console.log('SM mesh: showSM is false, not rendering');
      return;
    }

    // Create mesh from surface data
    const smSurface = surfaces.sm_surface;
    console.log('SM mesh: surface data', { 
      hasSurface: !!smSurface, 
      hasVertices: !!smSurface?.vertices, 
      hasFaces: !!smSurface?.faces,
      vertexCount: smSurface?.vertices?.length,
      faceCount: smSurface?.faces?.length
    });
    if (!smSurface || !smSurface.vertices || !smSurface.faces) return;

    const geometry = new THREE.BufferGeometry();
    
    // Convert vertices array to Float32Array
    const vertexArray = smSurface.vertices;
    const positions = new Float32Array(vertexArray.length * 3);
    for (let i = 0; i < vertexArray.length; i++) {
      positions[i * 3] = vertexArray[i][0];
      positions[i * 3 + 1] = vertexArray[i][1];
      positions[i * 3 + 2] = vertexArray[i][2];
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Convert faces - these should already be indices into the vertices array
    const indices = new Uint32Array(smSurface.faces.flat());
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    
    // Apply Loop Subdivision for smooth geometry (adds vertices)
    const subdivisions = 2;  // Number of subdivision iterations (2 = 4x more faces)
    const smoothGeometry = LoopSubdivision.modify(geometry, subdivisions);
    
    // Smooth shading: compute vertex normals for interpolation across faces
    smoothGeometry.computeVertexNormals();

    // Material with transparency - increased opacity for visibility
    const material = new THREE.MeshPhongMaterial({
      color: 0x94A3B8,
      transparent: true,
      opacity: 0.4,  // Increased from 0.2 for better visibility
      side: THREE.DoubleSide,
      shininess: 100,  // Higher shininess makes smooth shading more visible
      flatShading: false,  // Smooth shading (interpolate normals across faces)
      wireframe: false,
      depthWrite: false,  // Prevent z-fighting with points
      emissive: 0x1a1a1a,  // Slight self-illumination to show shape
      specular: 0xffffff   // White specular highlights
    });

    const mesh = new THREE.Mesh(smoothGeometry, material);
    sceneRef.current.add(mesh);
    smSurfaceRef.current = mesh;
  }, [surfaces, showSM]);

  // Render individual process surfaces
  useEffect(() => {
    if (!sceneRef.current || !surfaces) return;

    // Remove old process surfaces
    processSurfacesRef.current.forEach(mesh => {
      sceneRef.current.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    processSurfacesRef.current = [];

    if (!showProcesses || !surfaces.process_surfaces) return;

    // Define colors for each process
    const processColors = {
      'QCD': 0x6B7280,      // Gray
      'Higgs': 0x10B981,    // Green
      'DiHiggs': 0x8B5CF6,  // Purple
      'Electroweak': 0xF59E0B, // Orange
      'Top': 0xEF4444       // Red
    };

    // Render each process surface
    Object.entries(surfaces.process_surfaces).forEach(([processName, surfaceData]) => {
      if (!surfaceData || !surfaceData.vertices || !surfaceData.faces) return;

      const geometry = new THREE.BufferGeometry();
      
      // Convert vertices
      const vertexArray = surfaceData.vertices;
      const positions = new Float32Array(vertexArray.length * 3);
      for (let i = 0; i < vertexArray.length; i++) {
        positions[i * 3] = vertexArray[i][0];
        positions[i * 3 + 1] = vertexArray[i][1];
        positions[i * 3 + 2] = vertexArray[i][2];
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      // Convert faces
      const indices = new Uint32Array(surfaceData.faces.flat());
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      
      // Apply Loop Subdivision for smooth geometry
      const subdivisions = 2;  // 2 iterations for smoother appearance
      const smoothGeometry = LoopSubdivision.modify(geometry, subdivisions);
      
      // Smooth shading
      smoothGeometry.computeVertexNormals();

      // Material with process-specific color and enhanced smoothing
      const material = new THREE.MeshPhongMaterial({
        color: processColors[processName] || 0x999999,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        shininess: 100,  // Higher shininess makes smooth shading more visible
        flatShading: false,  // Smooth shading (interpolate normals across faces)
        depthWrite: false,
        emissive: processColors[processName] || 0x999999,
        emissiveIntensity: 0.1,  // Slight self-glow
        specular: 0xffffff
      });

      const mesh = new THREE.Mesh(smoothGeometry, material);
      sceneRef.current.add(mesh);
      processSurfacesRef.current.push(mesh);
    });
  }, [surfaces, showProcesses]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mountRef} 
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }} 
      />
      
      {/* Detector Color Legend */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Detectors</div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>Real Data</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#E63946', borderRadius: '50%', marginRight: '8px' }} />
            <span>ATLAS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: '#457B9D', borderRadius: '50%', marginRight: '8px' }} />
            <span>CMS</span>
          </div>
        </div>
        {showSimulatedEvents && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>Simulated</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', background: '#F59E0B', borderRadius: '50%', marginRight: '8px' }} />
              <span>ATLAS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', background: '#FBBF24', borderRadius: '50%', marginRight: '8px' }} />
              <span>CMS</span>
            </div>
          </div>
        )}
      </div>

      {/* Process Surface Legend - Only show when processes are visible */}
      {showProcesses && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>SM Processes</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#6B7280', marginRight: '8px' }} />
            <span>QCD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#10B981', marginRight: '8px' }} />
            <span>Higgs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#8B5CF6', marginRight: '8px' }} />
            <span>Di-Higgs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#F59E0B', marginRight: '8px' }} />
            <span>Electroweak</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: '#EF4444', marginRight: '8px' }} />
            <span>Top</span>
          </div>
        </div>
      )}
    </div>
  );
}

