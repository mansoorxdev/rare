'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Assigns exact facet colors matching the official RARE logo (rare-logo-icon.png):
 * - Top-Right Facet: Warm Golden Lime / Sunlight Glint (RGB: 0.82, 0.96, 0.22)
 * - Left Side Facets: Deep Obsidian Dark Emerald Shadows (RGB: 0.01, 0.12, 0.05)
 * - Front Center Facet: Intense Radioactive Neon Emerald (RGB: 0.06, 0.94, 0.40)
 * - Bottom Chisel Tip: Glowing Pure White / Mint Caustics (RGB: 0.94, 0.99, 0.95)
 * - Right Side Facets: Deep Rich Cut Emerald (RGB: 0.03, 0.65, 0.28)
 * - Back Facets: Dark Emerald Glass (RGB: 0.02, 0.22, 0.09)
 */
function getLogoFacetColor(cx, cy, cz) {
  // 1. Bottom tip caustic highlight (Bright glowing white/mint)
  if (cy < -1.5 && cz > -0.2) {
    return [0.95, 1.0, 0.96];
  }
  // 2. Top-Right facet (Golden lime sunlight highlight)
  if (cy > 0.6 && cx > 0.05 && cz > -0.3) {
    return [0.82, 0.96, 0.22];
  }
  // 3. Left deep obsidian dark emerald shadow (High contrast darks)
  if (cx < -0.25) {
    return [0.01, 0.12, 0.05];
  }
  // 4. Center front glowing neon emerald
  if (cz > 0.35 && cy >= -1.5 && cy <= 0.6) {
    return [0.06, 0.94, 0.40];
  }
  // 5. Right side rich emerald
  if (cx > 0.3) {
    return [0.03, 0.65, 0.28];
  }
  // 6. Back & side shadows
  return [0.02, 0.22, 0.09];
}

/**
 * Creates authentic 3D faceted mineral crystal geometry
 * with 36 precise triangular facets and per-facet vertex colors
 * matching the RARE brand logo palette.
 */
