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

  // Keep live references to props so the Three.js loop never tears down or re-creates!
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

    // 2. High-Resolution Texture Loading for the Exact Crystal Artwork
    const textureLoader = new THREE.TextureLoader();
    const crystalTexture = textureLoader.load('/rare-crystal-exact.png');
    crystalTexture.colorSpace = THREE.SRGBColorSpace;
    const crystalNormal = textureLoader.load('/rare-crystal-normal.png');

    // 3. True 3D Volumetric Crystal Assembly
    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(0.88, 0.88, 0.88);
    scene.add(crystalGroup);

    // Front & Back Crystal Plates (Aspect ratio calibrated to exact crystal dimensions)
    const planeGeo = new THREE.PlaneGeometry(3.6, 3.6, 32, 32);

    // Front Master Crystal Facet Material (Exact Artwork + Dynamic Specular Normal Mapping)
    const frontMat = new THREE.MeshStandardMaterial({
      map: crystalTexture,
      normalMap: crystalNormal,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.12,
      metalness: 0.15,
      transparent: true,
      alphaTest: 0.05,
      emissive: new THREE.Color(0x059669),
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    const frontMesh = new THREE.Mesh(planeGeo, frontMat);
    frontMesh.position.z = 0.22;
    crystalGroup.add(frontMesh);

    // Back Symmetrical Crystal Plate (Gives true double-sided 3D thickness)
    const backMesh = new THREE.Mesh(planeGeo, frontMat);
    backMesh.position.z = -0.22;
    backMesh.rotation.y = Math.PI;
    crystalGroup.add(backMesh);

    // Mid-Body 3D Volumetric Faceted Core (Connecting prism with neon cybernetic facet lines)
    const midGeo = new THREE.BufferGeometry();
    midGeo.setAttribute('position', new THREE.BufferAttribute(CRYSTAL_VERTICES, 3));
    midGeo.computeVertexNormals();

    const midMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x064e3b),
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.12,
      transmission: 0.75,
      ior: 1.62,
      thickness: 1.8,
      specularIntensity: 2.0,
      specularColor: new THREE.Color(0xa7f3d0),
      flatShading: true,
      transparent: true,
      opacity: 0.8
    });

    const midMesh = new THREE.Mesh(midGeo, midMat);
    midMesh.scale.set(0.82, 0.82, 0.45);
    crystalGroup.add(midMesh);

    // Neon Cybernetic Facet Edges
    const edgesGeo = new THREE.EdgesGeometry(midGeo, 12);
    const edgesMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4ade80),
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    edgesMesh.scale.set(0.82, 0.82, 0.45);
    crystalGroup.add(edgesMesh);

    // Internal Bioluminescent Core (Nested glowing crystal that glints through the glass)
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x86efac),
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const coreMesh = new THREE.Mesh(midGeo, coreMat);
    coreMesh.scale.set(0.55, 0.55, 0.35);
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

    // 4. Cinematic 3D Lighting Setup (High Specular Glints on Facets)
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.6);
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

      // Gentle floating bob
      const idleY = Math.sin(time * 1.5) * 0.06;

      // Continuous ambient rotation of nested core & particles
      coreMesh.rotation.y = time * 0.8;
      particleSystem.rotation.y = time * 0.04;
      particleSystem.rotation.x = Math.sin(time * 0.5) * 0.03;

      // Read current scroll progress from ref (continuous and jitter-free!)
      const p = scrollRef.current;

      // BUTTERY SMOOTH ROTATION ON Y AND Z AXIS (As requested by user):
      // - Continuous smooth spin on Y-axis (scroll turns it smoothly, like a 3D turntable)
      // - Gentle aerodynamic banking roll on Z-axis
      // - Slight perspective pitch on X-axis without ever cutting off tips
      const targetRotY = time * 0.35 + mouseX * 0.45 + p * Math.PI * 2.5;
      const targetRotZ = Math.sin(p * Math.PI) * 0.32 - mouseX * 0.15;
      const targetRotX = 0.14 + Math.sin(p * Math.PI) * 0.25 - mouseY * 0.2;

      // Smooth trajectory translation across scroll stages
      const targetPosX = -Math.sin(p * Math.PI) * 1.6;
      const targetPosY = 0.08 + idleY;
      const targetPosZ = -Math.sin(p * Math.PI) * 0.5;

      // 60FPS Exponential Smoothing (Lerp) - Eliminates all shivering / stuttering!
      crystalGroup.rotation.x = THREE.MathUtils.lerp(crystalGroup.rotation.x, targetRotX, 0.06);
      crystalGroup.rotation.y = THREE.MathUtils.lerp(crystalGroup.rotation.y, targetRotY, 0.06);
      crystalGroup.rotation.z = THREE.MathUtils.lerp(crystalGroup.rotation.z, targetRotZ, 0.06);

      crystalGroup.position.x = THREE.MathUtils.lerp(crystalGroup.position.x, targetPosX, 0.06);
      crystalGroup.position.y = THREE.MathUtils.lerp(crystalGroup.position.y, targetPosY, 0.06);
      crystalGroup.position.z = THREE.MathUtils.lerp(crystalGroup.position.z, targetPosZ, 0.06);

      // Light mode material adaptation
      if (lightModeRef.current) {
        frontMat.emissive.setHex(0x047857);
        midMat.color.setHex(0x059669);
        edgesMat.color.setHex(0x047857);
      } else {
        frontMat.emissive.setHex(0x059669);
        midMat.color.setHex(0x10b981);
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
