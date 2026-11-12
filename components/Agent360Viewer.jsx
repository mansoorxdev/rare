'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * TURNTABLE ASSETS
 * All 4 master angle renders preloaded into offscreen ImageBitmaps.
 * 8 total viewing sectors in 360° space (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°).
 */
const FRAME_CONFIGS = [
  { angle: 0,   src: '/assets/agent/rare_front.jpg',   flip: false, label: 'FRONT 0°' },
  { angle: 45,  src: '/assets/agent/rare_turn_45.jpg', flip: false, label: 'QUARTER 45°' },
  { angle: 90,  src: '/assets/agent/rare_profile.jpg', flip: false, label: 'PROFILE 90°' },
  { angle: 135, src: '/assets/agent/rare_back.jpg',    flip: false, label: 'REAR-Q 135°' },
  { angle: 180, src: '/assets/agent/rare_back.jpg',    flip: false, label: 'REAR 180°' },
  { angle: 225, src: '/assets/agent/rare_back.jpg',    flip: true,  label: 'REAR-Q 225°' },
  { angle: 270, src: '/assets/agent/rare_profile.jpg', flip: true,  label: 'PROFILE 270°' },
  { angle: 315, src: '/assets/agent/rare_turn_45.jpg', flip: true,  label: 'QUARTER 315°' },
];