function createPure3DCrystalGeometry() {
  const geo = new THREE.BufferGeometry();
  const yTop = 2.45;
  const yBot = -2.45;

  const ring1Y = [1.4, 1.15, 1.5, 1.2, 1.45, 1.1];
  const ring1R = [1.05, 1.2, 1.1, 1.25, 1.05, 1.15];

  const ring2Y = [0.05, -0.15, 0.1, -0.1, 0.05, -0.2];
  const ring2R = [1.15, 1.25, 1.2, 1.3, 1.1, 1.2];

  const ring3Y = [-1.3, -1.5, -1.25, -1.45, -1.35, -1.5];
  const ring3R = [0.95, 1.05, 0.9, 1.1, 0.95, 1.0];

  const positions = [];
  const colors = [];

  const addTriWithColor = (p1, p2, p3) => {
    positions.push(...p1, ...p2, ...p3);
    const cx = (p1[0] + p2[0] + p3[0]) / 3;
    const cy = (p1[1] + p2[1] + p3[1]) / 3;
    const cz = (p1[2] + p2[2] + p3[2]) / 3;
    const c = getLogoFacetColor(cx, cy, cz);
    colors.push(...c, ...c, ...c);
  };

  const top = [0, yTop, 0];
  const bot = [0, yBot, 0];
  const r1 = [], r2 = [], r3 = [];

  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    r1.push([ring1R[i] * Math.cos(a), ring1Y[i], ring1R[i] * Math.sin(a)]);
    r2.push([ring2R[i] * Math.cos(a), ring2Y[i], ring2R[i] * Math.sin(a)]);
    r3.push([ring3R[i] * Math.cos(a), ring3Y[i], ring3R[i] * Math.sin(a)]);
  }

  // 1. Top cone pyramid cap (6 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTriWithColor(top, r1[i], r1[next]);
  }

  // 2. Upper facet belt (12 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTriWithColor(r1[i], r2[i], r1[next]);
    addTriWithColor(r1[next], r2[i], r2[next]);
  }

  // 3. Lower facet belt (12 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTriWithColor(r2[i], r3[i], r2[next]);
    addTriWithColor(r2[next], r3[i], r3[next]);
  }

  // 4. Bottom chisel pyramid cap (6 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTriWithColor(bot, r3[next], r3[i]);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);

  // Live references so Three.js renders in a smooth 60fps loop without canvas resets
  const scrollRef = useRef(scrollProgress);
  const lightModeRef = useRef(isLightMode);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    lightModeRef.current = isLightMode;
  }, [isLightMode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. Construct 3D Faceted Crystal with Exact Logo Vertex Colors
    const crystalGeo = createPure3DCrystalGeometry();

    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(0.95, 0.95, 0.95);
    scene.add(crystalGroup);

    // High-Contrast Cut Gem Material using the Logo's exact per-facet colors:
    // Uses vertexColors so every facet has the exact tone of rare-logo-icon.png
    const outerCrystalMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.08,
      metalness: 0.25,
      flatShading: true // Every facet is razor sharp
    });

    const outerCrystalMesh = new THREE.Mesh(crystalGeo, outerCrystalMat);
    crystalGroup.add(outerCrystalMesh);

    // Razor-Sharp Glowing Edge Ridges (Pure White / Cyan glowing hairlines matching the logo)
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo, 8);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // Subtle Internal Luminous Glow
    const innerGeo = crystalGeo.clone();
    innerGeo.scale(0.5, 0.5, 0.5);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x059669),
      emissiveIntensity: 0.6,
      roughness: 0.2,
      flatShading: true
    });
    const innerCrystalMesh = new THREE.Mesh(innerGeo, innerMat);
    crystalGroup.add(innerCrystalMesh);

    // 3. Cinematic 3D Lighting Setup (High Contrast)
    const ambientLight = new THREE.AmbientLight(0x0a2618, 2.0);
    scene.add(ambientLight);

    // Key Light (Sunlight from Top-Right)
    const goldKeyLight = new THREE.DirectionalLight(0xfef08a, 2.8);
    goldKeyLight.position.set(4, 7, 5);
    scene.add(goldKeyLight);

    // Fill Light (Emerald from Left)
    const emeraldRimLight = new THREE.DirectionalLight(0x10b981, 2.0);
    emeraldRimLight.position.set(-6, -2, 4);
    scene.add(emeraldRimLight);

    // Bottom White Caustic Uplight (Accentuates the bottom glowing tip)
    const bottomWhiteLight = new THREE.PointLight(0xffffff, 2.5, 6);
    bottomWhiteLight.position.set(0, -2.4, 0.8);
    crystalGroup.add(bottomWhiteLight);

    // Internal Core Glow Point Light
    const coreLight = new THREE.PointLight(0x4ade80, 2.0, 7);
    coreLight.position.set(0, 0, 0);
    crystalGroup.add(coreLight);

    // 4. Subtle Tactical Dust Particles
    const particleCount = 45;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(0x4ade80),
      size: 0.04,
      transparent: true,
      opacity: 0.4
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Mouse Tracking & Continuous 60FPS Animation Loop
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

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Gentle floating bob
      const idleY = Math.sin(time * 1.5) * 0.08;

      // Ambient particle drift
      particleSystem.rotation.y = time * 0.03;
      particleSystem.rotation.x = Math.sin(time * 0.4) * 0.02;

      // Internal light subtle pulse
      bottomWhiteLight.intensity = 2.4 + Math.sin(time * 2.5) * 0.3;
      coreLight.intensity = 1.8 + Math.sin(time * 3.0) * 0.3;

      // Current scroll progress
      const p = scrollRef.current;

      // Smooth continuous turntable rotation & banking
      const targetRotY = time * 0.4 + mouseX * 0.4 + p * Math.PI * 2.2;
      const targetRotZ = Math.sin(p * Math.PI) * 0.25 - mouseX * 0.12;
      const targetRotX = 0.15 + Math.sin(p * Math.PI) * 0.2 - mouseY * 0.15;

      // Trajectory translation across scroll sections
      const targetPosX = -Math.sin(p * Math.PI) * 1.4;
      const targetPosY = -0.32 + idleY;
      const targetPosZ = -Math.sin(p * Math.PI) * 0.4;

      // 60FPS Exponential Smoothing (Lerp)
      crystalGroup.rotation.x = THREE.MathUtils.lerp(crystalGroup.rotation.x, targetRotX, 0.06);
      crystalGroup.rotation.y = THREE.MathUtils.lerp(crystalGroup.rotation.y, targetRotY, 0.06);
      crystalGroup.rotation.z = THREE.MathUtils.lerp(crystalGroup.rotation.z, targetRotZ, 0.06);

      crystalGroup.position.x = THREE.MathUtils.lerp(crystalGroup.position.x, targetPosX, 0.06);
      crystalGroup.position.y = THREE.MathUtils.lerp(crystalGroup.position.y, targetPosY, 0.06);
      crystalGroup.position.z = THREE.MathUtils.lerp(crystalGroup.position.z, targetPosZ, 0.06);

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
  }, []); // Run ONLY once on mount

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
