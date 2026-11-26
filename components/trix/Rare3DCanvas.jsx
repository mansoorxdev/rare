'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Exact 2D Profile Points Traced from the User's Crystal Image
const CRYSTAL_SHAPE_POINTS = [
  [0.064, 2.0],
  [0.199, 1.886],
  [0.419, 1.552],
  [0.682, 1.126],
  [0.98, 0.7],
  [1.073, 0.558],
  [1.151, 0.487],
  [1.037, 0.202],
  [0.931, -0.082],
  [0.824, -0.366],
  [0.739, -0.65],
  [0.796, -0.934],
  [0.881, -1.29],
  [0.888, -1.361],
  [0.682, -1.503],
  [0.526, -1.645],
  [0.306, -1.787],
  [0.135, -1.929],
  [-0.121, -2.0],
  [-0.327, -1.929],
  [-0.526, -1.787],
  [-0.696, -1.574],
  [-0.81, -1.503],
  [-0.86, -1.361],
  [-0.902, -0.934],
  [-0.966, -0.579],
  [-1.044, -0.082],
  [-1.123, 0.345],
  [-1.151, 0.558],
  [-1.023, 0.771],
  [-0.824, 0.984],
  [-0.583, 1.268],
  [-0.334, 1.552],
  [-0.128, 1.837],
  [0.036, 1.979]
];

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
    camera.position.set(0, 0, 9.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. Load the Exact Crystal Artwork Texture (Aligned to UV Bounds)
    const textureLoader = new THREE.TextureLoader();
    const crystalTexture = textureLoader.load('/rare-crystal-pure.png');
    crystalTexture.colorSpace = THREE.SRGBColorSpace;
    crystalTexture.generateMipmaps = true;
    crystalTexture.minFilter = THREE.LinearMipmapLinearFilter;
    crystalTexture.magFilter = THREE.LinearFilter;

    // 3. Construct TRUE 3D Solid Watertight Volumetric Crystal Mesh
    // (Single solid object with real mineral thickness, NOT 3 flat slices!)
    const crystalShape = new THREE.Shape();
    crystalShape.moveTo(CRYSTAL_SHAPE_POINTS[0][0], CRYSTAL_SHAPE_POINTS[0][1]);
    for (let i = 1; i < CRYSTAL_SHAPE_POINTS.length; i++) {
      crystalShape.lineTo(CRYSTAL_SHAPE_POINTS[i][0], CRYSTAL_SHAPE_POINTS[i][1]);
    }
    crystalShape.closePath();

    // 3D Extrusion with faceted chamfer bevels (creates volumetric mineral crystal body)
    const extrudeSettings = {
      depth: 0.52,
      bevelEnabled: true,
      bevelSegments: 2, // Rounded volumetric bevels matching mineral crystal profile
      bevelSize: 0.24,
      bevelThickness: 0.36
    };

    const crystalGeo = new THREE.ExtrudeGeometry(crystalShape, extrudeSettings);
    crystalGeo.center();

    // Recompute and align UV coordinates for front and back cap faces to match texture
    crystalGeo.computeBoundingBox();
    const bbox = crystalGeo.boundingBox;
    const dx = bbox.max.x - bbox.min.x;
    const dy = bbox.max.y - bbox.min.y;
    const pos = crystalGeo.attributes.position;
    const uvs = crystalGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      uvs.setXY(i, (x - bbox.min.x) / dx, (y - bbox.min.y) / dy);
    }
    uvs.needsUpdate = true;
    crystalGeo.computeVertexNormals();

    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(0.88, 0.88, 0.88);
    scene.add(crystalGroup);

    // Material 0: Front & Back Cap Faces (Shows the Exact High-Res Crystal Artwork)
    const capMat = new THREE.MeshStandardMaterial({
      map: crystalTexture,
      roughness: 0.12,
      metalness: 0.15,
      emissive: new THREE.Color(0x059669),
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    // Material 1: Solid 3D Sides & Bevels (Physical Emerald Mineral Glass with Chiseled Facets)
    const sideMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x047857),
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.12,
      transmission: 0.72,
      ior: 1.62,
      thickness: 2.2,
      specularIntensity: 2.0,
      specularColor: new THREE.Color(0xd1fae5),
      flatShading: true // Gives rugged mineral facet reflections when viewed from the side!
    });

    const solidCrystalMesh = new THREE.Mesh(crystalGeo, [capMat, sideMat]);
    crystalGroup.add(solidCrystalMesh);

    // 4. Cinematic 3D Lighting Setup (Creates dynamic glints as the crystal rotates)
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.8);
    scene.add(ambientLight);

    // Key Light (Top-Left Warm Lime)
    const keyLight = new THREE.DirectionalLight(0xbbf7d0, 3.2);
    keyLight.position.set(-6, 7, 5);
    scene.add(keyLight);

    // Fill Light (Bottom-Right Emerald)
    const fillLight = new THREE.DirectionalLight(0x10b981, 2.2);
    fillLight.position.set(6, -5, 4);
    scene.add(fillLight);

    // Rim Back Light (for silhouette separation)
    const rimLight = new THREE.DirectionalLight(0x22c55e, 1.8);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // Internal Point Light (Pulsating core)
    const pointLight = new THREE.PointLight(0x4ade80, 2.5, 8);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Subtle 3D Ambient Dust Particles (Floating tactical radar particles)
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
      size: 0.045,
      transparent: true,
      opacity: 0.5
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Mouse Tracking & Continuous 3D Loop
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
      const idleY = Math.sin(time * 1.4) * 0.06;

      // Ambient particle drift
      particleSystem.rotation.y = time * 0.03;
      particleSystem.rotation.x = Math.sin(time * 0.4) * 0.02;

      // Read current scroll progress from ref (continuous and jitter-free!)
      const p = scrollRef.current;

      // BUTTERY SMOOTH CONTINUOUS ROTATION ON Y AND Z AXIS:
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
