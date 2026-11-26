'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // 2. Faceted 3D Emerald Crystal Geometry
    // We create a dual-pyramid / faceted crystal using Octahedron / custom vertices
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    // Main Crystal Body
    const crystalGeo = new THREE.OctahedronGeometry(2.2, 0);
    // Scale vertically to make it an elongated emerald gemstone
    crystalGeo.scale(0.85, 1.45, 0.75);

    // Faceted Emerald Glass Material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.65,
      ior: 1.58, // Emerald index of refraction
      thickness: 1.8,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0x86efac),
      flatShading: true,
      transparent: true,
      opacity: 0.95
    });

    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystalMesh);

    // Razor-sharp Cyber Wireframe Edge Glow
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4ade80),
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // Glowing Inner Core Point
    const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
    coreGeo.scale(0.8, 1.3, 0.7);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x86efac),
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    crystalGroup.add(coreMesh);

    // Holographic Orbiting Ring
    const ringGeo = new THREE.TorusGeometry(2.8, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x22c55e),
      transparent: true,
      opacity: 0.45
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.4;
    crystalGroup.add(ringMesh);

    // 3. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x052e16, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xa3e635, 2.5); // Warm lime key light
    dirLight1.position.set(-5, 6, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.8); // Fill light
    dirLight2.position.set(5, -4, 3);
    scene.add(dirLight2);

    const innerPointLight = new THREE.PointLight(0x22c55e, 3.0, 10);
    innerPointLight.position.set(0, 0, 0);
    scene.add(innerPointLight);

    // 4. Mouse Tracking & Animation
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Base idle breathing rotation
      const idleFloat = Math.sin(time * 1.5) * 0.12;

      // Rotate inner core & ring
      coreMesh.rotation.y = time * 0.8;
      ringMesh.rotation.z = time * 0.3;

      // Dynamic Scroll Transitions
      // At scrollProgress = 0: Upright floating
      // At scrollProgress = 0.35: Tilts flat on floor horizon
      // At scrollProgress = 0.65: Rises in tactical white mode
      // At scrollProgress = 0.9: Aligns cleanly
      const p = scrollProgress;

      let targetRotX = 0.2 + p * 1.4 - mouseY * 0.4;
      let targetRotY = time * 0.4 + mouseX * 0.6 + p * 1.8;
      let targetRotZ = p * 0.6;
      let targetPosX = 0;
      let targetPosY = idleFloat;
      let targetPosZ = 0;

      if (p <= 0.25) {
        // Hero upright
        targetPosX = 0;
        targetPosY = idleFloat;
      } else if (p <= 0.5) {
        // Tilt onto grid
        const stageP = (p - 0.25) / 0.25;
        targetPosX = -stageP * 2.2;
        targetPosY = -stageP * 0.6 + idleFloat;
        targetRotX = 0.2 + stageP * 1.2;
      } else if (p <= 0.75) {
        // Tactical white mode
        const stageP = (p - 0.5) / 0.25;
        targetPosX = -2.2 + stageP * 2.2;
        targetPosY = -0.6 + stageP * 0.8 + idleFloat;
      } else {
        // Aligned at bottom
        targetPosX = 0;
        targetPosY = 0.2 + idleFloat;
      }

      crystalGroup.rotation.x = THREE.MathUtils.lerp(crystalGroup.rotation.x, targetRotX, 0.1);
      crystalGroup.rotation.y = THREE.MathUtils.lerp(crystalGroup.rotation.y, targetRotY, 0.1);
      crystalGroup.rotation.z = THREE.MathUtils.lerp(crystalGroup.rotation.z, targetRotZ, 0.1);

      crystalGroup.position.x = THREE.MathUtils.lerp(crystalGroup.position.x, targetPosX, 0.1);
      crystalGroup.position.y = THREE.MathUtils.lerp(crystalGroup.position.y, targetPosY, 0.1);
      crystalGroup.position.z = THREE.MathUtils.lerp(crystalGroup.position.z, targetPosZ, 0.1);

      // Light mode material tweak
      if (isLightMode) {
        crystalMat.color.setHex(0x059669);
        crystalMat.emissive.setHex(0x047857);
        edgesMat.color.setHex(0x047857);
      } else {
        crystalMat.color.setHex(0x10b981);
        crystalMat.emissive.setHex(0x064e3b);
        edgesMat.color.setHex(0x4ade80);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 500;
      const h = mount.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scrollProgress, isLightMode]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '560px',
        height: '560px',
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      />
    </div>
  );
}
