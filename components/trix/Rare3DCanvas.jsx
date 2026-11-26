'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Assigns exact facet colors matching the official RARE logo (rare-logo-icon.png):
 */
function getLogoFacetColor(cx, cy, cz) {
  if (cy < -1.5 && cz > -0.2) return [0.95, 1.0, 0.96]; // Bottom white tip
  if (cy > 0.6 && cx > 0.05 && cz > -0.3) return [0.82, 0.96, 0.22]; // Top golden facet
  if (cx < -0.25) return [0.01, 0.12, 0.05]; // Left dark obsidian
  if (cz > 0.35 && cy >= -1.5 && cy <= 0.6) return [0.06, 0.94, 0.40]; // Center neon emerald
  if (cx > 0.3) return [0.03, 0.65, 0.28]; // Right cut emerald
  return [0.02, 0.22, 0.09];
}

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

  for (let i = 0; i < 6; i++) addTriWithColor(top, r1[i], r1[(i + 1) % 6]);
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTriWithColor(r1[i], r2[i], r1[next]);
    addTriWithColor(r1[next], r2[i], r2[next]);
  }
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    addTriWithColor(r2[i], r3[i], r2[next]);
    addTriWithColor(r2[next], r3[i], r3[next]);
  }
  for (let i = 0; i < 6; i++) addTriWithColor(bot, r3[(i + 1) % 6], r3[i]);

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