export default function Agent360Viewer({ agentId = 1, price = 0.02, agentName = 'Solana Emerald Sentry' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // High-performance physics state stored in refs (ZERO React re-renders during 60FPS animation!)
  const stateRef = useRef({
    angle: 0,             // 0 to 360 continuous
    targetAngle: 0,
    velocity: 0,          // Drag inertia momentum
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    isAutoSpin: true,
    loadedImages: {},     // src -> HTMLImageElement
    isReady: false,
  });

  const [angleDisplay, setAngleDisplay] = useState(0);
  const [isAutoSpinState, setIsAutoSpinState] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload all assets immediately
  useEffect(() => {
    const urls = [
      '/assets/agent/rare_front.jpg',
      '/assets/agent/rare_turn_45.jpg',
      '/assets/agent/rare_profile.jpg',
      '/assets/agent/rare_back.jpg',
    ];

    let loadedCount = 0;
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        stateRef.current.loadedImages[url] = img;
        loadedCount += 1;
        setLoadProgress(Math.round((loadedCount / urls.length) * 100));
        if (loadedCount >= urls.length) {
          stateRef.current.isReady = true;
        }
      };
      img.onerror = () => {
        // Fallback to front image if an angle fails
        stateRef.current.loadedImages[url] = stateRef.current.loadedImages['/assets/agent/rare_front.jpg'] || img;
      };
    });
  }, []);

  // 60FPS Canvas Render Loop with Inertia Physics & Continuous Dual-Frame Cross-Dissolve
  useEffect(() => {
    let animId;
    let lastStamp = performance.now();
    let displayThrottle = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const render = (stamp) => {
      const dt = Math.min((stamp - lastStamp) / 1000, 0.1); // clamp delta
      lastStamp = stamp;
      const state = stateRef.current;

      // 1. Physics & Motion Update
      if (state.isDragging) {
        // Handled in pointer move
      } else if (state.isAutoSpin) {
        // Smooth constant rotation (24 deg/s)
        state.angle = (state.angle + dt * 24) % 360;
        if (state.angle < 0) state.angle += 360;
      } else if (Math.abs(state.velocity) > 0.05) {
        // Coasting with inertia friction
        state.angle = (state.angle + state.velocity) % 360;
        if (state.angle < 0) state.angle += 360;
        state.velocity *= 0.93; // smooth deceleration
      } else {
        state.velocity = 0;
      }

      // Throttle React state update for degree HUD to 10 FPS (saves CPU / zero render lag)
      displayThrottle += dt;
      if (displayThrottle > 0.1) {
        displayThrottle = 0;
        setAngleDisplay(Math.round(state.angle));
      }

      // 2. High-DPI Canvas Sizing
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background Parchment Studio fill
      ctx.fillStyle = '#fcfaf4';
      ctx.fillRect(0, 0, width, height);

      // Draw Turntable Base Plinth (Brutalist circular pedestal)
      const centerX = width / 2;
      const centerY = height * 0.82;
      const radiusX = width * 0.38;
      const radiusY = height * 0.10;

      // Shadow underneath pedestal
      ctx.beginPath();
      ctx.ellipse(centerX + 4, centerY + 6, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 43, 223, 0.15)'; // electric blue shadow
      ctx.fill();

      // Pedestal base ring
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#f1ede3';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#18181b';
      ctx.stroke();

      // Pedestal inner indicator track
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX * 0.85, radiusY * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#d5cfc0';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Active rotation notch indicator on pedestal
      const notchRad = (state.angle * Math.PI) / 180;
      const notchX = centerX + Math.cos(notchRad) * (radiusX * 0.85);
      const notchY = centerY + Math.sin(notchRad) * (radiusY * 0.85);
      ctx.beginPath();
      ctx.arc(notchX, notchY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0e2bdf';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // 3. Draw Character Frame with Continuous Dual-Frame Cross-Dissolve
      // Sector calculation: 8 frames, each 45 degrees
      const normAngle = ((state.angle % 360) + 360) % 360;
      const sectorFraction = normAngle / 45;
      const baseIdx = Math.floor(sectorFraction) % 8;
      const nextIdx = (baseIdx + 1) % 8;
      const blendWeight = sectorFraction - Math.floor(sectorFraction); // 0.0 to 1.0

      const frameA = FRAME_CONFIGS[baseIdx];
      const frameB = FRAME_CONFIGS[nextIdx];
      const imgA = state.loadedImages[frameA.src] || state.loadedImages['/assets/agent/rare_front.jpg'];
      const imgB = state.loadedImages[frameB.src] || state.loadedImages['/assets/agent/rare_front.jpg'];

      const drawCharacterImage = (img, flip, alpha) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        // Center position
        const targetH = height * 0.88;
        const aspect = img.naturalWidth / img.naturalHeight;
        const targetW = targetH * aspect;
        const posX = centerX - targetW / 2;
        const posY = centerY - targetH + radiusY * 0.5;

        if (flip) {
          ctx.translate(centerX, centerY);
          ctx.scale(-1, 1);
          ctx.translate(-centerX, -centerY);
        }

        ctx.drawImage(img, posX, posY, targetW, targetH);
        ctx.restore();
      };

      // If both frames are the exact same image (e.g. back to back), draw once without cross-dissolve overhead
      if (imgA && imgB && frameA.src === frameB.src && frameA.flip === frameB.flip) {
        drawCharacterImage(imgA, frameA.flip, 1.0);
      } else {
        // Smooth cross-dissolve blend between current frame and next frame
        if (imgA) drawCharacterImage(imgA, frameA.flip, 1.0 - blendWeight * 0.85);
        if (imgB && blendWeight > 0.05) drawCharacterImage(imgB, frameB.flip, blendWeight);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer Drag Handlers with Velocity Calculation for Momentum
  const handlePointerDown = (e) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.isAutoSpin = false;
    setIsAutoSpinState(false);
    state.velocity = 0;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    state.startX = clientX;
    state.lastX = clientX;
    state.lastTime = performance.now();

    if (e.currentTarget.setPointerCapture && e.pointerId !== undefined) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    const state = stateRef.current;
    if (!state.isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const now = performance.now();
    const deltaX = clientX - state.lastX;
    const dt = Math.max(1, now - state.lastTime);

    // 0.55 deg per pixel sensitivity
    state.angle = (state.angle - deltaX * 0.55) % 360;
    if (state.angle < 0) state.angle += 360;

    // Calculate instantaneous velocity for drag momentum release
    state.velocity = -(deltaX / dt) * 8.5;
    state.velocity = Math.max(-12, Math.min(12, state.velocity)); // clamp

    state.lastX = clientX;
    state.lastTime = now;
  };

  const handlePointerUp = (e) => {
    const state = stateRef.current;
    state.isDragging = false;
    if (e.currentTarget.releasePointerCapture && e.pointerId !== undefined) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  // Quick Preset Snap
  const snapToAngle = (deg) => {
    const state = stateRef.current;
    state.isAutoSpin = false;
    setIsAutoSpinState(false);
    state.velocity = 0;
    state.angle = deg % 360;
  };

  const toggleAutoSpin = () => {
    const state = stateRef.current;
    state.isAutoSpin = !state.isAutoSpin;
    state.velocity = 0;
    setIsAutoSpinState(state.isAutoSpin);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[500px] mx-auto select-none flex flex-col items-center"
      style={{
        background: 'var(--parchment)',
        border: '2px solid var(--hair-dark)',
        boxShadow: '6px 6px 0px 0px var(--script-blue)',
      }}
    >
      {/* Top Tactical Status Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 border-b-2 border-black bg-[#f1ede3] font-mono text-[11px] font-semibold text-black">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-[#10b981] border border-black shadow-[1px_1px_0px_#000]" />
          <span className="font-pixel text-[10px] uppercase tracking-wider">3D TURNTABLE // 60FPS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#0e2bdf] font-bold font-pixel text-[10px]">{angleDisplay}°</span>
          <span className="text-zinc-500">BAND 1/10</span>
        </div>
      </div>

      {/* Main 60FPS HTML5 Canvas Turntable Viewport */}
      <div
        className="relative w-full aspect-square cursor-grab active:cursor-grabbing touch-none flex items-center justify-center overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Floating Hologram Scanline Watermark */}
        <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-0.5 opacity-80">
          <span className="font-pixel text-[9px] text-[#0e2bdf] uppercase font-bold tracking-widest bg-white/80 px-1.5 py-0.5 border border-black">
            SOLANA ANCHOR CPI
          </span>
          <span className="font-mono text-[9px] text-zinc-600 bg-white/80 px-1.5 border border-black">
            TOKEN-BOUND PDA
          </span>
        </div>

        {/* Drag Hint on Initial Hover */}
        <div className="absolute bottom-3 left-3 pointer-events-none font-mono text-[9px] text-zinc-600 bg-white/90 border border-black px-2 py-0.5 shadow-[2px_2px_0px_#000]">
          DRAG TO ROTATE 360°
        </div>

        {/* Play/Pause Float Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleAutoSpin();
          }}
          className="absolute bottom-3 right-3 font-pixel text-[9px] uppercase px-2.5 py-1 bg-white border border-black shadow-[2px_2px_0px_#000] hover:bg-[#0e2bdf] hover:text-white transition-colors"
        >
          {isAutoSpinState ? '■ PAUSE' : '▶ AUTO-SPIN'}
        </button>
      </div>

      {/* Bottom Preset Angle Ribbon */}
      <div className="w-full grid grid-cols-5 border-t-2 border-black bg-[#f1ede3] text-[10px] font-mono divide-x-2 divide-black">
        <button
          type="button"
          onClick={() => snapToAngle(0)}
          className="py-1.5 hover:bg-[#0e2bdf] hover:text-white transition-colors text-center font-bold"
        >
          0° FRONT
        </button>
        <button
          type="button"
          onClick={() => snapToAngle(45)}
          className="py-1.5 hover:bg-[#0e2bdf] hover:text-white transition-colors text-center font-bold"
        >
          45° QTR
        </button>
        <button
          type="button"
          onClick={() => snapToAngle(90)}
          className="py-1.5 hover:bg-[#0e2bdf] hover:text-white transition-colors text-center font-bold"
        >
          90° SIDE
        </button>
        <button
          type="button"
          onClick={() => snapToAngle(180)}
          className="py-1.5 hover:bg-[#0e2bdf] hover:text-white transition-colors text-center font-bold"
        >
          180° REAR
        </button>
        <button
          type="button"
          onClick={() => snapToAngle(270)}
          className="py-1.5 hover:bg-[#0e2bdf] hover:text-white transition-colors text-center font-bold"
        >
          270° SIDE
        </button>
      </div>
    </div>
  );
}
