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

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. Exact 3D Raw Crystal Shard Geometry (Matching RARE Logo Profile)
    const crystalGroup = new THREE.Group();
    // Calibrated scale so both top peak and bottom tip always have 25%+ vertical margin
    crystalGroup.scale.set(0.82, 0.82, 0.82);
    scene.add(crystalGroup);

    // Build the 2D polygon path traced from the RARE raw crystal logo
    const crystalShape = new THREE.Shape();
    const rawPoints = [
      [1.11, -0.0],
      [1.054, -0.166],
      [1.016, -0.329],
      [0.98, -0.5],
      [0.977, -0.71],
      [0.97, -0.97],
      [0.903, -1.243],
      [0.753, -1.478],
      [0.541, -1.664],
      [0.289, -1.835],
      [0.0, -1.924],       // Bottom sharp crystal culet/tip
      [-0.299, -1.882],
      [-0.559, -1.72],
      [-0.758, -1.486],
      [-0.899, -1.236],
      [-0.977, -0.975],
      [-1.024, -0.743],
      [-1.062, -0.541],
      [-1.087, -0.352],
      [-1.121, -0.176],
      [-1.151, -0.0],
      [-1.171, 0.186],
      [-1.182, 0.385],
      [-1.157, 0.59],
      [-1.092, 0.792],
      [-0.99, 0.99],
      [-0.852, 1.171],
      [-0.691, 1.356],
      [-0.511, 1.572],
      [-0.284, 1.795],
      [-0.002, 1.915],     // Top sharp crystal peak
      [0.294, 1.859],
      [0.536, 1.651],
      [0.715, 1.407],
      [0.865, 1.192],
      [0.993, 0.995],
      [1.097, 0.797],
      [1.171, 0.598],
      [1.187, 0.386],
      [1.161, 0.184]
    ];

    crystalShape.moveTo(rawPoints[0][0], rawPoints[0][1]);
    for (let i = 1; i < rawPoints.length; i++) {
      crystalShape.lineTo(rawPoints[i][0], rawPoints[i][1]);
    }
    crystalShape.closePath();

    // 3D Extrusion with sharp facet chamfers (giving real crystalline faces)
    const extrudeSettings = {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 1, // 1 segment = crisp, flat crystalline facets
      bevelSize: 0.32,
      bevelThickness: 0.42
    };

    const crystalGeo = new THREE.ExtrudeGeometry(crystalShape, extrudeSettings);
    // Center the geometry origin exactly
    crystalGeo.center();

    // Faceted Emerald Physical Glass Material with high transmission and internal glow
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.08,
      transmission: 0.68,
      ior: 1.58, // Emerald index of refraction
      thickness: 2.4,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xa7f3d0),
      flatShading: true, // Crucial for facet reflections
      transparent: true,
      opacity: 0.96
    });

    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystalMesh);

    // Glowing Neon Cybernetic Edge Lines on facet intersections
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo, 14);
    const edgesMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4ade80),
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // Internal Luminescent Crystal Core (Refracted inner light)
    const coreGeo = new THREE.OctahedronGeometry(0.75, 0);
    coreGeo.scale(0.65, 1.45, 0.38);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x86efac),
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
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
