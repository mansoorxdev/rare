'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Full-Viewport Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. Multi-Faceted Gemstone Geometry (True Brilliant Cut Emerald)
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    // Common Emerald Material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.7,
      ior: 1.58, // Emerald index of refraction
      thickness: 2.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xa7f3d0),
      flatShading: true,
      transparent: true,
      opacity: 0.96
    });

    // Wireframe edge glow material
    const edgesMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4ade80),
      linewidth: 2,
      transparent: true,
      opacity: 0.9
    });

    // PART A: Top Crown (Octagonal Beveled Table)
    // Cylinder: topRadius 0.75, bottomRadius 1.35, height 0.9, 8 sides
    const crownGeo = new THREE.CylinderGeometry(0.75, 1.35, 0.9, 8, 1);
    const crownMesh = new THREE.Mesh(crownGeo, crystalMat);
    crownMesh.position.y = 0.45;
    crystalGroup.add(crownMesh);

    const crownEdgesGeo = new THREE.EdgesGeometry(crownGeo);
    const crownEdgesMesh = new THREE.LineSegments(crownEdgesGeo, edgesMat);
    crownEdgesMesh.position.y = 0.45;
    crystalGroup.add(crownEdgesMesh);

    // PART B: Bottom Pavilion (Pointed culet cone)
    // Cone: radius 1.35, height 1.7, 8 sides
    const pavilionGeo = new THREE.ConeGeometry(1.35, 1.7, 8, 1);
    pavilionGeo.rotateX(Math.PI); // Invert so it points downwards
    const pavilionMesh = new THREE.Mesh(pavilionGeo, crystalMat);
    pavilionMesh.position.y = -0.85;
    crystalGroup.add(pavilionMesh);

    const pavilionEdgesGeo = new THREE.EdgesGeometry(pavilionGeo);
    const pavilionEdgesMesh = new THREE.LineSegments(pavilionEdgesGeo, edgesMat);
    pavilionEdgesMesh.position.y = -0.85;
    crystalGroup.add(pavilionEdgesMesh);

    // PART C: Glowing Internal Prismatic Core
    const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
    coreGeo.scale(0.8, 1.3, 0.8);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x86efac),
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = -0.1;
    crystalGroup.add(coreMesh);

    // PART D: Holographic Ambient Orbiting Ring
    const ringGeo = new THREE.TorusGeometry(2.4, 0.02, 16, 72);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x22c55e),
      transparent: true,
      opacity: 0.45
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.38;
    ringMesh.position.y = -0.1;
    crystalGroup.add(ringMesh);

    // 3. Cinematic 3D Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.4);
    scene.add(ambientLight);

    // Key Light (Top-Left Lime-Yellow)
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
    pointLight.position.set(0, -0.1, 0);
    scene.add(pointLight);

    // 4. Smooth Mouse Parallax & Continuous 3D Loop
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

      // Spin inner core & ring
      coreMesh.rotation.y = time * 0.7;
      ringMesh.rotation.z = time * 0.25;

      // Dynamic Scroll Transitions
      const p = scrollProgress;

      // Base rotations with mouse tilt
      let targetRotX = 0.22 + p * 1.3 - mouseY * 0.35;
      let targetRotY = time * 0.35 + mouseX * 0.5 + p * 1.6;
      let targetRotZ = p * 0.45;

      // Position calibrated so both top and bottom remain 100% visible
      let targetPosX = 0;
      let targetPosY = 0.15 + idleY;
      let targetPosZ = 0;

      if (p <= 0.25) {
        // Hero: perfectly centered
        targetPosX = 0;
        targetPosY = 0.15 + idleY;
      } else if (p <= 0.5) {
        // Stage 1: Horizon tilt onto 3D grid
        const stageP = (p - 0.25) / 0.25;
        targetPosX = -stageP * 2.0;
        targetPosY = 0.15 - stageP * 0.3 + idleY;
        targetRotX = 0.22 + stageP * 1.1;
      } else if (p <= 0.75) {
        // Stage 2: Tactical white radar mode
        const stageP = (p - 0.5) / 0.25;
        targetPosX = -2.0 + stageP * 2.0;
        targetPosY = -0.15 + stageP * 0.3 + idleY;
      } else {
        // Stage 3: Evidence alignment
        targetPosX = 0;
        targetPosY = 0.1 + idleY;
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
