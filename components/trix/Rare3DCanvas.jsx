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

    // 2. Load the Exact Precision Cutout of the Crystal (Image 2 - 100% Zero Black Background)
    const textureLoader = new THREE.TextureLoader();
    const crystalTexture = textureLoader.load('/rare-crystal-pure.png');
    crystalTexture.colorSpace = THREE.SRGBColorSpace;
    crystalTexture.generateMipmaps = true;
    crystalTexture.minFilter = THREE.LinearMipmapLinearFilter;
    crystalTexture.magFilter = THREE.LinearFilter;

    // 3. Volumetric 3D Crystal Assembly (NO CAGE, NO BLACK CIRCLE, PURE CLEAN ARTWORK)
    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(1.15, 1.15, 1.15);
    scene.add(crystalGroup);

    // Plane geometry matching the crystal aspect ratio
    const crystalGeo = new THREE.PlaneGeometry(3.6, 3.6);

    // Exact Crystal Artwork Material
    const crystalMat = new THREE.MeshBasicMaterial({
      map: crystalTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    // Front Crystal Face
    const frontFace = new THREE.Mesh(crystalGeo, crystalMat);
    frontFace.position.z = 0.14;
    crystalGroup.add(frontFace);

    // Mid Refractive Depth Layer (Gives internal optical depth as it turns)
    const midMat = new THREE.MeshBasicMaterial({
      map: crystalTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const midFace = new THREE.Mesh(crystalGeo, midMat);
    midFace.position.z = 0.0;
    midFace.scale.set(0.98, 0.98, 1);
    crystalGroup.add(midFace);

    // Rear Crystal Face (Double-sided 3D thickness when rotating)
    const backFace = new THREE.Mesh(crystalGeo, crystalMat);
    backFace.position.z = -0.14;
    backFace.rotation.y = Math.PI;
    crystalGroup.add(backFace);

    // Subtle 3D Ambient Dust Particles (Floating tactical radar particles)
    const particleCount = 50;
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
      size: 0.045,
      transparent: true,
      opacity: 0.5
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
