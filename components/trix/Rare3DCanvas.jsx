'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates the authentic asymmetric 3D mineral crystal geometry
 * traced 1:1 from the official RARE artwork (with the right-side notch,
 * high left shoulder, and angled chisel bottom tip).
 * Watertight 3D polyhedron with 30 precise planar facets.
 */
function createAsymmetricCrystalGeo() {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  const addTri = (p1, p2, p3, col) => {
    positions.push(...p1, ...p2, ...p3);
    colors.push(...col, ...col, ...col);
  };

  // Perimeter vertices (forming the exact asymmetric silhouette of the logo)
  const P_top         = [ 0.10,  2.45,  0.00];
  const P_top_right   = [ 0.85,  1.45,  0.00];
  const P_shoulder_r  = [ 1.35,  0.50,  0.00];
  const P_notch_r     = [ 0.65,  0.20,  0.00]; // Inward cut notch on right waist
  const P_hip_r       = [ 0.82, -0.70,  0.00];
  const P_chisel_r    = [ 0.70, -1.45,  0.00];
  const P_bot         = [-0.10, -2.45,  0.00];
  const P_chisel_l    = [-0.75, -1.65,  0.00];
  const P_waist_l     = [-1.10, -0.75,  0.00];
  const P_shoulder_l  = [-1.28,  0.75,  0.00];
  const P_top_left    = [-0.55,  1.55,  0.00];

  // Front center ridge points (protruding outward at Z = +0.55)
  const F_mid_top     = [ 0.02,  0.95,  0.52];
  const F_mid_center  = [ 0.08, -0.15,  0.58];
  const F_mid_bot     = [-0.05, -1.25,  0.48];

  // Back center ridge points (protruding outward at Z = -0.55)
  const B_mid_top     = [ 0.02,  0.95, -0.52];
  const B_mid_center  = [ 0.08, -0.15, -0.58];
  const B_mid_bot     = [-0.05, -1.25, -0.48];

  // Palette matched 1:1 to the official artwork:
  const C_GOLD        = [0.85, 0.96, 0.22]; // Top-right golden sunlight
  const C_OBSIDIAN    = [0.01, 0.10, 0.04]; // Left deep dark emerald shadow
  const C_NEON        = [0.06, 0.94, 0.40]; // Center vibrant neon emerald
  const C_EMERALD     = [0.03, 0.65, 0.28]; // Right cut emerald
  const C_WHITE       = [0.94, 0.99, 0.95]; // Bottom glowing white caustics
  const C_DARK_MID    = [0.02, 0.22, 0.09]; // Back facets deep emerald glass

  // 15 FRONT FACETS:
  addTri(P_top, P_top_right, F_mid_top, C_GOLD);
  addTri(P_top_right, P_shoulder_r, F_mid_top, C_GOLD);
  addTri(P_shoulder_r, P_notch_r, F_mid_center, C_EMERALD);
  addTri(F_mid_top, P_shoulder_r, F_mid_center, C_EMERALD);
  addTri(P_notch_r, P_hip_r, F_mid_center, C_EMERALD);
  addTri(P_hip_r, P_chisel_r, F_mid_bot, C_EMERALD);
  addTri(F_mid_center, P_hip_r, F_mid_bot, C_NEON);
  addTri(P_chisel_r, P_bot, F_mid_bot, C_WHITE);
  addTri(F_mid_bot, P_bot, P_chisel_l, C_WHITE);
  addTri(F_mid_bot, P_chisel_l, P_waist_l, C_OBSIDIAN);
  addTri(F_mid_center, F_mid_bot, P_waist_l, C_NEON);
  addTri(F_mid_center, P_waist_l, P_shoulder_l, C_OBSIDIAN);
  addTri(F_mid_top, F_mid_center, P_shoulder_l, C_OBSIDIAN);
  addTri(F_mid_top, P_shoulder_l, P_top_left, C_OBSIDIAN);
  addTri(P_top, F_mid_top, P_top_left, C_OBSIDIAN);

  // 15 BACK FACETS (mirrored winding for outwards normals):
  addTri(P_top, B_mid_top, P_top_right, C_DARK_MID);
  addTri(P_top_right, B_mid_top, P_shoulder_r, C_DARK_MID);
  addTri(P_shoulder_r, B_mid_center, P_notch_r, C_DARK_MID);
  addTri(B_mid_top, B_mid_center, P_shoulder_r, C_DARK_MID);
  addTri(P_notch_r, B_mid_center, P_hip_r, C_DARK_MID);
  addTri(P_hip_r, B_mid_bot, P_chisel_r, C_DARK_MID);
  addTri(B_mid_center, B_mid_bot, P_hip_r, C_DARK_MID);
  addTri(P_chisel_r, B_mid_bot, P_bot, C_DARK_MID);
  addTri(B_mid_bot, P_chisel_l, P_bot, C_DARK_MID);
  addTri(B_mid_bot, P_waist_l, P_chisel_l, C_DARK_MID);
  addTri(B_mid_center, P_waist_l, B_mid_bot, C_DARK_MID);
  addTri(B_mid_center, P_shoulder_l, P_waist_l, C_DARK_MID);
  addTri(B_mid_top, P_shoulder_l, B_mid_center, C_DARK_MID);
  addTri(B_mid_top, P_top_left, P_shoulder_l, C_DARK_MID);
  addTri(P_top, P_top_left, B_mid_top, C_DARK_MID);

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates the radioactive emerald aura / bloom glow sprite
 * matching the radial glow in Image 1.
 */
function createEmeraldAuraSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
  grad.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
  grad.addColorStop(0.35, 'rgba(16, 185, 129, 0.25)');
  grad.addColorStop(0.65, 'rgba(5, 150, 105, 0.10)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(6.8, 6.8, 1);
  return sprite;
}

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);

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
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // 2. Crystal Group
    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(0.96, 0.96, 0.96);
    scene.add(crystalGroup);

    // Radial Emerald Aura Glow behind the crystal (matches Image 1)
    const aura = createEmeraldAuraSprite();
    aura.position.set(0, 0, -0.3);
    crystalGroup.add(aura);

    // 3. Construct Asymmetric 3D Crystal Geometry
    const crystalGeo = createAsymmetricCrystalGeo();

    // High-Contrast Glossy Material using Vertex Colors
    const crystalMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.05,
      metalness: 0.3,
      flatShading: true
    });

    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystalMesh);

    // Razor-Sharp Glowing Edge Ridges (Pure White hairlines matching Image 1)
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo, 4);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // 4. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x052e16, 2.2);
    scene.add(ambientLight);

    // Key Light (Sunlight from Top-Right on Golden Facet)
    const goldKeyLight = new THREE.DirectionalLight(0xfef08a, 3.5);
    goldKeyLight.position.set(4, 7, 5);
    scene.add(goldKeyLight);

    // Rim Light (Intense Emerald from Left)
    const emeraldRimLight = new THREE.DirectionalLight(0x10b981, 2.5);
    emeraldRimLight.position.set(-6, -2, 4);
    scene.add(emeraldRimLight);

    // Bottom White Caustic Uplight (Accentuates the bottom glowing white chisel tip)
    const bottomWhiteLight = new THREE.PointLight(0xffffff, 3.0, 5);
    bottomWhiteLight.position.set(0, -2.4, 0.6);
    crystalGroup.add(bottomWhiteLight);

    // Subtle Tactical Dust Particles
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

      // Subtle pulse on bottom caustics and aura
      bottomWhiteLight.intensity = 2.8 + Math.sin(time * 2.5) * 0.4;
      aura.scale.set(6.8 + Math.sin(time * 2.0) * 0.3, 6.8 + Math.sin(time * 2.0) * 0.3, 1);

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
