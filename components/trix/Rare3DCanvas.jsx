'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates an authentic 3D faceted mineral crystal geometry
 * with 36 precise triangular facets, natural facet height variations,
 * and outward-facing normals.
 */
function createPure3DCrystalGeometry() {
  const geo = new THREE.BufferGeometry();
  const yTop = 2.45;
  const yBot = -2.45;

  // Asymmetric crystal facet rings (natural mineral crystal shape)
  const ring1Y = [1.4, 1.15, 1.5, 1.2, 1.45, 1.1];
  const ring1R = [1.05, 1.2, 1.1, 1.25, 1.05, 1.15];

  const ring2Y = [0.05, -0.15, 0.1, -0.1, 0.05, -0.2];
  const ring2R = [1.15, 1.25, 1.2, 1.3, 1.1, 1.2];

  const ring3Y = [-1.3, -1.5, -1.25, -1.45, -1.35, -1.5];
  const ring3R = [0.95, 1.05, 0.9, 1.1, 0.95, 1.0];

  const positions = [];
  const addTri = (p1, p2, p3) => positions.push(...p1, ...p2, ...p3);

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
    addTri(top, r1[i], r1[next]);
  }

  // 2. Upper facet belt (12 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTri(r1[i], r2[i], r1[next]);
    addTri(r1[next], r2[i], r2[next]);
  }

  // 3. Lower facet belt (12 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTri(r2[i], r3[i], r2[next]);
    addTri(r2[next], r3[i], r3[next]);
  }

  // 4. Bottom chisel pyramid cap (6 triangles)
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTri(bot, r3[next], r3[i]);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
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
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    // 2. Construct Genuine 3D Faceted Crystal Polyhedron
    const crystalGeo = createPure3DCrystalGeometry();

    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(0.95, 0.95, 0.95);
    scene.add(crystalGroup);

    // Outer Faceted Crystal Glass Material (Physical Emerald Transmission Glass)
    const outerCrystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.35,
      roughness: 0.05,
      metalness: 0.08,
      transmission: 0.78,
      ior: 1.62,
      thickness: 1.8,
      specularIntensity: 2.2,
      specularColor: new THREE.Color(0xd1fae5),
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      flatShading: true // Every facet catches the light independently like a cut gemstone!
    });

    const outerCrystalMesh = new THREE.Mesh(crystalGeo, outerCrystalMat);
    crystalGroup.add(outerCrystalMesh);

    // Sharp Facet Edge Accents (Delicate glowing hairline borders)
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo, 10);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0.45
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // Inner Luminous Core Gem - True Greenish Golden (Peridot / Chartreuse-Gold)
    const innerGeo = crystalGeo.clone();
    innerGeo.scale(0.56, 0.56, 0.56);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xa3e635), // Vibrant greenish golden (chartreuse gold)
      emissive: new THREE.Color(0x65a30d), // Deep greenish-golden luminescence
      emissiveIntensity: 0.85, // Perfectly balanced to preserve the rich greenish-gold hue
      roughness: 0.15,
      metalness: 0.45, // Metallic golden luster on green base
      flatShading: true
    });
    const innerCrystalMesh = new THREE.Mesh(innerGeo, innerMat);
    crystalGroup.add(innerCrystalMesh);

    // Internal Pulsing Light at the crystal core (Greenish-Golden Light)
    const coreLight = new THREE.PointLight(0xa3e635, 2.0, 8); // Crisp greenish-golden emission
    coreLight.position.set(0, 0, 0);
    crystalGroup.add(coreLight);

    // 3. Cinematic 3D Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.8);
    scene.add(ambientLight);

    // Key Light (Top-Left Greenish-Golden Tint)
    const keyLight = new THREE.DirectionalLight(0xd9f99d, 3.2);
    keyLight.position.set(-6, 7, 5);
    scene.add(keyLight);

    // Fill Light (Bottom-Right Emerald)
    const fillLight = new THREE.DirectionalLight(0x10b981, 2.2);
    fillLight.position.set(6, -5, 4);
    scene.add(fillLight);

    // Rim Back Light (Silhouette separation)
    const rimLight = new THREE.DirectionalLight(0x34d399, 2.4);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

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

      // Internal golden-green light subtle pulse
      coreLight.intensity = 2.0 + Math.sin(time * 3.0) * 0.4;

      // Current scroll progress
      const p = scrollRef.current;

      // Smooth continuous turntable rotation & banking
      const targetRotY = time * 0.4 + mouseX * 0.4 + p * Math.PI * 2.2;
      const targetRotZ = Math.sin(p * Math.PI) * 0.25 - mouseX * 0.12;
      const targetRotX = 0.15 + Math.sin(p * Math.PI) * 0.2 - mouseY * 0.15;

      // Trajectory translation across scroll sections
      const targetPosX = -Math.sin(p * Math.PI) * 1.4;
      const targetPosY = 0.06 + idleY;
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
