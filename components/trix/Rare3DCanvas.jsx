'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Raw 52-Facet Mineral Crystal Polyhedron Geometry (Authentic 3D Emerald Shard)
const CRYSTAL_VERTICES = new Float32Array([
  0.0, 1.4, -0.65, -0.85, 1.35, -0.3, 0.0, 2.2, 0.0,
  0.0, 1.4, -0.65, 0.85, 1.35, -0.3, 0.0, 2.2, 0.0,
  -0.85, -0.15, -0.55, -0.85, 1.35, -0.3, -1.18, 0.0, 0.0,
  -0.85, -0.15, -0.55, -1.02, -0.7, 0.0, -1.18, 0.0, 0.0,
  -0.85, -0.15, -0.55, -1.02, -0.7, 0.0, -0.68, -1.35, -0.28,
  0.85, -0.15, -0.55, 0.85, 1.35, -0.3, 1.18, 0.0, 0.0,
  0.85, -0.15, -0.55, 1.02, -0.7, 0.0, 1.18, 0.0, 0.0,
  0.85, -0.15, -0.55, 1.02, -0.7, 0.0, 0.68, -1.35, -0.28,
  0.0, -1.4, -0.52, 0.68, -1.35, -0.28, 0.0, -2.15, 0.0,
  0.0, -1.4, -0.52, -0.68, -1.35, -0.28, 0.0, -2.15, 0.0,
  0.0, -1.4, -0.52, 0.85, -0.15, -0.55, 0.68, -1.35, -0.28,
  0.0, -1.4, -0.52, -0.85, -0.15, -0.55, -0.68, -1.35, -0.28,
  0.65, 1.4, 0.4, 0.85, 1.35, -0.3, 0.0, 2.2, 0.0,
  0.65, 1.4, 0.4, 0.85, 1.35, -0.3, 1.18, 0.0, 0.0,
  -0.65, 1.4, 0.4, -0.85, 1.35, -0.3, -1.18, 0.0, 0.0,
  -0.65, 1.4, 0.4, -0.85, 1.35, -0.3, 0.0, 2.2, 0.0,
  -0.55, -1.4, 0.32, -0.68, -1.35, -0.28, 0.0, -2.15, 0.0,
  -0.55, -1.4, 0.32, -1.02, -0.7, 0.0, -0.68, -1.35, -0.28,
  0.55, -1.4, 0.32, 0.68, -1.35, -0.28, 0.0, -2.15, 0.0,
  0.55, -1.4, 0.32, 1.02, -0.7, 0.0, 0.68, -1.35, -0.28,
  0.0, -0.55, -0.75, 0.85, -0.15, -0.55, 0.0, 0.2, -0.85,
  0.0, -0.55, -0.75, 0.0, -1.4, -0.52, 0.85, -0.15, -0.55,
  0.0, -0.55, -0.75, -0.85, -0.15, -0.55, 0.0, 0.2, -0.85,
  0.0, -0.55, -0.75, 0.0, -1.4, -0.52, -0.85, -0.15, -0.55,
  0.0, 1.45, 0.65, 0.65, 1.4, 0.4, 0.0, 2.2, 0.0,
  0.0, 1.45, 0.65, -0.65, 1.4, 0.4, 0.0, 2.2, 0.0,
  -0.85, 0.25, 0.55, -0.65, 1.4, 0.4, -1.18, 0.0, 0.0,
  -0.85, 0.25, 0.55, 0.0, 1.45, 0.65, 0.0, 0.3, 0.85,
  -0.85, 0.25, 0.55, 0.0, 1.45, 0.65, -0.65, 1.4, 0.4,
  0.0, -1.45, 0.52, -0.55, -1.4, 0.32, 0.0, -2.15, 0.0,
  0.0, -1.45, 0.52, 0.55, -1.4, 0.32, 0.0, -2.15, 0.0,
  0.85, 0.25, 0.55, 0.65, 1.4, 0.4, 1.18, 0.0, 0.0,
  0.85, 0.25, 0.55, 0.0, 1.45, 0.65, 0.0, 0.3, 0.85,
  0.85, 0.25, 0.55, 0.0, 1.45, 0.65, 0.65, 1.4, 0.4,
  -0.75, -0.6, 0.45, -0.55, -1.4, 0.32, -1.02, -0.7, 0.0,
  -0.75, -0.6, 0.45, -1.02, -0.7, 0.0, -1.18, 0.0, 0.0,
  -0.75, -0.6, 0.45, -0.85, 0.25, 0.55, -1.18, 0.0, 0.0,
  0.75, -0.6, 0.45, 1.02, -0.7, 0.0, 1.18, 0.0, 0.0,
  0.75, -0.6, 0.45, 0.85, 0.25, 0.55, 1.18, 0.0, 0.0,
  0.75, -0.6, 0.45, 0.55, -1.4, 0.32, 1.02, -0.7, 0.0,
  0.0, -0.5, 0.78, 0.0, -1.45, 0.52, 0.55, -1.4, 0.32,
  0.0, -0.5, 0.78, 0.75, -0.6, 0.45, 0.55, -1.4, 0.32,
  0.0, -0.5, 0.78, 0.85, 0.25, 0.55, 0.0, 0.3, 0.85,
  0.0, -0.5, 0.78, 0.75, -0.6, 0.45, 0.85, 0.25, 0.55,
  0.0, -0.5, 0.78, -0.85, 0.25, 0.55, 0.0, 0.3, 0.85,
  0.0, -0.5, 0.78, -0.75, -0.6, 0.45, -0.85, 0.25, 0.55,
  0.0, -0.5, 0.78, 0.0, -1.45, 0.52, -0.55, -1.4, 0.32,
  0.0, -0.5, 0.78, -0.75, -0.6, 0.45, -0.55, -1.4, 0.32,
  -0.85, -0.15, -0.55, 0.0, 1.4, -0.65, -0.85, 1.35, -0.3,
  -0.85, -0.15, -0.55, 0.0, 1.4, -0.65, 0.0, 0.2, -0.85,
  0.85, -0.15, -0.55, 0.0, 1.4, -0.65, 0.0, 0.2, -0.85,
  0.85, -0.15, -0.55, 0.0, 1.4, -0.65, 0.85, 1.35, -0.3,
]);

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Full-Viewport Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // Procedural tactical reflection environment for gemstone refraction & specular glints
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    const envLight1 = new THREE.DirectionalLight(0xdcfce7, 4);
    envLight1.position.set(2, 4, 3);
    envScene.add(envLight1);
    const envLight2 = new THREE.DirectionalLight(0x059669, 3);
    envLight2.position.set(-3, -2, -2);
    envScene.add(envLight2);
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // 2. Real 3D Multi-Faceted Crystal Shard Assembly
    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(crystalGroup);

    // Build the faceted crystal buffer geometry
    const crystalGeo = new THREE.BufferGeometry();
    crystalGeo.setAttribute('position', new THREE.BufferAttribute(CRYSTAL_VERTICES, 3));
    crystalGeo.computeVertexNormals();

    // High-End Faceted Physical Emerald Glass Material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.5,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.62, // Raw Emerald Refractive Index
      thickness: 2.2,
      specularIntensity: 2.5,
      specularColor: new THREE.Color(0xd1fae5),
      flatShading: true, // Forces sharp planar reflection on each of the 52 facets!
      transparent: true,
      opacity: 0.95
    });

    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystalMesh);

    // Sharp glowing neon facet edges (traced along every crystal face)
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo, 10);
    const edgesMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4ade80),
      linewidth: 2,
      transparent: true,
      opacity: 0.9
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // Internal Luminescent Crystal Core (Nested glowing crystal)
    const coreGeo = new THREE.BufferGeometry();
    coreGeo.setAttribute('position', new THREE.BufferAttribute(CRYSTAL_VERTICES, 3));
    coreGeo.computeVertexNormals();
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x86efac),
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.scale.set(0.6, 0.6, 0.6);
    crystalGroup.add(coreMesh);

    // Tactical Radar Ambient Dust Particles floating in 3D
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(0x4ade80),
      size: 0.06,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 3. Cinematic 3D Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.5);
    scene.add(ambientLight);

    // Key Light (Top-Left Warm Lime)
    const keyLight = new THREE.DirectionalLight(0xbbf7d0, 2.8);
    keyLight.position.set(-6, 7, 5);
    scene.add(keyLight);

    // Fill Light (Bottom-Right Emerald)
    const fillLight = new THREE.DirectionalLight(0x10b981, 2.0);
    fillLight.position.set(6, -5, 4);
    scene.add(fillLight);

    // Rim Back Light (for silhouette separation)
    const rimLight = new THREE.DirectionalLight(0x22c55e, 1.5);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // Internal Point Light (Pulsating core)
    const pointLight = new THREE.PointLight(0x4ade80, 2.5, 8);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 4. Mouse Tracking & Continuous 3D Loop
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
      const time = clock.getElapsedTime();

      // Lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Gentle idle floating on Y axis (kept small so top and bottom never leave view!)
      const idleY = Math.sin(time * 1.4) * 0.08;

      // Spin inner core & radar dust particles
      coreMesh.rotation.y = time * 0.7;
      particleSystem.rotation.y = time * 0.05;
      particleSystem.rotation.x = Math.sin(time * 0.5) * 0.04;

      // Dynamic Scroll Transitions
      const p = scrollProgress;

      // Base rotations with mouse tilt (gentle vertical tilt so tips are never cropped)
      let targetRotX = 0.12 + p * 0.85 - mouseY * 0.25;
      let targetRotY = time * 0.35 + mouseX * 0.45 + p * 1.5;
      let targetRotZ = p * 0.25;

      // Position calibrated so both top and bottom tips remain 100% visible on all viewports
      let targetPosX = 0;
      let targetPosY = 0.08 + idleY;
      let targetPosZ = 0;

      if (p <= 0.25) {
        // Hero: perfectly centered
        targetPosX = 0;
        targetPosY = 0.08 + idleY;
      } else if (p <= 0.5) {
        // Stage 1: Horizon tilt onto 3D grid
        const stageP = (p - 0.25) / 0.25;
        targetPosX = -stageP * 1.8;
        targetPosY = 0.08 - stageP * 0.2 + idleY;
        targetRotX = 0.12 + stageP * 0.7;
      } else if (p <= 0.75) {
        // Stage 2: Tactical white radar mode
        const stageP = (p - 0.5) / 0.25;
        targetPosX = -1.8 + stageP * 1.8;
        targetPosY = -0.12 + stageP * 0.2 + idleY;
      } else {
        // Stage 3: Evidence alignment
        targetPosX = 0;
        targetPosY = 0.06 + idleY;
      }

      crystalGroup.rotation.x = THREE.MathUtils.lerp(crystalGroup.rotation.x, targetRotX, 0.08);
      crystalGroup.rotation.y = THREE.MathUtils.lerp(crystalGroup.rotation.y, targetRotY, 0.08);
      crystalGroup.rotation.z = THREE.MathUtils.lerp(crystalGroup.rotation.z, targetRotZ, 0.08);

      crystalGroup.position.x = THREE.MathUtils.lerp(crystalGroup.position.x, targetPosX, 0.08);
      crystalGroup.position.y = THREE.MathUtils.lerp(crystalGroup.position.y, targetPosY, 0.08);
      crystalGroup.position.z = THREE.MathUtils.lerp(crystalGroup.position.z, targetPosZ, 0.08);

      // Light mode material adaptation
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
      const w = window.innerWidth;
      const h = window.innerHeight;
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
      pmremGenerator.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, [scrollProgress, isLightMode]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden'
      }}
    />
  );
}
