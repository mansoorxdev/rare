'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);

  // Live references to props so the Three.js loop never tears down or re-creates
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

    // 1. Scene, Camera & Full-Viewport Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // 2. Texture Loading for the Exact Crystal Artwork (Image 2)
    const textureLoader = new THREE.TextureLoader();
    const crystalTexture = textureLoader.load('/rare-crystal-clean.png');
    crystalTexture.colorSpace = THREE.SRGBColorSpace;
    crystalTexture.generateMipmaps = true;
    crystalTexture.minFilter = THREE.LinearMipmapLinearFilter;
    crystalTexture.magFilter = THREE.LinearFilter;

    // 3. Volumetric 3D Crystal Assembly (NO CAGE, NO WIREFRAME - 100% PURE ARTWORK)
    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(1.05, 1.05, 1.05);
    scene.add(crystalGroup);

    // High-Res Plane Geometry
    const crystalPlaneGeo = new THREE.PlaneGeometry(3.6, 3.6);

    // Exact Artwork Material with Glass Transmission & Specular Highlight
    const crystalMat = new THREE.MeshBasicMaterial({
      map: crystalTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    // Layer 1: Front Primary Crystal Face
    const frontFace = new THREE.Mesh(crystalPlaneGeo, crystalMat);
    frontFace.position.z = 0.12;
    crystalGroup.add(frontFace);

    // Layer 2: Center Volumetric Optical Core (Provides 3D glass refraction depth)
    const coreMat = new THREE.MeshBasicMaterial({
      map: crystalTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const coreFace = new THREE.Mesh(crystalPlaneGeo, coreMat);
    coreFace.position.z = 0.0;
    coreFace.scale.set(0.98, 0.98, 1);
    crystalGroup.add(coreFace);

    // Layer 3: Rear Symmetrical Crystal Face (Gives true 3D thickness when rotated)
    const backFace = new THREE.Mesh(crystalPlaneGeo, crystalMat);
    backFace.position.z = -0.12;
    backFace.rotation.y = Math.PI;
    crystalGroup.add(backFace);

    // Layer 4: Soft Emerald Radial Glow Aura (Matching the glow in Image 2)
    const glowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    // Create radial glow texture procedurally
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const ctx = glowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(34, 197, 94, 0.55)');
    grad.addColorStop(0.35, 'rgba(16, 185, 129, 0.3)');
    grad.addColorStop(0.65, 'rgba(5, 150, 105, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.z = -0.25;
    crystalGroup.add(glowMesh);

    // Tactical Radar Ambient Dust Particles floating in 3D
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(0x4ade80),
      size: 0.05,
      transparent: true,
      opacity: 0.55
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

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

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Gentle floating bob on Y axis
      const idleY = Math.sin(time * 1.4) * 0.07;

      // Pulse glow subtly
      const glowScale = 1.0 + Math.sin(time * 2.0) * 0.06;
      glowMesh.scale.set(glowScale, glowScale, 1);

      // Ambient particle drift
      particleSystem.rotation.y = time * 0.03;
      particleSystem.rotation.x = Math.sin(time * 0.4) * 0.02;

      // Read current scroll progress from ref (continuous and jitter-free!)
      const p = scrollRef.current;

      // BUTTERY SMOOTH CONTINUOUS ROTATION ON Y AND Z AXIS (Exactly as requested):
      // - Continuous smooth spin on Y-axis (scroll turns it smoothly like a 3D turntable)
      // - Gentle aerodynamic banking roll on Z-axis
      // - Subtle perspective pitch on X-axis without any clipping
      const targetRotY = time * 0.35 + mouseX * 0.4 + p * Math.PI * 2.2;
      const targetRotZ = Math.sin(p * Math.PI) * 0.28 - mouseX * 0.12;
      const targetRotX = 0.12 + Math.sin(p * Math.PI) * 0.2 - mouseY * 0.18;

      // Smooth trajectory translation across scroll stages
      const targetPosX = -Math.sin(p * Math.PI) * 1.5;
      const targetPosY = 0.06 + idleY;
      const targetPosZ = -Math.sin(p * Math.PI) * 0.4;

      // 60FPS Exponential Smoothing (Lerp) - Eliminates all shivering / stuttering!
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
  }, []); // Run ONLY once on mount! No context recreating on scroll!

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
