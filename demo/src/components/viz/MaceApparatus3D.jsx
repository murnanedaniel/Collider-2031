import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// CAD viewer for the MACE apparatus (doc §3.3, §5.6 Phase 2):
// an outer grounded shell, the high-voltage accumulator shell, a central Paul
// trap (ring electrodes + endcaps), and a single laser-cooled Ca⁺ ion.
export default function MaceApparatus3D() {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
      setFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(6, 4, 7);
    camera.lookAt(0, 0, 0);

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 18;
    let autoRotate = true;
    controls.addEventListener('start', () => { autoRotate = false; });

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(8, 10, 6);
    scene.add(dir);

    const apparatus = new THREE.Group();
    scene.add(apparatus);

    // Outer grounded shell — wireframe sphere
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(3, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x9ca3af, wireframe: true, transparent: true, opacity: 0.35 }),
    );
    apparatus.add(outer);

    // Accumulator shell — translucent blue sphere (1–5 MV)
    const accum = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
    );
    apparatus.add(accum);
    const accumWire = new THREE.Mesh(
      new THREE.SphereGeometry(2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.25 }),
    );
    apparatus.add(accumWire);

    // Paul trap — two ring electrodes + two endcaps
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x374151 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 12, 40), ringMat);
    ring.rotation.x = Math.PI / 2;
    apparatus.add(ring);
    const endcapMat = new THREE.MeshPhongMaterial({ color: 0x6b7280 });
    const endTop = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), endcapMat);
    endTop.position.y = 0.5;
    const endBot = endTop.clone();
    endBot.position.y = -0.5;
    apparatus.add(endTop, endBot);

    // Single laser-cooled Ca⁺ ion at the center (glowing, pulsing)
    const ion = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.8 }),
    );
    apparatus.add(ion);

    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.05;
      if (autoRotate) apparatus.rotation.y += 0.004;
      const s = 1 + 0.25 * Math.sin(t * 2);
      ion.scale.setScalar(s);
      ion.material.emissiveIntensity = 0.6 + 0.4 * Math.abs(Math.sin(t * 2));
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    };
  }, []);

  if (failed) {
    return (
      <div className="h-full w-full rounded bg-gray-50 flex items-center justify-center text-center px-4">
        <div className="text-xs text-gray-500">
          MACE apparatus · nested grounded + accumulator shells (1–5 MV) around a Paul trap holding a single Ca⁺ ion.
          <div className="mt-1 text-gray-400">(3D view unavailable in this environment)</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full rounded" />
      <div className="absolute top-2 left-2 text-[10px] text-gray-500 space-y-0.5 pointer-events-none">
        <div><span className="inline-block w-2 h-2 mr-1 align-middle" style={{ background: '#9ca3af' }} />Outer shell (grounded)</div>
        <div><span className="inline-block w-2 h-2 mr-1 align-middle" style={{ background: '#3b82f6' }} />Accumulator · 1–5 MV</div>
        <div><span className="inline-block w-2 h-2 mr-1 align-middle" style={{ background: '#374151' }} />Paul trap</div>
        <div><span className="inline-block w-2 h-2 mr-1 align-middle" style={{ background: '#f59e0b' }} />single Ca⁺ ion</div>
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 pointer-events-none">drag to rotate</div>
    </div>
  );
}