export default function Rare3DCanvas({ scrollProgress = 0, isLightMode = false }) {
  const mountRef = useRef(null);
  const [mode, setMode] = useState('solid'); // Default: 'solid' 3D crystal as requested by user
  const modeRef = useRef(mode);

  const scrollRef = useRef(scrollProgress);
  const lightModeRef = useRef(isLightMode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    lightModeRef.current = isLightMode;
  }, [isLightMode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Offscreen WebGL Renderer (Renders 3D Crystal Scene)
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.2);

    // Offscreen WebGL Canvas for 3D Geometry
    const glRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    glRenderer.setSize(width, height);
    glRenderer.setPixelRatio(1); // 1:1 pixel sampling for ASCII rasterizer
    glRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    glRenderer.toneMappingExposure = 1.4;

    // Visible 2D Terminal Canvas (Renders 60FPS ASCII stream or solid WebGL)
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    mount.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // 2. 3D Crystal Mesh (Balanced scale and position)
    const crystalGeo = createPure3DCrystalGeometry();
    const crystalGroup = new THREE.Group();
    crystalGroup.scale.set(1.02, 1.02, 1.02);
    scene.add(crystalGroup);

    const outerCrystalMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.08,
      metalness: 0.25,
      flatShading: true
    });
    const outerCrystalMesh = new THREE.Mesh(crystalGeo, outerCrystalMat);
    crystalGroup.add(outerCrystalMesh);

    // White glowing wireframe ridges
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo, 8);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edgesMesh);

    // Inner Luminous Core
    const innerGeo = crystalGeo.clone();
    innerGeo.scale(0.5, 0.5, 0.5);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x059669),
      emissiveIntensity: 0.7,
      roughness: 0.2,
      flatShading: true
    });
    const innerCrystalMesh = new THREE.Mesh(innerGeo, innerMat);
    crystalGroup.add(innerCrystalMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a2618, 2.2);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xfef08a, 3.2);
    goldKeyLight.position.set(4, 7, 5);
    scene.add(goldKeyLight);

    const emeraldRimLight = new THREE.DirectionalLight(0x10b981, 2.5);
    emeraldRimLight.position.set(-6, -2, 4);
    scene.add(emeraldRimLight);

    const bottomWhiteLight = new THREE.PointLight(0xffffff, 2.8, 6);
    bottomWhiteLight.position.set(0, -2.4, 0.8);
    crystalGroup.add(bottomWhiteLight);

    const coreLight = new THREE.PointLight(0x4ade80, 2.2, 7);
    coreLight.position.set(0, 0, 0);
    crystalGroup.add(coreLight);

    // Small sampling canvas for ASCII grid
    const asciiSampleCanvas = document.createElement('canvas');
    const asciiSampleCtx = asciiSampleCanvas.getContext('2d');
    const ASCII_CHARS = ' .:-=+*#%@█';
    const CELL_W = 10;
    const CELL_H = 14;

    // Mouse Tracking
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

      const idleY = Math.sin(time * 1.5) * 0.08;
      bottomWhiteLight.intensity = 2.4 + Math.sin(time * 2.5) * 0.4;
      coreLight.intensity = 1.8 + Math.sin(time * 3.0) * 0.3;

      const p = scrollRef.current;
      const targetRotY = time * 0.4 + mouseX * 0.4 + p * Math.PI * 2.2;
      const targetRotZ = Math.sin(p * Math.PI) * 0.25 - mouseX * 0.12;
      const targetRotX = 0.15 + Math.sin(p * Math.PI) * 0.2 - mouseY * 0.15;

      const targetPosX = -Math.sin(p * Math.PI) * 1.4;
      const targetPosY = -0.32 + idleY; // Shifted down for breathing room below the navbar
      const targetPosZ = -Math.sin(p * Math.PI) * 0.4;

      crystalGroup.rotation.x = THREE.MathUtils.lerp(crystalGroup.rotation.x, targetRotX, 0.06);
      crystalGroup.rotation.y = THREE.MathUtils.lerp(crystalGroup.rotation.y, targetRotY, 0.06);
      crystalGroup.rotation.z = THREE.MathUtils.lerp(crystalGroup.rotation.z, targetRotZ, 0.06);

      crystalGroup.position.x = THREE.MathUtils.lerp(crystalGroup.position.x, targetPosX, 0.06);
      crystalGroup.position.y = THREE.MathUtils.lerp(crystalGroup.position.y, targetPosY, 0.06);
      crystalGroup.position.z = THREE.MathUtils.lerp(crystalGroup.position.z, targetPosZ, 0.06);

      // Render 3D Scene
      glRenderer.render(scene, camera);

      // Clear Visible Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (modeRef.current === 'solid') {
        // Mode A: Solid WebGL Render
        ctx.drawImage(glRenderer.domElement, 0, 0);
      } else {
        // Mode B: Cyber Terminal 3D ASCII Stream (Client's choice!)
        const cols = Math.floor(canvas.width / CELL_W);
        const rows = Math.floor(canvas.height / CELL_H);

        if (asciiSampleCanvas.width !== cols || asciiSampleCanvas.height !== rows) {
          asciiSampleCanvas.width = cols;
          asciiSampleCanvas.height = rows;
        }

        asciiSampleCtx.clearRect(0, 0, cols, rows);
        asciiSampleCtx.drawImage(glRenderer.domElement, 0, 0, cols, rows);

        const imgData = asciiSampleCtx.getImageData(0, 0, cols, rows).data;

        // Draw subtle 3D hologram wireframe underneath the ASCII matrix
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.drawImage(glRenderer.domElement, 0, 0);
        ctx.restore();

        // Draw ASCII Matrix on top with glowing phosphor characters
        ctx.font = 'bold 11px monospace';
        ctx.textBaseline = 'top';

        // Draw ASCII Matrix
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) * 4;
            const red = imgData[idx];
            const green = imgData[idx + 1];
            const blue = imgData[idx + 2];
            const alpha = imgData[idx + 3];

            if (alpha < 20) continue; // Skip empty space

            const brightness = 0.299 * red + 0.587 * green + 0.114 * blue;
            if (brightness < 12) continue;

            const charIdx = Math.min(ASCII_CHARS.length - 1, Math.floor((brightness / 255) * (ASCII_CHARS.length - 1)));
            const char = ASCII_CHARS[charIdx];

            // Cyber Phosphor Green Color Mapping
            if (red > 180 && green > 200 && blue < 120) {
              // Golden facet highlight
              ctx.fillStyle = '#facc15';
            } else if (brightness > 210) {
              // Intense white caustics
              ctx.fillStyle = '#ffffff';
            } else if (brightness > 130) {
              // Neon electric emerald
              ctx.fillStyle = '#4ade80';
            } else if (brightness > 60) {
              // Deep matrix emerald
              ctx.fillStyle = '#16a34a';
            } else {
              // Shadow green
              ctx.fillStyle = '#065f46';
            }

            ctx.fillText(char, c * CELL_W, r * CELL_H);
          }
        }

        // Overlay Tactical HUD telemetry around the ASCII crystal
        ctx.fillStyle = '#22c55e';
        ctx.font = '10px monospace';
        const cx = Math.floor(canvas.width / 2);
        const cy = Math.floor(canvas.height / 2);

        // Top HUD Bracket
        ctx.fillText('[ RARE_PROTOCOL // 3D_ASCII_TERMINAL ]', cx - 110, cy - 200);
        // Bottom Telemetry
        const degY = Math.round(((crystalGroup.rotation.y * 180) / Math.PI) % 360);
        ctx.fillText(`BEARING_Y: ${degY.toString().padStart(3, '0')}° // MATRIX: ACTIVE`, cx - 110, cy + 250);
      }
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      glRenderer.setSize(w, h);
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (mount && canvas) {
        mount.removeChild(canvas);
      }
      glRenderer.dispose();
    };
  }, []);

  return (
    <>
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
      {/* Interactive Terminal Toggle Button in Bottom-Left HUD */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '28px',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(4, 18, 8, 0.85)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '6px',
          padding: '6px 10px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          backdropFilter: 'blur(8px)'
        }}
      >
        <span style={{ color: '#86efac' }}>VIEW:</span>
        <button
          type="button"
          onClick={() => setMode('ascii')}
          style={{
            background: mode === 'ascii' ? '#22c55e' : 'transparent',
            color: mode === 'ascii' ? '#000000' : '#86efac',
            fontWeight: mode === 'ascii' ? 900 : 600,
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          [▨ ASCII 3D]
        </button>
        <button
          type="button"
          onClick={() => setMode('solid')}
          style={{
            background: mode === 'solid' ? '#22c55e' : 'transparent',
            color: mode === 'solid' ? '#000000' : '#86efac',
            fontWeight: mode === 'solid' ? 900 : 600,
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          [❖ SOLID 3D]
        </button>
      </div>
    </>
  );
}
