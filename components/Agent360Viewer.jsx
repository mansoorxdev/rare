'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * TURNTABLE FRAMES (896 x 1200 master studio 3D renders)
 * 8 discrete angles in 360° space (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°).
 */
const FRAME_CONFIGS = [
  { angle: 0,   src: '/assets/agent/rare_front.jpg',   flip: false },
  { angle: 45,  src: '/assets/agent/rare_turn_45.jpg', flip: false },
  { angle: 90,  src: '/assets/agent/rare_profile.jpg', flip: false },
  { angle: 135, src: '/assets/agent/rare_back.jpg',    flip: false },
  { angle: 180, src: '/assets/agent/rare_back.jpg',    flip: false },
  { angle: 225, src: '/assets/agent/rare_back.jpg',    flip: true  },
  { angle: 270, src: '/assets/agent/rare_profile.jpg', flip: true  },
  { angle: 315, src: '/assets/agent/rare_turn_45.jpg', flip: true  },
];

export default function Agent360Viewer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Physics & Animation state kept in refs (ZERO React re-renders during 60FPS animation)
  const stateRef = useRef({
    angle: 0,             // 0 to 360 continuous
    velocity: 0,          // Drag momentum
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    isAutoSpin: true,
    loadedImages: {},
    isReady: false,
  });

  const [angleDisplay, setAngleDisplay] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(true);

  // Preload all 4 master angle assets into memory
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
        if (loadedCount >= urls.length) {
          stateRef.current.isReady = true;
        }
      };
      img.onerror = () => {
        stateRef.current.loadedImages[url] = stateRef.current.loadedImages['/assets/agent/rare_front.jpg'] || img;
      };
    });
  }, []);

  // 60FPS Ultra-Smooth Canvas Render Loop
  useEffect(() => {
    let animId;
    let lastStamp = performance.now();
    let displayThrottle = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const render = (stamp) => {
      const dt = Math.min((stamp - lastStamp) / 1000, 0.1);
      lastStamp = stamp;
      const state = stateRef.current;

      // 1. Motion & Physics
      if (state.isDragging) {
        // Dragged directly in pointer move
      } else if (state.isAutoSpin) {
        state.angle = (state.angle + dt * 26) % 360;
        if (state.angle < 0) state.angle += 360;
      } else if (Math.abs(state.velocity) > 0.05) {
        state.angle = (state.angle + state.velocity) % 360;
        if (state.angle < 0) state.angle += 360;
        state.velocity *= 0.93; // smooth coasting damping
      } else {
        state.velocity = 0;
      }

      // Throttle minimal degree display update to 10 FPS
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

      // Studio Parchment background fill
      ctx.fillStyle = '#fcfaf4';
      ctx.fillRect(0, 0, width, height);

      // 3. Draw ONLY the character in full-bleed (zero card edges, zero platter, zero clutter)
      const normAngle = ((state.angle % 360) + 360) % 360;
      const sectorFraction = normAngle / 45;
      const baseIdx = Math.floor(sectorFraction) % 8;
      const nextIdx = (baseIdx + 1) % 8;
      const blendWeight = sectorFraction - Math.floor(sectorFraction);

      const frameA = FRAME_CONFIGS[baseIdx];
      const frameB = FRAME_CONFIGS[nextIdx];
      const imgA = state.loadedImages[frameA.src] || state.loadedImages['/assets/agent/rare_front.jpg'];
      const imgB = state.loadedImages[frameB.src] || state.loadedImages['/assets/agent/rare_front.jpg'];

      const drawFrame = (img, flip, alpha) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        // Full-bleed fit: image aspect matches canvas perfectly (896x1200)
        if (flip) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();
      };

      // Continuous dual-frame cross-dissolve: completely eliminates 45° stepped jumps
      if (imgA && imgB && frameA.src === frameB.src && frameA.flip === frameB.flip) {
        drawFrame(imgA, frameA.flip, 1.0);
      } else {
        if (imgA) drawFrame(imgA, frameA.flip, 1.0 - blendWeight * 0.9);
        if (imgB && blendWeight > 0.05) drawFrame(imgB, frameB.flip, blendWeight);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer Drag Handlers with Velocity Inertia
  const handlePointerDown = (e) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.isAutoSpin = false;
    setIsAutoSpin(false);
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

    // 0.65 deg per pixel sensitivity
    state.angle = (state.angle - deltaX * 0.65) % 360;
    if (state.angle < 0) state.angle += 360;

    // Calculate instantaneous velocity for release momentum
    state.velocity = -(deltaX / dt) * 9.0;
    state.velocity = Math.max(-14, Math.min(14, state.velocity));

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

  const toggleSpin = (e) => {
    e.stopPropagation();
    const state = stateRef.current;
    state.isAutoSpin = !state.isAutoSpin;
    state.velocity = 0;
    setIsAutoSpin(state.isAutoSpin);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] mx-auto aspect-[896/1200] select-none overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      style={{
        border: '2px solid var(--hair-dark)',
        boxShadow: '4px 4px 0px 0px var(--script-blue)',
        background: '#fcfaf4',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title="Drag to rotate 360° • Click to pause/spin"
    >
      {/* High-Performance Canvas: ONLY the character turns in 360° */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Minimalist Obol-style Angle & Pause Control in bottom corner */}
      <div
        onClick={toggleSpin}
        className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-[#fcfaf4]/90 border border-black text-[11px] font-mono cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#0e2bdf] hover:text-white transition-colors"
      >
        <span className="font-bold tabular-nums">{angleDisplay}°</span>
        <span className="text-[10px] uppercase">{isAutoSpin ? 'pause' : 'spin'}</span>
      </div>
    </div>
  );
}
